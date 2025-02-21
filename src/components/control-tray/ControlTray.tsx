
import cn from "classnames";

import React, { memo, ReactNode } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import AudioPulse from "../audio-pulse/AudioPulse";
import "./control-tray.css";

export type ControlTrayProps = {
  children?: ReactNode;
};



function ControlTray({
   children,
}: ControlTrayProps) {

 
  const { connected, connect, disconnect, volume, muted, unmute, mute } =
    useLiveAPIContext();

  return (
    <section className="control-tray">
      <canvas style={{ display: "none" }} />
      <nav className={cn("actions-nav", { disabled: !connected })}>
        <button
          className={cn("action-button mic-button")}
          onClick={() => muted ? unmute() : mute()}
        >
          {!muted ? (
            <span className="material-symbols-outlined filled">mic</span>
          ) : (
            <span className="material-symbols-outlined filled">mic_off</span>
          )}
        </button>

        <div className="action-button no-action outlined">
          <AudioPulse volume={volume} active={connected} hover={false} />
        </div>

        {children}
      </nav>

      <div className={cn("connection-container", { connected })}>
        <div className="connection-button-container">
          <button
            className={cn("action-button connect-toggle", { connected })}
            onClick={connected ? disconnect : connect}
          >
            <span className="material-symbols-outlined filled">
              {connected ? "pause" : "play_arrow"}
            </span>
          </button>
        </div>
        <span className="text-indicator">Streaming</span>
      </div>
    </section>
  );
}

export default memo(ControlTray);
