from config import db

class Home(db.Model):
    __tablename__ = 'Home'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    person_id = db.Column(db.Integer, db.ForeignKey('Person.id'), nullable=False)
    place_id = db.Column(db.Integer, db.ForeignKey('Place.id'), nullable=False)

    persons = db.relationship("Person", back_populates="homes")
    places = db.relationship("Place", back_populates="homes")

    compartments = db.relationship("Compartment",back_populates="homes")
    securities = db.relationship("Security", back_populates="homes")
    homesprinklers = db.relationship("HomeSprinkler", back_populates="homes")
    geyser = db.relationship("Geyser", back_populates="homes")
    mainlogs = db.relationship('MainLog', back_populates='homes')