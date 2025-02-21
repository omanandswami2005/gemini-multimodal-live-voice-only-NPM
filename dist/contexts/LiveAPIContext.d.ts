import { FC, ReactNode } from "react";
import { UseLiveAPIResults } from "../hooks/use-live-api";
import { LiveAPIDynamicConfig } from "../multimodal-live-types";
export type LiveAPIProviderProps = {
    children: ReactNode;
    apiKey: string;
    url?: string;
    dynamicConfig?: LiveAPIDynamicConfig;
};
export declare const LiveAPIProvider: FC<LiveAPIProviderProps>;
export declare const useLiveAPIContext: () => UseLiveAPIResults;
