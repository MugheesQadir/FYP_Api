from Model import Person
from Model.City import City
from Model.Compartment import Compartment
from Model.CompartmentAppliance import CompartmentAppliance
from Model.CompartmentLock import CompartmentLock
from Model.Home import Home
from Model.HomeSprinkler import HomeSprinkler
from Model.Place import Place
from Model.Security import Security
from config import db

class HomeController:

### --------------------- City -----------------------------
    @staticmethod
    def list_cities():
        try:
            cities = City.query.where(City.validate==1).all()
            return [{'id': c.id, 'name': c.name} for c in cities]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_cities_by_id(id):
        try:
            cities = City.query.filter_by(id=id,validate=1).first()
            if cities is None:
                return {'error':'City not found'}

            return {'id': cities.id, 'name': cities.name}
        except Exception as e:
            return str(e)

    @staticmethod
    def get_city_by_name(name):
        try:
            cities = City.query.filter_by(name=name,validate = 1).first()
            if cities is None:
                return {'error':'City not found'}

            return {'id': cities.id, 'name': cities.name}
        except Exception as e:
            return str(e)

    @staticmethod
    def add_cities(data):
        try:
            cities = City(name=data['name'],validate=1)
            db.session.add(cities)
            db.session.commit()

            return {"success":f"{data['name']} added successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def update_cities(data):
        try:
            cities = City.query.filter_by(id=data['id'],validate=1).first()
            if cities is None:
                return {'error':'City not found'}

            if cities is not None:
                cities.name = data['name']
                db.session.commit()
                return {"success":f"{data['name']} updated successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def delete_cities(id):
        try:
            cities = City.query.filter_by(id=id,validate=1).first()
            if cities is None:
                return {'error':f'City Not Found'}

            place = Place.query.filter_by(city_id=id,validate=1).first()
            if place is not None:
                return {'error':f'City has associated places. Cannot be deleted'}

            cities.validate = 0
            db.session.commit()
            return {'success':f'City deleted successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def list_deleted_cities():
        try:
            cities = City.query.where(City.validate == 0).all()
            return [{'id': c.id, 'name': c.name} for c in cities]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_deleted_cities_by_id(id):
        try:
            cities = City.query.filter_by(id=id, validate=0).first()
            if cities is None:
                return {'error':'City not found'}

            return {'id': cities.id, 'name': cities.name}
        except Exception as e:
            return (str(e))

    @staticmethod
    def Backup_city_by_id(id):
        try:
            p = City.query.filter_by(id=id, validate=0).first()
            if p is None:
                return {'error':'City not found'}

            p.validate = 1
            db.session.commit()
            return {'success':f'{p.name} Backed up Successfully'}
        except Exception as e:
            return str(e)

##################### Place ######################

    @staticmethod
    def list_place():
        try:
            places = (db.session.query(Place, City)
                      .join(City, Place.city_id == City.id)
                      .where(Place.validate==1)
                      .all())
            if not places:
                return {'error':'No places found'}
            result = [
                {
                    'id': place.id,
                    'name': place.name,
                    'city_name': city.name
                }
                for place, city in places
            ]
            return result
        except Exception as e:
            return str(e)

    @staticmethod
    def get_place_by_id(id):
        try:
            places = Place.query.filter_by(id=id,validate=1).first()
            if places is None:
                return {'error':'Place not found'}

            city = (db.session.query(City)
                    .filter_by(id=places.city_id,validate=1)
                    .first())

            return [{'id': places.id, 'name': places.name,'city_name': city.name}]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_place_by_name(name):
        try:
            places = Place.query.filter_by(name=name,validate=1).first()
            if places is None:
                return {'error':'Place not found'}

            city = (db.session.query(City)
                    .filter_by(id=places.city_id,validate=1)
                    .first())

            return {'id': places.id, 'name': places.name,'city_name':city.name}
        except Exception as e:
            return str(e)

    @staticmethod
    def List_places_by_city_id(id):
        try:
            result = (
                db.session.query(Place, City)
                .join(City, Place.city_id == City.id)
                .filter(Place.city_id == id, Place.validate == 1)
                .all()
            )
            if result is None:
                return {'error': 'Place not found for this city'}

            if result is not None:
                return [{'id': place.id, 'name': place.name}
                        for place, city in result
                        ]


        except Exception as e:
            return str(e)

    @staticmethod
    def get_deleted_place_by_city_id(id):
        try:
            places = Place.query.filter_by(city_id=id, validate=0).first()
            if places is None:
                return {'error':'Deleted Places not found'}

            city = (db.session.query(City)
                    .filter_by(id=places.city_id, validate=1)
                    .first())

            return {'id': places.id, 'name': places.name, 'city_name': city.name}
        except Exception as e:
            return str(e)

    @staticmethod
    def add_place(data):
        try:
            city = City.query.filter_by(id=data['city_id'],validate=1).first()
            if city is None:
                return {'error':f'City not found'}

            places = Place(name=data['name'], city_id=data['city_id'], validate=1)
            db.session.add(places)
            db.session.commit()
            return {"success":f"{data['name']} added successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def update_place(data):
        try:
            places = Place.query.filter_by(id=data['id'], validate=1).first()
            if places is None:
                return {'error': 'Place not found'}

            city = City.query.filter_by(id=data['city_id'],validate=1).first()
            if city is None:
                return {'error':f'City not found'}

            if places is not None:
                places.name = data['name']
                places.city_id = data['city_id']
                places.validate = 1
                db.session.commit()
                return {'success':f"{data['name']} updated successfully"}

        except Exception as e:
            return str(e)

    @staticmethod
    def delete_place(id):
        try:
            places = Place.query.filter_by(id=id,validate=1).first()
            if places is None:
                return {'error':f'Place not found'}

            home = Home.query.filter_by(place_id=id,validate=1).first()
            if home is not None:
                return {'error':f'Home has associated places. It Cannot be deleted'}

            places.validate = 0
            db.session.commit()
            return {'success':f"{places.name} deleted successfully"}

        except Exception as e:
            return str(e)

    @staticmethod
    def List_Deleted_Place():
        try:
            places = (db.session.query(Place, City)
                      .join(City, Place.city_id == City.id)
                      .where(Place.validate == 0)
                      .all())
            if not places:
                return {'error': 'No places found'}
            result = [
                {
                    'id': place.id,
                    'name': place.name,
                    'city_name': city.name
                }
                for place, city in places
            ]
            return result
        except Exception as e:
            return str(e)

    @staticmethod
    def get_deleted_place_by_id(id):
        try:
            places = Place.query.filter_by(id=id, validate=0).first()
            if places is None:
                return {'error':'deleted Place not found'}

            city = (db.session.query(City)
                    .filter_by(id=places.city_id, validate=1)
                    .first())

            return {'id': places.id, 'name': places.name, 'city_name': city.name}
        except Exception as e:
            return str(e)

    @staticmethod
    def backup_place_by_id(id):
        try:
            p = Place.query.filter_by(id=id, validate=0).first()
            if p is None:
                return {'error':'deleted Place not found'}

            p.validate = 1
            db.session.commit()
            return {'success':f'{p.name} Backed up Successfully'}
        except Exception as e:
            return str(e)

#--------------------- Home ---------------------

    @staticmethod
    def list_homes():
        try:
            result =  (
                db.session.query(Home,Person,Place,City)
                .join(Person, Home.person_id == Person.id)
                .join(Place,Home.place_id == Place.id)
                .join(City,Place.city_id == City.id)
                .filter(Home.validate == 1)
                .all()
            )
            return [
                {"id": homes.id, "name": homes.name, "place": place.name,
                 "city": city.name, "person": person.name}
                for homes,person,place,city in result]
        except Exception as e:
            return str(e)

    @staticmethod
    def list_deleted_homes():
        try:
            result =  (
                db.session.query(Home,Person,Place,City)
                .join(Person, Home.person_id == Person.id)
                .join(Place,Home.place_id == Place.id)
                .join(City,Place.city_id == City.id)
                .filter(Home.validate == 0)
                .all()
            )
            return [
                {"id": homes.id, "name": homes.name, "place": place.name,
                 "city": city.name, "person": person.name}
                for homes,person,place,city in result]
        except Exception as e:
            return str(e)


    @staticmethod
    def get_home_by_id(id):
        try:
            result = (
                 db.session.query(Home,Person,Place,City)
                .join(Person,Home.person_id == Person.id)
                .join(Place, Home.place_id == Place.id)
                .join(City, Place.city_id == City.id)
                .filter(Home.id == id,Home.validate == 1)
                .first()
            )
            if result is None:
                return {'error':'Home not found'}

            homes, person, place, city = result
            if homes is not None:
                return {"id": homes.id, "name": homes.name, "place": place.name,
                     "city": city.name, "person": person.name}

        except Exception as e:
            return (str(e))

    @staticmethod
    def get_Deleted_home_by_id(id):
        try:
            result = (
                 db.session.query(Home,Person,Place,City)
                .join(Person,Home.person_id == Person.id)
                .join(Place, Home.place_id == Place.id)
                .join(City, Place.city_id == City.id)
                .filter(Home.id == id,Home.validate == 0)
                .first()
            )

            if result is None:
                return {'error':'Home not found'}

            homes, person, place , city = result

            if homes is not None:
                return {"id": homes.id, "name": homes.name, "place": place.name,
                     "city": city.name, "person": person.name}
        except Exception as e:
            return str(e)

    @staticmethod
    def get_home_by_name(name):
        try:
            result = (
                db.session.query(Home,Person,Place,City)
                .join(Person, Home.person_id == Person.id)
                .join(Place, Home.place_id == Place.id)
                .join(City, Place.city_id == City.id)
                .filter(Home.name == name,Home.validate == 1)
                .first()
            )
            if result is None:
                return {'error':'Home not found'}

            homes, person, place, city = result

            if homes is not None:
                return {"id": homes.id, "name": homes.name, "place": place.name,
                     "city": city.name, "person": person.name}
        except Exception as e:
            return str(e)

    @staticmethod
    def get_deleted_home_by_name(name):
        try:
            result = (
                db.session.query(Home,Person,Place,City)
                .join(Person, Home.person_id == Person.id)
                .join(Place, Home.place_id == Place.id)
                .join(City, Place.city_id == City.id)
                .filter(Home.name == name,Home.validate == 0)
                .first()
            )
            if result is None:
                return {'error':'Home not found'}

            homes, person, place, city = result
            if homes is not None:
                return {"id": homes.id, "name": homes.name, "place": place.name,
                     "city": city.name, "person": person.name}
        except Exception as e:
            return str(e)

    @staticmethod
    def List_homes_by_person_id(person_id):
        try:
            result = (
                db.session.query(Home, Person)
                .join(Person, Home.person_id == Person.id)
                .filter(Home.person_id == person_id,Home.validate == 1)
                .all()
            )
            if result is None:
                return {'error':'Home not found for this person'}

            if result is not None:
                return [{"home_id": home.id, "home_name":
                    home.name, "person_name": person.name}
                    for home, person in result
                ]
        except Exception as e:
            return str(e)

    @staticmethod
    def List_deleted_homes_by_person_id(person_id):
        try:
            result = (
                db.session.query(Home, Person)
                .join(Person, Home.person_id == Person.id)
                .filter(Home.person_id == person_id,Home.validate == 0)
                .all()
            )
            if result is None:
                return {'error':'Home not found for this person'}

            if result is not None:
                return [{"home_id": home.id, "home_name":
                    home.name, "person_name": person.name}
                    for home, person in result
                ]
        except Exception as e:
            return str(e)

    @staticmethod
    def add_home(data):
        try:
            person_id = data.get('person_id')
            place_id = data.get('place_id')

            person = Person.query.filter_by(id=person_id,validate=1).first()
            if person is None:
                return {'error':'Person not found'}

            place = Place.query.filter_by(id=place_id,validate=1).first()
            if place is None:
                return {'error':'Place not found'}

            homes = Home(name=data['name'], person_id=data['person_id'],
                         place_id=data['place_id'],validate=1)
            db.session.add(homes)
            db.session.commit()
            return {'success':f"{data['name']} added successfully"}
        except Exception as e:
            return str(e)

    @staticmethod
    def update_home(data):
        try:
            person = Person.query.filter_by(id=data['person_id'], validate=1).first()
            if person is None:
                return {'error':'Person not found'}

            place = Place.query.filter_by(id=data['place_id'], validate=1).first()
            if place is None:
                return {'error':'Place not found'}

            homes = Home.query.filter_by(id=data['id'],validate=1).first()
            if homes is None:
                return {'error':'Home not found'}

            if homes is not None:
                homes.name = data['name']
                homes.person_id = data['person_id']
                homes.place_id = data['place_id']
                homes.validate = 1
                db.session.commit()
                return {'success':f"{data['name']} updated successfully"}
        except Exception as a:
            return str(a)


    @staticmethod
    def delete_home(id):
        try:
            homes = Home.query.filter(Home.id == id,Home.validate == 1).first()
            if homes is None:
                return {'error':'Home for deletion not found'}

            compartment = Compartment.query.filter_by(home_id=id,validate=1).first()
            if compartment:
                return {'error':f'Home has associated Compartment. It Cannot be deleted'}

            security = Security.query.filter_by(home_id=id,validate=1).first()
            if security:
                return {'error':f'Home has associated Security. It Cannot be deleted'}

            sprinkler = HomeSprinkler.query.filter_by(home_id=id,validate=1).first()
            if sprinkler:
                return {'error':f'Home has associated Sprinkler. It Cannot be deleted'}

            homes.validate = 0
            db.session.commit()
            return {'success':f'Home deleted successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def backup_deleted_home_by_id(id):
        try:
            homes = Home.query.filter_by(id=id, validate=0).first()
            if homes is None:
                return {'error':f'Deleted Home for id {id} is not found'}

            homes.validate =1
            db.session.commit()
            return {'success':f"{homes.name} backed up successfully"}
        except Exception as e:
            return str(e)

#--------------------------------------- Compartment -----------------------------------

    @staticmethod
    def list_compartments():
        try:
            compartments = (
                            db.session.query(Home,Compartment)
                            .join(Home, Compartment.home_id == Home.id)
                            .filter(Compartment.validate == 1)
                            .all()
                            )
            return [{"id": compartment.id, "name": compartment.name,
                     "home_id": home.id, "Home Name": home.name}
                    for home,compartment in compartments]
        except Exception as e:
            return str(e)

    @staticmethod
    def list_deleted_compartments():
        try:
            compartments = (
                            db.session.query(Home,Compartment)
                            .join(Home, Compartment.home_id == Home.id)
                            .filter(Compartment.validate == 0)
                            .all()
                            )
            return [{"id": compartment.id, "name": compartment.name,
                     "home_id": home.id, "Home Name": home.name}
                    for home,compartment in compartments]
        except Exception as e:
            return str(e)


    @staticmethod
    def get_compartment_by_id(id):
        try:
            result = (db.session.query(Compartment,Home)
                      .join(Home,Compartment.home_id == Home.id)
                      .filter(Compartment.id == id,Compartment.validate == 1)
                      .first())
            if result is None:
                return {'error':'Compartment not found'}

            compartments, home = result
            if compartments is not None:
                return {"id": compartments.id, "name": compartments.name,
                         "home_id": home.id, "Home Name": home.name}

        except Exception as a:
            return str(a)

    @staticmethod
    def get_Deleted_compartment_by_id(id):
        try:
            result = (db.session.query(Compartment,Home).join(Home,Compartment.home_id == Home.id)
                      .filter(Compartment.id == id,Compartment.validate == 0).first())
            if result is None:
                return {'error':'Compartment not found'}

            compartments, home = result
            if compartments is not None:
                return [{"id": compartments.id, "name": compartments.name,
                         "home_id": home.id, "Home Name": home.name}]

        except Exception as a:
            return str(a)

    @staticmethod
    def List_compartments_by_home_id(home_id):
        try:
            result = (
                db.session.query(Compartment, Home)
                .join(Home, Compartment.home_id == Home.id)
                .filter(Compartment.home_id == home_id, Compartment.validate == 1)
                .all()
            )
            if result is not None:
                return [
                    {
                        "compartment_id": compartment.id,
                        "compartment_name": compartment.name,
                        "home_id": home.id,
                        "home_name": home.name,
                    }
                    for compartment, home in result
                ]
        except Exception as a:
            return str(a)

    @staticmethod
    def List_deleted_compartments_by_home_id(home_id):
        try:
            result = (
                db.session.query(Compartment, Home)
                .join(Home, Compartment.home_id == Home.id)
                .filter(Compartment.home_id == home_id, Compartment.validate == 0)
                .all()
            )
            if result is not None:
                return [
                    {
                        "compartment_id": compartment.id,
                        "compartment_name": compartment.name,
                        "home_id": home.id,
                        "home_name": home.name,
                    }
                    for compartment, home in result
                ]
        except Exception as a:
            return str(a)

    @staticmethod
    def add_compartment(data):
        try:
            home_id = data.get('home_id')
            home = Home.query.filter_by(id=home_id,validate=1).first()
            if home is None:
                return {'error':'Home not found'}

            compartments = Compartment(name=data['name'], home_id=data['home_id'],validate=1)
            db.session.add(compartments)
            db.session.commit()
            return {'success':f"{data['name']} added successfully"}
        except Exception as a:
            return str(a)

    @staticmethod
    def update_compartment(data):
        try:
            home = Home.query.filter_by(id=data['home_id'],validate=1).first()
            if home is None:
                return {'error':'Invalid Home Id'}

            compartments = Compartment.query.filter_by(id=data['id'],validate=1).first()
            if compartments is None:
                return {'error':'Compartment not found'}

            if compartments is not None:
                compartments.name = data['name']
                compartments.home_id = data['home_id']
                compartments.validate = 1
                db.session.commit()
                return {'success':f"{data['name']} updated successfully"}
        except Exception as a:
            return str(a)

    @staticmethod
    def delete_compartment(id):
        try:
            compartment = Compartment.query.filter_by(id=id,validate=1).first()
            if compartment is None:
                return {'error':'Compartment not found'}

            compartment_appliances = CompartmentAppliance.query.filter_by(compartment_id=id,validate=1).first()
            if compartment_appliances is not None:
                return {'error':f'Compartment has associated Compartment Appliances. It Cannot be deleted'}

            compartment_locks = CompartmentLock.query.filter_by(compartment_id=id,validate=1).first()
            if compartment_locks is not None:
                return {'error':f'Compartment has associated Compartment Locks. It Cannot be deleted'}

            compartment.validate = 0
            db.session.commit()
            return {'success':f'Compartment deleted successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def backup_deleted_compartment_by_id(id):
        try:
            compartment = Compartment.query.filter_by(id=id, validate=0).first()
            if compartment is None:
                return {'error':'Compartment not found'}

            compartment.validate =1
            db.session.commit()
            return {'success':f"{compartment.name} backup successfully"}
        except Exception as e:
            return str(e)
