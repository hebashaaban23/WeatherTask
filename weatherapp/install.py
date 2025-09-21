import frappe

def after_install():
    if not frappe.db.exists("Workspace", "WeatherWorkspace"):
        ws = frappe.new_doc("Workspace")
        ws.title = "WeatherWorkspace"
        ws.label = "WeatherWorkspace"
        ws.public = 1
        ws.append("links", {
            "label": "Weather List",
            "link_type": "DocType",
            "link_to": "Weather"
        })
        ws.append("links", {
            "label": "Weather Settings",
            "link_type": "DocType",
            "link_to": "Weather Settings"
        })
        ws.insert(ignore_permissions=True)

    settings = frappe.get_single("Weather Settings")
    if not settings.default_city:
        settings.default_city = "Riyadh"
        settings.save(ignore_permissions=True)
