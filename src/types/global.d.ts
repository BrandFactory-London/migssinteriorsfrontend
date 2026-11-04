/**
 * `gtag.js` and our consent bootstrap both talk to this queue, so it has to
 * exist on the window type. Loosely typed on purpose: the real signature is
 * an overloaded `arguments` object, which TypeScript cannot usefully express.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export {};
