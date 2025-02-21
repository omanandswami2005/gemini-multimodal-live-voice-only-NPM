# gemini-multimodal-live-voice-only

>>>>>>> A React-based multimodal live streaming library that provides a live API context, audio processing, and UI components (such as a Control Tray) for building voice-enabled applications. This package bundles both the JavaScript/TypeScript logic and SCSS-based styles, making it easy to integrate into your project.
>>>>>>>
>>>>>>
>>>>>
>>>>
>>>
>>

---

## Features

- **Live API Context & Hook**Provides an easy-to-use context (`LiveAPIProvider`) and hook (`useLiveAPIContext`) that manage connections, audio streaming, and configuration for the Gemini Multimodal Live API.
- **Built-in Audio Processing**Uses an audio recorder and audio streamer to handle real-time audio input and output, along with volume meter worklets.
- **UI Components**Includes a `ControlTray` component that lets you control the connection state, mute/unmute audio, and monitor volume levels.
- **SCSS Bundled**
- **Live API Context & Hook**Provides an easy-to-use context (`LiveAPIProvider`) and hook (`useLiveAPIContext`) that manage connections, audio streaming, and configuration for the Gemini Multimodal Live API.
- **Built-in Audio Processing**Uses an audio recorder and audio streamer to handle real-time audio input and output, along with volume meter worklets.
- **UI Components**Includes a `ControlTray` component that lets you control the connection state, mute/unmute audio, and monitor volume levels.
- **SCSS Bundled**

---

## Installation

Install the package via npm:

```bash
npm install gemini-multimodal-live-voice-only
```

---

## Usage

Below is an example of how to integrate the package into your React project.

### Basic Setup

1. **Wrap your App with the `LiveAPIProvider`:**

```tsx
import React from 'react';
import { LiveAPIProvider, ControlTray } from 'gemini-multimodal-live-voice-only';
import 'gemini-multimodal-live-voice-only/dist/index.css'; // Import bundled CSS

const App = () => {
  return (
    <LiveAPIProvider
      apiKey="your-api-key"
      dynamicConfig={{
        voiceName: "Kore",
        systemInstruction: {
          parts: [{ text: "You are AI of omiii. Follow the provided tools and instructions." }]
        },
        tools: [
          // Define your tools configuration here, for example:
          { googleSearch: {} },
          { functionDeclarations: {} }
        ]
      }}
    >
      <ControlTray>
        {/* Optionally include additional UI elements */}
      </ControlTray>
    </LiveAPIProvider>
  );
};

export default App;
```

2. **Using the Context in Components**

You can also access the live API context in your components using the `useLiveAPIContext` hook:

```tsx
import React from 'react';
import { useLiveAPIContext } from 'gemini-multimodal-live-voice-only';

const StatusDisplay = () => {
  const { connected, connect, disconnect, volume, muted, mute, unmute } = useLiveAPIContext();

  return (
    <div>
      <h2>Status: {connected ? 'Connected' : 'Disconnected'}</h2>
      <button onClick={connected ? disconnect : connect}>
        {connected ? 'Disconnect' : 'Connect'}
      </button>
      <button onClick={muted ? unmute : mute}>
        {muted ? 'Unmute' : 'Mute'}
      </button>
      <p>Volume: {volume}</p>
    </div>
  );
};

export default StatusDisplay;
```

---

## API Reference

### LiveAPIProvider

The `LiveAPIProvider` component wraps your application and initializes the live API connection.

**Props:**

- **apiKey** (string, required): Your API key for the live service.
- **dynamicConfig** (object, optional): An object containing dynamic configuration fields:
  - **voiceName** (string): The voice configuration name.
  - **systemInstruction** (object): An object with a `parts` array. Each part should have a `text` field.
  - **tools** (array): Array of tool configurations (e.g., `{ googleSearch: {} }`).
- **url** (string, optional): The URL for the API connection. Defaults to the Gemini live API URL.

### useLiveAPIContext

A custom hook to access the live API functionalities and state.

**Returns an object with:**

- **client**: Instance of the live API client.
- **config**: The current live API configuration.
- **setConfig**: Function to update the configuration.
- **connected**: Boolean indicating connection status.
- **connect**: Function to initiate a connection.
- **disconnect**: Function to disconnect.
- **volume**: The current volume level.
- **muted**: Boolean indicating whether audio is muted.
- **mute**: Function to mute audio.
- **unmute**: Function to unmute audio.

### ControlTray

A pre-built UI component that provides audio control features such as mute/unmute and connection toggling, along with a visual volume indicator.

---

## Build & Development

### Development Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/omanandswami2005/gemini-multimodal-live-voice-only.git
   cd gemini-multimodal-live-voice-only
   npm install
   ```
2. To run the TypeScript compiler in watch mode:

   ```bash
   npm run dev
   ```

### Building the Package

This package uses Rollup to bundle the JavaScript/TypeScript and SCSS files. To build the package:

```bash
npm run build
```

This command will generate the compiled files in the `dist/` directory, including the bundled CSS file.

---

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## Support

For any issues or questions, please open an issue in the GitHub repository or contact [omanand swami](mailto:omanandswami2005@gmail.com).

---

Happy coding! 🚀
