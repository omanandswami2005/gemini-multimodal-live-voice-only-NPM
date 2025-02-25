import { EventEmitter } from "eventemitter3";
import { difference } from "lodash";
import { isInterrupted, isModelTurn, isServerContentMessage, isSetupCompleteMessage, isToolCallCancellationMessage, isToolCallMessage, isTurnComplete, } from "../multimodal-live-types";
import { blobToJSON, base64ToArrayBuffer } from "./utils";
/**
 * A event-emitting class that manages the connection to the websocket and emits
 * events to the rest of the application.
 * If you dont want to use react you can still use this.
 */
export class MultimodalLiveClient extends EventEmitter {
    getConfig() {
        return Object.assign({}, this.config);
    }
    constructor({ url, apiKey }) {
        super();
        this.ws = null;
        this.config = null;
        this.url = "";
        url =
            url ||
                `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;
        url += `?key=${apiKey}`;
        this.url = url;
        this.send = this.send.bind(this);
    }
    log(type, message) {
        const log = {
            date: new Date(),
            type,
            message,
        };
        this.emit("log", log);
    }
    connect(config) {
        this.config = config;
        const ws = new WebSocket(this.url);
        ws.addEventListener("message", async (evt) => {
            if (evt.data instanceof Blob) {
                this.receive(evt.data);
            }
            else {
                console.log("non blob message", evt);
            }
        });
        return new Promise((resolve, reject) => {
            const onError = (ev) => {
                this.disconnect(ws);
                const message = `Could not connect to "${this.url}"`;
                this.log(`server.${ev.type}`, message);
                reject(new Error(message));
            };
            ws.addEventListener("error", onError);
            ws.addEventListener("open", (ev) => {
                if (!this.config) {
                    reject("Invalid config sent to `connect(config)`");
                    return;
                }
                this.log(`client.${ev.type}`, `connected to socket`);
                this.emit("open");
                this.ws = ws;
                const setupMessage = {
                    setup: this.config,
                };
                this._sendDirect(setupMessage);
                this.log("client.send", "setup");
                ws.removeEventListener("error", onError);
                ws.addEventListener("close", (ev) => {
                    console.log(ev);
                    this.disconnect(ws);
                    let reason = ev.reason || "";
                    if (reason.toLowerCase().includes("error")) {
                        const prelude = "ERROR]";
                        const preludeIndex = reason.indexOf(prelude);
                        if (preludeIndex > 0) {
                            reason = reason.slice(preludeIndex + prelude.length + 1, Infinity);
                        }
                    }
                    this.log(`server.${ev.type}`, `disconnected ${reason ? `with reason: ${reason}` : ``}`);
                    this.emit("close", ev);
                });
                resolve(true);
            });
        });
    }
    disconnect(ws) {
        // could be that this is an old websocket and theres already a new instance
        // only close it if its still the correct reference
        if ((!ws || this.ws === ws) && this.ws) {
            this.ws.close();
            this.ws = null;
            this.log("client.close", `Disconnected`);
            return true;
        }
        return false;
    }
    async receive(blob) {
        const response = (await blobToJSON(blob));
        if (isToolCallMessage(response)) {
            this.log("server.toolCall", response);
            this.emit("toolcall", response.toolCall);
            return;
        }
        if (isToolCallCancellationMessage(response)) {
            this.log("receive.toolCallCancellation", response);
            this.emit("toolcallcancellation", response.toolCallCancellation);
            return;
        }
        if (isSetupCompleteMessage(response)) {
            this.log("server.send", "setupComplete");
            this.emit("setupcomplete");
            return;
        }
        // this json also might be `contentUpdate { interrupted: true }`
        // or contentUpdate { end_of_turn: true }
        if (isServerContentMessage(response)) {
            const { serverContent } = response;
            if (isInterrupted(serverContent)) {
                this.log("receive.serverContent", "interrupted");
                this.emit("interrupted");
                return;
            }
            if (isTurnComplete(serverContent)) {
                this.log("server.send", "turnComplete");
                this.emit("turncomplete");
                //plausible theres more to the message, continue
            }
            if (isModelTurn(serverContent)) {
                let parts = serverContent.modelTurn.parts;
                // when its audio that is returned for modelTurn
                const audioParts = parts.filter((p) => p.inlineData && p.inlineData.mimeType.startsWith("audio/pcm"));
                const base64s = audioParts.map((p) => { var _a; return (_a = p.inlineData) === null || _a === void 0 ? void 0 : _a.data; });
                // strip the audio parts out of the modelTurn
                const otherParts = difference(parts, audioParts);
                console.log("otherParts", otherParts);
                base64s.forEach((b64) => {
                    if (b64) {
                        const data = base64ToArrayBuffer(b64);
                        this.emit("audio", data);
                        this.log(`server.audio`, `buffer (${data.byteLength})`);
                    }
                });
                if (!otherParts.length) {
                    return;
                }
                parts = otherParts;
                const content = { modelTurn: { parts } };
                this.emit("content", content);
                this.log(`server.content`, response);
            }
        }
        else {
            console.log("received unmatched message", response);
        }
    }
    /**
     * send realtimeInput, this is base64 chunks of "audio/pcm" and/or "image/jpg"
     */
    sendRealtimeInput(chunks) {
        let hasAudio = false;
        let hasVideo = false;
        for (let i = 0; i < chunks.length; i++) {
            const ch = chunks[i];
            if (ch.mimeType.includes("audio")) {
                hasAudio = true;
            }
            if (ch.mimeType.includes("image")) {
                hasVideo = true;
            }
            if (hasAudio && hasVideo) {
                break;
            }
        }
        const message = hasAudio && hasVideo
            ? "audio + video"
            : hasAudio
                ? "audio"
                : hasVideo
                    ? "video"
                    : "unknown";
        const data = {
            realtimeInput: {
                mediaChunks: chunks,
            },
        };
        this._sendDirect(data);
        this.log(`client.realtimeInput`, message);
    }
    /**
     *  send a response to a function call and provide the id of the functions you are responding to
     */
    sendToolResponse(toolResponse) {
        const message = {
            toolResponse,
        };
        this._sendDirect(message);
        this.log(`client.toolResponse`, message);
    }
    /**
     * send normal content parts such as { text }
     */
    send(parts, turnComplete = true) {
        parts = Array.isArray(parts) ? parts : [parts];
        const content = {
            role: "user",
            parts,
        };
        const clientContentRequest = {
            clientContent: {
                turns: [content],
                turnComplete,
            },
        };
        this._sendDirect(clientContentRequest);
        this.log(`client.send`, clientContentRequest);
    }
    /**
     *  used internally to send all messages
     *  don't use directly unless trying to send an unsupported message type
     */
    _sendDirect(request) {
        if (!this.ws) {
            throw new Error("WebSocket is not connected");
        }
        const str = JSON.stringify(request);
        this.ws.send(str);
    }
}
