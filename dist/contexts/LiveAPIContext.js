import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { useLiveAPI } from "../hooks/use-live-api";
const LiveAPIContext = createContext(undefined);
export const LiveAPIProvider = ({ apiKey, dynamicConfig, children, url }) => {
    const liveAPI = useLiveAPI({ apiKey, url, dynamicConfig });
    return (_jsx(LiveAPIContext.Provider, { value: liveAPI, children: children }));
};
export const useLiveAPIContext = () => {
    const context = useContext(LiveAPIContext);
    if (!context) {
        throw new Error("useLiveAPIContext must be used within a LiveAPIProvider");
    }
    return context;
};
