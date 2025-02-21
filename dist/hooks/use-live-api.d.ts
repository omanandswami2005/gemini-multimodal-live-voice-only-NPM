import { MultimodalLiveAPIClientConnection, MultimodalLiveClient } from "../lib/multimodal-live-client";
import { LiveConfig, LiveAPIDynamicConfig } from "../multimodal-live-types";
export type UseLiveAPIResults = {
    client: MultimodalLiveClient;
    setConfig: (config: LiveConfig) => void;
    config: LiveConfig;
    connected: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    volume: number;
    muted: boolean;
    mute: () => void;
    unmute: () => void;
};
export declare function useLiveAPI({ apiKey, url, dynamicConfig, }: Omit<MultimodalLiveAPIClientConnection, "url"> & {
    url?: string;
    dynamicConfig?: LiveAPIDynamicConfig;
}): UseLiveAPIResults;
