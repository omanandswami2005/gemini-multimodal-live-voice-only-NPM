
# Gemini-multimodal-live-voice-only

A React-based multimodal live streaming library that provides a live API context, audio processing, and UI components (such as a Control Tray) for building voice-enabled applications. This package bundles both the JavaScript/TypeScript logic making it easy to integrate into your project.

---

## Features

- **Live API Context & Hook**Provides an easy-to-use context (`LiveAPIProvider`) and hook (`useLiveAPIContext`) that manage connections, audio streaming, and configuration for the Gemini Multimodal Live API.
- **Built-in Audio Processing**Uses an audio recorder and audio streamer to handle real-time audio input and output, along with volume meter worklets.
- **UI Components**Includes a pre-built `ControlTray` component that offers controls for connecting/disconnecting, muting/unmuting audio, and monitoring volume levels.
- **Tool Call Handling**
  A built-in tool call handler that processes function calls such as `create_todo`...and more....
- See the example below.

---

## Installation

Install the package via npm:

```bash
npm install gemini-multimodal-live-voice-only
```

---

## Usage

### Basic Setup

Wrap your application with the `LiveAPIProvider` to initialize the live API context and then use the provided UI components:

Give you tools (Array of objects containing function declarations in the format of [GEMINI FUNCTION CALLING TOOL](https://ai.google.dev/gemini-api/docs/function-calling#function_declarations "Gemini Function Calling!!!"))

```tsx
import React from 'react';
import { LiveAPIProvider, ControlTray } from 'gemini-multimodal-live-voice-only';
// Auto-inject bundled CSS:
import 'gemini-multimodal-live-voice-only/dist/index.css';

const App = () => (
  <LiveAPIProvider
    apiKey="your-api-key"
    dynamicConfig={{
      voiceName: "Kore",
      systemInstruction: {
	//Give your SYSTEM_INSTRUCTION here....
        parts: [{ text: "You are AI of omiii. Follow the provided tools and instructions." }]
      },
	// Give you tools here (Array of objects containing function declarations in the format of GEMINI FUNCTION CALLING TOOL EXAMPLE)
      tools: [
        { googleSearch: {} },
        { functionDeclarations: []
      ]
    }}
  >
    <ControlTray>
      {/* Additional UI elements can be included here */}
    </ControlTray>
  </LiveAPIProvider>
);

export default App;

```

### Accessing the Live API Context

You can also access live API functionalities using the `useLiveAPIContext` hook:

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

**Description:**
The `LiveAPIProvider` component initializes the live API connection and provides context to its children.

**Props:**

- **apiKey** (string, required)Your API key for connecting to the live service.
- **dynamicConfig** (object, required) Contains dynamic configuration details:

  - **voiceName** (string): The name of the voice configuration.
    - Available voices are:
      - Puck
      - Charon
      - Kore
      - Fenrir
      - Aoede
  - **systemInstruction** (object): An object with a `parts` array, where each part has a `text` field.
  - **tools** (array): An array of tool configurations (e.g., `{ googleSearch: {} }`).
- **url** (string, optional)
  The API URL. Defaults to the Gemini live API URL if not provided.

### useLiveAPIContext

**Description:**
A custom hook that provides access to the live API client and related state/functions.

**Returns an object with:**

- **client**: Instance of the live API client.
- **config**: The current live API configuration.
- **setConfig**: Function to update the configuration.
- **connected**: Boolean indicating the connection status.
- **connect**: Function to initiate a connection.
- **disconnect**: Function to disconnect.
- **volume**: The current audio volume.
- **muted**: Boolean indicating whether audio is muted.
- **mute**: Function to mute audio.
- **unmute**: Function to unmute audio.

### ControlTray

**Description:**
A UI component that provides audio controls, including mute/unmute and connection toggling, with visual indicators for audio volume.

---

## Tool Call Handler Example

This example demonstrates a simple handler that processes tool calls by switching on `fc.name`, handling a `"create_item"` function call, and returning appropriate responses. Feel free to modify and extend this example to fit your needs:

```tsx
useEffect(() => {
  const onToolCall = async (toolCall: ToolCall) => {
    const responses = await Promise.all(
      toolCall.functionCalls.map(async (fc) => {
    
        // Process function call based on its name.
        switch (fc.name) {
          case "create_item": {
        
            // Create an item using provided args.
            try {
              const response = await fetch("http://localhost:5000/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fc.args),
              });
              const data = await response.json();
              return { id: fc.id, response: { output: data } };
            } catch (error) {
              return { id: fc.id, response: { output: { error: error.message } } };
            }
          }
        
          // Add additional cases as needed.
          default:
            return { id: fc.id, response: { output: { error: "Unknown function" } } };
        }
      })
    );
  
    setTimeout(() => client.sendToolResponse({ functionResponses: responses }), 200);
  };

  client.on("toolcall", onToolCall);
  return () => client.off("toolcall", onToolCall);
}, [client]);

```

---

## Build & Development

### Development Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/omanandswami2005/gemini-multimodal-live-voice-only.git
   cd gemini-multimodal-live-voice-only
   npm install
   ```
2. To run TypeScript in watch mode:

   ```bash
   npm run dev
   ```

### Building the Package

This package uses a combination of `tsc` (for TypeScript) and `sass` (for SCSS) along with a post-build script to strip out individual SCSS imports. To build the package, run:

```bash
npm run build
```

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## Support

For any issues or questions, please open an issue in the [GitHub repository](https://github.com/omanandswami2005/gemini-multimodal-live-voice-only) or contact [omanandswami2005@gmail.com](mailto:omanandswami2005@gmail.com).

---

Happy coding! 🚀
