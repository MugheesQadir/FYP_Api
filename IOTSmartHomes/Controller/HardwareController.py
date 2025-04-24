from datetime import datetime

from Model.Appliance import Appliance
from Model.ApplianceSchedule import ApplianceSchedule
from Model.Compartment import Compartment
from Model.CompartmentAppliance import CompartmentAppliance
from Model.CompartmentLock import CompartmentLock
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

    @staticmethod
    def updateCompartmentLockStatus(data):
        try:
            compartment_lock = CompartmentLock.query.filter_by(id=data["id"], validate=1).first()
            if compartment_lock is None:
                return {'error': f"Compartment Lock not found"}

            if compartment_lock is not None:
                compartment_lock.status = data['status']
                db.session.commit()
                return {'success': f"Compartment Lock with id {data['id']} updated successfully"}
            else:
                return {'error': f"Compartment Lock not found"}
        except Exception as a:
            return str(a)

    from datetime import datetime

    @staticmethod
    def check_schedule_update_status():
        try:
            current_time = datetime.now().strftime('%H:%M')
            current_day_number = datetime.now().isoweekday()  # Monday is 1, Sunday is 7
            updated = []

            schedules = ApplianceSchedule.query.filter_by(validate=1).all()

            for sched in schedules:
                appliance = CompartmentAppliance.query.get(sched.table_id)
                if not appliance:
                    continue

                # Get list of valid days for this schedule
                valid_days = str(sched.days)
                valid_days = [int(day.strip()) for day in valid_days if day.strip().isdigit()]

                # Skip if today is not in the schedule's valid days
                if current_day_number not in valid_days:
                    continue

                start_time = sched.start_time.strftime('%H:%M')
                end_time = sched.end_time.strftime('%H:%M')

                # Start time condition
                if start_time == current_time:
                    if appliance.status != 1:
                        appliance.status = 1
                        db.session.commit()
                        updated.append({
                            "id": appliance.id,
                            "port": appliance.port,
                            "status": 1,
                            "name": appliance.name,
                            "schedule_id": sched.id
                        })

                # End time condition
                elif end_time == current_time:
                    if appliance.status != 0:
                        appliance.status = 0
                        db.session.commit()
                        updated.append({
                            "id": appliance.id,
                            "port": appliance.port,
                            "status": 0,
                            "name": appliance.name,
                            "schedule_id": sched.id
                        })

            return {
                "success": "checked",
                "updated": updated
            }
        except Exception as e:
            return {
                "error": str(e),
            }

