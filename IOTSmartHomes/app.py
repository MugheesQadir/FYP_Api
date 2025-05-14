from flask import jsonify,request

from Controller.ApplianceController import ApplianceController
from Controller.HardwareController import HardwareController
from Controller.HomeController import HomeController
from Controller.PersonController import PersonController
from config import app


############### Person ##############

@app.route('/ListPerson',methods=['GET'])
def listpersons():
    persons = PersonController.list_person()
    return jsonify(persons)

@app.route('/GetPersonById/<int:id>',methods=['GET'])
def getpersondetails(id):
    persons = PersonController.get_person_by_id(id)
    return jsonify(persons)


@app.route('/GetPersonByName/<string:name>',methods=['GET'])
def getpersonbyname(name):
    persons = PersonController.get_person_by_name(name)
    return jsonify(persons)

#OK
@app.route('/login_person',methods = ['POST'])
def login_person():
    data = request.get_json()
    person = PersonController.login_person(data)
    return jsonify(person)

#OK
@app.route('/SignUp_Person',methods = ["POST"])
def signup_person():
    data = request.get_json()
    person = PersonController.signup_person(data)
    return jsonify(person)

@app.route('/UpdatePerson',methods = ["POST"])
def updateperson():
    data = request.get_json()
    person = PersonController.update_person(data)
    return jsonify(person)

@app.route('/DeletePerson/<int:id>',methods = ['DELETE'])
def deleteperson(id):
    person = PersonController.delete_person(id)
    return jsonify(person)

@app.route('/List_Deleted_Persons',methods = ['GET'])
def list_deleted_persons():
    persons = PersonController.list_deleted_person()
    return jsonify(persons)

@app.route('/Get_Deleted_Person_by_id/<int:id>',methods = ['GET'])
def Get_deleted_person(id):
    persons = PersonController.get_Deleted_person_by_id(id)
    return jsonify(persons)

@app.route('/Backup_person_by_id/<int:id>',methods=['GET'])
def backupPersonbyid(id):
    person = PersonController.Backup_person_by_id(id)
    return jsonify(person)

############################## City ##################################

#OK
@app.route('/ListCities',methods=['GET'])
def listcities():
    cities = HomeController.list_cities()
    return jsonify(cities)

@app.route('/GetCitiesById/<int:id>',methods=['GET'])
def getcitiesbyid(id):
    cities = HomeController.get_cities_by_id(id)
    return jsonify(cities)

@app.route('/GetCitiesByName/<string:name>',methods=['GET'])
def getcitiesbyname(name):
    cities = HomeController.get_city_by_name(name)
    return jsonify(cities)

@app.route('/AddCities',methods = ["POST"])
def addcities():
    data = request.get_json()
    city = HomeController.add_cities(data)
    return jsonify(city)

@app.route('/UpdateCities',methods = ["POST"])
def updatecities():
    data = request.get_json()
    city = HomeController.update_cities(data)
    return jsonify(city)

@app.route('/DeleteCities/<int:id>',methods = ['DELETE'])
def deletecities(id):
    city = HomeController.delete_cities(id)
    return jsonify(city)

@app.route('/List_deleted_cities',methods = ['GET'])
def get_deleted_cities_by_name():
    city = HomeController.list_deleted_cities()
    return jsonify(city)

@app.route('/get_deleted_cities_by_id/<int:id>',methods = ['GET'])
def get_deleted_cities_by_id(id):
    city = HomeController.get_deleted_cities_by_id(id)
    return  jsonify(city)

@app.route('/Backup_cities_by_id/<int:id>',methods=['GET'])
def backupCitiesbyid(id):
    city = HomeController.Backup_city_by_id(id)
    return jsonify(city)

############################ Place ####################################

@app.route('/ListPlace',methods=['GET'])
def listPlaces():
    place = HomeController.list_place()
    return jsonify(place)

@app.route('/GetPlaceById/<int:id>',methods=['GET'])
def getPlaceById(id):
    place = HomeController.get_place_by_id(id)
    return jsonify(place)

@app.route('/GetPlaceByName/<string:name>',methods=['GET'])
def getPlaceByName(name):
    place = HomeController.get_place_by_name(name)
    return jsonify(place)

#OK
@app.route('/ListPlacesByCityId/<int:id>',methods = ['GET'])
def ListPlaceByCityID(id):
    place = HomeController.List_places_by_city_id(id)
    return jsonify(place)

@app.route('/GetDeletedPlaceByCityId/<int:city_id>',methods = ['GET'])
def getDeletedPlaceByCityID(city_id):
    place = HomeController.get_deleted_place_by_city_id(city_id)
    return jsonify(place)

@app.route('/AddPlace',methods=['POST'])
def addPlace():
    data = request.get_json()
    place = HomeController.add_place(data)
    return jsonify(place)

@app.route('/UpdatePlace',methods = ["POST"])
def updatePlaces():
    data = request.get_json()
    place = HomeController.update_place(data)
    return jsonify(place)

@app.route('/DeletePlace/<int:id>',methods = ['DELETE'])
def deletePlaces(id):
    place = HomeController.delete_place(id)
    return jsonify(place)

@app.route('/ListDeletedPlace',methods = ['GET'])
def listDeletedPlace():
    place = HomeController.List_Deleted_Place()
    return jsonify(place)

