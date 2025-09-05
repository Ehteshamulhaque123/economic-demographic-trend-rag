# Economic and Demographic Trend with RAG

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

## CI/CD Pipeline

This project uses GitHub Actions for CI/CD. The pipeline:

1. Builds and tests the application on every push to main and pull request
2. Deploys to GitHub Pages on successful merge to main branch

### Deployment Options

#### GitHub Pages Deployment

The application is configured to deploy to GitHub Pages automatically:

1. The workflow automatically builds and deploys the static version of the app
2. You can access the deployed application at: https://ehteshamulhaque123.github.io/economic-demographic-trend-rag/

The workflow file is located at `.github/workflows/deploy-github-pages.yml`

#### Vercel Deployment (Alternative)

To enable automatic deployment to Vercel:

1. Create a project on Vercel and connect it to your GitHub repository
2. Get your Vercel API tokens and project details from Vercel dashboard
3. Add the following secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

The Vercel workflow file is located at `.github/workflows/nextjs-ci-cd.yml`


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
