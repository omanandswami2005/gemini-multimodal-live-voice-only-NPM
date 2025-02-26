import { jsx as _jsx } from "react/jsx-runtime";
import "./audio-pulse.scss";
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
    return (_jsx("div", { className: c("audioPulse", { active, hover }), children: Array(lineCount)
            .fill(null)
            .map((_, i) => (_jsx("div", { 
            // ref={(el) => (lines.current[i] = el!)}
            ref: (el) => {
                lines.current[i] = el;
            }, style: { animationDelay: `${i * 133}ms` } }, i))) }));
}
