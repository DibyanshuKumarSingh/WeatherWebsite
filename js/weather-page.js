const weatherInfo = {
  0: ["☀️", "Clear sky"],
  1: ["🌤️", "Mainly clear"],
  2: ["⛅", "Partly cloudy"],
  3: ["☁️", "Overcast"],
  45: ["🌫️", "Fog"],
  48: ["🌫️", "Rime fog"],
  51: ["🌦️", "Light drizzle"],
  53: ["🌦️", "Drizzle"],
  55: ["🌧️", "Heavy drizzle"],
  61: ["🌧️", "Light rain"],
  63: ["🌧️", "Rain"],
  65: ["🌧️", "Heavy rain"],
  71: ["🌨️", "Light snow"],
  73: ["❄️", "Snow"],
  75: ["❄️", "Heavy snow"],
  80: ["🌦️", "Rain showers"],
  81: ["🌦️", "Rain showers"],
  82: ["⛈️", "Heavy showers"],
  95: ["⛈️", "Thunderstorm"],
  96: ["⛈️", "Thunderstorm + hail"],
  99: ["⛈️", "Heavy thunderstorm"]
};

// Get user's current location
function getLiveLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => reject(error.message),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  });
}

async function loadWeather() {
  try {
    const { latitude, longitude } = await getLiveLocation();

    const API_URL =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code` +
      `&hourly=precipitation_probability` +
      `&daily=sunrise,sunset` +
      `&timezone=auto` +
      `&forecast_days=1`;

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    const current = data.current;

    // Temperature
    document.getElementById("temperature").textContent =
      Math.round(current.temperature_2m);

    // Feels Like
    document.getElementById("feels").textContent =
      `${Math.round(current.apparent_temperature)}°C`;

    // Humidity
    document.getElementById("humidity").textContent =
      `${current.relative_humidity_2m}%`;

    // Wind
    document.getElementById("wind").textContent =
      `${Math.round(current.wind_speed_10m)} km/h`;

    // Weather
    const info = weatherInfo[current.weather_code] || ["🌤️", "Unknown"];

    document.getElementById("weatherIcon").textContent = info[0];
    document.getElementById("description").textContent = info[1];

    // Location
    document.getElementById("location").textContent =
      data.timezone.replaceAll("_", " ");

    // Sunrise
    document.getElementById("sunrise").textContent =
      formatTime(data.daily.sunrise[0]);

    // Sunset
    document.getElementById("sunset").textContent =
      formatTime(data.daily.sunset[0]);

    // Rain probability
    const currentTime = current.time.slice(0, 13);

    const index = data.hourly.time.findIndex(
      time => time.slice(0, 13) === currentTime
    );

    if (index >= 0) {
      document.getElementById("rain").textContent =
        `${data.hourly.precipitation_probability[index] ?? 0}%`;
    }

  } catch (error) {
    console.error("Weather error:", error);

    document.getElementById("location").textContent =
      "Location unavailable. Please allow location access.";
  }
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Clock
function updateClock() {
  const now = new Date();

  document.getElementById("time").textContent =
    now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

  document.getElementById("date").textContent =
    now.toLocaleDateString([], {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
}

loadWeather();
updateClock();

setInterval(updateClock, 1000);
setInterval(loadWeather, 10 * 60 * 1000);