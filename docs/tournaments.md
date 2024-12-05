# Tournaments

### Last Updated
- **21 September 2024**

### Description
This module handles endpoint requests to `/tournaments` and returns values from the tournament database.

### Endpoints

#### GET `/tournaments/`
- **Description**: Retrieves all tournaments.
- **Response**: 
	- `200 OK`: Returns a JSON object with all tournaments.
	- Example:
		```json
		{
			"code": 200,
			"result": {
				"1": {
					"name": "Tournament 1",
					"date": 1633024800
				},
				"2": {
					"name": "Tournament 2",
					"date": 1633111200
				}
			}
		}
		```

#### GET `/tournaments/:id`
- **Description**: Retrieves a specific tournament by ID.
- **Response**:
	- `200 OK`: Returns the tournament details.
	- `404 Not Found`: Tournament not found.
	- Example:
		```json
		{
			"code": 200,
			"result": {
				"id": "1",
				"name": "Tournament 1",
				"date": 1633024800,
				"locations": ["Location 1"],
				"links": ["http://example.com"],
				"time_slots": [{"start": 1633024800, "stop": 1633032000}],
				"season": "2024"
			}
		}
		```

#### POST `/tournaments/add`
- **Description**: Adds a new tournament.
- **Request Body**:
	- `name` (string): Name of the tournament.
	- `date` (number): UNIX timestamp of the tournament date.
	- `locations` (array): Array of locations.
	- `links` (array): Array of links.
	- `time_slots` (array): Array of time slots formatted as `[{start: starttimeunix, stop: stoptimeunix}, ...]`.
	- `season` (string): Season of the tournament.
	- Example:
		```json
		{
			"name": "Tournament 1",
			"date": 1633024800,
			"locations": ["Location 1"],
			"links": ["http://example.com"],
			"time_slots": [{"start": 1633024800, "stop": 1633032000}],
			"season": "2024"
		}
		```
- **Response**:
	- `200 OK`: Tournament added successfully.
	- `400 Bad Request`: Missing or invalid parameters.
	- Example:
		```json
		{
			"code": 200,
			"result": "Tournament added successfully."
		}
		```

#### POST `/tournaments/update`
- **Description**: Updates an existing tournament.
- **Request Body**:
	- `id` (string): ID of the tournament to update.
	- Optional parameters: `name`, `date`, `locations`, `links`, `time_slots`.
- **Response**:
	- `200 OK`: Tournament updated successfully.
	- `400 Bad Request`: Missing or invalid parameters.
	- Example:
		```json
		{
			"code": 200,
			"result": "Tournament updated successfully."
		}
		```

#### POST `/tournaments/delete`
- **Description**: Deletes a tournament.
- **Request Body**:
	- `id` (string): ID of the tournament to delete.
- **Response**:
	- `200 OK`: Tournament deleted successfully.
	- `400 Bad Request`: Missing or invalid parameters.
	- Example:
		```json
		{
			"code": 200,
			"result": "Tournament deleted successfully."
		}
		```