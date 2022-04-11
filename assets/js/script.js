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

// Function to Display Forecast Data
function displayForecast(response) {
  console.log(response);
  // Create and Append Title for Forecast Data
  var forecastTitle = document.createElement("h2");
  forecastTitle.textContent = "5-Day Forecast:";
  forecastEl.appendChild(forecastTitle);

  // Create & Set Forecast Values for the Next 5 Days
  for (var i = 1; i < 6; i++) {
    // Create Elements for Weather Data
    var forecastCol = document.createElement("div");
    var dateEl = document.createElement("p");
    var iconEl = document.createElement("img");
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var humidityEl = document.createElement("p");

    // Set Element Content Values
    dateEl.textContent = `${moment(response.data.daily[i].dt * 1000).format(
      "L"
    )}`;
    tempEl.textContent = `Temp: ${Math.round(
      response.data.daily[i].temp.day
    )}°F`;
    windEl.textContent = `Wind: ${Math.round(
      response.data.daily[i].wind_speed
    )} MPH`;
    humidityEl.textContent = `Humidity: ${response.data.daily[i].humidity} %`;

    // Set Styling & Attributes for Styling
    dateEl.classList.add("forecast-date");
    iconEl.classList.add("forecast-icon");
    forecastCol.classList = "col-2 forecast-results";
    iconEl.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${response.data.daily[i].weather[0].icon}@2x.png`
    );
    iconEl.setAttribute("alt", response.data.daily[i].weather[0].description);

    // Display Elements
    forecastCol.appendChild(dateEl);
    forecastCol.appendChild(iconEl);
    forecastCol.appendChild(tempEl);
    forecastCol.appendChild(windEl);
    forecastCol.appendChild(humidityEl);
    forecastEl.appendChild(forecastCol);
  }
}

// Function to Get Forecast Data
function getForecast(lat, lon) {
  var forecastPath = "/onecall";
  axios
    .get(
      apiRoot +
        forecastPath +
        "?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=current,minutely,hourly,alerts" +
        "&appid=" +
        apiKey +
        "&units=" +
        weatherUnits
    )
    .then(displayForecast);
}

// Function to Display UV Index
function displayUVIndex(response) {
  // Create Elements for UV Index Data
  var uvEl = document.createElement("p");
  var uvValue = document.createElement("span");

  // Set Element Content Values
  uvEl.textContent = "UV Index:";
  uvValue.textContent = response.data.value;

  // Set Styling for UV Value Based on Conditions
  if (response.data.value <= 2) {
    uvValue.classList.add("favorable");
  } else if (response.data.value > 2 && response.data.value <= 8) {
    uvValue.classList.add("moderate");
  } else if (response.data.value > 8) {
    uvValue.classList.add("severe");
  }

  // Display Elements
  uvEl.appendChild(uvValue);
  weatherEl.appendChild(uvEl);
}

// Function to Get UV Index Data
function getUVIndex(lat, lon) {
  var uvPath = "/uvi";
  axios
    .get(
      apiRoot +
        uvPath +
        "?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey +
        "&units=" +
        weatherUnits
    )
    .then(displayUVIndex);
}

// Function to Display Current Temp
function displayTemp(response) {
  // Create Elements for Weather Data
  var cityEl = document.createElement("h2");
  var dateEl = document.createElement("span");
  var iconEl = document.createElement("img");
  var tempEl = document.createElement("p");
  var windEl = document.createElement("p");
  var humidityEl = document.createElement("p");

  // Set Element Content Values
  cityEl.textContent = response.data.name;
  dateEl.textContent = ` (${moment(response.data.dt * 1000).format("L")})`;
  tempEl.textContent = `Temp: ${Math.round(response.data.main.temp)}°F`;
  windEl.textContent = `Wind: ${Math.round(response.data.wind.speed)} MPH`;
  humidityEl.textContent = `Humidity: ${response.data.main.humidity} %`;

  // Set Styling & Attributes for Styling
  iconEl.classList.add("weather-icon");
  weatherEl.classList.add("weather-results");
  iconEl.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconEl.setAttribute("alt", response.data.weather[0].description);

  // Display Elements
  cityEl.appendChild(dateEl);
  cityEl.appendChild(iconEl);
  weatherEl.appendChild(cityEl);
  weatherEl.appendChild(tempEl);
  weatherEl.appendChild(windEl);
  weatherEl.appendChild(humidityEl);

  // Call UV Index and Get Forecast Functions
  getUVIndex(response.data.coord.lat, response.data.coord.lon);
  getForecast(response.data.coord.lat, response.data.coord.lon);
}

// Function to Search for Current Temp Data
function searchCity(name) {
  var weatherPath = "/weather";
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

// Save New Searches to Local Storage
function saveSearch(city) {
  var entry = {
    cityName: city,
  };

  // Get Current Search List
  var currentSearches = localStorage.getItem("cities");

  // Validate/Parse Current List
  if (!currentSearches) {
    currentSearches = [];
  } else {
    currentSearches = JSON.parse(currentSearches);
  }
  // Append New Entry to List
  currentSearches.push(entry);

  // Set Updated List in Local Storage
  localStorage.setItem("cities", JSON.stringify(currentSearches));
}

// Function to Display Search History On Load
function displaySearchHistory() {
  // Get History from Local Storage
  var history = localStorage.getItem("cities");

  // Parse and Display History, if available
  if (history) {
    history = JSON.parse(history);

    for (var i = 0; i < history.length; i++) {
      var searchEntry = document.createElement("button");
      searchEntry.textContent = history[i].cityName;
      searchEntry.classList.add("search-entry");
      searchEntry.setAttribute("data-city", history[i].cityName);
      searchEntry.setAttribute("type", "submit");

      pastSearch.appendChild(searchEntry);
    }
  }
}

// Function to Handle Events for Past Searches
function pastSearchHandler(event) {
  var city = event.target.getAttribute("data-city");

  weatherEl.innerHTML = "";
  forecastEl.innerHTML = "";

  if (city) {
    searchCity(city);
  }
}

// Function to Handle Events for New Searches
function formSubmitHandler(event) {
  event.preventDefault();
  weatherEl.innerHTML = "";
  forecastEl.innerHTML = "";

  var cityName = cityInput.value.trim();

  // Search Field Validation
  if (cityName) {
    searchCity(cityName);
    saveSearch(cityName);

    // Append New Search to Search History
    var newEntry = document.createElement("button");
    newEntry.textContent = cityName;
    newEntry.classList.add("search-entry");
    newEntry.setAttribute("data-city", cityName);
    newEntry.setAttribute("type", "submit");

    pastSearch.appendChild(newEntry);

    // Clear Search Input Field
    cityInput.value = "";
  } else {
    alert("Please enter a valid City");
  }
}

// Initial Page Load
displaySearchHistory();
searchEl.addEventListener("submit", formSubmitHandler);
pastSearch.addEventListener("click", pastSearchHandler);
