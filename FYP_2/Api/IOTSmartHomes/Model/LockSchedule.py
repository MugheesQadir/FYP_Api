from config import db

class LockSchedule(db.Model):
    __tablename__ = "LockSchedule"

    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    lock_type = db.Column(db.String(30), nullable=False)
    start_time = db.Column(db.String(20), nullable=False)
    end_time = db.Column(db.String(20), nullable=False)
    days = db.Column(db.String(20), nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    compartment_lock_id = db.Column(db.Integer,db.ForeignKey("CompartmentLock.id"),nullable = False)

    compartmentlocks = db.relationship("CompartmentLock",back_populates="lockschedules")
    lockschedulelogs = db.relationship("LockScheduleLog",back_populates='lockschedules')