export default function DailyForecast({ daily }) {
  if (!daily) return null;

  return (
    <div className="daily">
      {daily.map(day => (
        <div key={day.date} className="day">
          <p>{day.date}</p>
          <strong>{day.max}°</strong>
          <span>{day.min}°</span>
        </div>
      ))}
    </div>
  );
}
