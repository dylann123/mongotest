# Rankings

### Overview
This API handles event rankings. It provides endpoints to get, add, update, and delete rankings.
- **Last Updated:** 14 November 2024

### Endpoints

#### GET /get
- **Description:** Retrieves rankings based on query parameters.
- **Query Parameters:**
	- `event` (string): The event name.
	- `season` (string): The season.
	- `userid` (string): The user ID.
	- `competition` (string): The competition name.
- **Response:**
	- `200 OK`: Returns the rankings.
	- `404 Not Found`: Rankings not found.

#### POST /add
- **Description:** Adds a new ranking.
- **Request Body:**
	- `event` (string): The event name.
	- `season` (string): The season.
	- `userid` (string): The user ID.
	- `rank` (number): The rank.
	- `competition` (string): The competition name.
- **Response:**
	- `200 OK`: Ranking added.
	- `400 Bad Request`: Missing or invalid parameters.
	- `401 Unauthorized`: Unauthorized access.

#### POST /update
- **Description:** Updates an existing ranking.
- **Request Body:**
	- `id` (string): The ranking ID.
	- `event` (string): The event name.
	- `season` (string): The season.
	- `userid` (string): The user ID.
	- `rank` (number): The rank.
	- `competition` (string): The competition name.
- **Response:**
	- `200 OK`: Ranking updated.
	- `400 Bad Request`: Missing or invalid parameters.
	- `401 Unauthorized`: Unauthorized access.

#### DELETE /delete
- **Description:** Deletes a ranking.
- **Request Body:**
	- `event` (string): The event name.
	- `season` (string): The season.
	- `userid` (string): The user ID.
	- `competition` (string): The competition name.
- **Response:**
	- `200 OK`: Ranking deleted.
	- `400 Bad Request`: Missing parameters.