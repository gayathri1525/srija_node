export async function fetchWeather(cities, unit = "Celsius") {

  await new Promise(resolve => setTimeout(resolve, 500));
  const conditions = ["Sunny", "Cloudy", "Rain"];
  const data = cities.map(city => ({
    city,
    temperature: Math.floor(Math.random() * 15) + 15,
    unit,
    condition: conditions[Math.floor(Math.random() * conditions.length)]
  }));

  return data;
}
