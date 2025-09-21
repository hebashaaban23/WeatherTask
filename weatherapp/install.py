import frappe

def after_install():
  
    create_weather_workspace()
    setup_default_settings()

def create_weather_workspace():
    if not frappe.db.exists("Workspace", "Weather"):
        workspace = frappe.new_doc("Workspace")
        workspace.title = "Weather"
        workspace.label = "Weather"  
        workspace.public = 1
        workspace.sequence_id = 0
        workspace.icon = "cloud"
        workspace.parent_page = ""
        workspace.hide_custom = 0
        workspace.is_hidden = 0
        workspace.module = "Weather App"
        
        workspace.append("links", {
            "label": "Weather List",
            "type": "Link",
            "link_type": "DocType",
            "link_to": "Weather",
            "is_query_report": 0
        })
        
        workspace.append("links", {
            "label": "Weather Settings", 
            "type": "Link",
            "link_type": "DocType",
            "link_to": "Weather Settings",
            "is_query_report": 0
        })
        
        workspace.insert(ignore_permissions=True)
        frappe.db.commit()
        print("✅ Weather Workspace created")

def setup_default_settings():
    if frappe.db.exists("DocType", "Weather Settings"):
        try:
            settings = frappe.get_single("Weather Settings")
            if not settings.default_city:
                settings.default_city = "Riyadh" 
                settings.save(ignore_permissions=True)
                frappe.db.commit()
                print("✅ Default city set to Riyadh")
        except Exception as e:
            print(f"Warning: Could not set default settings: {e}")