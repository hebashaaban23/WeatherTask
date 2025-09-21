# Copyright (c) 2025, heba shaaban and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class WeatherSettings(Document):
    def validate(self):
        if not self.api_key:
            frappe.throw("API Key must not be empty.")
        if not self.city or not self.city.strip():
            frappe.throw("City name must be a valid non-empty string.")
