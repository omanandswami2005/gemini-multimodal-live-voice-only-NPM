import React, { createContext, FC, ReactNode, useContext } from "react";
import { useLiveAPI, UseLiveAPIResults } from "../hooks/use-live-api";
import { LiveAPIDynamicConfig } from "../multimodal-live-types";

const LiveAPIContext = createContext<UseLiveAPIResults | undefined>(undefined);

export type LiveAPIProviderProps = {
  children: ReactNode;
  apiKey: string; // Only required prop
  url?: string;
  dynamicConfig?: LiveAPIDynamicConfig; // required fields: voiceName, systemInstruction, tools

  
};

export const LiveAPIProvider: FC<LiveAPIProviderProps> = ({ apiKey, dynamicConfig, children, url }) => {
  const liveAPI = useLiveAPI({ apiKey, url, dynamicConfig });

  return (
    <LiveAPIContext.Provider value={liveAPI}>
      {children}
    </LiveAPIContext.Provider>
  );
};

export const useLiveAPIContext = () => {
  const context = useContext(LiveAPIContext);
  if (!context) {
    throw new Error("useLiveAPIContext must be used within a LiveAPIProvider");
  }
  return context;
};
