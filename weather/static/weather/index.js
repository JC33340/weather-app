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

//clearing all divs
function clear_page() {
    document.querySelectorAll("#search-page, #city-weather-page, #city-selection-page").forEach(div => {
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
        fetch(`https://api.api-ninjas.com/v1/city?name=${city}&limit=20`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            'X-Api-Key': 'rOd9xgW3XzIvsnKX4GA9yQ==BuY0s4RkNJJYuZkU'
        }
     })
    .then(res => res.json())
    .then(data =>{
        console.log(data)
        selection_page(data);
    })
    } catch(err) {
        console.log(`ERROR: ${err}`)
    };

}; 

function selection_page(data) {
    clear_page();
    const city_selector_page = document.querySelector("#city-selection-page")
    city_selector_page.style.display = "block";
    let count = 0;
    for(let i = 0; i < data.length; i++) {
        let selection_page_city_div = document.createElement("div");
        selection_page_city_div.setAttribute("class", "selection-page-city-div")
        selection_page_city_div.setAttribute("id", `selection-page-city-div-${i}`)
        selection_page_city_div.style.display = "none";

        let selection_page_city_country_name  = document.createElement("b");
        selection_page_city_country_name.setAttribute("id", "selection-page-city-div-title")
        selection_page_city_country_name.innerHTML = `${data[i].name}, ${data[i].country}\n`;

        let line_break = document.createElement("br");

        let selection_page_population = document.createElement("span");
        selection_page_population.innerHTML = `Population: ${data[i].population}`

        selection_page_city_div.append(selection_page_city_country_name, line_break, selection_page_population);

        city_selector_page.append(selection_page_city_div);
        selection_page_city_div.addEventListener("click", () => {
            weather_data(data[i])
        })
        setTimeout(function() {play_selection_page_animation(`#selection-page-city-div-${i}`);}, count);
        count += 200;
    }

}

//function used for timing divs
function play_selection_page_animation(div_id){
    const div = document.querySelector(div_id);
    div.style.display = "block"; 

}

function weather_data(city_location) {
    try {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city_location.latitude}&longitude=${city_location.longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,cloudcover,visibility&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,windspeed_10m_max&timezone=GMT`)
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
    clear_page()
    const weather_page = document.querySelector("#city-weather-page")
    weather_page.style.display = "block";
    const line_break = document.createElement("br")

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
    weather_page.querySelector("#city-weather-page-title-div").append(city_title_div);

    //adding the date buttons 
    const date_div = weather_page.querySelector("#city-weather-page-button-div");
    for (date in weather_info.daily.time) {
        let date_button = document.createElement("button");
        date_button.innerHTML = weather_info.daily.time[date]
        date_button.setAttribute("class", "weather-page-button")
        date_div.append(date_button)
    }

    //adding the daily divs
    const daily_div = weather_page.querySelector("#city-weather-page-daily-div");

    //finding current time and date and current temp
    const current_temp_div = document.createElement("div");
    const currentDate_overall = new Date().toISOString();
    const currentTime = currentDate_overall.substring(11,13);
    const currentTime_int = parseInt(currentTime)
    const currentDate = currentDate_overall.substring(0,10);
    const current_temp =  weather_info.hourly.temperature_2m[currentTime_int]

    //adding current temp to its div
    current_temp_div.setAttribute("class", "weather-page-current-temp-div")
    const current_temp_note_div = document.createElement("span")
    current_temp_note_div.innerHTML = "The current temperature is:"
    const current_temp_int_div = document.createElement("b")
    current_temp_int_div.innerHTML = `${current_temp}`

    //adding todays date
    const todays_date = document.createElement("span")
    todays_date.innerHTML = `Todays date is: ${currentDate}`

    current_temp_div.append(todays_date, line_break,current_temp_note_div,line_break,current_temp_int_div)

    daily_div.append(current_temp_div)
}