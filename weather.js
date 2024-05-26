

// Search bar in the middle part
var searchBar = document.getElementById("searchBar");
var searchBarDropdown = document.getElementById("searchBarDropdown");
// Date id for the middle part
var monthAndYear = document.getElementById("monthYear");
var full_date = document.getElementById("fullDate");
// Today Overview
var wind = document.getElementById("wind");
var moist = document.getElementById("moist");
var pressure = document.getElementById("pressure");
var cloud = document.getElementById("cloud");
// Default latitude and longitude
var defaultLat = 44.34;
var defaultLon = 10.99;
// City , State,Country and Time
var city = document.getElementById("city");
var stateAndCountry = document.getElementById("stateAndCountry");
var time = document.getElementById("time");
// 
var currentTemp = document.getElementById("current-temp")
var weatherType = document.getElementById("weather")
var sunset = document.getElementById("sunset")
var sunrise = document.getElementById("sunrise")
var W_icon = document.getElementById("W-icon");
var saved = document.getElementById("saved");
var saved_location = document.getElementById("saved-location")
var dash = document.getElementById("dash")
var dashboard = document.getElementById("dashboard")
var map_link = document.getElementById("map-link")
var map = document.getElementById("map-location")

var weatherList = {
    "Thunderstorm": "bi bi-cloud-lightning-fill",
    "Drizzle": "bi bi-cloud-drizzle-fill",
    "Rain": "bi bi-cloud-rain-fill",
    "Snow": "bi bi-cloud-snow-fill",
    "Atmosphere": "bi bi-cloud-fog2-fill",
    "Clear": "bi bi-sun-fill",
    "Clouds": "bi bi-cloud-fill"
}





function showDate() {
    // Format the the first date 
    let date1 = new Date();
    let monthYear = date1.toLocaleString('fr-FR', {
        month: 'long',
        year: 'numeric',

    });
    monthYear = monthYear[0].toUpperCase() + monthYear.slice(1)
    monthAndYear.innerText = monthYear
    // Format the second Date
    let date2 = new Date();
    let fullDate = date2.toLocaleString('fr-FR', {
        day: 'numeric',
        weekday: 'long',
        month: 'long',
        year: 'numeric',


    });

    full_date.innerText = fullDate;
}

async function getWheater(lat, lon) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=72696e39e9f46234f7f02c9d446c41c4&units=metric&lang=fr"
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.length != 0) {
        wind.innerText = data.wind.speed + "km/h";
        moist.innerText = data.main.humidity + "%";
        pressure.innerText = data.main.pressure + " hpa";
        cloud.innerText = data.clouds.all + "%";
        W_icon.innerHTML = `<i class="${weatherList[data.weather[0].main]}  text-5xl ml-10 pl-5 "></i>`
        currentTemp.innerText = Math.round(data.main.temp) + "°"
        weatherType.innerText = data.weather[0].description
        sunset.innerText = new Date(data.sys.sunset * 1000).getHours() + ':' + new Date(data.sys.sunset * 1000).getMinutes()
        sunrise.innerText = new Date(data.sys.sunrise * 1000).getHours() + ':' + new Date(data.sys.sunrise * 1000).getMinutes()
        console.log(data.weather[0].main)


    }
    return await data;
}

function savedLocationClick(lat,lon) {
    getWheater(lat, lon).then((result) => {
        loadRightName(result.name)
        get5DayWeather(lat, lon)

        saved_location.classList.replace("visible", "hidden")
        map.classList.replace("visible", "hidden")
        dashboard.classList.replace("hidden", "visible")
        if (saved.classList.contains("text-blue-600")) {
            saved.classList.remove("text-blue-600")
            dash.classList.add("text-blue-600")
        } else if (map_link.classList.contains("text-blue-600")) {
            map_link.classList.remove("text-blue-600")
            dash.classList.add("text-blue-600")
        }
    })

}

function loadSavedLocation() {
    saved_location.lastElementChild.innerHTML = ""
    Object.keys(localStorage).forEach(function (key) {
        

        saved_location.lastElementChild.innerHTML += `
        <div class="h-36 bg-slate-200 flex justify-center items-center">
        <!-- Time and place -->
        <div class="h-32 w-full flex flex-row">
            <!-- Place -->
            <div class="w-8/12 h-full  border-3 flex flex-col justify-center pl-10 text-left" onclick="savedLocationClick(${localStorage.getItem(key).split(" ")[0]},${localStorage.getItem(key).split(" ")[1]})">
                <p class="text-3xl font-semibold text-black">${key.split(", ")[0]}</p>
                <p class="text-lg text-slate-400">${key.split(", ")[1]},${key.split(", ")[2]} </p>
            </div>
            <!-- Time -->
            <div class="w-4/12 h-full flex justify-center items-center">
                
                <i class="bi bi-trash text-2xl text-dark font-semibold"onclick="addDelFav('${key}',${localStorage.getItem(key).split(" ")[0]},${localStorage.getItem(key).split(" ")[1]})"></i>
            </div>
        </div>
        
        </div>
        `
    });
}

