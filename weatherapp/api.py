import frappe, requests
from frappe.utils import now_datetime
from frappe import _

OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"

def _get_settings():
    settings = frappe.get_single("Weather Settings")
    if not settings.api_key:
        frappe.throw(_("Please set the API Key in Weather Settings."))
    city = (settings.default_city or "Riyadh").strip()
    return settings.api_key, city

def _fetch_weather(api_key, city):
    res = requests.get(OPENWEATHER_URL,
        params={"q": city, "appid": api_key, "units": "metric"},
        timeout=10)
    if res.status_code == 401:
        frappe.throw(_("Invalid API Key for OpenWeatherMap."))
    res.raise_for_status()
    data = res.json()
    return {
        "city": city,
        "temperature": float(data["main"]["temp"]),
        "humidity": float(data["main"]["humidity"]),
    }

def _upsert_weather(doc_dict):
    name = frappe.db.get_value("Weather", {"city": doc_dict["city"]}, "name")
    now_dt = now_datetime()
    if name:
        doc = frappe.get_doc("Weather", name)
        changed = False
        if doc.temperature != doc_dict["temperature"]:
            doc.temperature = doc_dict["temperature"]; changed = True
        if doc.humidity != doc_dict["humidity"]:
            doc.humidity = doc_dict["humidity"]; changed = True
        if changed:
            doc.last_updated_on = now_dt
            doc.save(ignore_permissions=True)
        return doc.name, changed
    else:
        doc = frappe.get_doc({
            "doctype": "Weather",
            "city": doc_dict["city"],
            "temperature": doc_dict["temperature"],
            "humidity": doc_dict["humidity"],
            "last_updated_on": now_dt,
        }).insert(ignore_permissions=True)
        return doc.name, True

@frappe.whitelist()
def get_current_weather():
    api_key, city = _get_settings()
    data = _fetch_weather(api_key, city)
    _upsert_weather(data)
    return data
