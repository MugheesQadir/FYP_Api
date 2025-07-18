from config import db

class Place(db.Model):
    __tablename__ = 'Place'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    city_id = db.Column(db.Integer, db.ForeignKey('City.id'), nullable=False)

    citys = db.relationship("City", back_populates="places")
    homes = db.relationship("Home", back_populates="places")
