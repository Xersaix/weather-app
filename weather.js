

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

var weatherList= {"Thunderstorm" : "bi bi-cloud-lightning-fill",
        "Drizzle" : "bi bi-cloud-drizzle-fill",
        "Rain":"bi bi-cloud-rain-fill",
        "Snow":"bi bi-cloud-snow-fill",
        "Atmosphere":"bi bi-cloud-fog2-fill",
        "Clear":"bi bi-sun-fill",
        "Clouds":"bi bi-cloud-fill"
    }





function showDate(){
// Format the the first date 
let date1 = new Date();
let monthYear = date1.toLocaleString('fr-FR',{
    month: 'long',
    year: 'numeric',
    
});
monthYear = monthYear[0].toUpperCase() + monthYear.slice(1)
monthAndYear.innerText= monthYear
// Format the second Date
let date2 = new Date();
let fullDate = date2.toLocaleString('fr-FR',{
    day: 'numeric',
    weekday: 'long',
    month: 'long',
    year: 'numeric',

    
});

full_date.innerText = fullDate
}

async function getWheater(lat,lon)
{
    let apiUrl ="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=72696e39e9f46234f7f02c9d446c41c4&units=metric&lang=fr"
    const response = await fetch(apiUrl);
    const data = await response.json();

    if(data.length != 0)
    {
        wind.innerText = data.wind.speed + "km/h";
        moist.innerText = data.main.humidity + "%";
        pressure.innerText = data.main.pressure + " hpa";
        cloud.innerText = data.clouds.all + "%";
        W_icon.innerHTML = `<i class="${weatherList[data.weather[0].main]}  text-5xl ml-10 pl-5 "></i>`
        currentTemp.innerText = Math.round(data.main.temp) + "°"
        weatherType.innerText = data.weather[0].description
        sunset.innerText = new Date(data.sys.sunset *1000).getHours() + ':'+ new Date(data.sys.sunset *1000).getMinutes()
        sunrise.innerText = new Date(data.sys.sunrise*1000).getHours() + ':'+ new Date(data.sys.sunrise*1000).getMinutes()
        console.log(data.weather[0].main)
        

    }
    return await data;
}

async function get5DayWeather(lat,lon)
{
    
    let response = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&hourly=temperature_2m");
    const data = await response.json();

    let xValues = [];

    for (let index = 0; index != 24; index++) {
        xValues.push(index +"H")
    }



let myChart = new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      data: data.hourly.temperature_2m,
      borderColor: "blue",
      fill: true ,
      pointRadius: 1,
      
    }]
  },
  options: {
    legend: {display: false},
    
  }
});

    console.log(data);

}

async function nameToCoordinate(name)
{
    const response = await fetch("http://api.openweathermap.org/geo/1.0/direct?q="+name+"&limit=5&appid=72696e39e9f46234f7f02c9d446c41c4");
    const data = await response.json();
     return await data;
}

async function loadRightName(name){
    nameToCoordinate(name).then((result2)=>{
        city.innerText = result2[0].name;
        stateAndCountry.innerText = result2[0].state + ", "+ result2[0].country;
        let currentTime = new Date().toLocaleTimeString(undefined,{
            hour: '2-digit',
            minute: '2-digit',});

        time.innerText = currentTime;
        

    })

}

window.onload = function(){
    showDate()
    
    getWheater(defaultLat,defaultLon).then((result)=>{
        loadRightName(result.name)
        
        console.log(result)
    })
}

searchBar.addEventListener("input",(event) =>{

    if(searchBar.value.length != 0)
    {
        searchBarDropdown.classList.replace("hidden","visible")
        if(searchBar.value.length >= 3)
        {
            nameToCoordinate(searchBar.value).then((result) =>{

            searchBarDropdown.childNodes[1].innerHTML = ""
            if(result.length != 0)
            {
                result.forEach(element => {
                    searchBarDropdown.childNodes[1].innerHTML += `
                    <li class="w-full bg-slate-200 hover:bg-slate-300 pl-8">${element.name}, ${element.state}, ${element.country}</li>
                    `
                });
            }
            else
            {
                searchBarDropdown.childNodes[1].innerHTML += `<li class="w-full bg-slate-200 hover:bg-slate-300 pl-8">Aucun résultat</li>`
            }

            console.log(result)
            console.log(searchBarDropdown.childNodes)

        })}
    }
    else
    {
        searchBarDropdown.classList.replace("visible","hidden")
    }


})

get5DayWeather(defaultLat,defaultLon)

