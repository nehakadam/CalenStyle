/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

//"use strict";

function CalEvent(ceId, ceAllDay, ceStartDate, ceEndDate, ceType, ceTitle, ceDesc, ceUrl)
{
	this.id = ceId;
	this.isAllDay = ceAllDay;
	this.start = ceStartDate;
	this.end = ceEndDate;
	this.type = ceType;
	this.title = ceTitle;
	this.desc = ceDesc;
	this.url = ceUrl;
}

function CalEventSeg(ceSegDayNo, ceEventId, ceEventDisplayId, ceSegId, ceSegStartDate, ceSegEndDate, ceSegLeftColumn, ceSegColumns)
{
	this.dayNo = ceSegDayNo;
	this.eventId = ceEventId;
	this.eventDisplayId = ceEventDisplayId;
	this.eventSegId = ceSegId;
	this.eventSegStart = ceSegStartDate;
	this.eventSegEnd = ceSegEndDate;
	this.segLeftColumn = ceSegLeftColumn;
	this.segColumns = ceSegColumns;
}

// --------------------------------- Global Variables Start --------------------------------------

$.CalenStyle = $.CalenStyle ||
{
	name: "CalenStyle",

	version: "1.0.0",

	i18n: {}, // Internationalization Objects

	defaults: //Plugin Defaults
	{
		sectionsList: ["Header", "Calendar"],
		language: "",
		veryShortDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		shortDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		fullDayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		fullMonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],

		eventTooltipContent: "Default",
		formatDates: {},

		slotTooltipContent: function(oSlotAvailability)
		{
			if(oSlotAvailability.status === "Busy")
				return "";
			else if(oSlotAvailability.status === "Free")
			{
				if(oSlotAvailability.count === undefined || oSlotAvailability.count === null)
					return "<div class=cavTooltipBookNow>Book Now</div>";
				else
					return "<div class=cavTooltipSlotCount>" + oSlotAvailability.count + " slots available</div><div class=cavTooltipBookNow>Book Now</div>";
			}
		},
		miscStrings:
		{
			today: "Today",
			week: "Week",
			allDay: "All Day",
			ends: "Ends",
			emptyEventTitle: "(No Title)",
			emptyGoogleCalendarEventTitle: "Busy"
		},
		duration: "Default",
		durationStrings:
		{
			y: ["year ", "years "],
			M: ["month ", "months "],
			w: ["w ", "w "],
			d: ["d ", "d "],
			h: ["h ", "h "],
			m: ["m ", "m "],
			s: ["s ", "s "]
		},

		viewsToDisplay: [
			{
				viewName: "DetailedMonthView",
				viewDisplayName: "Month"
			},
			{
				viewName: "WeekView",
				viewDisplayName: "Week"
			},
			{
				viewName: "DayView",
				viewDisplayName: "Day"
			},
			{
				viewName: "AgendaView",
				viewDisplayName: "Agenda"
			}
		],
		visibleView: "DetailedMonthView",
		selectedDate: new Date(),

		headerComponents:
		{
			DatePickerIcon: "<span class='cContHeaderButton cContHeaderDatePickerIcon clickableLink cs-icon-Calendar'></span>",
			FullscreenButton: function(bIsFullscreen)
			{
				var sIconClass = (bIsFullscreen) ? "cs-icon-Contract" : "cs-icon-Expand";
				return "<span class='cContHeaderButton cContHeaderFullscreen clickableLink "+ sIconClass +"'></span>";
			},
			PreviousButton: "<span class='cContHeaderButton cContHeaderNavButton cContHeaderPrevButton clickableLink cs-icon-Prev'></span>",
			NextButton: "<span class='cContHeaderButton cContHeaderNavButton cContHeaderNextButton clickableLink cs-icon-Next'></span>",
			TodayButton: "<span class='cContHeaderButton cContHeaderToday clickableLink'></span>",
			HeaderLabel: "<span class='cContHeaderLabelOuter'><span class='cContHeaderLabel'></span></span>",
			HeaderLabelWithDropdownMenuArrow: "<span class='cContHeaderLabelOuter clickableLink'><span class='cContHeaderLabel'></span><span class='cContHeaderButton cContHeaderDropdownMenuArrow'></span></span>",
			MenuSegmentedTab: "<span class='cContHeaderMenuSegmentedTab'></span>",
			MenuDropdownIcon: "<span class='cContHeaderButton cContHeaderMenuButton clickableLink'>&#9776;</span>"
		},
		headerSectionsList:
		{
			left: ["DatePickerIcon", "PreviousButton", "NextButton"],
			center: ["HeaderLabel"],
			right: ["MenuSegmentedTab"]
		},
		dropdownMenuElements: ["ViewsToDisplay"], // ["ViewsToDisplay", "DatePicker"]
		parentObject: null,
		datePickerObject: null,

		formatSeparatorDateTime: " ",
		formatSeparatorDate: "-",
		formatSeparatorTime: ":",
		is24Hour: false,
		inputDateTimeFormat: "dd-MM-yyyy HH:mm:ss",

		eventDuration: 30, // In minutes
		allDayEventDuration: 1, // In days

		timeIndicatorUpdationInterval: 15,
		unitTimeInterval: 30, // [5, 10, 15, 20, 30]
		timeLabels: "Hour", // ["Hour", "All"]

		inputTZOffset: "+05:30",
		tz: "Asia/Calcutta", // For Google Calendar
		outputTZOffset: "+05:30", // +05:30

		weekStartDay: 1,
		weekNumCalculation: "US", // ["US", "Europe/ISO"]
		daysInCustomView: 4,
		daysInDayListView: 7,
		daysInAppointmentView: 4,

		agendaViewDuration: "Month", // ["Month", "Week", "CustomDays"]
		daysInAgendaView: 15,
		agendaViewTheme: "Timeline2", // ["Timeline1", "Timeline2", "Timeline3"]
		showDaysWithNoEventsInAgendaView: false,

		fixedHeightOfWeekPlannerViewCells: true,

		quickAgendaViewDuration: "Week", // ["Week", "CustomDays"]
		daysInQuickAgendaView: 5,
		navigateOneDayInQuickAgendaView: false,

		taskPlannerViewDuration: "Week", // ["Week", "CustomDays"]
		daysInTaskPlannerView: 5,
		fixedHeightOfTaskPlannerView: true,
		navigateOneDayInTaskPlannerView: false,

		transitionSpeed: 600,
		showTransition: false,

		fixedNumOfWeeksInMonthView: false,
		displayWeekNumInMonthView: false,
		actionOnDayClickInMonthView: "ModifyEventList", // ["ModifyEventList", "ChangeDate", "DisplayEventListDialog"]

		eventIndicatorInMonthView: "Events", // ["DayHighlight", "Events", "Custom"]
		eventIndicatorInDatePicker: "DayNumberBold", // ["DayNumberBold", "Dot"]
		eventIndicatorInDayListView: "DayHighlight", // ["DayHighlight", "Custom"]
		averageEventsPerDayForDayHighlightView: 5,

		hideExtraEvents: true,
		hiddenEventsIndicatorLabel: "+(count) more",
		hiddenEventsIndicatorAction: "ShowEventDialog",

		addEventsInMonthView: true,
		displayEventsInMonthView: true,

		isDragNDropInMonthView: true,
		isTooltipInMonthView: false,

		isDragNDropInDetailView: true,
		isResizeInDetailView: true,
		isTooltipInDetailView: false,

		isDragNDropInQuickAgendaView: true,
		isTooltipInQuickAgendaView: false,

		isDragNDropInTaskPlannerView: true,
		isTooltipInTaskPlannerView: false,

		isTooltipInAppointmentView: true,

		actionBarHeight: 30,
		filterBarPosition: "Top", // ["Top", "Bottom", "Left", "Right"]
		filterBarHeight: 200,
		filterBarWidth: 200,
		eventFilterCriteria: [],
		noneSelectedFilterAction: "SelectNone", //["SelectNone", "SelectAll"]

		calendarBorderColor: "FFFFFF",
		changeCalendarBorderColorInJS: false,

		// Events-specific properties

		extraMonthsForDataLoading: 1,
		deleteOldDataWhileNavigating: true,
		datasetModificationRule: "Default", //["Default", "ReplaceAll", "ReplaceSpecified"]
		changeColorBasedOn: "EventCalendar", // ["Event", "EventCalendar", "EventSource"]
		borderColor: "",
		textColor: "FFFFFF",
		onlyTextForNonAllDayEvents: true,

		eventColorsArray: ["C0392B", "D2527F", "674172", "4183D7", "336E7B", "36D7B7", "68C3A3", "E87E04", "6C7A89", "F9690E"],
		eventIcon: "Dot", // ["Dot", "cs-icon-Event"]
		hideEventIcon: {
			Default: false,
			DetailedMonthView: false,
			MonthView: false,
			WeekView: false,
			DayView: false,
			CustomView: false,
			QuickAgendaView: false,
			TaskPlannerView: false,
			DayEventDetailView: false,
			AgendaView: false,
			WeekPlannerView: false
		},
		hideEventTime: {
			Default: false,
			DetailedMonthView: false,
			MonthView: false,
			WeekView: false,
			DayView: false,
			CustomView: false,
			QuickAgendaView: false,
			TaskPlannerView: false,
			DayEventDetailView: false,
			AgendaView: false,
			WeekPlannerView: false
		},

		businessHoursSource: [
			{
				day: 1,
				times: [{startTime: "10:00", endTime: "17:00"}]
			},
			{
				day: 2,
				times: [
					{startTime: "09:00", endTime: "13:00"},
					{startTime: "14:00", endTime: "18:00"}
				]
			},
			{
				day: 3,
				times: [{startTime: "10:00", endTime: "17:00"}]
			},
			{
				day: 4,
				times: [
					{startTime: "09:00", endTime: "13:00"},
					{startTime: "14:00", endTime: "18:00"}
				]
			},
			{
				day: 5,
				times: [{startTime: "10:00", endTime: "17:00"}]
			},
			{
				day: 6,
				times: [
					{startTime: "09:00", endTime: "13:00"},
					{startTime: "14:00", endTime: "18:00"}
				]
			}
		],
		excludeNonBusinessHours: false,
		isNonBusinessHoursDroppable: true,

		isRestrictedSectionDroppable: true,

		eventOrTaskStatusIndicators: [
			{
				name: "Overdue",
				color: "E74C3C"
			},
			{
				name: "Completed",
				color: "27AE60"
			},
			{
				name: "InProgress",
				color: "F1C40F"
			}
		],

		calDataSource: [],
		datePickerCalDataSource: [
			{
				config:
				{
					sourceCountType: "Event"
				}
			}
		],

		adjustViewOnWindowResize: true,
		useHammerjsAsGestureLibrary: false,

		//------------------ Callback Functions Start --------------------------

		initialize: null,

		// Custom HeaderView Callbacks
		modifyHeaderViewLabels: null,
		addEventHandlersInHeader: null,

		// Data Loading Callbacks
		dataLoadingStart: null,
		dataLoadingEnd: null,

		// Calendar Navigation Callbacks
		cellClicked: null,
		viewLoaded: null,
		previousButtonClicked: null,
		nextButtonClicked: null,
		todayButtonClicked: null,
		visibleViewChanged: null,

		modifyCustomView: null,

		// Event List related Callbacks
		displayEventsForPeriodInList: null,
		displayEventsForPeriodInListInAgendaView: null,
		eventListAppended: null,

		// Event Dialog related Callbacks
		displayEventListDialog: null,
		eventInADialogClicked: null,

		// Events and Appointment Time Slots related Callbacks
		eventRendered: null,
		eventsAddedInView: null,
		timeSlotsAddedInView: null,
		eventClicked: null,
		timeSlotClicked: null,
		saveChangesOnEventDrop: null,
		saveChangesOnEventResize: null,

		modifyFilterBarView: null,
		modifyActionBarView: null,

		addDaySummaryInTaskPlannerView: null

		//------------------ Callback Functions End --------------------------
	},

	tempDefaults: // Temporary Variables For Calculation Specific to CalenStyle Instance
	{
		sLoadType: "Load",
		iLoadCnt: 0, // iLoadCounter
		dLoadDt: new Date(), // LoadDate
		bViewLoaded: false, // bViewLoaded
		dHighlightDPV: [], // dArrDatesToHighlightInDatePickerView

		bDisFBar: false, // bDisplayFilterBar
		bDisMenu: false, // bDisplayViewSelectionMenu

		iMaxEvId: 0, // iMaxEventId
		iMxEvRw: 0, // iMaxEventsInRow
		oAEvents: [], // oArrEvents
		oASmEvSeg: [], // oArrSmallEventSegments
		oAADEvSeg: [], // oArrAllDayEventSegments
		oASrcCnt: [], // oArrSourceCount
		oAResSec: [], // oArrRestrictedSection
		oASltAvail: [], // oArrSlotAvailability
		oAECalendar: [], // oArrEventCalendar
		oAEvTaskStatus: [],
		bEvTskStatus: false,
		oSURLParams: [],

		iDocHtPrev: 0, // iDocumentHeightPrevious

		iUTmMS: 0, // iUnitTimeMS
		iUTmSlt: 0, // iUnitTimeSlots

		dVSDt: new Date(), // dViewStartDate
		dVEDt: new Date(), // dViewEndDate
		dVDSDt: new Date(), // dViewToDisplayStartDate
		dVDEDt: new Date(), // dViewToDisplayEndDate
		dCMDt: new Date(), // dCurrentMonthDate
		dPMDt: new Date(), // dPreviousMonthDate
		dNMDt: new Date(), // dNextMonthDate
		dPLSDt: new Date(), // dPrevLoadStartDate
		dPLEDt: new Date(), // dPrevLoadEndDate
		dNLSDt: new Date(), // dNextLoadStartDate
		dNLEDt: new Date(), // dNextLoadEndDate
		dDrgSDt: null, // dViewStartDate
		dDrgEDt: null, // dViewEndDate

		dAVDt: [], // dArrViewDates
		dAVDDt: [], // dArrViewDisplayDates
		iNoVDay: 0, // iNumberOfViewDays
		iNoVDayDis: 0, // iNumberOfViewDaysToDisplay
		iSelDay: 0,
		bAWkRw: [], // bArrWeekRow
		bADVCur: [], // bArrDVCurrent
		sADVInfo: [], // bArrDVInfo
		iBsDays: 0, // iBusinessDaysForWeek
		bABsDays: [], // bArrBusinessDaysForWeek
		oBsHours: {"start": "", "end": ""}, // oBusinessHours
		bChkDroppable: false,
		iWkInMonth: 6, // iNumberOfWeeksInMonth

		bDVResEv: false, // bDVResizingEvent
		bDVDrgEv: false, // bDVDraggingEvent
		bEvLgPresd: false, // bEventLongPressed
		bUrlClk: false, // bUrlClicked
		oEvEdt: null, // oEventBeingEdited
		oDVEdtgEv: null, // oDVEditingEvent
		bDVScrlg: false, // bDVScrolling
		fDVDayWth: 0, // bDVDaysWidth
		fADVDayLftPos: [], // fArrDVDaysLeftPos
		fAHrTpPos: [], // fArrHourTopPos

		bCMVDisEvLst: false, // bCMVDisplayEventList
		bDisABar: false, // bDisplayActionBar
		oAEvFltrCnt: [], // oArrEventFilterCount

		iCalHeight: 0, // iCalendarHeight
		bDyClDLV: false // bDayClickedInDayListView
	},

	extra: // Common Temporary Variables
	{
		iCalenStyleObjCount: 0,
		iBorderOverhead: 1,
		iEventHeightOverhead: 4,
		iScrollbarWidth: 0,
		dToday: new Date(),
		iMS: { m: 6E4, h: 36E5, d: 864E5, w: 6048E5 },
		sArrInputDateTimeFormats: ["DateObject", "UnixTimestamp", "ISO8601", "ISO8601Compact", "dd-MM-yyyy hh:mm:ss AA", "dd-MM-yyyy HH:mm:ss", "MM-dd-yyyy hh:mm:ss AA", "MM-dd-yyyy HH:mm:ss", "yyyy-MM-dd hh:mm:ss AA", "yyyy-MM-dd HH:mm:ss"],
		sArrViewsTypes: ["DetailedMonthView", "MonthView", "WeekView", "DayView", "AgendaView", "WeekPlannerView", "QuickAgendaView", "TaskPlannerView", "CustomView", "DayEventListView", "DayEventDetailView", "AppointmentView", "DatePicker"],
		bTouchDevice: ("ontouchstart" in document.documentElement ? true : false),
		sClickHandler: ("ontouchstart" in document.documentElement ? "click" : "click"),
		sClickHandlerButtons: ("ontouchstart" in document.documentElement ? "touchstart" : "click"),
		oArrCalenStyle: [],
		iEventHeights:
		{
			DetailedMonthView: 18,
			WeekView: 18,
			DayView: 18,
			CustomView: 18,
			DayEventDetailView: 18,
			QuickAgendaView: 18
		},
		oEventClass:
		{
			DetailedMonthView: "cdmvEvent",
			WeekView: "cdvEventAllDay",
			DayView: "cdvEventAllDay",
			CustomView: "cdvEventAllDay",
			DayEventDetailView: "cdvEventAllDay",
			QuickAgendaView: "cqavEvent"
		}
	}
};

