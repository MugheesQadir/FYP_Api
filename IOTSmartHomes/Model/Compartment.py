from config import db

class Compartment(db.Model):
    __tablename__ = 'Compartment'

    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(50),nullable = False)
    validate = db.Column(db.Integer, nullable=False)

    home_id = db.Column(db.Integer,db.ForeignKey('Home.id'),nullable=False)

    homes = db.relationship("Home",back_populates='compartments')

    compartment_appliances = db.relationship("CompartmentAppliance",back_populates="compartments")
    compartmentlocks = db.relationship("CompartmentLock", back_populates="compartments")