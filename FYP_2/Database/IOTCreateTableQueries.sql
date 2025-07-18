Create database IOTSmartHome
use IOTSmartHome
 
------------------ Person ------------------

create table Person (id int primary key identity(1,1),email varchar(50) not null unique,
name varchar(100) not null,password varchar(50) not null,
role varchar(50) not null,validate int not null)

create table City (id int primary key identity(1,1), name varchar(50) not null,validate int not null)

create table Place (id int primary key identity(1,1), name varchar(100) not null,
city_id int foreign key references City(id) not null,validate int not null)

create table Home ( id int primary key identity(1,1), name varchar(50) not null,
person_id int foreign key references Person(id) not null,
place_id int foreign key references Place(id) not null,validate int not null)

create table Compartment (id int primary key identity(1,1), name varchar(50) not null,
home_id int foreign key references Home(id) not null,validate int not null)

------------------- Appliances ----------------

CREATE TABLE Appliance (
    id INT PRIMARY KEY identity(1,1),
    type varchar(50) not null,
	catagory varchar(50) not null,
    power INT NULL,validate int not null
);

CREATE TABLE CompartmentAppliance(
    id INT PRIMARY KEY identity(1,1),
	name VARCHAR(50) NOT NULL,
	status int NOT NULL,
	compartment_id int foreign key references Compartment(id) not null,
	appliance_id int foreign key references Appliance (id) not null,validate int not null
	);
	
create table Security (
id int primary key identity(1,1),
name varchar(50) not null,
status int NOT NULL,
home_id int foreign key references Home(id) not null,validate int not null
)

CREATE TABLE ApplianceSchedule (
    id INT PRIMARY KEY identity(1,1),
    name VARCHAR(30) NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    days VARCHAR(20) NOT NULL,
	table_id int not null,
	type int not null, -- if 0 then compartment_id, if 1 then security_id,
	validate int not null
	)

CREATE TABLE ApplianceScheduleLog (
    id INT PRIMARY KEY identity(1,1),
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    days VARCHAR(20) NOT NULL,
	appliance_schedule_id int foreign key references ApplianceSchedule (id) not null,
	validate int not null)

------------------------------ Sprinkler -------------------------------
CREATE TABLE HomeSprinkler (
    id INT PRIMARY KEY identity(1,1),
	name VARCHAR(30) NOT NULL,
	status int NOT NULL,
    home_id int foreign key references Home(id) not null,
	validate int not null)

CREATE TABLE SprinklerSchedule (
    id INT PRIMARY KEY identity(1,1),
    name VARCHAR(30) NOT NULL,	
    season VARCHAR(30) NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    days VARCHAR(20) NOT NULL,
	home_sprinkler_id int foreign key references HomeSprinkler (id) not null,
	validate int not null)

CREATE TABLE SprinklerScheduleLog (
    id INT PRIMARY KEY identity(1,1),
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    days VARCHAR(20) NOT NULL,
	sprinkler_schedule_id int foreign key references SprinklerSchedule(id) not null,
	validate int not null)

	
------------------------------------ Lock ----------------------------------

CREATE TABLE CompartmentLock 
   (
    id INT PRIMARY KEY identity(1,1),
	name varchar(30) NOT NULL,
    type int not null,
    status int NOT NULL,
    compartment_id int foreign key references Compartment(id) not null,
	validate int not null
	);


CREATE TABLE LockSchedule 
    (
    id INT PRIMARY KEY identity(1,1),
    name VARCHAR(30) NOT NULL,	
    lock_type VARCHAR(30) NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    days VARCHAR(20) NOT NULL,
	compartment_lock_id int foreign key references CompartmentLock (id) not null,
	validate int not null
	)

CREATE TABLE LockScheduleLog (
    id INT PRIMARY KEY identity(1,1),
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    days VARCHAR(20) NOT NULL,
	lock_schedule_id int foreign key references LockSchedule (id) not null,
	validate int not null
	)

	
