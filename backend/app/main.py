from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.weather import fetch_weather

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "Weather API running"}

@app.get("/weather/{city}")
def get_weather(city: str):
    result = fetch_weather(city)

    if result is None:
        raise HTTPException(status_code=404, detail="City not found")

    return result
