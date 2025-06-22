from config import db

class Geyser(db.Model):
    __tablename__ = 'Geyser'

    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(50),nullable = False)
    gas_status = db.Column(db.Integer, nullable=False)
    cylinder_status = db.Column(db.Integer, nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    home_id = db.Column(db.Integer,db.ForeignKey('Home.id'),nullable=False)

    homes = db.relationship("Home",back_populates='geyser')

