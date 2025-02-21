import "./audio-pulse.css";
import React from "react";
import { useEffect, useRef } from "react";
import c from "classnames";
const lineCount = 3;
export default function AudioPulse({ active, volume, hover }) {
    const lines = useRef([]);
    useEffect(() => {
        let timeout = null;
        const update = () => {
            lines.current.forEach((line, i) => (line.style.height = `${Math.min(24, 4 + volume * (i === 1 ? 400 : 60))}px`));
            timeout = window.setTimeout(update, 100);
        };
        update();
        return () => clearTimeout(timeout);
    }, [volume]);
    return (React.createElement("div", { className: c("audioPulse", { active, hover }) }, Array(lineCount)
        .fill(null)
        .map((_, i) => (React.createElement("div", { key: i, ref: (el) => (lines.current[i] = el), style: { animationDelay: `${i * 133}ms` } })))));
}
//# sourceMappingURL=AudioPulse.js.map