DROP TABLE IF EXISTS holidays;
CREATE TABLE holidays (
  id SERIAL PRIMARY KEY,
  country VARCHAR(255),
  holidayname VARCHAR(255),
  description TEXT,
  date VARCHAR(255),
  type VARCHAR(255),
  picture_url VARCHAR(255)
)
