export type GetAudioContextOptions = AudioContextOptions & {
    id?: string;
};
export declare const audioContext: (options?: GetAudioContextOptions) => Promise<AudioContext>;
export declare const blobToJSON: (blob: Blob) => Promise<unknown>;
export declare function base64ToArrayBuffer(base64: string): ArrayBufferLike;
