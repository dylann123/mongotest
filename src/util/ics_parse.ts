class ICS_Object {

	ics_path: string = "";
	ics: string = "";
	events: any[] = [];

	constructor(ics_path: string) {
		this.ics_path = ics_path;
	}

	public async parse(): Promise<void> {
		this.ics = await this.getICS(this.ics_path);
		this.events = this.parseICS(this.ics);
	}

	private async getICS(ics_path: string): Promise<string> {
		const fs = require('fs');
		return fs.readFileSync(ics_path, 'utf8');
	}

	private parseICS(ics: string): any {
		let lines = ics.split('\n');
		let evts: any[] = [];
		let event: any = {};
		let inEvent = false;
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i].trim();
			if (line === 'BEGIN:VEVENT') {
				inEvent = true;
				event = {};
			} else if (line === 'END:VEVENT') {
				inEvent = false;
				evts.push(event);
			} else if (inEvent) {
				let parts = line.split(':');
				let key = parts[0];
				let value = parts[1];
				if (key === 'DTSTART') { // normal event
					const year = parseInt(value.substring(0, 4));
					const month = parseInt(value.substring(4, 6));
					const day = parseInt(value.substring(6, 8));
					const hour = parseInt(value.substring(9, 11));
					const minute = parseInt(value.substring(11, 13));
					const second = parseInt(value.substring(13, 15));

					event.start = new Date(year, month, day, hour, minute, second);
				} else if (key === 'DTSTART;VALUE=DATE') { // even/odd day
					const year = parseInt(value.substring(0, 4));
					const month = parseInt(value.substring(4, 6));
					const day = parseInt(value.substring(6, 8));

					event.start = new Date(year, month, day);
				} else if (key === 'DTEND') {
					const year = parseInt(value.substring(0, 4));
					const month = parseInt(value.substring(4, 6));
					const day = parseInt(value.substring(6, 8));
					const hour = parseInt(value.substring(9, 11));
					const minute = parseInt(value.substring(11, 13));
					const second = parseInt(value.substring(13, 15));

					event.end = new Date(year, month, day, hour, minute, second);
				} else if (key === 'DTEND;VALUE=DATE') {
					const year = parseInt(value.substring(0, 4));
					const month = parseInt(value.substring(4, 6));
					const day = parseInt(value.substring(6, 8));

					event.end = new Date(year, month, day);
				} else if (key === 'SUMMARY') {
					event.summary = value;
				} else if (key === 'LOCATION') {
					event.location = value;
				}
			}
		}
		return evts;
	}

	public getEvents(): any[] {
		return this.events;
	}


}

export default ICS_Object;