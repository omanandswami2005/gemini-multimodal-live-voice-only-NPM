export declare class AudioStreamer {
    context: AudioContext;
    audioQueue: Float32Array[];
    private isPlaying;
    private sampleRate;
    private bufferSize;
    private processingBuffer;
    private scheduledTime;
    gainNode: GainNode;
    source: AudioBufferSourceNode;
    private isStreamComplete;
    private checkInterval;
    private initialBufferTime;
    private endOfQueueAudioSource;
    onComplete: () => void;
    constructor(context: AudioContext);
    addWorklet<T extends (d: any) => void>(workletName: string, workletSrc: string, handler: T): Promise<this>;
    addPCM16(chunk: Uint8Array): void;
    private createAudioBuffer;
    private scheduleNextBuffer;
    stop(): void;
    resume(): Promise<void>;
    complete(): void;
}
