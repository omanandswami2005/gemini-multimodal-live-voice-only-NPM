import EventEmitter from "eventemitter3";
export declare class AudioRecorder extends EventEmitter {
    sampleRate: number;
    stream: MediaStream | undefined;
    audioContext: AudioContext | undefined;
    source: MediaStreamAudioSourceNode | undefined;
    recording: boolean;
    recordingWorklet: AudioWorkletNode | undefined;
    vuWorklet: AudioWorkletNode | undefined;
    private starting;
    constructor(sampleRate?: number);
    start(): Promise<void>;
    stop(): void;
}
