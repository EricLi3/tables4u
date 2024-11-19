INSERT INTO Restaurants (
    restUUID, userName, pass, restName, address, openingHour, closingHour, isActive
) VALUES (
    '123e4567-e89b-12d3-a456-426614174000', -- Unique identifier
    'manager123',                          -- Username for the restaurant manager
    'securePassword123',                   -- Password for the manager
    'The Gourmet Place',                   -- Restaurant name
    '123 Culinary Blvd, Food City, FC 12345', -- Address
    '17:00:00',                            -- Opening hour (5 PM)
    '23:00:00',                            -- Closing hour (11 PM)
    TRUE                                  -- Initially inactive
);

INSERT INTO Benches (
    benchUUID, benchNumber, numSeats, restUUID
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000', -- benchUUID (use a generated UUID)
    1,                                     -- benchNumber (unique within restaurant)
    4,                                     -- numSeats (number of seats at the table)
    '123e4567-e89b-12d3-a456-426614174000' -- restUUID (associated restaurant)
);

INSERT INTO Administrators (
	adminUUID, userName, pass
) VALUES (
		
);
    