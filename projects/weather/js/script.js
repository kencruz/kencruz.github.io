$("document").ready(function () {
  // This is the location marker that we will be using on the map. Let's store a reference to it here so that it can be updated in several places.
  var myLat = null;
  var myLng = null;

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    myLat = crd.latitude.toFixed(5);
    myLng = crd.longitude.toFixed(5);

    console.log(myLat);
    console.log(myLng);

    var weatherAPI =
      "https://weather.kencruz.ca/weather?lat=" + myLat + "&lon=" + myLng;

    console.log(weatherAPI);

    function convertTemp(kelvin, unit) {
      switch (unit) {
        case "C":
          kelvin = Math.round(kelvin - 273.15);
          break;
        case "F":
          kelvin = (1.8 * (kelvin - 273) + 32).toPrecision(2);
          break;
      }
      return kelvin;
    }

    // If I alert myLocation here, the coordinates are there.
    $.getJSON(weatherAPI, function (data) {
      var { weather, forecast } = JSON.parse(JSON.stringify(data));
      var icon = weather.weather[0].id;
      var temp = weather.main.temp;
      var tempC = convertTemp(temp, "C");
      var tempF = convertTemp(temp, "F");
      var appLocation = weather.name;
      var appCountry = weather.sys.country;
      var weatherDescription = weather.weather[0].description;
      console.log(weather);
      console.log(appLocation);

      var streetViewUrl =
        "https://weather.kencruz.ca/streetview?lat=" + myLat + "&lon=" + myLng;
      console.log(streetViewUrl);

      var width;
      if ($(window).width() > 640) {
        width = 640;
      } else {
        width = $(window).width();
      }
      var length = Math.floor(width / 2);
      $(".background-blur").css(
        "background",
        'linear-gradient(rgba(127, 199, 228, 0.3), rgba(0, 0, 0, 0.0)), url("' +
          streetViewUrl +
          '")'
      );
      $(".background-blur").css("background-position", "center");
      $(".background-blur").css("background-size", "cover");
      $(".app").css("height", "" + length + "");
      $(".app").append(
        `<div class="col-xs-4 city main"><h5>Location:</h5><h5>${appLocation}, ${appCountry}</h5></div>`
      );
      $(".app").append(
        `<div class="col-xs-4 icon main"><i class="wi wi-owm-${icon}"></i><br><h5 class="weather-description">${weatherDescription}</h5></div>`
      );
      $(".app").append(
        `<div class="col-xs-4 temp main"><h5>Temperature:</h5><h5>${tempC}&deg C</h5></div>`
      );

      console.log(forecast);

      for (var i = 1; i < forecast.list.length; i++) {
        var theDay = convertDate(forecast.list[i].dt);
        var icon =
          "https://openweathermap.org/img/w/" +
          forecast.list[i].weather[0].icon +
          ".png";
        $(".grad").append(
          `<div id="${i}" class="col-sm-2">
              <ul>
                <li class="day">${theDay.day}</li>
                <li><img src="${icon}"></li>
                <li>${convertTemp(forecast.list[i].temp.day, "C")}&degC</li>
              <ul>
            </div>`
        );
      }
    });

    function convertDate(time) {
      var date = new Date(time * 1000);

      let dayName = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      return {
        month: date.getMonth(),
        date: date.getDate(),
        day: dayName[date.getDay()],
        year: date.getFullYear(),
      };
    }
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    var width;
    if ($(window).width() > 640) {
      width = 640;
    } else {
      width = $(window).width();
    }
    var length = Math.floor(width / 2);
    $(".background-blur").css({
      background:
        "linear-gradient(rgba(127, 199, 228, 0.3), rgba(0, 0, 0, 0.0))",
    });
    $(".background-blur").css("background-position", "center");
    $(".background-blur").css("background-size", "cover");
    $(".app").css("height", "" + length + "");
    $(".app").append(
      `<div class="main full-width"><i class="wi wi-na error"></i><br><h5 class="error">Error: Please reload and allow device to use location data.</h5></div>`
    );
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
});
