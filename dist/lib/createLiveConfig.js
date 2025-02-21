import { defaultLiveConfig } from "./defaultLiveConfig";
// import { LiveAPIDynamicConfig } from "../types";
export function createLiveConfig(userConfig) {
    return Object.assign(Object.assign({}, defaultLiveConfig), { generationConfig: {
            responseModalities: "audio",
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: {
                        voiceName: userConfig.voiceName,
                    },
                },
            },
        }, systemInstruction: userConfig.systemInstruction, tools: userConfig.tools });
}
//# sourceMappingURL=createLiveConfig.js.map