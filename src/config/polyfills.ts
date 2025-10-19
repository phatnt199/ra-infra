/**
 * Browser polyfills for @minimaltech/ra-infra
 *
 * This module provides necessary polyfills for Node.js APIs used by LoopBack 4 packages
 * when running in browser environments.
 *
 * Import this at the top of your application entry point (main.tsx/index.tsx)
 * BEFORE importing any @minimaltech/ra-infra modules.
 *
 * @example
 * ```typescript
 * // src/main.tsx
 * import '@minimaltech/ra-infra/polyfills';
 * import { RaApplication } from '@minimaltech/ra-infra';
 * ```
 */

import { Buffer } from 'buffer';

// Polyfill Buffer globally for @loopback/metadata
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  (window as any).global = window.global || window;
}

// For module environments
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = (globalThis as any).Buffer || Buffer;
  (globalThis as any).global = globalThis.global || globalThis;
}

export {};
