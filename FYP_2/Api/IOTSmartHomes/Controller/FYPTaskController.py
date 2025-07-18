import math
import sched
from datetime import datetime, date, time

from sqlalchemy.orm import validates
from sqlalchemy.sql.traversals import compare

from Model.Appliance import Appliance
from Model.Compartment import Compartment
from Model.CompartmentAppliance import CompartmentAppliance
from Model.CompartmentApplianceLog import CompartmentApplianceLog
from Model.Geyser import Geyser
from Model.Home import Home
from config import db

class FYPTaskController:

    @staticmethod
    def get_compartments_with_active_appliances(home_id):
        try:
            result = (
            db.session.query(Home, Compartment)
            .join(CompartmentAppliance, Compartment.id == CompartmentAppliance.compartment_id)
            .join(Home,Compartment.home_id == Home.id)
            .filter(Compartment.home_id == home_id)
            .filter(CompartmentAppliance.status == 1)
            .filter(CompartmentAppliance.validate == 1)
            .distinct()
            .all()
        )

            if not result:
                return {'message': 'No compartments with active appliances'}

            return [{
            "compartment_id": comp.id,
            "compartment_name": comp.name,
            "home_id": comp.home_id,
                "home_name":home.name
        } for home, comp in result]

        except Exception as e:
            return {'error': str(e)}, 500

    # @staticmethod
    # def get_compartments_with_not_active_appliances(home_id):
    #     try:
    #         # Subquery: compartments having at least one validated ON appliance
    #         subquery = (
    #             db.session.query(CompartmentAppliance.compartment_id)
    #             .join(Compartment)
    #             .filter(Compartment.home_id == home_id)
    #             .filter(CompartmentAppliance.status == 1)
    #             .filter(CompartmentAppliance.validate == 1)
    #             .distinct()
    #         )
    #
    #         # Main query: compartments NOT IN above subquery
    #         result = (
    #             db.session.query(Home, Compartment)
    #             .join(Home, Home.id == Compartment.home_id)
    #             .filter(Compartment.home_id == home_id)
    #             .filter(Compartment.id.notin_(subquery))
    #             .filter(Compartment.validate == 1)
    #             .all()
    #         )
    #
    #         if not result:
    #             return {'message': 'All compartments have at least one ON appliance'}
    #
    #         return [{
    #             "compartment_id": comp.id,
    #             "compartment_name": comp.name,
    #             "home_id": comp.home_id,
    #             "home_name": home.name
    #         } for home, comp in result]
    #
    #     except Exception as e:
    #         return {'error': str(e)}, 500

    @staticmethod
    def get_appliancess_with_active_appliances_by_home_id(home_id):
        try:
            result = (
                db.session.query(Home, Compartment,Appliance,CompartmentAppliance)
                .join(CompartmentAppliance, Compartment.id == CompartmentAppliance.compartment_id)
                .join(Home, Compartment.home_id == Home.id)
                .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                .filter(Compartment.home_id == home_id)
                .filter(CompartmentAppliance.status == 1)
                .filter(CompartmentAppliance.validate == 1)
                .distinct()
                .all()
            )
            turned_off_list = []

            if not result:
                return {'message': 'No Appliances with active appliances'}

            return [{
                "Compartment_Appliance_id": compartmentappliance.id,
                "status": compartmentappliance.status,
                "name": compartmentappliance.name,
                "port": compartmentappliance.port,
                "compartment_id": compartment.id,
                "compartment_name": compartment.name,
                "home_id":home.id,
                "home_name":home.name,
                "appliance_id":appliance.id

            } for home,compartment,appliance, compartmentappliance in result]

        except Exception as e:
            return {'error': str(e)}, 500


    @staticmethod
    def get_appliancess_with_active_appliances_geyser_by_home_id(home_id):
        try:

            result = (
                db.session.query(Home, Geyser)
                .join(Home, Geyser.home_id == Home.id)
                .filter(Geyser.home_id == home_id)
                .filter(Geyser.status == 1)
                .filter(Geyser.validate == 1)
                .distinct()
                .all()
            )
            if not result:
                return {'message': 'No Appliances with active appliances'}

            return [{
                "geyser_id": geyser.id,
                "status": geyser.status,
                "name": geyser.name,
                "home_id": home.id,
                "home_name": home.name,
            } for home,geyser in result]

        except Exception as e:
            return {'error': str(e)}, 500


    @staticmethod
    def Lobby_Light_always_On(home_id):
        try:
            now = datetime.now().time()

            morning_start = time(22, 0)
            morning_end = time(23, 59)
            evening_start = time(0, 0)
            evening_end = time(8, 0)

            home = Home.query.filter_by(id = home_id,validate=1).first()
            if home is None:
                return {'error': f"Home not found"}

            comp = Compartment.query.filter_by(home_id=Home.id, validate=1, name='Lobby').first()

            if comp is None:
                return {'error': f"Compartment not found"}

            compApp = CompartmentAppliance.query.filter_by(compartment_id=comp.id,name='Light_1',validate=1,watt=7).first()

            if compApp is None:
                return {'error': f"Compartment App not found"}

            # appliance = Appliance.query.filter_by(catagory='Bulb',validate=1,id=compApp.appliance_id)

            date = now
            if (morning_start <= now <= morning_end) or (evening_start <= now <= evening_end)   :
                compApp.status = 1
                db.session.commit()
                return {'ok':'ok'}

            compApp.status = 0
            db.session.commit()
            return {'now':f'schedule run'}

        except Exception as e:
            return {'error': str(e)}, 500


    # @staticmethod
    # def turn_ac_On():
    #     try:
    #         now = datetime.now()
    #         logs = CompartmentApplianceLog.query.filter(CompartmentApplianceLog.end_time !=  None).desc().first()
    #



    @staticmethod
    def turn_off_all_appliances_at_night_by_home_id():
        try:
            now = datetime.now().time()

            noww = datetime.now()
            morning_start = time(22, 0)
            morning_end = time(23, 59)
            evening_start = time(0, 0)
            evening_end = time(8, 0)

            active_logs = CompartmentApplianceLog.query.filter_by(end_time=None).all()
            turned_off_list = []

            # Define tiered thresholds based on appliance power

            for log in active_logs:
                comApp = CompartmentAppliance.query.get(log.compartment_appliance_id)
                com = Compartment.query.get(comApp.compartment_id)

                if comApp:
                    App = Appliance.query.get(comApp.appliance_id)
                    power = App.power  # in watts
                    duration_minutes = (noww - log.start_time).seconds // 60

                    # Calculate consumption: power (W) * time (min) / 60 => Wh
                    consumption = (power * duration_minutes) / 60.0

                    # Determine which threshold to use based on appliance power
                    threshold = 2


                    if duration_minutes >= threshold:
                        if (morning_start <= now <= morning_end) or (evening_start <= now <= evening_end):
                            comApp.status = 0

                            log.end_time = now
                            log.duration_minutes = duration_minutes
                            log.consumption = consumption
                            log.messagee = f"due to Night"

                            db.session.commit()

                        if com.name == 'Lobby' and comApp.name == 'Light_1':
                            comApp.status = 1
                            db.session.commit()
                    return {'updated':'update'}

            # ❌ Otherwise, return nothing (empty response)
            return {}

        except Exception as e:
            return {"error": str(e)}


    @staticmethod
    def get_watt_with_compartment_id(compartment_id):
        try:
            com = Compartment.query.filter_by(id=compartment_id,validate=1).first()
            count = CompartmentAppliance.query.filter_by(compartment_id = compartment_id, status=1,validate=1).all()
            cnt = 0
            for i in count:
                cnt = cnt + i.watt

            com.usage = cnt
            db.session.commit()

            return {"count":cnt}
        except Exception as e:
            return str(e)

    @staticmethod
    def get_Appliances_On_by_Home_id(id,watt):
        try:
            home = Home.query.filter_by(id=id,validate = 1).first()
            if home is None:
                return {'error':'home not found'}

            cnt = watt

            com = Compartment.query.filter_by(home_id=id,validate=1).all()
            if com is None:
                return {'error': 'home not found'}

            for i in com:
                comApp = CompartmentAppliance.query.filter_by(compartment_id=i.id,validate=1,status=1).all()
                for j in comApp:
                    appliace = Appliance.query.filter_by(id=comApp.appliance_id,validate=1).first()
                    if appliace.catagory == 'Bulb':
                        cnt = cnt + j.watt

            if cnt >= 100:
                return {'warning':'you are Turn on your appliances from specific Threshold'}

            return {}
        except Exception as e:
            return str(e)