CREATE TABLE Restaurants (
	restUUID VARCHAR(64) PRIMARY KEY,
    userName VARCHAR(64) UNIQUE,
    pass VARCHAR(64) UNIQUE,
    restName VARCHAR(64),
    address VARCHAR(100),
    openingHour VARCHAR(10),
    closingHour VARCHAR(10),
    closedDays VARCHAR(100),
    bench VARCHAR(100),
    reservationUUID VARCHAR(100),
    isActive BOOLEAN,
    
    -- Foreign Keys
	CONSTRAINT FOREIGN KEY (reservationUUID) REFERENCES Reservations (restUUID),
   	CONSTRAINT FOREIGN KEY (bench) REFERENCES Benches (benchUUID)
);

CREATE TABLE Administrators (
	userName VARCHAR(64) UNIQUE,
    pass VARCHAR(64) UNIQUE,
    
    -- restaurant 
    PRIMARY KEY (userName, pass)
);

-- CREATE TABLE Consumers (
-- 	userName VARCHAR(64) UNIQUE,
--     pass VARCHAR(64) UNIQUE,
--     
--     -- restaurant 
--     PRIMARY KEY (userName, pass)
-- );

CREATE TABLE Benches (
	benchUUID VARCHAR(64) PRIMARY KEY,
    benchNameId VARCHAR(50),
    numSeats VARCHAR(100),
    restUUID VARCHAR(64),
    
    -- FK for Restrarant it references
	CONSTRAINT FOREIGN KEY (restUUID) REFERENCES Restaurant (restUUID)
);

CREATE TABLE Reservations (
	restUUID VARCHAR(64) UNIQUE,
    startEndDate VARCHAR(64),
    email VARCHAR(100),
    confirmationCode VARCHAR(100) UNIQUE,
	benchUUID VARCHAR(64),
    groupSize VARCHAR(10),
    
    timeInitiate VARCHAR(64),
    
    -- restaurant 
    PRIMARY KEY (userName, pass),
    -- Foreign key for restUUID
    
	CONSTRAINT FOREIGN KEY (restUUID) REFERENCES Restaurant (restUUID),
   	CONSTRAINT FOREIGN KEY (benchUUID) REFERENCES Bench (benchUUID)
);

