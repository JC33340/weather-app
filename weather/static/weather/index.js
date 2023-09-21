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
    fetch(`https://api.api-ninjas.com/v1/city?name=${city}`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            'X-Api-Key': 'rOd9xgW3XzIvsnKX4GA9yQ==BuY0s4RkNJJYuZkU'
        }
    })
    .then(res => res.json())
    .then(data => get_city_data(data))

}; 

function get_city_data(data){
    
}

function get_weather_data(longitude, latitude){
    fetch("https://api.open-meteo.com/v1/forecast?latitude=35&longitude=105&hourly=temperature_2m")
    .then(res => res.json())
    .then(data => {
        console.log(data)
        return data;
    })

};