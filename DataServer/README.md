

# DataServer

In distribution folder, CalJsonGenerator.js file contains code to generate data needed to supply to CalenStyle.
Sometimes, this process of generating data on frontend itself may result in degraded performance of Calenstyle View. To tackle this problem DataServer is provided.
DataServer can be used to generate data(events, appointments) needed to supply to CalenStyle.

## Usage

# Start Node Server "DataServer"

1. Make sure that node.js is installed. If not install it from https://nodejs.org/en/download/
2. Change directory to path of DataServer 
	(for example, cd "/Volumes/MyVolume1/DataServer")
3. Run command "npm install"
4. Run command "npm start"

After running this, you can see "Express server listening on port 3000"

# Use Request Data on "DataServer"

1. 	Find your IP address/ Localhost IP address 
	For example,  http://192.168.1.4

	Mac : http://osxdaily.com/2010/11/21/find-ip-address-mac/
	Windows : http://windows.microsoft.com/en-in/windows/find-computers-ip-address


2. 	Append port number on which node server is listening to localhost address 
	For example,  http://192.168.1.4:3000


3. 	Events

	Append "events"
	For example, http://192.168.1.4:3000/events

	calDataSource: 
	[
		{
			sourceFetchType: "DateRange",
			sourceType: "URL",
            source: "http://192.168.1.4:3000/events"
		}
	]


4. 	Appointments

	Append "slotavailability"
	For example, http://192.168.1.4:3000/slotavailability

	calDataSource:
    [
       {
            sourceFetchType: "DateRange",
            sourceType: "URL",
            source: "http://192.168.1.4:3000/slotavailability"
        }
    ]


5. 	Calendar

	Append "eventcalendar"
	For example, http://192.168.1.4:3000/eventcalendar


6. 	Event or Task Status

	Append "eventortaskstatus"
	For example, http://192.168.1.4:3000/eventortaskstatus


7. 	Blocked Times

	Append "blockedtimes"
	For example, http://192.168.1.4:3000/blockedtimes

8. 	Filter Criteria

	Append "filtercriteria"
	For example, http://192.168.1.4:3000/filtercriteria


9.	Multiple Sources

	Append "misc?types=events,eventcalendar,eventortaskstatus"
	For example, http://192.168.1.4:3000/misc?types=events,eventcalendar,eventortaskstatus

	calDataSource: 
    [					
		{
			sourceFetchType: "DateRange",
			sourceType: "URL",
			source: "http://192.168.1.4:3000/misc?types=events,eventcalendar,eventortaskstatus"
		}
	]


## Developing



### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
