from config import db

class City(db.Model):
    __tablename__ = 'City'  # Ensure table name is 'City' (uppercase C)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    places = db.relationship("Place", back_populates="citys")
