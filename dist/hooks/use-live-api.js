var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MultimodalLiveClient, } from "../lib/multimodal-live-client";
import { AudioStreamer } from "../lib/audio-streamer";
import { AudioRecorder } from "../lib/audio-recorder";
import { audioContext } from "../lib/utils";
import VolMeterWorklet from "../lib/worklets/vol-meter";
import { createLiveConfig } from "../lib/createLiveConfig";
export function useLiveAPI({ apiKey, url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`, dynamicConfig = {
    voiceName: "Kore",
    systemInstruction: {
        parts: [{ text: "You are AI of omiii" }],
    },
    tools: [],
}, // required dynamic configuration fields
 }) {
    // Merge the dynamic config with default values to form the full config
    const initialConfig = createLiveConfig(dynamicConfig);
    const client = useMemo(() => new MultimodalLiveClient({ url, apiKey }), [url, apiKey]);
    const audioStreamerRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [config, setConfig] = useState(initialConfig);
    const [volume, setVolume] = useState(0);
    const [muted, setMuted] = useState(false);
    const [audioRecorder] = useState(() => new AudioRecorder());
    const [inVolume, setInVolume] = useState(0);
    useEffect(() => {
        if (!audioStreamerRef.current) {
            audioContext({ id: "audio-out" }).then((audioCtx) => {
                audioStreamerRef.current = new AudioStreamer(audioCtx);
                audioStreamerRef.current
                    .addWorklet("vumeter-out", VolMeterWorklet, (ev) => {
                    setVolume(ev.data.volume);
                })
                    .then(() => { });
            });
        }
    }, []);
    useEffect(() => {
        document.documentElement.style.setProperty("--volume", `${Math.max(5, Math.min(inVolume * 200, 8))}px`);
    }, [inVolume]);
    useEffect(() => {
        const onClose = () => setConnected(false);
        const stopAudioStreamer = () => { var _a; return (_a = audioStreamerRef.current) === null || _a === void 0 ? void 0 : _a.stop(); };
        const onAudio = (data) => { var _a; return (_a = audioStreamerRef.current) === null || _a === void 0 ? void 0 : _a.addPCM16(new Uint8Array(data)); };
        client.on("close", onClose).on("interrupted", stopAudioStreamer).on("audio", onAudio);
        return () => {
            client.off("close", onClose).off("interrupted", stopAudioStreamer).off("audio", onAudio);
        };
    }, [client]);
    useEffect(() => {
        const onData = (base64) => {
            client.sendRealtimeInput([
                {
                    mimeType: "audio/pcm;rate=16000",
                    data: base64,
                },
            ]);
        };
        if (connected && !muted && audioRecorder) {
            audioRecorder.on("data", onData).on("volume", setInVolume).start();
        }
        else {
            audioRecorder.stop();
        }
        return () => {
            audioRecorder.off("data", onData).off("volume", setInVolume);
        };
    }, [connected, client, muted, audioRecorder]);
    const connect = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        if (!config)
            throw new Error("config has not been set");
        client.disconnect();
        yield client.connect(config);
        setConnected(true);
    }), [client, config]);
    const disconnect = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        client.disconnect();
        setConnected(false);
    }), [client]);
    // Mute and unmute helper functions
    const mute = useCallback(() => {
        setMuted(true);
        audioRecorder.stop();
    }, []);
    const unmute = useCallback(() => {
        setMuted(false);
        // Optionally restart sending audio input or resume the recorder.
    }, []);
    return {
        client,
        config,
        setConfig,
        connected,
        connect,
        disconnect,
        volume,
        muted,
        mute,
        unmute
    };
}
//# sourceMappingURL=use-live-api.js.map