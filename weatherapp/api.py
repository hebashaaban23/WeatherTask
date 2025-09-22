import frappe, requests
from frappe.utils import now_datetime
from frappe import _

OWM_URL = "https://api.openweathermap.org/data/2.5/weather"

def _get_settings():
    return frappe.get_single("Weather Settings")

def fetch_weather(city, api_key):
    try:
        r = requests.get(OWM_URL, params={"q": city, "appid": api_key, "units": "metric"}, timeout=10)
        if r.status_code == 401:
            frappe.throw(_("Invalid API key"))
        r.raise_for_status()
        data = r.json()
        temp = data.get("main", {}).get("temp")
        hum = data.get("main", {}).get("humidity")
        return {"city": city, "temperature": float(temp), "humidity": float(hum), "fetched_at": now_datetime()}
    except requests.exceptions.RequestException as e:
        frappe.throw(_("Network error: {0}").format(str(e)))

@frappe.whitelist()
def get_current_weather():
    settings = _get_settings()
    city = (settings.city or "Riyadh").strip()
    doc = frappe.get_doc("Weather", city) if frappe.db.exists("Weather", city) else frappe.get_doc({"doctype":"Weather","city":city}).insert(ignore_permissions=True)
    try:
        reading = fetch_weather(city, settings.api_key)
        doc.update_reading(reading["temperature"], reading["humidity"])
        return {"ok": True, "city": city, "temperature": reading["temperature"], "humidity": reading["humidity"], "last_updated_on": str(doc.last_updated_on)}
    except Exception as e:
        return {"ok": False, "city": doc.city, "temperature": doc.temperature, "humidity": doc.humidity, "last_updated_on": str(doc.last_updated_on) if doc.last_updated_on else None, "error": str(e)}
