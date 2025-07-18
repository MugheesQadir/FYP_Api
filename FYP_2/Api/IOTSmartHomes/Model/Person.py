from config import db

class Person(db.Model):
    __tablename__ = 'Person'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    homes = db.relationship("Home", back_populates="persons")