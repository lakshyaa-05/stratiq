# Stratiq — Outthink Your Market

**AI-powered business intelligence for local markets.** Enter your business name, city, and category — get a full competitive analysis, market gaps, SEO audit, customer psychology, brand positioning, and a growth strategy in under 2 minutes.

> Built with Next.js 15 · Groq LLaMA 3.3 70B · Live DuckDuckGo search · Google Places API

---

## What It Does

Stratiq runs 10 AI analysis modules and synthesizes them into one interactive dashboard:

| Module | What you get |
|---|---|
| **Market Overview** | Local market size, growth rate, 12-month seasonal demand trend |
| **Competitor Analysis** | Real local competitors found via live web search — ratings, strengths, weaknesses |
| **Customer Psychology** | 3 buyer personas, pain points, emotional triggers, trust factors |
| **Market Gaps** | Specific unmet needs in your city with opportunity scores |
| **Local Landscape** | Local vs national brand breakdown, white space analysis |
| **SEO Audit** | Page speed, keyword opportunities, technical issues (needs website URL) |
| **Brand Positioning** | USP, taglines, differentiation map vs competitors |
| **Content Strategy** | Instagram Reels hooks, WhatsApp content, local SEO blog topics |
| **Action Plan** | Week-by-week 30-day roadmap with exact tactics and budgets |
| **Market Entry Analysis** | For new launches — entry score, pros/cons, the gap competitors are missing |

---

## Live Demo

**[stratiq-mauve.vercel.app](https://stratiq-mauve.vercel.app)** — try it free, no sign up needed.

## Screenshots

> *Add screenshots of your dashboard here*

---

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Framer Motion
- **AI:** [Groq API](https://groq.com) — LLaMA 3.3 70B Versatile (primary), LLaMA 3.1 8B Instant (auto-fallback)
- **Competitor Data:** DuckDuckGo HTML scraping + Google Places API (optional)
- **SEO Scores:** Google PageSpeed Insights API (optional)
- **Styling:** Custom design system with inline styles (`src/lib/design.ts`)

---

## Getting Started

### Prerequisites
- Node.js 18+
- A free [Groq API key](https://console.groq.com) — free tier gives 100k tokens/day on 70B, 500k/day on 8B fallback

### 1. Clone and install

```bash
git clone https://github.com/lakshyaa-05/stratiq.git
cd stratiq
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional — enables real Google Maps competitor data + SEO speed scores
GOOGLE_API_KEY=your_google_api_key_here
```

**Getting a Groq API key (free, takes 2 minutes):**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up → API Keys → Create Key
3. Paste it into `.env.local`

**Google API key (optional):**
- Enable Places API + PageSpeed Insights in Google Cloud Console
- Billing must be enabled (free $200/month credit covers normal usage)

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy on Vercel (Free)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lakshyaa-05/stratiq)

1. Click the button above (or go to [vercel.com/new](https://vercel.com/new) and import this repo)
2. In Vercel project settings → Environment Variables, add:
   - `GROQ_API_KEY` (required)
   - `GOOGLE_API_KEY` (optional)
3. Hit Deploy — live in ~60 seconds

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── onboarding/           # Business setup form
│   ├── loading/              # Live analysis progress screen
│   └── dashboard/[id]/       # Full results dashboard
├── components/
│   ├── dashboard/sections/   # 10 analysis section components
│   ├── shared/               # Navbar, AI Chat, MovingBackground
│   └── ui/                   # Reusable Card + SectionHeader
├── lib/
│   ├── engine.ts             # AI orchestrator — all Groq calls + web search
│   ├── types.ts              # TypeScript interfaces
│   ├── design.ts             # Design tokens (colors, gradients, shadows)
│   └── api.ts                # Client-side fetch helpers
└── styles/
    └── globals.css
```

---

## How the Engine Works

1. **Live web search** — DuckDuckGo is scraped for real local businesses matching your category + city. Multi-layer regex cleaning strips directory noise, ad headlines, and HTML entities.
2. **Competitor AI extraction** — Cleaned results are passed to LLaMA 3.3 70B which extracts real business names and generates competitive profiles.
3. **Staggered parallel analysis** — 9 more modules run in pairs with 2.5s pauses between batches to respect Groq's rate limits.
4. **Auto model fallback** — If the 70B primary model hits its daily token limit (100k/day free), all calls automatically switch to LLaMA 3.1 8B Instant (500k/day free) — zero interruption.
5. **Result persistence** — Results are saved in `data/runs/` server-side and `sessionStorage` client-side for instant dashboard reloads.

---

## Roadmap

- [x] Deploy live demo → [stratiq-mauve.vercel.app](https://stratiq-mauve.vercel.app)
- [ ] PDF export with branded cover
- [ ] Multi-city comparison
- [ ] Monthly tracking (run analysis each month, see how your market shifts)
- [ ] Direct Google Business Profile integration
- [ ] WhatsApp Business report sharing

---

## License

MIT — use it, fork it, build on it.

---

*Built by [Lakshya Gandhi](https://github.com/lakshyaa-05)*
