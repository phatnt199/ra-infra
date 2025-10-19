# @minimaltech/ra-infra

Minimal Technology ReactJS Infrastructure - A React Admin framework built on LoopBack 4 for browser applications.

## 🚀 Quick Start

### Installation

```bash
npm install @minimaltech/ra-infra @loopback/context @loopback/filter
# or
yarn add @minimaltech/ra-infra @loopback/context @loopback/filter
# or
pnpm add @minimaltech/ra-infra @loopback/context @loopback/filter
```

### Browser Setup (Required!)

Since this package uses LoopBack 4, you need to add browser polyfills. Add this to your app entry point:

```typescript
// src/main.tsx or src/index.tsx
import '@minimaltech/ra-infra/polyfills';

// ... rest of your app
```

For Vite users, also update your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { getRaInfraViteConfig } from '@minimaltech/ra-infra/config';

export default defineConfig({
  plugins: [react()],
  ...getRaInfraViteConfig(),
});
```

**📖 [Complete Browser Setup Guide](https://github.com/phatnt199/ra-infra/wiki/Browser-Compatibility-Setup)**

## 📚 Documentation

- [Browser Compatibility Setup](https://github.com/phatnt199/ra-infra/wiki/Browser-Compatibility-Setup) - **Read this first!**
- [Project WIKI](https://github.com/phatnt199/ra-infra/wiki)

## ⚡ Features

- 🎯 React Admin integration
- 💉 Dependency Injection with LoopBack 4
- 🔍 Advanced data filtering
- 🌐 Browser-compatible (with polyfills)
- 📦 Tree-shakeable ES modules
- 🎨 Material-UI components
- 🌍 i18n support

## 🛠️ Tech Stack

- React 18+
- React Admin 5+
- LoopBack 4 (Context & Filter)
- Material-UI 5+
- TypeScript

## 📦 What's Included

- **Base Applications**: Abstract application classes with DI
- **Providers**: Data providers, auth providers, i18n providers
- **UI Components**: Custom React Admin components
- **Services**: Network services, CRUD services
- **Utilities**: Helper functions and utilities

## 🤝 Contributing

Please read the [Project WIKI](https://github.com/phatnt199/ra-infra/wiki) for contribution guidelines.

## 📄 License

MIT - See LICENSE file for details

## 🐛 Issues

Report issues at [GitHub Issues](https://github.com/phatnt199/ra-infra/issues)

---

Please checkout these references for more guiding:

- [Browser Setup Guide](https://github.com/phatnt199/ra-infra/wiki/Browser-Compatibility-Setup) ⭐ **Important!**
- [Project WIKI](https://github.com/phatnt199/ra-infra/wiki)
