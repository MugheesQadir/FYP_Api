import math

from Model.Appliance import Appliance
from Model.Compartment import Compartment
from Model.CompartmentAppliance import CompartmentAppliance
from Model.CompartmentApplianceLog import CompartmentApplianceLog
from Model.CompartmentLock import CompartmentLock
from Model.CompartmentLockLog import CompartmentLockLog
from Model.Home import Home
from Model.MainLog import MainLog
from datetime import datetime, date, time
from config import db

class LogMaintainController:

#--------------------------------------------------------------------------------

    @staticmethod
    def list_mainLog():
        try:
            mainLog = MainLog.query.where(MainLog.validate == 1).all()
            return [
                {    'id': p.id,
                     'messagee':p.messagee,
                     'date':p.date,
                     'log_time':p.log_time,
                     'triggered_by':p.triggered_by
                }
                    for p in mainLog]
        except Exception as e:
            return str(e)

    @staticmethod
    def add_mainLog_by_home_id(data):
        try:
            home_id = data.get('home_id')
            home = Home.query.filter_by(id=home_id, validate=1).first()
            if home is None:
                return {'error': 'Home not found'}

            now = datetime.now()

            main = MainLog(
                messagee=data["messagee"],
                triggered_by=data["triggered_by"],
                home_id=home_id,
                validate=1,
                log_time=now,
                date=now.date()  # only date part
            )
            db.session.add(main)
            db.session.commit()
            return {'success': "Log added successfully"}
        except Exception as a:
            return str(a)

    @staticmethod
    def list_main_logs_by_home_id(id):
        try:
            query = (
                    db.session.query(Home, MainLog)
                    .join(MainLog, MainLog.home_id == Home.id)
                    .filter(
                        MainLog.home_id == id,
                        Home.validate == 1
                    )
                    .all()
                )

            return [{
                    "id": ml.id,
                    "triggered_by": ml.triggered_by,
                    "log_time": ml.log_time.strftime("%H:%M:%S"),
                    "date": ml.date.strftime("%Y-%m-%d"),
                    "day": ml.date.strftime("%A"),
                    "messagee": ml.messagee,
                    "home_id": ml.home_id,
                    "home_name":h.name
                } for h, ml in query]

        except Exception as e:
            return str(e)


    @staticmethod
    def panic_button_pressed_turn_off_all_appliances_locks_by_home_id(data):
        try:
            home_id = data["home_id"]
            now = datetime.now()
            day_of_week = now.isoweekday()

            # --- Appliance Section ---
            result_appliances = (
            db.session.query(CompartmentAppliance, Appliance)
            .join(Compartment, Compartment.id == CompartmentAppliance.compartment_id)
            .join(Home, Home.id == Compartment.home_id)
            .join(Appliance, Appliance.id == CompartmentAppliance.appliance_id)
            .filter(Home.id == home_id, Home.validate == 1, CompartmentAppliance.status == 1)
            .all()
            )

            for comp_appliance, appliance in result_appliances:
                comp_appliance.status = 0

                latest_log = (
                CompartmentApplianceLog.query
                .filter_by(compartment_appliance_id=comp_appliance.id, end_time=None, validate=1)
                .order_by(CompartmentApplianceLog.start_time.desc())
                .first()
            )

                if latest_log:
                    latest_log.end_time = now
                    duration_sec = (now - latest_log.start_time).total_seconds()
                    duration = max(1, math.ceil(duration_sec / 60))
                    latest_log.duration_minutes = duration
                    latest_log.messagee = "Panic Button"
                    latest_log.consumption = int((duration * appliance.power) / 60)

        # --- Lock Section ---
            result_locks = (
                db.session.query(CompartmentLock)
                .join(Compartment, Compartment.id == CompartmentLock.compartment_id)
                .join(Home, Home.id == Compartment.home_id)
                .filter(Home.id == home_id, Home.validate == 1, CompartmentLock.status == 1)
                .all()
            )

            for comp_lock in result_locks:
                comp_lock.status = 0

                latest_log = (
                    CompartmentLockLog.query
                    .filter_by(compartment_lock_id=comp_lock.id, end_time=None, validate=1)
                    .order_by(CompartmentLockLog.start_time.desc())
                    .first()
            )

                if latest_log:
                    latest_log.end_time = now
                    duration_sec = (now - latest_log.start_time).total_seconds()
                    duration = max(1, math.ceil(duration_sec / 60))
                    latest_log.duration_minutes = duration
                    latest_log.messagee = "Panic Button"
                    latest_log.consumption = int((duration * 70) / 60)  # 🔐 Lock power is fixed: 70W

        # --- Main Log Entry ---
            new_mainlog = MainLog(
                triggered_by="Remotely",
            log_time=now,
            date=now.date(),
            validate=1,
            messagee=f"Panic Button Pressed",
                home_id=data["home_id"]
            )
            db.session.add(new_mainlog)

            db.session.commit()
            return {'success': f"All appliances and locks turned off for Home ID {home_id}"}

        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}

    #
    #
    # @staticmethod
    # def turn_off_all_appliances_at_night_by_home_id(id):
    #     try:
    #         home_id = id
    #         now = datetime.now()
    #         day_of_week = now.isoweekday()
    #
    #         # --- Appliance Section ---
    #         result_appliances = (
    #         db.session.query(CompartmentAppliance, Appliance,CompartmentApplianceLog)
    #         .join(Compartment, Compartment.id == CompartmentAppliance.compartment_id)
    #         .join(Home, Home.id == Compartment.home_id)
    #         .join(Appliance, Appliance.id == CompartmentAppliance.appliance_id)
    #
    #         .filter(Home.id == home_id, Home.validate == 1, CompartmentAppliance.status == 1,Appliance.catagory == 'Bulb')
    #         .all()
    #         )
    #
    #
    #         now = datetime.now().time()
    #         evening_start = time(15, 0)
    #         evening_end = time(16, 0)
    #
    #         for comp_appliance, appliance in result_appliances:
    #             if evening_start <= now :
    #                 comp_appliance.status = 0
    #                 db.session.commit()
    #
    #             if evening_end <= now :
    #                 comp_appliance.status = 0
    #                 db.session.commit()
    #
    #         return {'success': f"turn off all appliances at night by Home ID {home_id}"}
    #
    #     except Exception as e:
    #         db.session.rollback()
    #         return {'error': str(e)}
    #

