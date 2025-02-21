import { useEffect,  memo } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";
import "./Altair.css";

function AltairComponent() {
 
  const { client, connect } = useLiveAPIContext();


  // Handle AI tool calls by mapping them to backend REST API calls.
  useEffect(() => {

    // connect();
    const onToolCall = async (toolCall: ToolCall) => {
      console.log("Received tool call:", toolCall);
      // Process each function call asynchronously.
      const responses = await Promise.all(
        toolCall.functionCalls.map(async (fc) => {
          console.log("Processing tool call:", fc);
          // Return a mock LiveFunctionResponse for now
          return { response: "mockResponse", id: "mockId" };
        })
      );
      // Send responses back after a short delay.
      // setTimeout(() => {
      //   client.sendToolResponse({ responses });
      // }, 200);
    };
  
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);
  
  return (
    <div className="todo-container">
      <h2>Gemini Multimodal Live API Voice to Voice only Agent (NPM Package...) </h2>
      <p>by...omiii</p>
    </div>
  );
}

export const Altair = memo(AltairComponent);

