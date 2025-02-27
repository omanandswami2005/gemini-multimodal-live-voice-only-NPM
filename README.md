# **gemini-multimodal-live-voice-only**

A **React-based multimodal live streaming library** that provides:

✅ A **Live API context**

✅ **Audio processing** (real-time input/output, volume meters)

✅ **Pre-built UI components** ( *Control Tray for audio controls* )

✅ **Tool call handling** for function-based interactions

This package bundles **JavaScript/TypeScript logic** for easy integration into any React project.

---

## **✨ Features**

* 🔹 **Live API Context & Hook**

  Provides `LiveAPIProvider` (context) and `useLiveAPIContext` (hook) to manage  **connections, audio streaming, and configuration** .
* 🔹 **Built-in Audio Processing**

  Handles **real-time audio input/output** with  **volume meters** .
* 🔹 **Pre-Built UI Components**

  Includes  **`ControlTray`** , a ready-to-use component for  **connect/disconnect, mute/unmute, and volume monitoring** .
* 🔹 **Tool Call Handling**

  Built-in tool call handler for functions like `"create_todo"` and more.
* 🔹 **Easy Styling**

  Auto-inject bundled styles via:

  ```tsx
  import 'gemini-multimodal-live-voice-only/dist/gemini-multimodal-live-voice-only.css';
  ```

---

## **📌 Installation**

Install the package using npm:

```bash
npm install gemini-multimodal-live-voice-only
```

---

## **🚀 Usage**

### **Basic Setup**

Wrap your app with `LiveAPIProvider` and use the built-in UI components.

```tsx
import React from 'react';
import { LiveAPIProvider, ControlTray } from 'gemini-multimodal-live-voice-only';
import 'gemini-multimodal-live-voice-only/dist/gemini-multimodal-live-voice-only.css';

const App = () => (
  <LiveAPIProvider
    apiKey={"your-api-key"}
    dynamicConfig={{
      voiceName: "Kore",
      systemInstruction: {
        parts: [{ text: "You are AI of omiii. Follow the provided tools and instructions." }]
      },
      tools: [
        { googleSearch: {} },
        { functionDeclarations: [] }
      ]
    }}
  >
    <ControlTray />
  </LiveAPIProvider>
);

export default App;
```

---

### **Accessing the Live API Context**

Use the `useLiveAPIContext` hook for  **managing connections and audio controls** .

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

## **📖 API Reference**

### **LiveAPIProvider**

> **Initializes and provides the live API context.**

#### **Props:**

| Prop Name         | Type   | Required | Description                            |
| ----------------- | ------ | -------- | -------------------------------------- |
| `apiKey`        | string | ✅ Yes   | API key for authentication.            |
| `dynamicConfig` | object | ✅ Yes   | Contains configuration settings.       |
| `url`           | string | ❌ No    | API URL (defaults to Gemini Live API). |

🔹 **dynamicConfig** options:

* **voiceName** (`string`): Sets the voice. Available voices: `"Puck"`, `"Charon"`, `"Kore"`, `"Fenrir"`, `"Aoede"`.
* **systemInstruction** (`object`): Defines system behavior (array of `{ text: string }` objects).
* **tools** (`array`): Function declarations ([Google Gemini function calling format](https://ai.google.dev/gemini-api/docs/function-calling#function_declarations "Gemini Function calling tutorial ref...")).

---

### **useLiveAPIContext**

> **Hook for managing the live API connection.**

#### **Returns:**

| Property       | Type     | Description                              |
| -------------- | -------- | ---------------------------------------- |
| `client`     | object   | API client instance.                     |
| `config`     | object   | Current API configuration.               |
| `setConfig`  | function | Updates the API configuration.           |
| `connected`  | boolean  | `true`if connected,`false`otherwise. |
| `connect`    | function | Establishes a connection.                |
| `disconnect` | function | Closes the connection.                   |
| `volume`     | number   | Current audio volume level.              |
| `muted`      | boolean  | `true`if muted,`false`otherwise.     |
| `mute`       | function | Mutes the microphone.                    |
| `unmute`     | function | Unmutes the microphone.                  |

---

### **ControlTray**

> **Pre-built UI component for managing audio controls.**

✅ **Features:**

✔ Connect/Disconnect button

✔ Mute/Unmute button

✔ Volume level visualization

```tsx
<ControlTray />
```

---

## **🛠 Tool Call Handler Example**

Process tool calls dynamically based on function names:

```tsx
useEffect(() => {
  const onToolCall = async (toolCall) => {
    const responses = await Promise.all(
      toolCall.functionCalls.map(async (fc) => {
        switch (fc.name) {
          case "create_item":
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

## **🎨 Style Guide**

### **Importing Styles**

To apply default styles, import the CSS file:

```tsx
import 'gemini-multimodal-live-voice-only/dist/gemini-multimodal-live-voice-only.css';
```

### **Custom Styling**

Override styles using  **CSS classes** :

```css
.control-tray {
  background-color: #282c34;
  color: white;
  padding: 10px;
  border-radius: 8px;
}

button {
  background-color: #61dafb;
  border: none;
  padding: 8px 16px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #4fa3d1;
}
```

---

## **🛠 Build & Development**

### **Development Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/omanandswami2005/gemini-multimodal-live-voice-only-NPM.git
   cd gemini-multimodal-live-voice-only-NPM
   npm install
   ```
2. Start development mode:
   ```bash
   npm run dev
   ```

### **Building the Package**

Run the following command to build the package:

```bash
npm run build
```

---

## **🤝 Contributing**

1️⃣ Fork the repository

2️⃣ Make changes

3️⃣ Submit a **pull request**

For major changes, open an issue **before** starting development.

---

## **📩 Support**

For issues and questions:

🔹  **GitHub** : [Open an issue](https://github.com/omanandswami2005/gemini-multimodal-live-voice-only-NPM)

🔹  **Email** : [omanandswami2005@gmail.com](mailto:omanandswami2005@gmail.com)

---

Happy coding! 🚀
