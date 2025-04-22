from Model.Appliance import Appliance
from Model.Compartment import Compartment
from Model.CompartmentAppliance import CompartmentAppliance
from config import db

relay_state = {"state": 0}

class HardwareController:
    @staticmethod
    def set_relay_state(data):
        try:
            if data["state"] in [0, 1]:  # Validate state (0 or 1)
                relay_state["state"] = data["state"]
                return {"message": "Relay state updated", "current_state": relay_state["state"]}
            return {"error": "Invalid state. Must be 0 or 1."}
        except Exception as e:
            return {"error": f"An error occurred: {str(e)}"}

    @staticmethod
    def get_relay_state():
        return {"state": relay_state["state"]}

    @staticmethod
    def updateCompartmentAppliancesStatus(data):
        try:
            compartment_appliances = CompartmentAppliance.query.filter_by(id=data["id"], validate=1).first()
            if compartment_appliances is None:
                return {'error': f"Compartment Appliance not found"}

            if compartment_appliances is not None:
                compartment_appliances.status = data['status']
                db.session.commit()
                return {'success': f"Compartment Appliance with id {data['id']} updated successfully"}
            else:
                return {'error': f"Compartment Appliance not found"}
        except Exception as a:
            return str(a)