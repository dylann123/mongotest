# Drive API Tests

### Overview
This API handles drive events and links. It provides endpoints to get events, get drive links, and add drive links.
- **Last Updated:** 14 November 2024

### Endpoints

#### GET /drive/events
- **Description:** Returns a JSON object containing event types.
- **Response:**
	- `200 OK`: `{ code: 200, result: [...] }`
	- Example:
		```json
		{
			"code": 200,
			"result": {
				"fermi": "Fermi Questions",
				"codebusters": "Codebusters",
				"ecology": "Ecology",
				"air_trajectory": "Air Trajectory",
				"anatomy": "Anatomy and Physiology",
				"astronomy": "Astronomy",
				"bungee": "Bungee Drop",
				"chemistry_lab": "Chemistry Lab",
				"diease_detectives": "Disease detectives",
				"dynamic_planet": "Dynamic Planet",
				"electric_vehicle": "Electric Vehicle",
				"entomology": "Entomology",
				"experimental_design": "Experimental Design",
				"forensics": "Forensics",
				"fossils": "Fossils",
				"geologic_mapping": "Geologic Mapping",
				"helicopter": "Helicopter",
				"materials_science": "Materials Science",
				"microbe_mission": "Microbe Mission",
				"optics": "Optics",
				"robot_tour": "Robot Tour",
				"towers": "Towers",
				"wind_power": "Wind Power",
				"widi": "Write It Do It"
			}
		}
		```
	- `401 Unauthorized`: `{ code: 401, result: "Unauthorized" }`

#### GET /drive/:event
- **Description:** Returns a JSON object containing drive links for a given event. Requires authentication. Response changes based on user type (regional/state).
- **Query Parameters:**
	- `event` (string): Event name
- **Response:**
	- `200 OK`: `{ code: 200, result: { ... } }`
	- Example:
		```json
		{
			"code": 200,
			"result": {
				"states": [
					{ "event": "State 1", "link": "https://drive.google.com/..." },
					{ "name": "State 2", "link": "https://drive.google.com/..." }
				],
				"regionals": [
					{ "name": "Regional 1", "link": "https://drive.google.com/..." },
					{ "name": "Regional 2", "link": "https://drive.google.com/..." }
				]
			}
		}

		```
	- `404 Not Found`: `{ code: 404, result: "Event not found." }`
	- `401 Unauthorized`: `{ code: 401, result: "Unauthorized" }`

#### POST /drive/:event
- **Description:** Adds a drive link to the database. Requires authentication.
- **Request Body:**
	- `event` (string): Event name
	- `link` (string): Drive link
	- `type` (string): Link type (states, regionals)
- **Response:**
	- `200 OK`: `{ code: 200, result: { ... } }`
	- Example:
		```json
		{
			"code": 200,
			"result": {
				"states": [
					{ "name": "State 1", "link": "https://drive.google.com/..." },
					{ "name": "State 2", "link": "https://drive.google.com/..." }
				],
				"regionals": [
					{ "name": "Regional 1", "link": "https://drive.google.com/..." },
					{ "name": "Regional 2", "link": "https://drive.google.com/..." }
				]
			}
		}
		```
	- `400 Bad Request`: `{ code: 400, result: "Missing event, link, or type" }`

### GET /photos
- **Description:** Returns all drive links for photos.
- **Response:**
	- `200 OK`: `{ code: 200, result: [...] }`

#### POST /photos
- **Description:** Adds a photo link to the database. Requires authentication.
- **Request Body:**
	- `link` (string): Photo link
	- `name` (string): Photo name
- **Response:**
	- `200 OK`: `{ code: 200, result: { name: "...", link: "..." } }`
	- `400 Bad Request`: `{ code: 400, result: "Missing params" }`
	- `401 Unauthorized`: `{ code: 401, result: "Unauthorized" }`

#### DELETE /photos
- **Description:** Deletes a photo link from the database. Requires authentication.
- **Request Body:**
	- `link` (string): Photo link to be deleted
- **Response:**
	- `200 OK`: `{ code: 200, result: [...] }`
	- `400 Bad Request`: `{ code: 400, result: "Missing link" }`
	- `401 Unauthorized`: `{ code: 401, result: "Unauthorized" }`
	- `404 Not Found`: `{ code: 404, result: "Link not found" }`