@app.route('/GetDeletedPlaceById/<int:id>',methods = ['GET'])
def getDeletedPlaceById(id):
    place = HomeController.get_deleted_place_by_id(id)
    return jsonify(place)

@app.route('/BackupPlaceById/<int:id>',methods=['GET'])
def backupPlacebyid(id):
    place = HomeController.backup_place_by_id(id)
    return jsonify(place)

########################## Home #########################

@app.route('/ListHome',methods = ['GET'])
def listHomes():
    homes = HomeController.list_homes()
    return jsonify(homes)

@app.route('/ListDeletedHome',methods = ['GET'])
def listDeletedHomes():
    homes = HomeController.list_deleted_homes()
    return jsonify(homes)

@app.route('/GetHomeById/<int:id>',methods = ['GET'])
def getHomeDetails(id):
    homes = HomeController.get_home_by_id(id)
    return jsonify(homes)

@app.route('/GetDeletedHomeById/<int:id>',methods = ['GET'])
def getDeletedHomeById(id):
    homes = HomeController.get_Deleted_home_by_id(id)
    return jsonify(homes)

@app.route('/Get_Home_By_Name/<string:name>',methods = ['GET'])
def getHomeByName(name):
    homes = HomeController.get_home_by_name(name)
    return jsonify(homes)

@app.route('/get_deleted_home_by_name/<string:name>',methods = ['GET'])
def getDeletedHomeByName(name):
    homes = HomeController.get_deleted_home_by_name(name)
    return jsonify(homes)

#Ok
@app.route('/List_Home_By_Person_Id/<int:person_id>',methods = ['GET'])
def ListHomeByPersonID(person_id):
    homes = HomeController.List_homes_by_person_id(person_id)
    return jsonify(homes)

@app.route('/List_deleted_homes_by_person_id/<int:person_id>',methods = ['GET'])
def List_Deleted_Homes_By_Person_ID(person_id):
    homes = HomeController.List_deleted_homes_by_person_id(person_id)
    return jsonify(homes)

#OK
@app.route('/AddHome',methods = ["POST"])
def addHome():
    data = request.get_json()
    home = HomeController.add_home(data)
    return jsonify(home)

@app.route('/UpdateHome',methods = ["POST"])
def updateHome():
    data = request.get_json()
    home = HomeController.update_home(data)
    return jsonify(home)

@app.route('/DeleteHome/<int:id>',methods = ['DELETE'])
def deleteHome(id):
    home = HomeController.delete_home(id)
    return jsonify(home)

@app.route('/backup_deleted_home_by_id/<int:id>',methods = ['GET'])
def backupDeletedHomeById(id):
    home = HomeController.backup_deleted_home_by_id(id)
    return jsonify(home)

# ##################### Compartment #####################

@app.route('/ListCompartment',methods = ['GET'])
def listCompartments():
    compartments = HomeController.list_compartments()
    return jsonify(compartments)

@app.route('/List_Deleted_Compartment',methods = ['GET'])
def list_Deleted_Compartments():
    compartments = HomeController.list_deleted_compartments()
    return jsonify(compartments)

@app.route('/GetCompartmentById/<int:id>',methods = ['GET'])
def getCompartmentDetails(id):
    compartments = HomeController.get_compartment_by_id(id)
    return jsonify(compartments)

@app.route('/GetDeletedCompartmentById/<int:id>',methods = ['GET'])
def getDeletedCompartmentDetails(id):
    compartments = HomeController.get_Deleted_compartment_by_id(id)
    return jsonify(compartments)

@app.route('/List_Compartment_By_Home_Id/<int:home_id>',methods = ['GET'])
def List_Compartment_By_Home_ID(home_id):
    compartments = HomeController.List_compartments_by_home_id(home_id)
    return jsonify(compartments)

@app.route('/List_Deleted_Compartment_By_Home_Id/<int:home_id>',methods = ['GET'])
def List_Deleted_Compartment_By_Home_ID(home_id):
    compartments = HomeController.List_deleted_compartments_by_home_id(home_id)
    return jsonify(compartments)

@app.route('/AddCompartment',methods = ["POST"])
def addCompartment():
    data = request.get_json()
    compartment = HomeController.add_compartment(data)
    return jsonify(compartment)

@app.route('/UpdateCompartment',methods = ["POST"])
def updateCompartment():
    data = request.get_json()
    compartment = HomeController.update_compartment(data)
    return jsonify(compartment)

@app.route('/DeleteCompartment/<int:id>',methods = ['DELETE'])
def deleteCompartment(id):
    compartment = HomeController.delete_compartment(id)
    return jsonify(compartment)

@app.route('/backup_deleted_compartment_by_id/<int:id>',methods = ['GET'])
def backup_deleted_compartment_by_id(id):
    compartment = HomeController.backup_deleted_compartment_by_id(id)
    return jsonify(compartment)

##################### Appliance #####################

@app.route('/ListAppliance',methods=['GET'])
def listAppliance():
    appliance = ApplianceController.list_appliance()
    return jsonify(appliance)

@app.route('/ListDeletedAppliance',methods=['GET'])
def listDeletedAppliance():
    appliance = ApplianceController.list_deleted_appliance()
    return jsonify(appliance)

@app.route('/GetApplianceById/<int:id>',methods = ['GET'])
def getAppliancesDetails(id):
    appliances = ApplianceController.get_appliance_by_id(id)
    return jsonify(appliances)

