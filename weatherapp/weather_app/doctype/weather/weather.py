import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime
from frappe import _

class Weather(Document):
    def validate(self):
        if not self.city or not str(self.city).strip():
            frappe.throw(_("City name must not be empty"))
        self.city = self.city.strip()

    def update_reading(self, temperature, humidity):
        self.temperature = float(temperature) if temperature is not None else None
        self.humidity = float(humidity) if humidity is not None else None
        self.last_updated_on = now_datetime()
        self.save(ignore_permissions=True)
