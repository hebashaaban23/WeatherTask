// assets/weather_app/js/weather_footer.js
frappe.ready(function() {
  // create container
  if (!document.getElementById('weather-footer')) {
    var footer = document.createElement('div');
    footer.id = 'weather-footer';
    footer.className = 'weather-footer';
    footer.innerHTML = '<div class="weather-inner">Loading weather…</div>';
    document.body.appendChild(footer);
  }

  function refreshWeather() {
    frappe.call({
      method: "weatherapp.api.get_current_weather",
      args: {},
      callback: function(r) {
        if (!r || !r.message) return;
        var m = r.message;
        var el = document.querySelector('#weather-footer .weather-inner');
        el.innerHTML = `<strong>${m.city}</strong> — ${m.temperature}°C, ${m.humidity}% (updated: ${m.last_updated_on})`;
      },
      error: function(err) {
        var el = document.querySelector('#weather-footer .weather-inner');
        el.innerHTML = 'Weather unavailable';
      }
    })
  }

  refreshWeather();
  // refresh every 5 minutes client-side too (optional)
  setInterval(refreshWeather, 5*60*1000);
});
