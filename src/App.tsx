import "./App.css";
import React from "react";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import ControlTray from "./components/control-tray/ControlTray";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}


function App() {
  
  return (
    <div className="App">
      <LiveAPIProvider apiKey={API_KEY}>
        <div className="streaming-console">
          <main>
            <div className="main-app-area">
              
            </div>
            <ControlTray />
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
