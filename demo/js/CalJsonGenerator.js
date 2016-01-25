var bShowMore = true;
var iUnitTimeIntervalCJG = 20;
var iMS = { m: 6E4, h: 36E5, d: 864E5, w: 6048E5 };

var sDateTimeSeparatorCJG = " ";
var sDateSeparatorCJG = "-";
var sTimeSeparatorCJG = ":";

var sHourFormatCJG = "24-Hour";
var sArrTimeCJG;
var sArrEventCalendarCJG;
var sURLCJG = ""; //"http://www.google.com/";
var sDescCJG = "";

var sArrDayNameShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var sArrDayNameFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var sArrTags = ["Tag1", "Tag2", "Tag3"];
var sArrUsers = ["Person1", "Person2", "Person3"];
var iArrTimeDurations = [10, 20, 30, 60];
var dToday = new Date();

/*	---------------------------- Event Prototype Start ------------------------------------------ */

function CalEvent(ceIdentifier, ceAllDay, ceStartDate, ceEndDate, ceType, ceTitle, ceDescription, ceUrl)
{
	this.id = ceIdentifier;
	this.isAllDay = ceAllDay;
	this.start = ceStartDate;
	this.end = ceEndDate;
	this.type = ceType;
	this.title = ceTitle;
	this.desc = ceDescription;
	this.url = ceUrl;
}

CalEvent.prototype = {

	constructor : CalEvent
		
};

/*	---------------------------- Event Prototype End -------------------------------------------- */

Array.prototype.random = function (length) 
{
   return this[Math.floor((Math.random() * length))];
};

/*	---------------------------- Event Json Generation Start --------------------------------- */

function getEventCalendarsArray()
{
	var sArrEventCalendar = [];
	sArrEventCalendar = ["Fitness", "Birthday", "Personal", "Entertainment", "Work"];
	return sArrEventCalendar;
}

sArrEventCalendarCJG = getEventCalendarsArray();

function getEventCalendarColors(sEventCalendar)
{
	var sEventCalendarColor = "";

	if(sEventCalendar === "Fitness")
	{
		sEventCalendarColor = "16A085";
	}	
	else if(sEventCalendar === "Birthday")
	{
		sEventCalendarColor = "D35400";
	}
	else if(sEventCalendar === "Personal")
	{
		sEventCalendarColor = "D2527F";
	}
	else if(sEventCalendar === "Entertainment")
	{
		sEventCalendarColor = "3498DB";
	}
	else if(sEventCalendar === "Work")
	{
		sEventCalendarColor = "8E44AD";
	}

	return sEventCalendarColor;
}

function getDaysArray(iNumberOfDays)
{
	var sArrDays = [];

	for(var iDay = 1; iDay <= iNumberOfDays; iDay++)
	{
		var sDay = "";
		if(iDay > 9)
			sDay = iDay;
		else
			sDay = "0" + iDay;
		sArrDays.push(sDay);
	}

	return sArrDays;
}

function getTimeArray(sHourFormatCJG, sTimeSeparatorCJG)
{
	var sArrTimeCJG = [];
	var iMaxHour;

	if(sHourFormatCJG === "24-Hour")
		iMaxHour = 24;
	else if(sHourFormatCJG === "12-Hour")
		iMaxHour = 12;
	
	for(var iHour = 0; iHour < 24; iHour++)
	{
		var sTime1, sTime2;
	
		if(iHour < 10)
		{
			sTime1 = "0" + iHour + sTimeSeparatorCJG +  "00"; 
			sTime2 = "0" + iHour + sTimeSeparatorCJG +  "30";
		}
		else
		{
			sTime1 = iHour + sTimeSeparatorCJG + "00";
			sTime2 = iHour + sTimeSeparatorCJG + "30";
		}
	
		if(iMaxHour === 12)
		{
			if(iHour < 12)
			{
				sTime1 += " AM";
				sTime2 += " AM";
			}
			else
			{
				sTime1 += " PM";
				sTime2 += " PM";
			}
		}
	
		sArrTimeCJG.push(sTime1);
		sArrTimeCJG.push(sTime2);
	}

	return sArrTimeCJG;
}

sArrTimeCJG = getTimeArray("24-Hour", sTimeSeparatorCJG);

function getTimeString(sHourFormatCJG, sTimeSeparatorCJG, iHourValue, iMinuteValue)
{
	var sTimeString = "";

	if(sHourFormatCJG === "12-Hour")
	{
		if(iHourValue > 12)
			iHourValue -= 12;
	}

	if(iHourValue > 9)
		sTimeString = iHourValue + sTimeSeparatorCJG + iMinuteValue;
	else
		sTimeString = "0" + iHourValue + sTimeSeparatorCJG +  iMinuteValue;

	if(sHourFormatCJG === "12-Hour")
	{
		if(iHourValue < 12)
			sTimeString += " AM";
		else
			sTimeString += " PM";
	}

	return sTimeString;
}

function compareDates(dTempDate1, dTempDate2)
{
	dTempDate1 = new Date(dTempDate1.getFullYear(), dTempDate1.getMonth(), dTempDate1.getDate(), 0, 0, 0, 0);
	dTempDate2 = new Date(dTempDate2.getFullYear(), dTempDate2.getMonth(), dTempDate2.getDate(), 0, 0, 0, 0);
	var iDateDiff = Math.floor((dTempDate1.getTime() - dTempDate2.getTime())/iMS.d);	
	return (iDateDiff === 0) ? iDateDiff: (iDateDiff/Math.abs(iDateDiff));
}

function compareDateTimes(dTempDate1, dTempDate2)
{
	var iDateTimeDiff = (dTempDate1.getTime() - dTempDate2.getTime())/iMS.m;
	return (iDateTimeDiff === 0) ? iDateTimeDiff: (iDateTimeDiff/Math.abs(iDateTimeDiff));
}

