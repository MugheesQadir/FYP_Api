from config import db

class SprinklerSchedule(db.Model):
    __tablename__ = "SprinklerSchedule"

    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(30),nullable = False)
    season = db.Column(db.String(30),nullable = False)
    start_time = db.Column(db.String(20),nullable = False)
    end_time = db.Column(db.String(20),nullable = False)
    days = db.Column(db.String(20),nullable = False)
    validate = db.Column(db.Integer, nullable=False)

    home_sprinkler_id = db.Column(db.Integer,db.ForeignKey("HomeSprinkler.id"),nullable = False)

    homesprinklers = db.relationship("HomeSprinkler",back_populates="sprinkler_schedules")
    sprinklerschedulelogs = db.relationship("SprinklerScheduleLog",back_populates="sprinklerschedules")