# Economic and Demographic Trend with RAG

[![Vercel Deployment](https://img.shields.io/badge/vercel-deployed-success)](https://economic-demographic-trend-rag.vercel.app)

A Next.js dashboard for exploring economic and demographic trends across countries, featuring forecasts and Retrieval-Augmented Generation (RAG) insights.

## Features

- **Country Picker:** Search and select countries with autocomplete suggestions.
- **Time Series Charts:** Visualize inflation, currency, GDP growth, and youth migration data using interactive charts.
- **Forecasts:** Generate future projections for each series using Holt's Linear method.
- **RAG Insights:** Ask questions about trends and receive AI-generated answers with supporting passages from Wikipedia.
- **Open APIs:** Data sourced from World Bank, Frankfurter, and Wikipedia APIs.
- **Modern UI:** Responsive, accessible design with high-contrast colors and Tailwind CSS.

## Directory Structure

```
app/
  api/         # Next.js API routes
    _country.js
    explain/route.js
    timeseries/route.js
    forecast/route.js
  globals.css  # Global styles
  layout.js    # App layout and metadata
  page.js      # Main dashboard page
components/
  ChartCard.jsx
  CountryPicker.jsx
  RagPanel.jsx
lib/
  date.js
  forecast.js  # Holt's Linear forecasting
  rag_tfidf.js # RAG logic
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
3. **Build for production:**
   ```sh
   npm run build
   npm start
   ```

## Deployment Notes

### Vercel vs GitHub Pages

- **Vercel Deployment**: Full functionality including all API routes and dynamic features
- **GitHub Pages Deployment**: Static version only; API routes don't work as GitHub Pages doesn't support server-side functionality

For the best experience with all features, please use the Vercel deployment.

## CI/CD Pipeline

This project uses both GitHub Actions and Vercel for CI/CD.

### Primary Deployment: Vercel

This project is deployed on Vercel, which offers full support for Next.js features including API routes:

1. **Automatic Deployment**: Every push to the main branch is automatically deployed to Vercel
2. **Preview Deployments**: Each pull request gets its own preview deployment
3. **Live URL**: [https://economic-demographic-trend-rag.vercel.app](https://economic-demographic-trend-rag.vercel.app)

#### Setting Up Vercel Deployment

1. Go to [Vercel](https://vercel.com/signup) and sign up/login with your GitHub account
2. Import your repository from GitHub
3. Configure project settings (Next.js should be auto-detected)
4. Deploy your project

### Secondary Deployment: GitHub Pages

A static version is also deployed to GitHub Pages, though with limited functionality due to lack of API route support:

1. The workflow automatically builds and deploys a static version of the app
2. You can access it at: [https://ehteshamulhaque123.github.io/economic-demographic-trend-rag/](https://ehteshamulhaque123.github.io/economic-demographic-trend-rag/)

The workflow files are located at:
- `.github/workflows/github-pages.yml` (GitHub Pages deployment)
- `.github/workflows/nextjs-ci-cd.yml` (Vercel deployment via GitHub Actions - alternative to direct Vercel integration)


## How RAG Works

RAG (Retrieval-Augmented Generation) combines information retrieval with generative AI to provide contextually relevant answers:

1. **Document Retrieval:**
  - For each user question, the app fetches relevant Wikipedia articles (e.g., "Economy of [Country]", "Inflation in [Country]").
  - Articles are split into paragraphs and indexed using TF-IDF (Term Frequency-Inverse Document Frequency) for efficient search.

2. **Ranking:**
  - The user's question is compared to all indexed paragraphs using TF-IDF similarity.
  - The top-ranked paragraphs are selected as supporting evidence.

3. **Answer Generation:**
  - The app summarizes the most relevant paragraphs into bullet points as the answer.
  - Passages and their sources are returned for transparency.

This approach ensures answers are grounded in real data and sources, improving reliability and explainability.

## API Endpoints

- `/api/timeseries` — Returns time series data for selected country and series.
- `/api/forecast` — Returns forecasts for provided series using Holt's Linear method.
- `/api/explain` — Returns RAG-generated answers and supporting passages for user questions.

## Customization

- **Colors & Styles:** Edit `app/globals.css` and `tailwind.config.js` for UI customization.
- **Data Sources:** Update API routes in `app/api/` to add or modify data sources.
- **RAG Logic:** Modify `lib/rag_tfidf.js` for custom retrieval and ranking.

## License

MIT
