from config import db


class CompartmentApplianceLog(db.Model):
    __tablename__ = 'CompartmentApplianceLog'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=True)
    duration_minutes = db.Column(db.Integer, nullable=True)
    date = db.Column(db.Date, nullable=False)
    validate = db.Column(db.Integer, nullable=False)
    day_ = db.Column(db.Integer, nullable=False)
    messagee = db.Column(db.String(50),nullable=False)
    consumption = db.Column(db.Integer, nullable=True)

    compartment_appliance_id = db.Column(db.Integer, db.ForeignKey('CompartmentAppliance.id'), nullable=False)

    compartment_appliances = db.relationship("CompartmentAppliance", back_populates="compartment_appliance_logs")