$.cf = {

	isValid: function(sValue)
	{
		return (sValue !== undefined && sValue !== null && sValue !== "");
	},

	compareStrings: function(sString1, sString2)
	{
		var to = this;
		if(sString1 !== null && sString1 !== undefined && sString2 !== null && sString2 !== undefined)
		{
			if(typeof sString1 === "string" && typeof sString2 === "string")
			{
				if(sString1.toLocaleLowerCase() === sString2.toLocaleLowerCase())
					return true;
			}
			return false;
		}
		else
		{
			if((sString1 === null && sString2 === null) || (sString1 === undefined && sString2 === undefined))
				return true;
			else
				return false;
		}
	},

	getTimestamp: function()
	{
		return (new Date()).getTime();
	},

	getRGBAString: function(sHexcode, fAlpha)
	{
		var iRed = 0, iGreen = 0, iBlue = 0,
		sArrRGBA = sHexcode.match(/rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)/i),
		sArrRGB = sHexcode.match(/rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/i);

		if($.cf.isValid(sArrRGBA) && sArrRGBA.length > 0)
		{
			iRed = sArrRGBA[0];
			iGreen = sArrRGBA[1];
			iBlue = sArrRGBA[2];
		}
		else if($.cf.isValid(sArrRGB) && sArrRGB.length > 0)
		{
			iRed = sArrRGB[0];
			iGreen = sArrRGB[1];
			iBlue = sArrRGB[2];
		}
		else
		{
			sHexcode = (sHexcode.charAt(0) === "#") ? sHexcode.substring(1,7) : sHexcode;
			sHexcode = sHexcode.match(/([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/)[0];

			if(sHexcode.length === 3)
			{
				iRed = sHexcode.substring(0, 1);
				iRed = iRed + iRed;
				iRed = parseInt(iRed, 16);

				iGreen = sHexcode.substring(1, 2);
				iGreen = iGreen + iGreen;
				iGreen = parseInt(iGreen, 16);

				iBlue = sHexcode.substring(2, 3);
				iBlue = iBlue + iBlue;
				iBlue = parseInt(iBlue, 16);
			}
			else if(sHexcode.length === 6)
			{
				iRed = parseInt(sHexcode.substring(0,2), 16);
				iGreen = parseInt(sHexcode.substring(2,4), 16);
				iBlue = parseInt(sHexcode.substring(4,6), 16);
			}
		}
		return "rgba(" + iRed + ", " + iGreen + ", " + iBlue + ", " + fAlpha +")";
	},

	addHashToHexcode: function(sHexcode)
	{
		if($.cf.isValid(sHexcode))
		{
			var sArrRGBA = sHexcode.match(/(rgba)/i),
			sArrHexHash = sHexcode.match(/(#+([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))/),
			sArrHex = sHexcode.match(/([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);

			if($.cf.isValid(sArrRGBA) && sArrRGBA.length > 0)
				return sHexcode;
			else if($.cf.isValid(sArrHexHash) && sArrHexHash.length > 0)
				return sArrHexHash[0];
			else if($.cf.isValid(sArrHex) && sArrHex.length > 0)
				return "#" + sArrHex[0];
			else
				return "#000000";
		}
		else
			return sHexcode;
	},

	getSizeValue: function($oElem, sCSSProp)
	{
		var sValue = $oElem.css(sCSSProp),
		iValue, iPerc, iParentValue;

		if(sValue !== undefined && sValue !== null && sValue !== "")
		{
			if(sValue.indexOf("px") !== -1)
				iValue = parseInt(sValue.replace("px", ""));
			else if(sValue.indexOf("%") !== -1)
			{
				iPerc = parseInt(sValue.replace("%", ""));
				iParentValue = $oElem.closest().width();
				iValue = (iPerc % 100 * iParentValue);
			}

			if(iValue <= 0)
				return false;
			else
				return iValue;
		}
		else
			return false;
	}
};

// --------------------------------- Global Variables End --------------------------------------

(function(factory)
{
    if(typeof define === 'function' && define.amd)
    {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    }
    else if(typeof exports === 'object')
    {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    }
    else
    {
        // Browser globals
        factory(jQuery);
    }
}
(function ($)
{
	$.fn.CalenStyle = function(options)
	{
		var oCalenStyle = $(this).data(),
		sArrDataKeys = Object.keys(oCalenStyle),
		iKey, sKey;
		if(options === null || options === undefined)
		{
			if(sArrDataKeys.length > 0)
			{
				for(iKey in sArrDataKeys)
				{
					sKey = sArrDataKeys[iKey];
					if(sKey.search("plugin_CalenStyle_") !== -1)
					{
						return oCalenStyle[sKey];
					}
				}
			}
			else
			{
				console.log("No CalenStyle Object Defined For This Element");
			}
		}
		else if(typeof options === "string")
		{
			if($.cf.isValid(oCalenStyle))
			{
				if(options === "destroy")
				{
					if(sArrDataKeys.length > 0)
					{
						for(iKey in sArrDataKeys)
						{
							sKey = sArrDataKeys[iKey];
							if(sKey.search("plugin_CalenStyle_") !== -1)
							{
								$(this).children().remove();
								$(".cElemDatePickerBg").remove();
								$(this).removeData();
								$(this).unbind();
								$(this).removeClass("elem-CalenStyle");
								$(document).unbind($.CalenStyle.extra.sClickHandler+".CalenStyle");
								$(document).unbind($.CalenStyle.extra.sClickHandler+".CalenStyleDialog");
								$(document).unbind($.CalenStyle.extra.sClickHandler+".MonthPicker");
								$(document).unbind($.CalenStyle.extra.sClickHandler+".YearPicker");

								oCalenStyle = oCalenStyle[sKey];

								$(window).unbind("resize." + oCalenStyle.tv.pluginId);
								$(window).unbind("resize.CSDP." + oCalenStyle.tv.pluginId);

								var oArrTempCalenStyle = [];
								for(var iTempIndex = 0; iTempIndex < $.CalenStyle.extra.oArrCalenStyle.length; iTempIndex++)
								{
									var oThisCalenStyle = $.CalenStyle.extra.oArrCalenStyle[iTempIndex];
									if(oThisCalenStyle.tv.pluginId !== oCalenStyle.tv.pluginId && oThisCalenStyle.tv.pluginId !== oCalenStyle.setting.datePickerObject.tv.pluginId)
										oArrTempCalenStyle.push(oThisCalenStyle);
								}

								$.CalenStyle.extra.oArrCalenStyle = oArrTempCalenStyle;

								console.log("Destroyed CalenStyle Object");
								console.log(oCalenStyle);

								break;
							}
						}
					}
					else
					{
						console.log("No CalenStyle Object Defined For This Element");
					}
				}
			}
		}
		else
		{
			return this.each(function()
			{
				$.CalenStyle.extra.iCalenStyleObjCount++;

				if(!$.data(this, "plugin_CalenStyle_" + $.CalenStyle.extra.iCalenStyleObjCount))
				{
					oCalenStyle = new CalenStyle(this, options);
					$.data(this, "plugin_CalenStyle_" + $.CalenStyle.extra.iCalenStyleObjCount, oCalenStyle);
					oCalenStyle.loadView();

					console.log("Calendar Object ");
					console.log(oCalenStyle);
				}
				else
				{
					if(sArrDataKeys.length > 0)
					{
						for(iKey in sArrDataKeys)
						{
							sKey = sArrDataKeys[iKey];
							if(sKey.search("plugin_CalenStyle_") !== -1)
							{
								return oCalenStyle[sKey];
							}
						}
					}
					else
					{
						console.log("No CalenStyle Object Defined For This Element");
					}
				}
			});
		}
	};

}));

function CalenStyle(element, options)
{
	var to = this;

	to.elem = element;

	var sLang = ($.cf.isValid(options.language)) ? options.language : $.CalenStyle.defaults.language;
	to.setting = $.extend({}, $.CalenStyle.defaults, options, $.CalenStyle.i18n[sLang]);
	to.tv = $.extend({}, $.CalenStyle.tempDefaults);

	to.tv.pluginId = $.CalenStyle.extra.iCalenStyleObjCount;
	to.tv.iUTmMS = to.setting.unitTimeInterval * $.CalenStyle.extra.iMS.m;
	to.tv.iUTmSlt = (60 / to.setting.unitTimeInterval);
	to.tv.iCalHeight = $(to.elem).height();

	if(to.setting.initialize)
		to.setting.initialize.call(to);

	$.CalenStyle.extra.dToday = to._getCurrentDate();
	if(to.compareDates(to.setting.selectedDate, new Date()) === 0)
		to.setting.selectedDate = new Date($.CalenStyle.extra.dToday);
	to.tv.dLoadDt = new Date($.CalenStyle.extra.dToday); to.tv.dVSDt = new Date($.CalenStyle.extra.dToday); to.tv.dVEDt = new Date($.CalenStyle.extra.dToday); to.tv.dVDSDt = new Date($.CalenStyle.extra.dToday); to.tv.dVDEDt = new Date($.CalenStyle.extra.dToday);
	to.tv.dCMDt = new Date($.CalenStyle.extra.dToday); to.tv.dPMDt = new Date($.CalenStyle.extra.dToday); to.tv.dNMDt = new Date($.CalenStyle.extra.dToday); to.tv.dPLSDt = new Date($.CalenStyle.extra.dToday); to.tv.dPLEDt = new Date($.CalenStyle.extra.dToday);
	to.tv.dNLSDt = new Date($.CalenStyle.extra.dToday); to.tv.dNLEDt = new Date($.CalenStyle.extra.dToday);

	$.CalenStyle.extra.oArrCalenStyle.push(to);
	to._setHeightForEvents();
}

/*! -------------------------------------- Common Functions Start -------------------------------------- */

CalenStyle.prototype = {

	// Public Method
	modifyCalenStyleObject: function(oTemp)
	{
		var to = this;
		to = oTemp;
	},

	// Public Method
	setLanguage: function(sTempLang, bLoadData)
	{
		var to = this;
		to.setting.language = sTempLang;
		to.setting = $.extend({}, to.setting, $.CalenStyle.i18n[sTempLang]);
		for(var iTempIndex = 0; iTempIndex < to.setting.viewsToDisplay.length; iTempIndex++)
		{
			to.setting.viewsToDisplay[iTempIndex].viewDisplayName = to.setting.viewDisplayNames[to.setting.viewsToDisplay[iTempIndex].viewName];
		}

		to.setting.datePickerObject.setting = $.extend({}, to.setting.datePickerObject.setting, $.CalenStyle.i18n[sTempLang]);

		if(bLoadData)
			to.reloadData();
		else
		{
			to.refreshView();
			to.setting.datePickerObject.refreshView();
		}

		return to;
	},

	// Public Method
	changeOutputTimezone: function(sTZ, sTZD, bLoadData)
	{
		var to = this;
		var iTempIndex;
		var sPrevTZ = to.setting.tz, sPrevTZD = to.setting.outputTZOffset;
		to.setting.tz = sTZ;
		to.setting.outputTZOffset = sTZD;
		if(bLoadData || (to.tv.bGCData && sPrevTZ !== sTZ))
			to.reloadData();
		else if(sPrevTZD !== sTZD)
		{
			for(iTempIndex = 0; iTempIndex < to.tv.oAEvents.length; iTempIndex++)
			{
				var oEvent = to.tv.oAEvents[iTempIndex];
				if(!oEvent.isAllDay)
				{
					oEvent.start = to.normalizeDateTimeWithOffset(oEvent.start, sPrevTZD, sTZD);
					oEvent.end = to.normalizeDateTimeWithOffset(oEvent.end, sPrevTZD, sTZD);
				}
			}

			for(iTempIndex = 0; iTempIndex < to.tv.oAResSec.length; iTempIndex++)
			{
				var oRestrictedSection = to.tv.oAResSec[iTempIndex];
				if(!oRestrictedSection.isAllDay)
				{
					oRestrictedSection.start = to.normalizeDateTimeWithOffset(oRestrictedSection.start, sPrevTZD, sTZD);
					oRestrictedSection.end = to.normalizeDateTimeWithOffset(oRestrictedSection.end, sPrevTZD, sTZD);
				}
			}

			for(iTempIndex = 0; iTempIndex < to.tv.oASltAvail.length; iTempIndex++)
			{
				var oSlot = to.tv.oASltAvail[iTempIndex];
				if(!oSlot.isAllDay)
				{
					oSlot.start = to.normalizeDateTimeWithOffset(oSlot.start, sPrevTZD, sTZD);
					oSlot.end = to.normalizeDateTimeWithOffset(oSlot.end, sPrevTZD, sTZD);
				}
			}

			to.refreshView();
		}
	},

	addRemoveLoaderIndicators: function(bAdd, sLoaderIndicatorClass)
	{
		var to = this;

		if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView") || $.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
		{
			if(bAdd)
				$(to.elem).find(".cmvMonthTableMain tbody").addClass(sLoaderIndicatorClass);
			else
				$(to.elem).find(".cmvMonthTableMain tbody").removeClass(sLoaderIndicatorClass);
		}
		else if($.cf.compareStrings(to.setting.visibleView, "WeekView") || $.cf.compareStrings(to.setting.visibleView, "DayView") || $.cf.compareStrings(to.setting.visibleView, "CustomView"))
		{
			if(bAdd)
				$(to.elem).find(".cdvDetailTableMain tbody").addClass(sLoaderIndicatorClass);
			else
				$(to.elem).find(".cdvDetailTableMain tbody").removeClass(sLoaderIndicatorClass);
		}
		else if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
		{
			if(bAdd)
			{
				$(to.elem).find(".cdvDetailTableMain tbody").addClass(sLoaderIndicatorClass);
				$(to.elem).find(".cdlvDaysTableMain tbody").addClass(sLoaderIndicatorClass);
			}
			else
			{
				$(to.elem).find(".cdvDetailTableMain tbody").removeClass(sLoaderIndicatorClass);
				$(to.elem).find(".cdlvDaysTableMain tbody").removeClass(sLoaderIndicatorClass);
			}
		}
		else if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
		{
			if(bAdd)
				$(to.elem).find(".cdlvDaysTableMain tbody").addClass(sLoaderIndicatorClass);
			else
				$(to.elem).find(".cdlvDaysTableMain tbody").removeClass(sLoaderIndicatorClass);
		}
		else if($.cf.compareStrings(to.setting.visibleView, "QuickAgendaView"))
		{
			if(bAdd)
				$(to.elem).find(".cqavTableMain tbody").addClass(sLoaderIndicatorClass);
			else
				$(to.elem).find(".cqavTableMain tbody").removeClass(sLoaderIndicatorClass);
		}
		else if($.cf.compareStrings(to.setting.visibleView, "TaskPlannerView"))
		{
			if(bAdd)
				$(to.elem).find(".ctpvTableMain tbody").addClass(sLoaderIndicatorClass);
			else
				$(to.elem).find(".ctpvTableMain tbody").removeClass(sLoaderIndicatorClass);
		}
		else if($.cf.compareStrings(to.setting.visibleView, "AppointmentView"))
		{
			if(bAdd)
				$(to.elem).find(".cavTableMain").addClass(sLoaderIndicatorClass);
			else
				$(to.elem).find(".cavTableMain").removeClass(sLoaderIndicatorClass);
		}
		else if($.cf.compareStrings(to.setting.visibleView, "AgendaView"))
		{
			if(bAdd)
				$(to.elem).find(".cListOuterCont").addClass(sLoaderIndicatorClass);
			else
				$(to.elem).find(".cListOuterCont").removeClass(sLoaderIndicatorClass);
		}
		else if($.cf.compareStrings(to.setting.visibleView, "WeekPlannerView"))
		{
			if(bAdd)
				$(to.elem).find(".cwpvTableOuterCont").addClass(sLoaderIndicatorClass);
			else
			 	$(to.elem).find(".cwpvTableOuterCont").removeClass(sLoaderIndicatorClass);
		}
	},

	addRemoveViewLoader: function(bAdd, sViewLoaderClass)
	{
		var to = this;

		if(bAdd)
		{
			if(sViewLoaderClass === "cViewLoaderBg")
				$(to.elem).parent().append("<div class='"+sViewLoaderClass+"'><div class='cViewLoaderBody'></div></div>");
			else if(sViewLoaderClass === "cEventLoaderBg")
				$(to.elem).parent().append("<div class='"+sViewLoaderClass+"'><div class='cEventLoaderIcon'></div></div>");

			$(".cContHeaderMenuDropdownBg").css({"background": "rgba(0, 0, 0, 0)"});

			var $oThisElem = $(to.elem),
			iMainLeftMargin = $.cf.getSizeValue($oThisElem, "margin-left"),
			iMainTopMargin = $.cf.getSizeValue($oThisElem, "margin-top"),

			iMainContLeft = $oThisElem.position().left + iMainLeftMargin,
			iMainContTop = $oThisElem.position().top + iMainTopMargin,

			iMainContMaxWidth = $.cf.getSizeValue($oThisElem, "max-width"),
			iMainContMinWidth = $.cf.getSizeValue($oThisElem, "min-width"),
			iMainContWidth = $oThisElem.width(),
			iMainContHeight = $oThisElem.height();

			iMainContWidth = (iMainContMaxWidth && iMainContWidth > iMainContMaxWidth) ? iMainContMaxWidth : iMainContWidth;
			iMainContWidth = (iMainContMinWidth && iMainContWidth < iMainContMinWidth) ? iMainContMinWidth : iMainContWidth;

			$("."+sViewLoaderClass).css({"left": iMainContLeft, "top": iMainContTop, "width": iMainContWidth, "height": iMainContHeight});

			if(sViewLoaderClass === "cViewLoaderBg")
			{
				var iHeaderHeight = $(to.elem).find(".cContHeader").height(),
				iViewLoaderBodyHeight =  iMainContHeight - iHeaderHeight,
				iViewLoaderBodyTop = iHeaderHeight;
				$(".cViewLoaderBody").css({"height": iViewLoaderBodyHeight, "margin-top": iViewLoaderBodyTop});
			}

			$("."+sViewLoaderClass).on("click touchstart touchmove", function(e)
			{
				e.stopPropagation();
			});
		}
		else
		{
			$("."+sViewLoaderClass).remove();
		}
	},

	__setHoverClass: function($oElem, sClass)
	{
		$oElem.on("touchstart", function(e)
		{
			$oElem.addClass(sClass);
		});

		$oElem.on("touchend", function(e)
		{
			$oElem.removeClass(sClass);
		});
	},

	_callCommonEvents: function()
	{
		var to = this;
		to._hideDatePicker();
		to._collapseSubmenu();
	},

	_resetSourceFetch: function()
	{
		var to = this;
		for(var iSourceIndex = 0; iSourceIndex < to.setting.calDataSource.length; iSourceIndex++)
		{
			var oSource = to.setting.calDataSource[iSourceIndex];
			oSource.fetched = false;
		}
	},

	// Public Method
	reloadData: function(oSourceURLParams)
	{
		var to = this;
		to.tv.sLoadType = "Load";
		to.tv.dLoadDt = new Date(to.setting.selectedDate);
		to.tv.oSURLParams = to.__parseJson(oSourceURLParams) || [];
		to._resetSourceFetch();
		to.__reloadCurrentView(true, true);
	},

	_setDisplayTimeLabelsArray: function()
	{
		var to = this;
		var sTimeToDisplay = "Array", iTempIndex;

		if($.cf.compareStrings(to.setting.timeLabels, "Hour") || $.cf.compareStrings(to.setting.timeLabels, "All"))
			sTimeToDisplay = to.setting.timeLabels;
		else if($.isArray(to.setting.timeLabels))
		{
			if(to.setting.timeLabels.length === to.tv.iUTmSlt)
			{
				sTimeToDisplay = "No";
				for(iTempIndex = 0; iTempIndex < to.tv.iUTmSlt; iTempIndex++)
				{
					if(! $.cf.compareStrings(typeof to.setting.timeLabels[iTempIndex], "boolean"))
					{
						sTimeToDisplay = "Array";
						break;
					}
				}
			}
		}

		if(!$.cf.compareStrings(sTimeToDisplay, "No"))
		{
			to.setting.timeLabels = [];
			for(iTempIndex = 0; iTempIndex < to.tv.iUTmSlt; iTempIndex++)
			{
				if($.cf.compareStrings(sTimeToDisplay, "Hour") || $.cf.compareStrings(sTimeToDisplay, "Array"))
				{
					if(iTempIndex === 0)
						to.setting.timeLabels.push(true);
					else
						to.setting.timeLabels.push(false);
				}
				else if($.cf.compareStrings(sTimeToDisplay, "All"))
					to.setting.timeLabels.push(true);
			}
		}
	},

	_getRestrictedSectionForCurrentView: function(dThisDate)
	{
		var to = this;
		var dArrTempResSec = [], iTempIndex;

		for(iTempIndex = 0; iTempIndex < to.tv.oAResSec.length; iTempIndex++)
		{
			var dTempResSec = to.tv.oAResSec[iTempIndex],
			bCompStartDates = (to.compareDates(new Date(dTempResSec.start), dThisDate) <= 0) ? true : false,
			bCompEndDates = (to.compareDates(new Date(dTempResSec.end), dThisDate) >= 0) ? true : false;
			if(bCompStartDates && bCompEndDates)
				dArrTempResSec.push(dTempResSec);
		}

		// ----------------------- Restricted Section Array Sorting Start ------------------------------

		var iNumOfTimes = dArrTempResSec.length;
		if(iNumOfTimes > 1)
		{
			for(iTempIndex = 0; iTempIndex < (iNumOfTimes - 1); iTempIndex++)
			{
				var dArrTempTimes1 = dArrTempResSec[iTempIndex];
				var dArrTempTimes2 = dArrTempResSec[(iTempIndex + 1)];

				if(to.compareDateTimes(new Date(dArrTempTimes1[0]), new Date(dArrTempTimes2[0])) === 0)
				{
					dArrTempResSec[iTempIndex] = dArrTempTimes2;
					dArrTempResSec[(iTempIndex + 1)] = dArrTempTimes1;
				}
			}
		}
		// ----------------------- Restricted Section Array Sorting End ------------------------------

		return dArrTempResSec;
	},

	_getBusinessDaysForWeek: function()
	{
		var to = this;
		var iTempIndex, iTempIndex1;
		to.setting.businessHoursSource = to.__parseJson(to.setting.businessHoursSource);
		to.tv.iBsDays = 0;
		to.tv.bABsDays = [false, false, false, false, false, false, false];

		for(iTempIndex = 0; iTempIndex < to.setting.businessHoursSource.length; iTempIndex++)
		{
			var oTempBusinessHours = to.setting.businessHoursSource[iTempIndex],
			oTempBusinessHourTimes = oTempBusinessHours.times;

			if($.cf.isValid(oTempBusinessHours.day))
				to.tv.bABsDays[oTempBusinessHours.day] = true;

			if($.cf.isValid(oTempBusinessHours.days))
			{
				for(iTempIndex1 = 0; iTempIndex1 < oTempBusinessHours.days.length; iTempIndex1++)
				{
					to.tv.bABsDays[oTempBusinessHours.days[iTempIndex1]] = true;
				}
			}

			for(var iTimeIndex = 0; iTimeIndex < oTempBusinessHourTimes.length; iTimeIndex++)
			{
				var oTempBusinessHourTime = oTempBusinessHourTimes[iTimeIndex];
				if(!$.cf.isValid(to.tv.oBsHours.start))
					to.tv.oBsHours.start = oTempBusinessHourTime.startTime;
				else
				{
					if(to._compareHours(oTempBusinessHourTime.startTime, to.tv.oBsHours.start) < 0)
						to.tv.oBsHours.start = oTempBusinessHourTime.startTime;
				}
				if(!$.cf.isValid(to.tv.oBsHours.end))
					to.tv.oBsHours.end = oTempBusinessHourTime.endTime;
				else
				{
					if(to._compareHours(oTempBusinessHourTime.endTime, to.tv.oBsHours.end) > 0)
						to.tv.oBsHours.end = oTempBusinessHourTime.endTime;
				}
			}
		}
		to.tv.oBsHours.startTime = to._getHourAndMinuteFromString(to.tv.oBsHours.start);
		to.tv.oBsHours.endTime = to._getHourAndMinuteFromString(to.tv.oBsHours.end);

		var iStartTimeRem = ((to.tv.oBsHours.startTime[0] * 60 + to.tv.oBsHours.startTime[1]) % to.setting.unitTimeInterval),
		iEndTimeRem = ((to.tv.oBsHours.endTime[0] * 60 + to.tv.oBsHours.endTime[1]) % to.setting.unitTimeInterval);

		if(iStartTimeRem !== 0)
		{
			to.tv.oBsHours.startTime[1] = to.tv.oBsHours.startTime[1] + iStartTimeRem;
			to.tv.oBsHours.start = to.tv.oBsHours.startTime[0] + ":" + to.tv.oBsHours.startTime[1];
		}
		if(iEndTimeRem !== 0)
		{
			to.tv.oBsHours.endTime[1] = to.tv.oBsHours.endTime[1] + iEndTimeRem;
			to.tv.oBsHours.end = to.tv.oBsHours.endTime[0] + ":" + to.tv.oBsHours.endTime[1];
		}

		for(iTempIndex = 0; iTempIndex < to.tv.bABsDays.length; iTempIndex++)
		{
			if(to.tv.bABsDays[iTempIndex])
				to.tv.iBsDays++;
		}
	},

	_compareHours: function(sDate1, sDate2)
	{
		var to = this;
		var sArrDate1 = to._getHourAndMinuteFromString(sDate1),
		sArrDate2 = to._getHourAndMinuteFromString(sDate2),
		dDate1 = new Date(), dDate2 = new Date();
		dDate1.setHours(parseInt(sArrDate1[0]));
		dDate1.setMinutes(parseInt(sArrDate1[1]));
		dDate2.setHours(parseInt(sArrDate2[0]));
		dDate2.setMinutes(parseInt(sArrDate2[1]));
		return to.compareDateTimes(dDate1, dDate2);
	},

	_getBusinessHoursForCurrentView: function(dThisDate)
	{
		var to = this;
		var iTempIndex,
		oThisDate = to.getDateInFormat({"date": dThisDate}, "object", false, true),
		oArrTempBusinessHours = [];
		for(iTempIndex = 0; iTempIndex < to.setting.businessHoursSource.length; iTempIndex++)
		{
			var oTempBusinessHours = to.setting.businessHoursSource[iTempIndex],
			bDayMatched = $.cf.isValid(oTempBusinessHours.day) && (oThisDate.D === parseInt(oTempBusinessHours.day)) ||
							  $.cf.isValid(oTempBusinessHours.days) && (oTempBusinessHours.days.indexOf(oThisDate.D) !== -1);

			if(bDayMatched)
			{
				for(var iTimesIndex = 0; iTimesIndex < oTempBusinessHours.times.length; iTimesIndex++)
				{
					var sArrTempTime = oTempBusinessHours.times[iTimesIndex],
					iArrStartTimes = to._getHourAndMinuteFromString(sArrTempTime.startTime),
					iArrEndTimes = to._getHourAndMinuteFromString(sArrTempTime.endTime),
					dStartDate = to.setDateInFormat({"iDate": {d: oThisDate.d, M: oThisDate.M, y: oThisDate.y, H: parseInt(iArrStartTimes[0]), m: parseInt(iArrStartTimes[1]), s: 0}}, ""),
					dEndDate = to.setDateInFormat({"iDate": {d: oThisDate.d, M: oThisDate.M, y: oThisDate.y, H: parseInt(iArrEndTimes[0]), m: parseInt(iArrEndTimes[1]), s: 0}}, "");
					if(to.compareDateTimes(dStartDate, dEndDate) < 0)
						oArrTempBusinessHours.push([dStartDate, dEndDate]);
				}
				break;
			}
		}

		// ------------------------ Sorting BusinessHours Start ----------------------------------
		var iNumOfTimes = oArrTempBusinessHours.length;
		if(iNumOfTimes > 1)
		{
			for(iTempIndex = 0; iTempIndex < (iNumOfTimes - 1); iTempIndex++)
			{
				var dArrTemp1 = oArrTempBusinessHours[iTempIndex],
				dArrTemp2 = oArrTempBusinessHours[(iTempIndex + 1)];
				if(to.compareDateTimes(dArrTemp1[0], dArrTemp2[0]) !== 0)
				{
					oArrTempBusinessHours[iTempIndex] = dArrTemp2;
					oArrTempBusinessHours[(iTempIndex + 1)] = dArrTemp1;
				}
			}
		}
		// ------------------------ Sorting BusinessHours End ----------------------------------

		return oArrTempBusinessHours;
	},

	_getHourAndMinuteFromString: function(sTempStartTime)
	{
		var to = this;
		var sArrTimes = sTempStartTime.split(" "),
		iArrTimes = sArrTimes[0].split(to.setting.formatSeparatorTime),
		iHours = iArrTimes[0],
		iMinutes = iArrTimes[1];
		if(sArrTimes.length > 1)
		{
			if($.cf.compareStrings(sArrTimes[1], "AM") && iHours === 12)
				iHours = 0;
			if($.cf.compareStrings(sArrTimes[1], "PM") && iHours < 12)
				iHours = iHours + 12;
		}
		return [iHours, iMinutes];
	},

	_checkAllowDroppable: function()
	{
		var to = this;

		to.tv.bChkDroppable = false;
		if(!to.setting.isNonBusinessHoursDroppable && !to.setting.isNonBusinessHoursDroppable)
			to.tv.bChkDroppable = true;

		var iTempIndex,
		bIsDraggable = 	to.setting.isDragNDropInMonthView ||
		 					to.setting.isDragNDropInDetailView ||
		 					to.setting.isDragNDropInQuickAgendaView ||
		 					to.setting.isDragNDropInTaskPlannerView;
		if(!to.tv.bChkDroppable && to.tv.oAResSec.length > 0 && bIsDraggable)
		{
			for(iTempIndex = 0; iTempIndex < to.tv.oAResSec.length; iTempIndex++)
			{
				var oResSec = to.tv.oAResSec[iTempIndex];
				if($.cf.isValid(oResSec.isDroppable) && oResSec.isDroppable)
				{
					to.tv.bChkDroppable = true;
					break;
				}
			}
		}
	},

	_findWhetherEventEnteredNonDroppableZone: function(dEventStartDate, dEventEndDate, bIsAllDay, iEventDays, sDroppableId)
	{
		var to = this;

		var bEventEntered = false,
		sArrDroppableId = $.cf.isValid(sDroppableId) ? sDroppableId.split(",") : [];

		if($.cf.isValid(dEventStartDate) && $.cf.isValid(dEventEndDate) && iEventDays > 0)
		{
			var iMaxTimeSlots = 24 * to.tv.iUTmSlt,
			iDateIndex, iSlotsIndex, iTempIndex,
			bArrEvSlots, iEventSlots, iDayIndex,
			iDroppableIndex, iDroppableIndex1, iDroppableIndex2;

			iEventSlots = Math.round((dEventEndDate.getTime() - dEventStartDate.getTime()) / to.tv.iUTmMS);
			iEventSlots = (iEventSlots === 0) ? 1 : iEventSlots;

			sDroppableId = $.cf.isValid(sDroppableId) ? sDroppableId : "";

			var dThisTempDate = to._normalizeDateTime(dEventStartDate, "START", "T"),
			iThisTempDate = dThisTempDate.getTime();

			for(iDateIndex = 0; iDateIndex < iEventDays; iDateIndex++)
			{
				if(to.tv.bABsDays[dThisTempDate.getDay()] || !to.setting.excludeNonBusinessHours)
				{
					for(iDayIndex = 0; iDayIndex < to.tv.dAVDt.length; iDayIndex++)
					{
						if(to.tv.dAVDt[iDayIndex].getDay() === dThisTempDate.getDay())
							break;
					}

					// ---------------------- Set Array Of Event TimeSlots Start -------------------

					bArrEvSlots = [];
					for(var iHoursIndex = 0; iHoursIndex < 24; iHoursIndex++)
					{
						for(iSlotsIndex = 0; iSlotsIndex < to.tv.iUTmSlt; iSlotsIndex++)
							bArrEvSlots.push(0);
					}
					bArrEvSlots.push(0); // For All Day

					// ---------------------- Set Array Of Event TimeSlots End ----------------------

					var dArrTempResSec = to._getRestrictedSectionForCurrentView(dThisTempDate),
					oArrTempBusinessHours = to._getBusinessHoursForCurrentView(dThisTempDate),
					bAllowedInResSec = false,
					bNotAllowedInResSec = false;

					// --------------- Set RestrictedSection Date Array Indicator Start ---------------------------------

					if(dArrTempResSec.length > 0)
					{
						bEventEntered = false;
						for(iTempIndex = 0; iTempIndex < dArrTempResSec.length; iTempIndex++)
						{
							var dArrResSec = dArrTempResSec[iTempIndex],
							dResSecStart = new Date(dArrResSec.start),
							dResSecEnd = new Date(dArrResSec.end),
							bResSecAllDay = $.cf.isValid(dArrResSec.isAllDay) ? dArrResSec.isAllDay : false,
							sResSecDroppableId = $.cf.isValid(dArrResSec.droppableId) ? dArrResSec.droppableId : "",
							bResSecIsDroppable = $.cf.isValid(dArrResSec.isDroppable) ? dArrResSec.isDroppable : to.setting.isRestrictedSectionDroppable,
							sArrAllowedDroppables = $.cf.isValid(dArrResSec.allowedDroppables) ? dArrResSec.allowedDroppables : [],
							iCompResSecSDT = to.compareDateTimes(dResSecStart, dEventStartDate),
							iCompResSecEDT = to.compareDateTimes(dResSecEnd, dEventEndDate),
							iCompResSecSEDT = to.compareDateTimes(dResSecStart, dEventEndDate),
							iCompResSecESDT = to.compareDateTimes(dResSecEnd, dEventStartDate),
							bCompStart = (to.compareDates(dThisTempDate, dResSecStart) === 0),
							bCompEnd = (to.compareDates(dThisTempDate, dResSecEnd) === 0),
							iResSecSlots = 0;

							if(!bCompStart)
								dResSecStart = to._normalizeDateTime(dThisTempDate, "START", "T");
							if(!bCompEnd)
								dResSecEnd = to._normalizeDateTime(dThisTempDate, "END", "T");

							iResSecSlots = Math.round((dResSecEnd.getTime() - dResSecStart.getTime()) / to.tv.iUTmMS);
							iResSecSlots = (iResSecSlots === 0) ? 1 : (iResSecSlots > iMaxTimeSlots) ? iMaxTimeSlots : iResSecSlots;

							if(bIsAllDay || iEventSlots >= iMaxTimeSlots)
							{
								if((bIsAllDay && bResSecAllDay) || (iCompResSecSDT === 0 && iCompResSecEDT === 0))
									return true;
							}
							else if(iCompResSecSDT <= 0 && iCompResSecEDT >= 0)
							{
								if(!bResSecIsDroppable)
									bNotAllowedInResSec = true; // return true;

								if(!
									(iCompResSecSDT > 0 && iCompResSecEDT > 0 && iCompResSecSEDT < 0) ||
									(iCompResSecSDT < 0 && iCompResSecEDT < 0 && iCompResSecESDT > 0)
								)
								{
									if(!bResSecIsDroppable)
										bNotAllowedInResSec = true; // return true;
									else
									{
										var bAllowAll = false;
										if(sArrAllowedDroppables.length === 0)
											bAllowedInResSec = true;
										else
										{
											for(iDroppableIndex = 0; iDroppableIndex < sArrAllowedDroppables.length; iDroppableIndex++)
											{
												if($.cf.compareStrings(sArrAllowedDroppables[iDroppableIndex], "All"))
												{
													bAllowAll = true;
													bAllowedInResSec = true;
													break;
												}
											}

											if(!bAllowAll)
											{
												if($.cf.isValid(sDroppableId))
												{
													if(sArrDroppableId.length === 1 && sDroppableId === sResSecDroppableId)
														bAllowedInResSec = true;
													else
													{
														for(iDroppableIndex1 = 0; iDroppableIndex1 < sArrDroppableId.length; iDroppableIndex1++)
														{
															var sTempDroppableId = sArrDroppableId[iDroppableIndex1];
															if(sTempDroppableId !== sResSecDroppableId)
															{
																var bAllowed = false;
																for(iDroppableIndex2 = 0; iDroppableIndex2 < sArrAllowedDroppables.length; iDroppableIndex2++)
																{
																	if($.cf.compareStrings(sArrAllowedDroppables[iDroppableIndex2], sTempDroppableId))
																	{
																		bAllowed = true;
																		bAllowedInResSec = true;
																		break;
																	}
																}
																if(!bAllowed)
																	bNotAllowedInResSec = true; // return true;
															}
															else
																bAllowedInResSec = true;
														}
													}
												}
												else
													bNotAllowedInResSec = true; // return true;
											}
										}
									}
								}
							}
							else if(
								(iCompResSecSDT >= 0 && iCompResSecEDT >= 0 && iCompResSecSEDT < 0) ||
								(iCompResSecSDT <= 0 && iCompResSecEDT <= 0 && iCompResSecESDT > 0)
							)
							{
								//if(!bResSecIsDroppable || (bResSecIsDroppable && sResSecDroppableId !== sDroppableId))
								//	return true;

								bNotAllowedInResSec = true; // return true;
							}
						}

						if(bAllowedInResSec)
							return false;
						if(bNotAllowedInResSec)
							return true;
						if($.cf.isValid(sDroppableId))
							return true;
					}

					// --------------- Set RestrictedSection Date Array Indicator End -----------------------------------

					// ---------------------- Set Available Date Array Indicator Start --------------------------

					if(oArrTempBusinessHours.length > 0 && !to.setting.isNonBusinessHoursDroppable)
					{
						bEventEntered = true;
						for(iTempIndex = 0; iTempIndex < oArrTempBusinessHours.length; iTempIndex++)
						{
							var dArrTempAvailable = oArrTempBusinessHours[iTempIndex],
							dTempAvailableStart = new Date(dArrTempAvailable[0]),
							dTempAvailableEnd = new Date(dArrTempAvailable[1]),
							iCompAvSDT = to.compareDateTimes(dTempAvailableStart, dEventStartDate),
							iCompAvEDT = to.compareDateTimes(dTempAvailableEnd, dEventEndDate);

							if(bIsAllDay)
							{
								if(!to.tv.bABsDays[dThisTempDate.getDay()])
									return true;
								else
									bEventEntered = false;
							}

							if(iCompAvSDT <= 0 && iCompAvEDT >= 0)
								bEventEntered = false && bEventEntered;
							else
								bEventEntered = true && bEventEntered;
						}
						if(bEventEntered)
							return true;
					}
					else
					{
						if(!to.setting.isNonBusinessHoursDroppable)
							return true;
					}

					// ----------------------- Set Available Date Array Indicator End ---------------------------
				}
				//else
				//	console.log("Non Business Day");

				iThisTempDate += $.CalenStyle.extra.iMS.d;
				dThisTempDate = new Date(iThisTempDate);
			}
		}

		return bEventEntered;
	},

	//--------------------------------- View Related Functions Start ----------------------------------

	// Public Method
	modifySettings: function(oOptions)
	{
		var to = this;
		var iTempPluginObjCount = to.tv.pluginId;

		to.setting = $.extend({}, $.CalenStyle.defaults, oOptions);
		to.tv = $.extend({}, $.CalenStyle.tempDefaults);

		to.tv.pluginId = iTempPluginObjCount;
		to.tv.iUTmMS = to.setting.unitTimeInterval * $.CalenStyle.extra.iMS.m;
		to.tv.iUTmSlt = (60 / to.setting.unitTimeInterval);
	},

	// Public Method
	loadView: function()
	{
		var to = this;

		if(!$(to.elem).hasClass("cElemDatePicker"))
			$(to.elem).addClass("elem-CalenStyle");

		$(to.elem).html("<div class='calendarCont'></div>");
		if(to.setting.viewsToDisplay.length > 1)
		{
			for(var iTempIndex1 = 0; iTempIndex1 < to.setting.viewsToDisplay.length; iTempIndex1++)
			{
				var oViewToDisplay = to.setting.viewsToDisplay[iTempIndex1],
				sViewName = oViewToDisplay.viewName || "";
				if($.cf.compareStrings(sViewName, to.setting.visibleView))
					to.tv.bDisMenu = true;
			}
		}

		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.bViewLoaded = false;

		to._getBusinessDaysForWeek();
		to._checkAllowDroppable();
		to._setDisplayTimeLabelsArray();
		to._resetSourceFetch();

		var sUA = navigator.userAgent,
		sBRClass = "br-other";
		if(/(ipod|iphone|ipad)/i.test(sUA))
			sBRClass = "br-ios";
		else if (/opera|opr/i.test(sUA))
			sBRClass = "br-opera";
		else if (/msie|trident/i.test(sUA))
			sBRClass = "br-ie";
		else if (/chrome.+? edge/i.test(sUA))
			sBRClass = "br-ie";
		else if (/chrome|crios|crmo/i.test(sUA))
			sBRClass = "br-chrome";
		else if (/firefox|iceweasel/i.test(sUA))
			sBRClass = "br-firefox";
		else if (/safari/i.test(sUA))
			sBRClass = "br-safari";

		$("body").addClass(sBRClass);

		var iScrollbarWidth;
		if(!$.CalenStyle.extra.bTouchDevice)
		{
			var isWebKit = 'WebkitAppearance' in document.documentElement.style;
			if(isWebKit)
				iScrollbarWidth = 5;
			else
			{
				var eDiv = document.createElement('div');
				eDiv.innerHTML = "<div style='width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;'><div style='width:1px;height:100px;'></div></div>";
				eDiv = eDiv.firstChild;
				document.body.appendChild(eDiv);
				var iWidth = eDiv.offsetWidth - eDiv.clientWidth;
				document.body.removeChild(eDiv);
				iScrollbarWidth =  iWidth;
			}
			$(".calendarCont").addClass("calendarContWeb");
		}
		else
		{
			iScrollbarWidth = 2;
			$(".calendarCont").addClass("calendarContMobile");
		}
		$.CalenStyle.extra.iScrollbarWidth = iScrollbarWidth;

		to.setCurrentView(to.setting.visibleView, true);
	},

	// Public Method
	setCurrentView: function(sThisView, bLoadData)
	{
		var to = this;
		to.setting.visibleView = sThisView;

		var $oCalendarCont = $(to.elem).find(".calendarCont");
		$oCalendarCont.removeClass("cmvCalendarCont cdvCalendarCont cdlvCalendarCont cagvCalendarCont cagvTimeline1 cagvTimeline2 cagvTimeline3 cavCalendarCont cqavCalendarCont");
		$(to.elem).find(".calendarCont").html("");
		$oCalendarCont.css({"width": "100%", "height": "100%"});
		$oCalendarCont.removeClass("cmvCalendarContWithBorders");

		if($.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DetailedMonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
		{
			$oCalendarCont.addClass("cmvCalendarCont");

			if(!$.cf.compareStrings(to.setting.visibleView, "DatePicker"))
				$oCalendarCont.addClass("cmvCalendarContWithBorders");
		}
		else if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
		{
			$oCalendarCont.addClass("cdlvCalendarCont");

			to.tv.iNoVDay = to.setting.daysInDayListView;
			if(to.tv.iNoVDay === 7 && to.setting.excludeNonBusinessHours)
				to.tv.iNoVDay -= (to.tv.iNoVDay - to.tv.iBsDays);
			to.tv.iSelDay = Math.floor(to.tv.iNoVDay / 2);
			to.tv.iNoVDayDis = 1;
		}
		else if($.cf.compareStrings(to.setting.visibleView, "AppointmentView"))
		{
			$oCalendarCont.addClass("cavCalendarCont");

			to.tv.iNoVDay = to.setting.daysInAppointmentView;
			if(to.tv.iNoVDay === 7 && to.setting.excludeNonBusinessHours)
				to.tv.iNoVDay -= (to.tv.iNoVDay - to.tv.iBsDays);
			to.tv.iNoVDayDis = to.tv.iNoVDay;
		}
		else if($.cf.compareStrings(to.setting.visibleView, "AgendaView"))
		{
			$oCalendarCont.addClass("cagvCalendarCont");

			if(!$.cf.isValid(to.setting.displayEventsForPeriodInListInAgendaView))
			{
				if($.cf.compareStrings(to.setting.agendaViewTheme, "Timeline1"))
					$oCalendarCont.addClass("cagvTimeline1");
				else if($.cf.compareStrings(to.setting.agendaViewTheme, "Timeline2"))
					$oCalendarCont.addClass("cagvTimeline2");
				else if($.cf.compareStrings(to.setting.agendaViewTheme, "Timeline3"))
					$oCalendarCont.addClass("cagvTimeline3");
			}

			if(!$.cf.compareStrings(to.setting.agendaViewDuration, "Month"))
			{
				if($.cf.compareStrings(to.setting.agendaViewDuration, "Week"))
					to.tv.iNoVDay = 7;
				else if($.cf.compareStrings(to.setting.agendaViewDuration, "CustomDays"))
					to.tv.iNoVDay = to.setting.daysInAgendaView;

				if(to.tv.iNoVDay === 7 && to.setting.excludeNonBusinessHours)
					to.tv.iNoVDay -= (to.tv.iNoVDay - to.tv.iBsDays);
				to.tv.iNoVDayDis = to.tv.iNoVDay;
			}
		}
		else if($.cf.compareStrings(to.setting.visibleView, "WeekPlannerView"))
		{
			$oCalendarCont.addClass("cwpvCalendarCont");

			to.tv.iNoVDay = 7;
			//if(to.tv.iNoVDay === 7 && to.setting.excludeNonBusinessHours)
			//	to.tv.iNoVDay -= (to.tv.iNoVDay - to.tv.iBsDays);
			to.tv.iNoVDayDis = to.tv.iNoVDay;
		}
		else if($.cf.compareStrings(to.setting.visibleView, "QuickAgendaView"))
		{
			$oCalendarCont.addClass("cqavCalendarCont");

			if($.cf.compareStrings(to.setting.quickAgendaViewDuration, "Week"))
				to.tv.iNoVDay = 7;
			else if($.cf.compareStrings(to.setting.quickAgendaViewDuration, "CustomDays"))
				to.tv.iNoVDay = to.setting.daysInQuickAgendaView;

			if(to.tv.iNoVDay === 7 && to.setting.excludeNonBusinessHours)
				to.tv.iNoVDay -= (to.tv.iNoVDay - to.tv.iBsDays);
			to.tv.iNoVDayDis = to.tv.iNoVDay;
		}
		else if($.cf.compareStrings(to.setting.visibleView, "TaskPlannerView"))
		{
			$oCalendarCont.addClass("ctpvCalendarCont");

			if($.cf.compareStrings(to.setting.taskPlannerViewDuration, "Week"))
				to.tv.iNoVDay = 7;
			else if($.cf.compareStrings(to.setting.taskPlannerViewDuration, "CustomDays"))
				to.tv.iNoVDay = to.setting.daysInTaskPlannerView;

			if(to.tv.iNoVDay === 7 && to.setting.excludeNonBusinessHours)
				to.tv.iNoVDay -= (to.tv.iNoVDay - to.tv.iBsDays);
			to.tv.iNoVDayDis = to.tv.iNoVDay;
		}
		else
		{
			$oCalendarCont.addClass("cdvCalendarCont");

			if($.cf.compareStrings(to.setting.visibleView, "WeekView"))
			{
				to.tv.iNoVDay = 7;
				if(to.tv.iNoVDay === 7 && to.setting.excludeNonBusinessHours)
					to.tv.iNoVDay -= (to.tv.iNoVDay - to.tv.iBsDays);
				to.tv.iNoVDayDis = to.tv.iNoVDay;
			}
			else if($.cf.compareStrings(to.setting.visibleView, "DayView"))
			{
				to.tv.iNoVDay = 1;
				to.tv.iNoVDayDis = 1;
			}
			else if($.cf.compareStrings(to.setting.visibleView, "CustomView"))
			{
				to.tv.iNoVDay = to.setting.daysInCustomView;
				if(to.tv.iNoVDay === 7 && to.setting.excludeNonBusinessHours)
					to.tv.iNoVDay -= (to.tv.iNoVDay - to.tv.iBsDays);
				to.tv.iNoVDayDis = to.tv.iNoVDay;
			}
			else if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
			{
				to.tv.iNoVDay = to.setting.daysInDayListView;
				if(to.tv.iNoVDay === 7 && to.setting.excludeNonBusinessHours)
					to.tv.iNoVDay -= (to.tv.iNoVDay - to.tv.iBsDays);
				to.tv.iNoVDayDis = 1;
			}
		}

		to.__getCurrentViewDates();
		to._addCommonView(bLoadData);
	},

	//--------------------------------- View Related Functions End ---------------------------------

	//--------------------------------- Header Related Functions Start ---------------------------------

	_addContHeader: function()
	{
		var to = this;
		var sTemplate = "",
		iTempIndex, sArrHeaderSections;

		// Left Section
		sTemplate += "<div class='cContHeaderSections cContHeaderSectionLeft'>";
		sArrHeaderSections = to.setting.headerSectionsList.left || [];
		for(iTempIndex = 0; iTempIndex < sArrHeaderSections.length; iTempIndex++)
		{
			sTemplate += to._addHeaderSections(sArrHeaderSections[iTempIndex]);
		}
		sTemplate += "</div>";

		// Right Section
		sTemplate += "<div class='cContHeaderSections cContHeaderSectionRight'>";
		sArrHeaderSections = to.setting.headerSectionsList.right || [];
		for(iTempIndex = 0; iTempIndex < sArrHeaderSections.length; iTempIndex++)
		{
			sTemplate += to._addHeaderSections(sArrHeaderSections[iTempIndex]);
		}
		sTemplate += "</div>";

		// Center Section
		sTemplate += "<div class='cContHeaderSections cContHeaderSectionCenter'>";
		sArrHeaderSections = to.setting.headerSectionsList.center || [];
		for(iTempIndex = 0; iTempIndex < sArrHeaderSections.length; iTempIndex++)
		{
			sTemplate += to._addHeaderSections(sArrHeaderSections[iTempIndex]);
		}
		sTemplate += "</div>";

		return sTemplate;
	},

	_addHeaderSections: function(sSectionName)
	{
		var to = this;
		var sTemp = "", bFullscreen = to._isFullScreen();

		if($.cf.compareStrings(sSectionName, "DatePickerIcon"))
			sTemp += to.setting.headerComponents.DatePickerIcon;
		else if($.cf.compareStrings(sSectionName, "FullscreenButton"))
			sTemp += to.setting.headerComponents.FullscreenButton(bFullscreen);
		else if($.cf.compareStrings(sSectionName, "PreviousButton"))
			sTemp += to.setting.headerComponents.PreviousButton;
		else if($.cf.compareStrings(sSectionName, "NextButton"))
			sTemp += to.setting.headerComponents.NextButton;
		else if($.cf.compareStrings(sSectionName, "TodayButton"))
			sTemp += to.setting.headerComponents.TodayButton;
		else if($.cf.compareStrings(sSectionName, "HeaderLabel"))
			sTemp += to.setting.headerComponents.HeaderLabel;
		else if($.cf.compareStrings(sSectionName, "HeaderLabelWithDropdownMenuArrow"))
			sTemp += to.setting.headerComponents.HeaderLabelWithDropdownMenuArrow;
		else if($.cf.compareStrings(sSectionName, "MenuSegmentedTab") && to.tv.bDisMenu)
			sTemp += to.setting.headerComponents.MenuSegmentedTab;
		else if($.cf.compareStrings(sSectionName, "MenuDropdownIcon") && to.tv.bDisMenu)
			sTemp += to.setting.headerComponents.MenuDropdownIcon;

		return sTemp;
	},

	_updateViewSelectionMenu: function()
	{
		var to = this;
		var sTemplate = "", iTempIndex1;

		sTemplate += "<ul class='cContHeaderMenuSections'>";

		if(to.setting.dropdownMenuElements.length > 0 && $.cf.compareStrings(to.setting.dropdownMenuElements[0], "DatePicker"))
			sTemplate += "<li id='cContHeaderMenuDatePicker' name='DatePicker' class='cContHeaderButton clickableLink'>Date Picker</li>";

		for(iTempIndex1 = 0; iTempIndex1 < to.setting.viewsToDisplay.length; iTempIndex1++)
		{
			var oViewToDisplay = to.setting.viewsToDisplay[iTempIndex1],
			sViewName = oViewToDisplay.viewName || "",
			sViewNameDisplay = oViewToDisplay.viewDisplayName || "";

			if($.cf.compareStrings(sViewNameDisplay, ""))
			{
				if($.cf.compareStrings(sViewName, "DetailedMonthView") || $.cf.compareStrings(sViewName, "MonthView") || $.cf.compareStrings(sViewName, "DatePicker"))
					sViewNameDisplay = "Month";
				else if($.cf.compareStrings(sViewName, "WeekView"))
					sViewNameDisplay = "Week";
				else if($.cf.compareStrings(sViewName, "DayView") || $.cf.compareStrings(sViewName, "DayEventListView") || $.cf.compareStrings(sViewName, "DayEventDetailView"))
					sViewNameDisplay = "Day";
				else if($.cf.compareStrings(sViewName, "CustomView"))
					sViewNameDisplay = to.setting.daysInCustomView + " Days";
				else if($.cf.compareStrings(sViewName, "QuickAgendaView"))
					sViewNameDisplay = "Quick Agenda";
				else if($.cf.compareStrings(sViewName, "TaskPlannerView"))
					sViewNameDisplay = "Task Planner";
				else if($.cf.compareStrings(sViewName, "AppointmentView"))
					sViewNameDisplay = "Appointment";
				else if($.cf.compareStrings(sViewName, "AgendaView"))
					sViewNameDisplay = "Agenda";
				else if($.cf.compareStrings(sViewName, "WeekPlannerView"))
					sViewNameDisplay = "Week Planner";
			}

			sTemplate += "<li id='"+("cContHeaderMenu"+sViewName)+"' name='" + sViewName + "' class='cContHeaderButton clickableLink'>" + sViewNameDisplay + "</li>";
		}

		if(to.setting.dropdownMenuElements.length > 1 && $.cf.compareStrings(to.setting.dropdownMenuElements[1], "DatePicker"))
			sTemplate += "<li id='cContHeaderMenuDatePicker' name='DatePicker' class='cContHeaderButton clickableLink'>Date Picker</li>";

		sTemplate += "</ul>";

		return sTemplate;
	},

	_refreshHeader: function()
	{
		var to = this;
		if($(to.elem).find(".cContHeader").length > 0)
			$(to.elem).find(".cContHeader").html(to._addContHeader());
		to._addMenuItemsInSegmentedTab();
		to._addEventsToHeaderElements();
		to._adjustViewSelectionMenu();
	},

	_addEventsToHeaderElements: function()
	{
		var to = this;

		$(to.elem).find(".cContHeaderMenuDropdown .cContHeaderMenuSections li").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();
		});

		$(to.elem).find(".cContHeaderPrevButton").on($.CalenStyle.extra.sClickHandlerButtons, function(e)
		{
			e.stopPropagation();
			to.navigateToPrevView();
		});

		$(to.elem).find(".cContHeaderNextButton").on($.CalenStyle.extra.sClickHandlerButtons, function(e)
		{
			e.stopPropagation();
			to.navigateToNextView();
		});

		$(to.elem).find(".cContHeaderToday").html(to.getNumberStringInFormat($.CalenStyle.extra.dToday.getDate(), 0, true));
		$(to.elem).find(".cContHeaderToday").on($.CalenStyle.extra.sClickHandlerButtons, function(e)
		{
			e.stopPropagation();
			to.navigateToToday();
		});

		to._addEventsForMenu();

		$(to.elem).find(".cContHeaderMenuButton").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();
			if($(to.elem).find(".cContHeaderMenuDropdown").length > 0)
				to._collapseSubmenu();
			else
				to._expandSubmenu();
		});

		$(to.elem).find(".cContHeaderDatePickerIcon").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();
			to._showOrHideDatePicker();
		});

		if($(to.elem).find(".cContHeaderDropdownMenuArrow").length > 0)
		{
			if(to.setting.dropdownMenuElements.length === 1 && $.cf.compareStrings(to.setting.dropdownMenuElements[0], "DatePicker"))
			{
				$(to.elem).find(".cContHeaderLabelOuter").on($.CalenStyle.extra.sClickHandler, function(e)
				{
					e.stopPropagation();
					to._showOrHideDatePicker();
				});
			}

			var bViewsToDisplay = false;
			for(var iTempIndex = 0; iTempIndex < to.setting.dropdownMenuElements.length; iTempIndex++)
			{
				if($.cf.compareStrings(to.setting.dropdownMenuElements[iTempIndex], "ViewsToDisplay"))
				{
					bViewsToDisplay = true;
					break;
				}
			}

			if(bViewsToDisplay)
			{
				$(to.elem).find(".cContHeaderLabelOuter").on($.CalenStyle.extra.sClickHandler, function(e)
				{
					e.stopPropagation();

					if($(to.elem).find(".cContHeaderMenuDropdown").length > 0)
						to._collapseSubmenu();
					else
						to._expandSubmenu();
				});
			}
		}

		$(to.elem).find(".cContHeaderFullscreen").on($.CalenStyle.extra.sClickHandlerButtons, function(e)
		{
			e.stopPropagation();
			to._toggleFullscreen();
		});

		if(to.setting.addEventHandlersInHeader)
			to.setting.addEventHandlersInHeader.call(to);

		if(to.setting.useHammerjsAsGestureLibrary)
		{
			var oHammer1 = new Hammer(to.elem, {
                threshold: 0,
                velocity: 0
            });

			oHammer1.on("swiperight", function(e)
			{
				to.navigateToPrevView();
			});

			oHammer1.on("swipeleft", function(e)
			{
				to.navigateToNextView();
			});
		}
	},

	_addMenuItemsInSegmentedTab: function()
	{
		var to = this;
		$(to.elem).find(".cContHeaderMenuSegmentedTab").html(to._updateViewSelectionMenu());
	},

	_expandSubmenu: function()
	{
		var to = this;

		var sTemplate = "";
		sTemplate += "<div class='cContHeaderMenuDropdownBg'>";
		sTemplate += "<div class='cContHeaderMenuDropdown'>";
		sTemplate += to._updateViewSelectionMenu();
		sTemplate += "</div>";
		sTemplate += "</div>";
		$(to.elem).find(".calendarContInner").append(sTemplate);

		if($(to.elem).find(".cContHeaderMenuDropdownBg").length > 0)
		{
			var iMainContLeft, iMainContTop, iMainContWidth, iMainContHeight;
			var $oContOuter = $(to.elem);

			iMainContLeft = 0;
			iMainContTop = 0;
			iMainContWidth = $oContOuter.width();
			iMainContHeight = $oContOuter.height();
			$(to.elem).find(".cContHeaderMenuDropdownBg").css({"left": iMainContLeft, "top": iMainContTop, "width": iMainContWidth, "height": iMainContHeight});

			var iDropdownLeft, iDropdownTop, iDropdownWidth, iDropdownMaxWidth;
			var $occcContHeaderMenuButton = $(to.elem).find(".cContHeaderMenuButton");
			var $occcContHeaderDropdownMenuArrow = $(to.elem).find(".cContHeaderDropdownMenuArrow");
			var iMainContMaxWidth = iMainContLeft + iMainContWidth;
			iDropdownWidth = $(to.elem).find(".cContHeaderMenuDropdown").width();
			if($occcContHeaderMenuButton.length > 0)
			{
				iDropdownLeft = $occcContHeaderMenuButton.position().left - 5 + $(to.elem).find(".calendarContInner").position().left;

				iDropdownMaxWidth = iMainContLeft + iDropdownLeft + iDropdownWidth;
				if(iDropdownMaxWidth > iMainContMaxWidth)
					iDropdownLeft = iMainContWidth - iDropdownWidth - 5;
				iDropdownTop = $occcContHeaderMenuButton.height() + 5 + $(to.elem).find(".calendarContInner").position().top + ($.cf.compareStrings(to.setting.sectionsList[0], "ActionBar") ? $(to.elem).find(".cActionBar").height() : 0);

				$(".cContHeaderMenuDropdown").css({"left": iDropdownLeft, "top": iDropdownTop});
			}
			else if($occcContHeaderDropdownMenuArrow.length > 0)
			{
				var $occCContHeaderLabel = $(to.elem).find(".cContHeaderLabelOuter"),
				iContHeaderLabelWidth = $occCContHeaderLabel.width(),
				iContHeaderLabelLeft = $occCContHeaderLabel.position().left,
				iContHeaderLabelMid = (iContHeaderLabelLeft + (iContHeaderLabelWidth/2)),
				iDropdownWidthHalf = (iDropdownWidth/2);

				iDropdownLeft = iContHeaderLabelMid - iDropdownWidthHalf;
				if(iDropdownLeft < 0)
					iDropdownLeft = 5;
				iDropdownMaxWidth = iDropdownLeft + iDropdownWidth;
				if(iDropdownMaxWidth > iMainContMaxWidth)
					iDropdownLeft = iMainContWidth - iDropdownWidth - 5;

				iDropdownTop = $(to.elem).find(".cContHeaderLabelOuter").height() + $(to.elem).find(".calendarContInner").position().top + ($.cf.compareStrings(to.setting.sectionsList[0], "ActionBar") ? $(to.elem).find(".cActionBar").height() : 0);

				$(".cContHeaderMenuDropdown").css({"left": iDropdownLeft, "top": iDropdownTop});
			}
		}

		to._addEventsForMenu();
	},

	_collapseSubmenu: function()
	{
		var to = this;
		var $occCContHeaderMenuDropdown = $(to.elem).find(".cContHeaderMenuDropdownBg");
		if($occCContHeaderMenuDropdown.length > 0)
		{
			$occCContHeaderMenuDropdown.hide(10);
			setTimeout(function()
			{
				$occCContHeaderMenuDropdown.remove();
			}, 10);
		}

		to.addRemoveViewLoader(false, "cViewLoaderBg");
	},

	_addEventsForMenu: function()
	{
		var to = this;

		$(to.elem).find(".cContHeaderMenuSegmentedTab .cContHeaderMenuSections li").removeClass("cSelectedMenu");
		$(to.elem).find(".cContHeaderMenuSegmentedTab #cContHeaderMenu"+to.setting.visibleView).addClass("cSelectedMenu");

		$(to.elem).find(".cContHeaderMenuDropdownBg .cContHeaderMenuSections li").removeClass("cSelectedMenu");
		$(to.elem).find(".cContHeaderMenuDropdownBg #cContHeaderMenu"+to.setting.visibleView).addClass("cSelectedMenu");

		$(to.elem).find(".cContHeaderMenuSections li").on($.CalenStyle.extra.sClickHandlerButtons, function(e)
		{
			e.stopPropagation();

			var sViewName = $(this).attr("name");

			$(to.elem).find(".cContHeaderMenuSegmentedTab .cContHeaderMenuSections li").removeClass("cSelectedMenu");
			$(to.elem).find(".cContHeaderMenuSegmentedTab #cContHeaderMenu"+sViewName).addClass("cSelectedMenu");

			$(to.elem).find(".cContHeaderMenuDropdownBg .cContHeaderMenuSections li").removeClass("cSelectedMenu");
			$(to.elem).find(".cContHeaderMenuDropdownBg #cContHeaderMenu"+sViewName).addClass("cSelectedMenu");

			if(!$.cf.compareStrings(sViewName, "DatePicker"))
			{
				if(!$.cf.compareStrings(sViewName, to.setting.visibleView))
				{
					to.addRemoveViewLoader(true, "cViewLoaderBg");

					setTimeout(function()
					{
						to.setCurrentView(sViewName, false);

						if(to.setting.visibleViewChanged)
							to.setting.visibleViewChanged.call(to, to.setting.visibleView, to.setting.selectedDate, to.tv.dAVDt);
						to._reloadDatePickerContent();

						to._collapseSubmenu();
					}, 2);
				}
			}
			else
			{
				to._collapseSubmenu();
				setTimeout(function()
				{
					to._showOrHideDatePicker();
				}, 100);
			}
		});

		$(to.elem).find(".cContHeaderMenuDropdownBg").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			to._collapseSubmenu();
		});

		if(!$.cf.compareStrings(to.setting.visibleView, "DatePicker"))
		{
			if(to.setting.datePickerObject === null)
				to._addDatePicker();
			else
				to.setting.datePickerObject.refreshView();
		}
	},

	// Public Method
	navigateToToday: function()
	{
		var to = this;
		to.setting.selectedDate = to.setDateInFormat({"date": to._getCurrentDate()}, "START");
		to.reloadData();

		if(to.setting.todayButtonClicked)
			to.setting.todayButtonClicked.call(to, to.setting.selectedDate, to.tv.dAVDt);

		to.__reloadDatePickerContentOnNavigation();
	},

	// Public Method
	navigateToPrevView: function()
	{
		var to = this;
		$(to.elem).find(".cListOuterCont").html("");

		if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView") || $.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
			to.__goToPrevMonthView();
		else if($.cf.compareStrings(to.setting.visibleView, "WeekView") || $.cf.compareStrings(to.setting.visibleView, "DayView") || $.cf.compareStrings(to.setting.visibleView, "CustomView") || $.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
			to.__goToPrevDetailView();
		else if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
			to.__goToPrevDayListView();
		else if($.cf.compareStrings(to.setting.visibleView, "QuickAgendaView"))
			to.__goToPrevQuickAgendaView();
		else if($.cf.compareStrings(to.setting.visibleView, "TaskPlannerView"))
			to.__goToPrevTaskPlannerView();
		else if($.cf.compareStrings(to.setting.visibleView, "AppointmentView"))
			to.__goToPrevAppointmentView();
		else if($.cf.compareStrings(to.setting.visibleView, "AgendaView"))
			to.__goToPrevAgendaView();
		else if($.cf.compareStrings(to.setting.visibleView, "WeekPlannerView"))
			to.__goToPrevWeekPlannerView();

		if(to.setting.previousButtonClicked)
			to.setting.previousButtonClicked.call(to, to.setting.selectedDate, to.tv.dAVDt);
	},

	// Public Method
	navigateToNextView: function()
	{
		var to = this;
		$(to.elem).find(".cListOuterCont").html("");

		if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView") || $.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
			to.__goToNextMonthView();
		else if($.cf.compareStrings(to.setting.visibleView, "WeekView") || $.cf.compareStrings(to.setting.visibleView, "DayView") || $.cf.compareStrings(to.setting.visibleView, "CustomView") || $.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
			to.__goToNextDetailView();
		else if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
			to.__goToNextDayListView();
		else if($.cf.compareStrings(to.setting.visibleView, "QuickAgendaView"))
			to.__goToNextQuickAgendaView();
		else if($.cf.compareStrings(to.setting.visibleView, "TaskPlannerView"))
			to.__goToNextTaskPlannerView();
		else if($.cf.compareStrings(to.setting.visibleView, "AppointmentView"))
			to.__goToNextAppointmentView();
		else if($.cf.compareStrings(to.setting.visibleView, "AgendaView"))
			to.__goToNextAgendaView();
		else if($.cf.compareStrings(to.setting.visibleView, "WeekPlannerView"))
			to.__goToNextWeekPlannerView();

		if(to.setting.nextButtonClicked)
			to.setting.nextButtonClicked.call(to, to.setting.selectedDate, to.tv.dAVDt);
	},

	// Public Method
	getVisibleDates: function()
	{
		var to = this;
		return to.tv.dAVDt;
	},

	_adjustViewSelectionMenu: function()
	{
		var to = this;
		var iTempIndex, oListElem;

		if($(to.elem).find(".cContHeaderMenuSegmentedTab").length > 0)
		{
			var oMenuList = $(to.elem).find(".cContHeaderMenuSections li");

			var iMaxWidth = 0;
			for(iTempIndex = 0; iTempIndex < oMenuList.length; iTempIndex++)
			{
				oListElem = oMenuList[iTempIndex];
				var iListElemWidth = $(oListElem).width();
				iMaxWidth = (iListElemWidth > iMaxWidth) ? iListElemWidth : iMaxWidth;
			}
			iMaxWidth += 25;

			for(iTempIndex = 0; iTempIndex < oMenuList.length; iTempIndex++)
			{
				oListElem = oMenuList[iTempIndex];
				$(oListElem).css({"width": iMaxWidth});
			}
		}

		to._adjustDatePicker();
	},

	_addDatePicker: function()
	{
		var to = this;
		var bDatePickerIconAdded = $(to.elem).find(".cContHeaderDatePickerIcon").length > 0,
		bDatePickerArrowAdded = $(to.elem).find(".cContHeaderDropdownMenuArrow").length > 0,
		bMenuAdded = $(to.elem).find(".cContHeaderMenuButton").length > 0,
		bAddDatePicker = ((to.setting.dropdownMenuElements.length > 0 && $.cf.compareStrings(to.setting.dropdownMenuElements[0], "DatePicker")) || (to.setting.dropdownMenuElements.length > 1 && $.cf.compareStrings(to.setting.dropdownMenuElements[1], "DatePicker"))),
		bDatePickerButtonAdded = bDatePickerIconAdded || ((bDatePickerArrowAdded || bMenuAdded) && bAddDatePicker),
		bDisplayDatePicker = (bDatePickerButtonAdded && to.setting.addEventsInMonthView && (!$.cf.compareStrings(to.setting.visibleView, "DatePicker") && !$.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "ChangeDate")));

		if(bDisplayDatePicker && $(".cElemDatePickerBg").length === 0)
		{
			var sTemplate = "";
			sTemplate += "<div class='cElemDatePickerBg'>";
			sTemplate += "<div class='cElemDatePickerCont'>";
			if(bDatePickerIconAdded)
				sTemplate += "<span class='cElemDatePickerTooltip cElemDatePickerTooltipBottom'></span>";
			sTemplate += "<div class='cElemDatePicker'>";
			sTemplate += "</div>";
			sTemplate += "</div>";
			sTemplate += "</div>";
			$(to.elem).parent().append(sTemplate);

			$(".cElemDatePicker").CalenStyle(
			{
				visibleView: "DatePicker",

				headerSectionsList:
				{
					left: ["TodayButton"],
					center: ["HeaderLabel"],
					right: ["PreviousButton", "NextButton"]
				},

				transitionSpeed: 0,

				selectedDate: to.setting.selectedDate,

				shortDayNames: to.setting.veryShortDayNames,

				shortMonthNames:  to.setting.shortMonthNames,

				fullMonthNames:  to.setting.shortMonthNames,

				numbers: to.setting.numbers,

				businessHoursSource: to.setting.businessHoursSource,

				inputTZOffset: to.setting.inputTZOffset,

				outputTZOffset: to.setting.outputTZOffset,

				parentObject: to,

				eventIndicatorInDatePicker: to.setting.eventIndicatorInDatePicker,

				initialize: function()
				{
					to.setting.datePickerObject = this;
				},

				viewLoaded: function(dSelectedDateTime, dArrHighlightDates)
				{
					to.setting.datePickerObject.highlightDatesInDatePicker(to.tv.dAVDt);
				},

				cellClicked: function(sView, dSelectedDateTime, bIsAllDay, pClickedAt)
				{
					to._showOrHideDatePicker();
					to.addRemoveViewLoader(true, "cViewLoaderBg");
					setTimeout(function()
					{
						to.setting.selectedDate = dSelectedDateTime;
						to.reloadData();
						to.setting.datePickerObject.highlightDatesInDatePicker(to.tv.dAVDt);
						to.addRemoveViewLoader(false, "cViewLoaderBg");
					}, 4);
				},

				calDataSource: to.setting.datePickerCalDataSource,

				useHammerjsAsGestureLibrary: to.setting.useHammerjsAsGestureLibrary
			});

			$(".cElemDatePickerBg").on($.CalenStyle.extra.sClickHandler, function(e)
			{
				e.preventDefault();
				to._hideDatePicker();
			});

			$(".cElemDatePicker, .cElemDatePicker *").on($.CalenStyle.extra.sClickHandler, function(e)
			{
				e.stopPropagation();
			});

			$(".cElemDatePickerBg *").on($.CalenStyle.extra.sClickHandler, function(e)
			{
				e.stopPropagation();
			});
		}
	},

	_showOrHideDatePicker: function()
	{
		var to = this;
		if($(".cElemDatePickerBg").css("display") === "none")
		{
			$(".cElemDatePickerBg").show(0);
			if(to.setting.adjustViewOnWindowResize)
				$(window).bind("resize.CSDP." + to.tv.pluginId, function(e){to._adjustDatePicker();});
			to._reloadDatePickerContent();
			to._adjustDatePicker();
		}
		else
			to._hideDatePicker();
	},

	_hideDatePicker: function()
	{
		var to = this;
		if($(".cElemDatePickerBg").css("display") !== "none")
			$(".cElemDatePickerBg").css({"display": "none"});
		if(to.setting.adjustViewOnWindowResize)
			$(window).unbind("resize.CSDP." + to.tv.pluginId);
	},

	_reloadDatePickerContent: function()
	{
		var to = this;
		var bDatePickerIconAdded = $(to.elem).find(".cContHeaderDatePickerIcon").length > 0,
		bDatePickerArrowAdded = $(to.elem).find(".cContHeaderDropdownMenuArrow").length > 0,
		bMenuAdded = $(to.elem).find(".cContHeaderMenuButton").length > 0,
		bAddDatePicker = ((to.setting.dropdownMenuElements.length > 0 && $.cf.compareStrings(to.setting.dropdownMenuElements[0], "DatePicker")) || (to.setting.dropdownMenuElements.length > 1 && $.cf.compareStrings(to.setting.dropdownMenuElements[1], "DatePicker"))),
		bDatePickerButtonAdded = bDatePickerIconAdded || ((bDatePickerArrowAdded || bMenuAdded) && bAddDatePicker);
		if(bDatePickerButtonAdded && to.setting.datePickerObject !== null)
		{
			to.setting.datePickerObject.setting.selectedDate = to.setting.selectedDate;
			to.setting.datePickerObject.reloadData();
			to.setting.datePickerObject.highlightDatesInDatePicker(to.tv.dAVDt);
		}
		to._adjustDatePicker();
	},

	__reloadDatePickerContentOnNavigation: function()
	{
		var to = this;
		to._reloadDatePickerContent();

		if($.cf.compareStrings(to.setting.visibleView, "DatePicker"))
			to.__highlightDaysInDatePicker();
		else if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
		{
			if($.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "ChangeDate"))
				to.__highlightDaysInDatePicker();
		}
	},

	_adjustDatePicker: function()
	{
		var to = this;

		var iMainContLeft, iMainContTop, iMainContWidth, iMainContHeight;
		if(!$.cf.compareStrings(to.setting.visibleView, "DatePicker"))
		{
			var $oContOuter = $(to.elem);
			var iMainLeftMargin = $oContOuter.css("margin-left");
			iMainLeftMargin = parseInt(iMainLeftMargin.replace("px", ""));
			var iMainTopMargin = $oContOuter.css("margin-top");
			iMainTopMargin = parseInt(iMainTopMargin.replace("px", ""));

			iMainContLeft = $oContOuter.position().left + iMainLeftMargin;
			iMainContTop = $oContOuter.position().top + iMainTopMargin;
			iMainContWidth = $oContOuter.width();
			iMainContHeight = $oContOuter.height();
			$(".cElemDatePickerBg").css({"left": iMainContLeft, "top": iMainContTop, "width": iMainContWidth, "height": iMainContHeight});
		}

		var iElemDatePickerLeft, iElemDatePickerTop, iElemDatePickerWidth, iElemDatePickerMaxWidth;
		var $occcContHeaderDatePickerIcon = $(to.elem).find(".cContHeaderDatePickerIcon");
		var $occcContHeaderDropdownMenuArrow = $(to.elem).find(".cContHeaderDropdownMenuArrow");
		var $occcContHeaderMenu = $(to.elem).find(".cContHeaderMenuButton");
		var iMainContMaxWidth = iMainContLeft + iMainContWidth;
		iElemDatePickerWidth = $(".cElemDatePickerCont").width();
		if($occcContHeaderDatePickerIcon.length > 0)
		{
			iElemDatePickerLeft = $occcContHeaderDatePickerIcon.position().left - 5 + $(to.elem).find(".calendarContInner").position().left;

			iElemDatePickerMaxWidth = iMainContLeft + iElemDatePickerLeft + iElemDatePickerWidth;
			if(iElemDatePickerMaxWidth > iMainContMaxWidth)
				iElemDatePickerLeft = iMainContWidth - iElemDatePickerWidth - 5;
			iElemDatePickerTop = $occcContHeaderDatePickerIcon.height() + 5 + $(to.elem).find(".calendarContInner").position().top + ($.cf.compareStrings(to.setting.sectionsList[0], "ActionBar") ? $(to.elem).find(".cActionBar").height() : 0);

			$(".cElemDatePickerCont").css({"left": iElemDatePickerLeft, "top": iElemDatePickerTop});

			//iDatePickerIconLeft = $occcContHeaderDatePickerIcon.position().left + ($occcContHeaderDatePickerIcon.width()/2);
			//iElemDatePickerMaxWidth = iElemDatePickerLeft + iElemDatePickerWidth;
			//$(".cElemDatePickerTooltipBottom").css({"left": (iDatePickerIconLeft - iElemDatePickerLeft - 7)});
		}
		else if($occcContHeaderDropdownMenuArrow.length > 0 || $occcContHeaderMenu.length > 0)
		{
			var $occCContHeaderLabel = $(to.elem).find(".cContHeaderLabelOuter"),
			iContHeaderLabelWidth = $occCContHeaderLabel.width(),
			iContHeaderLabelLeft = $occCContHeaderLabel.position().left,
			iContHeaderLabelMid = (iContHeaderLabelLeft + (iContHeaderLabelWidth/2)),
			iElemDatePickerWidthHalf = (iElemDatePickerWidth/2);

			if(!$.CalenStyle.extra.bTouchDevice && iMainContWidth > 480)
			{
				iElemDatePickerLeft = iContHeaderLabelMid - iElemDatePickerWidthHalf;
				if(iElemDatePickerLeft < 0)
					iElemDatePickerLeft = 5;
				iElemDatePickerMaxWidth = iElemDatePickerLeft + iElemDatePickerWidth;
				if(iElemDatePickerMaxWidth > iMainContMaxWidth)
					iElemDatePickerLeft = iMainContWidth - iElemDatePickerWidth - 5;
			}
			else
			{
				iElemDatePickerLeft = (iMainContWidth - iElemDatePickerWidth)/2;
				//iElemDatePickerLeft = iMainContLeft + (iMainContWidth - iElemDatePickerWidth)/2;
			}

			iElemDatePickerTop = $(to.elem).find(".cContHeaderLabelOuter").height() + 10 + $(to.elem).find(".calendarContInner").position().top + ($.cf.compareStrings(to.setting.sectionsList[0], "ActionBar") ? $(to.elem).find(".cActionBar").height() : 0);

			$(".cElemDatePickerCont").css({"left": iElemDatePickerLeft, "top": iElemDatePickerTop});
		}
	},

	_isFullScreen: function()
	{
		var to = this;
		return $(to.elem).hasClass("cFullscreenCont");
	},

	_toggleFullscreen: function()
	{
		var to = this;
		if(to._isFullScreen())
		{
			$(to.elem).removeClass("cFullscreenCont");
			if(to.tv.iCalHeight !== 0)
				$(to.elem).css({"height": to.tv.iCalHeight});
		}
		else
			$(to.elem).addClass("cFullscreenCont");
		to._adjustViews(true);
	},

	__adjustHeader: function()
	{
		var to = this;
		if(to._isFullScreen())
			$(to.elem).find(".cContHeaderFullscreen").removeClass("cs-icon-Expand").addClass("cs-icon-Contract");
		else
			$(to.elem).find(".cContHeaderFullscreen").removeClass("cs-icon-Contract").addClass("cs-icon-Expand");

		var $occCalendarContInner = $(to.elem).find(".calendarContInner"),
		iCalendarContWidth = $occCalendarContInner.outerWidth(),
		iCalendarContHeight = $occCalendarContInner.outerHeight();

		// if(iCalendarContWidth > 410 || iCalendarContHeight > 410)
		// 	$(to.elem).find(".cContHeader, .cContHeaderSections, .cContHeaderDatePickerIcon, .cContHeaderFullscreen, .cContHeaderNavButton").css({"height": 45, "line-height": 45+"px"});
		// else
		// 	$(to.elem).find(".cContHeader, .cContHeaderSections, .cContHeaderDatePickerIcon, .cContHeaderFullscreen, .cContHeaderNavButton").css({"height": 45, "line-height": 45+"px"});

		if(iCalendarContWidth > 410 || iCalendarContHeight > 410)
			$(to.elem).find(".cContHeader, .cContHeaderDatePickerIcon, .cContHeaderFullscreen, .cContHeaderNavButton").css({"height": 45, "line-height": 45+"px"});
		else
			$(to.elem).find(".cContHeader, .cContHeaderDatePickerIcon, .cContHeaderFullscreen, .cContHeaderNavButton").css({"height": 45, "line-height": 45+"px"});
	},

	//--------------------------------- Header Related Functions End ---------------------------------

	//----------------------------- Common View Related Functions Start -----------------------------

	_addCommonView: function(bLoadData)
	{
		var to = this;
		var bFirstSection = true,
		iSectionTopPos = 0,
		$occCalendarCont = $(to.elem).find(".calendarCont"),
		iTempCalendarContInnerLeft = 0, iTempCalendarContInnerTop = 0,
		iTempCalendarContInnerWidth = 0, iTempCalendarContInnerHeight = 0,
		sTemplate = "", iTempIndex, sSectionName;

		for(iTempIndex = 0; iTempIndex < to.setting.sectionsList.length; iTempIndex++)
		{
			sSectionName = to.setting.sectionsList[iTempIndex];
			if($.cf.compareStrings(sSectionName, "FilterBar"))
			{
				to.tv.bDisFBar = true;
				break;
			}
		}

		if(to.tv.bDisFBar)
		{
			var iTempFilterBarLeft, iTempFilterBarTop,
			iTempFilterBarWidth, iTempFilterBarHeight,
			iCalendarContWidth = $occCalendarCont.outerWidth(),
			iCalendarContHeight = $occCalendarCont.outerHeight();

			if($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom"))
			{
				iTempFilterBarWidth = iCalendarContWidth;
				iTempFilterBarHeight = to.setting.filterBarHeight;

				iTempCalendarContInnerWidth = iCalendarContWidth;
				iTempCalendarContInnerHeight = iCalendarContHeight - iTempFilterBarHeight;

				iTempFilterBarLeft = 0;
				iTempCalendarContInnerLeft = 0;

				if($.cf.compareStrings(to.setting.filterBarPosition, "Top"))
				{
					iTempFilterBarTop = 0;
					iTempCalendarContInnerTop = to.setting.filterBarHeight - $.CalenStyle.extra.iBorderOverhead;
				}
				else if($.cf.compareStrings(to.setting.filterBarPosition, "Bottom"))
				{
					iTempCalendarContInnerTop = 0;
					iTempFilterBarTop = iTempCalendarContInnerHeight;
				}

				iTempFilterBarWidth = "100%";
				iTempFilterBarHeight += "px";
			}
			else if($.cf.compareStrings(to.setting.filterBarPosition, "Left") || $.cf.compareStrings(to.setting.filterBarPosition, "Right"))
			{
				iTempFilterBarWidth = to.setting.filterBarWidth;
				iTempFilterBarHeight = iCalendarContHeight;

				iTempCalendarContInnerWidth = iCalendarContWidth - iTempFilterBarWidth;
				iTempCalendarContInnerHeight = iCalendarContHeight;

				iTempFilterBarTop = 0;
				iTempCalendarContInnerTop = 0;

				if($.cf.compareStrings(to.setting.filterBarPosition, "Left"))
				{
					iTempFilterBarLeft = 0;
					iTempCalendarContInnerLeft = to.setting.filterBarWidth;
				}
				else if($.cf.compareStrings(to.setting.filterBarPosition, "Right"))
				{
					iTempCalendarContInnerLeft = 0;
					iTempFilterBarLeft = iTempCalendarContInnerWidth;
				}

				iTempFilterBarWidth += "px";
				iTempFilterBarHeight = "100%";
			}

			sTemplate += "<div class='cFilterBar' style='left: " + iTempFilterBarLeft + "px; top: " + iTempFilterBarTop + "px; width: " + iTempFilterBarWidth + "; height: " + iTempFilterBarHeight + ";'></div>";
		}
		sTemplate += "<div class='calendarContInner' style='left: " + iTempCalendarContInnerLeft + "px; top: " + iTempCalendarContInnerTop + "px; width: " + iTempCalendarContInnerWidth + "px; height: " + iTempCalendarContInnerHeight + "px;'></div>";
		$occCalendarCont.append(sTemplate);

		for(iTempIndex = 0; iTempIndex < to.setting.sectionsList.length; iTempIndex++)
		{
			sSectionName = to.setting.sectionsList[iTempIndex];
			if($.cf.compareStrings(sSectionName, "ActionBar"))
				to.tv.bDisABar = true;
			else if($.cf.compareStrings(sSectionName, "EventList") && ($.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DayEventListView")))
				to.tv.bCMVDisEvLst = true;
		}

		sTemplate = "";
		for(iTempIndex = 0; iTempIndex < to.setting.sectionsList.length; iTempIndex++)
		{
			sSectionName = to.setting.sectionsList[iTempIndex];

			if($.cf.compareStrings(sSectionName, "Header"))
			{
				if(!bFirstSection)
					iSectionTopPos -= 1;
				else
					bFirstSection = false;

				sTemplate += "<div class='cContHeader' style='top: " + iSectionTopPos + "px;'>";
				sTemplate += to._addContHeader(iSectionTopPos);
				sTemplate += "</div>";
			}
			else if($.cf.compareStrings(sSectionName, "Calendar"))
			{
				if(!bFirstSection)
					iSectionTopPos -= 1;
				else
					bFirstSection = false;

				if($.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
				{
					if(to.tv.bDisABar)
						iSectionTopPos -= 1;
					else
						iSectionTopPos -= 2;

					sTemplate += "<table class='cTable cmvMonthTable cmvMonthTableMain' cellspacing='0' style='top: " + iSectionTopPos + "px;'></table>";
				}
				else if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
				{
					sTemplate += "<div class='cmvTableContainerOuter'>";

					sTemplate += "<div class='cmvTableContainer' style='overflow: hidden;'>";

					sTemplate += "<table class='cTable cmvMonthTable cmvMonthTableMain' cellspacing='0'></table>";

					if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
						sTemplate += "<div class='cdmvEventCont cdmvEventContMain'></div>";

					sTemplate += "</div>";

					sTemplate += "</div>";
				}
				else if($.cf.compareStrings(to.setting.visibleView, "WeekView") || $.cf.compareStrings(to.setting.visibleView, "DayView") || $.cf.compareStrings(to.setting.visibleView, "CustomView") || $.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
				{
					if(to.setting.sectionsList.length === 2)
						iSectionTopPos -= 3;
					else
						iSectionTopPos -= 2;

					sTemplate += "<table class='cTable cdvDetailTable cdvDetailTableMain' cellspacing='0' style='top: " + iSectionTopPos + "px;'></table>";

					sTemplate += "<div class='cdvContRow2 cdvContRow2Main'></div>";
					sTemplate += "<div class='cdvContRow3 cdvContRow3Main'></div>";

					iSectionTopPos -= 1;
				}
				else if($.cf.compareStrings(to.setting.visibleView, "QuickAgendaView"))
				{
					if(to.setting.sectionsList.length === 2)
						iSectionTopPos -= 3;
					else
						iSectionTopPos -= 2;

					sTemplate += "<table class='cTable cqavTable cqavTableMain' cellspacing='0' style='top: " + iSectionTopPos + "px;'></table>";

					sTemplate += "<div class='cqavContRow2 cqavContRow2Main'></div>";

					iSectionTopPos -= 1;
				}
				else if($.cf.compareStrings(to.setting.visibleView, "TaskPlannerView"))
				{
					if(to.setting.sectionsList.length === 2)
						iSectionTopPos -= 3;
					else
						iSectionTopPos -= 2;

					sTemplate += "<table class='cTable ctpvTable ctpvTableMain' cellspacing='0' style='top: " + iSectionTopPos + "px;'></table>";

					iSectionTopPos -= 1;
				}
				else if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
				{
					iSectionTopPos -= 2;
					sTemplate += "<table class='cTable cdlvDaysTable cdlvDaysTableList cdlvDaysTableMain' cellspacing='0' style='top: " + iSectionTopPos + "px;'></table>";
				}
				else if($.cf.compareStrings(to.setting.visibleView, "AppointmentView"))
				{
					iSectionTopPos -= 2;

					sTemplate += "<table class='cTable cavTable cavTableMain' cellspacing='0' style='top: " + iSectionTopPos + "px;'></table>";
					sTemplate += "<div class='cavContRow2 cavContRow2Main'></div>";
				}
				else if($.cf.compareStrings(to.setting.visibleView, "WeekPlannerView"))
				{
					iSectionTopPos -= 2;
					if($.CalenStyle.extra.bTouchDevice)
						sTemplate += "<table class='cTable cwpvTable cwpvTableMain' cellspacing='0' style='top: " + iSectionTopPos + "px;'></table>";
					else
						sTemplate += "<div class='cwpvTableOuterCont' style='top: " + iSectionTopPos + "px;'><table class='cTable cwpvTable cwpvTableMain' cellspacing='0'></table></div>";
				}
			}
			else if($.cf.compareStrings(sSectionName, "ActionBar"))
			{
				if(!bFirstSection)
				{
					if(!$.cf.compareStrings(to.setting.visibleView, "MonthView"))
						iSectionTopPos -= 1;
				}
				else
					bFirstSection = false;

				sTemplate += "<div class='cActionBar' style='height: " + to.setting.actionBarHeight + "px; top: " + iSectionTopPos + "px;'></div>";
			}
			else if($.cf.compareStrings(sSectionName, "EventList") && ($.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DayEventListView")))
			{
				if(!bFirstSection)
					iSectionTopPos -= 1;
				else
					bFirstSection = false;

				if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
					iSectionTopPos -= 1;

				sTemplate += "<div class='cListOuterCont'></div>";
			}
		}

		if(($.cf.compareStrings(to.setting.visibleView, "DayEventListView") && !to.tv.bCMVDisEvLst) || $.cf.compareStrings(to.setting.visibleView, "AgendaView"))
		{
			if(!bFirstSection)
				iSectionTopPos -= 2;

			to.tv.bCMVDisEvLst = true;
			sTemplate += "<div class='cListOuterCont' style='top: " + iSectionTopPos + "px;'></div>";
		}

		$(to.elem).find(".calendarContInner").append(sTemplate);

		to._addMenuItemsInSegmentedTab();
		to._addEventsToHeaderElements();
		to._adjustViewSelectionMenu();

		if(bLoadData)
			to.reloadData();
		else
			to.__reloadCurrentView(true, false);

		$(document).on($.CalenStyle.extra.sClickHandler+".CalenStyle", function(e)
		{
			to._callCommonEvents();
		});
	},

	// Public Method
	refreshView: function()
	{
		var to = this;
		to.tv.oAEvents = to._sortEvents(to.tv.oAEvents);
		to._refreshHeader();
		to.__reloadCurrentView(true, false);
	},

	_adjustViews: function(bIsResized)
	{
		var to = this;
		if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView") || $.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
			to.adjustMonthTable();
		else if($.cf.compareStrings(to.setting.visibleView, "WeekView") || $.cf.compareStrings(to.setting.visibleView, "DayView") || $.cf.compareStrings(to.setting.visibleView, "CustomView"))
			to.__adjustDetailViewTable();
		else if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
			to.__adjustDetailViewTable();
		else if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
			to.__adjustDayListView();
		else if($.cf.compareStrings(to.setting.visibleView, "QuickAgendaView"))
			to.__adjustQuickAgendaView(bIsResized);
		else if($.cf.compareStrings(to.setting.visibleView, "TaskPlannerView"))
			to.__adjustTaskPlannerView(bIsResized);
		else if($.cf.compareStrings(to.setting.visibleView, "AppointmentView"))
			to.__adjustAppointmentTable();
		else if($.cf.compareStrings(to.setting.visibleView, "AgendaView"))
			to.adjustAgendaView();
		else if($.cf.compareStrings(to.setting.visibleView, "WeekPlannerView"))
			to.adjustWeekPlannerView();
	},

	__reloadCurrentView: function(bLoadAll, bLoadAllData)
	{
		var to = this;
		if(to.setting.adjustViewOnWindowResize)
			$(window).unbind("resize." + to.tv.pluginId);

		to.__getCurrentViewDates();

		if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView") || $.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
		{
			to.updateMonthTableAndContents(bLoadAllData);

			if(to.setting.adjustViewOnWindowResize)
			{
				$(window).bind("resize." + to.tv.pluginId, function(e)
				{
					if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView") && to.setting.hideExtraEvents)
					{
						$(to.elem).find(".cdmvEvent").remove();
						$(to.elem).find(".cHiddenEventsIndicator").remove();
						$(to.elem).find(".cHiddenEventsCont").remove();

						to.adjustMonthTable();
						to._addEventContInMonthView(null);
					}
					else
						to.adjustMonthTable();
				});
			}
		}
		else if($.cf.compareStrings(to.setting.visibleView, "WeekView") || $.cf.compareStrings(to.setting.visibleView, "DayView") || $.cf.compareStrings(to.setting.visibleView, "CustomView") || $.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
		{
			if(bLoadAll)
			{
				$(to.elem).find(".cdvContRow2Main").html("");
				$(to.elem).find(".cdvContRow3Main").html("");

				to.__updateDetailViewTable();
				to.__adjustDetailViewTable();

				if(to.setting.adjustViewOnWindowResize)
					$(window).bind("resize." + to.tv.pluginId, function(e){to.__adjustDetailViewTable();});

				to.__parseData(bLoadAllData, function()
				{
					if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
					{
						to.setEventOrTaskStatusForCurrentView();
						if(to.tv.bEvTskStatus)
						{
							for(var iDateIndex = 0; iDateIndex < to.tv.iNoVDay; iDateIndex++)
							{
								$(to.elem).find("#cdlvRowDay"+iDateIndex).append("<div class='cdlvTableRowStatusGroup'> &nbsp; </div>");
							}
							to.__displayEventOrTaskStatusForDayListView();
						}
						to.__setDateStringsForDayListView(to.tv.iNoVDay, to.tv.dAVDt, 0);
						//to.__adjustDayListView();
					}

					to.__updateTimeSlotTableView();
					to.__addEventsInDetailView("Both");
					to.__adjustDetailViewTable();
					to.__adjustDetailViewTable();

					to.__modifyFilterBarCallback();
				});
			}
		}
		else if($.cf.compareStrings(to.setting.visibleView, "QuickAgendaView"))
		{
			$(to.elem).find(".cqavContRow2Main").html("");

			to.__updateQuickAgendaView();
			to.__adjustQuickAgendaView();

			if(to.setting.adjustViewOnWindowResize)
				$(window).bind("resize." + to.tv.pluginId, function(e){to.__adjustQuickAgendaView(true);});

			to.__parseData(bLoadAllData, function()
			{
				to.__addEventsInQuickAgendaView();
				to.__adjustQuickAgendaView();

				to.__modifyFilterBarCallback();
			});
		}
		else if($.cf.compareStrings(to.setting.visibleView, "TaskPlannerView"))
		{
			$(to.elem).find(".ctpvTableRow2 td").html("");

			to.__updateTaskPlannerView();
			to.__adjustTaskPlannerView();

			if(to.setting.adjustViewOnWindowResize)
				$(window).bind("resize." + to.tv.pluginId, function(e){to.__adjustTaskPlannerView(true);});

			to.__parseData(bLoadAllData, function()
			{
				to.setEventOrTaskStatusForCurrentView();
				to.__addEventsInTaskPlannerView();
				to.__adjustTaskPlannerView();

				to.__modifyFilterBarCallback();
			});
		}
		else if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
		{
			to.__updateDayListViewTable(bLoadAllData, true);
			if(!bLoadAll)
				to.__adjustDayListView();
			to.__adjustDayListView();

			if(to.setting.adjustViewOnWindowResize)
				$(window).bind("resize." + to.tv.pluginId, function(e){to.__adjustDayListView();});
		}
		else if($.cf.compareStrings(to.setting.visibleView, "AppointmentView"))
		{
			to.__updateAppointmentTable();
			to.__adjustAppointmentTable();

			if(to.setting.adjustViewOnWindowResize)
				$(window).bind("resize." + to.tv.pluginId, function(e){to.__adjustAppointmentTable();});

			to.__parseData(bLoadAllData, function()
			{
				to.__updateAppointmentTable();
				to.__displayAppointments();
				to.__adjustAppointmentTable();
				to.__adjustAppointmentTable();

				to.__modifyFilterBarCallback();
			});
		}
		else if($.cf.compareStrings(to.setting.visibleView, "AgendaView"))
		{
			to.updateAgendaView(bLoadAllData);
			to.adjustAgendaView();

			if(to.setting.adjustViewOnWindowResize)
				$(window).bind("resize." + to.tv.pluginId, function(e){to.adjustAgendaView();});
		}
		else if($.cf.compareStrings(to.setting.visibleView, "WeekPlannerView"))
		{
			to.updateWeekPlannerView(bLoadAllData);
			to.adjustWeekPlannerView();

			if(to.setting.adjustViewOnWindowResize)
				$(window).bind("resize." + to.tv.pluginId, function(e){to.adjustWeekPlannerView();});
		}

		//if(to.tv.bDisFBar)
		//{
			if(to.setting.modifyFilterBarView)
				to.setting.modifyFilterBarView.call(to, $(to.elem).find(".cFilterBar"), to.setting.eventFilterCriteria, to.tv.oAEvFltrCnt);
		//}

		if(to.tv.bDisABar)
		{
			if(to.setting.modifyActionBarView)
				to.setting.modifyActionBarView.call(to, $(to.elem).find(".cActionBar"), to.setting.visibleView);
		}

		if(!to.tv.bViewLoaded)
		{
			if(to.setting.viewLoaded)
				to.setting.viewLoaded.call(to, to.setting.selectedDate, to.tv.dAVDt);
			to.tv.bViewLoaded = true;
		}
	},

	__modifyFilterBarCallback: function()
	{
		var to = this;
		//if(to.tv.bDisFBar)
		//{
			if(to.setting.modifyFilterBarView)
				to.setting.modifyFilterBarView.call(to, $(to.elem).find(".cFilterBar"), to.setting.eventFilterCriteria, to.tv.oAEvFltrCnt);
		//}
	},

	__adjustFontSize: function()
	{
		var to = this;
		var $occCalendarContInner = $(to.elem).find(".calendarContInner"),
		iCalendarContWidth = $occCalendarContInner.outerWidth(),
		iCalendarContHeight = $occCalendarContInner.outerHeight(),

		sFontClasses = "cFontLarge cFontMedium cFontSmall cFontExtraSmall";

		if($.cf.compareStrings(to.setting.visibleView, "WeekView") || $.cf.compareStrings(to.setting.visibleView, "DayView") || $.cf.compareStrings(to.setting.visibleView, "CustomView") || $.cf.compareStrings(to.setting.visibleView, "DayEventDetailView") || $.cf.compareStrings(to.setting.visibleView, "QuickAgendaView") || $.cf.compareStrings(to.setting.visibleView, "TaskPlannerView"))
		{
			if(iCalendarContWidth <= 360 || iCalendarContHeight <= 360)
				$occCalendarContInner.removeClass(sFontClasses).addClass("cFontSmall");
			else if(iCalendarContWidth <= 710)
				$occCalendarContInner.removeClass(sFontClasses).addClass("cFontMedium");
			else
				$occCalendarContInner.removeClass(sFontClasses).addClass("cFontLarge");
		}
		else if($.cf.compareStrings(to.setting.visibleView, "DayEventListView") || $.cf.compareStrings(to.setting.visibleView, "AppointmentView") || $.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
		{
			if(iCalendarContWidth <= 310 || iCalendarContHeight <= 310)
				$occCalendarContInner.removeClass(sFontClasses).addClass("cFontSmall");
			else if(iCalendarContWidth <= 410 || iCalendarContHeight <= 410)
				$occCalendarContInner.removeClass(sFontClasses).addClass("cFontMedium");
			else
				$occCalendarContInner.removeClass(sFontClasses).addClass("cFontLarge");
		}
		else if($.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
		{
			if(to.tv.bCMVDisEvLst)
			{
				if(iCalendarContWidth <= 310 || iCalendarContHeight <= 310)
					$occCalendarContInner.removeClass(sFontClasses).addClass("cFontSmall");
				else if(iCalendarContWidth <= 400 || iCalendarContHeight <= 400)
					$occCalendarContInner.removeClass(sFontClasses).addClass("cFontMedium");
				else
					$occCalendarContInner.removeClass(sFontClasses).addClass("cFontLarge");
			}
			else
			{
				if(iCalendarContWidth <= 310 || iCalendarContHeight <= 310)
					$occCalendarContInner.removeClass(sFontClasses).addClass("cFontSmall");
				else if(iCalendarContWidth <= 410 || iCalendarContHeight <= 410)
					$occCalendarContInner.removeClass(sFontClasses).addClass("cFontMedium");
				else
					$occCalendarContInner.removeClass(sFontClasses).addClass("cFontLarge");
			}
		}
	},

	// Public Method
	setCalendarBorderColor: function()
	{
		var to = this;
		if(to.tv.bDisFBar)
		{
			if($.cf.compareStrings(to.setting.filterBarPosition, "Left"))
				$(to.elem).find(".cFilterBar").css({"border-right": "1px solid #DDD"});
			else if($.cf.compareStrings(to.setting.filterBarPosition, "Right"))
				$(to.elem).find(".cFilterBar").css({"border-left": "1px solid #DDD"});
		}

		if(to.setting.changeCalendarBorderColorInJS)
		{
			var sCalendarBorderColor, sTemp = "";
			if($.cf.compareStrings(to.setting.calendarBorderColor, "transparent"))
				sCalendarBorderColor = to.setting.calendarBorderColor;
			else
				sCalendarBorderColor = "#" + to.setting.calendarBorderColor;

			sTemp += ".calendarCont";
			sTemp += ", .calendarContInner";

			$(".cElemDatePickerTooltipBottom").css({"border-color": "transparent transparent "+ sCalendarBorderColor + " transparent"});

			if($.cf.compareStrings(to.setting.visibleView, "WeekView") || $.cf.compareStrings(to.setting.visibleView, "DayView") || $.cf.compareStrings(to.setting.visibleView, "CustomView") || $.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
			{
				sTemp += ", .cdvCalendarCont td";
				sTemp += ", .cdvDetailTable";
			}
			else if($.cf.compareStrings(to.setting.visibleView, "QuickAgendaView"))
			{
				sTemp += ", .cqavCalendarCont td";
				sTemp += ", .cqavTable";
			}
			else if($.cf.compareStrings(to.setting.visibleView, "TaskPlannerView"))
			{
				sTemp += ", .ctpvCalendarCont td";
				sTemp += ", .ctpvTable";
			}
			else if($.cf.compareStrings(to.setting.visibleView, "AppointmentView"))
			{
				sTemp += ", .cavCalendarCont .cavTable td";
				sTemp += ", .cavCalendarCont .cavTable td:last-child";
				sTemp += ", .cavTableList";
			}
			else if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView") || $.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
			{
				sTemp += ", .cmvCalendarContWithBorders"+ " td";
				sTemp += ", .cmvThinBorderTop";
				sTemp += ", .cmvThinBorderRight";
				sTemp += ", .cmvThinBorderBottom";
				sTemp += ", .cmvThinBorderLeft";
				sTemp += ", .cmvThinBorder";
				sTemp += ", .cdlvDaysTableList";
			}
			else if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
				sTemp += ", .cdlvDaysTableList";

			sTemp += ", .cContHeader";
			sTemp += ", .cFilterBar";
			sTemp += ", .cActionBar";
			sTemp += ", .cListOuterCont";

			$(to.elem).find(sTemp).css({"border-color": sCalendarBorderColor});
		}
	},

	//----------------------------- Common View Related Functions End -----------------------------

	//------------------------------- Date Manipulation Functions Start -------------------------------

	// Public Method
	setDateInFormat: function(oInput, sType)
	{
		var to = this;
		if(oInput.date === undefined && oInput.iDate === undefined)
			oInput.date = to._getCurrentDate();
		if(oInput.iDate === undefined)
		{
			oInput.iDate = {
				d: oInput.date.getDate(),
				M: oInput.date.getMonth(),
				y: oInput.date.getFullYear(),
				H: oInput.date.getHours(),
				m: oInput.date.getMinutes(),
				s: oInput.date.getSeconds(),
				ms: oInput.date.getMilliseconds()
			};
		}
		else
		{
			oInput.iDate = {
				d: (oInput.iDate.d !== undefined) ? oInput.iDate.d : $.CalenStyle.extra.dToday.getDate(),
				M: (oInput.iDate.M !== undefined) ? oInput.iDate.M : $.CalenStyle.extra.dToday.getMonth(),
				y: (oInput.iDate.y !== undefined) ? oInput.iDate.y : $.CalenStyle.extra.dToday.getFullYear(),
				H: (oInput.iDate.H !== undefined) ? oInput.iDate.H : 0,
				m: (oInput.iDate.m !== undefined) ? oInput.iDate.m : 0,
				s: (oInput.iDate.s !== undefined) ? oInput.iDate.s : 0,
				ms: (oInput.iDate.ms !== undefined) ? oInput.iDate.ms : 0
			};
		}

		var dDate;
		if(sType === null || sType === undefined || sType === "")
			dDate = new Date(oInput.iDate.y, oInput.iDate.M, oInput.iDate.d, oInput.iDate.H, oInput.iDate.m, oInput.iDate.s, oInput.iDate.ms);
		else if(sType === "START")
			dDate = new Date(oInput.iDate.y, oInput.iDate.M, oInput.iDate.d, 0, 0, 0, 0);
		else if(sType === "END")
			dDate = new Date(oInput.iDate.y, oInput.iDate.M, oInput.iDate.d, 23, 59, 59, 999);

		return dDate;
	},

	_getCurrentDate: function()
	{
		var to = this;
		var dToday = to.getDateByAddingOutputTZOffset(to.convertToUTC(new Date()), to.setting.outputTZOffset);
		return dToday;
	},

	// Public Method
	convertToUTC: function(dIpDate, sIpTZOffset)
	{
		var to = this;
		var dOpDate = new Date(dIpDate.getTime() - ((sIpTZOffset === undefined || sIpTZOffset === "" || sIpTZOffset === null) ?  -(dIpDate.getTimezoneOffset() * $.CalenStyle.extra.iMS.m) : to._getTZOffsetInMS(sIpTZOffset)));
		return dOpDate;
	},

	_getTZOffsetInMS: function(sTZOffset)
	{
		var to = this;
		var iOffsetMS = 0;
		if(sTZOffset === undefined || sTZOffset === "" || sTZOffset === null)
			iOffsetMS = -($.CalenStyle.extra.dToday.getTimezoneOffset() * $.CalenStyle.extra.iMS.m);
		else
		{
			var sArrTZOffset = sTZOffset.match(/^([+|-]{1})([0-1]{0,1}[0-9]{1}):([0-6]{0,1}[0-9]{1})$/);
			iOffsetMS = parseInt(sArrTZOffset[2]) * $.CalenStyle.extra.iMS.h + parseInt(sArrTZOffset[3]) * $.CalenStyle.extra.iMS.m;
			iOffsetMS = (sArrTZOffset[1]==="+") ? iOffsetMS : -iOffsetMS;
		}
		return iOffsetMS;
	},

	// Public Method
	getDateByAddingOutputTZOffset: function(dIpDate, sOpTZOffset)
	{
		var to = this;
		var dOpDate = new Date(dIpDate.getTime() + to._getTZOffsetInMS(sOpTZOffset));
		return dOpDate;
	},

	// Public Method
	normalizeDateTimeWithOffset: function(dIpDate, sIpTZOffset, sOpTZOffset)
	{
		var to = this;
		var dOpDate = new Date(dIpDate);
		if(sIpTZOffset !== sOpTZOffset)
			dOpDate = to.getDateByAddingOutputTZOffset(to.convertToUTC(dIpDate, sIpTZOffset), sOpTZOffset);
		return dOpDate;
	},

	_getDateObjectFromString: function(sDate, bIsAllDay, inputDateTimeFormat, formatSeparatorDateTime, formatSeparatorDate, formatSeparatorTime, sIpTZOffset)
	{
		var to = this;
		var toClass = {}.toString;
		var sDateType = toClass.call(sDate);

		var dTempDate;
		if(sDateType === "[object Date]")
			dTempDate = (bIsAllDay ? to.convertToUTC(sDate, sIpTZOffset) : to.normalizeDateTimeWithOffset(sDate, sIpTZOffset, to.setting.outputTZOffset));
		else if(sDateType === "[object Number]")
		{
			// dTempDate = (bIsAllDay ? to.convertToUTC(new Date(sDate), sIpTZOffset) : to.normalizeDateTimeWithOffset(new Date(sDate), sIpTZOffset, to.setting.outputTZOffset));
			dTempDate = (bIsAllDay ? to.convertToUTC(new Date(sDate), "+00:00") : to.normalizeDateTimeWithOffset(new Date(sDate), "+00:00", to.setting.outputTZOffset));
		}
		else
		{
			var iDay = 0, iMonth = 0, iYear = 0, iHours = 0, iMinutes = 0, iSeconds = 0;

			var sArrDate8601Date = sDate.match(/^([0-9]{4})(-([0-1]{1}[0-9]{1}))(-([0-3]{1}[0-9]{1}))$/);
			var sArrDate8601 = sDate.match(/^([0-9]{4})(-([0-1]{1}[0-9]{1})(-([0-3]{1}[0-9]{1})([T]([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
			var sArrDate8601Compact = sDate.match(/^([0-9]{4})(([0-1]{1}[0-9]{1})(([0-3]{1}[0-9]{1})([T]([0-9]{2})([0-9]{2})(([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);

			var dISO8601;
			if(sArrDate8601Date !== null)
			{
				dISO8601 = to.setDateInFormat({"iDate": {y: parseInt(sArrDate8601Date[1]), M: (parseInt(sArrDate8601Date[3]) - 1), d: parseInt(sArrDate8601Date[5])}}, "START");
				dTempDate = (bIsAllDay ? dISO8601 : to.getDateByAddingOutputTZOffset(dISO8601, to.setting.outputTZOffset));
			}
			else if(sArrDate8601 !== null)
			{
				dISO8601 = to.setDateInFormat({"iDate": {y: parseInt(sArrDate8601[1]), M: (parseInt(sArrDate8601[3]) - 1), d: parseInt(sArrDate8601[5]), H: parseInt(sArrDate8601[7]), m: parseInt(sArrDate8601[8]), s: parseInt(sArrDate8601[10])}}, "");
				if(sArrDate8601[13] === "Z")
					dTempDate = to.getDateByAddingOutputTZOffset(dISO8601, to.setting.outputTZOffset);
				else
					dTempDate = to.normalizeDateTimeWithOffset(dISO8601, sArrDate8601[13], to.setting.outputTZOffset);
			}
			else if(sArrDate8601Compact !== null)
			{
				dISO8601 = to.setDateInFormat({"iDate": {y: parseInt(sArrDate8601Compact[1]), M: (parseInt(sArrDate8601Compact[3]) - 1), d: parseInt(sArrDate8601Compact[5]), H: parseInt(sArrDate8601Compact[7]), m: parseInt(sArrDate8601Compact[8]), s: parseInt(sArrDate8601Compact[9])}}, "");
				if(sArrDate8601Compact[13] === "Z")
					dTempDate = to.getDateByAddingOutputTZOffset(dISO8601, to.setting.outputTZOffset);
				else
					dTempDate = to.normalizeDateTimeWithOffset(dISO8601, sArrDate8601Compact[13], to.setting.outputTZOffset);
			}
			else
			{
				var sInputDateTimeFormat = inputDateTimeFormat || to.setting.inputDateTimeFormat;

				if($.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[1])) // milliseconds
					dTempDate = new Date(parseInt(sDate));
				else
				{
					var sFormatSeparatorDateTime = formatSeparatorDateTime || to.setting.formatSeparatorDateTime,
					sFormatSeparatorDate = formatSeparatorDate || to.setting.formatSeparatorDate,
					sFormatSeparatorTime = formatSeparatorTime || to.setting.formatSeparatorTime,

					sArrDatetime = sDate.split(sFormatSeparatorDateTime),
					sThisDate = sArrDatetime[0],
					sThisTime = sArrDatetime[1],

					sArrDateComponents = sThisDate.split(sFormatSeparatorDate);
					if($.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[4]) || $.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[5]))
					{
						iDay = parseInt(sArrDateComponents[0]);
						iMonth = parseInt(sArrDateComponents[1]) - 1;
						iYear = parseInt(sArrDateComponents[2]);
					}
					else if($.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[6]) || $.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[7]))
					{
						iMonth = parseInt(sArrDateComponents[0]) - 1;
						iDay = parseInt(sArrDateComponents[1]);
						iYear = parseInt(sArrDateComponents[2]);
					}
					else if($.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[8]) || $.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[9]))
					{
						iYear = parseInt(sArrDateComponents[0]);
						iMonth = parseInt(sArrDateComponents[1]) - 1;
						iDay = parseInt(sArrDateComponents[2]);
					}

					var sArrTimeComponents;
					if($.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[4]) || $.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[6]) || $.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[8]))
					{
						var sArrTempTimeComponents = sThisTime.split(" ");
						sArrTimeComponents = sArrTempTimeComponents[0].split(sFormatSeparatorTime);

						iHours =  parseInt(sArrTimeComponents[0]);

						iMinutes = parseInt(sArrTimeComponents[1]);
						if(isNaN(iMinutes))
							iMinutes = 0;

						if(sArrTimeComponents.length > 2)
							iSeconds = parseInt(sArrTimeComponents[2]);

						if($.cf.compareStrings(sArrTempTimeComponents[1], "AM") && iHours === 12)
							iHours = 0;
						if($.cf.compareStrings(sArrTempTimeComponents[1], "PM") && iHours < 12)
							iHours = iHours + 12;
					}
					else if($.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[5]) || $.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[7]) || $.cf.compareStrings(sInputDateTimeFormat, $.CalenStyle.extra.sArrInputDateTimeFormats[9]))
					{
						sArrTimeComponents = sThisTime.split(sFormatSeparatorTime);

						iHours =  parseInt(sArrTimeComponents[0]);

						iMinutes = parseInt(sArrTimeComponents[1]);
						if(isNaN(iMinutes))
							iMinutes = 0;

						if(sArrTimeComponents.length > 2)
							iSeconds = parseInt(sArrTimeComponents[2]);
					}
					dTempDate = to.setDateInFormat({"iDate": {y: iYear, M: iMonth, d: iDay, H: iHours, m: iMinutes, s: iSeconds}}, "");
				}

				dTempDate = (bIsAllDay ? dTempDate : to.normalizeDateTimeWithOffset(dTempDate, sIpTZOffset, to.setting.outputTZOffset));
			}
		}

		if(bIsAllDay)
			dTempDate = to.setDateInFormat({"date": dTempDate}, "START");

		return dTempDate;
	},

	__getNumberOfDaysOfMonth: function(iMonth, iYear)
	{
		var to = this;
		var iArrMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		iArrLeapYearMonthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if(iYear % 4 === 0)
			return iArrLeapYearMonthDays[iMonth];
		else
			return iArrMonthDays[iMonth];
	},

	__findWhetherDateIsVisibleInCurrentView: function(dTempDate, bIsAllDay, dTempStartDateTime, dTempEndDateTime)
	{
		var to = this;
		if(!to.setting.excludeNonBusinessHours)
			return true;
		else
		{
			for(var iTempIndex = 0; iTempIndex < to.tv.dAVDt.length; iTempIndex++)
			{
				if(to.compareDates(to.tv.dAVDt[iTempIndex], dTempDate) === 0)
				{
					if(bIsAllDay)
						return true;
					else
					{
						var dTempStartDateBs = new Date(dTempDate),
						dTempEndDateBs = new Date(dTempDate);
						dTempStartDateBs.setHours(to.tv.oBsHours.startTime[0]);
						dTempStartDateBs.setMinutes(to.tv.oBsHours.startTime[1]);
						dTempEndDateBs.setHours(to.tv.oBsHours.endTime[0]);
						dTempEndDateBs.setMinutes(to.tv.oBsHours.endTime[1]);

						var dTempStartDate = new Date(dTempStartDateTime),
						dTempEndDate = new Date(dTempEndDateTime);
						if(to.compareDateTimes(dTempStartDateBs, dTempStartDateTime) > 0)
							dTempStartDate = new Date(dTempStartDateBs);
						if(to.compareDateTimes(dTempEndDateBs, dTempEndDateTime) < 0)
							dTempEndDate = new Date(dTempEndDateBs);

						if(to.compareDateTimes(dTempStartDate, dTempEndDate) < 0)
							return true;
						else
							return false;
					}
				}
			}
			return false;
		}
	},

	__getCurrentViewDates: function()
	{
		var to = this;
		var dArrTempDates, dMonthStartDate, dMonthEndDate;
		var dCurrentDateStart = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		if(!to.tv.bDyClDLV)
		{
			to.tv.dAVDt = [];

			if(to.setting.excludeNonBusinessHours && !$.cf.compareStrings(to.setting.visibleView, "WeekPlannerView"))
			{
				if(to.tv.iBsDays > 0)
				{
					if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView") || $.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker") || ($.cf.compareStrings(to.setting.visibleView, "AgendaView") && $.cf.compareStrings(to.setting.agendaViewDuration, "Month")))
					{
						while(to._getBusinessHoursForCurrentView(to.setting.selectedDate).length === 0)
							to.setting.selectedDate.setDate(to.setting.selectedDate.getDate() + 1);
					}
					else
					{
						while(to._getBusinessHoursForCurrentView(dCurrentDateStart).length === 0)
						{
							if(to.tv.sLoadType === "Next" || to.tv.sLoadType === "Load")
								dCurrentDateStart.setDate(dCurrentDateStart.getDate() + 1);
							else if(to.tv.sLoadType === "Prev")
								dCurrentDateStart.setDate(dCurrentDateStart.getDate() - 1);
						}
						to.setting.selectedDate = new Date(dCurrentDateStart);
					}
				}
				//else
				//	console.log("Business Hours Are Not Specified");
			}

			if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView") ||
				$.cf.compareStrings(to.setting.visibleView, "MonthView") ||
				$.cf.compareStrings(to.setting.visibleView, "DatePicker"))
			{
				dMonthStartDate = to.setDateInFormat({"iDate": {d: 1, M: dCurrentDateStart.getMonth(), y: dCurrentDateStart.getFullYear()}}, "START");
				dMonthEndDate = to.setDateInFormat({"iDate": {d: to.__getNumberOfDaysOfMonth(dCurrentDateStart.getMonth(), dCurrentDateStart.getFullYear()), M: dCurrentDateStart.getMonth(), y: dCurrentDateStart.getFullYear()}}, "START");

				to.tv.dVSDt = to.setDateInFormat({"date": to._getWeekForDate(dMonthStartDate, false)[0]}, "START");
				if(!to.setting.fixedNumOfWeeksInMonthView)
					to.tv.iWkInMonth = Math.round((to._getWeekForDate(dMonthEndDate, false)[0].getTime() - to.tv.dVSDt.getTime())/$.CalenStyle.extra.iMS.w) + 1;

				to.tv.iNoVDay = 0;
				var iDateMS = to.tv.dVSDt.getTime(),
				iNumMonthDays = (to.setting.excludeNonBusinessHours) ? (to.tv.iBsDays * to.tv.iWkInMonth) : (7 * to.tv.iWkInMonth);
				var iStartTZOffset = to.tv.dVSDt.getTimezoneOffset();
				for(var iTempIndex = 0; iTempIndex < (7 * to.tv.iWkInMonth); iTempIndex++)
				{
					var dTempDate = new Date(iDateMS);
					var iThisTZOffset = dTempDate.getTimezoneOffset();
					if(iStartTZOffset !== iThisTZOffset)
						dTempDate = new Date(iDateMS + ((iThisTZOffset - iStartTZOffset) * $.CalenStyle.extra.iMS.m));

					if(!to.setting.excludeNonBusinessHours)
					{
						to.tv.dAVDt.push(dTempDate);
						to.tv.iNoVDay++;
						if(to.tv.dAVDt.length === 1)
							to.tv.dVSDt = new Date(dTempDate);
						if(to.tv.dAVDt.length === iNumMonthDays)
							to.tv.dVEDt = new Date(dTempDate);
					}
					else if(to._getBusinessHoursForCurrentView(dTempDate).length > 0)
					{
						to.tv.dAVDt.push(dTempDate);
						to.tv.iNoVDay++;
						if(to.tv.dAVDt.length === 1)
							to.tv.dVSDt = new Date(dTempDate);
						if(to.tv.dAVDt.length === iNumMonthDays)
							to.tv.dVEDt = new Date(dTempDate);
					}
					iDateMS += $.CalenStyle.extra.iMS.d;
				}
				to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dVEDt}, "END");

				to.tv.dVDSDt = new Date(to.tv.dVSDt);
				to.tv.dVDEDt = new Date(to.tv.dVEDt);
			}
			else if($.cf.compareStrings(to.setting.visibleView, "QuickAgendaView"))
			{
				if($.cf.compareStrings(to.setting.quickAgendaViewDuration, "Week"))
				{
					dArrTempDates = to._getWeekForDate(dCurrentDateStart, false);
					to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dArrTempDates[0], null, "Next");

					to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
					to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");

					to.tv.dVDSDt = new Date(to.tv.dVSDt);
					to.tv.dVDEDt = new Date(to.tv.dVEDt);
				}
				else if($.cf.compareStrings(to.setting.quickAgendaViewDuration, "CustomDays"))
				{
					if(to.tv.sLoadType === "Next" || to.tv.sLoadType === "Load")
						to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dCurrentDateStart, null, "Next");
					else if(to.tv.sLoadType === "Prev")
					{
						to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dCurrentDateStart, null, "Prev");
						to.tv.dAVDt.reverse();
					}
					to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
					to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");

					to.tv.dVDSDt = new Date(to.tv.dVSDt);
					to.tv.dVDEDt = new Date(to.tv.dVEDt);
				}
			}
			else if($.cf.compareStrings(to.setting.visibleView, "TaskPlannerView"))
			{
				if($.cf.compareStrings(to.setting.taskPlannerViewDuration, "Week"))
				{
					dArrTempDates = to._getWeekForDate(dCurrentDateStart, false);
					to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dArrTempDates[0], null, "Next");

					to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
					to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");

					to.tv.dVDSDt = new Date(to.tv.dVSDt);
					to.tv.dVDEDt = new Date(to.tv.dVEDt);
				}
				else if($.cf.compareStrings(to.setting.taskPlannerViewDuration, "CustomDays"))
				{
					if(to.tv.sLoadType === "Next" || to.tv.sLoadType === "Load")
						to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dCurrentDateStart, null, "Next");
					else if(to.tv.sLoadType === "Prev")
					{
						to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dCurrentDateStart, null, "Prev");
						to.tv.dAVDt.reverse();
					}
					to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
					to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");

					to.tv.dVDSDt = new Date(to.tv.dVSDt);
					to.tv.dVDEDt = new Date(to.tv.dVEDt);
				}
			}
			else if($.cf.compareStrings(to.setting.visibleView, "AgendaView"))
			{
				if($.cf.compareStrings(to.setting.agendaViewDuration, "Month"))
				{
					dMonthStartDate = new Date(dCurrentDateStart);
					dMonthStartDate.setDate(1);
					to.tv.iNoVDay = to.__getNumberOfDaysOfMonth(dMonthStartDate.getMonth(), dMonthStartDate.getFullYear());
					dMonthEndDate = new Date(dCurrentDateStart);
					dMonthEndDate.setDate(to.tv.iNoVDay);
					to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dMonthStartDate, dMonthEndDate, "Next");

					to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
					to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");

					to.tv.dVDSDt = new Date(to.tv.dVSDt);
					to.tv.dVDEDt = new Date(to.tv.dVEDt);
				}
				else if($.cf.compareStrings(to.setting.agendaViewDuration, "Week"))
				{
					dArrTempDates = to._getWeekForDate(dCurrentDateStart, false);
					to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dArrTempDates[0], null, "Next");

					to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
					to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");

					to.tv.dVDSDt = new Date(to.tv.dVSDt);
					to.tv.dVDEDt = new Date(to.tv.dVEDt);
				}
				else if($.cf.compareStrings(to.setting.agendaViewDuration, "CustomDays"))
				{
					if(to.tv.sLoadType === "Next" || to.tv.sLoadType === "Load")
					to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dCurrentDateStart, null, "Next");
					else if(to.tv.sLoadType === "Prev")
					{
						to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dCurrentDateStart, null, "Prev");
						to.tv.dAVDt.reverse();
					}
					to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
					to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");

					to.tv.dVDSDt = new Date(to.tv.dVSDt);
					to.tv.dVDEDt = new Date(to.tv.dVEDt);
				}
			}
			else if($.cf.compareStrings(to.setting.visibleView, "AppointmentView"))
			{
				if(to.tv.sLoadType === "Next" || to.tv.sLoadType === "Load")
					to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dCurrentDateStart, null, "Next");
				else if(to.tv.sLoadType === "Prev")
				{
					to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dCurrentDateStart, null, "Prev");
					to.tv.dAVDt.reverse();
				}
				to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
				to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");
			}
			else if($.cf.compareStrings(to.setting.visibleView, "DayEventListView") || $.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
			{
				if(to.setting.daysInDayListView === 7)
				{
					dArrTempDates = to._getWeekForDate(dCurrentDateStart, false);
					to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dArrTempDates[0], null, "Next");
					for(var iDateIndex = 0; iDateIndex < to.tv.iNoVDay; iDateIndex++)
					{
						if(to.compareDates(dCurrentDateStart, to.tv.dAVDt[iDateIndex]) === 0)
						{
							to.tv.iSelDay = iDateIndex;
							break;
						}
					}

					to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
					to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");
				}
				else
				{
					var oArrDates1 = to.__setCurrentViewDatesArray((to.tv.iSelDay + 1), dCurrentDateStart, null, "Prev"),
					iBalDays = (to.tv.iNoVDay - (to.tv.iSelDay + 1)) + 1,
					oArrDates2;
					oArrDates1.reverse();
					oArrDates2 = to.__setCurrentViewDatesArray(iBalDays, dCurrentDateStart, null, "Next");
					oArrDates2.shift();
					to.tv.dAVDt = oArrDates1.concat(oArrDates2);

					to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
					to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");
				}

				to.tv.dVDSDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");
				to.tv.dVDEDt = to.setDateInFormat({"date": to.setting.selectedDate}, "END");
			}
			else if($.cf.compareStrings(to.setting.visibleView, "WeekView"))
			{
				dArrTempDates = to._getWeekForDate(dCurrentDateStart, false);
				to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dArrTempDates[0], null, "Next");

				to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
				to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");

				to.tv.dVDSDt = new Date(to.tv.dVSDt);
				to.tv.dVDEDt = new Date(to.tv.dVEDt);
			}
			else if($.cf.compareStrings(to.setting.visibleView, "DayView"))
			{
				to.tv.dVSDt = to.setDateInFormat({"date": dCurrentDateStart}, "START");
				to.tv.dVEDt = to.setDateInFormat({"date": dCurrentDateStart}, "END");

				to.tv.dVDSDt = new Date(to.tv.dVSDt);
				to.tv.dVDEDt = new Date(to.tv.dVEDt);

				to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dCurrentDateStart, null, "Next");
			}
			else if($.cf.compareStrings(to.setting.visibleView, "CustomView"))
			{
				if(to.tv.sLoadType === "Next" || to.tv.sLoadType === "Load")
					to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dCurrentDateStart, null, "Next");
				else if(to.tv.sLoadType === "Prev")
				{
					to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dCurrentDateStart, null, "Prev");
					to.tv.dAVDt.reverse();
				}
				to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
				to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");

				to.tv.dVDSDt = new Date(to.tv.dVSDt);
				to.tv.dVDEDt = new Date(to.tv.dVEDt);
			}
			else if($.cf.compareStrings(to.setting.visibleView, "WeekPlannerView"))
			{
				dArrTempDates = to._getWeekForDate(dCurrentDateStart, false);
				to.tv.dAVDt = to.__setCurrentViewDatesArray(to.tv.iNoVDay, dArrTempDates[0], null, "Next");

				to.tv.dVSDt = to.setDateInFormat({"date": to.tv.dAVDt[0]}, "START");
				to.tv.dVEDt = to.setDateInFormat({"date": to.tv.dAVDt[to.tv.iNoVDay - 1]}, "END");

				to.tv.dVDSDt = new Date(to.tv.dVSDt);
				to.tv.dVDEDt = new Date(to.tv.dVEDt);
			}
		}
	},

	__setCurrentViewDatesArray: function(iNoOfDays, dStartDate, dEndDate, sDir)
	{
		var to = this;
		var iDVDateMS = dStartDate.getTime(),
		oArrDates = [];

		var iStartTZOffset = dStartDate.getTimezoneOffset();
		for(var iDateIndex = 0; iDateIndex < iNoOfDays; iDateIndex++)
		{
			var dTempDate = new Date(iDVDateMS);
			var iThisTZOffset = dTempDate.getTimezoneOffset();
			if(iStartTZOffset !== iThisTZOffset)
				dTempDate = new Date(iDVDateMS + ((iThisTZOffset - iStartTZOffset) * $.CalenStyle.extra.iMS.m));

			//if(dEndDate !== null && to.compareDates(dTempDate, dEndDate) === 0)
			//	break;

			if(!to.setting.excludeNonBusinessHours)
				oArrDates.push(dTempDate);
			else if(to._getBusinessHoursForCurrentView(dTempDate).length > 0)
				oArrDates.push(dTempDate);
			else
				iDateIndex--;

			if(dEndDate !== null && to.compareDates(dTempDate, dEndDate) === 0)
				break;

			if($.cf.compareStrings(sDir, "Prev"))
				iDVDateMS -= $.CalenStyle.extra.iMS.d;
			else if($.cf.compareStrings(sDir, "Next"))
				iDVDateMS += $.CalenStyle.extra.iMS.d;
		}

		return oArrDates;
	},

	__getDayIndexInView: function(dTempDate)
	{
		var to = this;
		var iDayIndex = -1;
		for(var iTempIndex = 0; iTempIndex < to.tv.dAVDt.length; iTempIndex++)
		{
			var dThisDate = to.tv.dAVDt[iTempIndex];
			if(to.compareDates(dTempDate, dThisDate) === 0)
			{
				iDayIndex = iTempIndex;
				break;
			}
		}
		if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
			iDayIndex = 0;
		return iDayIndex;
	},

	_getWeekForDate: function(dTempDate, bFromSunday)
	{
		var to = this;
		var iWeekStartDiff = dTempDate.getDay() - (bFromSunday ? 0 : to.setting.weekStartDay);
		if(iWeekStartDiff < 0)
			iWeekStartDiff = 7 + iWeekStartDiff;
		var iWeekStartDiffMS = $.CalenStyle.extra.iMS.d * iWeekStartDiff,
		iTempDateDateMS = dTempDate.getTime(),
		iWeekStartDateMS = iTempDateDateMS - iWeekStartDiffMS,
		iWeekEndDateMS = iWeekStartDateMS + ($.CalenStyle.extra.iMS.d * 6),
		dWkStartDate = to.setDateInFormat({"date": new Date(iWeekStartDateMS)}, "START"),
		dWkEndDate = to.setDateInFormat({"date": new Date(iWeekEndDateMS)}, "END");
		return [dWkStartDate, dWkEndDate];
	},

	_getThursdayInAWeek: function(dWkStartDate)
	{
		var to = this;
		var iDayOfWeek = dWkStartDate.getDay(),
		iDiffDays = (iDayOfWeek > 4) ? ((7 - iDayOfWeek) + 4) : (4 - iDayOfWeek),
		iThursdayInWkMS = dWkStartDate.getTime() + ($.CalenStyle.extra.iMS.d * iDiffDays);
		return (new Date(iThursdayInWkMS));
	},

	__getWeekNumber: function(dWkStartDate, dWkEndDate)
	{
		var to = this;
		var sWeekNumber;
		var dYearStartDate = to._normalizeDateTime(dWkStartDate, "START", "y"),
		dYearEndDate = to._normalizeDateTime(dWkStartDate, "END", "y");

		if($.cf.compareStrings(to.setting.weekNumCalculation, "US"))
		{
			var dWeekStartDateYear = to._getWeekForDate(dYearStartDate, true)[0],
			iWeekStartDateYearMS = dWeekStartDateYear.getTime(),

			dWSDate = to._getWeekForDate(dWkStartDate, true)[0],
			iWkNumberStart = Math.ceil((dWSDate.getTime() - iWeekStartDateYearMS) / $.CalenStyle.extra.iMS.w) + 1,
			dWEDate = to._getWeekForDate(dWkEndDate, true)[0],
			iWkNumberEnd = Math.ceil((dWEDate.getTime() - iWeekStartDateYearMS) / $.CalenStyle.extra.iMS.w) + 1;

			if(to.setting.weekStartDay === 0)
			{
				if(to.compareDates(dWkEndDate, dYearEndDate) > 0)
					sWeekNumber = to.getNumberStringInFormat(iWkNumberStart, 0, true) + "/" + to.getNumberStringInFormat(1, 0, true);
				else
					sWeekNumber = to.getNumberStringInFormat(iWkNumberStart, 0, true);
			}
			else
			{
				if(iWkNumberStart !== iWkNumberEnd)
				{
					if(to.compareDates(dWkEndDate, dYearEndDate) > 0)
						sWeekNumber = to.getNumberStringInFormat(iWkNumberStart, 0, true) + "/" + to.getNumberStringInFormat(1, 0, true);
					else
						sWeekNumber = to.getNumberStringInFormat(iWkNumberStart, 0, true) + "/" + to.getNumberStringInFormat(iWkNumberEnd, 0, true);
				}
				else
					sWeekNumber = to.getNumberStringInFormat(iWkNumberStart, 0, true);
			}
		}
		else if($.cf.compareStrings(to.setting.weekNumCalculation, "Europe/ISO"))
		{
			if(dWkStartDate.getFullYear() !== dWkEndDate.getFullYear())
			{
				var dNextYearStartDate = new Date(dWkEndDate);
				dNextYearStartDate.setDate(1);
				dNextYearStartDate.setMonth(0);

				var dPrevYearStartDate = new Date(dWkStartDate);
				dPrevYearStartDate.setDate(1);
				dPrevYearStartDate.setMonth(0);

				dYearStartDate = (dWkEndDate.getDate() >= 3) ? dNextYearStartDate : dPrevYearStartDate;
			}
			var dFirstThursday = to._getThursdayInAWeek(dYearStartDate),
			dThursdayInWk = to._getThursdayInAWeek(dWkStartDate);
			sWeekNumber = Math.ceil((dThursdayInWk.getTime() - dFirstThursday.getTime()) / $.CalenStyle.extra.iMS.w) + 1;
			sWeekNumber = to.getNumberStringInFormat(sWeekNumber, 0, true);
		}

		return sWeekNumber;
	},

	__isDateInCurrentView: function(dTempDate)
	{
		var to = this;
		var sDateInCurrentWeek = false;
		if(to.tv.dAVDt.length > 0)
		{
			for(var iDateIndex = 0; iDateIndex < to.tv.dAVDt.length; iDateIndex++)
			{
				var dThisDate = to.tv.dAVDt[iDateIndex];
				if(to.compareDates(dThisDate, dTempDate) === 0)
					sDateInCurrentWeek = true;
			}
		}
		return sDateInCurrentWeek;
	},

	_normalizeDateTime: function(dInputDate, sFunction, sUnit)
	{
		var to = this;
		// sFunction = "START" | "END"
		// sUnit = "s" | "m" | "h" | "T" | "d" | "M" |

		var dOutputDate,
		iArrInput =
		{
			d: dInputDate.getDate(),
			M: dInputDate.getMonth(),
			y: dInputDate.getFullYear(),
			H: dInputDate.getHours(),
			m: dInputDate.getMinutes(),
			s: dInputDate.getSeconds()
		};

		switch(sUnit)
		{
			case "s":
				{
					if(sFunction === "START")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, iArrInput.H, iArrInput.M, 0, 0);
					else if(sFunction === "END")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, iArrInput.H, iArrInput.M, 59, 999);
				}
				break;
			case "m":
				{
					if(sFunction === "START")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, iArrInput.H, 0, 0, 0);
					else if(sFunction === "END")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, iArrInput.H, 59, 59, 999);
				}
				break;
			case "h":
			case "T":
				{
					if(sFunction === "START")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, 0, 0, 0, 0);
					else if(sFunction === "END")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, 23, 59, 59, 999);
				}
				break;
			case "d":
			case "dE":
				{
					if(sFunction === "START")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, 1, 0, 0, 0, 0);
					else if(sFunction === "END")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, to.__getNumberOfDaysOfMonth(iArrInput.M, iArrInput.y), 0, 0, 0, 0);
				}
				break;
			case "M":
			case "ME":
			case "y":
			case "yE":
				{
					if(sFunction === "START")
						dOutputDate = new Date(iArrInput.y, 0, 1, 0, 0, 0, 0);
					else if(sFunction === "END")
						dOutputDate = new Date(iArrInput.y, 11, to.__getNumberOfDaysOfMonth(11, iArrInput.y), 0, 0, 0, 0);
				}
				break;
		}

		if(sUnit === "dE" || sUnit === "ME" || sUnit === "yE")
			dOutputDate = to._normalizeDateTime(dOutputDate, "END", "T");

		return dOutputDate;
	},

	__getDifference: function(sUnit, dDate1, dDate2)
	{
		var to = this;
		// sUnit = "ms | "s" | "m" | "h" | "T" | "d" | "M"| "y"

		var iUnitDiff, iMSDiff = dDate1.getTime() - dDate2.getTime();

		if(sUnit === "ms")
			iUnitDiff = iMSDiff;
		else if(sUnit === "s")
			iUnitDiff = (iMSDiff /  $.CalenStyle.extra.iMS.s);
		else if(sUnit === "m")
			iUnitDiff = (iMSDiff / $.CalenStyle.extra.iMS.m);
		else if(sUnit === "h")
			iUnitDiff = (iMSDiff / $.CalenStyle.extra.iMS.h);
		else if(sUnit === "d")
			iUnitDiff = (iMSDiff / $.CalenStyle.extra.iMS.d);
		else if(sUnit === "M")
			iUnitDiff = (iMSDiff / $.CalenStyle.extra.iMS.m);
		else if(sUnit === "y")
			iUnitDiff = (iMSDiff /  $.CalenStyle.extra.iMS.y);

		return iUnitDiff;
	},

	// Public Method
	compareDates: function(dDate1, dDate2)
	{
		var to = this;
		dDate1 = to._normalizeDateTime(dDate1, "START", "T");
		dDate2 = to._normalizeDateTime(dDate2, "START", "T");
		var iDateDiff = to.__getDifference("d", dDate1, dDate2);
		return (iDateDiff === 0) ? iDateDiff: (iDateDiff/Math.abs(iDateDiff));
	},

	// Public Method
	compareDateTimes: function(dDate1, dDate2)
	{
		var to = this;
		var iDateTimeDiff = to.__getDifference("m", dDate1, dDate2);
		return (iDateTimeDiff === 0) ? iDateTimeDiff: (iDateTimeDiff/Math.abs(iDateTimeDiff));
	},

	_getMonthAndYear: function(iMonth, iYear, iNumOfMonths, sFetchType)
	{
		var to = this;
		var iNewMonth = iMonth, iNewYear = iYear;
		for(var iTempIndex = 0; iTempIndex < iNumOfMonths; iTempIndex++)
		{
			if($.cf.compareStrings(sFetchType, "Prev"))
			{
				iNewMonth = iNewMonth - 1;
				if(iNewMonth === -1)
				{
					iNewMonth = 11;
					iNewYear -= 1;
				}
			}
			else if($.cf.compareStrings(sFetchType, "Next"))
			{
				iNewMonth = iNewMonth + 1;
				if(iNewMonth === 12)
				{
					iNewMonth = 0;
					iNewYear += 1;
				}
			}
		}
		return [iNewMonth, iNewYear];
	},

	// Public Method
	getNumberStringInFormat: function(iNumber, iChars, bIsLocalized)
	{
		var to = this;
		var iTempIndex, sFormattedString = "", sNumber = iNumber.toString(), iNumberLength = sNumber.length;
		if(iChars !== 0)
		{
			for(iTempIndex = 0; iTempIndex < (iChars - iNumberLength); iTempIndex++)
				sFormattedString += (bIsLocalized ? to.setting.numbers[0] : "0");
		}
		if(!bIsLocalized)
			sFormattedString += sNumber;
		else
		{
			for(iTempIndex = 0; iTempIndex < iNumberLength; iTempIndex++)
				sFormattedString += to.setting.numbers[parseInt(sNumber.charAt(iTempIndex))];
		}
		return sFormattedString;
	},

	// Public Method
	getDateInFormat: function(oInput, sFormat, b24Hour, bIsLocalized)
	{
		var to = this;
		var oDateInFormat = "", sFormatMin,

		sDS = to.setting.formatSeparatorDate,
		sTS = to.setting.formatSeparatorTime,
		sDTS = to.setting.formatSeparatorDateTime,

		sArrVeryShortDayNames = bIsLocalized ? to.setting.veryShortDayNames : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		sArrShortDayNames = bIsLocalized ? to.setting.shortDayNames : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		sArrFullDayNames = bIsLocalized ? to.setting.fullDayNames : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		sArrShortMonthNames = bIsLocalized ? to.setting.shortMonthNames : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		sArrFullMonthNames = bIsLocalized ? to.setting.fullMonthNames : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		if(oInput.date === undefined && oInput.iDate === undefined)
			oInput.date = to._getCurrentDate();
		if(oInput.iDate === undefined)
		{
			oInput.iDate = {
				D: oInput.date.getDay(),
				d: oInput.date.getDate(),
				M: oInput.date.getMonth(),
				y: oInput.date.getFullYear(),
				H: oInput.date.getHours(),
				m: oInput.date.getMinutes(),
				s: oInput.date.getSeconds(),
				ms: oInput.date.getMilliseconds()
			};
		}
		oInput.iDate.h = (oInput.iDate.H > 12) ? (oInput.iDate.H - 12) : ((oInput.iDate.H === 0) ? 12 : oInput.iDate.H);
		oInput.iDate.me = (oInput.iDate.H < 12) ?  "am" : "pm";
		oInput.iDate.sm = (oInput.iDate.H < 12) ?  "a" : "p";

		if(b24Hour)
		{
			sFormat = sFormat.replace("hh", "HH");
			sFormat = sFormat.replace("h", "H");
			sFormat = sFormat.replace(" me", "", "\i");
			sFormat = sFormat.replace(" sm", "", "\i");
			sFormat = sFormat.replace("sm", "", "\i");
		}

		if(sFormat === "object")
			oDateInFormat = oInput.iDate;

		else if(sFormat === "d")
			oDateInFormat = (to.setting.formatDates.d !== undefined) ? to.setting.formatDates.d.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.d, 0, bIsLocalized);
		else if(sFormat === "M")
			oDateInFormat = (to.setting.formatDates.M !== undefined) ? to.setting.formatDates.M.call(to, oInput.iDate) : to.getNumberStringInFormat((oInput.iDate.M + 1), 0, bIsLocalized);
		else if(sFormat === "y")
			oDateInFormat = (to.setting.formatDates.y !== undefined) ? to.setting.formatDates.y.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.y, 0, bIsLocalized);
		else if(sFormat === "H")
			oDateInFormat = (to.setting.formatDates.H !== undefined) ? to.setting.formatDates.H.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.H, 0, bIsLocalized);
		else if(sFormat === "h")
			oDateInFormat = (to.setting.formatDates.h !== undefined) ? to.setting.formatDates.h.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.h , 0, bIsLocalized);
		else if(sFormat === "m")
			oDateInFormat = (to.setting.formatDates.m !== undefined) ? to.setting.formatDates.m.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.m, 0, bIsLocalized);
		else if(sFormat === "s")
			oDateInFormat = (to.setting.formatDates.s !== undefined) ? to.setting.formatDates.s.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.s, 0, bIsLocalized);

		if(sFormat === "dd")
			oDateInFormat = (to.setting.formatDates.dd !== undefined) ? to.setting.formatDates.dd.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.d, 2, bIsLocalized);
		else if(sFormat === "MM")
			oDateInFormat = (to.setting.formatDates.MM !== undefined) ? to.setting.formatDates.MM.call(to, oInput.iDate) : to.getNumberStringInFormat((oInput.iDate.M + 1), 2, bIsLocalized);
		else if(sFormat === "yyyy")
			oDateInFormat = (to.setting.formatDates.yyyy !== undefined) ? to.setting.formatDates.yyyy.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.y, 2, bIsLocalized);
		else if(sFormat === "HH")
			oDateInFormat = (to.setting.formatDates.HH !== undefined) ? to.setting.formatDates.HH.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.H, 2, bIsLocalized);
		else if(sFormat === "hh")
			oDateInFormat = (to.setting.formatDates.hh !== undefined) ? to.setting.formatDates.hh.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.h , 2, bIsLocalized);
		else if(sFormat === "mm")
			oDateInFormat = (to.setting.formatDates.mm !== undefined) ? to.setting.formatDates.mm.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.m, 2, bIsLocalized);
		else if(sFormat === "ss")
			oDateInFormat = (to.setting.formatDates.ss !== undefined) ? to.setting.formatDates.ss.call(to, oInput.iDate) : to.getNumberStringInFormat(oInput.iDate.s, 2, bIsLocalized);

		else if(sFormat === "DD")
			oDateInFormat = sArrVeryShortDayNames[oInput.iDate.D];
		else if(sFormat === "DDD")
			oDateInFormat = sArrShortDayNames[oInput.iDate.D];
		else if(sFormat === "DDDD")
			oDateInFormat = sArrFullDayNames[oInput.iDate.D];
		else if(sFormat === "MMM")
			oDateInFormat = sArrShortMonthNames[oInput.iDate.M];
		else if(sFormat === "MMMM")
			oDateInFormat = sArrFullMonthNames[oInput.iDate.M];

		else if(sFormat === "dd-MM-yyyy")
			oDateInFormat = (to.setting.formatDates["dd-MM-yyyy"] !== undefined) ? to.setting.formatDates["dd-MM-yyyy"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "dd", b24Hour, bIsLocalized) + sDS + to.getDateInFormat({"iDate": oInput.iDate}, "MM", b24Hour, bIsLocalized) + sDS + to.getDateInFormat({"iDate": oInput.iDate}, "yyyy", b24Hour, bIsLocalized);
		else if(sFormat === "dd MMM") // getShortDateFormatCF
			oDateInFormat = (to.setting.formatDates["dd MMM"] !== undefined) ? to.setting.formatDates["dd MMM"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "dd", b24Hour, bIsLocalized) + " " + to.getDateInFormat({"iDate": oInput.iDate}, "MMM", b24Hour, bIsLocalized);
		else if(sFormat === "dd-MMM-yyyy") // getDDMMMYYYYFormatCF
			oDateInFormat = (to.setting.formatDates["dd-MMM-yyyy"] !== undefined) ? to.setting.formatDates["dd-MMM-yyyy"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "dd", b24Hour, bIsLocalized) + sDS + to.getDateInFormat({"iDate": oInput.iDate}, "MMM", b24Hour, bIsLocalized) + sDS + to.getDateInFormat({"iDate": oInput.iDate}, "yyyy", b24Hour, bIsLocalized);
		else if(sFormat === "DDD MMM dd, yyyy") // getFullDateFormatCF
			oDateInFormat = (to.setting.formatDates["DDD MMM dd, yyyy"] !== undefined) ? to.setting.formatDates["DDD MMM dd, yyyy"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "DDD", b24Hour, bIsLocalized) + " " + to.getDateInFormat({"iDate": oInput.iDate}, "MMM", b24Hour, bIsLocalized) + " " + to.getDateInFormat({"iDate": oInput.iDate}, "dd", b24Hour, bIsLocalized) + ", " + to.getDateInFormat({"iDate": oInput.iDate}, "yyyy", b24Hour, bIsLocalized);
		else if(sFormat === "DDD MMM dd yyyy")
			oDateInFormat = (to.setting.formatDates["DDD MMM dd yyyy"] !== undefined) ? to.setting.formatDates["DDD MMM dd yyyy"].call(to, oInput.iDate) : "<b>" + to.getDateInFormat({"iDate": oInput.iDate}, "DDD", b24Hour, bIsLocalized) + " " + to.getDateInFormat({"iDate": oInput.iDate}, "MMM", b24Hour, bIsLocalized) + " " + to.getDateInFormat({"iDate": oInput.iDate}, "dd", b24Hour, bIsLocalized) + "</b> " + to.getDateInFormat({"iDate": oInput.iDate}, "yyyy", b24Hour, bIsLocalized);
		else if(sFormat === "DDDD MMM dd yyyy")
			oDateInFormat = (to.setting.formatDates["DDDD MMM dd yyyy"] !== undefined) ? to.setting.formatDates["DDDD MMM dd yyyy"].call(to, oInput.iDate) : "<b>" + to.getDateInFormat({"iDate": oInput.iDate}, "DDDD", b24Hour, bIsLocalized) + " " + to.getDateInFormat({"iDate": oInput.iDate}, "MMM", b24Hour, bIsLocalized) + " " + to.getDateInFormat({"iDate": oInput.iDate}, "dd", b24Hour, bIsLocalized) + "</b> " + to.getDateInFormat({"iDate": oInput.iDate}, "yyyy", b24Hour, bIsLocalized);
		else if(sFormat === "DDDD MMMM dd yyyy")
			oDateInFormat = (to.setting.formatDates["DDDD MMMM dd yyyy"] !== undefined) ? to.setting.formatDates["DDDD MMMM dd yyyy"].call(to, oInput.iDate) : "<b>" + to.getDateInFormat({"iDate": oInput.iDate}, "DDDD", b24Hour, bIsLocalized) + " - " + to.getDateInFormat({"iDate": oInput.iDate}, "MMMM", b24Hour, bIsLocalized) + " " + to.getDateInFormat({"iDate": oInput.iDate}, "dd", b24Hour, bIsLocalized) + "</b> " + to.getDateInFormat({"iDate": oInput.iDate}, "yyyy", b24Hour, bIsLocalized);
		else if(sFormat === "yyyy-MM-dd")
			oDateInFormat = (to.setting.formatDates["yyyy-MM-dd"] !== undefined) ? to.setting.formatDates["yyyy-MM-dd"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "yyyy", b24Hour, bIsLocalized) + sDS + to.getDateInFormat({"iDate": oInput.iDate}, "MM", b24Hour, bIsLocalized) + sDS + to.getDateInFormat({"iDate": oInput.iDate}, "dd", b24Hour, bIsLocalized);
		else if(sFormat === "ISO8601Date")
			oDateInFormat = (to.setting.formatDates.ISO8601Date !== undefined) ? to.setting.formatDates.ISO8601Date.call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "yyyy", b24Hour, bIsLocalized) + "-" + to.getDateInFormat({"iDate": oInput.iDate}, "MM", b24Hour, bIsLocalized) + "-" + to.getDateInFormat({"iDate": oInput.iDate}, "dd", b24Hour, bIsLocalized);
		else if(sFormat === "DDD, MMM dd")
			oDateInFormat = (to.setting.formatDates["DDD, MMM dd"] !== undefined) ? to.setting.formatDates["DDD, MMM dd"].call(to, oInput.iDate) : "<b>" + to.getDateInFormat({"iDate": oInput.iDate}, "DDD", b24Hour, bIsLocalized) + ", " + to.getDateInFormat({"iDate": oInput.iDate}, "MMM", b24Hour, bIsLocalized) + " " + to.getDateInFormat({"iDate": oInput.iDate}, "dd", b24Hour, bIsLocalized);

		// getTimeStringCF
		else if(sFormat === "hh:mm sm" || sFormat === "hh:mm SM")
			oDateInFormat = (to.setting.formatDates["hh:mm"] !== undefined) ? to.setting.formatDates["hh:mm"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "hh", b24Hour, bIsLocalized) + sTS + to.getDateInFormat({"iDate": oInput.iDate}, "mm", b24Hour, bIsLocalized) + " " + ((sFormat === "hh:mm SM") ? oInput.iDate.sm.toUpperCase() : oInput.iDate.sm);
		else if(sFormat === "hh:mmsm" || sFormat === "hh:mmSM")
			oDateInFormat = (to.setting.formatDates["hh:mm"] !== undefined) ? to.setting.formatDates["hh:mm"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "hh", b24Hour, bIsLocalized) + sTS + to.getDateInFormat({"iDate": oInput.iDate}, "mm", b24Hour, bIsLocalized) + ((sFormat === "hh:mmSM") ? oInput.iDate.sm.toUpperCase() : oInput.iDate.sm);
		else if(sFormat === "h[:m]sm" || sFormat === "h[:m]SM")
		{
			sFormatMin = (oInput.iDate.m !== 0) ? (sTS + to.getDateInFormat({"iDate": oInput.iDate}, "m", b24Hour, bIsLocalized)) : "";
			oDateInFormat = (to.setting.formatDates["h:m"] !== undefined) ? to.setting.formatDates["h:m"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "h", b24Hour, bIsLocalized) + sFormatMin + ((sFormat === "h:mSM") ? oInput.iDate.sm.toUpperCase() : oInput.iDate.sm);
		}
		else if(sFormat === "hh:mm" || sFormat === "hh:mm me" || sFormat === "hh:mm ME")
			oDateInFormat = (to.setting.formatDates["hh:mm"] !== undefined) ? to.setting.formatDates["hh:mm"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "hh", b24Hour, bIsLocalized) + sTS + to.getDateInFormat({"iDate": oInput.iDate}, "mm", b24Hour, bIsLocalized) + " " + ((sFormat === "hh:mm ME") ? oInput.iDate.me.toUpperCase() : oInput.iDate.me);
		else if(sFormat === "hh:mm:ss" || sFormat === "hh:mm:ss me" || sFormat === "hh:mm:ss ME")
			oDateInFormat = (to.setting.formatDates["hh:mm:ss"] !== undefined) ? to.setting.formatDates["hh:mm:ss"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "hh", b24Hour, bIsLocalized) + sTS + to.getDateInFormat({"iDate": oInput.iDate}, "mm", b24Hour, bIsLocalized) + sTS + to.getDateInFormat({"iDate": oInput.iDate}, "ss", b24Hour, bIsLocalized) + " " + ((sFormat === "hh:mm:ss ME") ? oInput.iDate.me.toUpperCase() : oInput.iDate.me);

		else if(sFormat === "HH:mm")
			oDateInFormat = (to.setting.formatDates["HH:mm"] !== undefined) ? to.setting.formatDates["HH:mm"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "HH", b24Hour, bIsLocalized) + sTS + to.getDateInFormat({"iDate": oInput.iDate}, "mm", b24Hour, bIsLocalized);
		else if(sFormat === "H[:m]")
		{
			sFormatMin = (oInput.iDate.m !== 0) ? (sTS + to.getDateInFormat({"iDate": oInput.iDate}, "m", b24Hour, bIsLocalized)) : "";
			oDateInFormat = (to.setting.formatDates["H:m"] !== undefined) ? to.setting.formatDates["H:m"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "H", b24Hour, bIsLocalized) + sFormatMin;
		}
		else if(sFormat === "HH:mm:ss")
			oDateInFormat = (to.setting.formatDates["HH:mm:ss"] !== undefined) ? to.setting.formatDates["HH:mm:ss"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "HH", b24Hour, bIsLocalized) + sTS + to.getDateInFormat({"iDate": oInput.iDate}, "mm", b24Hour, bIsLocalized) + sTS + to.getDateInFormat({"iDate": oInput.iDate}, "ss", b24Hour, bIsLocalized);
		else if(sFormat === "ISO8601Time")
			oDateInFormat = (to.setting.formatDates.ISO8601Time !== undefined) ? to.setting.formatDates.ISO8601Time.call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "HH", b24Hour, bIsLocalized) + ":" + to.getDateInFormat({"iDate": oInput.iDate}, "mm", b24Hour, bIsLocalized) + ":" + to.getDateInFormat({"iDate": oInput.iDate}, "ss", b24Hour, bIsLocalized);

		else if(sFormat === "dd-MM-yyyy HH:mm")
			oDateInFormat = (to.setting.formatDates["dd-MM-yyyy HH:mm"] !== undefined) ? to.setting.formatDates["dd-MM-yyyy HH:mm"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "dd-MM-yyyy", b24Hour, bIsLocalized) + sDTS + to.getDateInFormat({"iDate": oInput.iDate}, "HH:mm", b24Hour, bIsLocalized);
		else if(sFormat === "dd-MM-yyyy hh:mm")
			oDateInFormat = (to.setting.formatDates["dd-MM-yyyy hh:mm"] !== undefined) ? to.setting.formatDates["dd-MM-yyyy hh:mm"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "dd-MM-yyyy", b24Hour, bIsLocalized) + sDTS + to.getDateInFormat({"iDate": oInput.iDate}, "hh:mm", b24Hour, bIsLocalized);

		else if(sFormat === "HH:mm dd-MMM-yyyy") // getLongTimeDateStringCF
			oDateInFormat = (to.setting.formatDates["HH:mm dd-MMM-yyyy"] !== undefined) ? to.setting.formatDates["HH:mm dd-MMM-yyyy"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "HH:mm", b24Hour, bIsLocalized) + sDTS + to.getDateInFormat({"iDate": oInput.iDate}, "dd-MMM-yyyy", b24Hour, bIsLocalized);
		else if(sFormat === "hh:mm dd-MMM-yyyy") // getLongTimeDateStringCF
			oDateInFormat = (to.setting.formatDates["hh:mm dd-MMM-yyyy"] !== undefined) ? to.setting.formatDates["hh:mm dd-MMM-yyyy"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "hh:mm", b24Hour, bIsLocalized) + sDTS + to.getDateInFormat({"iDate": oInput.iDate}, "dd-MMM-yyyy", b24Hour, bIsLocalized);

		else if(sFormat === "yyyy-MM-ddTHH:mm:ss")//2013-12-10T00:00:00
			oDateInFormat = (to.setting.formatDates["yyyy-MM-ddTHH:mm:ss"] !== undefined) ? to.setting.formatDates["yyyy-MM-ddTHH:mm:ss"].call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "yyyy-MM-dd", b24Hour, bIsLocalized) + "T" + to.getDateInFormat({"iDate": oInput.iDate}, "HH:mm:ss", b24Hour, bIsLocalized);
		else if(sFormat === "ISO8601DateTime")//2013-12-10T00:00:00
			oDateInFormat = (to.setting.formatDates.ISO8601DateTime !== undefined) ? to.setting.formatDates.ISO8601DateTime.call(to, oInput.iDate) : to.getDateInFormat({"iDate": oInput.iDate}, "ISO8601Date", b24Hour, bIsLocalized) + "T" + to.getDateInFormat({"iDate": oInput.iDate}, "ISO8601Time", b24Hour, bIsLocalized);

		return oDateInFormat;
	},

	// Public Method
	getEventDateTimeString: function(dThisStartDate, dThisEndDate, bIsAllDay, sSeparator)
	{
		var to = this;

		var sDateTimeString = "";
		if(bIsAllDay)
		{
			if(to.compareDates(dThisStartDate, dThisEndDate) === 0)
				sDateTimeString =  to.getDateInFormat({"date": dThisStartDate}, "dd-MMM-yyyy", false, true);
			else
			{
				if(dThisEndDate.getHours() === 0 && dThisEndDate.getMinutes() === 0)
				{
					dThisEndDate.setTime(dThisEndDate.getTime() - $.CalenStyle.extra.iMS.m);
					if(to.compareDates(dThisStartDate, dThisEndDate) === 0)
						sDateTimeString =  to.getDateInFormat({"date": dThisStartDate}, "dd-MMM-yyyy", false, true);
					else
						sDateTimeString = to.getDateInFormat({"date": dThisStartDate}, "hh:mm dd-MMM-yyyy", to.setting.is24Hour, true) + sSeparator + to.getDateInFormat({"date": dThisEndDate}, "hh:mm dd-MMM-yyyy", to.setting.is24Hour, true);
				}
				else
					sDateTimeString = to.getDateInFormat({"date": dThisStartDate}, "hh:mm dd-MMM-yyyy", to.setting.is24Hour, true) + sSeparator + to.getDateInFormat({"date": dThisEndDate}, "hh:mm dd-MMM-yyyy", to.setting.is24Hour, true);
			}
		}
		else
		{
			if(to.compareDates(dThisStartDate, dThisEndDate) === 0)
				sDateTimeString = to.getDateInFormat({"date": dThisStartDate}, "hh:mm", to.setting.is24Hour, true) + sSeparator + to.getDateInFormat({"date": dThisEndDate}, "hh:mm", to.setting.is24Hour, true);
			else
				sDateTimeString = to.getDateInFormat({"date": dThisStartDate}, "hh:mm dd-MMM-yyyy", to.setting.is24Hour, true) + sSeparator + to.getDateInFormat({"date": dThisEndDate}, "hh:mm dd-MMM-yyyy", to.setting.is24Hour, true);
		}

		return sDateTimeString;
	},

	__getDurationBetweenDates: function(dStartDate, dEndDate, sFormat, bAllowZero, bReturnObject)
	{
		var to = this;
		var iRem = Math.abs(dEndDate.getTime() - dStartDate.getTime()),
		oFormat = {},
		sDuration = "";

		for(var iTempIndex = 0; iTempIndex < sFormat.length; iTempIndex++)
			oFormat[sFormat.charAt(iTempIndex)] = 0;

		if(oFormat.y !== undefined)
		{
			oFormat.y = Math.floor(iRem / $.CalenStyle.extra.iMS.y);
			iRem = iRem % $.CalenStyle.extra.iMS.y;
			if(!bReturnObject && oFormat.y !== undefined && (bAllowZero ? true: (oFormat.y !== 0)))
				sDuration += oFormat.y + ((oFormat.y === 1) ? to.setting.durationStrings.y[0]: to.setting.durationStrings.y[1]);
		}
		if(oFormat.M !== undefined)
		{
			oFormat.M = Math.floor(iRem / $.CalenStyle.extra.iMS.m);
			iRem = iRem % $.CalenStyle.extra.iMS.m;
			if(!bReturnObject && oFormat.M !== undefined && (bAllowZero ? true: (oFormat.M !== 0)))
				sDuration += oFormat.M + ((oFormat.M === 1) ? to.setting.durationStrings.M[0]: to.setting.durationStrings.M[1]);
		}
		if(oFormat.w !== undefined)
		{
			oFormat.w = Math.floor(iRem / $.CalenStyle.extra.iMS.w);
			iRem = iRem % $.CalenStyle.extra.iMS.w;
			if(!bReturnObject && oFormat.w !== undefined && (bAllowZero ? true: (oFormat.w !== 0)))
				sDuration += oFormat.w + ((oFormat.w === 1) ? to.setting.durationStrings.w[0]: to.setting.durationStrings.w[1]);
		}
		if(oFormat.d !== undefined)
		{
			oFormat.d = Math.floor(iRem / $.CalenStyle.extra.iMS.d);
			iRem = iRem % $.CalenStyle.extra.iMS.d;
			if(!bReturnObject && oFormat.d !== undefined && (bAllowZero ? true: (oFormat.d !== 0)))
				sDuration += oFormat.d + ((oFormat.d === 1) ? to.setting.durationStrings.d[0]: to.setting.durationStrings.d[1]);
		}
		if(oFormat.h !== undefined)
		{
			oFormat.h = Math.floor(iRem / $.CalenStyle.extra.iMS.h);
			iRem = iRem % $.CalenStyle.extra.iMS.h;
			if(!bReturnObject && oFormat.h !== undefined && (bAllowZero ? true: (oFormat.h !== 0)))
				sDuration += oFormat.h + ((oFormat.h === 1) ? to.setting.durationStrings.h[0]: to.setting.durationStrings.h[1]);
		}
		if(oFormat.m !== undefined)
		{
			oFormat.m = Math.floor(iRem / $.CalenStyle.extra.iMS.m);
			iRem = iRem % $.CalenStyle.extra.iMS.m;
			if(!bReturnObject && oFormat.m !== undefined && (bAllowZero ? true: (oFormat.m !== 0)))
				sDuration += oFormat.m + ((oFormat.m === 1) ? to.setting.durationStrings.m[0]: to.setting.durationStrings.m[1]);
		}
		if(oFormat.s !== undefined)
		{
			oFormat.s = Math.floor(iRem / $.CalenStyle.extra.iMS.s);
			iRem = iRem % $.CalenStyle.extra.iMS.s;
			if(!bReturnObject && oFormat.s !== undefined && (bAllowZero ? true: (oFormat.s !== 0)))
				sDuration += oFormat.s + ((oFormat.s === 1) ? to.setting.durationStrings.s[0]: to.setting.durationStrings.s[1]);
		}

		if(bReturnObject)
			return oFormat;
		else
		{
			return sDuration.trim();
		}
	},

	//------------------------------- Date Manipulation Functions End -------------------------------

	//------------------------------------ Events Manipulation Start ------------------------------------

	__isValidUrl: function(sURL)
	{
		return sURL.match(/(((ftp|http|https):\/\/)|(\/)|(..\/)|())(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/) ? true : false;
	},

	_isGoogleCalendarUrl: function(sURL)
	{
		return sURL.match("https://www.googleapis.com/calendar/v3/calendars/") ? true : false;
	},

	_convertToISO8601Date: function(dTempDate, sIpTZOffset)
	{
		var to = this;
		//For example, 2013-12-10T00:00:00+05:30
		return (to.getDateInFormat({"date": dTempDate}, "ISO8601DateTime", false, true) + (sIpTZOffset || to.setting.inputTZOffset));
	},

	// Public Method
	incrementDataLoadingCount: function(iCount)
	{
		var to = this;
		to.tv.iLoadCnt = to.tv.iLoadCnt + iCount;
		if(to.tv.iLoadCnt === 1)
			to._startDataLoading();
	},

	_startDataLoading: function()
	{
		var to = this;
		if(to.tv.iLoadCnt >= 1)
		{
			to.addRemoveLoaderIndicators(true, "cEventLoaderIndicator");
			to.addRemoveViewLoader(true, "cEventLoaderBg");

			if(to.setting.dataLoadingStart)
				to.setting.dataLoadingStart.call(to, to.setting.visibleView);
		}
	},

	_stopDataLoading: function(dDurationStartDate, dDurationEndDate, loadViewCallback)
	{
		var to = this;
		to.tv.iLoadCnt--;
		if(to.tv.iLoadCnt === 0)
		{
			if(to.setting.dataLoadingEnd)
				to.setting.dataLoadingEnd.call(to, to.setting.visibleView);
			if(to.setting.deleteOldDataWhileNavigating)
				to._dataCleaning(dDurationStartDate, dDurationEndDate);
			loadViewCallback();
		}
	},

	__parseJson: function(oTempJson)
	{
		var to = this;
		if($.cf.compareStrings(typeof oTempJson, "string"))
			return $.parseJSON(oTempJson);
		else
			return oTempJson;
	},

	// Public Method
	parseDataSource: function(sSourceTitle, oArrTempJson, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback, oConfig, bIsGoogleCalendarURL)
	{
		var to = this;
		oArrTempJson = to.__parseJson(oArrTempJson);

		if($.cf.compareStrings(sSourceTitle, "eventSource") && bIsGoogleCalendarURL)
		{
			to._getModifiedEventsArray(oArrTempJson, oConfig, bIsGoogleCalendarURL, false);
		}
		else
		{
			if(oArrTempJson.length > 0)
			{
				if($.cf.compareStrings(sSourceTitle, "eventCalendarSource"))
					to._getModifiedEventCalendarsArray(oArrTempJson);
				else if($.cf.compareStrings(sSourceTitle, "eventSource"))
					to._getModifiedEventsArray(oArrTempJson, oConfig, bIsGoogleCalendarURL, false);
				else if($.cf.compareStrings(sSourceTitle, "sourceCount"))
					to._getModifiedSourceCountArray(oArrTempJson, oConfig);
				else if($.cf.compareStrings(sSourceTitle, "restrictedSectionSource"))
					to._getModifiedRestrictedSectionArray(oArrTempJson, oConfig);
				else if($.cf.compareStrings(sSourceTitle, "slotAvailabilitySource"))
					to._getModifiedSlotAvailabilityArray(oArrTempJson, oConfig);
			}
			else
			{
				if($.cf.compareStrings(sSourceTitle, "eventCalendarSource"))
					to.tv.oAECalendar = [];
				else if($.cf.compareStrings(sSourceTitle, "eventSource"))
					to.tv.oAEvents = [];
				else if($.cf.compareStrings(sSourceTitle, "sourceCount"))
					to.tv.oASrcCnt = [];
				else if($.cf.compareStrings(sSourceTitle, "restrictedSectionSource"))
					to.tv.oAResSec  = [];
				else if($.cf.compareStrings(sSourceTitle, "slotAvailabilitySource"))
					to.tv.oASltAvail = [];
			}
		}

		to._stopDataLoading(dTempDurationStartDate, dTempDurationEndDate, loadViewCallback);
	},

	_parseAllDataSources: function(oSourceJson, oConfig, bIsGoogleCalendarURL, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback)
	{
		var to = this;
		var iDataLoadingCount = 0;
		if(bIsGoogleCalendarURL)
			iDataLoadingCount++;
		if(oSourceJson.eventCalendarSource !== undefined)
			iDataLoadingCount++;
		if(oSourceJson.eventSource !== undefined)
			iDataLoadingCount++;
		if(oSourceJson.sourceCount !== undefined)
			iDataLoadingCount++;
		if(oSourceJson.restrictedSectionSource !== undefined)
			iDataLoadingCount++;
		if(oSourceJson.slotAvailabilitySource !== undefined)
			iDataLoadingCount++;

		to.incrementDataLoadingCount(iDataLoadingCount);

		if(bIsGoogleCalendarURL)
			to.parseDataSource("eventSource", oSourceJson, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback, oConfig, bIsGoogleCalendarURL);
		if(oSourceJson.eventCalendarSource !== undefined)
			to.parseDataSource("eventCalendarSource", oSourceJson.eventCalendarSource, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback, oConfig, bIsGoogleCalendarURL);
		if(oSourceJson.eventSource !== undefined)
			to.parseDataSource("eventSource", oSourceJson.eventSource, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback, oConfig, bIsGoogleCalendarURL);
		if(oSourceJson.sourceCount !== undefined)
			to.parseDataSource("sourceCount", oSourceJson.sourceCount, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback, oConfig, bIsGoogleCalendarURL);
		if(oSourceJson.restrictedSectionSource !== undefined)
			to.parseDataSource("restrictedSectionSource", oSourceJson.restrictedSectionSource, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback, oConfig, bIsGoogleCalendarURL);
		if(oSourceJson.slotAvailabilitySource !== undefined)
			to.parseDataSource("slotAvailabilitySource", oSourceJson.slotAvailabilitySource, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback, oConfig, bIsGoogleCalendarURL);

		if(iDataLoadingCount === 0)
			to._stopDataLoading(dTempDurationStartDate, dTempDurationEndDate, loadViewCallback);
	},

	__parseData: function(bLoadAllData, loadViewCallback)
	{
		var to = this;

		if(!bLoadAllData)
			loadViewCallback();
		else
		{
			var dLoadStartDate = null, dLoadEndDate = null,
			dDurationStartDate = null, dDurationEndDate = null;

			// ----------------------------- decide whether to load data -------------------------------
			var bFetchAll = false, bFetchDateRange = false,
			iSourceIndex, oSource, iSUParamIndex, oSourceParam;

			for(iSourceIndex = 0; iSourceIndex < to.setting.calDataSource.length; iSourceIndex++)
			{
				oSource = to.setting.calDataSource[iSourceIndex];
				if($.cf.compareStrings(oSource.sourceFetchType, "All") && !oSource.fetched)
					bFetchAll = true;
				if($.cf.compareStrings(oSource.sourceFetchType, "DateRange"))
					bFetchDateRange = true;
			}

			var bLoadDataInDateRange = false;
			if(bFetchDateRange)
			{
				if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView") || $.cf.compareStrings(to.setting.visibleView, "MonthView") || ($.cf.compareStrings(to.setting.visibleView, "AgendaView") && $.cf.compareStrings(to.setting.agendaViewDuration, "Month")))
					bLoadDataInDateRange = true;
				else
				{
					if($.cf.compareStrings(to.tv.sLoadType, "Prev"))
					{
						var iCompPrevLoadStartDate = to.compareDateTimes(to.tv.dLoadDt, to.tv.dPLSDt),
						bCompPrevLoadStartDate = false;
						if(iCompPrevLoadStartDate >= 0)
							bCompPrevLoadStartDate = true;
						//-------------------------------------------------------------------------------
						var iCompPrevLoadEndDate = to.compareDateTimes(to.tv.dLoadDt, to.tv.dPLEDt),
						bCompPrevLoadEndDate = false;
						if(iCompPrevLoadEndDate <= 0)
							bCompPrevLoadEndDate = true;
						//-------------------------------------------------------------------------------
						if(bCompPrevLoadStartDate && bCompPrevLoadEndDate)
							bLoadDataInDateRange = true;
					}
					else if($.cf.compareStrings(to.tv.sLoadType, "Next"))
					{
						var iCompNextLoadStartDate = to.compareDateTimes(to.tv.dLoadDt, to.tv.dNLSDt),
						bCompNextLoadStartDate = false;
						if(iCompNextLoadStartDate >= 0)
							bCompNextLoadStartDate = true;
						//-------------------------------------------------------------------------------
						var iCompNextLoadEndDate = to.compareDateTimes(to.tv.dLoadDt, to.tv.dNLEDt),
						bCompNextLoadEndDate = false;
						if(iCompNextLoadEndDate <= 0)
							bCompNextLoadEndDate = true;
						//-------------------------------------------------------------------------------
						if(bCompNextLoadStartDate && bCompNextLoadEndDate)
							bLoadDataInDateRange = true;
					}
					else
						bLoadDataInDateRange = true;
				}

				if(bLoadDataInDateRange)
				{
					//----------------------- set Current Month Start and End Dates -------------------------
					var iMonth = to.tv.dLoadDt.getMonth(),
					iYear = to.tv.dLoadDt.getFullYear();

					//----------------------- set Previous Month Start and End Dates -------------------------
					var iArrPrev = to._getMonthAndYear(iMonth, iYear, 1, "Prev"),
					iPrevMonth = iArrPrev[0],
					iPrevYear = iArrPrev[1],
					iPrevMonthDays = to.__getNumberOfDaysOfMonth(iPrevMonth, iPrevYear);
					to.tv.dPLSDt = to.setDateInFormat({"iDate": {d: 1, M: iPrevMonth, y: iPrevYear}}, "START");
					to.tv.dPLEDt = to.setDateInFormat({"iDate": {d: iPrevMonthDays, M: iPrevMonth, y: iPrevYear}}, "START");

					//----------------------- set Next Month Start and End Dates -----------------------------
					var iArrNext = to._getMonthAndYear(iMonth, iYear, 1, "Next"),
					iNextMonth = iArrNext[0],
					iNextYear = iArrNext[1],
					iNextMonthDays = to.__getNumberOfDaysOfMonth(iNextMonth, iNextYear);
					to.tv.dNLSDt = to.setDateInFormat({"iDate": {d: 1, M: iNextMonth, y: iNextYear}}, "START");
					to.tv.dNLEDt = to.setDateInFormat({"iDate": {d: iNextMonthDays, M: iNextMonth, y: iNextYear}}, "START");

					// ---------------------- set Start and End Dates for loading data ---------------------------
					var iArrLoadPrev = to._getMonthAndYear(iMonth, iYear, to.setting.extraMonthsForDataLoading, "Prev"),
					iLoadPrevMonth = iArrLoadPrev[0],
					iLoadPrevYear = iArrLoadPrev[1],
					iLoadPrevMonthDays = to.__getNumberOfDaysOfMonth(iLoadPrevMonth, iLoadPrevYear),

					iArrLoadNext = to._getMonthAndYear(iMonth, iYear, to.setting.extraMonthsForDataLoading, "Next"),
					iLoadNextMonth = iArrLoadNext[0],
					iLoadNextYear = iArrLoadNext[1],
					iLoadNextMonthDays = to.__getNumberOfDaysOfMonth(iLoadNextMonth, iLoadNextYear);

					if($.cf.compareStrings(to.tv.sLoadType, "Load") || $.cf.compareStrings(to.setting.datasetModificationRule, "ReplaceAll"))
					{
						dLoadStartDate = to.setDateInFormat({"iDate": {d: 1, M: iLoadPrevMonth, y: iLoadPrevYear}}, "START");
						dLoadEndDate = to.setDateInFormat({"iDate": {d: iLoadNextMonthDays, M: iLoadNextMonth, y: iLoadNextYear}}, "END");
						dDurationStartDate = dLoadStartDate;
						dDurationEndDate = dLoadEndDate;
					}
					else if($.cf.compareStrings(to.tv.sLoadType, "Prev"))
					{
						dLoadStartDate = to.setDateInFormat({"iDate": {d: 1, M: iLoadPrevMonth, y: iLoadPrevYear}}, "START");
						dLoadEndDate = to.setDateInFormat({"iDate": {d: iLoadPrevMonthDays, M: iLoadPrevMonth, y: iLoadPrevYear}}, "END");
						dDurationStartDate = new Date(dLoadStartDate);
						dDurationEndDate = to.setDateInFormat({"iDate": {d: iLoadNextMonthDays, M: iLoadNextMonth, y: iLoadNextYear}}, "END");
					}
					else if($.cf.compareStrings(to.tv.sLoadType, "Next"))
					{
						dLoadStartDate = to.setDateInFormat({"iDate": {d: 1, M: iLoadNextMonth, y: iLoadNextYear}}, "START");
						dLoadEndDate = to.setDateInFormat({"iDate": {d: iLoadNextMonthDays, M: iLoadNextMonth, y: iLoadNextYear}}, "END");
						dDurationStartDate = to.setDateInFormat({"iDate": {d: 1, M: iLoadPrevMonth, y: iLoadPrevYear}}, "START");
						dDurationEndDate = new Date(dLoadEndDate);
					}
				}
			}

			if(bLoadDataInDateRange || bFetchAll)
			{
				if($.cf.compareStrings(to.tv.sLoadType, "Load"))
				{
					to.tv.oAECalendar = [];
					to.tv.oAEvents = [];
					to.tv.oASrcCnt = [];
					to.tv.oAResSec  = [];
					to.tv.oASltAvail = [];
					to.tv.iMaxEvId = 0;
				}

				//------------------------ Data Loading Start -----------------------------

				for(iSourceIndex = 0; iSourceIndex < to.setting.calDataSource.length; iSourceIndex++)
				{
					oSource = to.setting.calDataSource[iSourceIndex];
					var oConfig = oSource.config || {},
					dTempLoadStartDate = null, dTempLoadEndDate = null,
					dTempDurationStartDate = null, dTempDurationEndDate = null;
					if($.cf.compareStrings(oSource.sourceFetchType, "DateRange"))
					{
						dTempLoadStartDate = dLoadStartDate;
						dTempLoadEndDate = dLoadEndDate;
						dTempDurationStartDate = dDurationStartDate;
						dTempDurationEndDate = dDurationEndDate;
					}

					if($.cf.compareStrings(oSource.sourceType, "JSON"))
					{
						var oSourceJson = to.__parseJson(oSource.source);
						to._parseAllDataSources(oSourceJson, oConfig, false, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback);
					}
					else if($.cf.compareStrings(oSource.sourceType, "FUNCTION"))
						oSource.source.call(to, dTempLoadStartDate, dTempLoadEndDate, dTempDurationStartDate, dTempDurationEndDate, oConfig, loadViewCallback);
					else if($.cf.compareStrings(oSource.sourceType, "URL"))
					{
						if(to.__isValidUrl(oSource.source))
						{
							var sBaseUrl = oSource.source,
							bGoogleCalendar = to._isGoogleCalendarUrl(sBaseUrl),
							oUrlParam = {},
							oSourceURLParams = {},
							sTZOffset = oConfig.tzOffset || "";

							for(var iSUrlIndex = 0; iSUrlIndex < to.tv.oSURLParams.length; iSUrlIndex++)
							{
								var oSourceURL = to.tv.oSURLParams[iSUrlIndex];
								if(oSourceURL.sourceId === oSource.sourceId)
									oSourceURLParams = oSourceURL.params;
							}

							if(bGoogleCalendar)
							{
								sBaseUrl += "/events?callback=?";
								oUrlParam.sortOrder = "ascending";
								oUrlParam.singleEvents = "true";
								oUrlParam.timeZone = to.setting.tz;
								oUrlParam.maxResults = 1000;
								oUrlParam.key = oConfig.googleCalendarApiKey || "";

								for(iSUParamIndex = 0; iSUParamIndex < oSourceURLParams.length; iSUParamIndex++)
								{
									oSourceParam = oSourceURLParams[iSUParamIndex];
									oUrlParam[oSourceParam.keyName] = oSourceParam.values;
								}

								if($.cf.compareStrings(oSource.sourceFetchType, "DateRange"))
								{
									if(dTempLoadStartDate !== null && dTempLoadEndDate !== null)
									{
										oUrlParam.timeMin = to._convertToISO8601Date(dTempLoadStartDate, sTZOffset);
										oUrlParam.timeMax = to._convertToISO8601Date(dTempLoadEndDate, sTZOffset);
									}
								}
							}
							else
							{
								for(iSUParamIndex = 0; iSUParamIndex < oSourceURLParams.length; iSUParamIndex++)
								{
									oSourceParam = oSourceURLParams[iSUParamIndex];
									oUrlParam[oSourceParam.keyName] = oSourceParam.values;
								}

								if($.cf.compareStrings(oSource.sourceFetchType, "DateRange"))
								{
									oUrlParam.callback = "?";
									if(dTempLoadStartDate !== null && dTempLoadEndDate !== null)
									{
										oUrlParam.startdate = to.getDateInFormat({"date": dTempLoadStartDate}, "yyyy-MM-dd", false, false);
										oUrlParam.enddate = to.getDateInFormat({"date": dTempLoadEndDate}, "yyyy-MM-dd", false, false);
										oUrlParam.startdatetime = to.getDateInFormat({"date": to.convertToUTC(dTempLoadStartDate, sTZOffset)}, "yyyy-MM-ddTHH:mm:ss", false, false);
										oUrlParam.enddatetime = to.getDateInFormat({"date": to.convertToUTC(dTempLoadEndDate, sTZOffset)}, "yyyy-MM-ddTHH:mm:ss", false, false);
									}
								}
							}

							to._requestJson(sBaseUrl, oUrlParam, oConfig, bGoogleCalendar, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback);
						}
						else
							console.log("Invalid Event Source String");
					}
					else
						console.log("Invalid Event Source.");

					oSource.fetched = true;
				}
				//------------------------ Data Loading End -----------------------------
			}
			else
				loadViewCallback();
		}
	},

	_requestJson: function(sBaseUrl, oUrlParam, oConfig, bGoogleCalendar, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback)
	{
		var to = this;

		console.log("sBaseUrl : " + sBaseUrl);
		console.log(oUrlParam);

		to.incrementDataLoadingCount(1);

		$.getJSON(sBaseUrl, oUrlParam)
		.done(function(sJsonStr)
		{
			to.tv.iLoadCnt--;
			sJsonStr = to.__parseJson(sJsonStr);
			//console.log("Json Response : ");
			//console.log(sJsonStr);
			to._parseAllDataSources(sJsonStr, oConfig, bGoogleCalendar, dTempDurationStartDate, dTempDurationEndDate, loadViewCallback);
		})
		.fail(function(oJqXHR, sTextStatus, oError)
		{
			to._stopDataLoading(dTempDurationStartDate, dTempDurationEndDate, loadViewCallback);
			console.log("Request Failed : " + sTextStatus + "  :  " + oError);
		});
	},

	_getModifiedEventCalendarsArray: function(oArrJson)
	{
		var to = this;
		if($.cf.compareStrings(to.setting.datasetModificationRule, "Default"))
			to.tv.oAECalendar = to.tv.oAECalendar.concat(oArrJson);
		else if($.cf.compareStrings(to.setting.datasetModificationRule, "ReplaceAll"))
			to.tv.oAECalendar = oArrJson;
		to.__addEventCalendarToEventFilterCriteriaArray();
	},

	_getRecurringEventsArray: function(oArrEntry)
	{
		var to = this;
		var oArrEntryIds = [];

		for (var i = 0; i < oArrEntry.length; i++)
		{
			var oEntry = oArrEntry[i],
			sId = oEntry.iCalUID,
			iCount = 0;

			for(var j = 0; j < oArrEntryIds.length; j++)
			{
				var oTempEntry = oArrEntryIds[j],
				sTempId = oTempEntry[0],
				iTempCount = parseInt(oTempEntry[1]);

				if(sId === sTempId)
				{
					iCount = ++iTempCount;
					oArrEntryIds[j] = [sTempId, iCount];
					break;
				}
			}

			if(iCount === 0)
				oArrEntryIds.push([sId, 1]);
		}

		return oArrEntryIds;
	},

	_getModifiedEventsArray: function(oArrJson, oConfig, bIsGoogleCalendarURL, isConcat)
	{
		var to = this;
		var sColorArray = [],
		iJsonObjCount = 0,oEvent, iJsonIndex, oJsonRecord,

		sInputDateTimeFormat = oConfig.inputDateTimeFormat || "",
		sFormatSeparatorDateTime = oConfig.formatSeparatorDateTime || "",
		sFormatSeparatorDate = oConfig.formatSeparatorDate || "",
		sFormatSeparatorTime = oConfig.formatSeparatorTime || "",
		sTZOffset = oConfig.inputTZOffset || to.setting.inputTZOffset,

		bFromSingleColor = false, sSingleColor, sColor, sBorderColor, sTextColor, sNonAllDayEventsTextColor,
		fAlpha = 0.1;

		if($.cf.isValid(oConfig.singleColor))
		{
			bFromSingleColor = true;
			sSingleColor = $.cf.addHashToHexcode(oConfig.singleColor);
			sColor = $.cf.getRGBAString(sSingleColor, fAlpha);
			sBorderColor = sSingleColor;
			sTextColor = sSingleColor;
			sNonAllDayEventsTextColor = sSingleColor;
		}
		else
		{
			sColor = oConfig.backgroundColor || "";
			sColor = ($.cf.compareStrings(sColor, "") || $.cf.compareStrings(sColor, "transparent")) ? "transparent" : sColor;
			sBorderColor = oConfig.borderColor || "";
			sBorderColor = ($.cf.compareStrings(sBorderColor, "") || $.cf.compareStrings(sBorderColor, "transparent")) ? "transparent" : sBorderColor;
			sTextColor = oConfig.textColor || "";
			sTextColor = ($.cf.compareStrings(sTextColor, "") || $.cf.compareStrings(sTextColor, "transparent")) ? to.setting.textColor : sTextColor;
			sNonAllDayEventsTextColor = oConfig.nonAllDayEventsTextColor || "";
			sNonAllDayEventsTextColor = $.cf.compareStrings(sNonAllDayEventsTextColor, "transparent") ? "transparent" : ($.cf.compareStrings(sNonAllDayEventsTextColor, "") ? sColor : sNonAllDayEventsTextColor);

			sColor = $.cf.addHashToHexcode(sColor);
			sBorderColor = $.cf.addHashToHexcode(sBorderColor);
			sTextColor = $.cf.addHashToHexcode(sTextColor);
			sNonAllDayEventsTextColor = $.cf.addHashToHexcode(sNonAllDayEventsTextColor);
		}

		var bEventMatched, sIcon = null;
		sIcon = $.cf.isValid(oConfig.icon) ? oConfig.icon : to.setting.eventIcon;

		if(bIsGoogleCalendarURL)
		{
			var oRoot = oArrJson,
			sType = oRoot.summary,
			oArrEntry = oRoot.items || [],
			oArrEntryIds = to._getRecurringEventsArray(oArrEntry);

			oArrJson = [];
			for(var iTempIndex1 = 0; iTempIndex1 < oArrEntryIds.length; iTempIndex1++)
			{
				var iTempIdRecord = oArrEntryIds[iTempIndex1],
				iTempId = iTempIdRecord[0],
				iTempCount = iTempIdRecord[1],
				iTempCounter = 1;

				for(var iTempIndex2 = 0; iTempIndex2 < oArrEntry.length; iTempIndex2++)
				{
					var oEntry = oArrEntry[iTempIndex2],
					sId = oEntry.iCalUID;

					if(iTempId === sId)
					{
						sId = sId.replace("@google.com", "");

						var bIsAllDay = (oEntry.start.date) ? true : false,
						sStartDate = bIsAllDay ? oEntry.start.date : oEntry.start.dateTime,
						sEndDate = bIsAllDay ? oEntry.end.date : oEntry.end.dateTime,

						sTitle = oEntry.summary || to.setting.miscStrings.emptyGoogleCalendarEventTitle,
						sUrl = oEntry.htmlLink || "";

						oEvent = new CalEvent(sId, bIsAllDay, sStartDate, sEndDate, sType, sTitle, "", sUrl);
						oArrJson.push(oEvent);

						iTempCounter++;
						if(iTempCounter > iTempCount)
							break;
					}
				}
			}
		}

		for(iJsonIndex = 0; iJsonIndex < oArrJson.length; iJsonIndex++)
		{
			oJsonRecord = oArrJson[iJsonIndex];
			if(oJsonRecord.start !== null)
			{
				iJsonObjCount++;

				if(oJsonRecord.start !== null)
					oJsonRecord.start = to._getDateObjectFromString(oJsonRecord.start, oJsonRecord.isAllDay, sInputDateTimeFormat, sFormatSeparatorDateTime, sFormatSeparatorDate, sFormatSeparatorTime, sTZOffset);
				if(oJsonRecord.end !== null)
				{
					oJsonRecord.end = to._getDateObjectFromString(oJsonRecord.end, oJsonRecord.isAllDay, sInputDateTimeFormat, sFormatSeparatorDateTime, sFormatSeparatorDate, sFormatSeparatorTime, sTZOffset);
					oJsonRecord.endSpecified = true;
				}
				else
				{
					oJsonRecord.end = to._getUnspecifiedEndDateOfEvent(oJsonRecord.isAllDay, oJsonRecord.start);
					oJsonRecord.endSpecified = false;
				}

				bEventMatched = false;
				if($.cf.compareStrings(to.setting.datasetModificationRule, "ReplaceSpecified"))
				{
					for(var iEventIndex = 0; iEventIndex < to.tv.oAEvents.length; iEventIndex++)
					{
						oEvent = to.tv.oAEvents[iEventIndex];
						if(parseInt(oEvent.id) === parseInt(oJsonRecord.id))
						{
							oJsonRecord.calEventId = oEvent.calEventId;
							bEventMatched = true;
							break;
						}
					}
				}

				if(!bEventMatched)
					oJsonRecord.calEventId = ++to.tv.iMaxEvId;
			}
			else
				oJsonRecord.id = "DEL";

			if(oJsonRecord.title === "")
				oJsonRecord.title = to.setting.miscStrings.emptyEventTitle;
		}

		var iDiffCount = oArrJson.length - iJsonObjCount;
		if(iDiffCount !== 0)
		{
			var oArrTemp = [];
			for(iJsonIndex = 0; iJsonIndex < oArrJson.length; iJsonIndex++)
			{
				oJsonRecord = oArrJson[iJsonIndex];
				if(! $.cf.compareStrings(oJsonRecord.id, "DEL"))
					oArrTemp.push(oJsonRecord);
			}
			oArrJson = oArrTemp;
		}

		var sChangeColorBasedOn = oConfig.changeColorBasedOn || to.setting.changeColorBasedOn || "Event";
		var sTempColor;

		//-------------------- Set Color For Event Calendar Start ----------------------
		if($.cf.compareStrings(sChangeColorBasedOn, "EventCalendar"))
		{
			sColorArray = [];
			for(var iCalIndex = 0; iCalIndex < to.tv.oAECalendar.length; iCalIndex++)
			{
				var oThisCalendar = to.tv.oAECalendar[iCalIndex];

				oThisCalendar.fromSingleColor = false;
				if($.cf.isValid(oThisCalendar.singleColor))
				{
					sSingleColor = $.cf.addHashToHexcode(oThisCalendar.singleColor);
					oThisCalendar.fromSingleColor = true;
					oThisCalendar.backgroundColor = $.cf.getRGBAString(sSingleColor, fAlpha);
					oThisCalendar.borderColor = sSingleColor;
					oThisCalendar.textColor = sSingleColor;
					oThisCalendar.nonAllDayEventsTextColor = sSingleColor;

					sColorArray.push(sSingleColor);
				}
				else if($.cf.isValid(oThisCalendar.backgroundColor))
					sColorArray.push(oThisCalendar.backgroundColor);
				else
				{
					sTempColor = to._generateUniqueColor(sColorArray);
					sColorArray.push(sTempColor);
					oThisCalendar.backgroundColor = $.cf.addHashToHexcode(sTempColor);
				}

				sIcon = $.cf.isValid(oThisCalendar.icon) ? oThisCalendar.icon : to.setting.eventIcon;
			}
		}
		//-------------------- Set Color For Event Calendar End -----------------------

		//-------------------- Set Color For Event Source Start ----------------------
		if($.cf.compareStrings(sChangeColorBasedOn, "EventSource"))
		{
			sColor = sColor || to._generateUniqueColor(sColorArray);
			sColorArray.push(sColor);
		}
		//-------------------- Set Color For Event Source End ----------------------

		// --------------------------- Set Event Properties Start -----------------------------

		for(iJsonIndex = 0; iJsonIndex < oArrJson.length; iJsonIndex++)
		{
			oJsonRecord = oArrJson[iJsonIndex];
			var oEventCalendar = to._getEventCalendarObject(oJsonRecord.calendar);

			// -------------------------- Assign Color To Event Start ----------------------------

			if($.cf.compareStrings(sChangeColorBasedOn, "Event") || ($.cf.compareStrings(sChangeColorBasedOn, "EventCalendar") && !$.cf.isValid(oEventCalendar)))
			{
				if($.cf.isValid(oJsonRecord.singleColor))
				{
					sSingleColor = $.cf.addHashToHexcode(oJsonRecord.singleColor);
					oJsonRecord.fromSingleColor = true;
					oJsonRecord.backgroundColor = $.cf.getRGBAString(sSingleColor, fAlpha);
					oJsonRecord.borderColor = sSingleColor;
					oJsonRecord.textColor = sSingleColor;
					oJsonRecord.nonAllDayEventsTextColor = sSingleColor;

					sColorArray.push(sSingleColor);
				}
				else if($.cf.isValid(oJsonRecord.backgroundColor))
				{
					oJsonRecord.backgroundColor = $.cf.addHashToHexcode(oJsonRecord.backgroundColor);
					oJsonRecord.borderColor = $.cf.addHashToHexcode(oJsonRecord.borderColor);
					oJsonRecord.textColor = $.cf.addHashToHexcode(oJsonRecord.textColor);
					oJsonRecord.nonAllDayEventsTextColor = $.cf.addHashToHexcode(oJsonRecord.nonAllDayEventsTextColor);

					sColorArray.push(oJsonRecord.backgroundColor);
				}
				else
				{
					sTempColor = to._generateUniqueColor(sColorArray);
					sColorArray.push(sTempColor);
					oJsonRecord.backgroundColor = $.cf.addHashToHexcode(sTempColor);
				}

				if($.cf.isValid(oJsonRecord.isMarked) && oJsonRecord.isMarked)
					sIcon = $.cf.isValid(oJsonRecord.icon) ? oJsonRecord.icon : "cs-icon-Mark";
				else
					sIcon = $.cf.isValid(oJsonRecord.icon) ? oJsonRecord.icon : to.setting.eventIcon;
			}
			else if($.cf.compareStrings(sChangeColorBasedOn, "EventCalendar") && $.cf.isValid(oEventCalendar))
			{
				oJsonRecord.fromSingleColor = oEventCalendar.fromSingleColor;
				oJsonRecord.backgroundColor = $.cf.addHashToHexcode(oEventCalendar.backgroundColor);
				oJsonRecord.borderColor = $.cf.addHashToHexcode(oEventCalendar.borderColor);
				oJsonRecord.textColor = $.cf.addHashToHexcode(oEventCalendar.textColor);
				oJsonRecord.nonAllDayEventsTextColor = $.cf.addHashToHexcode(oEventCalendar.nonAllDayEventsTextColor);
				oJsonRecord.icon = oEventCalendar.icon;
			}
			else if($.cf.compareStrings(sChangeColorBasedOn, "EventSource"))
			{
				oJsonRecord.fromSingleColor = bFromSingleColor;
				oJsonRecord.backgroundColor = sColor;
				oJsonRecord.borderColor = sBorderColor;
				oJsonRecord.textColor = sTextColor;
				oJsonRecord.nonAllDayEventsTextColor = sNonAllDayEventsTextColor;
				oJsonRecord.icon = sIcon;
			}

			// --------------------------- Assign Color To Event End -----------------------------

			// --------------------------- Set Movement Properties Start ----------------------------

			oJsonRecord.isDragNDropInMonthView = ($.cf.isValid(oJsonRecord.isMarked) && oJsonRecord.isMarked) ? false :
			$.cf.isValid(oJsonRecord.isDragNDropInMonthView) ? oJsonRecord.isDragNDropInMonthView :
			$.cf.isValid(oConfig.isDragNDropInMonthView) ? oConfig.isDragNDropInMonthView :
			oEventCalendar && $.cf.isValid(oEventCalendar.isDragNDropInMonthView) ? oEventCalendar.isDragNDropInMonthView :
			to.setting.isDragNDropInMonthView;

			oJsonRecord.isDragNDropInQuickAgendaView = ($.cf.isValid(oJsonRecord.isMarked) && oJsonRecord.isMarked) ? false :
			$.cf.isValid(oJsonRecord.isDragNDropInQuickAgendaView) ? oJsonRecord.isDragNDropInQuickAgendaView :
			$.cf.isValid(oConfig.isDragNDropInQuickAgendaView) ? oConfig.isDragNDropInQuickAgendaView :
			oEventCalendar && $.cf.isValid(oEventCalendar.isDragNDropInQuickAgendaView) ? oEventCalendar.isDragNDropInQuickAgendaView :
			to.setting.isDragNDropInQuickAgendaView;

			oJsonRecord.isDragNDropInTaskPlannerView = ($.cf.isValid(oJsonRecord.isMarked) && oJsonRecord.isMarked) ? false :
			$.cf.isValid(oJsonRecord.isDragNDropInTaskPlannerView) ? oJsonRecord.isDragNDropInTaskPlannerView :
			$.cf.isValid(oConfig.isDragNDropInTaskPlannerView) ? oConfig.isDragNDropInTaskPlannerView :
			oEventCalendar && $.cf.isValid(oEventCalendar.isDragNDropInTaskPlannerView) ? oEventCalendar.isDragNDropInTaskPlannerView :
			to.setting.isDragNDropInTaskPlannerView;

			oJsonRecord.isDragNDropInDetailView = ($.cf.isValid(oJsonRecord.isMarked) && oJsonRecord.isMarked) ? false :
			$.cf.isValid(oJsonRecord.isDragNDropInDetailView) ? oJsonRecord.isDragNDropInDetailView :
			$.cf.isValid(oConfig.isDragNDropInDetailView) ? oConfig.isDragNDropInDetailView :
			oEventCalendar && $.cf.isValid(oEventCalendar.isDragNDropInDetailView) ? oEventCalendar.isDragNDropInDetailView :
			to.setting.isDragNDropInDetailView;

			oJsonRecord.isResizeInDetailView = ($.cf.isValid(oJsonRecord.isMarked) && oJsonRecord.isMarked) ? false :
			$.cf.isValid(oJsonRecord.isResizeInDetailView) ? oJsonRecord.isResizeInDetailView :
			$.cf.isValid(oConfig.isResizeInDetailView) ? oConfig.isResizeInDetailView :
			oEventCalendar && $.cf.isValid(oEventCalendar.isResizeInDetailView) ? oEventCalendar.isResizeInDetailView :
			to.setting.isResizeInDetailView;

			// --------------------------- Set Movement Properties End -----------------------------
		}

		// ------------------------------- Set Event Properties End ---------------------------

		if(isConcat)
			to.tv.oAEvents = to.tv.oAEvents.concat(oArrJson);
		else
		{
			if($.cf.compareStrings(to.setting.datasetModificationRule, "Default"))
				to.tv.oAEvents = to.tv.oAEvents.concat(oArrJson);
			else if($.cf.compareStrings(to.setting.datasetModificationRule, "ReplaceAll"))
				to.tv.oAEvents = oArrJson;
			else if($.cf.compareStrings(to.setting.datasetModificationRule, "ReplaceSpecified"))
			{
				for(var iEventIndex1 = 0; iEventIndex1 < oArrJson.length; iEventIndex1++)
				{
					var oEvent1 = oArrJson[iEventIndex1];
					bEventMatched = false;
					for(var iEventIndex2 = 0; iEventIndex2 < to.tv.oAEvents.length; iEventIndex2++)
					{
						var oEvent2 = to.tv.oAEvents[iEventIndex2];
						if(parseInt(oEvent2.id) === parseInt(oEvent1.id))
						{
							oEvent2 = oEvent1;
							bEventMatched = true;
							break;
						}
					}

					if(!bEventMatched)
						to.tv.oAEvents.push(oEvent1);
				}
			}
		}

		to.tv.oAEvents = to._sortEvents(to.tv.oAEvents);
	},

	_getModifiedSourceCountArray: function(oArrJson, oConfig)
	{
		var to = this;
		var sInputDateTimeFormat = oConfig.inputDateTimeFormat || "",
		sFormatSeparatorDateTime = oConfig.formatSeparatorDateTime || "",
		sFormatSeparatorDate = oConfig.formatSeparatorDate || "",
		sFormatSeparatorTime = oConfig.formatSeparatorTime || "",
	 	sTZOffset = oConfig.inputTZOffset || to.setting.inputTZOffset;

		var oArrTemp = [];
		for(var iJsonIndex = 0; iJsonIndex < oArrJson.length; iJsonIndex++)
		{
			var oJsonRecord = oArrJson[iJsonIndex];
			if($.cf.isValid(oJsonRecord.date))
			{
				oJsonRecord.date = to._getDateObjectFromString(oJsonRecord.date, true, sInputDateTimeFormat, sFormatSeparatorDateTime, sFormatSeparatorDate, sFormatSeparatorTime, sTZOffset);
				if($.cf.isValid(oJsonRecord.date))
					oArrTemp.push(oJsonRecord);
			}
		}

		if($.cf.compareStrings(to.setting.datasetModificationRule, "Default"))
			to.tv.oASrcCnt = to.tv.oASrcCnt.concat(oArrTemp);
		else if($.cf.compareStrings(to.setting.datasetModificationRule, "ReplaceAll"))
			to.tv.oASrcCnt = oArrTemp;
		else if($.cf.compareStrings(to.setting.datasetModificationRule, "ReplaceSpecified"))
		{
			for(var iTempIndex1 = 0; iTempIndex1 < oArrTemp.length; iTempIndex1++)
			{
				var bMatchedRecord = false,
				oRecord1 = oArrTemp[iTempIndex1];
				for(var iTempIndex2 = 0; iTempIndex2 < to.tv.oASrcCnt.length; iTempIndex2++)
				{
					var oRecord2 = to.tv.oASrcCnt[iTempIndex2];
					if(to.compareDateTimes(oRecord1.date, oRecord2.date) === 0)
					{
						oRecord2 = oRecord1;
						bMatchedRecord = true;
					}
				}
				if(!bMatchedRecord)
					to.tv.oASrcCnt.append(oRecord1);
			}
		}

		return oArrTemp;
	},

	_getModifiedRestrictedSectionArray: function(oArrJson, oConfig)
	{
		var to = this;
		var sInputDateTimeFormat = oConfig.inputDateTimeFormat || "",
		sFormatSeparatorDateTime = oConfig.formatSeparatorDateTime || "",
		sFormatSeparatorDate = oConfig.formatSeparatorDate || "",
		sFormatSeparatorTime = oConfig.formatSeparatorTime || "",
	 	sTZOffset = oConfig.inputTZOffset || to.setting.inputTZOffset;

		for(var iJsonIndex = 0; iJsonIndex < oArrJson.length; iJsonIndex++)
		{
			var oJsonRecord = oArrJson[iJsonIndex];

			if(oJsonRecord.start !== null)
			{
				if(oJsonRecord.start !== null)
					oJsonRecord.start = to._getDateObjectFromString(oJsonRecord.start, oJsonRecord.isAllDay, sInputDateTimeFormat, sFormatSeparatorDateTime, sFormatSeparatorDate, sFormatSeparatorTime, sTZOffset);
				if(oJsonRecord.end !== null)
					oJsonRecord.end = to._getDateObjectFromString(oJsonRecord.end, oJsonRecord.isAllDay, sInputDateTimeFormat, sFormatSeparatorDateTime, sFormatSeparatorDate, sFormatSeparatorTime, sTZOffset);
				if(oJsonRecord.isAllDay)
				{
					oJsonRecord.start = to.setDateInFormat({"date": oJsonRecord.start}, "START");
					oJsonRecord.end = to.setDateInFormat({"date": oJsonRecord.end}, "END");
					oJsonRecord.end = to._normalizeEndDateTime(oJsonRecord.end);
				}
			}
		}

		if($.cf.compareStrings(to.setting.datasetModificationRule, "Default"))
			to.tv.oAResSec = to.tv.oAResSec.concat(oArrJson);
		else if($.cf.compareStrings(to.setting.datasetModificationRule, "ReplaceAll"))
			to.tv.oAResSec = oArrJson;

		to._checkAllowDroppable();
	},

	_getModifiedSlotAvailabilityArray: function(oArrJson, oConfig)
	{
		var to = this;
		var sInputDateTimeFormat = oConfig.inputDateTimeFormat || "",
		sFormatSeparatorDateTime = oConfig.formatSeparatorDateTime || "",
		sFormatSeparatorDate = oConfig.formatSeparatorDate || "",
		sFormatSeparatorTime = oConfig.formatSeparatorTime || "",
	 	sTZOffset = oConfig.inputTZOffset || to.setting.inputTZOffset;

		var oArrTemp = [];
		for(var iJsonIndex = 0; iJsonIndex < oArrJson.length; iJsonIndex++)
		{
			var oJsonRecord = oArrJson[iJsonIndex];
			if(oJsonRecord.start !== null && oJsonRecord.end !== null)
			{
				if(oJsonRecord.start !== null)
					oJsonRecord.start = to._getDateObjectFromString(oJsonRecord.start, oJsonRecord.isAllDay, sInputDateTimeFormat, sFormatSeparatorDateTime, sFormatSeparatorDate, sFormatSeparatorTime, sTZOffset);
				if(oJsonRecord.end !== null)
					oJsonRecord.end = to._getDateObjectFromString(oJsonRecord.end, oJsonRecord.isAllDay, sInputDateTimeFormat, sFormatSeparatorDateTime, sFormatSeparatorDate, sFormatSeparatorTime, sTZOffset);
				if(oJsonRecord.start !== "" && oJsonRecord.end !== "")
				{
					if(oJsonRecord.isAllDay)
					{
						oJsonRecord.start = to.setDateInFormat({"date": oJsonRecord.start}, "START");
						oJsonRecord.end = to.setDateInFormat({"date": oJsonRecord.end}, "END");
					}
					oJsonRecord.end = to._normalizeEndDateTime(oJsonRecord.end);
					oArrTemp.push(oJsonRecord);
				}
			}
		}

		if($.cf.compareStrings(to.setting.datasetModificationRule, "Default"))
			to.tv.oASltAvail = to.tv.oASltAvail.concat(oArrTemp);
		else if($.cf.compareStrings(to.setting.datasetModificationRule, "ReplaceAll"))
			to.tv.oASltAvail = oArrTemp;
		else if($.cf.compareStrings(to.setting.datasetModificationRule, "ReplaceSpecified"))
		{
			for(var iTempIndex1 = 0; iTempIndex1 < oArrTemp.length; iTempIndex1++)
			{
				var bMatchedRecord = false,
				oRecord1 = oArrTemp[iTempIndex1];
				for(var iTempIndex2 = 0; iTempIndex2 < to.tv.oASltAvail.length; iTempIndex2++)
				{
					var oRecord2 = to.tv.oASltAvail[iTempIndex2];
					if(to.compareDateTimes(oRecord1.start, oRecord2.start) === 0 && to.compareDateTimes(oRecord1.end, oRecord2.end) === 0 && $.cf.compareStrings(oRecord1.status, oRecord2.status))
					{
						oRecord2 = oRecord1;
						bMatchedRecord = true;
					}
				}

				if(!bMatchedRecord)
					to.tv.oASltAvail.append(oRecord1);
			}
		}
	},

	_dataCleaning: function(dDurationStartDate, dDurationEndDate)
	{
		var to = this;
		if($.cf.compareStrings(to.tv.sLoadType, "Load"))
		{
			if(to.tv.oAEvents.length > 0)
				to.tv.oAEvents = to._sortEvents(to.tv.oAEvents);
		}
		else if($.cf.compareStrings(to.tv.sLoadType, "Prev") || $.cf.compareStrings(to.tv.sLoadType, "Next"))
		{
			if(to.tv.oAEvents.length > 0)
			{
				if(dDurationStartDate !== null && dDurationEndDate !== null)
					to._deleteEventsOutOfDuration(dDurationStartDate, dDurationEndDate);
				to.tv.oAEvents = to._sortEvents(to.tv.oAEvents);
			}

			if(to.tv.oASrcCnt.length > 0 && dDurationStartDate !== null && dDurationEndDate !== null)
				to._deleteSourceCountOutOfDuration(dDurationStartDate, dDurationEndDate);

			if(to.tv.oAResSec.length > 0 && dDurationStartDate !== null && dDurationEndDate !== null)
				to._deleteRestrictedSectionsOutOfDuration(dDurationStartDate, dDurationEndDate);

			if(to.tv.oASltAvail.length > 0 && dDurationStartDate !== null && dDurationEndDate !== null)
				to._deleteSlotAvailabilityOutOfDuration(dDurationStartDate, dDurationEndDate);
		}
	},

	_deleteEventsOutOfDuration: function(dTempStartDate, dTempEndDate)
	{
		var to = this;
		var iTempIndex, oThisEvent;
		for(iTempIndex = 0; iTempIndex < to.tv.oAEvents.length; iTempIndex++)
		{
			oThisEvent = to.tv.oAEvents[iTempIndex];
			if($.cf.compareStrings(to.tv.sLoadType, "Prev"))
			{
				if(to.compareDateTimes(oThisEvent.start, dTempEndDate) > 0)
					oThisEvent.id = "DEL";
			}
			else if($.cf.compareStrings(to.tv.sLoadType, "Next"))
			{
				if(to.compareDateTimes(oThisEvent.end, dTempStartDate) < 0)
					oThisEvent.id = "DEL";
			}
		}

		var oArrTemp = [];
		for(iTempIndex = 0; iTempIndex < to.tv.oAEvents.length; iTempIndex++)
		{
			oThisEvent = to.tv.oAEvents[iTempIndex];
			if(! $.cf.compareStrings(oThisEvent.id, "DEL"))
				oArrTemp.push(oThisEvent);
		}

		to.tv.oAEvents = oArrTemp;
	},

	_deleteSourceCountOutOfDuration: function(dDurationStartDate, dDurationEndDate)
	{
		var to = this;
		var iTempIndex, oTemp;
		for(iTempIndex = 0; iTempIndex < to.tv.oASrcCnt.length; iTempIndex++)
		{
			oTemp = to.tv.oASrcCnt[iTempIndex];
			var dTempDate = new Date(oTemp.date);
			if($.cf.compareStrings(to.tv.sLoadType, "Prev"))
			{
				if(to.compareDates(dTempDate, dDurationEndDate) > 0)
					oTemp.date = "DEL";
			}
			else if($.cf.compareStrings(to.tv.sLoadType, "Next"))
			{
				if(to.compareDates(dTempDate, dDurationStartDate) < 0)
					oTemp.date = "DEL";
			}
		}

		var oArrTemp = [];
		for(iTempIndex = 0; iTempIndex < to.tv.oASrcCnt.length; iTempIndex++)
		{
			oTemp = to.tv.oASrcCnt[iTempIndex];
			if(! $.cf.compareStrings(oTemp.date, "DEL"))
				oArrTemp.push(oTemp);
		}

		to.tv.oASrcCnt = oArrTemp;
	},

	_deleteRestrictedSectionsOutOfDuration: function(dDurationStartDate, dDurationEndDate)
	{
		var to = this;
		var iTempIndex,oTemp;
		for(iTempIndex = 0; iTempIndex < to.tv.oAResSec.length; iTempIndex++)
		{
			oTemp = to.tv.oAResSec[iTempIndex];
			if($.cf.compareStrings(to.tv.sLoadType, "Prev"))
			{
				if(to.compareDateTimes(oTemp.start, dDurationEndDate) > 0)
					oTemp.start = "DEL";
			}
			else if($.cf.compareStrings(to.tv.sLoadType, "Next"))
			{
				if(to.compareDateTimes(oTemp.end, dDurationStartDate) < 0)
					oTemp.start = "DEL";
			}
		}

		var oArrTemp = [];
		for(iTempIndex = 0; iTempIndex < to.tv.oAResSec.length; iTempIndex++)
		{
			oTemp = to.tv.oAResSec[iTempIndex];
			if(! $.cf.compareStrings(oTemp.start, "DEL"))
				oArrTemp.push(oTemp);
		}

		to.tv.oAResSec = oArrTemp;
	},

	_deleteSlotAvailabilityOutOfDuration: function(dDurationStartDate, dDurationEndDate)
	{
		var to = this;
		var iTempIndex, oTemp;
		for(iTempIndex = 0; iTempIndex < to.tv.oASltAvail.length; iTempIndex++)
		{
			oTemp = to.tv.oASltAvail[iTempIndex];
			var dTempStartDate = new Date(oTemp.start),
			dTempEndDate = new Date(oTemp.end);

			if($.cf.compareStrings(to.tv.sLoadType, "Prev"))
			{
				if(to.compareDateTimes(dTempStartDate, dDurationEndDate) > 0)
					oTemp.start = "DEL";
			}
			else if($.cf.compareStrings(to.tv.sLoadType, "Next"))
			{
				var iCompStartDate = to.compareDateTimes(dTempStartDate, dDurationStartDate),
				iCompEndDate = to.compareDateTimes(dTempEndDate, dDurationEndDate);
				if(iCompStartDate < 0 && iCompEndDate < 0)
					oTemp.start = "DEL";
			}
		}

		var oArrTemp = [];
		for(iTempIndex = 0; iTempIndex < to.tv.oASltAvail.length; iTempIndex++)
		{
			oTemp = to.tv.oASltAvail[iTempIndex];
			if(! $.cf.compareStrings(oTemp.start, "DEL"))
				oArrTemp.push(oTemp);
		}

		to.tv.oASltAvail = oArrTemp;
	},

	//----------------------------------------------------------------------------------------

	// Public Method
	addEventsForSource: function(oArrNewEvents, iSourceId)
	{
		var to = this;
		oArrNewEvents = to.__parseJson(oArrNewEvents);
		for(var iSourceIndex = 0; iSourceIndex < to.setting.calDataSource.length; iSourceIndex++)
		{
			var oTempSource = to.setting.calDataSource[iSourceIndex];
			if(oTempSource.sourceId === iSourceId)
			{
				if(oArrNewEvents.length > 0)
					to._getModifiedEventsArray(oArrNewEvents, (oTempSource.config || {}), (typeof oTempSource.source === "string") ? to._isGoogleCalendarUrl(oTempSource.source) : false, true);
				break;
			}
		}
	},

	_replaceEventWithId: function(sExistingEventId, oNewEvent)
	{
		var to = this;
		for(var iTempIndex = 0; iTempIndex < to.tv.oAEvents.length; iTempIndex++)
		{
			var oEv = to.tv.oAEvents[iTempIndex];
			if(parseInt(sExistingEventId) === parseInt(oEv.id))
			{
				oEv = oNewEvent;
				break;
			}
		}
	},

	_replaceEventsWithRule: function(oReplaceRule, oArrNewEvents)
	{
		var to = this;
		to._removeEventsWithRule(oReplaceRule);
		to.tv.oAEvents = to.tv.oAEvents.concat(oArrNewEvents);
	},

	// Public Method
	replaceEvents: function(oArrNewEvents)
	{
		var to = this;
		for(var iTempIndex = 0; iTempIndex < oArrNewEvents.length; iTempIndex++)
		{
			var oNewEventRecord = oArrNewEvents[iTempIndex],
			sExistingEventId = oNewEventRecord.replaceId,
			oReplaceRule = oNewEventRecord.replaceRule;

			if($.cf.isValid(sExistingEventId))
				to._replaceEventWithId(sExistingEventId, oNewEventRecord.event);
			else if($.cf.isValid(oReplaceRule))
				to._replaceEventsWithRule(oReplaceRule, oNewEventRecord.events);
		}
	},

	// Public Method
	revertToOriginalEvent: function(oDraggedEvent, startDateBeforeChange, endDateBeforeChange)
	{
		var to = this;
		if(to.__updateEventWithId(oDraggedEvent.calEventId, startDateBeforeChange, endDateBeforeChange))
			to.__reloadCurrentView(true, false);
	},

	_removeEventsWithIds: function(sArrRemoveIds)
	{
		var to = this;
		var oArrEventsTemp = [];
		for(var iTempIndex1 = 0; iTempIndex1 < sArrRemoveIds.length; iTempIndex1++)
		{
			for(var iTempIndex2 = 0; iTempIndex2 < to.tv.oAEvents.length; iTempIndex2++)
			{
				var oTempEvent = to.tv.oAEvents[iTempIndex2];
				if(parseInt(oTempEvent.id) !== parseInt(sArrRemoveIds[iTempIndex1]))
					oArrEventsTemp.push(oTempEvent.id);
			}
		}
		to.tv.oAEvents = oArrEventsTemp;
	},

	_removeEventsWithRule: function(oRemoveRule)
	{
		var to = this;
		var oArrEventsTemp = [];
		for(var iTempIndex = 0; iTempIndex < to.tv.oAEvents.length; iTempIndex++)
		{
			var oEv = to.tv.oAEvents[iTempIndex];
			if(!oRemoveRule(oEv)) // RemoveRule Function call
				oArrEventsTemp.push(oEv);
		}
		to.tv.oAEvents = oArrEventsTemp;
	},

	// Public Method
	removeEvents: function(oArrRemove)
	{
		var to = this;
		for(var iTempIndex = 0; iTempIndex < oArrRemove.length; iTempIndex++)
		{
			var oRemove = oArrRemove[iTempIndex],
			sArrRemoveIds = oRemove.removeIds,
			sRemoveRule = oRemove.removeRule;
			if($.cf.isValid(sArrRemoveIds))
				to._removeEventsWithIds(sArrRemoveIds);
			if($.cf.isValid(sRemoveRule))
				to._removeEventsWithRule(sRemoveRule);
		}
	},

	//-------------------------------------------------------------------------------------------

	_getEventCalendarObject: function(sEventCalendar)
	{
		var to = this;
		for(var iCalIndex = 0; iCalIndex < to.tv.oAECalendar.length; iCalIndex++)
		{
			var oThisCalendar = to.tv.oAECalendar[iCalIndex];
			if($.cf.compareStrings(sEventCalendar, oThisCalendar.calendar))
				return oThisCalendar;
		}
		return null;
	},

	// Public Method
	getEventWithId: function(sId)
	{
		var to = this;
		for(var iEventIndex = 0; iEventIndex < to.tv.oAEvents.length; iEventIndex++)
		{
			var oEventRecord = to.tv.oAEvents[iEventIndex];
			if(oEventRecord.calEventId === parseInt(sId))
				return oEventRecord;
		}
		return {};
	},

	__updateEventWithId: function(sId, dNewStartDate, dNewEndDate)
	{
		var to = this;
		var bSuccess = false;
		for(var iEventIndex = 0; iEventIndex < to.tv.oAEvents.length; iEventIndex++)
		{
			var oEvent = to.tv.oAEvents[iEventIndex];
			if(oEvent.calEventId === parseInt(sId))
			{
				oEvent.start = dNewStartDate;
				if(dNewEndDate !== null)
					oEvent.end = dNewEndDate;
				else
					oEvent.end = new Date(dNewStartDate.getTime() + ($.CalenStyle.extra.iMS.m * 30));
				to.tv.oAEvents[iEventIndex] = oEvent;
				bSuccess = true;
				break;
			}
		}
		to.tv.oAEvents = to._sortEvents(to.tv.oAEvents);
		return bSuccess;
	},

	_normalizeEndDateTime: function(sDate)
	{
		var to = this;
		if(sDate.getHours() === 0 && sDate.getMinutes() === 0 && sDate.getSeconds() === 0)
			sDate = new Date(sDate.getTime() - $.CalenStyle.extra.iMS.m);
		return sDate;
	},

	_getUnspecifiedEndDateOfEvent: function(bIsAllDay, dTempStartDate)
	{
		var to = this;
		if(bIsAllDay)
			return new Date(dTempStartDate.getFullYear(), dTempStartDate.getMonths(), (dTempStartDate.getDate() + (to.setting.allDayEventDuration - 1)), 0, 0, 0, 0);
		else
			return new Date(dTempStartDate.getTime() + (to.setting.eventDuration * $.CalenStyle.extra.iMS.m));
	},

	_getStartAndEndDatesOfEvent: function(bIsAllDay, dStartDateTime, dEndDateTime)
	{
		var to = this;
		var dTempStartDate, dTempEndDate;
		if(bIsAllDay)
		{
			dTempStartDate = to.setDateInFormat({"date": dStartDateTime}, "START");
			if(dEndDateTime !== null)
				dTempEndDate = to.setDateInFormat({"date": dEndDateTime}, "START");
			else
				dTempEndDate = to._getUnspecifiedEndDateOfEvent(bIsAllDay, dTempStartDate);
		}
		else
		{
			dTempStartDate = new Date(dStartDateTime);
			if(dEndDateTime !== null)
				dTempEndDate = new Date(dEndDateTime);
			else
				dTempEndDate = to._getUnspecifiedEndDateOfEvent(bIsAllDay, dTempStartDate);
		}
		return [dTempStartDate, dTempEndDate];
	},

	__getStartAndEndDatesOfEventForView: function(bIsAllDay, dStartDateTime, dEndDateTime)
	{
		var to = this;
		var dArrTemp = to._getStartAndEndDatesOfEvent(bIsAllDay, dStartDateTime, dEndDateTime),
		dNewStartDateTime = new Date(dArrTemp[0]),
		dNewEndDateTime = new Date(dArrTemp[1]),

		iCompStartDates = to.compareDates(dNewStartDateTime, to.tv.dVDSDt),
		iCompEndDates = to.compareDates(dNewEndDateTime, to.tv.dVDEDt),

		dTempStartDate = new Date(dNewStartDateTime),
		dTempEndDate = new Date(dNewEndDateTime);

		if(iCompStartDates < 0)
			dTempStartDate = to.tv.dVDSDt;
		if(iCompEndDates > 0)
			dTempEndDate = to.tv.dVDEDt;

		return [dTempStartDate, dTempEndDate];
	},

	// Public Method
	getDurationOfEventInHHmmFormat: function(dStartDateTime, dEndDateTime)
	{
		var to = this;
		var iTotalMinutes = Math.ceil((dEndDateTime.getTime() - dStartDateTime.getTime()) / $.CalenStyle.extra.iMS.m);
		return [Math.floor(iTotalMinutes / 60), (iTotalMinutes % 60)];
	},

	__getNumberOfHoursOfEvent: function(bIsAllDay, dStartDateTime, dEndDateTime)
	{
		var to = this;
		var dArrTempDates = to._getStartAndEndDatesOfEvent(bIsAllDay, dStartDateTime, dEndDateTime),
		dTempStartDate = dArrTempDates[0],
		dTempEndDate = dArrTempDates[1],
		iDiffStartAndEnd = dTempEndDate.getTime() - dTempStartDate.getTime(),
		iNumOfHours = Math.round(iDiffStartAndEnd / $.CalenStyle.extra.iMS.h);
		if(iNumOfHours <= 0 && iDiffStartAndEnd > 0)
			iNumOfHours = 1;
		return iNumOfHours;
	},

	__getDateIndexInView: function(dTempDate)
	{
		var to = this;

		for(var iDateIndex = 0; iDateIndex < to.tv.iNoVDay; iDateIndex++)
		{
			var dThisDate = to.tv.dAVDt[iDateIndex];
			if(to.compareDates(dThisDate, dTempDate) === 0)
			{
				return iDateIndex;
			}
		}
		return -1;
	},

	// Public Method
	getNumberOfDaysOfEvent: function(bIsAllDay, dStartDateTime, dEndDateTime, bWithHours, bForView, bActualStartDate)
	{
		var to = this;
		var dTempEndDateTime;
		if(bIsAllDay && to.compareDateTimes(dStartDateTime, dEndDateTime) === 0 && bActualStartDate)
			dTempEndDateTime = new Date(dEndDateTime.getTime() + $.CalenStyle.extra.iMS.d);
		else
			dTempEndDateTime = new Date(dEndDateTime);
		if(dTempEndDateTime.getHours() === 0 && dTempEndDateTime.getMinutes() === 0)
			dTempEndDateTime.setMinutes(dTempEndDateTime.getMinutes() - 1);

		var iNumOfDays = 0,
		iNumOfHours = to.__getNumberOfHoursOfEvent(bIsAllDay, dStartDateTime, dTempEndDateTime),
		dArrTempDates = to._getStartAndEndDatesOfEvent(bIsAllDay, dStartDateTime, dTempEndDateTime),
		dTempStartDate = dArrTempDates[0],
		dTempEndDate = dArrTempDates[1],
		bCompTempStartEnd = to.compareDates(dTempStartDate, dTempEndDate);

		if(iNumOfHours <= 0)
		{
			if(bIsAllDay && bCompTempStartEnd <= 0)
			{
				iNumOfHours = 24;
				iNumOfDays = 1;
			}
			else
				console.log("Invalid Start And End Dates " + dStartDateTime + " " + dTempEndDateTime);
		}
		else
		{
			if(bCompTempStartEnd < 0)
			{
				var dNewStartDate = to.setDateInFormat({"date": dTempStartDate}, "START"),
				dNewEndDate = to.setDateInFormat({"date": dTempEndDate}, "START"),
				iNewNumOfHours = (dNewEndDate.getTime() - dNewStartDate.getTime()) / $.CalenStyle.extra.iMS.h;
				iNumOfDays = Math.round(iNewNumOfHours / 24) + 1;

				if(bForView)
				{
					var dTempDate = new Date(dNewStartDate), iTempNumOfDays = 0;
					for(var iTempIndex = 0; iTempIndex < iNumOfDays; iTempIndex++)
					{
						if(to.__findWhetherDateIsVisibleInCurrentView(dTempDate, (bIsAllDay || iNumOfHours > 23), dTempStartDate, dTempEndDate))
							iTempNumOfDays++;
						dTempDate.setDate(dTempDate.getDate() + 1);
					}
					iNumOfDays = iTempNumOfDays;
				}
			}
			else if(bCompTempStartEnd === 0)
			{
				if(bForView)
				{
					if(to.__findWhetherDateIsVisibleInCurrentView(dTempStartDate, (bIsAllDay || iNumOfHours > 23), dTempStartDate, dTempEndDate))
						iNumOfDays = 1;
				}
				else
					iNumOfDays = 1;
			}
		}

		if(bWithHours)
			return [iNumOfDays, iNumOfHours];
		else
			return iNumOfDays;
	},

	_sortEvents: function(oArrTempEvents)
	{
		var to = this;
		for(var iOuterIndex = 0; iOuterIndex < oArrTempEvents.length; iOuterIndex++)
		{
			var oOuterEvent = oArrTempEvents[iOuterIndex],
			dOuterStartDate = oOuterEvent.start,
			iOuterEventHours = to.__getNumberOfHoursOfEvent(oOuterEvent.isAllDay, oOuterEvent.start, oOuterEvent.end),
			bOuterIsAllDay = oOuterEvent.isAllDay || (iOuterEventHours > 23) || ($.cf.isValid(oOuterEvent.isMarked) && oOuterEvent.isMarked);

			for(var iInnerIndex = (iOuterIndex + 1); iInnerIndex < oArrTempEvents.length; iInnerIndex++)
			{
				var oInnerEvent = oArrTempEvents[iInnerIndex],
				dInnerStartDate = oInnerEvent.start,
				iInnerEventHours = to.__getNumberOfHoursOfEvent(oInnerEvent.isAllDay, oInnerEvent.start, oInnerEvent.end),
				bInnerIsAllDay = oInnerEvent.isAllDay || (iInnerEventHours > 23) || ($.cf.isValid(oInnerEvent.isMarked) && oInnerEvent.isMarked),

				iCompDates = to.compareDates(dOuterStartDate, dInnerStartDate),
				iCompTimes = to.compareDateTimes(dOuterStartDate, dInnerStartDate),

				bBase1 = (iCompDates === 0),
				bBase2 = (!bOuterIsAllDay && bInnerIsAllDay),
				bBase3 = (bOuterIsAllDay && bInnerIsAllDay),
				bBase4 = (!bOuterIsAllDay && !bInnerIsAllDay),

				bSort1 = iCompDates > 0,
				bSort2 = bBase1 && bBase2,
				bSort3 = bBase1 && (iCompTimes > 0) && (bBase3 || bBase4),
				bSort4 = bBase1 && (bBase2 || bBase3 || bBase4) && (iCompTimes === 0) && (iOuterEventHours < iInnerEventHours),

				oTempEvent;

				if(bSort1 || bSort2 || bSort3 || bSort4)
				{
					oTempEvent = oOuterEvent;
					oOuterEvent = oInnerEvent;
					oInnerEvent = oTempEvent;

					oArrTempEvents[iOuterIndex] = oOuterEvent;
					oArrTempEvents[iInnerIndex] = oInnerEvent;

					dOuterStartDate = oOuterEvent.start;
					iOuterEventHours = iInnerEventHours;
					bOuterIsAllDay = bInnerIsAllDay;
				}
			}
		}

		return oArrTempEvents;
	},

	_whetherEventIsBetweenDates: function(oTempEvent, dTempStartDate, dTempEndDate)
	{
		var to = this;
		var dEventStartDate = oTempEvent.start,
		dEventEndDate = oTempEvent.end,
		bIsAllDay = oTempEvent.isAllDay,

		iCompEndDate1 = to.compareDates(dEventEndDate, dTempStartDate),
		iCompStartDate2 = to.compareDates(dEventStartDate, dTempEndDate),

		bEventStartDate, bEventEndDate;

		if(iCompEndDate1 === 0 && (dEventEndDate.getHours() === 0 && dEventEndDate.getMinutes() === 0))
		{
			if(!bIsAllDay)
				iCompEndDate1 = -1;
			else
			{
				var bActualEventDuration = to.__getNumberOfHoursOfEvent(bIsAllDay, dEventStartDate, dEventEndDate) > 0,
				bCurrentEventDuration = to.__getNumberOfHoursOfEvent(bIsAllDay, dTempStartDate, dEventEndDate) > 0;

				if(bActualEventDuration && !bCurrentEventDuration)
					iCompEndDate1 = -1;
			}
		}

		bEventStartDate = (iCompStartDate2 <= 0) ? true : false;
		bEventEndDate = (iCompEndDate1 >= 0) ? true : false;

		if(bEventStartDate && bEventEndDate)
			return true;
		else
			return false;
	},

	// Public Method
	getArrayOfEventsForView: function(dTempViewStartDate, dTempViewEndDate)
	{
		var to = this;
		dTempViewStartDate = to.setDateInFormat({"date": dTempViewStartDate}, "START");
		dTempViewEndDate = to.setDateInFormat({"date": dTempViewEndDate}, "END");

		var oAEventsInRange = [],
		oArrTempEvents = [];

		for(var iEventIndex = 0; iEventIndex < to.tv.oAEvents.length; iEventIndex++)
		{
			var oTempEvent = to.tv.oAEvents[iEventIndex];
			if(to._whetherEventIsBetweenDates(oTempEvent, dTempViewStartDate, dTempViewEndDate))
			{
				oAEventsInRange.push(oTempEvent);
				if(to.setting.eventFilterCriteria.length > 0)
				{
					if(to.__whetherToDisplayAnEventOnCalendar(oTempEvent))
						oArrTempEvents.push(oTempEvent);
				}
				else
					oArrTempEvents.push(oTempEvent);
			}
		}

		if(to.setting.eventFilterCriteria.length > 0)
			to.__setEventCountBasedOnCriteria(oAEventsInRange);

		return oArrTempEvents;
	},

	__getSourceCountForDate: function(dTemp)
	{
		var to = this,
		iTempIndex, iTempIndex1,
		oSourceCount, iSourceCount = 0, oSource, sSourceCountType,
		oEvent, dStartDate, dEndDate, bCompStart, bCompEnd;
		if(to.tv.oASrcCnt.length > 0)
		{
			for(iTempIndex = 0; iTempIndex < to.tv.oASrcCnt.length; iTempIndex++)
			{
				oSourceCount = to.tv.oASrcCnt[iTempIndex];
				if(to.compareDates(oSourceCount.date, dTemp) === 0)
				{
					iSourceCount = oSourceCount.count;
					break;
				}
			}
		}
		else if(to.setting.parentObject !== null)
		{
			for(iTempIndex1 = 0; iTempIndex1 < to.setting.calDataSource.length; iTempIndex1++)
			{
				oSource = to.setting.calDataSource[iTempIndex1];
				sSourceCountType = oSource.config.sourceCountType;
				if($.cf.compareStrings(sSourceCountType, "Event"))
				{
					for(iTempIndex = 0; iTempIndex < to.setting.parentObject.tv.oAEvents.length; iTempIndex++)
					{
						oEvent = to.setting.parentObject.tv.oAEvents[iTempIndex];
						dStartDate = oEvent.start;
						dEndDate = oEvent.end;

						bCompStart = (to.compareDates(dTemp, dStartDate) >= 0);
						bCompEnd = (to.compareDates(dTemp, dEndDate) <= 0);

						if(bCompStart && bCompEnd)
							iSourceCount++;
					}
				}
				else if($.cf.compareStrings(sSourceCountType, "FreeTimeSlot") || $.cf.compareStrings(sSourceCountType, "BusyTimeSlot"))
				{
					for(iTempIndex = 0; iTempIndex < to.setting.parentObject.tv.oASltAvail.length; iTempIndex++)
					{
						oEvent = to.setting.parentObject.tv.oASltAvail[iTempIndex];
						dStartDate = oEvent.start;
						dEndDate = oEvent.end;

						bCompStart = (to.compareDates(dTemp, dStartDate) >= 0);
						bCompEnd = (to.compareDates(dTemp, dEndDate) <= 0);

						if(bCompStart && bCompEnd)
						{
							if(($.cf.compareStrings(sSourceCountType, "FreeTimeSlot") && $.cf.compareStrings(oEvent.status, "Free")) ||
							   ($.cf.compareStrings(sSourceCountType, "BusyTimeSlot") && $.cf.compareStrings(oEvent.status, "Busy")))
							   	iSourceCount++;
						}
					}
				}
			}
		}
		return iSourceCount;
	},

	// Public Method
	getEventCountAndIsMarkedDay: function(dDayStart, dDayEnd)
	{
		var to = this;
		var oArrEvents = to.getArrayOfEventsForView(dDayStart, dDayStart),
		iNoEvents = oArrEvents.length,
		iEventIndex, oEvent;

		for(iEventIndex = 0; iEventIndex < iNoEvents; iEventIndex++)
		{
			oEvent = oArrEvents[iEventIndex];
			if($.cf.isValid(oEvent.isMarked) && oEvent.isMarked)
			{
				var sEventColor = oEvent.fromSingleColor ? oEvent.textColor : oEvent.backgroundColor;
				sEventColor = ($.cf.compareStrings(sEventColor, "") || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;
				return [iNoEvents, true, sEventColor];
			}
		}

		return [iNoEvents, false, ""];
	},

	_setHeightForEvents: function()
	{
		var to = this;

		for(var iViewIndex = 0; iViewIndex < to.setting.viewsToDisplay.length; iViewIndex++)
		{
			var sViewName = to.setting.viewsToDisplay[iViewIndex].viewName,
			sEventClass = $.CalenStyle.extra.oEventClass[sViewName];

			if($.cf.isValid(sEventClass))
			{
				var sElem = '<div class='+ sEventClass +'></div>',
				$oElem = $(sElem).hide().appendTo("body"),
    			iHeight =  $.cf.getSizeValue($oElem, "height");
    			$oElem.remove();
    			if($.cf.isValid(iHeight) && iHeight > 2)
	    			$.CalenStyle.extra.iEventHeights[sViewName] = iHeight;
	    	}
		}
	},

	//------------------------------------ Events Manipulation End ------------------------------------

	//--------------------------------- Miscellaneous Functions Start ---------------------------------

	_generateUniqueColor: function(sColorArray)
	{
		var to = this;
		var sTempColor = "", bMatchFound;

		if(to.setting.eventColorsArray.length > sColorArray.length)
		{
			for(var iTempIndex1 = 0; iTempIndex1 < to.setting.eventColorsArray.length; iTempIndex1++)
			{
				var sColor1 = to.setting.eventColorsArray[iTempIndex1];
				bMatchFound = false;
				for(var iTempIndex2 = 0; iTempIndex2 < sColorArray.length; iTempIndex2++)
				{
					var sColor2 = sColorArray[iTempIndex2];
					if(sColor1 === sColor2)
					{
						bMatchFound = true;
						break;
					}
				}

				if(! bMatchFound)
					sTempColor = sColor1;
			}
		}

		if($.cf.compareStrings(sTempColor, ""))
		{
			bMatchFound = true;
			var i = 0;
			while(bMatchFound)
			{
				bMatchFound = false;
				sTempColor = to._generateColor();
				if(sColorArray.length > 0)
				{
					for(var iColorIndex = 0; iColorIndex < sColorArray.length; iColorIndex++)
					{
						if(sTempColor === sColorArray[iColorIndex])
						{
							bMatchFound = true;
							break;
						}
					}
				}
				i = i + 1;
			}
		}

		return sTempColor;
	},

	_generateColor: function()
	{
		var iR = Math.floor(100 * Math.random()) + 100,
		iG = Math.floor(100 * Math.random()) + 100,
		iB = Math.floor(100 * Math.random()) + 100;

		var sR = iR.toString(16); sR = (sR.length === 1) ? ("0"+sR) : sR;
		var sG = iG.toString(16); sG = (sG.length === 1) ? ("0"+sG) : sG;
		var sB = iB.toString(16); sB = (sR.length === 1) ? ("0"+sB) : sB;

		return sR + sG + sB;
	},

	__bindClick: function(e)
	{
		var oData = e.data, to;
		for(var iTempIndex = 0; iTempIndex < $.CalenStyle.extra.oArrCalenStyle.length; iTempIndex++)
		{
			var oThisCalenStyle = $.CalenStyle.extra.oArrCalenStyle[iTempIndex];
			if(oThisCalenStyle.tv.pluginId === oData.pluginId)
				to = oThisCalenStyle;
		}

		e.stopPropagation();
		var bIsEditing = $(to.elem).find(oData.eventElemSelector).hasClass("cEditingEvent"),
		iTS = $.cf.getTimestamp() - to.tv.iTSEndEditing,
		iDuration = $("body").hasClass("br-ie") ? 900 : 100;

		if(bIsEditing || (!bIsEditing && iTS < iDuration))
			return;

		if(to.setting.eventClicked)
			to.setting.eventClicked.call(to, to.setting.visibleView, oData.eventElemSelector, to.getEventWithId(oData.eventId));
		else
		{
			if(!$.cf.compareStrings(oData.url, ""))
				window.open(oData.url, "_blank");
		}
	},

	__getElementsAtPoint: function(iLeft, iTop)
	{
		return $("body")
				   .find("*")
				   .filter(function()
				   {
				   		var iLeft1 = $(this).offset().left,
				   		iLeft2 = iLeft1 + $(this).width(),
				   		iTop1 = $(this).offset().top,
				   		iTop2 = iTop1 + $(this).height();

						return (iLeft >= iLeft1 && iLeft <= iLeft2 && iTop >= iTop1 && iTop <= iTop2);
				   });
	}

	//--------------------------------- Miscellaneous Functions End ---------------------------------

};

/*! ------------------------------------ Common Functions End ------------------------------------ */
