var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { audioContext } from "./utils";
import AudioRecordingWorklet from "./worklets/audio-processing";
import VolMeterWorket from "./worklets/vol-meter";
import { createWorketFromSrc } from "./audioworklet-registry";
import EventEmitter from "eventemitter3";
function arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
export class AudioRecorder extends EventEmitter {
    constructor(sampleRate = 16000) {
        super();
        this.sampleRate = sampleRate;
        this.recording = false;
        this.starting = null;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Could not request user media");
            }
            this.starting = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    this.stream = yield navigator.mediaDevices.getUserMedia({ audio: true });
                }
                catch (e) {
                    console.error(e);
                    alert("Please allow microphone access to record audio");
                    reject(e);
                    return;
                }
                this.audioContext = yield audioContext({ sampleRate: this.sampleRate });
                this.source = this.audioContext.createMediaStreamSource(this.stream);
                const workletName = "audio-recorder-worklet";
                const src = createWorketFromSrc(workletName, AudioRecordingWorklet);
                yield this.audioContext.audioWorklet.addModule(src);
                this.recordingWorklet = new AudioWorkletNode(this.audioContext, workletName);
                this.recordingWorklet.port.onmessage = (ev) => __awaiter(this, void 0, void 0, function* () {
                    // worklet processes recording floats and messages converted buffer
                    const arrayBuffer = ev.data.data.int16arrayBuffer;
                    if (arrayBuffer) {
                        const arrayBufferString = arrayBufferToBase64(arrayBuffer);
                        this.emit("data", arrayBufferString);
                    }
                });
                this.source.connect(this.recordingWorklet);
                // vu meter worklet
                const vuWorkletName = "vu-meter";
                yield this.audioContext.audioWorklet.addModule(createWorketFromSrc(vuWorkletName, VolMeterWorket));
                this.vuWorklet = new AudioWorkletNode(this.audioContext, vuWorkletName);
                this.vuWorklet.port.onmessage = (ev) => {
                    this.emit("volume", ev.data.volume);
                };
                this.source.connect(this.vuWorklet);
                this.recording = true;
                resolve();
                this.starting = null;
            }));
        });
    }
    stop() {
        // its plausible that stop would be called before start completes
        // such as if the websocket immediately hangs up
        const handleStop = () => {
            var _a, _b;
            (_a = this.source) === null || _a === void 0 ? void 0 : _a.disconnect();
            (_b = this.stream) === null || _b === void 0 ? void 0 : _b.getTracks().forEach((track) => track.stop());
            this.stream = undefined;
            this.recordingWorklet = undefined;
            this.vuWorklet = undefined;
        };
        if (this.starting) {
            this.starting.then(handleStop);
            return;
        }
        handleStop();
    }
}
//# sourceMappingURL=audio-recorder.js.map