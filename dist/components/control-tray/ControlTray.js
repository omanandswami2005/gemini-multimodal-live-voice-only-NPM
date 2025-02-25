import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./control-tray.css";
import cn from "classnames";
import { memo } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import AudioPulse from "../audio-pulse/AudioPulse";
function ControlTray({ children, }) {
    const { connected, connect, disconnect, volume, muted, unmute, mute } = useLiveAPIContext();
    return (_jsxs("section", { className: "control-tray", children: [_jsx("canvas", { style: { display: "none" } }), _jsxs("nav", { className: cn("actions-nav", { disabled: !connected }), children: [_jsx("button", { className: cn("action-button mic-button"), onClick: () => muted ? unmute() : mute(), children: !muted ? (_jsx("span", { className: "material-symbols-outlined filled", children: "mic" })) : (_jsx("span", { className: "material-symbols-outlined filled", children: "mic_off" })) }), _jsx("div", { className: "action-button no-action outlined", children: _jsx(AudioPulse, { volume: volume, active: connected, hover: false }) }), children] }), _jsxs("div", { className: cn("connection-container", { connected }), children: [_jsx("div", { className: "connection-button-container", children: _jsx("button", { className: cn("action-button connect-toggle", { connected }), onClick: connected ? disconnect : connect, children: _jsx("span", { className: "material-symbols-outlined filled", children: connected ? "pause" : "play_arrow" }) }) }), _jsx("span", { className: "text-indicator", children: "Streaming" })] })] }));
}
export default memo(ControlTray);
