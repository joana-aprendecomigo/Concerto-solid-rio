// Shim for the sandboxed `window.storage` API this component was originally written against,
// backed by the browser's localStorage so it runs standalone.
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const value = window.localStorage.getItem(key);
      return { value };
    },
    async set(key, value) {
      window.localStorage.setItem(key, value);
      return true;
    },
  };
}