@app.route('/GetDeletedApplianceById/<int:id>',methods = ['GET'])
def getDeletedAppliancesDetails(id):
    appliances = ApplianceController.get_deleted_appliance_by_id(id)
    return jsonify(appliances)

@app.route('/AddAppliance',methods = ["POST"])
def addAppliance():
    data = request.get_json()
    appliance = ApplianceController.add_appliance(data)
    return jsonify(appliance)

@app.route('/UpdateAppliance',methods = ["POST"])
def updateAppliance():
    data = request.get_json()
    appliance = ApplianceController.update_appliance(data)
    return jsonify(appliance)

@app.route('/DeleteAppliance/<int:id>',methods = ['DELETE'])
def deleteAppliance(id):
    appliance = ApplianceController.delete_appliance(id)
    return jsonify(appliance)

@app.route('/backup_deleted_appliance_by_id/<int:id>',methods = ['GET'])
def backup_deleted_appliance_by_id(id):
    appliance = ApplianceController.Backup_deleted_appliances_by_id(id)
    return jsonify(appliance)

################### Compartment Appliance ################

@app.route('/List_Compartment_Appliance',methods=['GET'])
def List_Compartment_Appliancess():
    appliance = ApplianceController.List_Compartment_Appliance()
    return jsonify(appliance)

@app.route('/List_Deleted_Compartment_Appliance',methods=['GET'])
def List_dleted_Compartment_Appliancess():
    appliance = ApplianceController.List_Deleted_Compartment_Appliance()
    return jsonify(appliance)

@app.route('/Get_Compartment_Appliance_ById/<int:id>',methods = ['GET'])
def Get_Compartment_Appliance_Details(id):
    appliance = ApplianceController.get_compartment_appliance_by_id(id)
    return jsonify(appliance)

@app.route('/Get_Deleted_Compartment_Appliance_ById/<int:id>',methods = ['GET'])
def Get_deleetd_Compartment_Appliance_Details(id):
    appliance = ApplianceController.get_deleted_compartment_appliance_by_id(id)
    return jsonify(appliance)

@app.route('/get_compartment_appliance_with_compartment_id/<int:comp_id>',methods = ["GET"])
def get_compartment_appliance_with_compartment_id(comp_id):
    appliance = ApplianceController.get_compartment_appliance_with_compartment_id(comp_id)
    return jsonify(appliance)

@app.route('/get_deleted_compartment_appliance_with_compartment_id/<int:comp_id>',methods = ["GET"])
def get_deleted_compartment_appliance_with_compartment_id(comp_id):
    appliance = ApplianceController.get_deleted_compartment_appliance_with_compartment_id(comp_id)
    return jsonify(appliance)

@app.route('/get_compartment_appliance_with_compartment_and_appliance_id/<int:comp_id>/<int:appl_id>',methods = ["GET"])
def get_compartment_appliance_with_compartment_appliance_id(comp_id,appl_id):
    appliance = ApplianceController.get_compartment_appliance_with_compartment_appliance_id(comp_id,appl_id)
    return jsonify(appliance)

@app.route('/get_deleted_compartment_appliance_with_compartment_and_appliance_id/<int:comp_id>/<int:appl_id>',methods = ["GET"])
def get_deleted_compartment_appliance_with_compartment_appliance_id(comp_id,appl_id):
    appliance = ApplianceController.get_deleted_compartment_appliance_with_compartment_appliance_id(comp_id,appl_id)
    return jsonify(appliance)

@app.route('/Add_Compartment_Appliance',methods = ["POST"])
def Add_Compartment_Appliance():
    data = request.get_json()
    appliance = ApplianceController.AddCompartmentAppliances(data)
    return jsonify(appliance)

@app.route('/Update_Compartment_Appliance',methods = ["POST"])
def Update_Compartment_Appliance():
    data = request.get_json()
    appliance = ApplianceController.updateCompartmentAppliances(data)
    return jsonify(appliance)

@app.route('/Delete_Compartment_Appliance/<int:id>',methods = ['DELETE'])
def Delete_Compartment_Appliance(id):
    appliance = ApplianceController.deleteCompartmentAppliances(id)
    return jsonify(appliance)

@app.route('/backup_deleted_compartment_appliance_by_id/<int:id>',methods = ['GET'])
def backup_deleted_compartment_appliance_by_id(id):
    appliance = ApplianceController.BackUp_deleted_Compartment_appliances_by_id(id)
    return jsonify(appliance)

#------------------------- Appliance Schedule --------------------------------

@app.route('/List_Appliance_Schedule/<int:type>', methods=['GET'])
def List_Appliance_Schedules(type):
    schedule = ApplianceController.List_appliance_schedule(type)
    return jsonify(schedule)

@app.route('/Get_Appliance_Schedule_By_Id/<int:id>/<int:type>', methods = ['GET'])
def Get_Appliance_Schedule_Details(id,type):
    schedule = ApplianceController.get_appliance_schedule_by_id(id,type)
    return jsonify(schedule)

@app.route('/Get_Deleted_Appliance_Schedule_By_Id/<int:id>/<int:type>', methods = ['GET'])
def Get_deleted_Appliance_Schedule_Details(id,type):
    schedule = ApplianceController.get_deleted_appliance_schedule_by_id(id,type)
    return jsonify(schedule)

