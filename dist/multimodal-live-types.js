// Type-Guards
const prop = (a, prop, kind = "object") => typeof a === "object" && typeof a[prop] === "object";
// outgoing messages
export const isSetupMessage = (a) => prop(a, "setup");
export const isClientContentMessage = (a) => prop(a, "clientContent");
export const isRealtimeInputMessage = (a) => prop(a, "realtimeInput");
export const isToolResponseMessage = (a) => prop(a, "toolResponse");
// incoming messages
export const isSetupCompleteMessage = (a) => prop(a, "setupComplete");
export const isServerContentMessage = (a) => prop(a, "serverContent");
export const isToolCallMessage = (a) => prop(a, "toolCall");
export const isToolCallCancellationMessage = (a) => prop(a, "toolCallCancellation") &&
    isToolCallCancellation(a.toolCallCancellation);
export const isModelTurn = (a) => typeof a.modelTurn === "object";
export const isTurnComplete = (a) => typeof a.turnComplete === "boolean";
export const isInterrupted = (a) => a.interrupted;
export function isToolCall(value) {
    if (!value || typeof value !== "object")
        return false;
    const candidate = value;
    return (Array.isArray(candidate.functionCalls) &&
        candidate.functionCalls.every((call) => isLiveFunctionCall(call)));
}
export function isToolResponse(value) {
    if (!value || typeof value !== "object")
        return false;
    const candidate = value;
    return (Array.isArray(candidate.functionResponses) &&
        candidate.functionResponses.every((resp) => isLiveFunctionResponse(resp)));
}
export function isLiveFunctionCall(value) {
    if (!value || typeof value !== "object")
        return false;
    const candidate = value;
    return (typeof candidate.name === "string" &&
        typeof candidate.id === "string" &&
        typeof candidate.args === "object" &&
        candidate.args !== null);
}
export function isLiveFunctionResponse(value) {
    if (!value || typeof value !== "object")
        return false;
    const candidate = value;
    return (typeof candidate.response === "object" && typeof candidate.id === "string");
}
export const isToolCallCancellation = (a) => typeof a === "object" && Array.isArray(a.ids);
//# sourceMappingURL=multimodal-live-types.js.map