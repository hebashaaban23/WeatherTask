# Copyright (c) 2025, heba shaaban and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Weather(Document):
	def validate(self):
		# Ensure city name is unique
		existing = frappe.db.get_value("Weather", {"city": self.city, "name": ("!=", self.name)})
		if existing:
			frappe.throw(f"Weather record for city '{self.city}' already exists.")
		
		# Update last_updated_on timestamp
		if not self.last_updated_on:
			self.last_updated_on = frappe.utils.now()
