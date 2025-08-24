\c plant_waterer

-- so we'll have a database of plants. This is the list from which slots can be filled.
-- Each plant will have a name, a description and a moisture threshold.
-- This way we can auto-populate the plant information when people assign it to ta slot.
CREATE TABLE IF NOT EXISTS plants (
    name VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL,
    moisture_threshold FLOAT NOT NULL DEFAULT 1.5,
    image BYTEA
);


-- we have a table for the slots as well. This has a reference to the plants database using the foreign ky,
-- This is the table that keeps track of moisture and last watered. We dont need to store that in the plants db.
CREATE TABLE IF NOT EXISTS watering_slots (
    slot_id SERIAL PRIMARY KEY,
    plant_name VARCHAR(255),
    last_watered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moisture_level FLOAT NOT NULL DEFAULT 0.0,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plant_name) REFERENCES plants(name)
);

-- This tabl will store the history of plants in each index. 
-- As plants are swapped out for new ones in the 3 watering slots, we should keep 
-- a history of the plants that have been in each slot. 
-- We can then use that history when users swap plants out. They can search the list of previously used plants

CREATE TABLE IF NOT EXISTS history (
    id SERIAL PRIMARY KEY,
    plant_name VARCHAR(255),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    removed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plant_name) REFERENCES plants(name)
);

-- also lets add a table to record logs. So each time an API request is made, we will log it.
CREATE TABLE IF NOT EXISTS log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    query_params TEXT NOT NULL,
    request_body TEXT NOT NULL,
    response_status INT NOT NULL,
    client_ip TEXT NOT NULL
)



-- Below i have tried to use GPT4.1 and some not insignificant faffing about to generate an ascii diagram of these 3 tables.

--                           +-------------------+         +----------------+
--+----------------+         |  watering_slots   |         |    history     |
--|    plants      |         +-------------------+         +----------------+
--+----------------+         | slot_id (PK)      |         | id (PK)        |
--| id    (PK)     |<--+-----| plant_id (FK)     |     +---| plant_id(FK)|
--| name           |   |     | last_watered      |     |   | added_at       |
--| description    |   |     | moisture_level    |     |   | removed_at     |
--| moisture_thres.|   |     | added_at          |     |   +----------------+
--| image          |   |     +-------------------+     |
--+----------------+   |                               |
--                     +-------------------------------+
