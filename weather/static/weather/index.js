document.addEventListener("DOMContentLoaded", () => {
    //default loading of index search page
    clear_page();
    load_index();

    //adding submission event listener for search form
    document.querySelector("#search-form").addEventListener("submit", event => {
        event.preventDefault();
        search_city()
    })
})

//clearign all divs
function clear_page() {
    document.querySelectorAll("#search-page, #city-weather-page").forEach(div => {
        div.style.display = "none"
    })
};

//loading the search page in the index
function load_index(){
    document.querySelector("#search-page").style.display = "block";
};

//load weather page of city
function search_city(){
    let city = document.querySelector("#search-form-input").value
    console.log(city)
    try {
        fetch(`https://api.api-ninjas.com/v1/city?name=${city}`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            'X-Api-Key': 'rOd9xgW3XzIvsnKX4GA9yQ==BuY0s4RkNJJYuZkU'
        }
     })
    .then(res => res.json())
    .then(data =>{
        weather_data(data[0]);
    })
    } catch(err) {
        console.log(`ERROR: ${err}`)
    };

}; 

function weather_data(city_location) {
    try {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city_location.latitude}&longitude=${city_location.longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,visibility`)
    .then(res => res.json())
    .then(data => {
        clear_page();
        load_weather_page(city_location, data)
    })
    } catch(err) {
        console.log(`ERROR: ${err}`);
    }
    
};

function load_weather_page(city_general_info, weather_info) {
    console.log(city_general_info, weather_info);

    const weather_page = document.querySelector("#city-weather-page")
    weather_page.style.display = "block";

    //title for page with city
    const city_title_div = document.createElement("div")
    city_title_div.setAttribute("id", "city_title_div")
    const city_title = document.createElement("h1");
    const country_title = document.createElement("h3")
    city_title.style.display = "inline";
    country_title.style.display = "inline";
    city_title.innerHTML = `${city_general_info.name}, `
    country_title.innerHTML = `${city_general_info.country}`
    city_title_div.append(city_title, country_title)
    city_title_div.style.animationPlayState = 'running';

    weather_page.append(city_title_div);
}