import frappe
from weatherapp.api.weather import _get_settings, _fetch_weather_from_weatherapi, _update_and_insert_weather

def sync_weather():
    try:
        api_key, city = _get_settings()
        data = _fetch_weather_from_weatherapi(api_key, city)
        _update_and_insert_weather(data)
        frappe.logger().info(f"[weatherapp] Updated {city}: {data}")
    except Exception as e:
        frappe.logger().error(f"[weatherapp] sync_weather failed: {e}")
