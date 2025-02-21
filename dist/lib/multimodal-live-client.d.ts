import { GenerativeContentBlob, Part } from "@google/generative-ai";
import { EventEmitter } from "eventemitter3";
import { ServerContent, StreamingLog, ToolCall, ToolCallCancellation, ToolResponseMessage, type LiveConfig } from "../multimodal-live-types";
/**
 * the events that this client will emit
 */
interface MultimodalLiveClientEventTypes {
    open: () => void;
    log: (log: StreamingLog) => void;
    close: (event: CloseEvent) => void;
    audio: (data: ArrayBuffer) => void;
    content: (data: ServerContent) => void;
    interrupted: () => void;
    setupcomplete: () => void;
    turncomplete: () => void;
    toolcall: (toolCall: ToolCall) => void;
    toolcallcancellation: (toolcallCancellation: ToolCallCancellation) => void;
}
export type MultimodalLiveAPIClientConnection = {
    url?: string;
    apiKey: string;
};
/**
 * A event-emitting class that manages the connection to the websocket and emits
 * events to the rest of the application.
 * If you dont want to use react you can still use this.
 */
export declare class MultimodalLiveClient extends EventEmitter<MultimodalLiveClientEventTypes> {
    ws: WebSocket | null;
    protected config: LiveConfig | null;
    url: string;
    getConfig(): {
        model?: string | undefined;
        systemInstruction?: {
            parts: Part[];
        };
        generationConfig?: Partial<import("../multimodal-live-types").LiveGenerationConfig>;
        tools?: Array<import("@google/generative-ai").Tool | {
            googleSearch: {};
        } | {
            codeExecution: {};
        }>;
    };
    constructor({ url, apiKey }: MultimodalLiveAPIClientConnection);
    log(type: string, message: StreamingLog["message"]): void;
    connect(config: LiveConfig): Promise<boolean>;
    disconnect(ws?: WebSocket): boolean;
    protected receive(blob: Blob): Promise<void>;
    /**
     * send realtimeInput, this is base64 chunks of "audio/pcm" and/or "image/jpg"
     */
    sendRealtimeInput(chunks: GenerativeContentBlob[]): void;
    /**
     *  send a response to a function call and provide the id of the functions you are responding to
     */
    sendToolResponse(toolResponse: ToolResponseMessage["toolResponse"]): void;
    /**
     * send normal content parts such as { text }
     */
    send(parts: Part | Part[], turnComplete?: boolean): void;
    /**
     *  used internally to send all messages
     *  don't use directly unless trying to send an unsupported message type
     */
    _sendDirect(request: object): void;
}
export {};
