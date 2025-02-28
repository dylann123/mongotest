const ICS_OBJECT = require('./ics_parse').default;
(async () => {
	let ics = new ICS_OBJECT('../../src/data/ics/cal_24-25.ics');

	await ics.parse()

	console.log(ics.getEvents()[0]);
})()