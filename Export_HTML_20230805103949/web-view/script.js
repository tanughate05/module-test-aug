const apiKey = 'http://api.openweathermap.org/geo/1.0/direct?q='+cityName.value+'&limit=5&appid=814a25199ed1be522802bcb6d8ac83b0'; // Replace with your actual API key from OpenWeatherMap
const weatherCardsContainer = document.getElementById('weatherCardsContainer');
const cities = new Set();

function addCityCard(cityData) {
    // Create a weather card for the city
    const card = document.createElement('div');
    card.classList.add('weather-card');

    // Populate card with data
    card.innerHTML = `
    <div class="weather-icon">
      <img src="${cityData.weatherIconURL}" alt="Weather icon">
    </div>
    <div class="weather-info">
      <h2>${cityData.name}</h2>
      <p>Temperature: ${cityData.temp.current}°C (High: ${cityData.temp.high}°C, Low: ${cityData.temp.low}°C)</p>
      <p>Weather: ${cityData.weatherCondition}</p>
      <p>Humidity: ${cityData.humidity}%</p>
      <p>Pressure: ${cityData.pressure} hPa</p>
      <p>Wind Speed: ${cityData.windSpeed} m/s</p>
    </div>
  `;

    weatherCardsContainer.appendChild(card);
}


function fetchWeatherData(cityName) {

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=814a25199ed1be522802bcb6d8ac83b0
`;


    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const weatherData = {
                name: data.name,
                weatherIconURL: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
                weatherCondition: data.weather[0].description,
                temp: {
                    current: data.main.temp,
                    high: data.main.temp_max,
                    low: data.main.temp_min,
                },
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: data.wind.speed,
            };
            return weatherData;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            return null;
        });
}



function validateAndAddCity() {
  const cityInput = document.getElementById('cityInput');
  const cityName = cityInput.value.trim();

  if (cityName === '') {
    alert('Please enter a valid city name.');
    return;
  }

  if (cities.has(cityName)) {
    alert('City has already been added.');
    return;
  }

  fetchWeatherData(cityName).then(weatherData => {
    if (weatherData) {
      cities.add(cityName);
      addCityCard(weatherData);
      sortCitiesByTemperature();
    } else {
      alert('City not found. Please enter a valid city name.');
    }
  });

  cityInput.value = '';
}


function sortCitiesByTemperature() {
  // Get all weather cards and convert them into an array
  const weatherCards = Array.from(document.getElementsByClassName('weather-card'));

  // Sort the cards based on the current temperature
  weatherCards.sort((a, b) => {
    const tempA = parseInt(a.querySelector('.weather-info p:first-child').textContent);
    const tempB = parseInt(b.querySelector('.weather-info p:first-child').textContent);
    return tempA - tempB;
  });

  // Remove all cards from the container
  weatherCardsContainer.innerHTML = '';

  // Append the sorted cards back to the container
  weatherCards.forEach(card => weatherCardsContainer.appendChild(card));
}

// Event listener for the "Add" button
const addButton = document.getElementById('addButton');
addButton.addEventListener('click', validateAndAddCity);
