import { defaultLiveConfig } from "./defaultLiveConfig";
// import { LiveAPIDynamicConfig } from "../types";
export function createLiveConfig(userConfig) {
    return {
        ...defaultLiveConfig,
        generationConfig: {
            responseModalities: "audio",
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: {
                        voiceName: userConfig.voiceName,
                    },
                },
            },
        },
        systemInstruction: userConfig.systemInstruction,
        tools: userConfig.tools,
    };
}