@app.route('/list_Appliance_Schedule_By_comaprtment_id/<int:id>', methods = ['GET'])
def list_appliance_schedule_by_compartment_id(id):
    schedule = ApplianceController.list_appliance_schedule_by_compartment_id(id)
    return jsonify(schedule)

@app.route('/Get_Appliance_Schedule_By_table_id/<int:id>/<int:type>', methods = ['GET'])
def Get_Appliance_Schedule_By_table_id(id,type):
    schedule = ApplianceController.get_appliance_schedule_by_table_id(id,type)
    return jsonify(schedule)

@app.route('/Get_Deleted_Appliance_Schedule_By_table_id/<int:id>/<int:type>', methods = ['GET'])
def Get_Deleted_Appliance_Schedule_By_table_id(id,type):
    schedule = ApplianceController.get_deleted_appliance_schedule_by_table_id(id,type)
    return jsonify(schedule)

@app.route('/Add_Appliance_Schedule', methods = ["POST"])
def Add_Appliance_Schedule():
    data = request.get_json()
    schedule = ApplianceController.Add_Appliances_Schedule(data)
    return jsonify(schedule)

@app.route('/update_Appliance_Schedule', methods = ["POST"])
def update_Appliance_Schedule():
    data = request.get_json()
    schedule = ApplianceController.Update_Appliances_Schedule(data)
    return jsonify(schedule)

@app.route('/update_matching_Appliance_Schedule', methods = ["POST"])
def update_matching_Appliance_Schedule():
    data = request.get_json()
    schedule = ApplianceController.update_matching_schedules(data)
    return jsonify(schedule)

@app.route('/delete_matching_Appliance_Schedule', methods = ["POST"])
def delete_matching_Appliance_Schedule():
    data = request.get_json()
    schedule = ApplianceController.delete_matching_Appliance_Schedule(data)
    return jsonify(schedule)

@app.route('/delete_Appliance_Schedule/<int:id>/<int:type>', methods = ['DELETE'])
def delete_Appliance_Schedule(id,type):
    schedule = ApplianceController.Delete_Appliances_Schedule(id,type)
    return jsonify(schedule)

@app.route('/backup_deleted_appliance_schedule_by_id/<int:id>/<int:type>', methods = ['GET'])
def backup_deleted_appliance_schedule_by_id(id,type):
    schedule = ApplianceController.backup_Deleted_appliance_schedule_by_id(id,type)
    return jsonify(schedule)

#------------------------- Appliance Schedule Log --------------------------------

@app.route('/List_Appliance_Schedule_Log', methods=['GET'])
def List_Appliance_Schedule_Logs():
    logs = ApplianceController.List_appliance_schedule_log()
    return jsonify(logs)

@app.route('/List_Deleted_Appliance_Schedule_Log', methods=['GET'])
def List_Deleted_Appliance_Schedule_Logs():
    logs = ApplianceController.List_deleted_appliance_schedule_log()
    return jsonify(logs)

@app.route('/Get_Appliance_Schedule_Log_by_id/<int:id>', methods=['GET'])
def Get_Appliance_Schedule_Logs_by_id(id):
    logs = ApplianceController.Get_appliance_schedule_log_by_id(id)
    return jsonify(logs)

@app.route('/Get_deleted_Appliance_Schedule_Log_by_id/<int:id>', methods=['GET'])
def Get_deleted_Appliance_Schedule_Logs_by_id(id):
    logs = ApplianceController.Get_deleted_appliance_schedule_log_by_id(id)
    return jsonify(logs)

@app.route('/List_Appliance_Schedule_Log_by_table_id/<int:id>', methods=['GET'])
def List_Appliance_Schedule_Logs_by_table_id(id):
    logs = ApplianceController.List_appliance_schedule_log_by_table_id(id)
    return jsonify(logs)

@app.route('/List_Deleted_Appliance_Schedule_Log_by_table_id/<int:id>', methods=['GET'])
def List_Deleted_Appliance_Schedule_Logs_by_table_id(id):
    logs = ApplianceController.List_deleted_appliance_schedule_log_by_table_id(id)
    return jsonify(logs)

@app.route('/Add_Appliance_Schedule_Log',methods=['POST'])
def Add_Appliance_Schedule_Log():
    data = request.get_json()
    log = ApplianceController.Add_Appliance_Schedule_Log(data)
    return jsonify(log)

@app.route('/update_Appliance_Schedule_Log', methods=['POST'])
def update_Appliance_Schedule_Log():
    data = request.get_json()
    log = ApplianceController.Update_Appliance_Schedule_Log(data)
    return jsonify(log)

@app.route('/delete_Appliance_Schedule_Log/<int:id>', methods=['DELETE'])
def delete_Appliance_Schedule_Log(id):
    log = ApplianceController.Delete_Appliance_Schedule_Log(id)
    return jsonify(log)

@app.route('/backup_deleted_appliance_schedule_log_by_id/<int:id>', methods=['GET'])
def backup_deleted_appliance_schedule_log_by_id(id):
    log = ApplianceController.backup_deleted_appliance_schedule_log_by_id(id)
    return jsonify(log)

#--------------------------------- Security --------------------------------

@app.route('/List_Security', methods=['GET'])
def List_Security():
    rules = ApplianceController.List_security()
    return jsonify(rules)

