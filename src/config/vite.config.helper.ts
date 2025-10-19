import type { Plugin, UserConfig } from 'vite';

/**
 * Vite configuration helper for @minimaltech/ra-infra
 *
 * This helper provides the necessary polyfills and configurations
 * for using LoopBack 4 packages in browser environments.
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import { getRaInfraViteConfig } from '@minimaltech/ra-infra/config';
 *
 * export default defineConfig({
 *   ...getRaInfraViteConfig(),
 *   // your other config
 * });
 * ```
 */
export function getRaInfraViteConfig(): UserConfig {
  return {
    define: {
      // Polyfill global for LoopBack packages
      global: 'globalThis',
    },
    resolve: {
      alias: {
        // Polyfill Buffer for @loopback/metadata
        buffer: 'buffer/',
      },
    },
    optimizeDeps: {
      include: ['buffer'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
  };
}

/**
 * Vite plugin for @minimaltech/ra-infra
 *
 * Alternative approach using a plugin instead of config merge.
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import { raInfraVitePlugin } from '@minimaltech/ra-infra/config';
 *
 * export default defineConfig({
 *   plugins: [raInfraVitePlugin()],
 * });
 * ```
 */
export function raInfraVitePlugin(): Plugin {
  return {
    name: 'vite-plugin-ra-infra',
    config() {
      return getRaInfraViteConfig();
    },
  };
}
