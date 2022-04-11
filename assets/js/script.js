// Define Global Variables
var searchEl = document.querySelector("#search-form");
var cityInput = document.querySelector("#city-input");
var pastSearch = document.querySelector("#past-searches");
var weatherEl = document.querySelector("#weather");
var forecastEl = document.querySelector("#forecast");

// Weather API Info
var apiKey = "8a7d387ef910673e2322fa2db8174c73";
var apiRoot = "https://api.openweathermap.org/data/2.5";
var weatherUnits = "imperial";

function displayTemp(response) {
  console.log(response);
  var cityEl = document.createElement("h2");
  var tempEl = document.createElement("p");
  var windEl = document.createElement("p");
  var humidityEl = document.createElement("p");

  cityEl.textContent = response.data.name;
  tempEl.textContent = `Temp: ${Math.round(response.data.main.temp)}°F`;
  windEl.textContent = `Wind: ${Math.round(response.data.wind.speed)} mph`;
  humidityEl.textContent = `Humidity: ${response.data.main.humidity} %`;

  weatherEl.classList.add("weather-results");
  weatherEl.appendChild(cityEl);
  weatherEl.appendChild(tempEl);
  weatherEl.appendChild(windEl);
  weatherEl.appendChild(humidityEl);
}

function searchCity(name) {
  let weatherPath = "/weather";
  axios
    .get(
      apiRoot +
        weatherPath +
        "?q=" +
        name +
        "&appid=" +
        apiKey +
        "&&units=" +
        weatherUnits
    )
    .then(displayTemp);
}

function formSubmitHandler(event) {
  event.preventDefault();

  var cityName = cityInput.value.trim();

  if (cityName) {
    searchCity(cityName);
  } else {
    alert("Please enter a valid City");
  }
}

searchEl.addEventListener("submit", formSubmitHandler);
// pastSearch.addEventListener("submit", pastSearchHandler);
