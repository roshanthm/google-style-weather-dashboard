import requests
import os

location_source = ""
latitude = None
longitude = None
detected_city = ""

print("Attempting to get approximate location via IP address...")
try:
    ip_geo_response = requests.get('http://ip-api.com/json/')
    ip_geo_data = ip_geo_response.json()

    if ip_geo_data['status'] == 'success':
        detected_city = ip_geo_data['city']
        print(f"Detected approximate city (from IP): {detected_city}")

except requests.exceptions.RequestException as e:
    print(f"Error connecting to IP geolocation service: {e}")

if detected_city:
    choice = input(f"Do you want to use '{detected_city}' (y/n)? Enter 'n' to provide Lat/Lon: ").lower()
    if choice == 'y' or choice == '':
        location_source = 'city_name'
    else:
        detected_city = ""

if not location_source:
    print("\n--- Manual Location Input (for precise weather) ---")
    lat_input = input("Enter latitude (e.g., 40.7128) or leave empty: ")
    lon_input = input("Enter longitude (e.g., -74.0060) or leave empty: ")

    if lat_input and lon_input:
        try:
            latitude = float(lat_input)
            longitude = float(lon_input)
            location_source = 'lat_lon'
            print(f"Using manual coordinates: Lat={latitude}, Lon={longitude}")
        except ValueError:
            print("Invalid latitude or longitude. Falling back to city input.")

    if not location_source:
        detected_city = input("Please enter a city name manually (e.g., London): ")
        if detected_city:
            location_source = 'city_name'

if not location_source:
    print("No valid location provided. Exiting.")
    exit()

if 'OPENWEATHER_API_KEY' not in locals() and 'OPENWEATHER_API_KEY' not in globals():
    try:
        from google.colab import userdata
        OPENWEATHER_API_KEY = userdata.get('OPENWEATHER_API_KEY')
    except ImportError:
        print("Colab userdata not available. Please ensure OPENWEATHER_API_KEY is defined.")
        OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')

if not OPENWEATHER_API_KEY:
    raise ValueError("OpenWeatherMap API key not found. Please set it as 'OPENWEATHER_API_KEY'.")

base_url = "http://api.openweathermap.org/data/2.5/weather?"

if location_source == 'lat_lon':
    complete_url = f"{base_url}lat={latitude}&lon={longitude}&appid={OPENWEATHER_API_KEY}&units=metric"
    print(f"Fetching weather data for Lat={latitude}, Lon={longitude}...")
elif location_source == 'city_name':
    complete_url = f"{base_url}q={detected_city}&appid={OPENWEATHER_API_KEY}&units=metric"
    print(f"Fetching weather data for {detected_city}...")
else:
    print("Error: No valid location source determined.")
    exit()

response = requests.get(complete_url)
weather_data = response.json()

if weather_data["cod"] != "404" and weather_data["cod"] != 401:
    main = weather_data["main"]
    weather_info = weather_data["weather"]
    wind = weather_data.get("wind", {})
    clouds = weather_data.get("clouds", {})

    temperature = main["temp"]
    pressure = main["pressure"]
    humidity = main["humidity"]
    wind_speed = wind.get("speed", 0.0)
    weather_description = weather_info[0]["description"]

    loc_display = detected_city if location_source == 'city_name' else f"Lat: {latitude}, Lon: {longitude}"
    print(f"--- Current Weather in {loc_display} ---")
    print(f"  Temperature: {temperature}°C")
    print(f"  Atmospheric pressure: {pressure} hPa")
    print(f"  Humidity: {humidity}%")
    print(f"  Description: {weather_description.capitalize()}")
else:
    if weather_data["cod"] == 401:
        print("Error: Invalid OpenWeatherMap API key.")
    else:
        print(f"Error: Could not retrieve weather. Details: {weather_data.get('message', 'No message')}")
