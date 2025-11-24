import fs from "fs/promises";
import { info } from "./utils/logger.js";
import { fetchWeather } from "./services/weatherService.js";


console.log("Boot: scheduling callbacks...");
setImmediate(() => console.log("setImmediate callback executed"));
setTimeout(() => console.log("setTimeout callback executed after 0ms"), 0);

async function loadConfig() {
  info("Reading user configuration...");
  const configData = await fs.readFile("./config.json", "utf-8");
  return JSON.parse(configData);
}

async function displayWeather() {
  const config = await loadConfig();
  const cities = config.preferredCities;
  const unit = config.unit;

  info(`Fetching weather data for ${cities.join(", ")}...`);
  const weatherData = await fetchWeather(cities, unit);

  weatherData.forEach(w => {
    console.log(`Weather in ${w.city}: ${w.temperature}°${unit[0]}, ${w.condition}`);
  });
}


await displayWeather();


setInterval(async () => {
  info("Scheduled weather refresh in 10 minutes");
  await displayWeather();
}, 10 * 60 * 1000);
