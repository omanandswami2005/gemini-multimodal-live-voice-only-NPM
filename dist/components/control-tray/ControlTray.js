import cn from "classnames";
import React, { memo } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import AudioPulse from "../audio-pulse/AudioPulse";
import "./control-tray.css";
function ControlTray({ children, }) {
    const { connected, connect, disconnect, volume, muted, unmute, mute } = useLiveAPIContext();
    return (React.createElement("section", { className: "control-tray" },
        React.createElement("canvas", { style: { display: "none" } }),
        React.createElement("nav", { className: cn("actions-nav", { disabled: !connected }) },
            React.createElement("button", { className: cn("action-button mic-button"), onClick: () => muted ? unmute() : mute() }, !muted ? (React.createElement("span", { className: "material-symbols-outlined filled" }, "mic")) : (React.createElement("span", { className: "material-symbols-outlined filled" }, "mic_off"))),
            React.createElement("div", { className: "action-button no-action outlined" },
                React.createElement(AudioPulse, { volume: volume, active: connected, hover: false })),
            children),
        React.createElement("div", { className: cn("connection-container", { connected }) },
            React.createElement("div", { className: "connection-button-container" },
                React.createElement("button", { className: cn("action-button connect-toggle", { connected }), onClick: connected ? disconnect : connect },
                    React.createElement("span", { className: "material-symbols-outlined filled" }, connected ? "pause" : "play_arrow"))),
            React.createElement("span", { className: "text-indicator" }, "Streaming"))));
}
export default memo(ControlTray);
//# sourceMappingURL=ControlTray.js.map