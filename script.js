const apiKey = "49d024d9d68195d141ac42218f1423b9"; 

const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherResult = document.getElementById("weatherResult");
const historyDiv = document.getElementById("history");

// Load history from localStorage
let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
renderHistory();

function renderHistory() {
    historyDiv.innerHTML = "";
    searchHistory.forEach(city => {
        const div = document.createElement("div");
        div.classList.add("history-item");
        div.textContent = city;
        div.addEventListener("click", () => {
            fetchWeather(city);
        });
        historyDiv.appendChild(div);
    });
}

function addToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.unshift(city);
        if (searchHistory.length > 5) searchHistory.pop(); // keep last 5
        localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
        renderHistory();
    }
}

function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.cod === 200) {
                addToHistory(data.name);
                const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                weatherResult.innerHTML = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <img src="${iconUrl}" alt="weather icon">
                    <p>Temperature: ${data.main.temp} °C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
            } else {
                weatherResult.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(err => console.error(err));
}

getWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.cod === 200) {
                        addToHistory(data.name);
                        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                        weatherResult.innerHTML = `
                            <h2>${data.name}, ${data.sys.country}</h2>
                            <img src="${iconUrl}" alt="weather icon">
                            <p>Temperature: ${data.main.temp} °C</p>
                            <p>Weather: ${data.weather[0].description}</p>
                            <p>Humidity: ${data.main.humidity}%</p>
                            <p>Wind Speed: ${data.wind.speed} m/s</p>
                        `;
                    } else {
                        weatherResult.innerHTML = `<p>${data.message}</p>`;
                    }
                })
                .catch(err => console.error(err));
        }, err => {
            alert("Unable to access location");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
