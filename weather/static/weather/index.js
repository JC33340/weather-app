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

    for(let i = 0; i < data.length; i++) {
        let selection_page_city_div = document.createElement("div");
        selection_page_city_div.setAttribute("id", "selection-page-city-div")

        let selection_page_city_country_name  = document.createElement("b");
        selection_page_city_country_name.setAttribute("id", "selection-page-city-div-title")
        selection_page_city_country_name.innerHTML = `${data[i].name}, ${data[i].country}\n`;

        let line_break = document.createElement("br");

        let selection_page_population = document.createElement("span");
        selection_page_population.innerHTML = `Population: ${data[i].population}`

        selection_page_city_div.append(selection_page_city_country_name, line_break, selection_page_population);

        city_selector_page.append(selection_page_city_div);
    }

}

/*function weather_data(city_location) {
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
    
};*/

/*function load_weather_page(city_general_info, weather_info) {
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
}*/