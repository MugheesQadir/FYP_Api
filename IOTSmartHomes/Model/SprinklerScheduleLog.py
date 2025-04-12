from config import db

class SprinklerScheduleLog(db.Model):
    __tablename__ = "SprinklerScheduleLog"

    id = db.Column(db.Integer,primary_key=True)
    start_time = db.Column(db.String(20), nullable=False)
    end_time = db.Column(db.String(20), nullable=False)
    days = db.Column(db.String(20), nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    sprinkler_schedule_id = db.Column(db.Integer,db.ForeignKey("SprinklerSchedule.id"),nullable = False)

    sprinklerschedules = db.relationship("SprinklerSchedule",back_populates="sprinklerschedulelogs")