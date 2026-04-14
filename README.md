# Promograd

Promograd is a premium productivity and study management tool designed for students and learners. It combines Pomodoro logic with structured study modes and detailed analytics.

## Features

- **Intelligent Focus Modes**:
  - **Reading Mode**: 25m focus / 5m break.
  - **Lecture Mode**: 60m focus / 15m break.
  - **Custom Mode**: Fully configurable durations.
- **Dynamic Timer**: Countdown with auto-transitions and progress visualization.
- **Analytics Dashboard**:
  - Weekly focus time charts.
  - GitHub-style intensity heatmap.
  - Session count and mode-wise breakdown.
- **Minimized Widget Mode**: A compact, floating UI for unobtrusive focus tracking.
- **Local Persistence**: All data is stored locally on your machine.
- **Export Options**: Export your focus data to JSON or CSV.
- **Premium UI**: Inspired by Apple and Microsoft design languages with Light and Dark mode support.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4.
- **Animations**: Motion (Framer Motion).
- **Icons**: Lucide React.
- **Charts**: Recharts.
- **Desktop Wrapper**: Electron.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the application in the browser:
```bash
npm run dev
```

To run the application as a desktop app (Electron):
```bash
npm run electron:dev
```

### Build

To build the web version:
```bash
npm run build
```

To package the application as a Windows `.exe`:
```bash
npm run electron:build
```

## Architecture

- `src/components`: UI components organized by feature.
- `src/hooks`: Custom hooks for timer logic and local storage.
- `src/types.ts`: Shared TypeScript interfaces and constants.
- `electron-main.js`: Main process entry point for Electron.

## License

SPDX-License-Identifier: Apache-2.0
