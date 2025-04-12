from config import db

class ApplianceScheduleLog(db.Model):
    __tablename__ = 'ApplianceScheduleLog'

    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.String(20), nullable=False)
    end_time = db.Column(db.String(20), nullable=False)
    days = db.Column(db.String(20), nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    appliance_schedule_id = db.Column(db.Integer, db.ForeignKey('ApplianceSchedule.id'), nullable=False)

    applianceschedules = db.relationship("ApplianceSchedule", back_populates="appliance_schedule_logs")