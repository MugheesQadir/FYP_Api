import math
from collections import defaultdict
from datetime import datetime, time

from Model.CompartmentApplianceLog import CompartmentApplianceLog
from Model.Geyser import Geyser
from Model.Appliance import Appliance
from Model.ApplianceSchedule import ApplianceSchedule
from Model.Compartment import Compartment
from Model.CompartmentAppliance import CompartmentAppliance
from Model.CompartmentLock import CompartmentLock
from Model.Home import Home
from Model.LockSchedule import LockSchedule
from config import db

# relay_state = {"state": 0}
water_level_state = {"state": 20}
temperature_level_state = {"state": 50}
Ignitor_state = {"state": 0}
panic_alert_state = {"state":0}

class HardwareController:

    @staticmethod
    def set_water_level_statee(data):
        try:
            if "state" in data:  # Validate state (0 or 1)
                water_level_state["state"] = data["state"]
                return {"message": "water level state updated", "current_state": water_level_state["state"]}
            return {"error": "Invalid state."}
        except Exception as e:
            return {"error": f"An error occurred: {str(e)}"}

    @staticmethod
    def get_water_level_state():
        return {"state": water_level_state["state"]}

    @staticmethod
    def get_Ignitor_state():
        return {"state": Ignitor_state["state"]}


    @staticmethod
    def set_Ignitor_state(data):
        try:
            if "state" in data:  # Validate state (0 or 1)
                Ignitor_state["state"] = data["state"]
                return {"message": "ignitor state updated", "current_state": Ignitor_state["state"]}
            return {"error": "Invalid state."}
        except Exception as e:
            return {"error": f"An error occurred: {str(e)}"}


    @staticmethod
    def set_temperature_level_state(data):
        try:
            if "state" in data:  # Validate state (0 or 1)
                temperature_level_state["state"] = data["state"]
                return {"message": "Temperature level state updated", "current_state": temperature_level_state["state"]}
            return {"error": "Invalid state."}
        except Exception as e:
            return {"error": f"An error occurred: {str(e)}"}


    @staticmethod
    def get_temperature_level_state():
        return {"state": temperature_level_state["state"]}

    @staticmethod
    def updateCompartmentAppliancesStatus(data):
        try:
            appliance = CompartmentAppliance.query.filter_by(id=data["id"], validate=1).first()
            appliancees = Appliance.query.filter_by(id=appliance.appliance_id, validate = 1).first()
            if not appliance:
                return {'error': f"Compartment Appliance not found"}

            appliance.status = data["status"]
            db.session.commit()

            now = datetime.now()

            if data["status"] == 1:
                day_of_week = now.isoweekday()

                new_log = CompartmentApplianceLog(
                    compartment_appliance_id=data["id"],
                    start_time=now,
                    end_time=None,
                    duration_minutes=None,
                    date=now.date(),
                    day_=day_of_week,
                    validate=1
                )
                db.session.add(new_log)

            elif data["status"] == 0:
                latest_log = CompartmentApplianceLog.query.filter_by(
                    compartment_appliance_id=data["id"],
                    end_time=None,
                    validate=1
                ).order_by(CompartmentApplianceLog.start_time.desc()).first()

                if latest_log:
                    latest_log.end_time = now
                    # duration = int((latest_log.end_time - latest_log.start_time).total_seconds() / 60)
                    duration_seconds = (latest_log.end_time - latest_log.start_time).total_seconds()
                    duration = max(1, math.ceil(duration_seconds / 60))
                    latest_log.duration_minutes = duration
                    latest_log.messagee = "Remotely Off"
                    latest_log.consumption = int((duration * appliancees.power)/60)

            db.session.commit()
            return {'success': f"Status and logs updated for appliance ID {data['id']}"}

        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}


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
                appliancees = Appliance.query.filter_by(id=appliance.appliance_id, validate=1).first()
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
                now = datetime.now()

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

                        day_of_week = now.isoweekday()

                        new_log = CompartmentApplianceLog(
                            compartment_appliance_id=appliance.id,
                            start_time=now,
                            end_time=None,
                            duration_minutes=None,
                            date=now.date(),
                            day_=day_of_week,
                            validate=1
                        )
                        db.session.add(new_log)

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

                        latest_log = CompartmentApplianceLog.query.filter_by(
                            compartment_appliance_id=appliance.id,
                            end_time=None,
                            validate=1
                        ).order_by(CompartmentApplianceLog.start_time.desc()).first()

                        if latest_log:
                            latest_log.end_time = now
                            # duration = int((latest_log.end_time - latest_log.start_time).total_seconds() / 60)
                            duration_seconds = (latest_log.end_time - latest_log.start_time).total_seconds()
                            duration = max(1, math.ceil(duration_seconds / 60))
                            latest_log.duration_minutes = duration
                            latest_log.messagee = "Schedule Off"
                            latest_log.consumption = int((duration * appliancees.power) / 60)

            db.session.commit()
            return {
                "success": "checked",
                "updated": updated
            }
        except Exception as e:
            return {
                "error": str(e),
            }

    @staticmethod
    def check_lock_schedule_update_status():
        try:
            current_time = datetime.now().strftime('%H:%M')
            current_day_number = datetime.now().isoweekday()  # Monday is 1, Sunday is 7
            updated = []

            schedules = LockSchedule.query.filter_by(validate=1).all()

            for sched in schedules:
                locks = CompartmentLock.query.get(sched.compartment_lock_id)
                if not locks:
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
                    if locks.status != 1:
                        locks.status = 1
                        db.session.commit()
                        updated.append({
                            "id": locks.id,
                            "port": locks.port,
                            "status": 1,
                            "name": locks.name,
                            "schedule_id": sched.id
                        })

                # End time condition
                elif end_time == current_time:
                    if locks.status != 0:
                        locks.status = 0
                        db.session.commit()
                        updated.append({
                            "id": locks.id,
                            "port": locks.port,
                            "status": 0,
                            "name": locks.name,
                            "schedule_id": sched.id
                        })

            return {
                "success": "checked",
                "updated":updated
            }
        except Exception as e:
            return {
                "error": str(e),
            }

    @staticmethod
    def updateGasCylinderStatusWith_HomeID(data):
        try:
            geyser = Geyser.query.filter_by(home_id=data["home_id"], validate=1).first()
            if geyser is None:
                return {'error': f"Geyser source not found"}

            if geyser is not None:
                geyser.gas_status = data['gas_status']
                geyser.cylinder_status = data['cylinder_status']
                db.session.commit()
                return {'success': f"Geyser source with id {data['home_id']} updated successfully"}
            else:
                return {'error': f"Geyser source not found"}
        except Exception as a:
            return str(a)

    @staticmethod
    def get_geyser_by_Home_id(id):
        try:
            result = (
                db.session.query(Geyser, Home)
                .join(Home, Home.id == Geyser.home_id)
                .filter(Geyser.home_id == id, Geyser.validate == 1)
                .first()
            )
            if result is None:
                return {'error': 'Geyser not found'}

            geyser, homes = result
            if geyser is not None:
                return {"id": geyser.id, "name": geyser.name,
                        "gas_status":geyser.gas_status,
                        "cylinder_status":geyser.cylinder_status}

        except Exception as e:
            return (str(e))

    @staticmethod
    def auto_Off_On_High_Load(threshold=100):  # watt-hour
        try:
            now = datetime.now()
            active_logs = CompartmentApplianceLog.query.filter_by(end_time=None).all()
            turned_off_list = []

            for log in active_logs:
                comApp = CompartmentAppliance.query.get(log.compartment_appliance_id)
                if comApp:
                    App = Appliance.query.get(comApp.appliance_id)
                    power = App.power  # in watts
                    duration_minutes = (now - log.start_time).seconds // 60

                    # Calculate consumption: power (W) * time (min) / 60 => Wh
                    consumption = (power * duration_minutes) / 60.0

                    if consumption >= threshold:
                        # Update log
                        log.end_time = now
                        log.duration_minutes = duration_minutes
                        log.consumption = consumption
                        log.messagee = "Over Consumption"

                        # Update status
                        comApp.status = 0

                        db.session.commit()

                        turned_off_list.append({
                            "compartment_appliance_id": comApp.id,
                            "power": power,
                            "duration_minutes": duration_minutes,
                            "consumption": round(consumption, 2),
                            "turned_off_at": now.strftime('%Y-%m-%d %H:%M:%S')
                        })

            # ✅ Only return message if any appliance was turned off
            if turned_off_list:
                return {
                    "success": "Appliances turned off due to over-consumption.",
                    "turned_off": turned_off_list
                }

            # ❌ Otherwise, return nothing (empty response)
            return {}

        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def check_peak_time_Alert_and_suggest_best_Time():
        try:
            now = datetime.now().time()

            # Peak hours: 9:00 AM – 12:00 PM and 4:00 PM – --:00 PM
            morning_start = time(9, 0)
            morning_end = time(12, 0)
            evening_start = time(16, 0)
            evening_end = time(23, 0)

            if (morning_start <= now <= morning_end) or (evening_start <= now <= evening_end):
                return {
                    "warning": " this is peak hours in Wapda! Light is very expensive. so you want to try to on your appliance afet the peak our. OK.",
                    "Now time": now.strftime("%H:%M")
                }

            return {}  # No warning outside peak hours

        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def set_panic_alert_state(data):
        try:
            if "state" in data:  # Validate state (0 or 1)
                panic_alert_state["state"] = data["state"]
                return {"message": "Panic Alert state updated", "current_state": panic_alert_state["state"]}
            return {"error": "Invalid state."}
        except Exception as e:
            return {"error": f"An error occurred: {str(e)}"}

    @staticmethod
    def get_panic_alert_state():
        state = panic_alert_state["state"]
        panic_alert_state["state"] = 0
        if state == 1:
            return {"state": state}
        else:
            return {}




