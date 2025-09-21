frappe.provide("weatherapp");

(function () {

  if (window.__weather_bar_initialized) return;
  window.__weather_bar_initialized = true;

  function createBar() {
    const el = document.createElement("div");
    el.id = "weather-bottom-bar";
    el.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1030;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 8px 12px;
      background: rgba(0,0,0,0.85);
      color: #fff;
      font-size: 14px;
      backdrop-filter: blur(4px);
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
    `;

    el.innerHTML = `
      <span style="font-size: 16px;">🌤️</span>
      <span id="wb-city" style="font-weight: 600;">—</span>
      <span style="opacity: 0.7;">•</span>
      <span id="wb-temp" style="font-weight: 500;">-- °C</span>
      <span style="opacity: 0.7;">•</span>
      <span id="wb-hum" style="font-weight: 500;">-- %</span>
      <span style="opacity: 0.6; font-size: 12px;" id="wb-upd"></span>
    `;
    document.body.appendChild(el);
    return el;
  }

  function setData(d) {
    const $city = document.getElementById("wb-city");
    const $temp = document.getElementById("wb-temp");
    const $hum  = document.getElementById("wb-hum");
    const $upd  = document.getElementById("wb-upd");
    
    if (!$city) return;

    $city.textContent = d.city || "—";
    $temp.textContent = typeof d.temperature === "number" ? `${d.temperature.toFixed(1)} °C` : "-- °C";
    $hum.textContent  = typeof d.humidity === "number" ? `${d.humidity.toFixed(0)} %` : "-- %";
    $upd.textContent  = d._time ? ` • ${d._time}` : "";
  }

  async function refresh() {
    try {
      const r = await frappe.call("weatherapp.weatherapp.api.weather.get_current_weather");
      const d = r && r.message ? r.message : {};
      const now = new Date();
      d._time = now.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
      setData(d);
    } catch (e) {
      console.log("Weather refresh failed:", e);
   
    }
  }


  function init() {
    if (!document.getElementById("weather-bottom-bar")) {
      createBar();
    }
    refresh();
  }


  $(document).ready(init);
  frappe.router.on('change', init);
  
 
  setInterval(refresh, 120000);
})();