var oEventsTemplate = 
[
	//--------------------------------- Birthdays ------------------------------------------------------

	{
		"type": "Birthday",
		"date": 15,
		"month": 0,
		"title": "Ted&apos;s Birthday",
		"tagIndex": 1
	},
	{
		"type": "Birthday",
		"date": 23,
		"month": 0,
		"title": "Remi&apos;s Birthday",
		"tagIndex": 2
	},
	{
		"type": "Birthday",
		"date": 2,
		"month": 1,
		"title": "Mili&apos;s Birthday",
		"tagIndex": 3
	},
	{
		"type": "Birthday",
		"date": 17,
		"month": 1,
		"title": "Alice&apos;s Birthday",
		"tagIndex": 4
	},
	{
		"type": "Birthday",
		"date": 12,
		"month": 2,
		"title": "Saara&apos;s Birthday",
		"tagIndex": 5
	},
	{
		"type": "Birthday",
		"date": 30,
		"month": 2,
		"title": "Jack&apos;s Birthday",
		"tagIndex": 6
	},
	{
		"type": "Birthday",
		"date": 7,
		"month": 3,
		"title": "Meet&apos;s Birthday",
		"tagIndex": 7
	},
	{
		"type": "Birthday",
		"date": 19,
		"month": 3,
		"title": "Stuart&apos;s Birthday",
		"tagIndex": 8
	},
	{
		"type": "Birthday",
		"date": 6,
		"month": 4,
		"title": "Ana&apos;s Birthday",
		"tagIndex": 9
	},
	{
		"type": "Birthday",
		"date": 25,
		"month": 4,
		"title": "Paulin&apos;s Birthday",
		"tagIndex": 10
	},
	{
		"type": "Birthday",
		"date": 8,
		"month": 5,
		"title": "Matt&apos;s Birthday",
		"tagIndex": 11
	},
	{
		"type": "Birthday",
		"date": 23,
		"month": 5,
		"title": "Purva&apos;s Birthday",
		"tagIndex": 12
	},
	{
		"type": "Birthday",
		"date": 6,
		"month": 6,
		"title": "Penny&apos;s Birthday",
		"tagIndex": 13
	},
	{
		"type": "Birthday",
		"date": 17,
		"month": 6,
		"title": "Sam&apos;s Birthday",
		"tagIndex": 14
	},
	{
		"type": "Birthday",
		"date": 2,
		"month": 7,
		"title": "Mac&apos;s Birthday",
		"tagIndex": 15
	},
	{
		"type": "Birthday",
		"date": 26,
		"month": 7,
		"title": "Sandra&apos;s Birthday",
		"tagIndex": 16
	},
	{
		"type": "Birthday",
		"date": 3,
		"month": 8,
		"title": "Nia&apos;s Birthday",
		"tagIndex": 17
	},
	{
		"type": "Birthday",
		"date": 13,
		"month": 8,
		"title": "Merlin&apos;s Birthday",
		"tagIndex": 18
	},
	{
		"type": "Birthday",
		"date": 31,
		"month": 9,
		"title": "Kelly&apos;s Birthday",
		"tagIndex": 19
	},
	{
		"type": "Birthday",
		"date": 14,
		"month": 9,
		"title": "Phil&apos;s Birthday",
		"tagIndex": 20
	},
	{
		"type": "Birthday",
		"date": 4,
		"month": 10,
		"title": "Dinky&apos;s Birthday",
		"tagIndex": 21
	},
	{
		"type": "Birthday",
		"date": 21,
		"month": 10,
		"title": "Gary&apos;s Birthday",
		"tagIndex": 22
	},
	{
		"type": "Birthday",
		"date": 7,
		"month": 11,
		"title": "Liley&apos;s Birthday",
		"tagIndex": 23
	},
	{
		"type": "Birthday",
		"date": 29,
		"month": 11,
		"title": "Diana&apos;s Birthday",
		"tagIndex": 24
	},
	
	//-------------------------------- Exercise -----------------------------------------

	{
		"type": "Cycling",
		"title": "Cycling",
		"day": ["Monday", "Wednesday", "Friday"],
		"startTime": 6,
		"endTime": 7,
		"tagIndex": 25
	},

	{
		"type": "Running",
		"title": "Running",
		"day": ["Tuesday", "Thursday"],
		"startTime": 6,
		"endTime": 7,
		"tagIndex": 26
	},

	{
		"type": "Swimming",
		"title": "Swimming",
		"day": ["Saturday"],
		"startTime": 6,
		"endTime": 7,
		"tagIndex": 25
	},

	{
		"type": "Gym",
		"title": "Gym",
		"day": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		"startTime": 12,
		"endTime": 13,
		"tagIndex": 25
	},

	{
		"type": "Hiking",
		"title": "Hiking",
		"day": ["Saturday"],
		"startTime": 17,
		"endTime": 15,
		"tagIndex": 26
	},

	{
		"type": "Movie",
		"title": "Movie",
		"day": ["Sunday"],
		"startTime": 18,
		"endTime": 20,
		"tagIndex": 25
	},

	{
		"type": "RegularMeeting",
		"title": "Meeting",
		"day": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
		"startTime": 11,
		"endTime": 12,
		"tagIndex": 26
	},

	{
		"type": "ClientCall",
		"title": "Client Call",
		"day": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
		"startTime": 14,
		"endTime": 15,
		"tagIndex": 26
	},

	{
		"type": "RegularDinner",
		"title": "Dinner",
		"day": ["Sunday"],
		"startTime": 21,
		"endTime": 22,
		"tagIndex": 26
	},

	//---------------------------------- Coffee --------------------------------------------

	{
		"type": "Coffee",
		"date": 3,
		"month": 0,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Victor",
		"people": ["Victor"],
		"tagIndex": 1
	},
	{
		"type": "Coffee",
		"date": 26,
		"month": 1,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Merlin",
		"people": ["Merlin"],
		"tagIndex": 3
	},
	{
		"type": "Coffee",
		"date": 16,
		"month": 2,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Kelvin",
		"people": ["Kelvin"],
		"tagIndex": 5
	},
	{
		"type": "Coffee",
		"date": 24,
		"month": 3,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Roger",
		"people": ["Roger"],
		"tagIndex": 7
	},
	{
		"type": "Coffee",
		"date": 9,
		"month": 4,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Agnes",
		"people": ["Agnes"],
		"tagIndex": 9
	},
	{
		"type": "Coffee",
		"date": 22,
		"month": 5,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Celine",
		"people": ["Celine"],
		"tagIndex": 11
	},
	{
		"type": "Coffee",
		"date": 9,
		"month": 6,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Dora",
		"people": ["Dora"],
		"tagIndex": 13
	},
	{
		"type": "Coffee",
		"date": 20,
		"month": 7,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Arnold",
		"people": ["Arnold"],
		"tagIndex": 15
	},
	{
		"type": "Coffee",
		"date": 16,
		"month": 8,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Edwin",
		"people": ["Edwin"],
		"tagIndex": 17
	},
	{
		"type": "Coffee",
		"date": 19,
		"month": 9,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Felicia",
		"people": ["Felicia"],
		"tagIndex": 19
	},
	{
		"type": "Coffee",
		"date": 14,
		"month": 10,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Jennifer",
		"people": ["Jennifer"],
		"tagIndex": 21
	},
	{
		"type": "Coffee",
		"date": 23,
		"month": 11,
		"startTime": 17,
		"endTime": 18,
		"title": "Coffee with Warren",
		"people": ["Warren"],
		"tagIndex": 23
	},

	//--------------------------------- Lunch ----------------------------------------

	{
		"type": "Lunch",
		"date": 27,
		"month": 0,
		"startTime": 12,
		"endTime": 13,
		"title": "Lunch with Victor",
		"people": ["Victor"],
		"tagIndex": 2
	},
	{
		"type": "Lunch",
		"date": 2,
		"month": 1,
		"startTime": 13,
		"endTime": 14,
		"title": "Lunch with Merlin",
		"people": ["Merlin"],
		"tagIndex": 4
	},
	{
		"type": "Lunch",
		"date": 5,
		"month": 2,
		"startTime": 12,
		"endTime": 13,
		"title": "Lunch with Kelvin",
		"people": ["Kelvin"],
		"tagIndex": 6
	},
	{
		"type": "Lunch",
		"date": 25,
		"month": 3,
		"startTime": 13,
		"endTime": 14,
		"title": "Lunch with Roger",
		"people": ["Roger"],
		"tagIndex": 8
	},
	{
		"type": "Lunch",
		"date": 23,
		"month": 4,
		"startTime": 12,
		"endTime": 13,
		"title": "Lunch with Agnes",
		"people": ["Agnes"],
		"tagIndex": 10
	},
	{
		"type": "Lunch",
		"date": 7,
		"month": 5,
		"startTime": 13,
		"endTime": 14,
		"title": "Lunch with Celine",
		"people": ["Celine"],
		"tagIndex": 12
	},
	{
		"type": "Lunch",
		"date": 21,
		"month": 6,
		"startTime": 12,
		"endTime": 13,
		"title": "Lunch with Dora",
		"people": ["Dora"],
		"tagIndex": 14
	},
	{
		"type": "Lunch",
		"date": 10,
		"month": 7,
		"startTime": 13,
		"endTime": 14,
		"title": "Lunch with Arnold",
		"people": ["Arnold"],
		"tagIndex": 16
	},
	{
		"type": "Lunch",
		"date": 20,
		"month": 8,
		"startTime": 12,
		"endTime": 13,
		"title": "Lunch with Edwin",
		"people": ["Edwin"],
		"tagIndex": 18
	},
	{
		"type": "Lunch",
		"date": 14,
		"month": 9,
		"startTime": 13,
		"endTime": 14,
		"title": "Lunch with Felicia",
		"people": ["Felicia"],
		"tagIndex": 20
	},
	{
		"type": "Lunch",
		"date": 17,
		"month": 10,
		"startTime": 12,
		"endTime": 13,
		"title": "Lunch with Jennifer",
		"people": ["Jennifer"],
		"tagIndex": 22
	},
	{
		"type": "Lunch",
		"date": 13,
		"month": 11,
		"startTime": 13,
		"endTime": 14,
		"title": "Lunch with Warren",
		"people": ["Warren"],
		"tagIndex": 24
	},

	//------------------------------ Dinner ---------------------------------------------

	{
		"type": "Dinner",
		"date": 15,
		"month": 0,
		"startTime": 21,
		"endTime": 22,
		"title": "Dinner with Kelvin",
		"people": ["Kelvin"],
		"tagIndex": 25
	},
	{
		"type": "Dinner",
		"date": 23,
		"month": 1,
		"startTime": 22,
		"endTime": 23,
		"title": "Dinner with Roger",
		"people": ["Roger"],
		"tagIndex": 25
	},
	{
		"type": "Dinner",
		"date": 21,
		"month": 2,
		"startTime": 21,
		"endTime": 22,
		"title": "Dinner with Victor",
		"people": ["Victor"],
		"tagIndex": 25
	},
	{
		"type": "Dinner",
		"date": 20,
		"month": 3,
		"startTime": 22,
		"endTime": 23,
		"title": "Dinner with Merlin",
		"people": ["Merlin"],
		"tagIndex": 25
	},
	{
		"type": "Dinner",
		"date": 2,
		"month": 4,
		"startTime": 21,
		"endTime": 22,
		"title": "Dinner with Dora",
		"people": ["Dora"],
		"tagIndex": 25
	},
	{
		"type": "Dinner",
		"date": 16,
		"month": 5,
		"startTime": 22,
		"endTime": 23,
		"title": "Dinner with Arnold",
		"people": ["Arnold"],
		"tagIndex": 25
	},
	{
		"type": "Dinner",
		"date": 26,
		"month": 6,
		"startTime": 21,
		"endTime": 22,
		"title": "Dinner with Agnes",
		"people": ["Agnes"],
		"tagIndex": 25
	},
	{
		"type": "Dinner",
		"date": 17,
		"month": 7,
		"startTime": 22,
		"endTime": 23,
		"title": "Dinner with Celine",
		"people": ["Celine"],
		"tagIndex": 25
	},
	{
		"type": "Dinner",
		"date": 12,
		"month": 8,
		"startTime": 21,
		"endTime": 22,
		"title": "Dinner with Jennifer",
		"people": ["Jennifer"],
		"tagIndex": 25
	},
	{
		"type": "Dinner",
		"date": 14,
		"month": 9,
		"startTime": 22,
		"endTime": 23,
		"title": "Dinner with Matt",
		"people": ["Warren"],
		"tagIndex": 25
	},
	{
		"type": "Dinner",
		"date": 3,
		"month": 10,
		"startTime": 21,
		"endTime": 22,
		"title": "Dinner with Edwin",
		"people": ["Edwin"],
		"tagIndex": 25
	},
	{
		"type": "Dinner",
		"date": 18,
		"month": 11,
		"startTime": 22,
		"endTime": 23,
		"title": "Dinner with Felicia",
		"people": ["Felicia"],
		"tagIndex": 25
	},

	//------------------------------ Meeting with Colleagues ------------------------------------------

	{
		"type": "Meeting",
		"date": 31,
		"month": 0,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 28,
		"month": 1,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 31,
		"month": 2,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora", "Edwin"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 30,
		"month": 3,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora", "Victor"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 31,
		"month": 4,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora", "Edwin"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 30,
		"month": 5,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora", "Victor"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 31,
		"month": 6,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora", "Edwin"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 31,
		"month": 7,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora", "Victor"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 30,
		"month": 8,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora", "Edwin"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 31,
		"month": 9,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora", "Victor"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 30,
		"month": 10,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora", "Edwin"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 31,
		"month": 11,
		"startTime": 10,
		"endTime": 12,
		"title": "Meeting with Colleagues",
		"people": ["Merlin", "Agnes", "Dora", "Victor"],
		"tagIndex": 26
	},
	
	//------------------------------- Meeting ---------------------------------------

	{
		"type": "Meeting",
		"date": 5,
		"month": 0,
		"startTime": 17,
		"endTime": 18,
		"title": "Meeting with Sam",
		"people": ["Sam"],
		"tagIndex": 26
	},	
	{
		"type": "Meeting",
		"date": 6,
		"month": 1,
		"startTime": 17,
		"endTime": 18,
		"title": "Meeting with Kelvin",
		"people": ["Kelvin"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 7,
		"month": 3,
		"startTime": 17,
		"endTime": 18,
		"title": "Meeting with Matt",
		"people": ["Matt"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 8,
		"month": 4,
		"startTime": 17,
		"endTime": 18,
		"title": "Meeting with Sandra",
		"people": ["Sandra"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 9,
		"month": 5,
		"startTime": 17,
		"endTime": 18,
		"title": "Meeting with Celine",
		"people": ["Celine"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 11,
		"month": 6,
		"startTime": 17,
		"endTime": 18,
		"title": "Meeting with Donna",
		"people": ["Donna"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 12,
		"month": 7,
		"startTime": 17,
		"endTime": 18,
		"title": "Meeting with Arnold",
		"people": ["Arnold"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 13,
		"month": 8,
		"startTime": 17,
		"endTime": 18,
		"title": "Meeting with Richard",
		"people": ["Richard"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 14,
		"month": 9,
		"startTime": 17,
		"endTime": 18,
		"title": "Meeting with Ana",
		"people": ["Ana"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 15,
		"month": 10,
		"startTime": 17,
		"endTime": 18,
		"title": "Meeting with Jennifer",
		"people": ["Jennifer"],
		"tagIndex": 26
	},
	{
		"type": "Meeting",
		"date": 14,
		"month": 11,
		"startTime": 17,
		"endTime": 18,
		"title": "Meeting with Scott",
		"people": ["Scott"],
		"tagIndex": 26
	}

	//---------------------------------------------------------------------------------------
];

function generateJsonEvents(dFromDate, dToDate)
{	
	var iMaxIdentifier = 0,
	iEventsIndex = 1,
	oArrJson = [],
	sStatus = "";

	iTimeDiff = dToDate.getTime() - dFromDate.getTime(),
	iNumOfDays = Math.floor(iTimeDiff / iMS.d) + 1,
	iFromDate = dFromDate.getDate(),
	iFromMonth = dFromDate.getMonth(),
	iFromYear = dFromDate.getFullYear(),
	iToDate = dToDate.getDate(),
	iToMonth = dToDate.getMonth(),
	iToYear = dToDate.getFullYear(),

	iEventCount = 0,

	iArrMonths = [];

	if(iFromYear === iToYear && iFromMonth === iToMonth)
	{
		iArrMonths.push([iFromMonth, iFromYear]);
	}
	else
	{
		for(var iYearIndex = iFromYear; iYearIndex <= iToYear; iYearIndex++)
		{
			var iNumOfMonths, iStartMonth, iEndMonth;
			if(iFromYear === iToYear)
			{
				iNumOfMonths = iToMonth - iFromMonth;
				iStartMonth = iFromMonth;
				iEndMonth = iToMonth;
			}
			else if(iYearIndex === iFromYear)
			{
				iNumOfMonths = 12 - iFromMonth;
				iStartMonth = iFromMonth;
				iEndMonth = 11;
			}
			else if(iYearIndex === iToYear)
			{
				iNumOfMonths = iToMonth;
				iStartMonth = 0;
				iEndMonth = iToMonth;
			}
			else
			{
				iNumOfMonths = 12;
				iStartMonth = 0;
				iEndMonth = 11;
			}

			for(var iMonthIndex = iStartMonth; iMonthIndex <= iEndMonth; iMonthIndex++)
			{
				iArrMonths.push([iMonthIndex, iYearIndex]);
			}
		}
	}

	var sIdentifier = iMaxIdentifier + iEventsIndex;
	var iTempIndex, iTempIndex1, iTempIndex2,
	dStartDateTime, dEndDateTime,
	thisObject, sDesc;
	for(iTempIndex = 0; iTempIndex < oEventsTemplate.length; iTempIndex++)
	{
		var oEvent = oEventsTemplate[iTempIndex],
		bWeeklyEvents = (oEvent.type === "Swimming" || 
		oEvent.type === "Running" || 
		oEvent.type === "Cycling" || 
		oEvent.type === "Movie" || 
		oEvent.type === "Hiking" || 
		oEvent.type === "Gym" || 
		oEvent.type === "RegularMeeting" || 
		oEvent.type === "ClientCall" || 
		oEvent.type === "RegularDinner"
		
		);

		if(bWeeklyEvents)
		{
			var dTempDate = new Date(dFromDate),
			iTempDate = dTempDate.getTime();
			iEventCount = 0;
			for(iTempIndex1 = 0; iTempIndex1 < iNumOfDays; iTempIndex1++)
			{
				var sTempDay = sArrDayNameFull[dTempDate.getDay()],
				oArrDays = oEvent.day;
			
				for(iTempIndex2 = 0; iTempIndex2 < oArrDays.length; iTempIndex2++)
				{
					iEventCount++;

					var sDay = oArrDays[iTempIndex2],
					bMovie = (oEvent.type === "Movie") ? true : false,
					bValidate = bMovie ? (sDay === sTempDay && dTempDate.getDate() >= 21 && dTempDate.getDate() <= 31) : (sDay === sTempDay);
				
					if(bShowMore || oEvent.type === "Cycling" || ((oEvent.type === "RegularMeeting" || oEvent.type === "ClientCall") && dTempDate.getMonth() === 9 && dTempDate.getDate() === 14) || iEventCount % 4 === 0) //Comment To See More Events
					{ 
						if(bValidate)
						{
							dStartDateTime = new Date(dTempDate);
							dStartDateTime.setHours(oEvent.startTime);
							dStartDateTime.setMinutes(0);
							dStartDateTime.setSeconds(0);

							dEndDateTime = new Date(dTempDate);
							if(oEvent.type === "Hiking")
							{
								dEndDateTime.setHours(oEvent.startTime + 92);
								dEndDateTime.setMinutes(0);
							}
							else if(oEvent.type === "Gym")
							{
								dStartDateTime.setMinutes(30);

								dEndDateTime.setHours(oEvent.endTime);
								dEndDateTime.setMinutes(30);
							}
							else
							{
								if(oEvent.type === "Running")
								{
									dEndDateTime.setHours(oEvent.startTime);
									dEndDateTime.setMinutes(30);
								}
								else
								{
									dEndDateTime.setHours(oEvent.endTime);
									dEndDateTime.setMinutes(0);
								}
							}
							dEndDateTime.setSeconds(0);

							sDesc = oEvent.title + " is of type " + oEvent.type;
						
							var thisObject = new CalEvent(sIdentifier, false, dStartDateTime.getTime(), dEndDateTime.getTime(), oEvent.type, oEvent.title, sDesc, sURLCJG);
						
							if(oEvent.type === "Swimming" || oEvent.type === "Running" || oEvent.type === "Cycling" || oEvent.type === "Gym")
							{
								thisObject.calendarId = "Fitness";
							}
							else if(oEvent.type === "Movie" || oEvent.type === "Hiking")
							{
								thisObject.calendarId = "Entertainment";
							}
							else if(oEvent.type === "RegularMeeting" || oEvent.type === "ClientCall")
							{	
								thisObject.calendarId = "Work";
							}
							else if(oEvent.type === "RegularDinner")
							{
								thisObject.calendarId = "Personal";
							}

							//CapeHoney AliceBlue Madang
							if(oEvent.type === "Running")
							{
								if(sDay === "Tuesday")
									thisObject.droppableId = "Madang";
							}
							else if(oEvent.type === "Cycling")
							{
								if(sDay === "Friday")
									thisObject.droppableId = "AliceBlue,Madang";
							}
							else if(oEvent.type === "Movie")
							{
								thisObject.droppableId = "CapeHoney,AliceBlue";
							}

							var sIconName = "cs-icon-" + oEvent.type;
							if(oEvent.type === "RegularMeeting")
								sIconName = ""; // "cs-icon-Meeting";
							else if(oEvent.type === "ClientCall")
								sIconName = "cs-icon-Call";
							else if(oEvent.type === "RegularDinner")
								sIconName = "cs-icon-Dinner";
						
							//thisObject.backgroundColor = getEventCalendarColors(thisObject.calendarId);
							thisObject.singleColor = getEventCalendarColors(thisObject.calendarId);
							thisObject.title = oEvent.title;
							thisObject.tag = "Personal";
							thisObject.icon = sIconName;
							thisObject.tagIndex = oEvent.tagIndex;

							if(oEvent.type === "Swimming")
							{
								thisObject.isResizeInDetailView = false;
								thisObject.isDragNDropInDetailView = false;
							}

							if(dStartDateTime.getMonth() !== 7)
							{
								if(iEventCount % 3 === 0)
									thisObject.status = "Overdue";
								else if(iEventCount % 3 === 1)
									thisObject.status = "Completed";
								else if(iEventCount % 3 === 2)
									thisObject.status = "InProgress";
							}

							sStatus += thisObject.status + " ";
							
							//if(oEvent.type === "Hiking")
							//	thisObject.isMarked = true;

							//thisObject.backgroundColor = "FF66FF";
							//thisObject["location"] = "Mumbai";
							//thisObject["popovertitle"] = "this popover title";
							//thisObject["popovercontent"] = "this popover content";
							//if(compareDateTimes(dToDate, dEndDateTime) >= 0 && (compareDateTimes(dStartDateTime, dToday) <= 0 && compareDateTimes(dEndDateTime, dToday) >= 0))
							if(compareDateTimes(dToDate, dEndDateTime) >= 0)
							{	
								oArrJson.push(thisObject);
							}
						
							sIdentifier++;
						}
					}
				}
			
				iTempDate += iMS.d;
				dTempDate = new Date(iTempDate);
			}
		}
		else
		{
			for(iTempIndex1 = 0; iTempIndex1 < iArrMonths.length; iTempIndex1++)
			{
				var iMonthYear = iArrMonths[iTempIndex1];
			
				var bValidate1 = (iMonthYear[0] === iFromMonth) && (iFromMonth === oEvent.month && iFromDate < oEvent.date);
				var bValidate2 = (iMonthYear[0] !== iFromMonth && iMonthYear[0] !== iToMonth);
				var bValidate3 = (iMonthYear[0] === iToMonth) && (iToMonth === oEvent.month && iToDate > oEvent.date);
			
				if(bValidate1 || bValidate2 || bValidate3)
				{
					if(iMonthYear[0] === oEvent.month)
					{
						if(oEvent.type === "Birthday")
						{
							dStartDateTime = new Date(iMonthYear[1], iMonthYear[0], oEvent.date, 0, 0, 0, 0);
							dEndDateTime = new Date(iMonthYear[1], iMonthYear[0], oEvent.date + 1, 0, 0, 0, 0);
						}
						else
						{
							dStartDateTime = new Date(iMonthYear[1], iMonthYear[0], oEvent.date, oEvent.startTime, 0, 0, 0);
							dEndDateTime = new Date(iMonthYear[1], iMonthYear[0], oEvent.date, oEvent.endTime, 0, 0, 0);
						}
					
						var sEventTitle = oEvent.title;
						sDesc = oEvent.title + " is of type " + oEvent.type;
					
						thisObject = new CalEvent(sIdentifier, false, dStartDateTime, dEndDateTime, oEvent.type, sEventTitle, sDesc, sURLCJG);
						thisObject.icon = "cs-icon-" + oEvent.type;
					
						if(oEvent.type !== "Birthday")
						{
							if(oEvent.type === "Dinner" || oEvent.type === "Lunch")
							{
								thisObject.calendarId = "Personal";
								thisObject.tag = "Personal";
							}
							else
							{
								thisObject.calendarId = "Work";
								thisObject.tag = "Work";
							}
							thisObject.people = oEvent.people || [];
						}
						else
						{
							thisObject.calendarId = "Birthday";
							thisObject.tag = "Personal";
							thisObject.isAllDay = true;
							thisObject.isMarked = true;
							thisObject.icon = null;
						}

						//thisObject.icon = null;
						//thisObject.isAllDay = true;

						if(oEvent.type === "Birthday")
						{
							var sBaseColor = getEventCalendarColors(thisObject.calendarId);
							//thisObject.backgroundColor = sBaseColor;
							//thisObject.textColor = "FFFFFF";
							
							thisObject.singleColor = getEventCalendarColors(thisObject.calendarId);
						}
						else
						{
							thisObject.singleColor = getEventCalendarColors(thisObject.calendarId);
							//thisObject.backgroundColor = getEventCalendarColors(thisObject.calendarId);
						}
					
						thisObject.tagIndex = oEvent.tagIndex;
					
						if(dStartDateTime.getMonth() !== 7)
						{
							if(iTempIndex % 3 === 0)
								thisObject.status = "Overdue";
							else if(iTempIndex % 3 === 1)
								thisObject.status = "Completed";
							else if(iTempIndex % 3 === 2)
								thisObject.status = "InProgress";
						}

						sStatus += thisObject.status + " ";
					
						if(oEvent.type !== "Dinner" || (oEvent.type === "Dinner" && dStartDateTime.getDay() !== 0))
						{
							oArrJson.push(thisObject);
							sIdentifier++;
						}
					}
				}
			}
		}

		//console.log("Status : ");
		//console.log(sStatus);
	}

	//---------------------- All Day Event --------------------------

	/*
	var dStartDateTime = new Date();
	dStartDateTime.setHours(0);
	dStartDateTime.setMinutes(0);
	dStartDateTime.setSeconds(0);
	var dEndDateTime = new Date();
	dEndDateTime.setHours(0);
	dEndDateTime.setMinutes(0);
	dEndDateTime.setSeconds(0);

	var thisObject = new CalEvent(sIdentifier, true, dStartDateTime.getTime(), null, "Movie", "MyMovie", "", "");
	thisObject.title = "My Movie";
	thisObject.tag = "Personal";
	thisObject.icon = "cs-icon-" + oEvent.type;
	oArrJson.push(thisObject);
	*/

	//---------------------- All Day Event --------------------------

	//console.log("oArrJson");
	//console.log(oArrJson);

	var sJsonStr = JSON.stringify(oArrJson);
	return [true, oArrJson];
}

function getEventCalendarList(dFromDate, dToDate)
{
	var oArrEventCalendars = [];

	for(var iTempIndex = 0; iTempIndex < sArrEventCalendarCJG.length; iTempIndex++)
	{
		var sEventCalendar = sArrEventCalendarCJG[iTempIndex];
	
		var oTempCalendar = {};
		oTempCalendar.calendarId = sEventCalendar;
		oTempCalendar.calendar = sEventCalendar;
		oTempCalendar.icon = "cs-icon-" + sEventCalendar;
		oTempCalendar.backgroundColor = getEventCalendarColors(sEventCalendar);
		oTempCalendar.displayStatus = "show";
		oTempCalendar.isSelected = true;
		oArrEventCalendars.push(oTempCalendar);
	}

	var sJsonStr = JSON.stringify(oArrEventCalendars);
	return [true, sJsonStr];
}

function getJsonEventCount(dFromDate, dToDate)
{
	var oArrEventJson = generateJsonEvents(dFromDate, dToDate),
	oArrEvents = oArrEventJson[1],
	oJsonCount = [];
	
	var dTempDate = new Date(dFromDate);
	if(typeof oArrEventJson[1] === "string")
		oArrEventJson = JSON.parse(oArrEventJson[1]);
	while(compareDateTimes(dTempDate, dToDate) <= 0)
	{
		var iDateEventCount = 0;
		for(var iTempIndex = 0; iTempIndex < oArrEventJson.length; iTempIndex++)
		{
			var oEvent = oArrEventJson[iTempIndex],
			dEventStartDate = new Date(oEvent.start),
			dEventEndDate = new Date(oEvent.end),

			iCompStartDate = compareDates(dTempDate, dEventStartDate),
			iCompEndDate = compareDates(dTempDate, dEventEndDate),

			bGTStartDate = (iCompStartDate >= 0),
			bLTEndDate = (iCompEndDate <= 0);

			if(bGTStartDate && bLTEndDate)
				iDateEventCount++;
		}
	
		var oTempCount = {};
		oTempCount.date = new Date(dTempDate);
		oTempCount.count = iDateEventCount;
		oJsonCount.push(oTempCount);
	
		dTempDate = new Date(dTempDate.getTime() + iMS.d);
	}

	var sJsonStr = JSON.stringify(oJsonCount);
	return [true, sJsonStr];
}

function getJsonTimeSlotCount(dFromDate, dToDate, bIsFree)
{
	var oArrTimeSlotJson = generateJsonSlotAvailability(dFromDate, dToDate),
	oArrTimeSlotJson = oArrTimeSlotJson[1],
	oJsonCount = [];

	var dTempDate = new Date(dFromDate);
	if(typeof oArrTimeSlotJson === "string")
		oArrTimeSlotJson = JSON.parse(oArrTimeSlotJson);
	while(compareDateTimes(dTempDate, dToDate) <= 0)
	{
		var iDateTimeSlotCount = 0;
		for(var iTempIndex = 0; iTempIndex < oArrTimeSlotJson.length; iTempIndex++)
		{
			var oTimeSlot = oArrTimeSlotJson[iTempIndex],
			dSlotStartDate = new Date(oTimeSlot.start),
			dSlotEndDate = new Date(oTimeSlot.end),

			iCompStartDate = compareDates(dTempDate, dSlotStartDate),
			iCompEndDate = compareDates(dTempDate, dSlotEndDate),

			bGTStartDate = (iCompStartDate >= 0),
			bLTEndDate = (iCompEndDate <= 0);

			if(bGTStartDate && bLTEndDate && (bIsFree === (oTimeSlot.status === "Free")))
			{
				iDateTimeSlotCount++;
			}
		}
	
		var oTempCount = {};
		oTempCount.date = new Date(dTempDate);
		oTempCount.count = iDateTimeSlotCount;
		oJsonCount.push(oTempCount);
	
		dTempDate = new Date(dTempDate.getTime() + iMS.d);
	}

	var sJsonStr = JSON.stringify(oJsonCount);
	return [true, sJsonStr];
}

/*	---------------------------- Event Json Generation End --------------------------------- */

/*	----------------------- Available Time Json Generation Start -------------------------- */

function TimeString(dStartTime, dEndTime)
{
	this.startTime = dStartTime;
	this.endTime = dEndTime;
}

TimeString.prototype = 
{
	constructor : TimeString	
};

function RestrictedSection(dStartDateTime, dEndDateTime, sBGColor, bIsDroppable, sDroppableId, sArrAllowedDroppables)
{
	this.start = dStartDateTime;
	this.end = dEndDateTime;
	if(sBGColor !== null)
		this.backgroundColor = sBGColor;
	if(bIsDroppable !== null)
		this.isDroppable = bIsDroppable;
	if(sDroppableId !== null)
		this.droppableId = sDroppableId;
	if(sArrAllowedDroppables !== null)
		this.allowedDroppables = sArrAllowedDroppables;
}

RestrictedSection.prototype = 
{
	constructor : RestrictedSection
};

function BusinessHoursArray(sDayName, dArrTime)
{
	this.dayName = sDayName;
	this.times = dArrTime;
}

BusinessHoursArray.prototype = 
{
	constructor : BusinessHoursArray
};

function generateJsonBusinessHours()
{
	var oArrBusinessHours = [];
	var oArrTimes, sDayName;

	for(var iDayIndex = 0; iDayIndex < 7; iDayIndex++)
	{
		sDayName = sArrDayNameFull[iDayIndex];
	
		oArrTimes = [];
		oArrTimes.push(new TimeString("10:00", "15:00"));
		if(iDayIndex % 2 === 0)
			oArrTimes.push(new TimeString("17:00", "19:00"));
	
		oArrBusinessHours.push(new BusinessHoursArray(sDayName, oArrTimes));
	}
	
	var sJsonStr = JSON.stringify(oArrBusinessHours);
	return sJsonStr;
}

function generateJsonRestrictedSection(dFromDate, dToDate)
{
	var dArrResSec = [],

	iNumOfDays = Math.floor((dToDate.getTime() - dFromDate.getTime()) / iMS.d),
	iNumOfResSec = Math.round(iNumOfDays / 2),

	dWkDate = new Date(dFromDate),
	sArrDates = [],
	bTwoEvents = false;

	for(var iWkDay = 0; iWkDay < iNumOfDays; iWkDay++)
	{
		sArrDates.push(dWkDate);
	
		var iWkDateMS = dWkDate.getTime(),
		iNewWkDateMS = iWkDateMS + iMS.d;
		dWkDate = new Date(iNewWkDateMS);
	}

	//console.log("dArrResSec");

	for(var iDayIndex = 0; iDayIndex < iNumOfResSec; iDayIndex++)
	{
		var iDateIndex = Math.floor(Math.random() * (sArrDates.length - 1)),
		dStartDate = sArrDates[iDateIndex],
		dEndDate = new Date(dStartDate),
		sBGColor = null, bIsDroppable = null, 
		sDroppableId = null, sArrAllowedDroppables = null,
		iDuration, iStartDateMS, iEndDateMS;
	
		iStartTimeIndex = Math.floor((Math.random() * (sArrTimeCJG.length - 11))),
		sStartTime = sArrTimeCJG[iStartTimeIndex],
		sTimeComponents = [];

		if(iDayIndex % 6 === 0)
		{
			dStartDate.setHours(7);
			dStartDate.setMinutes(0);
			dStartDate.setSeconds(0);

			iEndDateMS = dStartDate.getTime() + (3 * iMS.h);
			dEndDate = new Date(iEndDateMS);

			bTwoEvents = true;

			sBGColor = "FDE3A7"; bIsDroppable = true; 
			sDroppableId = "CapeHoney"; sArrAllowedDroppables = ["CapeHoney", "AliceBlue"];
		}
		else if(iDayIndex % 5 === 0)
		{
			dStartDate.setHours(0);
			dStartDate.setMinutes(0);
			dStartDate.setSeconds(0);

			iEndDateMS = dStartDate.getTime() + iMS.d;
			dEndDate = new Date(iEndDateMS);

			sBGColor = "E4F1FE"; bIsDroppable = true; 
			sDroppableId = "AliceBlue"; sArrAllowedDroppables = ["AliceBlue"];
		}
		else if(iDayIndex % 3 === 0)
		{
			dStartDate.setHours(10);
			dStartDate.setMinutes(0);
			dStartDate.setSeconds(0);

			iEndDateMS = dStartDate.getTime() + iMS.d;
			dEndDate = new Date(iEndDateMS);

			sBGColor = "C8F7C5"; bIsDroppable = true; 
			sDroppableId = "Madang"; sArrAllowedDroppables = ["All"];
		}
		else if(iDayIndex % 2 === 0)
		{
			dStartDate.setHours(7);
			dStartDate.setMinutes(0);
			dStartDate.setSeconds(0);

			iEndDateMS = dStartDate.getTime() + 3 * iMS.d;
			dEndDate = new Date(iEndDateMS);
		}
		else
		{
			if(sHourFormatCJG === "24-Hour")
			{
				sTimeComponents = sStartTime.split(':');
				dStartDate.setHours(parseInt(sTimeComponents[0]));
				dStartDate.setMinutes(parseInt(sTimeComponents[1]));
			}
			else if(sHourFormatCJG === "12-Hour")
			{
				var sTimeStringComponents = sStartTime.split(' '),
				sTimeStr = sTimeStringComponents[0],
				sSuffixStr = sTimeStringComponents[1];
			
				sTimeComponents = sTimeStr.split(':');
				var iHourValue = parseInt(sTimeComponents[0]),
				iMinuteValue = parseInt(sTimeComponents[1]);
			
				if(sSuffixStr === "AM" && iHourValue === 12)
					iHourValue = 0;
				else if(sSuffixStr === "PM" && iHourValue < 12)
					iHourValue += 12;
			
				dStartDate.setHours(iHourValue);
				dStartDate.setMinutes(iMinuteValue);
			}

			iDuration = iUnitTimeIntervalCJG * Math.floor(Math.random() * 4);
			iStartDateMS = dStartDate.getTime();
			iEndDateMS = iStartDateMS + (iUnitTimeIntervalCJG * iMS.m * 4);
			dEndDate = new Date(iEndDateMS);
		}

		dArrResSec.push(
			new RestrictedSection(
					new Date(dStartDate), 
					new Date(dEndDate), 
					sBGColor, 
					bIsDroppable, 
					sDroppableId, 
					sArrAllowedDroppables 
				)
		);

		if(bTwoEvents)
		{
			sBGColor = null; bIsDroppable = null; 
			sDroppableId = null; sArrAllowedDroppables = null;

			dStartDate.setHours(15);
			dStartDate.setMinutes(0);
			dStartDate.setSeconds(0);

			iEndDateMS = dStartDate.getTime() + (3 * iMS.h);
			dEndDate = new Date(iEndDateMS);

			dArrResSec.push(
				new RestrictedSection(
						new Date(dStartDate), 
						new Date(dEndDate),
						sBGColor, 
						bIsDroppable, 
						sDroppableId, 
						sArrAllowedDroppables
					)
			);
			bTwoEvents = false;
		}
	}
	var sJsonStr = JSON.stringify(dArrResSec);
	return [true, sJsonStr];
}

/*	----------------------- Available Time Json Generation End -------------------------- */

function generateJsonSlotAvailability(dFromDate, dToDate)
{
	var iThisDate = dToday.getTime(),
	dNextDay1 = new Date(iThisDate + iMS.d),
	dNextDay2 = new Date(iThisDate + (2 * iMS.d)),

	oArrJson = [],

	sArrStatus = ["Free", "Busy"],
	iArrCount = [0, 1, 2, 3, 4, 5],
	iNumOfDays = Math.floor((dToDate.getTime() - dFromDate.getTime()) / iMS.d) + 1,
	dThisDate = new Date(dFromDate),
	iCounter = 0;

	for(var iTempIndex = 0; iTempIndex < iNumOfDays; iTempIndex++)
	{
		var iTimeSlotDuration = iArrTimeDurations.random(iArrTimeDurations.length),
	
		iThisDateDay = dThisDate.getDate(),
		iThisDateMonth = dThisDate.getMonth(),
		iThisDateYear = dThisDate.getFullYear(),
	
		iStartHour = 8,
		iEndHour = 22,
	
		iThisHour = iStartHour,
		dTempDate = new Date(iThisDateYear, iThisDateMonth, iThisDateDay, iThisHour, 0, 0, 0),
		iTempCount = (iEndHour - iStartHour) * (60 / iTimeSlotDuration);
	
		for(var iTempIndex1 = 0; iTempIndex1 < iTempCount; iTempIndex1++)
		{
			iCounter++;

			var dStartDate = new Date(dTempDate),
			iStartDateMS = dStartDate.getTime(),
			iEndDateMS = iStartDateMS + (iTimeSlotDuration * iMS.m) - iMS.m,
			dEndDate = new Date(iEndDateMS),
		
			sStartTimeString = getTimeString(sHourFormatCJG, sTimeSeparatorCJG, dStartDate.getHours(), dStartDate.getMinutes()),
			sEndTimeString = getTimeString(sHourFormatCJG, sTimeSeparatorCJG, dEndDate.getHours(), dEndDate.getMinutes()),
		
			sStartDateTime = dStartDate.getDate() + sDateSeparatorCJG + dStartDate.getMonth() + sDateSeparatorCJG + dStartDate.getFullYear() + sDateTimeSeparatorCJG + sStartTimeString,
			sEndDateTime = dEndDate.getDate() + sDateSeparatorCJG + dEndDate.getMonth() + sDateSeparatorCJG + dEndDate.getFullYear() + sDateTimeSeparatorCJG + sEndTimeString;
		
			var oJson = {};
			oJson.start = dStartDate; // dStartDate (ISO) || sStartDateTime (String)
			oJson.end = dEndDate; // dEndDate(ISO) || sEndDateTime (String)
			if(iCounter % 4 === 0)
			{
				oJson.count = iArrCount.random(iArrCount.length);
				if(oJson.count === 0)
					oJson.status = "Busy";
				else
					oJson.status = "Free";
			}
			else
				oJson.status = sArrStatus.random(sArrStatus.length);
			oArrJson.push(oJson);
		
			dTempDate = new Date(iEndDateMS + iMS.m);
		}
	
		iThisDate = dThisDate.getTime() + iMS.d;
		dThisDate = new Date(iThisDate);
	}
	
	var sJsonStr = JSON.stringify(oArrJson);
	return [true, sJsonStr];
}

/* -------------------------  EventList Related Functions Start --------------------------- */

function displayEventsInList(oCS, dTempViewStartDate, dTempViewEndDate)
{
	var iEventId = 0, iEventCount = 0;
	var oArrViewDetails = new Array();

	if(oCS.compareDates(dTempViewStartDate, dTempViewEndDate) == 0)
	{
		var oViewDetails = new Object();
		oViewDetails.date = new Date(dTempViewStartDate);
		var dTempVSDate = oCS.setDateInFormat({"date": dTempViewStartDate}, "START"),
		dTempVEDate = oCS.setDateInFormat({"date": dTempViewStartDate}, "END");
		oViewDetails.events = oCS.getArrayOfEventsForView(dTempVSDate, dTempVEDate);		
		oArrViewDetails.push(oViewDetails);
		iEventCount += oViewDetails.events.length;
	}
	else
	{
		var dTempDate = new Date(dTempViewStartDate);
		while(oCS.compareDates(dTempDate, dTempViewEndDate) != 0)
		{
			var oViewDetails = new Object();
			oViewDetails.date = new Date(dTempDate);
			var dTempVSDate = oCS.setDateInFormat({"date": dTempDate}, "START"),
			dTempVEDate = oCS.setDateInFormat({"date": dTempDate}, "END");
			oViewDetails.events = oCS.getArrayOfEventsForView(dTempVSDate, dTempVEDate);
			oArrViewDetails.push(oViewDetails);
			iEventCount += oViewDetails.events.length;

			dTempDate.setDate(dTempDate.getDate() + 1);			
		}
	}

	var sTempStr = "";

	sTempStr += "<table class='cListTable'>";

	sTempStr += "<tbody>";

	if(iEventCount > 0)
	{
		for(var iTempIndex = 0; iTempIndex < oArrViewDetails.length; iTempIndex++)
		{
			var oViewDetails = oArrViewDetails[iTempIndex],
			dThisDate = oViewDetails.date,
			oArrTempEvents = oViewDetails.events,
			iColspan = oCS.setting.hideEventIcon[oCS.setting.visibleView] ? 3 : 4;

			if(oArrViewDetails.length > 1)
			{
				var sFullDate = oCS.getDateInFormat({"date": dThisDate}, "DDD MMM dd, yyyy", false, true);
				var sDateId = "Date-" +  sFullDate;			
				sTempStr += "<tr><td colspan='"+iColspan+"'><div id='" + sDateId + "' class='cListDate'>" + sFullDate + "</div></td></tr>";
			}

			if(oArrTempEvents.length > 0)
			{
				for(var iEventIndex = 0; iEventIndex < oArrTempEvents.length; iEventIndex++)
				{
					var oEvent = oArrTempEvents[iEventIndex],
				
					dStartDateTime = null, dEndDateTime = null,
					bIsAllDay = 0, sTitle = "", sURL = "", sEventColor = "", sDesc = "",
					bIsMarked = false;
				
					if(oEvent.start != null)
						dStartDateTime = oEvent.start;
				
					if(oEvent.end != null)
						dEndDateTime = oEvent.end;
				
					if(oEvent.isAllDay != null)
						bIsAllDay = oEvent.isAllDay;
				
					if(oEvent.title != null)
						sTitle = oEvent.title;

					if(oEvent.desc !== null)
						sDesc = oEvent.desc;
				
					if(oEvent.url != null)
						sURL = oEvent.url;

					if(oEvent.isMarked !== null)
						bIsMarked = oEvent.isMarked;

					if(bIsMarked)
						bIsAllDay = true;
				
					var sArrEventDateTime = oCS.getEventDateTimeDataForAgendaView(dStartDateTime, dEndDateTime, bIsAllDay, dThisDate, "cListEventTime"),
					sEventDateTime = sArrEventDateTime[0];
					if(sEventDateTime === "")
						sEventDateTime = "All Day";

					sEventColor = oEvent.fromSingleColor ? oEvent.textColor : oEvent.backgroundColor;
					sEventColor = ($.cf.compareStrings(sEventColor, "") || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;
					var sId = "Event" + (++iEventId),
					sStyleColorHeight = sArrEventDateTime[1],
					sIcon, sEventIconStyle,
					sEventClass = "cListEvent",
					sFontIconClass;

					if(bIsMarked)
					{
						sEventClass += " cMarkedDayEvent";
						sIcon = ($.cf.isValid(oEvent.icon) && oEvent.icon !== "Dot") ? oEvent.icon : "cs-icon-Mark";
						sEventIconStyle = "background: " + sEventColor + ";";

						sFontIconClass = "cListEventIconFont " + sIcon;
					}
					else
					{
						sIcon = $.cf.isValid(oEvent.icon) ? oEvent.icon : oCS.setting.eventIcon;
						sEventIconStyle = "background: " + sEventColor + "; ";

						if($.cf.compareStrings(sIcon, "Dot"))
							sFontIconClass = "cListEventIconDot";
						else
							sFontIconClass = "cListEventIconFont " + sIcon;
					}

					if($.cf.compareStrings(oCS.setting.visibleView, "DayEventListView") && $.cf.isValid(oEvent.status))
					{
						if($.cf.compareStrings(sIcon, "Dot"))
							sFontIconClass += " cListEventIconDotStatus";
						else
							sFontIconClass += " cListEventIconFontStatus";

						sEventIconStyle += "border-color: " + oEvent.statusColor + ";";
					}
				
					sTempStr += "<tr id='" + sId + "' class='" + sEventClass + "'>";
					sTempStr += "<td class='cListEventColor'><span style='background:" + sEventColor + "; height:" + sStyleColorHeight + ";'></span></td>";
					sTempStr += "<td class='cListEventTime'>" + sEventDateTime + "</td>";
					
					if(bIsMarked)
						sTempStr += "<td class='cListEventIcon'><span class='" + sFontIconClass + "' style='" + sEventIconStyle + "'></span></td>";
					else
					{
						if(!oCS.setting.hideEventIcon[oCS.setting.visibleView])
						{
							if($.cf.compareStrings(sIcon, "Dot"))
								sTempStr += "<td class='cListEventIcon'><span class='" + sFontIconClass + "' style='" + sEventIconStyle + "'></span></td>";
							else
							{
								sFontIconClass = "cListEventIconFont " + ($.cf.compareStrings(oCS.setting.visibleView, "DayEventListView") && $.cf.isValid(oEvent.status) ? "cListEventIconFontStatus " : "") + sIcon;
								sTempStr += "<td class='cListEventIcon'><span class='" + sFontIconClass + "' style='" + sEventIconStyle + "'></span></td>";
							}
						}
					}
				
					sTempStr += "<td class='cListEventContent'>";
					sTempStr += "<div class='cListEventTitle'>" + sTitle + "</div>";
					sTempStr += "<div class='cListEventDesc'>" + sDesc + "</div>";
					sTempStr += "</td>";
					sTempStr += "</tr>";

					sTempStr += "<tr class='cListEventSeparator'><td colspan='"+iColspan+"'><hr/></td></tr>";
				}
			}
			else
				sTempStr = "<tr><td colspan='"+iColspan+"' class='cEmptyList'>No Events</td></tr>";
		}
	}
	else
		sTempStr += "<tr><td class='cEmptyList'>No Events</td></tr>";

	sTempStr += "</tbody>";

	sTempStr += "</table>";

	return sTempStr;
}

function displayEventsInListAgenda(oCS, oViewDetails)
{
	var iEventId = 0, iEventCount = oViewDetails["eventCount"],
	oArrViewDetails = oViewDetails.eventList;
	
	var sTempStr = "";

	sTempStr += "<table class='cListTable'>";

	sTempStr += "<tbody>";

	if(iEventCount > 0)
	{
		for(var iTempIndex = 0; iTempIndex < oArrViewDetails.length; iTempIndex++)
		{
			var oViewDetails = oArrViewDetails[iTempIndex],
			dThisDate = oViewDetails.date,
			oArrTempEvents = oViewDetails.events,
			iColspan = oCS.setting.hideEventIcon[oCS.setting.visibleView] ? 3 : 4;
		
			if(oArrViewDetails.length > 1)
			{
				var sFullDate = oCS.getDateInFormat({"date": dThisDate}, "DDD MMM dd, yyyy", false, true);
				var sDateId = "Date-" +  sFullDate;			
				sTempStr += "<tr><td colspan='"+iColspan+"'><div id='" + sDateId + "' class='cListDate'>" + sFullDate + "</div></td></tr>";
			}

			if(oArrTempEvents.length > 0)
			{
				for(var iEventIndex = 0; iEventIndex < oArrTempEvents.length; iEventIndex++)
				{
					var oEvent = oArrTempEvents[iEventIndex];
				
					var dStartDateTime = null, dEndDateTime = null,
					bIsAllDay = 0, sTitle = "",  sURL = "", sEventColor = "", sDesc = "",
					bIsMarked = false;
				
					if(oEvent.start != null)
						dStartDateTime = oEvent.start;
				
					if(oEvent.end != null)
						dEndDateTime = oEvent.end;
				
					if(oEvent.isAllDay != null)
						bIsAllDay = oEvent.isAllDay;
				
					if(oEvent.title != null)
						sTitle = oEvent.title;

					if(oEvent.desc !== null)
						sDesc = oEvent.desc;
				
					if(oEvent.url != null)
						sURL = oEvent.url;

					if(oEvent.isMarked !== null)
						bIsMarked = oEvent.isMarked;

					if(bIsMarked)
						bIsAllDay = true;
				
					var sArrEventDateTime = oCS.getEventDateTimeDataForAgendaView(dStartDateTime, dEndDateTime, bIsAllDay, dThisDate, "cListEventTime"),
					sEventDateTime = sArrEventDateTime[0];
					if(sEventDateTime == "")
						sEventDateTime = "All Day";
				
					sEventColor = oEvent.fromSingleColor ? oEvent.textColor : oEvent.backgroundColor;
					sEventColor = ($.cf.compareStrings(sEventColor, "") || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;
					var sId = "Event" + (++iEventId),
					sStyleColorHeight = sArrEventDateTime[1],
					sIcon, sEventIconStyle,
					sEventClass = "cListEvent";

					if(bIsMarked)
					{
						sEventClass += " cMarkedDayEvent";
						sIcon = ($.cf.isValid(oEvent.icon) && oEvent.icon !== "Dot") ? oEvent.icon : "cs-icon-Mark";
						sEventIconStyle = "background: " + sEventColor + ";";
					}
					else
					{
						sIcon = $.cf.isValid(oEvent.icon) ? oEvent.icon : oCS.setting.eventIcon;
						sEventIconStyle = "background: " + sEventColor + "; ";
					}
				
					sTempStr += "<tr id='" + sId + "' class='" + sEventClass + "'>";
					sTempStr += "<td class='cListEventColor'><span style='background:" + sEventColor + "; height:" + sStyleColorHeight + ";'></span></td>";
					sTempStr += "<td class='cListEventTime'>" + sEventDateTime + "</td>";
					
					if(bIsMarked)
					{
						sTempStr += "<td class='cListEventIcon'><span class='cListEventIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span></td>";
					}
					else
					{
						if(!oCS.setting.hideEventIcon[oCS.setting.visibleView])
						{
							if($.cf.compareStrings(sIcon, "Dot"))
								sTempStr += "<td class='cListEventIcon'><span class='cListEventIconDot' style='" + sEventIconStyle + "'></span></td>";
							else
								sTempStr += "<td class='cListEventIcon'><span class='cListEventIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span></td>";
						}
					}

					sTempStr += "<td class='cListEventContent'>";
					sTempStr += "<div class='cListEventTitle'>" + sTitle + "</div>";
					sTempStr += "<div class='cListEventDesc'>" + sDesc + "</div>";
					sTempStr += "</td>";
					sTempStr += "</tr>";

					sTempStr += "<tr class='cListEventSeparator'><td colspan='"+iColspan+"'><hr/></td></tr>";
				}
			}
			else
				sTempStr = "<tr><td colspan='"+iColspan+"' class='cEmptyList'>No Events</td></tr>";
		}
	}
	else
		sTempStr += "<tr><td class='cEmptyList'>No Events</td></tr>";

	sTempStr += "</tbody>";

	sTempStr += "</table>";

	return sTempStr;
}

/* -------------------------  EventList Related Functions End --------------------------- */

/* ----------------------- Event Filter related functions Start -------------------- */

function setEventFilterCriteriaArray(isFilledTag)
{	
	//["Swimming", "Running", "Cycling", "Birthday", "Coffee", "Lunch", "Dinner", "Meeting", "Movie"]

	var oArrValuesType = ["Meeting", "Coffee", "Lunch", "Dinner"];
	var oArrValuesSelectedType = [];
	if(isFilledTag)
	{	
		oArrValuesSelectedType = ["Meeting", "Coffee", "Lunch", "Dinner"];
	}
	var sArrDisplayStatusType = ["show", "show", "show", "show"];

	var oArrValuesPeople = ["Merlin", "Agnes", "Dora", "Victor", "Edwin", "Sam", "Kelvin", "Matt", "Sandra", "Celine", "Donna", "Arnold", "Richard", "Felicia", "Jennifer", "Scott"];
	var oArrValuesSelectedPeople = [];
	if(isFilledTag)
	{
		oArrValuesSelectedPeople = ["Merlin", "Agnes", "Dora", "Victor", "Edwin", "Sam", "Kelvin", "Matt", "Sandra", "Celine", "Donna", "Arnold", "Richard", "Felicia", "Jennifer", "Scott"];
	}

	var oArrValuesTag = ["Personal", "Work"];
	var oArrValuesSelectedTag = [];
	if(isFilledTag)
	{
		oArrValuesSelectedTag = ["Personal", "Work"];
	}
	var sArrDisplayStatusTag = ["show", "show"];

	var oArrValuesTagIndex = [];
	for(var iTempIndex = 1; iTempIndex < 27; iTempIndex++)
	{
		oArrValuesTagIndex.push(iTempIndex);
	}
	var oArrValuesSelectedTagIndex = [25, 26];

	var oFilter1 = setFilterObject("type", "Type", "String", oArrValuesType, oArrValuesSelectedType, sArrDisplayStatusType);
	var oFilter2 = setFilterObject("people", "People", "Array", oArrValuesPeople, oArrValuesSelectedPeople, []);
	var oFilter3 = setFilterObject("tag", "Tag", "String", oArrValuesTag, oArrValuesSelectedTag, sArrDisplayStatusType);
	var oFilter4 = setFilterObject("tagIndex", "TagIndex", "Number", oArrValuesTagIndex, oArrValuesSelectedTagIndex, []);

	var sArrEventFilterCriteria = [];
	sArrEventFilterCriteria.push(oFilter3);
	sArrEventFilterCriteria.push(oFilter1);
	sArrEventFilterCriteria.push(oFilter2);
	//sArrEventFilterCriteria.push(oFilter4);

	var sJsonStr = JSON.stringify(sArrEventFilterCriteria);
	return sJsonStr;
}

function setFilterObject(sKeyName, sDisplayName, sDataType, oArrValues, oArrSelectedValues, sArrDisplayStatus)
{
	var oFilter = {};

	oFilter.keyName = sKeyName;
	oFilter.keyDisplayName = sDisplayName;
	oFilter.dataType = sDataType;
	oFilter.values = oArrValues;
	oFilter.selectedValues = oArrSelectedValues;
	oFilter.displayStatus = sArrDisplayStatus;

	return oFilter;
}

/* ----------------------- Event Filter related functions End -------------------- */
