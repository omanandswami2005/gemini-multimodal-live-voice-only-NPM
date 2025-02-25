import "./audio-pulse.css";
export type AudioPulseProps = {
    active: boolean;
    volume: number;
    hover?: boolean;
};
export default function AudioPulse({ active, volume, hover }: AudioPulseProps): import("react/jsx-runtime").JSX.Element;
