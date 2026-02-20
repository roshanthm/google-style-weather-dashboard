# Security Refactoring: API Key Protection

## Summary of Changes

This refactoring **removes API key exposure from the frontend** and implements a secure backend proxy pattern.

### What Was Changed

**Before (Insecure):**
```typescript
// ❌ API key hardcoded and visible in frontend bundle
export const OWM_API_KEY = "4fcfc437d73dd09ac129306e30d0784e";
// Direct API calls from browser exposed the key in network requests
```

**After (Secure):**
```typescript
// ✅ API key kept only on backend
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
// Frontend makes requests through backend endpoints
```

## Architecture

```
Frontend (TypeScript/React)
    ↓ (HTTP requests)
Backend API (Python/FastAPI) ← Holds API Key in .env
    ↓ (Internal API calls with key)
OpenWeatherMap API
```

## Setup Instructions

### 1. Backend Configuration

**Create `.env` file in `backend/` directory:**

```bash
cd backend
cp .env.example .env
```

**Edit `backend/.env` and add your OpenWeatherMap API key:**

```env
WEATHER_API_KEY=your_actual_key_from_openweathermap
```

### 2. Frontend Configuration

**Create `.env` file in project root:**

```bash
cp .env.example .env
```

**Edit `.env` (optional - defaults to localhost):**

```env
VITE_BACKEND_URL=http://localhost:8000
```

### 3. Start the Services

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv          # Create virtual environment (first time only)
source venv/bin/activate     # On Windows: venv\Scripts\activate
pip install -r app/requirement.txt
python -m uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

## API Endpoints

The following endpoints are now available through the secure backend:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/geocoding` | GET | Convert city name to coordinates |
| `/api/reverse-geocoding` | GET | Convert coordinates to city name |
| `/api/weather` | GET | Get current weather and forecast |

## Security Benefits

✅ **API key never exposed to browser**
✅ **Network requests don't contain the key**
✅ **Key can be rotated without frontend changes**
✅ **Rate limiting can be applied at backend**
✅ **Additional security policies can be added easily**

## Environment Variables Reference

### Backend (`backend/.env`)
- `WEATHER_API_KEY` - Your OpenWeatherMap API key (REQUIRED)

### Frontend (`.env`)
- `VITE_BACKEND_URL` - Backend server URL (defaults to `http://localhost:8000`)

## Important: DO NOT COMMIT .env FILES

Both `.env` files are in `.gitignore` to prevent accidental key exposure. Only `.env.example` files should be committed to show what variables are needed.

## Troubleshooting

### Frontend shows "Failed to fetch location suggestions"
- Check that backend is running on the correct URL
- Verify `VITE_BACKEND_URL` is set correctly
- Check CORS is enabled (should see `*` in FastAPI config)

### Backend shows "WEATHER_API_KEY environment variable is not set"
- Create `backend/.env` file with your key
- Restart the backend server
- Verify the key is valid at openweathermap.org

### API calls show "401 Unauthorized"
- Double-check your OpenWeatherMap API key is correct
- Ensure your API key has proper permissions enabled
- Check if you're using a free tier with rate limits

