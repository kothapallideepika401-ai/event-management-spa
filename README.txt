EVENTHUB - Event Management SPA (Angular + Node/Express)
=========================================================

STEP 1 - BACKEND (Terminal 1)
  cd backend
  npm install
  npm start
  -> http://localhost:3000/api/events should show JSON

STEP 2 - FRONTEND (Terminal 2), one time setup
  (from the event-management folder, NOT inside backend)
  ng new frontend-app --routing --style=css --skip-git --ssr=false --defaults
  Then COPY the "src" folder from this zip's "frontend" folder INTO "frontend-app",
  choosing "Replace/Overwrite" when asked.
  Then DELETE these default files in frontend-app/src/app/ :
     app.ts / app.html / app.css / app.spec.ts
     (older Angular: app.component.ts / .html / .css / .spec.ts)

STEP 3 - RUN FRONTEND
  cd frontend-app
  ng serve
  Open http://localhost:4200

Note: data is stored in memory and resets when the backend restarts.
