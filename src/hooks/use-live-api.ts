import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MultimodalLiveAPIClientConnection,
  MultimodalLiveClient,
} from "../lib/multimodal-live-client";
import { LiveConfig, LiveAPIDynamicConfig } from "../multimodal-live-types";
import { AudioStreamer } from "../lib/audio-streamer";
import { AudioRecorder } from "../lib/audio-recorder";
import { audioContext } from "../lib/utils";
import VolMeterWorklet from "../lib/worklets/vol-meter";
import { createLiveConfig } from "../lib/createLiveConfig";



export type UseLiveAPIResults = {
  client: MultimodalLiveClient;
  setConfig: (config: LiveConfig) => void;
  config: LiveConfig;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  volume: number;
  muted: boolean;
  mute: () => void;
  unmute: () => void;
};

export function useLiveAPI({
  apiKey,
  url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`,
  dynamicConfig = {
    voiceName: "Kore",
    systemInstruction: {
      parts: [{ text: "You are AI of omiii" }],
    },
    tools: [

    ],
  }, // required dynamic configuration fields
}: Omit<MultimodalLiveAPIClientConnection, "url"> & { 
  url?: string;
  dynamicConfig?: LiveAPIDynamicConfig;
}): UseLiveAPIResults {
  
  // Merge the dynamic config with default values to form the full config
  const initialConfig = createLiveConfig(dynamicConfig);
  const client = useMemo(() => new MultimodalLiveClient({ url, apiKey }), [url, apiKey]);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const [connected, setConnected] = useState(false);

  const [config, setConfig] = useState<LiveConfig>(initialConfig);

  const [volume, setVolume] = useState(0);

  const [muted, setMuted] = useState(false);

  const [audioRecorder] = useState(() => new AudioRecorder());

  const [inVolume, setInVolume] = useState(0);





  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: "audio-out" }).then((audioCtx: AudioContext) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        audioStreamerRef.current
          .addWorklet<any>("vumeter-out", VolMeterWorklet, (ev: any) => {
            setVolume(ev.data.volume);
          })
          .then(() => {});
      });
    }
  }, []);

  
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--volume",
      `${Math.max(5, Math.min(inVolume * 200, 8))}px`,
    );
  }, [inVolume]);

  useEffect(() => {
    const onClose = () => setConnected(false);
    const stopAudioStreamer = () => audioStreamerRef.current?.stop();
    const onAudio = (data: ArrayBuffer) => audioStreamerRef.current?.addPCM16(new Uint8Array(data));

    client.on("close", onClose).on("interrupted", stopAudioStreamer).on("audio", onAudio);

    return () => {
      client.off("close", onClose).off("interrupted", stopAudioStreamer).off("audio", onAudio);
    };
  }, [client]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: "audio/pcm;rate=16000",
          data: base64,
        },
      ]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on("data", onData).on("volume", setInVolume).start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off("data", onData).off("volume", setInVolume);
    };
  }, [connected, client, muted, audioRecorder]);


  const connect = useCallback(async () => {
    if (!config) throw new Error("config has not been set");
    client.disconnect();
    await client.connect(config);
    setConnected(true);
  }, [client, config]);

  const disconnect = useCallback(async () => {
    client.disconnect();
    setConnected(false);
  }, [client]);

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