@app.route('/List_Deleted_Security', methods=['GET'])
def List_Deleted_Security():
    rules = ApplianceController.List_deleted_security()
    return jsonify(rules)

@app.route('/Get_Security_by_id/<int:id>', methods=['GET'])
def get_Security_by_id(id):
    rule = ApplianceController.Get_security_by_id(id)
    return jsonify(rule)

@app.route('/Get_Deleted_Security_by_id/<int:id>', methods=['GET'])
def Get_Deleted_Security_by_id(id):
    rule = ApplianceController.Get_deleted_security_by_id(id)
    return jsonify(rule)

@app.route('/Get_Security_by_Name/<string:name>', methods=['GET'])
def get_Security_by_name(name):
    rule = ApplianceController.Get_security_by_name(name)
    return jsonify(rule)

@app.route('/Get_Deleted_Security_by_Name/<string:name>', methods=['GET'])
def Get_Deleted_Security_by_name(name):
    rule = ApplianceController.Get_deleted_security_by_name(name)
    return jsonify(rule)

@app.route('/List_Security_by_Home_id/<int:id>', methods=['GET'])
def List_Security_by_Home_id(id):
    rule = ApplianceController.List_security_by_Home_Id(id)
    return jsonify(rule)

@app.route('/List_Deleted_Security_by_Home_id/<int:id>', methods=['GET'])
def List_Deleted_Security_by_Home_id(id):
    rule = ApplianceController.List_deleted_security_by_Home_Id(id)
    return jsonify(rule)

@app.route('/Add_Security', methods=['POST'])
def Add_Security():
    data = request.get_json()
    rule = ApplianceController.Add_Security(data)
    return jsonify(rule)

@app.route('/update_Security', methods=['POST'])
def update_Security():
    data = request.get_json()
    rule = ApplianceController.Update_Security(data)
    return jsonify(rule)

@app.route('/delete_Security/<int:id>', methods=['DELETE'])
def delete_Security(id):
    rule = ApplianceController.Delete_Security(id)
    return jsonify(rule)

@app.route('/backup_deleted_security_by_id/<int:id>', methods=['GET'])
def backup_deleted_security_by_id(id):
    rule = ApplianceController.backup_deleted_security_by_id(id)
    return jsonify(rule)

#-------------------- Compartment Lock -------------------

@app.route('/List_Compartment_Lock', methods=['GET'])
def List_Compartment_Lock():
    locks = ApplianceController.List_compartment_lock()
    return jsonify(locks)

@app.route('/List_deleted_Compartment_Lock', methods=['GET'])
def List_deleted_Compartment_Lock():
    locks = ApplianceController.List_deleted_compartment_lock()
    return jsonify(locks)

@app.route('/Get_Compartment_Lock_by_id/<int:id>', methods=['GET'])
def Get_Compartment_Lock_by_id(id):
    lock = ApplianceController.Get_compartment_lock_by_id(id)
    return jsonify(lock)

@app.route('/Get_Deleted_Compartment_Lock_by_id/<int:id>', methods=['GET'])
def Get_Deleted_Compartment_Lock_by_id(id):
    lock = ApplianceController.Get_deleted_compartment_lock_by_id(id)
    return jsonify(lock)

@app.route('/Get_Compartment_Lock_by_Name/<string:name>', methods=['GET'])
def Get_Compartment_Lock_by_name(name):
    lock = ApplianceController.Get_compartment_lock_by_name(name)
    return jsonify(lock)

@app.route('/Get_Deleted_Compartment_Lock_by_Name/<string:name>', methods=['GET'])
def Get_Deleted_Compartment_Lock_by_name(name):
    lock = ApplianceController.Get_deleted_compartment_lock_by_name(name)
    return jsonify(lock)

@app.route('/List_Compartment_lock_by_compartment_id/<int:id>',methods=['GET'])
def List_Compartment_Lock_by_compartment_id(id):
    lock = ApplianceController.List_Compartment_Lock_By_Compartment_id(id)
    return jsonify(lock)

@app.route('/List_deleted_Compartment_lock_by_compartment_id/<int:id>',methods=['GET'])
def List_deleted_Compartment_Lock_by_compartment_id(id):
    lock = ApplianceController.List_deleted_compartment_lock_by_compartment_id(id)
    return jsonify(lock)

@app.route('/Add_Compartment_Lock', methods=['POST'])
def Add_Compartment_Lock():
    data = request.get_json()
    lock = ApplianceController.Add_compartment_lock(data)
    return jsonify(lock)

@app.route('/update_Compartment_Lock', methods=['POST'])
def update_Compartment_Lock():
    data = request.get_json()
    lock = ApplianceController.Update_Compartment_Lock(data)
    return jsonify(lock)

@app.route('/delete_Compartment_Lock/<int:id>', methods=['DELETE'])
def delete_Compartment_Lock(id):
    lock = ApplianceController.Delete_compartment_lock(id)
    return jsonify(lock)

@app.route('/backup_deleted_compartment_lock_by_id/<int:id>', methods=['GET'])
def backup_deleted_compartment_lock_by_id(id):
    lock = ApplianceController.backup_deleted_compartment_lock_by_id(id)
    return jsonify(lock)

#------------------ --- Lock Schedule --- ------------------

