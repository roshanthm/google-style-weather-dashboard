const API_BASE = "http://127.0.0.1:8000";

export async function getCurrentWeather(city) {
  const res = await fetch(`${API_BASE}/weather/${city}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "City not found");
  }

  return data;
}
