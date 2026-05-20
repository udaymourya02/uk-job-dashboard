# UK Job Market Dashboard — Web App Setup Guide

## Project Structure
```
uk-job-web/
├── server/          ← Node.js API (connects to your SQL database)
│   ├── index.js
│   └── package.json
└── client/          ← React frontend (the beautiful dashboard)
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── App.css
```

---

## Step 1 — Set up the API server

Open terminal in VS Code, navigate to the server folder:
```
cd uk-job-web/server
npm install
```

Then start the server:
```
npm start
```

You should see: "API running on http://localhost:3001"

Test it works — open browser and go to:
http://localhost:3001/api/kpis

You should see JSON data like:
{"total_jobs":1414,"avg_salary":41230,"total_cities":8,"total_roles":8}

---

## Step 2 — Set up the React frontend

Open a NEW terminal window, navigate to client folder:
```
cd uk-job-web/client
npm install
npm run dev
```

Open browser at: http://localhost:3000

You should see the full dashboard with live data from your database!

---

## Step 3 — Deploy online for free (get a shareable link)

### Deploy the API to Railway (free):
1. Go to railway.app — sign up free with GitHub
2. New Project → Deploy from GitHub repo
3. Upload your server folder
4. Add environment variables if needed
5. Railway gives you a URL like: https://uk-job-api.railway.app

### Deploy the Frontend to Vercel (free):
1. Go to vercel.com — sign up free with GitHub
2. Import your client folder
3. Before deploying, update the API URL in App.jsx:
   Change: const API = "http://localhost:3001/api"
   To:     const API = "https://your-railway-url.railway.app/api"
4. Vercel gives you a URL like: https://uk-job-dashboard.vercel.app

### That's your live shareable link for LinkedIn!

---

## What each API endpoint returns

GET /api/kpis        — total jobs, avg salary, cities, roles
GET /api/roles       — job count per role
GET /api/skills      — top 12 skills by mention count
GET /api/cities      — job count per city
GET /api/salaries    — avg salary per role
GET /api/trend       — daily job posting counts
GET /api/jobs        — recent job listings (filterable by role/city)

---

## Troubleshooting

Error: "Cannot connect to SQL Server"
→ Make sure SQL Server (SQLEXPRESS) is running in services.msc
→ Check your server name is Uday\SQLEXPRESS in server/index.js

Error: "Module not found: msnodesqlv8"
→ Run: npm install --global windows-build-tools
→ Then: npm install msnodesqlv8

CORS error in browser:
→ The server already has CORS enabled
→ Make sure API is running on port 3001

---

## Your LinkedIn post when this is live

"I built a live UK job market intelligence dashboard from scratch.

No Power BI. No third-party tools.

Full custom stack:
→ Python scraper pulling live UK job listings
→ MS SQL database storing 1,400+ records
→ Node.js REST API serving live data
→ React frontend with real-time charts

Live link: [your Vercel URL]
GitHub: [your repo]

#FullStack #DataAnalytics #React #NodeJS #SQL #BuildingInPublic"