@app.route('/List_Lock_Schedule', methods=['GET'])
def List_Lock_Schedule():
    schedules = ApplianceController.List_lock_schedule()
    return jsonify(schedules)

@app.route('/List_Deleted_Lock_Schedule', methods=['GET'])
def List_Deleted_Lock_Schedule():
    schedules = ApplianceController.List_deleted_lock_schedule()
    return jsonify(schedules)

@app.route('/Get_Lock_Schedule_by_id/<int:id>', methods=['GET'])
def Get_Lock_Schedule_by_id(id):
    schedule = ApplianceController.Get_lock_schedule_by_id(id)
    return jsonify(schedule)

@app.route('/Get_Deleted_Lock_Schedule_by_id/<int:id>', methods=['GET'])
def Get_Deleted_Lock_Schedule_by_id(id):
    schedule = ApplianceController.Get_deleted_lock_schedule_by_id(id)
    return jsonify(schedule)

@app.route('/List_Lock_Schedule_by_compartment_lock_id/<int:id>', methods=['GET'])
def List_Lock_Schedule_by_compartment_lock_id(id):
    schedule = ApplianceController.List_lock_schedule_by_compartment_lock_id(id)
    return jsonify(schedule)

@app.route('/List_Deleted_Lock_Schedule_by_compartment_lock_id/<int:id>', methods=['GET'])
def List_Deleted_Lock_Schedule_by_compartment_lock_id(id):
    schedule = ApplianceController.List_deleted_lock_schedule_by_compartment_lock_id(id)
    return jsonify(schedule)

@app.route('/list_Lock_schedule_by_compartment_id/<int:id>', methods = ['GET'])
def list_Lock_schedule_by_compartment_id(id):
    schedule = ApplianceController.list_Lock_schedule_by_compartment_id(id)
    return jsonify(schedule)

@app.route('/Add_Lock_Schedule', methods=['POST'])
def Add_Lock_Schedule():
    data = request.get_json()
    schedule = ApplianceController.Add_lock_Schedule(data)
    return jsonify(schedule)

@app.route('/update_Lock_Schedule', methods=['POST'])
def update_Lock_Schedule():
    data = request.get_json()
    schedule = ApplianceController.Update_lock_schedule(data)
    return jsonify(schedule)

@app.route('/delete_Lock_Schedule/<int:id>', methods=['DELETE'])
def delete_Lock_Schedule(id):
    schedule = ApplianceController.Delete_lock_schedule(id)
    return jsonify(schedule)

@app.route('/backup_deleted_lock_schedule_by_id/<int:id>', methods=['GET'])
def backup_deleted_lock_schedule_by_id(id):
    schedule = ApplianceController.backup_deleted_lock_schedule_by_id(id)
    return jsonify(schedule)

@app.route('/update_matching_lock_Schedule', methods = ["POST"])
def update_matching_lock_Schedule():
    data = request.get_json()
    schedule = ApplianceController.update_matching_Lock_schedules(data)
    return jsonify(schedule)

@app.route('/delete_matching_lock_Schedule', methods = ["POST"])
def delete_matching_lock_Schedule():
    data = request.get_json()
    schedule = ApplianceController.delete_matching_Lock_Schedule(data)
    return jsonify(schedule)

#-------------------------- Lock Scedule Log --------------------------------

@app.route('/List_Lock_Schedule_Log', methods=['GET'])
def List_Lock_Schedule_Log():
    logs = ApplianceController.List_lock_schedule_log()
    return jsonify(logs)

@app.route('/List_deleted_lock_schedule_log', methods=['GET'])
def List_deleted_Lock_Schedule_Log():
    logs = ApplianceController.List_deleted_lock_schedule_log()
    return jsonify(logs)

@app.route('/Get_Lock_Schedule_Log_by_id/<int:id>', methods=['GET'])
def Get_Lock_Schedule_Log_by_id(id):
    log = ApplianceController.Get_Lock_Schedule_Log_by_id(id)
    return jsonify(log)

@app.route('/Get_Deleted_Lock_Schedule_Log_by_id/<int:id>', methods=['GET'])
def Get_Deleted_Lock_Schedule_Log_by_id(id):
    log = ApplianceController.Get_Deleted_Lock_Schedule_Log_by_id(id)
    return jsonify(log)

@app.route('/List_Lock_Schedule_Log_by_lock_schedule_id/<int:id>', methods=['GET'])
def List_Lock_Schedule_Log_by_lock_schedule_id(id):
    logs = ApplianceController.List_Lock_Schedule_Log_by_Lock_Schedule_id(id)
    return jsonify(logs)

@app.route('/List_Deleted_Lock_Schedule_Log_by_lock_schedule_id/<int:id>', methods=['GET'])
def List_Deleted_Lock_Schedule_Log_by_lock_schedule_id(id):
    logs = ApplianceController.List_Deleted_Lock_Schedule_Log_by_Lock_Schedule_id(id)
    return jsonify(logs)

@app.route('/Add_Lock_Schedule_Log', methods=['POST'])
def Add_Lock_Schedule_Log():
    data = request.get_json()
    log = ApplianceController.Add_Lock_Schedule_Log(data)
    return jsonify(log)

@app.route('/update_Lock_Schedule_Log', methods=['POST'])
def update_Lock_Schedule_Log():
    data = request.get_json()
    log = ApplianceController.Update_Lock_Schedule_Log(data)
    return jsonify(log)

