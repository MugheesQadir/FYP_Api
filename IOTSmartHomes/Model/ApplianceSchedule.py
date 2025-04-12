from config import db

class ApplianceSchedule(db.Model):
    __tablename__ = "ApplianceSchedule"

    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(30),nullable = False)
    start_time = db.Column(db.String(20),nullable = False)
    end_time = db.Column(db.String(20),nullable = False)
    days = db.Column(db.String(20),nullable=False)
    table_id = db.Column(db.Integer,nullable=False)
    type = db.Column(db.Integer,nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    appliance_schedule_logs = db.relationship("ApplianceScheduleLog",back_populates="applianceschedules")

