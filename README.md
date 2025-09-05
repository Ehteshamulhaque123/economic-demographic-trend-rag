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

This application requires a hosting platform that supports Next.js API routes, which is why we deploy to Vercel. The CI/CD pipeline automatically handles the deployment process whenever changes are pushed to the main branch.

To add new features or fix bugs:
1. Create a new branch
2. Make your changes
3. Submit a pull request
4. Once merged to main, the application will automatically deploy to Vercel

## CI/CD Pipeline

This project uses GitHub Actions to deploy to Vercel.

### Vercel Deployment via GitHub Actions

This project is automatically deployed to Vercel using GitHub Actions, which offers full support for Next.js features including API routes:

1. **Automatic Deployment**: Every push to the main branch is automatically deployed to Vercel
2. **Live URL**: [https://economic-demographic-trend-rag.vercel.app](https://economic-demographic-trend-rag.vercel.app) (will be available after deployment)

#### Vercel Deployment Setup

To configure the GitHub Actions workflow for Vercel deployment:

1. **Generate Vercel API Tokens and Project Details**:
   - Install Vercel CLI: `npm i -g vercel`
   - Login to Vercel: `vercel login`
   - Link your project: `vercel link`
   - Get your tokens by running: `vercel project ls`

2. **Add GitHub Repository Secrets**:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel API token
     - `VERCEL_ORG_ID`: Your Vercel organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel project ID

3. **Workflow Configuration**:
   - The workflow configuration is defined in `.github/workflows/nextjs-ci-cd.yml`
   - It handles building, testing, and deploying to Vercel


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
