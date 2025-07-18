from config import db

class CompartmentLock(db.Model):
    __tablename__ = "CompartmentLock"

    id = db.Column(db.Integer,primary_key = True)
    name = db.Column(db.String(30),nullable=False)
    type = db.Column(db.Integer,nullable = False)
    status = db.Column(db.Integer,nullable = False)
    port = db.Column(db.Integer, nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    compartment_id = db.Column(db.Integer, db.ForeignKey('Compartment.id'), nullable=False)

    compartments = db.relationship('Compartment', back_populates='compartmentlocks')
    lockschedules = db.relationship("LockSchedule",back_populates="compartmentlocks")

    compartment_lock_logs = db.relationship('CompartmentLockLog', back_populates='compartment_locks')