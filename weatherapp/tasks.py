import frappe
from .api import _get_settings, fetch_weather

def update_default_city_weather():
    settings = _get_settings()
    city = (settings.city or "Riyadh").strip()
    doc = frappe.get_doc("Weather", city) if frappe.db.exists("Weather", city) else frappe.get_doc({"doctype": "Weather", "city": city}).insert(ignore_permissions=True)
    try:
        reading = fetch_weather(city, settings.api_key)
        doc.update_reading(reading["temperature"], reading["humidity"])
        frappe.logger().info(f"[weatherapp] Updated {city}: {reading}")
    except Exception as e:
        frappe.logger().warning(f"[weatherapp] Failed update {city}: {e}")
