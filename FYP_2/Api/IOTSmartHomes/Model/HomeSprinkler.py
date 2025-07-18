from config import db

class HomeSprinkler(db.Model):
    __tablename__ = "HomeSprinkler"

    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(30),nullable = False)
    status = db.Column(db.Integer,nullable = False)
    validate = db.Column(db.Integer, nullable=False)

    home_id = db.Column(db.Integer, db.ForeignKey('Home.id'), nullable=False)

    homes = db.relationship("Home", back_populates='homesprinklers')

    sprinkler_schedules = db.relationship("SprinklerSchedule",back_populates="homesprinklers")

