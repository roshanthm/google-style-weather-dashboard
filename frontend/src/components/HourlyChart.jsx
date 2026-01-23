import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function HourlyChart({ hourly }) {
  if (!hourly) return null;

  const data = {
    labels: hourly.map(h => h.time.slice(11, 16)),
    datasets: [
      {
        label: "Temp °C",
        data: hourly.map(h => h.temp),
        borderColor: "#4285F4",
        tension: 0.4
      }
    ]
  };

  return <Line data={data} />;
}
