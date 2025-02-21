import type { Content, FunctionCall, GenerationConfig, GenerativeContentBlob, Part, Tool } from "@google/generative-ai";
export type LiveConfig = {
    model: string;
    systemInstruction?: {
        parts: Part[];
    };
    generationConfig?: Partial<LiveGenerationConfig>;
    tools?: Array<Tool | {
        googleSearch: {};
    } | {
        codeExecution: {};
    }>;
};
export type LiveAPIDynamicConfig = {
    voiceName: string;
    systemInstruction: {
        parts: {
            text: string;
        }[];
    };
    tools: any[];
};
export type LiveGenerationConfig = GenerationConfig & {
    responseModalities: "text" | "audio" | "image";
    speechConfig?: {
        voiceConfig?: {
            prebuiltVoiceConfig?: {
                voiceName: "Puck" | "Charon" | "Kore" | "Fenrir" | "Aoede" | string;
            };
        };
    };
};
export type LiveOutgoingMessage = SetupMessage | ClientContentMessage | RealtimeInputMessage | ToolResponseMessage;
export type SetupMessage = {
    setup: LiveConfig;
};
export type ClientContentMessage = {
    clientContent: {
        turns: Content[];
        turnComplete: boolean;
    };
};
export type RealtimeInputMessage = {
    realtimeInput: {
        mediaChunks: GenerativeContentBlob[];
    };
};
export type ToolResponseMessage = {
    toolResponse: {
        functionResponses: LiveFunctionResponse[];
    };
};
export type ToolResponse = ToolResponseMessage["toolResponse"];
export type LiveFunctionResponse = {
    response: object;
    id: string;
};
/** Incoming types */
export type LiveIncomingMessage = ToolCallCancellationMessage | ToolCallMessage | ServerContentMessage | SetupCompleteMessage;
export type SetupCompleteMessage = {
    setupComplete: {};
};
export type ServerContentMessage = {
    serverContent: ServerContent;
};
export type ServerContent = ModelTurn | TurnComplete | Interrupted;
export type ModelTurn = {
    modelTurn: {
        parts: Part[];
    };
};
export type TurnComplete = {
    turnComplete: boolean;
};
export type Interrupted = {
    interrupted: true;
};
export type ToolCallCancellationMessage = {
    toolCallCancellation: {
        ids: string[];
    };
};
export type ToolCallCancellation = ToolCallCancellationMessage["toolCallCancellation"];
export type ToolCallMessage = {
    toolCall: ToolCall;
};
export type LiveFunctionCall = FunctionCall & {
    id: string;
};
/**
 * A `toolCall` message
 */
export type ToolCall = {
    functionCalls: LiveFunctionCall[];
};
/** log types */
export type StreamingLog = {
    date: Date;
    type: string;
    count?: number;
    message: string | LiveOutgoingMessage | LiveIncomingMessage;
};
export declare const isSetupMessage: (a: unknown) => a is SetupMessage;
export declare const isClientContentMessage: (a: unknown) => a is ClientContentMessage;
export declare const isRealtimeInputMessage: (a: unknown) => a is RealtimeInputMessage;
export declare const isToolResponseMessage: (a: unknown) => a is ToolResponseMessage;
export declare const isSetupCompleteMessage: (a: unknown) => a is SetupCompleteMessage;
export declare const isServerContentMessage: (a: any) => a is ServerContentMessage;
export declare const isToolCallMessage: (a: any) => a is ToolCallMessage;
export declare const isToolCallCancellationMessage: (a: unknown) => a is ToolCallCancellationMessage;
export declare const isModelTurn: (a: any) => a is ModelTurn;
export declare const isTurnComplete: (a: any) => a is TurnComplete;
export declare const isInterrupted: (a: any) => a is Interrupted;
export declare function isToolCall(value: unknown): value is ToolCall;
export declare function isToolResponse(value: unknown): value is ToolResponse;
export declare function isLiveFunctionCall(value: unknown): value is LiveFunctionCall;
export declare function isLiveFunctionResponse(value: unknown): value is LiveFunctionResponse;
export declare const isToolCallCancellation: (a: unknown) => a is ToolCallCancellationMessage["toolCallCancellation"];
