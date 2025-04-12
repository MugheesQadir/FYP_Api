from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Corrected connection string with your SQL Server credentials
app.config['SQLALCHEMY_DATABASE_URI'] = (
    'mssql+pyodbc://sa:123@localhost\SQLEXPRESS/IOTSmartHome'
    '?driver=ODBC+Driver+17+for+SQL+Server'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
