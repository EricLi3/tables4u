CREATE TABLE Restaurants (
    restUUID CHAR(36) PRIMARY KEY,
    userName VARCHAR(64) UNIQUE NOT NULL,
    pass VARCHAR(64) UNIQUE NOT NULL,
    restName VARCHAR(64) NOT NULL,
    address VARCHAR(100),
    openingHour TIME NOT NULL,
    closingHour TIME NOT NULL,
    isActive BOOLEAN DEFAULT FALSE
);

CREATE TABLE ClosedDays (
    closeUUID CHAR(36) PRIMARY KEY,
    restUUID CHAR(36),
    closedDate DATE NOT NULL,
    CONSTRAINT fk_restaurant_closed FOREIGN KEY (restUUID) REFERENCES Restaurants (restUUID) ON DELETE CASCADE
);

CREATE TABLE Benches (
    benchUUID CHAR(36) PRIMARY KEY,
    benchNumber INT NOT NULL,
    numSeats SMALLINT CHECK (numSeats BETWEEN 1 AND 8),
    restUUID CHAR(36),
    CONSTRAINT fk_restaurant_tables FOREIGN KEY (restUUID) REFERENCES Restaurants (restUUID) ON DELETE CASCADE
);

CREATE TABLE Reservations (
    reservationUUID CHAR(36) PRIMARY KEY,
    restUUID CHAR(36),
    benchUUID CHAR(36),
	reservationDateTime DATETIME NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    email VARCHAR(100) NOT NULL,
    confirmationCode CHAR(6) UNIQUE NOT NULL,
    groupSize SMALLINT CHECK (groupSize > 0),
    CONSTRAINT fk_restaurant_reservations FOREIGN KEY (restUUID) REFERENCES Restaurants (restUUID) ON DELETE CASCADE,
    CONSTRAINT fk_bench_reservations FOREIGN KEY (benchUUID) REFERENCES Benches (benchUUID) ON DELETE CASCADE
);

CREATE TABLE Administrators (
    adminUUID CHAR(36) PRIMARY KEY,
    userName VARCHAR(64) UNIQUE NOT NULL,
    pass VARCHAR(64) UNIQUE NOT NULL
);