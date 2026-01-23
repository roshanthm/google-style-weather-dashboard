import requests
from app.config import OPENWEATHER_API_KEY

def fetch_weather(city: str):
    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
    )

    res = requests.get(url)
    data = res.json()

    if res.status_code != 200:
        return None

    return {
        "city": data["name"],
        "temp": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "description": data["weather"][0]["description"].title(),
    }