async function get5DayWeather(lat, lon) {

    let response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&hourly=temperature_2m");
    const data = await response.json();

    let xValues = [];

    for (let index = 0; index != 24; index++) {
        xValues.push(index + "h00")
    }



    let myChart = new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,
            label: 'Heure',
            datasets: [{
                label: 'Temperature',
                data: data.hourly.temperature_2m,
                borderColor: "blue",
                fill: true,
                pointRadius: 1,

            }]
        },
        options: {
            legend: { display: false },
            maintainAspectRatio: false,

        }
    });

    console.log(data);

}

async function nameToCoordinate(name) {
    const response = await fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + name + "&limit=5&appid=72696e39e9f46234f7f02c9d446c41c4");
    const data = await response.json();
    return await data;
}

async function loadRightName(name) {
    nameToCoordinate(name).then((result2) => {
        city.innerText = result2[0].name;
        stateAndCountry.innerText = result2[0].state + ", " + result2[0].country;
        let currentTime = new Date().toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });

        time.innerText = currentTime;


    })

}

window.onload = function () {
    showDate()

    // getWheater(defaultLat, defaultLon).then((result) => {
    //     loadRightName(result.name)
    //     get5DayWeather(defaultLat, defaultLon)

    //     console.log(result)
    // })
}



function loadSearch(lat, lon) {
    showDate()

    getWheater(lat, lon).then((result) => {
        loadRightName(result.name)
        get5DayWeather(lat, lon)
        searchBarDropdown.classList.replace("visible", "hidden")
        
        console.log(result)
    })
}

function addDelFav(name, lat, lon) {
    if (typeof localStorage.getItem(name) !== 'undefined' && localStorage.getItem(name) == lat + " " + lon) {
        localStorage.removeItem(name)
    }
    else {
        let coord = lat + " " + lon
        localStorage.setItem(name, coord);
    }

    loadSavedLocation()
    console.log(localStorage.getItem(name))
    searchBarDropdown.classList.replace("visible", "hidden")
}


searchBar.addEventListener("input", (event) => {

    if (searchBar.value.length != 0) {
        searchBarDropdown.classList.replace("hidden", "visible")
        if (searchBar.value.length >= 3) {
            nameToCoordinate(searchBar.value).then((result) => {

                searchBarDropdown.childNodes[1].innerHTML = ""
                if (result.length != 0) {
                    result.forEach(element => {
                        let fav = '';
                        if (typeof localStorage.getItem(`${element.name}, ${element.state}, ${element.country}`) !== 'undefined' && localStorage.getItem(`${element.name}, ${element.state}, ${element.country}`) == element.lat + " " + element.lon) {
                            fav = "bi bi-star-fill";
                        } else {
                            fav = "bi bi-star";
                        }

                        let name = element.name + ", " + element.state + ", " + element.country
                        let val = element.lat + " " + element.lon
                        searchBarDropdown.childNodes[1].innerHTML += `
                    <li class="w-full bg-slate-200 hover:bg-slate-300 pl-8 flex justify-between" ><span onclick="loadSearch(${element.lat},${element.lon})">${element.name}, ${element.state}, ${element.country}</span> <i class="${fav} mr-3" onclick="addDelFav('${name}', ${element.lat},${element.lon})"></i></li>
                    `
                    });
                }
                else {
                    searchBarDropdown.childNodes[1].innerHTML += `<li class="w-full bg-slate-200 hover:bg-slate-300 pl-8">Aucun résultat</li>`
                }

                console.log(result)
                console.log(searchBarDropdown.childNodes)

            })
        }
    }
    else {
        searchBarDropdown.classList.replace("visible", "hidden")
    }


})

saved.addEventListener("click", (event) => {


    dashboard.classList.replace("visible", "hidden")
    map.classList.replace("visible", "hidden")
    saved_location.classList.replace("hidden", "visible")
    if (dash.classList.contains("text-blue-600")) {
        dash.classList.remove("text-blue-600")
        saved.classList.add("text-blue-600")
    } else if (map_link.classList.contains("text-blue-600")) {
        map_link.classList.remove("text-blue-600")
        saved.classList.add("text-blue-600")
    }
    loadSavedLocation()

})

map_link.addEventListener("click", (event) => {

    map.classList.replace("hidden", "visible")
    dashboard.classList.replace("visible", "hidden")
    saved_location.classList.replace("visible", "hidden")
    if (dash.classList.contains("text-blue-600")) {
        dash.classList.remove("text-blue-600")
        map_link.classList.add("text-blue-600")
    } else if (saved.classList.contains("text-blue-600")) {
        saved.classList.remove("text-blue-600")
        map_link.classList.add("text-blue-600")
    }

})

dash.addEventListener("click", (event) => {


    saved_location.classList.replace("visible", "hidden")
    map.classList.replace("visible", "hidden")
    dashboard.classList.replace("hidden", "visible")
    if (saved.classList.contains("text-blue-600")) {
        saved.classList.remove("text-blue-600")
        dash.classList.add("text-blue-600")
    } else if (map_link.classList.contains("text-blue-600")) {
        map_link.classList.remove("text-blue-600")
        dash.classList.add("text-blue-600")
    }




})



