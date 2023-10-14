document.addEventListener("DOMContentLoaded", () => {
    //default loading of index search page
    clear_page();
    load_index();

    //adding submission event listener for search form
    document.querySelector("#search-form").addEventListener("submit", event => {
        event.preventDefault();
        search_city()
    })

    //saved cities button coding
    const saved_cities_button = document.querySelector(".container-fluid #navbarNav .navbar-nav .nav-item #saved-cities-button");
    if (saved_cities_button != null) {
        saved_cities_button.addEventListener("click", ()=>{
            load_saved_cities()
        })
    }
})

//setting global variables
let weather_page_count = 200;
const delay_time = 200;
let access_page_first = false;

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
        selection_page(data, "search-cities");
    })
    } catch(err) {
        console.log(`ERROR: ${err}`)
    };

}; 

function selection_page(data, page_type) {
    clear_page();

    //changing selection page title depending on the type of page being called
    const selection_page_title = document.querySelector("#city-selection-page h1")
    if (page_type === "search-cities"){
        selection_page_title.innerHTML = "Select your city:"
    } else if (page_type === "saved-cities"){
        selection_page_title.innerHTML = "Saved cities:"
    }

    const city_selector_page = document.querySelector("#city-selection-page #city-selection-page-wrapper")
    city_selector_page.innerHTML = ""
    document.querySelector("#city-selection-page").style.display = "block";
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
        selection_page_city_div.addEventListener("click", async () => {
            const response = await fetch("save_city", {
                method: "POST",
                body: JSON.stringify({
                    name: data[i].name,
                    country: data[i].country,
                    longitude: data[i].longitude,
                    latitude: data[i].latitude,
                    population: data[i].population
                })
            })
            const jsonresponse = await response.json();
            console.log(jsonresponse)
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

//loading basic weather page
async function load_weather_page(city_general_info, weather_info) {
    console.log(city_general_info, weather_info);
    clear_page()
    const weather_page = document.querySelector("#city-weather-page")
    weather_page.style.display = "block";

   

    //save button coding
    const save_button = weather_page.querySelector("#save-city-button-wrapper-div #city-weather-page-save-button")
    let save_action = ""

    if (save_button != null){
        //fetching if this city is saved
        let saved_city = await fetch("user_saved_city",{
        method: "POST", 
        body: JSON.stringify({
            name: city_general_info.name,
            longitude: city_general_info.longitude,
            latitude: city_general_info.latitude
        })
        });
        let saved_city_data = await saved_city.json();
        console.log(saved_city_data)

        
        if (saved_city_data.saved_status === true) {
            save_button.innerHTML = "Unsave"
            save_action  = "unsave"
        } else if (saved_city_data.saved_status === false) {
            save_button.innerHTML = "Save"
            save_action = "save"
        }
    
        save_button.addEventListener("click", ()=>{change_city_save(save_action,saved_city_data.city_id)})
    }
    

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
    date_div.style.display = "none";
    setTimeout(function() {play_selection_page_animation('#city-weather-page-button-div');}, weather_page_count);
    weather_page_count += delay_time;

    //setting timeout for save div
    setTimeout(function() {play_selection_page_animation('#city-weather-page #save-city-button-wrapper-div');}, weather_page_count);
    weather_page_count += delay_time;

    for (let i=0;i<weather_info.daily.time.length;i++) {
        let date_button = document.createElement("button");
        date_button.innerHTML = weather_info.daily.time[i]
        if (i===0){
            date_button.setAttribute("class","button-active");
        } else {
            date_button.setAttribute("class", "button-inactive");
        }
        date_button.addEventListener("click", ()=>{
            load_other_info(i,weather_info)
            document.querySelectorAll("#city-weather-page #city-weather-page-button-div button").forEach((element)=>{
                element.className = "button-inactive"
            })
            date_button.className="button-active"
        });
        date_div.append(date_button)
    }

    //finding current time and date and current temp
    const currentDate_overall = new Date().toISOString();
    const currentTime = currentDate_overall.substring(11,13);
    const currentTime_int = parseInt(currentTime)
    const currentDate = currentDate_overall.substring(0,10);
    console.log(`TIME:${currentDate_overall}time:${currentTime_int}`)
    const current_temp =  weather_info.hourly.temperature_2m[currentTime_int]

    //adding current temp to its div
    const daily_temp_div = document.querySelector("#city-weather-page #city-weather-page-daily-div .weather-page-current-temp-div ");
    daily_temp_div.style.display = "none";
    daily_temp_div.querySelector("#city-weather-page-daily-temp-text").innerHTML = "The current temperature is:"
    daily_temp_div.querySelector("b").innerHTML = `${current_temp}${weather_info.daily_units.temperature_2m_max}`;
    setTimeout(()=>{play_selection_page_animation("#city-weather-page #city-weather-page-daily-div .weather-page-current-temp-div")}, weather_page_count)
    weather_page_count += delay_time

    //adding todays date
    daily_temp_div.querySelector("#city-weather-page-daily-temp-date").innerHTML = `Todays date is: ${currentDate}`

    //daily info div
    load_other_info(0,weather_info)

}

//loading the daily info and the hourly info
function load_other_info(date, weather_info) {
    console.log(date,weather_info)


    //filling out the daily info div
    const daily_info_div = document.querySelector("#city-weather-page #city-weather-page-daily-div .city-weather-page-daily-info-div");
    daily_info_div.querySelector(".row .col-12 span").innerHTML = `${weather_info.daily.time[date]}`;
    daily_info_div.querySelector("#sunrise b").innerHTML = `${weather_info.daily.sunrise[date].substring(11,16)}`
    daily_info_div.querySelector("#sunset b").innerHTML = `${weather_info.daily.sunset[date].substring(11,16)}`
    daily_info_div.querySelector("#maxTemperature b").innerHTML = `${weather_info.daily.temperature_2m_max[date]}${weather_info.daily_units.temperature_2m_max}`
    daily_info_div.querySelector("#minTemperature b").innerHTML = `${weather_info.daily.temperature_2m_min[date]} ${weather_info.daily_units.temperature_2m_max}`
    daily_info_div.querySelector("#uvIndex b").innerHTML = `${weather_info.daily.uv_index_max[date]}`
    daily_info_div.querySelector("#precipitationSum b").innerHTML = `${weather_info.daily.precipitation_sum[date]} ${weather_info.daily_units.precipitation_sum}`
    

    //filling out hourly div
    const hourly_table = document.querySelector("#city-weather-page #city-weather-page-hourly-div #hourly-info-table");
    const time_row = hourly_table.querySelector("#time")
    time_row.innerHTML = "";

    const start_point = date*24;
    const end_point = start_point+24;

    //adding function to buttons 
    const hourly_div = document.querySelector("#city-weather-page #city-weather-page-hourly-div");
    hourly_div.querySelector("#temperature-button").addEventListener("click", ()=>{change_hourly_div_display("temperature",weather_info.hourly.temperature_2m.slice(start_point,end_point))});
    hourly_div.querySelector("#humidity-button").addEventListener("click", ()=>{change_hourly_div_display("humidity",weather_info.hourly.relativehumidity_2m.slice(start_point,end_point))});
    hourly_div.querySelector("#precipitation-sum-button").addEventListener("click", ()=>{change_hourly_div_display("precipitationSum",weather_info.hourly.precipitation.slice(start_point,end_point))});

    for (let i=start_point;i<end_point;i++) {
        //inserting time data
        let time_data = document.createElement("td");
        time_data.innerHTML = `${weather_info.hourly.time[i].substring(11,17)}`;
        time_row.append(time_data);
    };
    change_hourly_div_display("temperature",weather_info.hourly.temperature_2m.slice(start_point,end_point),date);
    if (access_page_first === false){
        document.querySelector("#city-weather-page #city-weather-page-daily-div .city-weather-page-daily-info-div").style.display = "none";
        setTimeout(()=>{play_selection_page_animation("#city-weather-page #city-weather-page-daily-div .city-weather-page-daily-info-div");},weather_page_count)
        weather_page_count += delay_time;
        setTimeout(()=>{play_selection_page_animation("#city-weather-page #city-weather-page-hourly-div")},weather_page_count)
        access_page_first = true;
    }
}


//adding functinoality to the hourly div
function change_hourly_div_display (title, data){
    const data_row = document.querySelector("#city-weather-page #city-weather-page-hourly-div .row .col-9 #data-points")
    data_row.innerHTML = "";

    //changing button classes to set active one
    const hourly_div = document.querySelector("#city-weather-page #city-weather-page-hourly-div");
    hourly_div.querySelectorAll("#temperature-button, #humidity-button, #precipitation-sum-button").forEach((element)=>{
        element.className = "button-inactive"
    })
    if (access_page_first === false){
        hourly_div.style.display = "none";
    }
    
    //inserting data into the table
    for (let i=0;i<data.length;i++){
        let data_point = document.createElement("td");
        data_point.innerHTML = `${data[i]}`
        data_row.append(data_point);
    }

    //writing the header
    const header = document.querySelector("#city-weather-page #city-weather-page-hourly-div .row .col-3 #data-header th");
    header.innerHTML = "";
    if (title === "temperature"){
        header.innerHTML = "Temperature(°C):";
        hourly_div.querySelector("#temperature-button").className = "button-active";

    } else if (title === "humidity"){
        header.innerHTML = "Humidity(%):";
        hourly_div.querySelector("#humidity-button").className = "button-active";
    } else if (title === "precipitationSum"){
        header.innerHTML = "Precipitation Sum(mm):"
        hourly_div.querySelector("#precipitation-sum-button").className = "button-active";
    }
    
}

async function change_city_save(action, city_id){
    const save_button = document.querySelector("#city-weather-page #save-city-button-wrapper-div #city-weather-page-save-button")
    const new_save_button = save_button.cloneNode(true)
    save_button.parentNode.replaceChild(new_save_button, save_button)
    let change_save_data = await fetch("saving_city",{
        method: "POST",
        body: JSON.stringify({
            action: action,
            id: city_id
        })
    })
    let change_save_data_json = await change_save_data.json();
    console.log(change_save_data_json)

    let save_action

    if (action === "save"){
        new_save_button.innerHTML = "Unsave"
        save_action = "unsave"
    } else if (action === "unsave"){
        new_save_button.innerHTML = "Save"
        save_action = "save"
    }

    new_save_button.addEventListener("click", ()=>{change_city_save(save_action,city_id)})
}

async function load_saved_cities(){
    let data = await fetch("saved_cities");
    let data_json = await data.json();
    console.log(data_json.saved_cities)
    selection_page(data_json.saved_cities, "saved-cities")
}