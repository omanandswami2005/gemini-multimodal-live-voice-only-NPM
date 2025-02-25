const map = new Map();
export const audioContext = (() => {
    const didInteract = new Promise((res) => {
        window.addEventListener("pointerdown", res, { once: true });
        window.addEventListener("keydown", res, { once: true });
    });
    return async (options) => {
        try {
            const a = new Audio();
            a.src =
                "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
            await a.play();
            if ((options === null || options === void 0 ? void 0 : options.id) && map.has(options.id)) {
                const ctx = map.get(options.id);
                if (ctx) {
                    return ctx;
                }
            }
            const ctx = new AudioContext(options);
            if (options === null || options === void 0 ? void 0 : options.id) {
                map.set(options.id, ctx);
            }
            return ctx;
        }
        catch (e) {
            await didInteract;
            if ((options === null || options === void 0 ? void 0 : options.id) && map.has(options.id)) {
                const ctx = map.get(options.id);
                if (ctx) {
                    return ctx;
                }
            }
            const ctx = new AudioContext(options);
            if (options === null || options === void 0 ? void 0 : options.id) {
                map.set(options.id, ctx);
            }
            return ctx;
        }
    };
})();
export const blobToJSON = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        if (reader.result) {
            const json = JSON.parse(reader.result);
            resolve(json);
        }
        else {
            reject("oops");
        }
    };
    reader.readAsText(blob);
});
export function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
