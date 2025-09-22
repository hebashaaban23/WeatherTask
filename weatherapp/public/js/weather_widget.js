// weatherapp/public/js/weather_bottom_bar.js
(() => {
  const ID = "weather-bottom-bar";

  // اختر ثيم: 'midnight' | 'emerald' | 'sand' | 'sky' | 'rose' | 'violet' | 'custom'
  const THEME = "emerald";

  // لو عايز ألوانك الخاصة، غيّر قيم custom تحت وخلي THEME = 'custom'
  const THEMES = {
    midnight: { bg: "#0b1220cc", border: "#1f2a44", text: "#e5e7eb", subtext:"#cbd5e1", accent: "#60a5fa" },
    emerald:  { bg: "#052e25cc", border: "#0d4a3a", text: "#ecfdf5", subtext:"#a7f3d0", accent: "#34d399" },
    sand:     { bg: "#3b2f0bcc", border: "#6b5a2e", text: "#fffbeb", subtext:"#fde68a", accent: "#f59e0b" },
    sky:      { bg: "#0c1f3acc", border: "#1d3666", text: "#e0f2fe", subtext:"#bae6fd", accent: "#38bdf8" },
    rose:     { bg: "#2a0e15cc", border: "#4d1c20", text: "#fee2e2", subtext:"#fecaca", accent: "#fb7185" },
    violet:   { bg: "#1a102ecc", border: "#2d2255", text: "#ede9fe", subtext:"#ddd6fe", accent: "#a78bfa" },
    custom:   { bg: "#101418cc", border: "#22303c", text: "#f2f4f8", subtext:"#c4cbd3", accent: "#4dd0e1" }
  };

  function cssForTheme(t){
    return `
      #${ID}{
        position:fixed;left:0;right:0;bottom:0;height:44px;
        display:flex;align-items:center;gap:12px;padding:0 14px;
        background:${t.bg}; color:${t.text}; z-index:9999;
        border-top:1px solid ${t.border};
        box-shadow:0 -6px 18px rgba(0,0,0,.25);
        -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        font: 500 13px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      }
      body{ padding-bottom:44px !important; }
      #${ID} .dot{
        width:8px;height:8px;border-radius:50%;background:${t.accent};display:inline-block;box-shadow:0 0 0 2px ${t.border};
      }
      #${ID} .muted{ opacity:.85; color:${t.subtext}; }
      #${ID} .chip{
        display:inline-flex;align-items:center;gap:6px;
        padding:6px 10px;border-radius:999px;
        background: rgba(255,255,255,.06);
        border:1px solid ${t.border};
      }
      #${ID} .chip .value{ font-weight:700; color:${t.accent}; }
      #${ID} .spacer{ margin-left:auto }
      #${ID} .gear{
        border:none; background:transparent; color:${t.subtext}; cursor:pointer;
        display:inline-flex; align-items:center; gap:6px; padding:6px 8px; border-radius:8px;
        border:1px solid transparent;
      }
      #${ID} .gear:hover{ color:${t.text}; border-color:${t.border}; background: rgba(255,255,255,.06); }
    `;
  }

  function ensureStyle(theme){
    const sid = ID+"-style";
    const s = document.getElementById(sid) || Object.assign(document.createElement('style'), { id: sid });
    s.textContent = cssForTheme(theme);
    if(!s.parentNode) document.head.appendChild(s);
  }

  function render(data, theme){
    ensureStyle(theme);
    let el = document.getElementById(ID);
    if(!el){
      el = document.createElement('div'); el.id = ID; document.body.appendChild(el);
    }
    const t = data?.temperature ?? "—";
    const h = data?.humidity ?? "—";
    const c = data?.city ?? "Riyadh";
    const u = (window.frappe?.datetime?.str_to_user && data?.last_updated_on)
      ? frappe.datetime.str_to_user(String(data.last_updated_on))
      : (data?.last_updated_on ?? "—");

    el.innerHTML = `
      <span class="dot"></span>
      <span><b>${c}</b> <span class="muted">Weather</span></span>
      <span class="chip">🌡️ <span class="label muted">Temp</span> <span class="value">${t}°C</span></span>
      <span class="chip">💧 <span class="label muted">Humidity</span> <span class="value">${h}%</span></span>
      <span class="spacer"></span>
      <span class="muted">Updated: ${u}</span>
      <button class="gear" title="Open Weather Workspace" aria-label="Open Weather Workspace">⚙︎</button>
    `;

    el.querySelector(".gear")?.addEventListener("click", () => {
      if (window.frappe?.set_route) frappe.set_route("workspace", "WeatherWorkspace");
    });
  }

  async function load(){
    try {
      const r = await frappe.call('weatherapp.api.get_current_weather', {});
      render(r?.message || {}, THEMES[THEME] || THEMES.midnight);
    } catch(e){
      console.warn("weatherapp: fetch failed", e);
      render({}, THEMES[THEME] || THEMES.midnight);
    }
  }

  function boot(){
    load();
    window.frappe?.router?.on?.('change', () => load());
    setInterval(load, 60_000);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive'){
    setTimeout(boot, 0);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
