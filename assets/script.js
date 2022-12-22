(function ($) {
    // localStorage.clear();
    var ulEl = document.querySelector('.search-history');
    var button = document.querySelector('.btn');
    var results = document.querySelector('.search-results');
    var search = document.querySelector('.search');
    var searchCity = '';
    var fiveDayContainer = document.querySelector('.weekCast');

    
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (searchHistory==null) {
        searchHistory = {};
    }

    function loadHistory() {
        ulEl.innerHTML = "";
        for (let i=Object.keys(searchHistory).length; i>0 ; i--) {
            liEl = document.createElement("li");
            ulEl.appendChild(liEl);
            liEl.classList.add("history");
            liEl.textContent = Object.keys(searchHistory)[i-1].toUpperCase();
        };
    }

    ulEl.addEventListener('click', function(e) {
        getWeather(e.target.textContent);
    });

    button.addEventListener('click', function() {
        searchCity = search.value;
        getWeather(searchCity);
    });
    
    var dayContainer = document.querySelector('.todayCast');
    var apiKey = '099bf382f7898a2ef203e1c7447f3027';

    function getWeather(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
            if(data.cod == 404 || data.cod == 400) { return null }
            else {
            searchHistory[searchCity] = 0;
            var searchHistoryString = JSON.stringify(searchHistory);
            localStorage.setItem("searchHistory", searchHistoryString);
            loadHistory();
            displayFiveDay(data.coord.lon, data.coord.lat);
            displayOneDay(data);
            }
        });
    }

    function displayOneDay(data) {
        var todayName = document.querySelector('.cityName');
        var todayTemp = document.querySelector('.cityTemp');
        var todayWind = document.querySelector('.cityWind');
        var todayHumidity = document.querySelector('.cityHumid');
        var todayImg = document.querySelector('.cityImg');
        todayImg.src = "http://openweathermap.org/img/wn/"+ data.weather[0].icon +".png";
        
        todayName.innerHTML = data.name +" (" +dayjs().format('DD/MM/YYYY')+")";
        todayName.appendChild(todayImg);
        todayTemp.textContent = "Temp: " +data.main.temp+ "°C";
        todayWind.textContent = "Wind: "+data.wind.speed+ " KPH";
        todayHumidity.textContent = "Humidity: "+data.main.humidity+ " %";
    }

    function displayFiveDay(lon, lat) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
            fiveDayContainer.innerHTML = "";
                for (var j=0 ; j<data.list.length ; j++) {
                    let time = data.list[j].dt_txt;
                    time = time.split(" ");
                    if (time[1] === "03:00:00") {
                        var dayContainer = document.createElement("div");
                        dayContainer.classList.add("dayContainer");
                        var dayDate = document.createElement('h3');
                        dayDate.classList.add("infoDate");
                        var dayImg = document.createElement('img');
                        dayImg.classList.add("info");
                        var dayTemp = document.createElement('p');
                        dayTemp.classList.add("info");
                        var dayWind = document.createElement('p');
                        dayWind.classList.add("info");
                        var dayHumid = document.createElement('p');
                        dayHumid.classList.add("info");

                        fiveDayContainer.appendChild(dayContainer);
                        dayContainer.appendChild(dayDate);
                        dayContainer.appendChild(dayImg);
                        dayContainer.appendChild(dayTemp);
                        dayContainer.appendChild(dayWind);
                        dayContainer.appendChild(dayHumid);
                        dayImg.src = "http://openweathermap.org/img/wn/"+ data.list[j].weather[0].icon +".png";

                        var unixCode = data.list[j].dt
            
                        dayDate.innerHTML = dayjs.unix(unixCode).format('DD/MM/YYYY');
                        dayTemp.textContent = "Temp: " +data.list[j].main.temp+ "°C";
                        dayWind.textContent = "Wind: "+data.list[j].wind.speed+ " KPH";
                        dayHumid.textContent = "Humidity: "+data.list[j].main.humidity+ " %";
                    }
                }
            
        });
        results.style.opacity = '1';
    }
    loadHistory();
})(jQuery);
