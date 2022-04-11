var searchEl = document.querySelector("#search-form");
var cityInput = document.querySelector("#city-input");

function searchCity(event) {
  event.preventDefault();

  var cityName = cityInput.value.trim();

  if (cityName) {
    console.log(cityName);
  } else {
    alert("Please enter a valid City");
  }
}

searchEl.addEventListener("submit", searchCity);
