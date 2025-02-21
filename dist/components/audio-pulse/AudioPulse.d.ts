import "./audio-pulse.css";
import React from "react";
export type AudioPulseProps = {
    active: boolean;
    volume: number;
    hover?: boolean;
};
export default function AudioPulse({ active, volume, hover }: AudioPulseProps): React.JSX.Element;
