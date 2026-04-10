# CanvasAI - AI-Powered Whiteboard

A modern, collaborative whiteboard SaaS application built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 **AI-Powered Tools** - Smart suggestions and auto-complete
- 👥 **Real-time Collaboration** - Work together with live cursors
- ⚡ **Lightning Fast** - Optimized canvas for thousands of objects
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🎯 **Beautiful Templates** - Start quickly with pre-designed templates
- 🔒 **Secure** - Enterprise-grade security

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Animations**: GSAP
- **Data**: Frontend-only (local state and localStorage)
- **Canvas**: TLDraw (coming soon)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/TheEightboys/aimvp-whiteboard.git
cd aimvp-whiteboard
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Create a `.env.local` file for Gemini API usage:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server:

```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/     # Dashboard components
│   ├── landing/       # Landing page components
│   ├── search/        # Search and command palette
│   ├── shared/        # Shared/reusable components
│   └── ui/            # UI primitives (shadcn/ui)
├── contexts/          # React contexts
├── data/              # Mock data
├── lib/               # Utilities and helpers
├── pages/             # Page components
└── types/             # TypeScript types
```

## License

MIT
