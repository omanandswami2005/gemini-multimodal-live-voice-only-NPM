// defaultLiveConfig.ts
import { LiveConfig } from "../multimodal-live-types";

export const defaultLiveConfig: Omit<LiveConfig, "generationConfig" | "systemInstruction" | "tools"> = {
  model: "models/gemini-2.0-flash-exp",
};
