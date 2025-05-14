from Model import Person
from Model.Appliance import Appliance
from Model.ApplianceSchedule import ApplianceSchedule
from Model.ApplianceScheduleLog import ApplianceScheduleLog
from Model.Compartment import Compartment
from Model.CompartmentAppliance import CompartmentAppliance
from Model.CompartmentLock import CompartmentLock
from Model.Home import Home
from Model.HomeSprinkler import HomeSprinkler
from Model.LockSchedule import LockSchedule
from Model.LockScheduleLog import LockScheduleLog
from Model.Security import Security
from Model.SprinklerSchedule import SprinklerSchedule
from Model.SprinklerScheduleLog import SprinklerScheduleLog
from config import db
from datetime import datetime

class ApplianceController:

    @staticmethod
    def list_appliance():
        try:
            appliances = Appliance.query.where(Appliance.validate == 1).all()
            return [{"id": a.id, "type": a.type,
                     "power": a.power, "catagory":a.catagory} for a in appliances]
        except Exception as e:
            return str(e)

    @staticmethod
    def list_deleted_appliance():
        try:
            appliances = Appliance.query.where(Appliance.validate == 0).all()
            return [{"id": a.id,  "type": a.type,
                     "power": a.power, "catagory":a.catagory} for a in appliances]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_appliance_by_id(id):
        try:
            appliances = Appliance.query.filter_by(id=id,validate=1).first()
            if not appliances:
                return {'error': f'Appliance with id {id} not found'}
            return [{"id": appliances.id
                        , "type": appliances.type, "power": appliances.power,
                     "catagory": appliances.catagory}]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_deleted_appliance_by_id(id):
        try:
            appliances = Appliance.query.filter_by(id=id, validate=0).first()
            if not appliances:
                return {'error': f'Deleted Appliance with id {id} not found'}
            return [{"id": appliances.id,"type": appliances.type, "power": appliances.power,
                     "catagory": appliances.catagory}]
        except Exception as e:
            return str(e)

    @staticmethod
    def add_appliance(data):
        try:
            appliances = Appliance(type=data['type'], power=data['power'],
                                   catagory=data['catagory'],validate=1)
            db.session.add(appliances)
            db.session.commit()
            return {'success':f"{data['catagory']} added successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def update_appliance(data):
        try:
            appliances = Appliance.query.filter_by(id=data['id'], validate=1).first()
            if appliances is None:
                return {'error':f"Appliance not found"}

            if appliances is not None:
                appliances.type = data['type']
                appliances.power = data['power']
                appliances.catagory = data['catagory']
                appliances.validate = 1
                db.session.commit()
                return {'success':f"{data['catagory']} added successfully"}
        except Exception as a:
            return str(a)

    @staticmethod
    def delete_appliance(id):
        try:
            compartment_appliances = CompartmentAppliance.query.filter_by(appliance_id=id,validate=1).first()
            if compartment_appliances is not None:
                return {'error':f'Appliance has associated Compartment Appliances. It cannot be deleted'}

            appliances = Appliance.query.filter_by(id=id, validate=1).first()
            if appliances is None:
                return {'error':f"Appliance not found"}

            appliances.validate = 0
            db.session.commit()
            return {'success':f'Appliance with id {id} deleted successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def Backup_deleted_appliances_by_id(id):
        try:
            appliances = Appliance.query.filter_by(id=id, validate=0).first()
            if not appliances:
                return {'error':f"Appliance with id {id} not found"}

            appliances.validate = 1

            db.session.commit()
            return {'success':f'Appliance with id {id} backed up successfully'}
        except Exception as e:
            return str(e)

################# Compartment Appliance ################

    @staticmethod
    def List_Compartment_Appliance():
        try:
            result = (
                db.session.query(CompartmentAppliance, Compartment, Appliance)
                .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                .filter(CompartmentAppliance.validate == 1)
                .all()
            )
            return [{"id": compartmentappliance.id, "status": compartmentappliance.status,
                     "name":compartmentappliance.name,"port":compartmentappliance.port,
                     "compartment_id": compartment.id, "compartment_name": compartment.name,
                     "appliance_id": appliance.id, "appliance_catagory": appliance.catagory}
                    for compartmentappliance, compartment, appliance in result]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_Deleted_Compartment_Appliance():
        try:
            result = (
                db.session.query(CompartmentAppliance, Compartment, Appliance)
                .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                .filter(CompartmentAppliance.validate == 0)
                .all()
            )
            return [{"id": compartmentappliance.id, "status": compartmentappliance.status,
                     "name": compartmentappliance.name,"port":compartmentappliance.port,
                     "compartment_id": compartment.id, "compartment_name": compartment.name,
                     "appliance_id": appliance.id, "appliance_catagory": appliance.catagory}
                    for compartmentappliance, compartment, appliance in result]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_compartment_appliance_by_id(id):
        try:
            result = (
                db.session.query(CompartmentAppliance, Compartment, Appliance)
                .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                .filter(CompartmentAppliance.id == id,CompartmentAppliance.validate == 1)
                .first()
            )
            if result is None:
                return {'error':f"Compartment Appliance not found"}
            return {
                "id": result.CompartmentAppliance.id, "status": result.CompartmentAppliance.status,
                "name": result.CompartmentAppliance.name,
                "port": result.CompartmentAppliance.port,
                     "compartment_name": result.Compartment.name,
                     "appliance_id":result.Appliance.id,
                     "appliance_catagory": result.Appliance.catagory
            }
        except Exception as e:
            return str(e)


    @staticmethod
    def get_deleted_compartment_appliance_by_id(id):
        try:
            result = (
                db.session.query(CompartmentAppliance, Compartment, Appliance)
                .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                .filter(CompartmentAppliance.id == id, CompartmentAppliance.validate == 0)
                .first()
            )
            if result is None:
                return {'error':f"Compartment Appliance not found"}
            return {
                "id": result.CompartmentAppliance.id, "status": result.CompartmentAppliance.status,
                "name": CompartmentAppliance.name,"port": result.CompartmentAppliance.port,
                "compartment_name": result.Compartment.name,
                "appliance_catagory": result.Appliance.catagory
            }
        except Exception as e:
            return str(e)

    @staticmethod
    def get_compartment_appliance_with_compartment_id(compartment_id):
        try:
            result = (
                db.session.query(CompartmentAppliance, Compartment, Appliance)
                .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                .filter(CompartmentAppliance.compartment_id == compartment_id,CompartmentAppliance.validate == 1)
                .all()
            )
            if result is None:
                return {'error':f"Compartment Appliance not found"}

            return [{"Compartment_Appliance_id": compartmentappliance.id, "status": compartmentappliance.status,
                     "name": compartmentappliance.name,
                     "port": compartmentappliance.port,
                     "compartment_id":compartment.id,
                     "compartment_name": compartment.name,
                     "appliance_id":appliance.id,
                     "appliance_catagory": appliance.catagory}
                    for compartmentappliance, compartment, appliance in result]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_deleted_compartment_appliance_with_compartment_id(id):
        try:
            result = (
                db.session.query(CompartmentAppliance, Compartment, Appliance)
                .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                .filter(CompartmentAppliance.compartment_id == id, CompartmentAppliance.validate == 0)
                .all()
            )
            if result is None:
                return {'error':f"Compartment Appliance not found"}

            return [{"Compartment_Appliance_id": compartmentappliance.id, "status": compartmentappliance.status,
                     "name": compartmentappliance.name,
                     "port": compartmentappliance.port,
                     "compartment_id":compartment.id,
                     "compartment_name": compartment.name,
                     "appliance_id":appliance.id,
                     "appliance_catagory": appliance.catagory}
                    for compartmentappliance, compartment, appliance in result]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_compartment_appliance_with_compartment_appliance_id(compartment_id, appliance_id):
        try:
            result = (
                db.session.query(CompartmentAppliance, Compartment, Appliance)
                .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                .filter(CompartmentAppliance.compartment_id == compartment_id,
                        CompartmentAppliance.appliance_id == appliance_id,
                        CompartmentAppliance.validate == 1)
                .all()
            )
            if result is None:
                return {'error': f"Compartment Appliance not found"}

            return [{"id": compartmentappliance.id, "status": compartmentappliance.status,
                     "name": compartmentappliance.name,
                     "port": compartmentappliance.port,
                     "compartment_name": compartment.name,
                     "appliance_catagory": appliance.catagory}
                    for compartmentappliance, compartment, appliance in result]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_deleted_compartment_appliance_with_compartment_appliance_id(compartment_id, appliance_id):
        try:
            result = (
                db.session.query(CompartmentAppliance, Compartment, Appliance)
                .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                .filter(CompartmentAppliance.compartment_id == compartment_id,
                        CompartmentAppliance.appliance_id == appliance_id,
                        CompartmentAppliance.validate == 0)
                .all()
            )
            if result is None:
                return {'error': f"Compartment Appliance not found"}

            return [{"id": compartmentappliance.id, "status": compartmentappliance.status,
                     "name": compartmentappliance.name,"port":compartmentappliance.port,
                     "compartment_name": compartment.name,
                     "appliance_catagory": appliance.catagory}
                    for compartmentappliance, compartment, appliance in result]
        except Exception as e:
            return str(e)

    @staticmethod
    def AddCompartmentAppliances(data):
        try:
            appliance = Appliance.query.filter_by(id=data["appliance_id"],validate=1).first()
            if appliance is None:
                return {'error':f"Appliance not found"}

            compartment = Compartment.query.filter_by(id=data["compartment_id"],validate=1).first()
            if compartment is None:
                return {'error':f"Compartment not found"}

            compartment_appliances = CompartmentAppliance(status=data['status'],port=data['port'],
                                            name=data['name'],compartment_id=data['compartment_id'],
                                                appliance_id=data['appliance_id'],validate=1)

            db.session.add(compartment_appliances)
            db.session.commit()
            return {'success':f"Compartment Appliance added successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def updateCompartmentAppliances(data):
        try:
            appliance = Appliance.query.filter_by(id=data["appliance_id"], validate=1).first()
            if appliance is None:
                return {'error':f"Appliance not found"}

            compartment = Compartment.query.filter_by(id=data["compartment_id"], validate=1).first()
            if compartment is None:
                return {'error':f"Compartment not found"}

            compartment_appliances = CompartmentAppliance.query.filter_by(id=data["id"], validate=1).first()
            if compartment_appliances is None:
                return {'error':f"Compartment Appliance not found"}

            if compartment_appliances is not None:
                compartment_appliances.name = data['name']
                compartment_appliances.status = data['status']
                compartment_appliances.port = data['port']
                compartment_appliances.compartment_id = data['compartment_id']
                compartment_appliances.appliance_id = data['appliance_id']
                db.session.commit()
                return {'success':f"Compartment Appliance with id {data['id']} updated successfully"}
            else:
                return {'error':f"Compartment Appliance not found"}
        except Exception as a:
            return str(a)

    @staticmethod
    def deleteCompartmentAppliances(id):
        try:
            compartment_appliances = CompartmentAppliance.query.filter_by(id=id,validate=1).first()
            if compartment_appliances is None:
                return {'error':f"Compartment Appliance not found"}

            applianceSchedule = (
                ApplianceSchedule.query
                .filter(ApplianceSchedule.table_id == id , ApplianceSchedule.type == 0 , ApplianceSchedule.validate == 1 )
                .first()
            )
            if applianceSchedule is not None:
                return {'error':'Cannot delete Compartment Appliance, it has Schedules'}

            compartment_appliances.validate = 0
            db.session.commit()
            return {'success':f'Compartment Appliance with id {id} deleted successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def BackUp_deleted_Compartment_appliances_by_id(id):
        try:
            compartment_appliances = CompartmentAppliance.query.filter_by(id=id, validate=0).first()
            if compartment_appliances is None:
                return {'error':f"Compartment Appliance not found"}

            compartment_appliances.validate = 1
            db.session.commit()
            return {'success':f'Compartment Appliance with id {id} restored successfully'}
        except Exception as e:
            return str(e)

# --------------------- Appliance Schedule ------------------------ from here

    @staticmethod
    def List_appliance_schedule(type):
        try:
            if type == 0:
                applianceSchedule = (db.session.query(ApplianceSchedule, CompartmentAppliance,Compartment,Appliance)
                                     .join(CompartmentAppliance, ApplianceSchedule.table_id == CompartmentAppliance.id)
                                     .join(Compartment,CompartmentAppliance.compartment_id == Compartment.id)
                                     .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                                     .where(ApplianceSchedule.validate == 1, ApplianceSchedule.type == type)
                                     .all()
                                     )
                return [{"id": applianceSchedule.id,
                         "name":applianceSchedule.name,
                         "compartment_name": compartment.name,
                         "appliance_catagory": appliance.catagory,
                         "start_time" : applianceSchedule.start_time.strftime("%H:%M:%S"),
                         "end_time" : applianceSchedule.end_time.strftime("%H:%M:%S"),
                          "days": applianceSchedule.days
                         }
                        for applianceSchedule, compartment_appliance , compartment, appliance in applianceSchedule]

            elif type == 1:

                security = (
                    db.session.query(ApplianceSchedule,Security)
                    .join(Security, ApplianceSchedule.table_id == Security.id)
                    .where(ApplianceSchedule.validate == 1,ApplianceSchedule.type == type)
                    .all()
                    )
                return [{"id": applianceSchedule.id,
                         "name": applianceSchedule.name,
                         "security_name": security.name,
                         "start_time": applianceSchedule.start_time,
                         "end_time": applianceSchedule.end_time,
                         "days": applianceSchedule.days
                         }
                         for applianceSchedule, security in security]

        except Exception as e:
            return str(e)

    @staticmethod
    def get_appliance_schedule_by_id(id, type):
        try:
            if type == 0:
                applianceSchedule = (db.session.query(ApplianceSchedule, CompartmentAppliance, Compartment, Appliance)
                                     .join(CompartmentAppliance, ApplianceSchedule.table_id == CompartmentAppliance.id)
                                     .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                                     .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                                     .where(ApplianceSchedule.validate == 1, ApplianceSchedule.type == type,
                                            ApplianceSchedule.id == id)
                                     .first()
                                     )
                if applianceSchedule is None:
                    return  {'error':f'Appliance schedule with id {id} not found'}

                applianceSchedule, compartment_appliance, compartment, appliance = applianceSchedule

                return {"id": applianceSchedule.id,
                        "name": applianceSchedule.name,
                         "compartment_name": compartment.name,
                         "appliance_catagory": appliance.catagory,
                         "start_time": applianceSchedule.start_time,
                         "end_time": applianceSchedule.end_time,
                         "days": applianceSchedule.days
                         }
            elif type == 1:
                result = (
                    db.session.query(ApplianceSchedule, Security)
                    .join(Security, ApplianceSchedule.table_id == Security.id)
                    .filter(ApplianceSchedule.id == id, ApplianceSchedule.type == type,
                        ApplianceSchedule.validate == 1)
                    .first()
                )
                if result is None:
                    return  {'error':f'Security schedule with id {id} not found'}

                applianceSchedules, security = result
                if result is not None:
                    return {"id": applianceSchedules.id,
                            "name": applianceSchedules.name,
                            "security_name": security.name,
                            "start_time": applianceSchedules.start_time,
                            "end_time": applianceSchedules.end_time,
                            "days": applianceSchedules.days
                            }
        except Exception as e:
            return str(e)

    @staticmethod
    def get_deleted_appliance_schedule_by_id(id, type):
        try:
            if type == 0:
                applianceSchedule = (db.session.query(ApplianceSchedule, CompartmentAppliance, Compartment, Appliance)
                                     .join(CompartmentAppliance, ApplianceSchedule.table_id == CompartmentAppliance.id)
                                     .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                                     .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                                     .where(ApplianceSchedule.validate == 0, ApplianceSchedule.type == type,
                                            ApplianceSchedule.id == id)
                                     .first()
                                     )
                if applianceSchedule is None:
                    return {'error': f'Appliance schedule with id {id} not found'}

                applianceSchedule, compartment_appliance, compartment, appliance = applianceSchedule

                return {"id": applianceSchedule.id,
                        "name": applianceSchedule.name,
                        "compartment_name": compartment.name,
                        "appliance_catagory": appliance.catagory,
                        "start_time": applianceSchedule.start_time,
                        "end_time": applianceSchedule.end_time,
                        "days": applianceSchedule.days
                        }
            elif type == 1:
                result = (
                    db.session.query(ApplianceSchedule, Security)
                    .join(Security, ApplianceSchedule.table_id == Security.id)
                    .filter(ApplianceSchedule.id == id, ApplianceSchedule.type == type,
                            ApplianceSchedule.validate == 0)
                    .first()
                )
                if result is None:
                    return {'error': f'Security schedule with id {id} not found'}

                applianceSchedules, security = result
                if result is not None:
                    return {"id": applianceSchedules.id,
                            "name": applianceSchedules.name,
                            "security_name": security.name,
                            "start_time": applianceSchedules.start_time,
                            "end_time": applianceSchedules.end_time,
                            "days": applianceSchedules.days
                            }
        except Exception as e:
            return str(e)

    @staticmethod
    def list_appliance_schedule_by_compartment_id(id):
        try:
            applianceSchedule = (db.session.query(ApplianceSchedule, CompartmentAppliance, Compartment, Appliance)
                                 .join(CompartmentAppliance, ApplianceSchedule.table_id == CompartmentAppliance.id)
                                 .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                                 .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                                 .where(ApplianceSchedule.validate == 1, ApplianceSchedule.type == 0,
                                        CompartmentAppliance.compartment_id == id)
                                 .all()
                                 )
            return [{"id": applianceSchedule.id,
                     "Compartment_Appliance_id":compartment_appliance.id,
                     "name": applianceSchedule.name,
                     "start_time" : applianceSchedule.start_time.strftime("%H:%M:%S"),
                         "end_time" : applianceSchedule.end_time.strftime("%H:%M:%S"),
                     "days": applianceSchedule.days
                     }
                    for applianceSchedule, compartment_appliance, compartment, appliance in applianceSchedule]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_appliance_schedule_by_table_id(id, type):
        try:
            if type == 0:
                applianceSchedule = (db.session.query(ApplianceSchedule, CompartmentAppliance, Compartment, Appliance)
                                     .join(CompartmentAppliance, ApplianceSchedule.table_id == CompartmentAppliance.id)
                                     .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                                     .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                                     .where(ApplianceSchedule.validate == 1, ApplianceSchedule.type == type,
                                            ApplianceSchedule.table_id == id)
                                     .all()
                                     )
                return [{"id": applianceSchedule.id,
                         "name":applianceSchedule.name,
                         "start_time" : applianceSchedule.start_time.strftime("%H:%M:%S"),
                         "end_time" : applianceSchedule.end_time.strftime("%H:%M:%S"),
                         "days": applianceSchedule.days
                         }
                        for applianceSchedule, compartment_appliance, compartment, appliance in applianceSchedule]
            else:
                result = (
                    db.session.query(ApplianceSchedule, Security)
                    .join(Security, ApplianceSchedule.table_id == Security.id)
                    .filter(ApplianceSchedule.table_id == id, ApplianceSchedule.type == type,
                            ApplianceSchedule.validate == 1)
                    .all()
                )

                if result is not None:
                    return [{"id": applianceSchedules.id,
                             "name": applianceSchedules.name,
                            "security_name": security.name,
                            "start_time": applianceSchedules.start_time,
                            "end_time": applianceSchedules.end_time,
                            "days": applianceSchedules.days
                            }
                    for applianceSchedules, security in result]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_deleted_appliance_schedule_by_table_id(id, type):
        try:
            if type == 0:
                applianceSchedule = (db.session.query(ApplianceSchedule, CompartmentAppliance, Compartment, Appliance)
                                     .join(CompartmentAppliance, ApplianceSchedule.table_id == CompartmentAppliance.id)
                                     .join(Compartment, CompartmentAppliance.compartment_id == Compartment.id)
                                     .join(Appliance, CompartmentAppliance.appliance_id == Appliance.id)
                                     .where(ApplianceSchedule.validate == 0, ApplianceSchedule.type == type,
                                            ApplianceSchedule.table_id == id)
                                     .all()
                                     )
                return [{"id": applianceSchedule.id,
                         "name": applianceSchedule.name,
                         "compartment_name": compartment.name,
                         "appliance_catagory": appliance.catagory,
                         "start_time": applianceSchedule.start_time,
                         "end_time": applianceSchedule.end_time,
                         "days": applianceSchedule.days
                         }
                        for applianceSchedule, compartment_appliance, compartment, appliance in applianceSchedule]
            elif type == 1:
                result = (
                    db.session.query(ApplianceSchedule, Security)
                    .join(Security, ApplianceSchedule.table_id == Security.id)
                    .filter(ApplianceSchedule.table_id == id, ApplianceSchedule.type == type,
                            ApplianceSchedule.validate == 0)
                    .all()
                )

                if result is not None:
                    return [{"id": applianceSchedules.id,
                             "name": applianceSchedules.name,
                             "security_name": security.name,
                             "start_time": applianceSchedules.start_time,
                             "end_time": applianceSchedules.end_time,
                             "days": applianceSchedules.days
                             }
                            for applianceSchedules, security in result]
        except Exception as e:
            return str(e)

    @staticmethod
    def Add_Appliances_Schedule(data):
        try:
            if data['type'] == 0:
                if data['type'] == 0:
                    appliance = CompartmentAppliance.query.filter_by(id=data["table_id"], validate=1).first()
                    if appliance is None:
                        return {'error': 'Compartment Appliance not found'}

                    # Ensure start_time and end_time are handled correctly as time objects
                    start_time = data['start_time']
                    end_time = data['end_time']

                    applianceSchedule = ApplianceSchedule(
                        name=data['name'],
                        type=data['type'],
                        table_id=data['table_id'],
                        start_time=start_time,  # Now directly using the time format
                        end_time=end_time,  # Same for end_time
                        days=data['days'],
                        validate=1
                    )

                    db.session.add(applianceSchedule)
                    db.session.commit()
                    return {'success': f"Appliance Schedule added successfully"}

            elif data['type'] == 1:

                security = Security.query.filter_by(id=data["table_id"], validate=1).first()
                if security is None:
                    return {'error':'Security not found'}

                applianceSchedule = ApplianceSchedule(
                    name=data['name'],
                    type=data['type'],
                    table_id=data['table_id'],
                    start_time=data['start_time'],
                    end_time=data['end_time'],
                    days=data['days'], validate=1)

                db.session.add(applianceSchedule)
                db.session.commit()
                return {'success':f"Appliance Schedule added successfully"}
        except Exception as e:
            return str(e)


    @staticmethod
    def Update_Appliances_Schedule(data):
        try:
            if data['type'] == 0:
                appliance = CompartmentAppliance.query.filter_by(id=data["table_id"], validate=1).first()
                if appliance is None:
                    return {'error':'Compartment Appliance not found'}

                applianceSchedule = ApplianceSchedule.query.filter_by(id=data['id'], validate=1).first()
                if applianceSchedule is None:
                    return {'error':'Appliance Schedule not found'}

                if applianceSchedule is not None:
                    applianceSchedule.name=data['name']
                    applianceSchedule.type=data['type']
                    applianceSchedule.table_id=data['table_id']
                    applianceSchedule.start_time=data['start_time']
                    applianceSchedule.end_time=data['end_time']
                    applianceSchedule.days=data['days']
                    applianceSchedule.validate =1

                db.session.commit()
                return {'success':f"Appliance Schedule updated successfully"}
            elif data['type'] == 1:
                security = Security.query.filter_by(id=data["table_id"], validate=1).first()
                if security is None:
                    return {'error':'Security not found'}

                applianceSchedule = ApplianceSchedule.query.filter_by(id=data['id'], validate=1).first()
                if applianceSchedule is None:
                    return {'success':'Security Schedule not found'}

                if applianceSchedule is not None:
                    applianceSchedule.name = data['name']
                    applianceSchedule.type = data['type']
                    applianceSchedule.table_id = data['table_id']
                    applianceSchedule.start_time = data['start_time']
                    applianceSchedule.end_time = data['end_time']
                    applianceSchedule.days = data['days']
                    applianceSchedule.validate = 1

                db.session.commit()
                return {'success':f"Security Schedule updated successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def update_matching_schedules(data):

        old = data.get('old')
        new = data.get('new')

        if not old or not new:
            return {'error': 'Old and new data are required'}

        try:
            schedules = ApplianceSchedule.query.filter_by(
                name=old['name'],
                start_time=old['start_time'],
                end_time=old['end_time'],
                days=old['days'],
                type=old['type']
            ).all()

            for schedule in schedules:
                schedule.name = new['name']
                schedule.start_time = new['start_time']
                schedule.end_time = new['end_time']
                schedule.days = new['days']
                schedule.type = new['type']

            db.session.commit()

            return {'success': f'{len(schedules)} schedule(s) updated successfully'}

        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}

    @staticmethod
    def delete_matching_Appliance_Schedule(data):

        old = data.get('old')
        try:
            schedules = ApplianceSchedule.query.filter_by(
                name=old['name'],
                start_time=old['start_time'],
                end_time=old['end_time'],
                days=old['days'],
                type=old['type'],
                validate = old['validate']
            ).all()

            for schedule in schedules:
                schedule.validate = 0

            db.session.commit()

            return {'success': f'{len(schedules)} schedule(s) deleted successfully'}

        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}

    @staticmethod
    def Delete_Appliances_Schedule(id, type):
        try:
            if type == 0:
                appliances = ApplianceSchedule.query.filter_by(id=id, type=type, validate=1).first()
                if appliances is None:
                    return {'error':'Appliance Schedule not found'}

                applianceScheduleLog = (
                    ApplianceScheduleLog.query
                    .filter_by(appliance_schedule_id = id,validate = 1)
                    .first()
                )
                if applianceScheduleLog:
                    return {'error':'Cannot delete Appliance, it has Schedule Log'}

                appliances.validate = 0
                db.session.commit()
                return {'success':f"Appliance Schedule with id {id} deleted successfully"}

            elif type == 1:

                appliances = ApplianceSchedule.query.filter_by(id=id, type=1, validate=1).first()
                if appliances is None:
                    return {"error":'Appliance Schedule not found'}

                applianceSchedule = (
                    ApplianceScheduleLog.query
                    .filter_by(appliance_schedule_id = id,validate = 1)
                    .first()
                )
                if applianceSchedule:
                    return {'error':'Cannot delete Security Schdule, it has Schedule Log'}

                appliances.validate = 0
                db.session.commit()
                return {'success':f"Appliance Schedule with id {id} deleted successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def backup_Deleted_appliance_schedule_by_id(id,type):
        try:
            if type == 0:

                appliances = ApplianceSchedule.query.filter_by(id=id, type=0, validate=0).first()
                if appliances is None:
                    return {'error':'Appliance Schedule not found'}

                appliances.validate = 1
                db.session.commit()
                return {'success':f'{appliances.name} Backup Successfully'}

            elif type == 1:

                appliances = ApplianceSchedule.query.filter_by(id=id, type=1, validate=0).first()
                if appliances is None:
                    return {'error':'Appliance Schedule not found'}

                appliances.validate = 1
                db.session.commit()
                return {'success':f'{appliances.name} Backup Successfully'}
        except Exception as a:
            return str(a)

#-------------------------- Appliance Schedule Log --------------------------------

    @staticmethod
    def List_appliance_schedule_log():
        try:

            result = (
                      db.session.query(ApplianceScheduleLog,ApplianceSchedule)
                      .join(ApplianceSchedule , ApplianceScheduleLog.appliance_schedule_id == ApplianceSchedule.id)
                      .filter_by(validate=1)
                      .all()
                      )
            return [
                {"id": appliance_schedule_log.id,
                 "appliance_schedule_name": appliance_schedule.name,
                 "start_time": appliance_schedule_log.start_time,
                 "end_time": appliance_schedule_log.end_time,
                 "days": appliance_schedule_log.days
                 }
                for appliance_schedule_log,appliance_schedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_appliance_schedule_log():
        try:
            result = (
                db.session.query(ApplianceScheduleLog, ApplianceSchedule)
                .join(ApplianceSchedule, ApplianceScheduleLog.appliance_schedule_id == ApplianceSchedule.id)
                .filter_by(validate=0)
                .all()
            )
            return [
                {"id": appliance_schedule_log.id,
                 "appliance_schedule_name": appliance_schedule.name,
                 "start_time": appliance_schedule_log.start_time,
                 "end_time": appliance_schedule_log.end_time,
                 "days": appliance_schedule_log.days
                 }
                for appliance_schedule_log, appliance_schedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_appliance_schedule_log_by_id(id):
        try:
            result = (
                db.session.query(ApplianceScheduleLog, ApplianceSchedule)
                .join(ApplianceSchedule, ApplianceScheduleLog.appliance_schedule_id == ApplianceSchedule.id)
                .filter(ApplianceScheduleLog.id == id , ApplianceScheduleLog.validate == 1)
                .first()
            )
            if result is None:
                return {'error':'Appliance Schedule Log Not Found'}

            appliance_schedule_log, appliance_schedule = result
            return {"id": appliance_schedule_log.id,
                 "appliance_schedule_name": appliance_schedule.name,
                 "start_time": appliance_schedule_log.start_time,
                 "end_time": appliance_schedule_log.end_time,
                 "days": appliance_schedule_log.days
                 }

        except Exception as e:
            return str(e)

    @staticmethod
    def Get_deleted_appliance_schedule_log_by_id(id):
        try:
            result = (
                db.session.query(ApplianceScheduleLog, ApplianceSchedule)
                .join(ApplianceSchedule, ApplianceScheduleLog.appliance_schedule_id == ApplianceSchedule.id)
                .filter(ApplianceScheduleLog.id == id , ApplianceScheduleLog.validate == 0)
                .first()
            )
            if result is None:
                return {'error': 'Deleted Appliance Schedule Log Not Found'}

            appliance_schedule_log, appliance_schedule = result
            return {"id": appliance_schedule_log.id,
                    "appliance_schedule_name": appliance_schedule.name,
                    "start_time": appliance_schedule_log.start_time,
                    "end_time": appliance_schedule_log.end_time,
                    "days": appliance_schedule_log.days
                    }
        except Exception as e:
            return str(e)

    @staticmethod
    def List_appliance_schedule_log_by_table_id(table_id):
        try:
            result = (
                db.session.query(ApplianceScheduleLog, ApplianceSchedule)
                .join(ApplianceSchedule, ApplianceScheduleLog.appliance_schedule_id == ApplianceSchedule.id)
                .filter(ApplianceScheduleLog.appliance_schedule_id == table_id,ApplianceScheduleLog.validate == 1)
                .all()
            )
            return [
                {"id": appliance_schedule_log.id,
                 "appliance_schedule_name": appliance_schedule.name,
                 "start_time": appliance_schedule_log.start_time,
                 "end_time": appliance_schedule_log.end_time,
                 "days": appliance_schedule_log.days
                 }
                for appliance_schedule_log, appliance_schedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_appliance_schedule_log_by_table_id(table_id):
        try:
            result = (
                db.session.query(ApplianceScheduleLog, ApplianceSchedule)
                .join(ApplianceSchedule, ApplianceScheduleLog.appliance_schedule_id == ApplianceSchedule.id)
                .filter(ApplianceScheduleLog.appliance_schedule_id == table_id, ApplianceScheduleLog.validate == 0)
                .all()
            )
            return [
                {"id": appliance_schedule_log.id,
                 "appliance_schedule_name": appliance_schedule.name,
                 "start_time": appliance_schedule_log.start_time,
                 "end_time": appliance_schedule_log.end_time,
                 "days": appliance_schedule_log.days
                 }
                for appliance_schedule_log, appliance_schedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Add_Appliance_Schedule_Log(data):
        try:
            appliance = ApplianceSchedule.query.filter_by(id=data["appliance_schedule_id"], validate=1).first()
            if appliance is None:
                return {'error':'Appliance Schedule not found'}

            applianceScheduleLog = ApplianceScheduleLog(
                start_time=data['start_time'],
                end_time=data['end_time'],
                days=data['days'],
                appliance_schedule_id=data['appliance_schedule_id'],
                validate=1
            )

            db.session.add(applianceScheduleLog)
            db.session.commit()
            return {'success':f"Appliance Schedule Log added successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def Update_Appliance_Schedule_Log(data):
        try:
            applianceScheduleLog = ApplianceScheduleLog.query.filter_by(id=data['id'], validate=1).first()
            if applianceScheduleLog is None:
                return {'error':'Appliance Schedule Log not found'}

            appliance = ApplianceSchedule.query.filter_by(id=data["appliance_schedule_id"], validate=1).first()
            if appliance is None:
                return {'error':'Appliance Schedule not found'}

            applianceScheduleLog.start_time = data['start_time']
            applianceScheduleLog.end_time = data['end_time']
            applianceScheduleLog.days = data['days']
            applianceScheduleLog.appliance_schedule_id = data['appliance_schedule_id']
            applianceScheduleLog.validate = 1
            db.session.commit()
            return {'success':f"Appliance Schedule Log updated successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def Delete_Appliance_Schedule_Log(id):
        try:
            applianceScheduleLog = ApplianceScheduleLog.query.filter_by(id=id, validate=1).first()
            if applianceScheduleLog is None:
                return {'error':'Appliance Schedule Log not found'}

            applianceScheduleLog.validate = 0
            db.session.commit()
            return {'success':f"Appliance Schedule Log with id {id} deleted successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def backup_deleted_appliance_schedule_log_by_id(id):
        try:
            applianceScheduleLog = ApplianceScheduleLog.query.filter_by(id=id, validate=0).first()
            if applianceScheduleLog is None:
                return {'error':'Appliance Schedule Log not found'}

            applianceScheduleLog.validate = 1
            db.session.commit()
            return {'success':f'Appliance Schedule Log Backup Successfully'}
        except Exception as e:
            return str(e)

#---------------------- Security --------------------------------

    @staticmethod
    def List_security():
        try:
            result = (
                       db.session.query(Security, Home, Person)
                       .join(Home, Security.home_id == Home.id)
                       .join(Person, Home.person_id == Person.id)
                       .where(Security.validate == 1)
                      .all()
                     )
            return [
                {"id": security.id,
                 "name": security.name,
                 "Home Name":home.name,
                 "Person Name":person.name,
                 "status": security.status,
                 }
                for security,home,person in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_security():
        try:
            result = (
                db.session.query(Security, Home, Person)
                .join(Home, Security.home_id == Home.id)
                .join(Person, Home.person_id == Person.id)
                .where(Security.validate == 0)
                .all()
            )
            return [
                {"id": security.id,
                 "name": security.name,
                 "Home Name": home.name,
                 "Person Name": person.name,
                 "status": security.status,
                 }
                for security, home, person in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_security_by_id(id):
        try:
            result = (
                db.session.query(Security, Home, Person)
                .join(Home, Security.home_id == Home.id)
                .join(Person, Home.person_id == Person.id)
                .where(Security.validate == 1,Security.id == id)
                .first()
            )
            if result is None:
                return {'error':'Security not found'}

            security, home, person = result
            return {
                 "id": security.id,
                 "name": security.name,
                 "Home Name": home.name,
                 "Person Name": person.name,
                 "status": security.status,
                 }
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_deleted_security_by_id(id):
        try:
            result = (
                db.session.query(Security, Home, Person)
                .join(Home, Security.home_id == Home.id)
                .join(Person, Home.person_id == Person.id)
                .where(Security.validate == 0, Security.id == id)
                .first()
            )
            if result is None:
                return {'error':'Security not found'}

            security, home, person = result
            return {
                "id": security.id,
                "name": security.name,
                "Home Name": home.name,
                "Person Name": person.name,
                "status": security.status,
            }
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_security_by_name(name):
        try:
            result = (
                db.session.query(Security, Home, Person)
                .join(Home, Security.home_id == Home.id)
                .join(Person, Home.person_id == Person.id)
                .where(Security.validate == 1, Security.name == name)
                .first()
            )
            if result is None:
                return {'error':'Security not found'}

            security, home, person = result
            return {
                "id": security.id,
                "name": security.name,
                "Home Name": home.name,
                "Person Name": person.name,
                "status": security.status,
            }
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_deleted_security_by_name(name):
        try:
            result = (
                db.session.query(Security, Home, Person)
                .join(Home, Security.home_id == Home.id)
                .join(Person, Home.person_id == Person.id)
                .where(Security.validate == 0, Security.name == name)
                .first()
            )
            if result is None:
                return {'error': 'Security not found'}

            security, home, person = result
            return {
                "id": security.id,
                "name": security.name,
                "Home Name": home.name,
                "Person Name": person.name,
                "status": security.status,
            }
        except Exception as e:
            return str(e)

    @staticmethod
    def List_security_by_Home_Id(id):
        try:
            result = (
                db.session.query(Security, Home, Person)
                .join(Home, Security.home_id == Home.id)
                .join(Person, Home.person_id == Person.id)
                .where(Security.validate == 1, Security.home_id == id)
                .all()
            )

            return [{
                "id": security.id,
                "name": security.name,
                "Home Name": home.name,
                "Person Name": person.name,
                "status": security.status,
            }
            for security, home, person in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_security_by_Home_Id(id):
        try:
            result = (
                db.session.query(Security, Home, Person)
                .join(Home, Security.home_id == Home.id)
                .join(Person, Home.person_id == Person.id)
                .where(Security.validate == 0, Security.home_id == id)
                .all()
            )

            return [{
                "id": security.id,
                "name": security.name,
                "Home Name": home.name,
                "Person Name": person.name,
                "status": security.status,
            }
                for security, home, person in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Add_Security(data):
        try:
            home = Home.query.filter_by(id=data["home_id"], validate=1).first()
            if home is None:
                return {'error':'Home not found'}

            security = Security(
                name=data['name'],
                status=data['status'],
                home_id=data['home_id'],
                validate=1
            )

            db.session.add(security)
            db.session.commit()
            return {'success':f"Security added successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def Update_Security(data):
        try:
            security = Security.query.filter_by(id=data['id'], validate=1).first()
            if security is None:
                return {'error':'Security not found'}

            home = Home.query.filter_by(id=data["home_id"], validate=1).first()
            if home is None:
                return {'error':'Home not found'}

            security.name = data['name']
            security.status = data['status']
            security.home_id = data['home_id']
            security.validate = 1
            db.session.commit()
            return {'success':f"Security updated successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def Delete_Security(id):
        try:
            security = Security.query.filter_by(id=id, validate=1).first()
            if security is None:
                return {'error':'Security not found'}

            applianceSchedule = (
                ApplianceSchedule.query
                .filter(ApplianceSchedule.table_id == id, ApplianceSchedule.type == 1, ApplianceSchedule.validate == 1)
                .first()
            )
            if applianceSchedule is not None:
                return {'error':'Cannot delete Security, it has Schedule'}

            security.validate = 0
            db.session.commit()
            return {'success':f"Security with id {id} deleted successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def backup_deleted_security_by_id(id):
        try:
            security = Security.query.filter_by(id=id, validate=0).first()
            if security is None:
                return {'error':'Security not found'}

            security.validate = 1
            db.session.commit()
            return {'success':f'{security.id} Backup Successfully'}
        except Exception as e:
            return str(e)

#------------------------ Compartment Locks --------------------------

    @staticmethod
    def List_compartment_lock():
        try:
            result = (
                db.session.query(CompartmentLock, Compartment)
                                 .join(Compartment, CompartmentLock.compartment_id == Compartment.id)
                                 .where(CompartmentLock.validate == 1)
                                 .all()
                                 )
            return [
                {"id": compartmentLock.id,
                 "name": compartmentLock.name,
                 "compartment_Name": compartment.name,
                 "compartment_id":compartment.id,
                 "status": compartmentLock.status,
                 "type":compartmentLock.type,
                 "port":compartmentLock.port
                 }
                for compartmentLock, compartment in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_compartment_lock():
        try:
            result = (db.session.query(CompartmentLock, Compartment)
                      .join(Compartment, CompartmentLock.compartment_id == Compartment.id)
                      .where(CompartmentLock.validate == 0)
                      .all()
                      )
            return [
                {"id": compartmentLock.id,
                 "name": compartmentLock.name,
                 "compartment_Name": compartment.name,
                 "compartment_id": compartment.id,
                 "status": compartmentLock.status,
                 "type": compartmentLock.type,
                 "port": compartmentLock.port
                 }
                for compartmentLock, compartment in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_compartment_lock_by_id(id):
        try:
            result = (db.session.query(CompartmentLock, Compartment)
                      .join(Compartment, CompartmentLock.compartment_id == Compartment.id)
                      .where(CompartmentLock.id == id, CompartmentLock.validate == 1).first()
                      )
            if result is None:
                return {'error': 'Compartment Lock not found'}

            compartmentLock, compartment = result

            return {"id": compartmentLock.id,
                 "name": compartmentLock.name,
                 "compartment_Name": compartment.name,
                 "compartment_id":compartment.id,
                 "status": compartmentLock.status,
                 "type":compartmentLock.type,
                 "port":compartmentLock.port
                 }

        except Exception as e:
            return str(e)

    @staticmethod
    def Get_deleted_compartment_lock_by_id(id):
        try:
            result = (db.session.query(CompartmentLock, Compartment)
                      .join(Compartment, CompartmentLock.compartment_id == Compartment.id)
                      .where(CompartmentLock.id == id, CompartmentLock.validate == 0).first()
                      )
            if result is None:
                return {'error': 'Compartment Lock not found'}

            compartmentLock, compartment = result

            return {"id": compartmentLock.id,
                 "name": compartmentLock.name,
                 "compartment_Name": compartment.name,
                 "compartment_id":compartment.id,
                 "status": compartmentLock.status,
                 "type":compartmentLock.type,
                 "port":compartmentLock.port
                 }
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_compartment_lock_by_name(name):
        try:
            result = (db.session.query(CompartmentLock, Compartment)
                      .join(Compartment, CompartmentLock.compartment_id == Compartment.id)
                      .where(CompartmentLock.name == name, CompartmentLock.validate == 1).first()
                      )
            if result is None:
                return {'error': 'Compartment Lock not found'}

            compartmentLock, compartment = result

            return {"id": compartmentLock.id,
                    "name": compartmentLock.name,
                    "compartment Name": compartment.name,
                    "status": compartmentLock.status,
                    "type": compartmentLock.type
                    }
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_deleted_compartment_lock_by_name(name):
        try:
            result = (db.session.query(CompartmentLock, Compartment)
                      .join(Compartment, CompartmentLock.compartment_id == Compartment.id)
                      .where(CompartmentLock.name == name, CompartmentLock.validate == 0).first()
                      )
            if result is None:
                return {'error': 'Compartment Lock not found'}

            compartmentLock, compartment = result

            return {"id": compartmentLock.id,
                    "name": compartmentLock.name,
                    "compartment Name": compartment.name,
                    "status": compartmentLock.status,
                    "type": compartmentLock.type
                    }
        except Exception as e:
            return str(e)

    @staticmethod
    def List_Compartment_Lock_By_Compartment_id(id):
        try:
            result = (
                      db.session.query(CompartmentLock, Compartment)
                      .join(Compartment, CompartmentLock.compartment_id == Compartment.id)
                      .where(CompartmentLock.compartment_id == id, CompartmentLock.validate == 1).all()
                      )
            return [
                {"Compartment_Lock_id": compartmentLock.id,
                 "name": compartmentLock.name,
                 "compartment_Name": compartment.name,
                 "compartment_id": compartment.id,
                 "status": compartmentLock.status,
                 "type": compartmentLock.type,
                 "port": compartmentLock.port
                 }
                for compartmentLock, compartment in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_compartment_lock_by_compartment_id(id):
        try:
            result = (
                      db.session.query(CompartmentLock, Compartment)
                      .join(Compartment, CompartmentLock.compartment_id == Compartment.id)
                      .where(CompartmentLock.compartment_id == id, CompartmentLock.validate == 0)
                      .all()
                      )
            return [
                {"id": compartmentLock.id,
                 "name": compartmentLock.name,
                 "compartment_Name": compartment.name,
                 "compartment_id": compartment.id,
                 "status": compartmentLock.status,
                 "type": compartmentLock.type,
                 "port": compartmentLock.port
                 }
                for compartmentLock, compartment in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Add_compartment_lock(data):
        try:
            compartment = Compartment.query.filter_by(id=data['compartment_id'],validate=1).first()
            if compartment is None:
                return {'error':'Compartment not found'}

            compartment_lock = CompartmentLock(name=data['name'], compartment_id=data['compartment_id'],
                                               status=data['status'], type=data['type'],port=data['port'],validate=1)
            db.session.add(compartment_lock)
            db.session.commit()
            return {'success':f"{compartment_lock.name} added successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def Update_Compartment_Lock(data):
        try:
            compartment_lock = CompartmentLock.query.filter_by(id=data['id'], validate=1).first()
            if compartment_lock is None:
                return {'error':'Compartment Lock not found'}

            compartment = Compartment.query.filter_by(id=data['compartment_id'], validate=1).first()
            if compartment is None:
                return {'error':'Compartment not found'}

            compartment_lock.name = data['name']
            compartment_lock.compartment_id = data['compartment_id']
            compartment_lock.status = data['status']
            compartment_lock.type = data['type']
            compartment_lock.port = data['port']

            db.session.commit()
            return {'success':f"Compartment Lock with id {compartment_lock.name} updated successfully"}

        except Exception as e:
            return str(e)

    @staticmethod
    def Delete_compartment_lock(id):
        try:
            compartment_lock = CompartmentLock.query.filter_by(id=id, validate=1).first()
            if compartment_lock is None:
                return {'error':'Compartment Lock not found'}

            lock_Schedule = LockSchedule.query.filter_by(compartment_lock_id=id,validate = 1).first()
            if lock_Schedule is not None:
                return {'error':'Compartment_lock associated with Lock Schedule'}

            compartment_lock.validate = 0
            db.session.commit()
            return {"success":f'Compartment Lock deleted successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def backup_deleted_compartment_lock_by_id(id):
        try:
            compartment_lock = CompartmentLock.query.filter_by(id=id, validate=0).first()
            if compartment_lock is None:
                return {'error':'Compartment Lock not found'}

            compartment_lock.validate =1
            db.session.commit()
            return {'success':f"{compartment_lock.name} backup added successfully"}
        except Exception as e:
            return str(e)

#---------------------------- Lock Schedule ---------------------------

    @staticmethod
    def List_lock_schedule():
        try:
            result = (db.session.query(LockSchedule,CompartmentLock)
                      .join(CompartmentLock,LockSchedule.compartment_lock_id == CompartmentLock.id)
                      .filter(LockSchedule.validate == 1)
                      .all()
                      )
            return [
                {"id": lockschedule.id,
                 "Compartment_Lock_id": compartment_lock.id,
                 "name": lockschedule.name,
                 "start_time": lockschedule.start_time.strftime("%H:%M:%S"),
                 "end_time": lockschedule.end_time.strftime("%H:%M:%S"),
                 "days": lockschedule.days
                 }
                for lockschedule, compartment_lock in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_lock_schedule():
        try:
            result = (db.session.query(LockSchedule, CompartmentLock)
                      .join(CompartmentLock, LockSchedule.compartment_lock_id == CompartmentLock.id)
                      .filter(LockSchedule.validate == 0)
                      .all()
                      )
            return [
                {"id": lockschedule.id,
                 "Compartment_Lock_id": compartment_lock.id,
                 "name": lockschedule.name,
                 "start_time": lockschedule.start_time.strftime("%H:%M:%S"),
                 "end_time": lockschedule.end_time.strftime("%H:%M:%S"),
                 "days": lockschedule.days
                 }
                for lockschedule, compartment_lock in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_lock_schedule_by_id(id):
        try:
            result = (db.session.query(LockSchedule, CompartmentLock)
                      .join(CompartmentLock, LockSchedule.compartment_lock_id == CompartmentLock.id)
                      .filter(LockSchedule.id == id, LockSchedule.validate == 1)
                      .first()
                      )
            if result is None:
                return {'error':'Lock Schedule not found'}

            lockschedule, compartment_lock = result
            return {"id": lockschedule.id,
                 "Compartment_Lock_id": compartment_lock.id,
                 "name": lockschedule.name,
                 "start_time": lockschedule.start_time.strftime("%H:%M:%S"),
                 "end_time": lockschedule.end_time.strftime("%H:%M:%S"),
                 "days": lockschedule.days
                 }
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_deleted_lock_schedule_by_id(id):
        try:
            result = (
                      db.session.query(LockSchedule, CompartmentLock)
                      .join(CompartmentLock, LockSchedule.compartment_lock_id == CompartmentLock.id)
                      .filter(LockSchedule.id == id, LockSchedule.validate == 0)
                      .first()
                      )
            if result is None:
                return {'error': 'Lock Schedule not found'}

            lockschedule, compartment_lock = result
            return {"id": lockschedule.id,
                 "Compartment_Lock_id": compartment_lock.id,
                 "name": lockschedule.name,
                 "start_time": lockschedule.start_time.strftime("%H:%M:%S"),
                 "end_time": lockschedule.end_time.strftime("%H:%M:%S"),
                 "days": lockschedule.days
                 }
        except Exception as e:
            return str(e)

    @staticmethod
    def List_lock_schedule_by_compartment_lock_id(id):
        try:
            result = (db.session.query(LockSchedule, CompartmentLock)
                      .join(CompartmentLock, LockSchedule.compartment_lock_id == CompartmentLock.id)
                      .filter(LockSchedule.compartment_lock_id == id, LockSchedule.validate == 1).all()
                      )
            return [
                {"id": lockschedule.id,
                 "Compartment_Lock_id": compartment_lock.id,
                 "name": lockschedule.name,
                 "start_time": lockschedule.start_time.strftime("%H:%M:%S"),
                 "end_time": lockschedule.end_time.strftime("%H:%M:%S"),
                 "days": lockschedule.days
                 }
                for lockschedule, compartment_lock in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_lock_schedule_by_compartment_lock_id(id):
        try:
            result = (db.session.query(LockSchedule, CompartmentLock)
                      .join(CompartmentLock, LockSchedule.compartment_lock_id == CompartmentLock.id)
                      .filter(LockSchedule.compartment_lock_id == id, LockSchedule.validate == 0).all()
                      )
            return [
                {"id": lockschedule.id,
                 "Compartment_Lock_id": compartment_lock.id,
                 "name": lockschedule.name,
                 "start_time": lockschedule.start_time.strftime("%H:%M:%S"),
                 "end_time": lockschedule.end_time.strftime("%H:%M:%S"),
                 "days": lockschedule.days
                 }
                for lockschedule, compartment_lock in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def list_Lock_schedule_by_compartment_id(id):
        try:
            result = (db.session.query(LockSchedule, CompartmentLock, Compartment)
                                 .join(CompartmentLock, LockSchedule.compartment_lock_id == CompartmentLock.id)
                                 .join(Compartment, CompartmentLock.compartment_id == Compartment.id)
                                 .where(LockSchedule.validate == 1, CompartmentLock.compartment_id == id)
                                 .all()
                                 )
            return [{"id": lockschedule.id,
                 "Compartment_Lock_id": compartment_lock.id,
                 "name": lockschedule.name,
                 "start_time": lockschedule.start_time.strftime("%H:%M:%S"),
                 "end_time": lockschedule.end_time.strftime("%H:%M:%S"),
                 "days": lockschedule.days,
                 "lock_type":lockschedule.lock_type
                 }
                for lockschedule, compartment_lock, compartment in result]
        except Exception as e:
            return str(e)

    @staticmethod
    def Add_lock_Schedule(data):
        try:
            compartment = CompartmentLock.query.filter_by(id=data['compartment_lock_id'], validate=1).first()
            if compartment is None:
                return {'error':'Compartment Lock not found'}

            lock_schedule = LockSchedule(name=data['name'], lock_type=data['lock_type'],
                                         start_time=data['start_time'],
                                         end_time=data['end_time'], days=data['days'],
                                         compartment_lock_id=data['compartment_lock_id'],
                                         validate=1)
            db.session.add(lock_schedule)
            db.session.commit()
            return {'success':'Lock Schedule Added SuccessFully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def Update_lock_schedule(data):
        try:
            lock_schedule = LockSchedule.query.filter_by(id=data['id'], validate=1).first()
            if lock_schedule is None:
                return {'success':'Lock Schedule not found'}

            compartment = CompartmentLock.query.filter_by(id=data['compartment_lock_id'], validate=1).first()
            if compartment is None:
                return {'error':'Compartment Lock not found'}

            lock_schedule.name = data['name']
            lock_schedule.lock_type = data['lock_type']
            lock_schedule.start_time = data['start_time']
            lock_schedule.end_time = data['end_time']
            lock_schedule.days = data['days']
            lock_schedule.compartment_lock_id = data['compartment_lock_id']

            db.session.commit()
            return {'success':'Lock Schedule Updated Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def Delete_lock_schedule(id):
        try:
            lock_schedule = LockSchedule.query.filter_by(id=id, validate=1).first()
            if lock_schedule is None:
                return {'error':'Lock Schedule not found'}

            lock_schedule_LOg = LockScheduleLog.query.filter_by(lock_schedule_id=id, validate=1).first()
            if lock_schedule_LOg is not None:
                return {'error':'Lock Schedule has associated lock schedule Log, Cant deleted'}

            lock_schedule.validate = 0
            db.session.commit()
            return {'success':'Lock Schedule Deleted Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def backup_deleted_lock_schedule_by_id(id):
        try:
            lock_schedule = LockSchedule.query.filter_by(id=id, validate=0).first()
            if lock_schedule is None:
                return {'error':'Lock Schedule not found'}

            lock_schedule.validate = 1
            db.session.commit()
            return {'success':'Backup Lock Schedule Log Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def update_matching_Lock_schedules(data):

        old = data.get('old')
        new = data.get('new')

        if not old or not new:
            return {'error': 'Old and new data are required'}

        try:
            schedules = LockSchedule.query.filter_by(
                name=old['name'],
                start_time=old['start_time'],
                end_time=old['end_time'],
                days=old['days']
            ).all()

            for schedule in schedules:
                schedule.name = new['name']
                schedule.start_time = new['start_time']
                schedule.end_time = new['end_time']
                schedule.days = new['days']

            db.session.commit()

            return {'success': f'{len(schedules)} schedule(s) updated successfully'}

        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}

    @staticmethod
    def delete_matching_Lock_Schedule(data):

        old = data.get('old')
        try:
            schedules = LockSchedule.query.filter_by(
                name=old['name'],
                start_time=old['start_time'],
                end_time=old['end_time'],
                days=old['days'],
                lock_type=old['lock_type'],
                validate=old['validate']
            ).all()

            for schedule in schedules:
                schedule.validate = 0

            db.session.commit()

            return {'success': f'{len(schedules)} schedule(s) deleted successfully'}

        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}

#---------------------- Lock Schedule Log --------------------------------

    @staticmethod
    def List_lock_schedule_log():
        try:
            result = (db.session.query(LockScheduleLog,LockSchedule)
                      .join(LockSchedule,LockScheduleLog.lock_schedule_id == LockSchedule.id)
                      .filter(LockScheduleLog.validate == 1).all()
                      )
            return [
                {
                    "id": lockScheduleLog.id,
                    "lock_schedule_name": lock_schedule.name,
                    "start_time": lockScheduleLog.start_time,
                    "end_time": lockScheduleLog.end_time,
                    "days": lockScheduleLog.days,
                }
                for lockScheduleLog, lock_schedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_lock_schedule_log():
        try:
            result = (db.session.query(LockScheduleLog, LockSchedule)
                      .join(LockSchedule, LockScheduleLog.lock_schedule_id == LockSchedule.id)
                      .filter(LockScheduleLog.validate == 0).all()
                      )
            return [
                {
                    "id": lockScheduleLog.id,
                    "lock_schedule_name": lock_schedule.name,
                    "start_time": lockScheduleLog.start_time,
                    "end_time": lockScheduleLog.end_time,
                    "days": lockScheduleLog.days,
                }
                for lockScheduleLog, lock_schedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_Lock_Schedule_Log_by_id(id):
        try:
            result = (db.session.query(LockScheduleLog, LockSchedule)
                      .join(LockSchedule, LockScheduleLog.lock_schedule_id == LockSchedule.id)
                      .filter(LockScheduleLog.id == id, LockScheduleLog.validate == 1).first()
                      )
            if result is None:
                return {'error':'Lock Schedule Log not found'}

            lockScheduleLog, lock_schedule = result
            return {
                    "id": lockScheduleLog.id,
                    "lock_schedule_name": lock_schedule.name,
                    "start_time": lockScheduleLog.start_time,
                    "end_time": lockScheduleLog.end_time,
                    "days": lockScheduleLog.days,
                }
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_Deleted_Lock_Schedule_Log_by_id(id):
        try:
            result = (db.session.query(LockScheduleLog, LockSchedule)
                      .join(LockSchedule, LockScheduleLog.lock_schedule_id == LockSchedule.id)
                      .filter(LockScheduleLog.id == id, LockScheduleLog.validate == 0).first()
                      )
            if result is None:
                return {'error': 'Lock Schedule Log not found'}

            lockScheduleLog, lock_schedule = result
            return {
                "id": lockScheduleLog.id,
                "lock_schedule_name": lock_schedule.name,
                "start_time": lockScheduleLog.start_time,
                "end_time": lockScheduleLog.end_time,
                "days": lockScheduleLog.days,
            }
        except Exception as e:
            return str(e)

    @staticmethod
    def List_Lock_Schedule_Log_by_Lock_Schedule_id(id):
        try:
            result = (db.session.query(LockScheduleLog, LockSchedule)
                      .join(LockSchedule, LockScheduleLog.lock_schedule_id == LockSchedule.id)
                      .filter(LockScheduleLog.lock_schedule_id == id, LockScheduleLog.validate == 1).all()
                      )
            return [
                {
                    "id": lockScheduleLog.id,
                    "lock_schedule_name": lock_schedule.name,
                    "start_time": lockScheduleLog.start_time,
                    "end_time": lockScheduleLog.end_time,
                    "days": lockScheduleLog.days,
                }
                for lockScheduleLog, lock_schedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_Deleted_Lock_Schedule_Log_by_Lock_Schedule_id(id):
        try:
            result = (db.session.query(LockScheduleLog, LockSchedule)
                      .join(LockSchedule, LockScheduleLog.lock_schedule_id == LockSchedule.id)
                      .filter(LockScheduleLog.lock_schedule_id == id, LockScheduleLog.validate == 0).all()
                      )
            return [
                {
                    "id": lockScheduleLog.id,
                    "lock_schedule_name": lock_schedule.name,
                    "start_time": lockScheduleLog.start_time,
                    "end_time": lockScheduleLog.end_time,
                    "days": lockScheduleLog.days,
                }
                for lockScheduleLog, lock_schedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Add_Lock_Schedule_Log(data):
        try:
            lock_schedule = LockSchedule.query.filter_by(id=data['lock_schedule_id'], validate=1).first()
            if lock_schedule is None:
                return {'error':'Lock Schedule not found'}

            lock_schedule_log = LockScheduleLog(lock_schedule_id=data['lock_schedule_id'],
                                                 start_time=data['start_time'],
                                                 end_time=data['end_time'],
                                                 days=data['days'],
                                                 validate=1)
            db.session.add(lock_schedule_log)
            db.session.commit()
            return {'success':'Lock Schedule Log Added Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def Update_Lock_Schedule_Log(data):
        try:
            lock_schedule_log = LockScheduleLog.query.filter_by(id=data['id'], validate=1).first()
            if lock_schedule_log is None:
                return {'error':'Lock Schedule Log not found'}

            lock_schedule = LockSchedule.query.filter_by(id=data['lock_schedule_id'], validate=1).first()
            if lock_schedule is None:
                return {'error':'Lock Schedule not found'}

            lock_schedule_log.start_time = data['start_time']
            lock_schedule_log.end_time = data['end_time']
            lock_schedule_log.days = data['days']
            lock_schedule_log.lock_schedule_id = data['lock_schedule_id']

            db.session.commit()
            return {'succes':'Lock Schedule Log Updated Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def Delete_Lock_Schedule_Log_By_id(id):
        try:
            lock_schedule_log = LockScheduleLog.query.filter_by(id=id, validate=1).first()
            if lock_schedule_log is None:
                return {'error':'Lock Schedule Log not found'}

            lock_schedule_log.validate = 0
            db.session.commit()
            return {'success':'Lock Schedule Log Deleted Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def Backup_Lock_Schedule_Log_by_id(id):
        try:
            lock_schedule_log = LockScheduleLog.query.filter_by(id=id, validate=0).first()
            if lock_schedule_log is None:
                return {'error':'Lock Schedule Log not found'}

            lock_schedule_log.validate = 1
            db.session.commit()
            return {'success':'Backup Lock Schedule Log Successfully'}
        except Exception as e:
            return str(e)

#----------------------------- Home Sprinkler ------------------------

    @staticmethod
    def List_home_sprinkler():
        try:
            result = (db.session.query(HomeSprinkler,Home)
                      .join(Home, HomeSprinkler.home_id == Home.id)
                      .filter(HomeSprinkler.validate == 1).all()
                      )
            return [
                {
                    "id": homeSprinkler.id,
                    "home_name": home.name,
                    "name": homeSprinkler.name,
                    "status": homeSprinkler.status
                }
                for homeSprinkler,home in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_Deleted_home_sprinkler():
        try:
            result = (db.session.query(HomeSprinkler, Home)
                      .join(Home, HomeSprinkler.home_id == Home.id)
                      .filter(HomeSprinkler.validate == 0).all()
                      )
            return [
                {
                    "id": homeSprinkler.id,
                    "home_name": home.name,
                    "name": homeSprinkler.name,
                    "status": homeSprinkler.status
                }
                for homeSprinkler, home in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_home_sprinkler_by_id(id):
        try:
            result = (db.session.query(HomeSprinkler, Home)
                      .join(Home, HomeSprinkler.home_id == Home.id)
                      .filter(HomeSprinkler.id == id,HomeSprinkler.validate == 1).first()
                      )
            if result is None:
                return {'error':'Sprinkler not found'};

            homeSprinkler, home = result
            return [
                {
                    "id": homeSprinkler.id,
                    "home_name": home.name,
                    "name": homeSprinkler.name,
                    "status": homeSprinkler.status
                }
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_Deleted_home_sprinkler_by_id(id):
        try:
            result = (db.session.query(HomeSprinkler, Home)
                      .join(Home, HomeSprinkler.home_id == Home.id)
                      .filter(HomeSprinkler.id == id,HomeSprinkler.validate == 0).first()
                      )
            if result is None:
                return {'error':'Sprinkler not found'};

            homeSprinkler, home = result
            return [
                {
                    "id": homeSprinkler.id,
                    "home_name": home.name,
                    "name": homeSprinkler.name,
                    "status": homeSprinkler.status
                }]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_home_sprinkler_by_home_id(id):
        try:
            result = (db.session.query(HomeSprinkler, Home)
                      .join(Home, HomeSprinkler.home_id == Home.id)
                      .filter(HomeSprinkler.home_id == id, HomeSprinkler.validate == 1).all()
                      )
            return [
                {
                    "id": homeSprinkler.id,
                    "home_id": home.id,
                    "home_name": home.name,
                    "name": homeSprinkler.name,
                    "status": homeSprinkler.status
                }
                for homeSprinkler, home in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_home_sprinkler_by_home_id(id):
        try:
            result = (db.session.query(HomeSprinkler, Home)
                      .join(Home, HomeSprinkler.home_id == Home.id)
                      .filter(HomeSprinkler.home_id == id, HomeSprinkler.validate == 0).all()
                      )
            return [
                {
                    "id": homeSprinkler.id,
                    "home_name": home.name,
                    "name": homeSprinkler.name,
                    "status": homeSprinkler.status
                }
                for homeSprinkler, home in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Add_Home_Sprinkler(data):
        try:
            home = Home.query.filter_by(id=data['home_id'], validate=1).first()
            if home is None:
                return {'error':'Home not exists'}

            home_sprinkler = HomeSprinkler(

                name=data['name'],
                status=data['status'],
                home_id=data['home_id'],
                validate=1
            )
            db.session.add(home_sprinkler)
            db.session.commit()
            return {'success':'Home Sprinkler Added Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def Update_home_sprinkler(data):
        try:
            home_sprinkler = HomeSprinkler.query.filter_by(id=data['id'], validate=1).first()
            if home_sprinkler is None:
                return {'error':'Home Sprinkler not found'}

            home = Home.query.filter_by(id=data['home_id'], validate=1).first()
            if home is None:
                return {'error':'Home not exists'}

            home_sprinkler.name = data['name']
            home_sprinkler.status = data['status']
            db.session.commit()
            return {'success':'Home Sprinkler Updated Successfully'}
        except Exception as e:
            return str(e)


    @staticmethod
    def Delete_home_sprinkler_By_id(id):
        try:
            home_sprinkler = HomeSprinkler.query.filter_by(id=id, validate=1).first()
            if home_sprinkler is None:
                return {'error':'Home Sprinkler not found'}

            sprinkler_schedule = SprinklerSchedule.query.filter_by(home_sprinkler_id=id, validate=1).first()
            if sprinkler_schedule is not None:
                return {'error':'Cannot delete Home Sprinkler. It has associated Sprinkler Schedule'}

            home_sprinkler.validate = 0
            db.session.commit()
            return {'success':'Home Sprinkler Deleted Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def Backup_home_sprinkler_by_id(id):
        try:
            home_sprinkler = HomeSprinkler.query.filter_by(id=id, validate=0).first()
            if home_sprinkler is None:
                return {'error':'Home Sprinkler not found'}

            home_sprinkler.validate = 1
            db.session.commit()
            return {'success':'Home Sprinkler Backup Created Successfully'}
        except Exception as e:
            return str(e)

# ----------------------------- Sprinkler Schedule -----------------------------

    @staticmethod
    def List_sprinkler_schedule():
        try:
            result = (db.session.query(SprinklerSchedule,HomeSprinkler)
                     .join(HomeSprinkler,SprinklerSchedule.home_sprinkler_id==HomeSprinkler.id)
                     .filter(SprinklerSchedule.validate == 1).all()
                     )
            return [
                {
                    "id": sprinkler_schedule.id,
                    "name": sprinkler_schedule.name,
                    "home_sprinkler_name": home_sprinkler.name,
                    "season":sprinkler_schedule.season,
                    "start_time": sprinkler_schedule.start_time,
                    "end_time": sprinkler_schedule.end_time,
                    "days": sprinkler_schedule.days
                }
                for sprinkler_schedule, home_sprinkler in result
                ]
        except Exception as a:
            str(a)

    @staticmethod
    def List_deleted_sprinkler_schedule():
        try:
            result = (db.session.query(SprinklerSchedule, HomeSprinkler)
                      .join(HomeSprinkler, SprinklerSchedule.home_sprinkler_id == HomeSprinkler.id)
                      .filter(SprinklerSchedule.validate == 0).all()
                      )
            return [
                {
                    "id": sprinkler_schedule.id,
                    "name": sprinkler_schedule.name,
                    "home_sprinkler_name": home_sprinkler.name,
                    "season": sprinkler_schedule.season,
                    "start_time": sprinkler_schedule.start_time,
                    "end_time": sprinkler_schedule.end_time,
                    "days": sprinkler_schedule.days
                }
                for sprinkler_schedule, home_sprinkler in result
            ]
        except Exception as a:
            str(a)

    @staticmethod
    def Get_sprinkler_schedule_by_id(id):
        try:
            result = (db.session.query(SprinklerSchedule, HomeSprinkler)
                      .join(HomeSprinkler, SprinklerSchedule.home_sprinkler_id == HomeSprinkler.id)
                      .filter(SprinklerSchedule.id == id, SprinklerSchedule.validate == 1).first()
                      )
            if result is None:
                return {'error':'Sprinkler Sprinkler Not Found'};

            sprinkler_schedule, home_sprinkler = result
            return [
                {
                    "id": sprinkler_schedule.id,
                    "name": sprinkler_schedule.name,
                    "home_sprinkler_name": home_sprinkler.name,
                    "season": sprinkler_schedule.season,
                    "start_time": sprinkler_schedule.start_time,
                    "end_time": sprinkler_schedule.end_time,
                    "days": sprinkler_schedule.days
                }
            ]

        except Exception as a:
            str(a)

    @staticmethod
    def Get_Deleted_sprinkler_schedule_by_id(id):
        try:
            result = (db.session.query(SprinklerSchedule, HomeSprinkler)
                      .join(HomeSprinkler, SprinklerSchedule.home_sprinkler_id == HomeSprinkler.id)
                      .filter(SprinklerSchedule.id == id, SprinklerSchedule.validate == 0).first()
                      )
            if result is None:
                return {'error':'Sprinkler Sprinkler Not Found'};

            sprinkler_schedule, home_sprinkler = result
            return [
                {
                    "id": sprinkler_schedule.id,
                    "name": sprinkler_schedule.name,
                    "home_sprinkler_name": home_sprinkler.name,
                    "season": sprinkler_schedule.season,
                    "start_time": sprinkler_schedule.start_time,
                    "end_time": sprinkler_schedule.end_time,
                    "days": sprinkler_schedule.days
                }
            ]
        except Exception as a:
            str(a)

    @staticmethod
    def List_sprinkler_schedule_by_home_sprinkler_id(id):
        try:
            result = (db.session.query(SprinklerSchedule, HomeSprinkler)
                     .join(HomeSprinkler, SprinklerSchedule.home_sprinkler_id==HomeSprinkler.id)
                     .filter(SprinklerSchedule.home_sprinkler_id == id, SprinklerSchedule.validate == 1).all()
                      )
            return [
                {
                    "id": sprinkler_schedule.id,
                    "name": sprinkler_schedule.name,
                    "home_sprinkler_name": home_sprinkler.name,
                    "season": sprinkler_schedule.season,
                    "start_time": sprinkler_schedule.start_time,
                    "end_time": sprinkler_schedule.end_time,
                    "days": sprinkler_schedule.days
                }
                for sprinkler_schedule, home_sprinkler in result
                ]
        except Exception as a:
            str(a)

    @staticmethod
    def List_deleted_sprinkler_schedule_by_home_sprinkler_id(id):
        try:
            result = (db.session.query(SprinklerSchedule, HomeSprinkler)
                      .join(HomeSprinkler, SprinklerSchedule.home_sprinkler_id == HomeSprinkler.id)
                      .filter(SprinklerSchedule.home_sprinkler_id == id, SprinklerSchedule.validate == 0).all()
                      )
            return [
                {
                    "id": sprinkler_schedule.id,
                    "name": sprinkler_schedule.name,
                    "home_sprinkler_name": home_sprinkler.name,
                    "season": sprinkler_schedule.season,
                    "start_time": sprinkler_schedule.start_time,
                    "end_time": sprinkler_schedule.end_time,
                    "days": sprinkler_schedule.days
                }
                for sprinkler_schedule, home_sprinkler in result
            ]
        except Exception as a:
            str(a)

    @staticmethod
    def Add_sprinkler_schedule(data):
        try:
            home_sprinkler = HomeSprinkler.query.filter_by(id=data['home_sprinkler_id'],validate=1).first()
            if home_sprinkler is None:
                return {'error':'Invalid Home Sprinkler ID.'}

            new_sprinkler_schedule = SprinklerSchedule(
                name=data['name'],
                home_sprinkler_id=data['home_sprinkler_id'],
                season=data['season'],
                start_time=data['start_time'],
                end_time=data['end_time'],
                days=data['days'],
                validate=1
            )
            db.session.add(new_sprinkler_schedule)
            db.session.commit()
            return {"success":'Sprinkler Schedule added successfully.'}
        except Exception as a:
            str(a)

    @staticmethod
    def Update_sprinkler_schedule(data):
        try:
            sprinkler_schedule = SprinklerSchedule.query.filter_by(id=data['id'], validate=1).first()
            if sprinkler_schedule is None:
                return {'error':'Invalid Sprinkler Schedule ID.'}

            home_sprinkler = HomeSprinkler.query.filter_by(id=data['home_sprinkler_id'], validate=1).first()
            if home_sprinkler is None:
                return {'error':'Invalid Home Sprinkler ID.'}

            sprinkler_schedule.name = data['name']
            sprinkler_schedule.home_sprinkler_id = data['home_sprinkler_id']
            sprinkler_schedule.season = data['season']
            sprinkler_schedule.start_time = data['start_time']
            sprinkler_schedule.end_time = data['end_time']
            sprinkler_schedule.days = data['days']
            db.session.commit()
            return {'error':'Sprinkler Schedule updated successfully.'}
        except Exception as a:
            str(a)

    @staticmethod
    def Delete_sprinkler_schedule_by_id(id):
        try:
            sprinkler_schedule = SprinklerSchedule.query.filter_by(id=id, validate=1).first()
            if sprinkler_schedule is None:
                return {"error":'Invalid Sprinkler Schedule ID.'}

            sprinkler_schedule_log = (SprinklerScheduleLog.query
                                      .filter_by(sprinkler_schedule_id=id,validate=1)
                                      .first()
                                      )
            if sprinkler_schedule_log is not None:
                return {'error':'Sprinkler Schedule has LOG, not Deleted'}

            sprinkler_schedule.validate = 0
            db.session.commit()
            return {'success':'Sprinkler Schedule deleted successfully.'}
        except Exception as a:
            str(a)

    @staticmethod
    def Backup_sprinkler_schedule_by_id(id):
        try:
            sprinkler_schedule = SprinklerSchedule.query.filter_by(id=id, validate=0).first()
            if sprinkler_schedule is None:
                return {'error':'Invalid Sprinkler Schedule ID.'}

            sprinkler_schedule.validate = 1
            db.session.commit()
            return {'success':'Sprinkler Schedule backed up successfully.'}
        except Exception as a:
            str(a)

#  ----------------------------- Sprinkler Schedule LOG -----------------------------------

    @staticmethod
    def List_Sprinkler_schedule_log():
        try:
            result = (db.session.query(SprinklerScheduleLog,SprinklerSchedule)
                      .join(SprinklerSchedule,SprinklerScheduleLog.sprinkler_schedule_id == SprinklerSchedule.id)
                      .filter(SprinklerScheduleLog.validate == 1).all()
                      )
            return [
                {
                    "id": sprinklerScheduleLog.id,
                    "sprinkler_schedule_id": sprinklerSchedule.id,
                    "sprinkler_schedule_name":sprinklerSchedule.name,
                    "start_time": sprinklerScheduleLog.start_time,
                    "end_time": sprinklerScheduleLog.end_time,
                    "days": sprinklerScheduleLog.days,
                }
                for sprinklerScheduleLog,sprinklerSchedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_Sprinkler_schedule_log():
        try:
            result = (
                      db.session.query(SprinklerScheduleLog,SprinklerSchedule)
                      .join(SprinklerSchedule, SprinklerScheduleLog.sprinkler_schedule_id == SprinklerSchedule.id)
                      .filter(SprinklerScheduleLog.validate == 0).all()
                      )
            return [
                {
                    "id": sprinklerScheduleLog.id,
                    "sprinkler_schedule_id": sprinklerSchedule.id,
                    "sprinkler_schedule_name":sprinklerSchedule.name,
                    "start_time": sprinklerScheduleLog.start_time,
                    "end_time": sprinklerScheduleLog.end_time,
                    "days": sprinklerScheduleLog.days
                }
                for sprinklerScheduleLog,sprinklerSchedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_Sprinkler_Schedule_Log_by_id(id):
        try:
            result = (db.session.query(SprinklerScheduleLog,SprinklerSchedule)
                      .join(SprinklerSchedule, SprinklerScheduleLog.sprinkler_schedule_id == SprinklerSchedule.id)
                      .filter(SprinklerScheduleLog.id == id, SprinklerScheduleLog.validate == 1).all()
                      )
            return [
                {
                    "id": sprinklerScheduleLog.id,
                    "sprinkler_schedule_name":sprinklerSchedule.name,
                    "start_time": sprinklerScheduleLog.start_time,
                    "end_time": sprinklerScheduleLog.end_time,
                    "days": sprinklerScheduleLog.days,
                }
                for sprinklerScheduleLog,sprinklerSchedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Get_Deleted_Sprinkler_Schedule_Log_by_id(id):
        try:
            result = (db.session.query(SprinklerScheduleLog,SprinklerSchedule)
                      .join(SprinklerSchedule, SprinklerScheduleLog.sprinkler_schedule_id == SprinklerSchedule.id)
                      .filter(SprinklerScheduleLog.id == id, SprinklerScheduleLog.validate == 0).all()
                      )
            return [
                {
                    "id": scheduleLog.id,
                    "sprinkler_schedule_name":sprinklerSchedule.name,
                    "start_time": scheduleLog.start_time,
                    "end_time": scheduleLog.end_time,
                    "days": scheduleLog.days,
                }
                for scheduleLog,sprinklerSchedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_sprinkler_Schedule_Log_by_sprinkler_Schedule_id(id):
        try:
            result = (
                      db.session.query(SprinklerScheduleLog,SprinklerSchedule)
                      .join(SprinklerSchedule, SprinklerScheduleLog.sprinkler_schedule_id == SprinklerSchedule.id)
                      .filter(SprinklerScheduleLog.sprinkler_schedule_id == id, SprinklerScheduleLog.validate == 1)
                      .all()
                      )
            return [
                {
                    "id": sprinkler.id,
                    "sprinkler_schedule_name":sprinklerSchedule.name,
                    "start_time": sprinkler.start_time,
                    "end_time": sprinkler.end_time,
                    "days": sprinkler.days,
                }
                for sprinkler,sprinklerSchedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_Deleted_sprinkler_Schedule_Log_by_sprinkler_Schedule_id(id):
        try:
            result = (
                db.session.query(SprinklerScheduleLog, SprinklerSchedule)
                .join(SprinklerSchedule, SprinklerScheduleLog.sprinkler_schedule_id == SprinklerSchedule.id)
                .filter(SprinklerScheduleLog.sprinkler_schedule_id == id, SprinklerScheduleLog.validate == 0)
                .all()
            )
            return [
                {
                    "id": sprinkler.id,
                    "sprinkler_schedule_name": sprinklerSchedule.name,
                    "start_time": sprinkler.start_time,
                    "end_time": sprinkler.end_time,
                    "days": sprinkler.days,
                }
                for sprinkler, sprinklerSchedule in result
            ]
        except Exception as e:
            return str(e)

    @staticmethod
    def Add_sprinkler_Schedule_Log(data):
        try:
            sprinkler_schedule = SprinklerSchedule.query.filter_by(id=data['sprinkler_schedule_id'], validate=1).first()
            if sprinkler_schedule is None:
                return {'error':'Sprinkler Schedule not found'}

            sprinkler_schedule_log = SprinklerScheduleLog(sprinkler_schedule_id=data['sprinkler_schedule_id'],
                                                 start_time=data['start_time'],
                                                 end_time=data['end_time'],
                                                 days=data['days'],
                                                 validate=1)
            db.session.add(sprinkler_schedule_log)
            db.session.commit()
            return {'success':'sprinkler Schedule Log Added Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def Update_Sprinkler_Schedule_Log(data):
        try:
            sprinkler_schedule_log = SprinklerScheduleLog.query.filter_by(id=data['id'], validate=1).first()
            if sprinkler_schedule_log is None:
                return {'error':'Sprinkler Schedule Log not found'}

            Sprinkler_schedule = SprinklerSchedule.query.filter_by(id=data['sprinkler_schedule_id'], validate=1).first()
            if Sprinkler_schedule is None:
                return {'error':'Sprinkler Schedule not found'}

            sprinkler_schedule_log.start_time = data['start_time']
            sprinkler_schedule_log.end_time = data['end_time']
            sprinkler_schedule_log.days = data['days']
            sprinkler_schedule_log.sprinkler_schedule_id = data['sprinkler_schedule_id']

            db.session.commit()
            return {'success':'Lock Schedule Log Updated Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def Delete_sprinkler_Schedule_Log_By_id(id):
        try:
            sprinkler_schedule_log = SprinklerScheduleLog.query.filter_by(id=id, validate=1).first()
            if sprinkler_schedule_log is None:
                return {'error':'Lock Schedule Log not found'}

            sprinkler_schedule_log.validate = 0
            db.session.commit()
            return {"success":'Lock Schedule Log Deleted Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def Backup_sprinkler_Schedule_Log_by_id(id):
        try:
            sprinkler = SprinklerScheduleLog.query.filter_by(id=id, validate=0).first()
            if sprinkler is None:
                return {'error':'Lock Schedule Log not found'}

            sprinkler.validate = 1
            db.session.commit()
            return {'success':'Backup Lock Schedule Log Successfully'}
        except Exception as e:
            return str(e)