@app.route('/Delete_Lock_Schedule_Log_By_id/<int:id>',methods=['DELETE'])
def Delete_Lock_Schedule_Log_By_id(id):
    log = ApplianceController.Delete_Lock_Schedule_Log_By_id(id)
    return jsonify(log)

@app.route('/Backup_LockSchedule_Log_By_id/<int:id>', methods=['GET'])
def Backup_Lock_Schedule_Log_By_id(id):
    log = ApplianceController.Backup_Lock_Schedule_Log_by_id(id)
    return jsonify(log)

#----------------------------- Home Sprinkler --------------------------
@app.route('/List_Home_Sprinkler', methods=['GET'])
def List_Home_Sprinkler():
    sprinklers = ApplianceController.List_home_sprinkler()
    return jsonify(sprinklers)

@app.route('/List_Deleted_Home_Sprinkler', methods=['GET'])
def List_Deleted_Home_Sprinkler():
    sprinklers = ApplianceController.List_Deleted_home_sprinkler()
    return jsonify(sprinklers)

@app.route('/Get_Home_Sprinkler_by_id/<int:id>', methods=['GET'])
def Get_Home_Sprinkler_by_id(id):
    sprinkler = ApplianceController.Get_home_sprinkler_by_id(id)
    return jsonify(sprinkler)

@app.route('/Get_Deleted_Home_Sprinkler_by_id/<int:id>', methods=['GET'])
def Get_Deleted_Home_Sprinkler_by_id(id):
    sprinkler = ApplianceController.Get_Deleted_home_sprinkler_by_id(id)
    return jsonify(sprinkler)

@app.route('/List_Home_Sprinkler_by_Home_id/<int:id>', methods=['GET'])
def List_Home_Sprinkler_by_home_id(id):
    sprinkler = ApplianceController.List_home_sprinkler_by_home_id(id)
    return jsonify(sprinkler)

@app.route('/List_Deleted_Home_Sprinkler_by_Home_id/<int:id>', methods=['GET'])
def List_Deleted_Home_Sprinkler_by_home_id(id):
    sprinkler = ApplianceController.List_deleted_home_sprinkler_by_home_id(id)
    return jsonify(sprinkler)

@app.route('/Add_Home_Sprinkler', methods=['POST'])
def Add_Home_Sprinkler():
    data = request.get_json()
    sprinkler = ApplianceController.Add_Home_Sprinkler(data)
    return jsonify(sprinkler)

@app.route('/update_Home_Sprinkler', methods=['POST'])
def update_Home_Sprinkler():
    data = request.get_json()
    sprinkler = ApplianceController.Update_home_sprinkler(data)
    return jsonify(sprinkler)

@app.route('/Delete_Home_Sprinkler_By_id/<int:id>', methods=['DELETE'])
def Delete_Home_Sprinkler_By_id(id):
    sprinkler = ApplianceController.Delete_home_sprinkler_By_id(id)
    return jsonify(sprinkler)

@app.route('/Backup_Home_Sprinkler_By_id/<int:id>', methods=['GET'])
def Backup_Home_Sprinkler_By_id(id):
    sprinkler = ApplianceController.Backup_home_sprinkler_by_id(id)
    return jsonify(sprinkler)

#--------------------------- Sprinkler Schedule --------------------------------

@app.route('/List_Sprinkler_Schedule', methods=['GET'])
def List_Sprinkler_Schedule():
    schedules = ApplianceController.List_sprinkler_schedule()
    return jsonify(schedules)

@app.route('/List_deleted_sprinkler_schedule', methods=['GET'])
def List_deleted_sprinkler_schedule():
    schedules = ApplianceController.List_deleted_sprinkler_schedule()
    return jsonify(schedules)

@app.route('/Get_Sprinkler_Schedule_by_id/<int:id>', methods=['GET'])
def Get_Sprinkler_Schedule_by_id(id):
    schedule = ApplianceController.Get_sprinkler_schedule_by_id(id)
    return jsonify(schedule)

@app.route('/Get_Deleted_Sprinkler_Schedule_by_id/<int:id>', methods=['GET'])
def Get_Deleted_Sprinkler_Schedule_by_id(id):
    schedule = ApplianceController.Get_Deleted_sprinkler_schedule_by_id(id)
    return jsonify(schedule)

@app.route('/List_Sprinkler_Schedule_by_home_Sprinkler_id/<int:id>', methods=['GET'])
def List_Sprinkler_Schedule_by_home_sprinkler_id(id):
    schedules = ApplianceController.List_sprinkler_schedule_by_home_sprinkler_id(id)
    return jsonify(schedules)

@app.route('/List_deleted_Sprinkler_Schedule_by_home_Sprinkler_id/<int:id>', methods=['GET'])
def List_deleted_Sprinkler_Schedule_by_home_sprinkler_id(id):
    schedules = ApplianceController.List_deleted_sprinkler_schedule_by_home_sprinkler_id(id)
    return jsonify(schedules)

@app.route('/Add_Sprinkler_Schedule', methods=['POST'])
def Add_Sprinkler_Schedule():
    data = request.get_json()
    schedule = ApplianceController.Add_sprinkler_schedule(data)
    return jsonify(schedule)

