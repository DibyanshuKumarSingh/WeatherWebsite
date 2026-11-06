/* =========================================
   COMMON LIVE LOCATION
   Used by Home, Weather and Forecast
========================================= */

window.getLiveLocation = function () {

  return new Promise((resolve, reject) => {

    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported."));
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        console.log("Live Location:", location);

        resolve(location);

      },

      (error) => {

        console.error("Location Error:", error.message);

        reject(error);

      },

      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }

    );

  });

};