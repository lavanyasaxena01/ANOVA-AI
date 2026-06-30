# ANOVA AI

**AI-Based Energetic Particle Radiation Forecasting & Decision Support System for Geostationary Satellites**

This is a space weather intelligence platform providing real-time satellite monitoring and radiation exposure predictions.

## Getting Started

### Local Development

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
3. Update `.env.local` with your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Deploying to Vercel

1. **Push to GitHub**
   - Initialize a Git repository and push your code to GitHub

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your actual Gemini API key
   - Redeploy for changes to take effect

4. **Your app is live!**
   - Vercel will provide you with a deployment URL

### Build Command
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Features

- Real-time satellite telemetry monitoring
- Space weather forecasting using Gemini AI
- Radiation exposure risk assessment
- Interactive space weather dashboard
- Explainable AI insights for decision support
