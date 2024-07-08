const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer =document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]"); //
const userInfoContainer = document.querySelector(".user-info-container");

const API_KEY="964dc271d77f5d5ae809c0be9ac30242";
// initial variable
let currentTab=userTab;
currentTab.classList.add("current-tab");
// pending work? it will store the fetched coordinates once fetched
getfromSessionStorage();

function switchTab(clickedTab){
    // agr same tab pe press nhi kr rhe to 
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            // kya search form wala container invisible h if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main phle search wale tab pe tha ab your weather tab visible krna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab main your weather container me aa gya hu to display bhi krna hoga
            //  lets fetch it from local storage
            getfromSessionStorage();
        }
    }
    
}
userTab.addEventListener("click",() =>{
    // pass clicked as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",() =>{
    // pass clicked as input parameter
    switchTab(searchTab);
});
 
function getfromSessionStorage(){
    const localCordinates=sessionStorage.getItem("user-coordinates");

// agr local cordinates nhu mile to mtla grant location wala ui show hona chaiye
    if(!localCordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
const loadingscreen=document.querySelector(".loading-container");

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}= coordinates;
    // make grant location invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingscreen.classList.add("active");
// api call
    try {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();

        loadingscreen.classList.remove("active")
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        // hw
        loadingscreen.classList.remove("active");
    }
}
function renderWeatherInfo(weatherInfo){
    // fetch elements 
    const cityName=document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weatherinfo objects
    cityName.innerText =weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText =weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;    
    temp.innerText = `${weatherInfo?.main?.temp} °C`;  
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}
// getting current cordinates 
function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }
      else{
        // hw
      }
}

function showPosition(position){
   const userCoordinates = {
      lat : position.coords.latitude,
      lon : position.coords.longitude,
    } 
    // setting current postion in sessionstorage
    sessionStorage.setItem("user-cordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput= document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName ===""){
        return;
    }
    else{
        fetchSerchWeatherInfo(cityName);
    }
})

 async function fetchSerchWeatherInfo(city){
    loadingscreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingscreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        // HW 
    }
}

