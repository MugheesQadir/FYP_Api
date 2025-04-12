from Model.Home import Home
from Model.Person import Person
from config import db

class PersonController:
    @staticmethod
    def list_person():
        try:
            person = Person.query.where(Person.validate == 1).all()
            return [
                {    'id': p.id, 'name': p.name, 'email': p.email,
                     'password': p.password, 'role': p.role
                }
                    for p in person]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_person_by_id(id):
        try:
            p = Person.query.filter_by(id=id,validate = 1).first()
            if p is None:
                return {'error':'Person not found'}

            return [{'id': p.id, 'name': p.name, 'email': p.email,
                     'password': p.password, 'role': p.role}]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_person_by_name(name):
        try:
            p = Person.query.filter_by(name=name,validate=1).first()
            if p is None:
                return {'error':'Person not found'}

            return [{'id': p.id, 'name': p.name,'email':p.email,
                     'password': p.password,'role':p.role}]
        except Exception as e:
            return str(e)

    @staticmethod
    def login_person(data):
        try:
            p = Person.query.filter_by(email = data['email'],validate=1).first()
            if p is None:
                return {'error':'Person not found'}

            if p.email and p.password == data['password']:
                return {'id':p.id,'name':p.name}
            else:
                return {'error':'Invalid Email and password'}
        except Exception as e:
            return str(e)

    @staticmethod
    def signup_person(data):
        try:
            persons = Person.query.filter_by(email=data['email'],validate=1).first()

            if persons is None:
                person = Person(name=data['name'], email=data['email'],
                                password=data['password'], role=data['role'], validate=1)

                db.session.add(person)
                db.session.commit()
                return {'success':f'{data['name']} SignUp Successfully'}

            return {'message':'Email already exists!'}
        except Exception as e:
            return str(e)

    @staticmethod
    def update_person(data):
        try:
            person = Person.query.where(Person.id==data['id'],Person.validate==1).first()
            if person is None:
                return {'error':'Person not found'}

            all_person = Person.query.filter_by(validate=1).all()
            for p in all_person:
                if p.email == data['email'] and p.id != data['id']:
                    return {'message':'Email already exists!'}

            if person is not None:
                person.name = data['name']
                person.email = data['email']
                person.password = data['password']
                person.role = data['role']
                db.session.commit()
                return {'success':'Update successful'}

        except Exception as a:
            return str(a)

    @staticmethod
    def delete_person(id):
        try:
            person = Person.query.filter_by(id=id,validate=1).first()
            if person is None:
                return {'error':'Person not found'}

            homes = Home.query.filter_by(person_id=id, validate=1).first()
            if homes is not None:
                return {'message':f'{person.name} not deleted because they added home'}

            person.validate = 0
            db.session.commit()
            return {'success':f'{person.name} deleted Successfully'}
        except Exception as e:
            return str(e)

    @staticmethod
    def list_deleted_person():
        try:
            person = Person.query.where(Person.validate == 0).all()
            return [
                {'id': p.id, 'name': p.name, 'email': p.email,
                 'password': p.password, 'role': p.role
                 }
                for p in person]
        except Exception as e:
            return str(e)

    @staticmethod
    def get_Deleted_person_by_id(id):
        try:
            p = Person.query.filter_by(id=id,validate = 0).first()
            if p is None:
                return {'error':'Person not found'}

            return [{'id': p.id, 'name': p.name, 'email': p.email,
                     'password': p.password, 'role': p.role}]
        except Exception as e:
            return str(e)

    @staticmethod
    def Backup_person_by_id(id):
        try:
            p = Person.query.filter_by(id=id,validate = 0).first()
            if p is None:
                return {'error':'Person not found'}

            p.validate = 1
            db.session.commit()
            return {'success':f'{p.name} Backed up Successfully'}
        except Exception as e:
            return str(e)


