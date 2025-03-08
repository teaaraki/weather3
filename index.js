const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Displays index.html at root path
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Handles form submission
app.post("/", function (req, res) {
  console.log("Form data received:", req.body);
  var latitude = req.body.latInput;
  var longitude = req.body.lonInput;
  console.log("Latitude:", latitude, "Longitude:", longitude);

  //if one is missing
  if (!latitude || !longitude) {
    return res.send("<h1>Error: Latitude or Longitude is missing</h1>");
  }

  const units = "imperial";
  const apiKey = process.env.API_KEY || "f6f0e5116995571d5e13dec27a00bf92";

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;

  // get data from OpenWeather API
  https.get(url, function (response) {
    console.log(response.statusCode);

    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const city = weatherData.name;
    const weatherDescription = weatherData.weather[0].description;
    const cloudiness = weatherData.clouds.all;
    const icon = weatherData.weather[0].icon;
    const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    // Display output in a single response, original coding wasnt working, AI used to fix output
    res.send(`
          <h1>The weather in ${city}</h1>
          <h2>${weatherDescription}</h2>
          <p>Temperature: ${temp} °F</p>
          <p>Wind Speed: ${windSpeed} mph</p>
          <p>Humidity: ${humidity}%</p>
          <p>Cloudiness: ${cloudiness}%</p>
          <img src="${imageURL}" alt="Weather Icon">
        `);
  });
});

// Run server on port 3000 or available port
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
