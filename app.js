//data stuff and fetch functions    

let currentCityData = {
        cityName: null,
        description: null,
        currentTemp: null,
        feelsLike: null,
        lowTemp: null,
        highTemp: null,
        fiveDay: [],
        icon: null,
        units: 'imperial',

        updateCurrentData(cityName, description, currentTemp, feelsLike, lowTemp, highTemp, icon) {
            this.cityName = cityName
            this.description = description
            this.currentTemp = Math.round(currentTemp)
            this.feelsLike = Math.round(feelsLike)
            this.lowTemp = Math.round(lowTemp)
            this.highTemp = Math.round(highTemp)
            this.icon = icon
        },

        updateFiveDay(fiveDayForecast) {
            this.fiveDay.length = 0;
            this.fiveDay = fiveDayForecast;
        }
    };

function getWeather(city) {
       return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=5c08e39b3cbe7ab1730ace195e85af31`)
            .then(response => response.json())
            .then((data) => {
                const currentData = data;
                return  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&units=imperial&APPID=5c08e39b3cbe7ab1730ace195e85af31`)
            .then(response => response.json())
            .then((data) => {
                const fiveDayData = data
                return { currentData, fiveDayData }
                })
            })
            .catch(err => console.log(err));
}
    
function updateWeather(weather) {
    currentCityData.updateCurrentData(weather.currentData.name, weather.currentData.weather[0].main, weather.currentData.main.temp, weather.currentData.main.feels_like, weather.currentData.main.temp_min, weather.currentData.main.temp_max, weather.currentData.weather[0].icon);
    const fiveDayForecast = [];
    weather.fiveDayData.list.forEach(forecast => {
        if (forecast.dt_txt.includes('15:00:00')) {
            const nextDay = {};
            nextDay.date = new Date(forecast.dt_txt)
            nextDay.highTemp = Math.round(forecast.main.temp_max)
            nextDay.icon = forecast.weather[0].icon
            fiveDayForecast.push(nextDay);
        }
    })
    currentCityData.updateFiveDay(fiveDayForecast);
}

    // dom stuff

const searchInput = document.querySelector('input');
const searchForm = document.querySelector('#weather-search');
const currentWeatherContainer = document.querySelector('.current-weather');
const currentCity = document.querySelector('.current-city');
const currentTemp = document.querySelector('.current-temp');
const currentFeelsLike = document.querySelector('.feels-like');
const currentDescription = document.querySelector('.current-description');
const currentHighAndLow = document.querySelector('.high-and-low');
const fiveDayContainer = document.querySelector('.five-day');
const fiveDayHeading = document.querySelector('#five-day-heading');
const fiveDayForecastContainer = document.querySelector('.five-day-forecast');
const currentIcon = document.querySelector('#current-icon');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cityName = searchInput.value;
    searchForm.reset();
    const weather = await getWeather(cityName);
    updateWeather(weather);
    displayCurrentWeather();
    displayFiveDay();
})

function displayCurrentWeather() {
    currentCity.innerText = `Current Weather in ${currentCityData.cityName}:`;
    currentTemp.innerText = currentCityData.currentTemp;
    currentIcon.src = `https://openweathermap.org/img/wn/${currentCityData.icon}@2x.png`;
    currentFeelsLike.innerText = `Feels like: ${currentCityData.feelsLike}`;
    currentDescription.innerText = currentCityData.description;
    currentHighAndLow.innerText = `H: ${currentCityData.highTemp} L: ${currentCityData.lowTemp}`;
}

function displayFiveDay() {
    fiveDayHeading.innerText = 'Five Day Forecast';
    fiveDayForecastContainer.innerHTML = '';
    currentCityData.fiveDay.forEach(day => {
        const fiveDayCard = document.createElement('div');
        fiveDayCard.classList.add('five-day-card');

        const dailyDate = document.createElement('div');
        dailyDate.classList.add('daily-date');
        dailyDate.innerText = day.date.toLocaleDateString("en-US");
        fiveDayCard.appendChild(dailyDate);

        const dailyIcon = document.createElement('div');
        dailyIcon.classList.add('daily-icon');
        const iconImage = document.createElement('img');
        iconImage.src = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
        dailyIcon.appendChild(iconImage);
        fiveDayCard.appendChild(dailyIcon);

        const dailyTemp = document.createElement('div');
        dailyTemp.classList.add('daily-temp');
        dailyTemp.innerText = `Temp: ${day.highTemp}`;
        fiveDayCard.appendChild(dailyTemp);

        fiveDayForecastContainer.appendChild(fiveDayCard);
    })
}


