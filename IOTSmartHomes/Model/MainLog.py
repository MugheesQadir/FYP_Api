from config import db


class MainLog(db.Model):
    __tablename__ = 'MainLog'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    triggered_by = db.Column(db.String(30), nullable=False)
    messagee = db.Column(db.String(50),nullable=False)
    log_time = db.Column(db.DateTime, nullable=False)
    date = db.Column(db.Date, nullable=False)
    validate = db.Column(db.Integer, nullable=False)

    home_id = db.Column(db.Integer, db.ForeignKey('Home.id'), nullable=False)

    homes = db.relationship("Home", back_populates="mainlogs")
