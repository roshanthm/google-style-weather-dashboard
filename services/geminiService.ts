
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, ForecastItem } from "../types";

export const generateWeatherInsight = async (current: WeatherData, daily: ForecastItem[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Based on the following weather data, provide a concise, friendly "Weather Insight" (max 2 sentences).
    Mention any concerns like heatwaves, heavy rain, or storms if present. 
    If weather is pleasant, give a tip.
    
    Current: ${current.temp}°C, ${current.description}, Humidity: ${current.humidity}%.
    Forecast Highs for next few days: ${daily.slice(0, 3).map(d => `${d.maxTemp}°C`).join(', ')}.
    Rain Probability: ${daily[0].rainProb}%.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "No insights available for this location.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    // Simple rule-based fallback
    if (current.temp > 30) return "It's quite hot today. Stay hydrated and avoid direct sunlight!";
    if (daily[0].rainProb > 50) return "High chance of rain today. Don't forget your umbrella!";
    if (current.windSpeed > 10) return "Expect breezy conditions throughout the day.";
    return "The weather looks stable. Have a great day!";
  }
};
