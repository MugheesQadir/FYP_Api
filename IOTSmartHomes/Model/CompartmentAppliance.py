from config import db


class CompartmentAppliance(db.Model):
    __tablename__ = 'CompartmentAppliance'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    compartment_id = db.Column(db.Integer,db.ForeignKey('Compartment.id'),nullable = False)
    appliance_id = db.Column(db.Integer,db.ForeignKey('Appliance.id'),nullable = False)

    status = db.Column(db.Integer, nullable=False)

    compartments=db.relationship('Compartment',back_populates='compartment_appliances')
    appliances = db.relationship('Appliance',  back_populates='compartment_appliances')
