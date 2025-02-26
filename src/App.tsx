// import "./App.css";
import React from "react";
import { LiveAPIProvider } from "gemini-multimodal-live-voice-only";
import { ControlTray } from "gemini-multimodal-live-voice-only";
import 'gemini-multimodal-live-voice-only/dist/gemini-multimodal-live-voice-only.css';

// const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
// if (typeof API_KEY !== "string") {
//   throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
// }

function App() {
  return (
    <div className="App">
      <LiveAPIProvider apiKey={"AIzaSyDMV1Lq3SAWeaxromOag8vlJtOqKnOHqa4"}>
        <div className="streaming-console">
          <main>
            <div className="main-app-area"></div>
            <ControlTray  />
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