@app.route('/update_Sprinkler_Schedule', methods=['POST'])
def update_Sprinkler_Schedule():
    data = request.get_json()
    schedule = ApplianceController.Update_sprinkler_schedule(data)
    return jsonify(schedule)

@app.route('/delete_sprinkler_schedule_by_id/<int:id>', methods=['DELETE'])
def delete_sprinkler_schedule_by_id(id):
    schedule = ApplianceController.Delete_sprinkler_schedule_by_id(id)
    return jsonify(schedule)

@app.route('/Backup_Sprinkler_Schedule_By_id/<int:id>', methods=['GET'])
def backup_sprinkler_schedule_by_id(id):
    schedule = ApplianceController.Backup_sprinkler_schedule_by_id(id)
    return jsonify(schedule)


#--------------------------- Sprinkler Schedule Log --------------------------------

@app.route('/List_Sprinkler_Schedule_Log', methods=['GET'])
def List_Sprinkler_Schedule_Log():
    logs = ApplianceController.List_Sprinkler_schedule_log()
    return jsonify(logs)

@app.route('/List_deleted_sprinkler_schedule_log', methods=['GET'])
def List_deleted_Sprinkler_Schedule_Log():
    logs = ApplianceController.List_deleted_Sprinkler_schedule_log()
    return jsonify(logs)

@app.route('/Get_Sprinkler_Schedule_Log_by_id/<int:id>', methods=['GET'])
def Get_Sprinkler_Schedule_Log_by_id(id):
    log = ApplianceController.Get_Sprinkler_Schedule_Log_by_id(id)
    return jsonify(log)

@app.route('/Get_Deleted_Sprinkler_Schedule_Log_by_id/<int:id>', methods=['GET'])
def Get_Deleted_Sprinkler_Schedule_Log_by_id(id):
    log = ApplianceController.Get_Deleted_Sprinkler_Schedule_Log_by_id(id)
    return jsonify(log)

@app.route('/List_sprinkler_Schedule_Log_by_sprinkler_schedule_id/<int:id>', methods=['GET'])
def List_sprinkler_Schedule_Log_by_sprinkler_schedule_id(id):
    logs = ApplianceController.List_sprinkler_Schedule_Log_by_sprinkler_Schedule_id(id)
    return jsonify(logs)

@app.route('/List_Deleted_sprinkler_Schedule_Log_by_sprinkler_schedule_id/<int:id>', methods=['GET'])
def List_Deleted_sprinkler_Schedule_Log_by_sprinkler_schedule_id(id):
    logs = ApplianceController.List_Deleted_sprinkler_Schedule_Log_by_sprinkler_Schedule_id(id)
    return jsonify(logs)

@app.route('/Add_sprinkler_Schedule_Log', methods=['POST'])
def Add_sprinkler_Schedule_Log():
    data = request.get_json()
    log = ApplianceController.Add_sprinkler_Schedule_Log(data)
    return jsonify(log)

@app.route('/Update_Sprinkler_Schedule_Log', methods=['POST'])
def Update_Sprinkler_Schedule_Log():
    data = request.get_json()
    log = ApplianceController.Update_Sprinkler_Schedule_Log(data)
    return jsonify(log)

@app.route('/Delete_sprinkler_Schedule_Log_By_id/<int:id>',methods=['DELETE'])
def Delete_sprinkler_Schedule_Log_By_id(id):
    log = ApplianceController.Delete_sprinkler_Schedule_Log_By_id(id)
    return jsonify(log)

@app.route('/Backup_sprinkler_Schedule_Log_By_id/<int:id>', methods=['GET'])
def Backup_sprinkler_Schedule_Log_By_id(id):
    log = ApplianceController.Backup_sprinkler_Schedule_Log_by_id(id)
    return jsonify(log)

#--------------------------- Hardware --------------------------------

# @app.route('/set_relay_state', methods=['POST'])
# def set_relay_state():
#     data = request.get_json()
#     result = HardwareController.set_relay_state(data)
#     return jsonify(result)
#
# @app.route('/get_relay_state', methods=['GET'])
# def get_relay_state():
#     res = HardwareController.get_relay_state()
#     return jsonify(res), 200

@app.route('/set_water_level_state', methods=['POST'])
def set_water_level_state():
    data = request.get_json()
    result = HardwareController.set_water_level_statee(data)
    return jsonify(result) ,200

@app.route('/get_water_level_state', methods=['GET'])
def get_water_level_state():
    res = HardwareController.get_water_level_state()
    return jsonify(res), 200

@app.route('/Update_Compartment_Appliance_status',methods = ["POST"])
def Update_Compartment_Appliance_status():
    data = request.get_json()
    appliance = HardwareController.updateCompartmentAppliancesStatus(data)
    return jsonify(appliance)

@app.route('/Update_Compartment_Lock_status',methods = ["POST"])
def Update_Compartment_Lock_status():
    data = request.get_json()
    appliance = HardwareController.updateCompartmentLockStatus(data)
    return jsonify(appliance)

@app.route('/check_schedule_update_status',methods = ["GET"])
def check_schedule_update_status():
    appliance = HardwareController.check_schedule_update_status()
    return jsonify(appliance)

@app.route('/check_lock_schedule_update_status',methods = ["GET"])
def check_lock_schedule_update_status():
    appliance = HardwareController.check_lock_schedule_update_status()
    return jsonify(appliance)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)