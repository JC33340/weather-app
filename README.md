# weather-app

#### Distinctiveness and Complexity
This project brings distinctiveness as I have used REST APIs to query external data, as well as created a more reactive and interesting browser interface for the user. Within the weather-app folder, there are further newly created files which will be explained here.

##### Static folder

The static folder contains the CSS and the JavaScript code for the project. The css is divided into different files to separate their affiliations with each of the pages that will be loaded, in order to better organize and recognize their individual associations. All of the JavaScript is included into one folder, as the main page of the app is designed to be single page and is the only responsive one.

Within the index.js file there are several functions which manage the REST API’s being sent to acquire general and weather information about cities based on the user’s input. Then functions control and display a number of related cities, showing their names, countries and populations. Further clicking into these cities will reveal a 7-day forecast of the weather. Further functions control the interactive aspects of this page, with the date buttons at the top allowing you to alternate the data shown in the page depending on the date that is clicked. Further down the page there is a table showing the temperature, including buttons which changes the content of the table between temperature, precipitation, and humidity. 

There is also a saved city page displayed on the navbar for users which are signed in. This page accesses the same functionality as the search page, however, makes an API call to the internal server to retrieve the data about the pages the user has saved, allowing a more personalized aspect. 

##### Django Content

There are 3 Django models: one for the user; one for cities in general; one for user saved cities. These are only used if there is a user in session. The cities model saves the data of the individual cities, storing information about its location, country, and population, this allows for easier access of information. Then in the user saved cities, this uses the user ids and city ids to relate them to each other allowing signed in users to save cities. 

In the Views.py file there are functions which control the basic registration, login and logout functions of the application for users who want to be able to save cities. Additionally, there are the functions which respond to the API calls made by the JavaScript frontend. These involve the creation of data points into the models as well as the deleting and retrieval of information from SQL to relay to the frontend. 

##### templates

There are only a few templates, the layout containing the navbar of the pages. The index which is the main page of the single page application, is divided into sections allowing for easier JavaScript. The login and register page are create the user model and session. 

