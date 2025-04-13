from config import db

class Appliance(db.Model):
    __tablename__ = 'Appliance'

    id = db.Column(db.Integer,primary_key = True)
    type = db.Column(db.String(50),nullable = False)
    catagory = db.Column(db.String(50),nullable = False)
    power = db.Column(db.Integer,nullable = True)
    validate = db.Column(db.Integer, nullable=False)

    compartment_appliances = db.relationship('CompartmentAppliance',back_populates='appliances')


