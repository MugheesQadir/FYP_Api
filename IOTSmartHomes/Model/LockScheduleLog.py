from config import db

class LockScheduleLog(db.Model):
    __tablename__ = "LockScheduleLog"

    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.String(20), nullable=False)
    end_time = db.Column(db.String(20), nullable=False)
    days = db.Column(db.String(20), nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    lock_schedule_id = db.Column(db.Integer,db.ForeignKey("LockSchedule.id"),nullable = False)

    lockschedules = db.relationship("LockSchedule",back_populates = "lockschedulelogs")