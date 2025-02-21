export type WorkletGraph = {
    node?: AudioWorkletNode;
    handlers: Array<(this: MessagePort, ev: MessageEvent) => any>;
};
export declare const registeredWorklets: Map<AudioContext, Record<string, WorkletGraph>>;
export declare const createWorketFromSrc: (workletName: string, workletSrc: string) => string;
