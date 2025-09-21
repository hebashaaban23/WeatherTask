import frappe
from .api import _get_settings, _fetch_weather, _upsert_weather

def sync_weather():
    try:
        api_key, city = _get_settings()
        data = _fetch_weather(api_key, city)
        _upsert_weather(data)
        frappe.logger().info(f"[weatherapp] Updated {city}: {data}")
    except Exception as e:
        frappe.logger().error(f"[weatherapp] sync_weather failed: {e}")
