authenticateGfycat(); //avvio l'autenticazione oauth su GfyCat

const divs = document.querySelectorAll("article");
for (let div of divs) {
  fetchCityWeather(div.dataset.cardCity); //prendo i dati meteo per ogni città
}

//Functions

function fetchCityWeather(city) {
  const positions = {
    rome: { lat: "43", lon: "13" },
    london: { lat: "51", lon: "0" },
    copenaghen: { lat: "56", lon: "13" },
    barcellona: { lat: "41", lon: "2" },
    berlin: { lat: "53", lon: "13" },
    istanbul: { lat: "41", lon: "29" },
  };

  const apiKey = "cf110627f0c877cea6e34ba7604de194";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?&appid=" + apiKey;
  fetch(url + "&lat=" + positions[city].lat + "&lon=" + positions[city].lon)
    .then(onResponse, onError)
    .then(onJson)
    .then((info) => {
      //assegno ad ogni città il corretto valore di meteo e temperatura
      let cityDiv;
      for (let div of divs)
        if (div.dataset.cardCity === city) {
          cityDiv = div;
          break;
        }

      cityDiv.querySelector("h3").innerHTML = info.weather;
      cityDiv.querySelector("h4").innerHTML = info.temperature + "°";
    });
}

function onResponse(response) {
  return response.json();
}

function onError(error) {
  console.log(error);
  cityDiv.querySelector("h3").innerHTML = "Error";
  cityDiv.querySelector("h4").innerHTML = "Error";
}

function onJson(json) {
  const temperature = Math.trunc(json.main.temp - 273.15);
  const weather = json.weather[0].description;

  return { temperature: temperature, weather: weather };
}

function authenticateGfycat() {
  const id = "2_RONetw"; //
  const secret =
    "b_eiqVFsmUhpsDHz81swcz5GZ5PkFWks1G96di2wNrz-icIfg1N56crSmd2hnyqz";
  const request_body = {
    grant_type: "client_credentials",
    client_id: id,
    client_secret: secret,
  };

  let body = JSON.stringify(request_body);

  const url = "https://api.gfycat.com/v1/oauth/token";

  fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then(onResponse, onErrorAuth)
    .then(onJsonAuth);
}

function onErrorAuth(err) {
  console.log(err);
  GfyReactions(null);
  return null;
}

function onJsonAuth(res) {
  GfyReactions(res["access_token"]);
}

function GfyReactions(token) {
  const url = "https://api.gfycat.com/v1/gfycats/delectabledecenthound";

  fetch(url, {
    method: "get",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(onResponse, onErrorGif)
    .then(onJsonGif);
}

function onErrorGif(err) {
  console.log(err);
  const img = document.querySelector(".farewell-gif img");
  img.src = "./img/error.gif";
}

function onJsonGif(json) {
  const img = document.querySelector(".farewell-gif img");
  img.src = json["gfyItem"]["url"];
}
