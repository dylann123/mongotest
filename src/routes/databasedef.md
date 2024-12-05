# Drive

For single event object:

	season: number:

	event: String name

	type: String regional|state

	links: String[]

For single photo DRIVE object

	season: number

	name: String

	link: String

# Rankings

	season: number

	name: String



	

# Tournaments

	season: number

	name: String

	date: int unix timestamp

	locations: 

		event: String location

	links: String[]

	time_slots: 

		1: 

			start: int unix timestamp

			stop: int unix timestamp

			events: String[]

# User


	id: UUID

	username: String

	type: AccountManager.ENUM

	events: String[]

	firstname: String

	lastname: String

	admin: boolean
