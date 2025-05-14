const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const apiKey = "95d99161b648050e7c09e73645f7314d";
  const units = "imperial";

  const city = req.body.cityInput;
  const lat = req.body.latInput;
  const lon = req.body.lonInput;

  let url = "";

  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  } else {
    res.send("Please enter a city name or both latitude and longitude.");
    return;
  }

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);

      if (weatherData.cod !== 200) {
        res.send("Error: " + weatherData.message);
        return;
      }

      const cityName = weatherData.name;
      const temp = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const cloudiness = weatherData.clouds.all;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write(`<h1>Weather in ${cityName}</h1>`);
      res.write(`<h2>${description}</h2>`);
      res.write(`<p>Temperature: ${temp} °F</p>`);
      res.write(`<p>Humidity: ${humidity}%</p>`);
      res.write(`<p>Wind Speed: ${windSpeed} mph</p>`);
      res.write(`<p>Cloudiness: ${cloudiness}%</p>`);
      res.write(`<img src="${imageURL}">`);
      res.send();
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
