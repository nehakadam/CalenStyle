var sArrSectionsList = null,
bDisplayEventList = false,
bDisplayFilterBar = false,
sFilterBarPosition = "",
bDisplayActionBar = false,
sArrViewsToDisplay = null,
sPluginStyleBoxOpen = true,
options = {};

var dToday = new Date();
var dStartDate = new Date();
dStartDate.setFullYear(dToday.getFullYear() - 1);
var dEndDate = new Date();
dEndDate.setFullYear(dToday.getFullYear() + 1);

function getEventsFromSource()
{
	var oJsonEvents = generateJsonEvents(dStartDate, dEndDate);
	if(typeof oJsonEvents === "string")
		return JSON.parse(oJsonEvents);
	else if(typeof oJsonEvents === "object")
		return oJsonEvents;
}

var oCalenStyle = null;

var oInitialize = function()
{
	oCalenStyle = this;
};

var oDisplayEventList = function(listStartDate, listEndDate)
{
	return displayEventsInList(this, listStartDate, listEndDate);
};
									
var oDisplayEventListAgenda = function(oViewDetails)
{
	return displayEventsInListAgenda(this, oViewDetails);						
};

var oEventsAddedInView = function(visibleView, eventClass)
{
	var thisObj = this;

	$(thisObj.elem).find(eventClass).popover(
	{
	
		placement: "top",
	
		trigger: "hover",
	
		html: true,
	
		container: "body",
	
		content: function()
		{
			var oTooltipContent = $(this).data("tooltipcontent"),
			sTooltipText = "<div class='cTooltipTitle'>" + oTooltipContent.title + "</div><div class='cTooltipTime'>" + oTooltipContent.startDateTime + "<br/>" + oTooltipContent.endDateTime + "</div>";
			return sTooltipText;
		}
	
	});	
};

var oTimeSlotsAddedInView = function(visibleView, eventClass)
{
	var thisObj = this;

	$(thisObj.elem).find(eventClass).popover(
	{
		placement: "top",
	
		trigger: "hover",
	
		html: true,
	
		container: "body",
	
		content: function()
		{
			return $(this).data("tooltipcontent");
		}
	});
};

var oTimeSlotClicked = function(oTimeSlotData, oTimeSlotElement)
{
	var thisObj = this;

	if(oTimeSlotData.status === "Free")
    {
        if($.cf.isValid(oTimeSlotData.count))
        {
            if(oTimeSlotData.count > 0)
                oTimeSlotData.count = --oTimeSlotData.count;
        }
        else
            oTimeSlotData.status = "Busy";
    }

    setTimeout(function()
    {
        thisObj.modifyAppointmentSlot(oTimeSlotData, oTimeSlotElement);
    }, 1000);
};

var oSaveChangesOnEventDrop = function(oDraggedEvent, startDateBeforeDrop, endDateBeforeDrop, startDateAfterDrop, endDateAfterDrop)
{
	$(".popover").hide();
};

var sArrHeaderComponents = ["DatePickerIcon", "FullscreenButton", "PreviousButton", "NextButton", "TodayButton", "HeaderLabel", "HeaderLabelWithDropdownMenuArrow", "MenuSegmentedTab", "MenuDropdownIcon"];
					
var oEventListAppended = function()
{
	adjustList();
};

var bChangedDevice = false,
bChangedCVDays = false, 
bChangedDLVDays = false,
bChangedCAVDays = false, 
bChangedCQAVDays = false, 
bChangedCTPVDays = false;

$(document).ready(function()
{
	//$.widget.bridge('tooltip', $.ui.tooltip);

	/*----------------------------------------------------------------------------*/

	$(".calendarContOuter").CalenStyle(
	{
		initialize: oInitialize	
	});

	$(window).resize(function()
	{
		adjustElements();
		adjustList();
	});

	$(".calendarContOuter").resizable();

	/*----------------------------------------------------------------------------*/

	$(".pluginSettingsSwitch").click(function()
	{
		if(!sPluginStyleBoxOpen)
		{
			$(".pluginSettingsBg").css("display", "block");
			$(".pluginSettings").animate({"left": -1});			
			sPluginStyleBoxOpen = true;
		}
		else
		{
			$(".pluginSettings").animate({"left": -700});
			setTimeout(function()
			{
				$(".pluginSettingsBg").css("display", "none");
				sPluginStyleBoxOpen = false;
			}, 500);
		}
	});

	$(".pluginSettingsBg").click(function()
	{
		if(sPluginStyleBoxOpen)
		{
			$(".pluginSettings").animate({"left": -700});
			setTimeout(function()
			{
				$(".pluginSettingsBg").css("display", "none");
				sPluginStyleBoxOpen = false;
			}, 500);
		}
	});

	$(".devices").multiselect(
	{
		onChange: function(element, checked)
		{
			bChangedDevice = true;
			changePluginProperties();
		}
	});

	$(".sectionsList").multiselect(
	{
		numberDisplayed: 1,
	
		onChange: function(element, checked)
		{
			getSectionsList();
			changePluginProperties();
		}
	});

	$(".viewsToDisplay").multiselect(
	{
		numberDisplayed: 1,
	
		onChange: function(element, checked)
		{
			sArrViewsToDisplay = $(".viewsToDisplay").val();
			setDataForVisibleView();
			setViewsToDisplay();
			changePluginProperties();
		}	
	});

	$(".headerSectionsListLeft").multiselect(
	{
		numberDisplayed: 1,
	
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".headerSectionsListCenter").multiselect(
	{
		numberDisplayed: 1,
	
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".headerSectionsListRight").multiselect(
	{
		numberDisplayed: 1,
	
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".dropdownMenuElements").multiselect(
	{
		numberDisplayed: 1,
	
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".visibleView").multiselect(
	{
		onChange: function(element, checked)
		{
			getSectionsList();
			setViewsToDisplay();
			changePluginProperties();
		}
	});

	$(".hideEventIcon").multiselect(
	{
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".hideEventTime").multiselect(
	{
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".hideExtraEvents").multiselect(
	{
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".cmvEventIndicator").multiselect(
	{
		onChange: function(element, checked)
		{
			setViewsToDisplay();
			changePluginProperties();
		}
	});

	$(".averageEvents").blur(function()
	{
		changePluginProperties();
	});

	$(".actionOnDayClickInMonthView").multiselect(
	{
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".cvDays").multiselect(
	{
		onChange: function(element, checked)
		{
			bChangedCVDays = true;
			changePluginProperties();
		}
	});

	$(".dlvDays").multiselect(
	{
		onChange: function(element, checked)
		{
			bChangedDLVDays = true;
			changePluginProperties();
		}
	});

	$(".cavDays").multiselect(
	{
		onChange: function(element, checked)
		{
			bChangedCAVDays = true;
			changePluginProperties();
		}
	});

	$(".cagvDuration").multiselect(
	{
		onChange: function(element, checked)
		{
			setViewsToDisplay();
			changePluginProperties();
		}
	});

	$(".cagvDays").blur(function()
	{
		changePluginProperties();
	});

	$(".cqavDuration").multiselect(
	{
		onChange: function(element, checked)
		{
			bChangedCQAVDuration = true;
			setViewsToDisplay();
			changePluginProperties();
		}
	});

	$(".cqavDays").multiselect(
	{
		onChange: function(element, checked)
		{
			bChangedCQAVDays = true;
			changePluginProperties();
		}
	});

	$(".ctpvDuration").multiselect(
	{
		onChange: function(element, checked)
		{
			setViewsToDisplay();
			changePluginProperties();
		}
	});

	$(".ctpvDays").multiselect(
	{
		onChange: function(element, checked)
		{
			bChangedCTPVDays = true;
			changePluginProperties();
		}
	});

	$(".weekNumber").multiselect(
	{
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".restrictedSection").multiselect(
	{
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".isRestrictedSectionDroppable").multiselect(
	{
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".isNonBusinessHoursDroppable").multiselect(
	{
		onChange: function(element, checked)
		{
			changePluginProperties();
		}
	});

	$(".filterBarPosition").multiselect(
	{
		onChange: function(element, checked)
		{
			sFilterBarPosition = $(".filterBarPosition").val();
			changePluginProperties();
		}
	});

	getSectionsList();
	setDataForVisibleView();
	setViewsToDisplay();
	changePluginProperties();    
});

function adjustElements()
{
	var iDocHeight = $(document).outerHeight(),
	iBodyHeight = $("body").height();
	$(".pluginSettingsBg").css({"height": iDocHeight});
	$(".pluginSettings").css({"height": iBodyHeight});
}

function adjustList()
{
	if($(".cListOuterCont").width() < 420)
		$(".cListEventDetails").css({"width": "50%"});
	else
		$(".cListEventDetails").css({"width": "70%"});
}

function getSectionsList()
{
	sArrSectionsList = $(".sectionsList").val();
	var sVisibleView = $(".visibleView").val();

	if(sArrSectionsList === undefined || sArrSectionsList === null)
	{
		sArrSectionsList = ["Header", "Calendar"];
		var sArrListJson = [
			{label: "Header", value: "Header"},
			{label: "Calendar", value: "Calendar"}
		];
		$(".sectionsList").multiselect("dataprovider", sArrListJson);
	}

	bDisplayFilterBar = false;
	bDisplayActionBar = false;
	bDisplayEventList = false;

	for(var iTempIndex = 0; iTempIndex < sArrSectionsList.length; iTempIndex++)
	{
		var sSection = sArrSectionsList[iTempIndex];
		if(sSection === "FilterBar")
		{
			bDisplayFilterBar = true;
			$(".row-filterBarPosition").show();
			sFilterBarPosition = $(".filterBarPosition").val();
		}
		else if(sSection === "ActionBar")
			bDisplayActionBar = true;
		else if(sSection === "EventList")
			bDisplayEventList = true;
	}

	if(sVisibleView === "DayEventListView" && !bDisplayEventList)
	{
		bDisplayEventList = true;
		$(".sectionsList").multiselect("select", "EventList")
	}
}

var bDetailedMonthView, bCMVEventIndicator, bRowCVDays, bRowDLVDays, bRowCAVDays, bRowCAGVDuration, bRowCAGVDays, bRowCQAVDuration, bRowCQAVDays, bRowCTPVDuration, bRowCTPVDays, bRowWeekNumber, bRowRestrictedSection, bRowNonBusinessHoursDroppable;
function setViewsToDisplay()
{
	$(".row-hideExtraEvents").hide();
	$(".row-cmvEventIndicator").hide();
	$(".row-averageEventsPerDay").hide();
	$(".row-actionOnDayClickInMonthView").hide();
	$(".row-cvDays").hide();
	$(".row-dlvDays").hide();
	$(".row-cavDays").hide();
	$(".row-cagvDuration").hide();
	$(".row-cagvDays").hide();
	$(".row-cqavDuration").hide();
	$(".row-cqavDays").hide();
	$(".row-ctpvDuration").hide();
	$(".row-ctpvDays").hide();
	$(".row-weekNumber").hide();
	$(".row-restrictedSection").hide();
	$(".row-isRestrictedSectionDroppable").hide();
	$(".row-isNonBusinessHoursDroppable").hide();
	$(".row-filterBarPosition").hide();
	bDetailedMonthView = false, bCMVEventIndicator = false, bRowCVDays = false, bRowDLVDays = false, bRowCAVDays = false, bRowCAGVDuration = false, bRowCAGVDays = false, bRowCQAVDuration = false, bRowCQAVDays = false, bRowCTPVDuration = false, bRowCTPVDays = false, bRowWeekNumber = false;

	if(sArrViewsToDisplay !== null)
	{
		for(var iTempIndex = 0; iTempIndex < sArrViewsToDisplay.length; iTempIndex++)
		{
			var sViewValue = sArrViewsToDisplay[iTempIndex];
			setVisibilityOfViews(sViewValue);
		}
	}

	setVisibilityOfViews($(".visibleView").val());
}

function setVisibilityOfViews(sViewValue)
{
	if(sViewValue === "CustomView")
	{
		$(".row-cvDays").show();
		bRowCVDays = true;
	}

	if(sViewValue === "DayEventListView" || sViewValue === "DayEventDetailView")
	{
		$(".row-dlvDays").show();
		bRowDLVDays = true;
	}

	if(sViewValue === "AppointmentView")
	{
		$(".row-cavDays").show();
		bRowCAVDays = true;
	}

	if(sViewValue === "DetailedMonthView")
	{
		$(".row-hideExtraEvents").show();
		bDetailedMonthView = true;
	}

	if(sViewValue === "DetailedMonthView" || sViewValue === "MonthView")
	{
		$(".row-weekNumber").show();
		bRowWeekNumber = true;
	}

	if(sViewValue === "DetailedMonthView" || sViewValue === "MonthView" || sViewValue === "WeekView" || sViewValue === "DayView" || sViewValue === "CustomView" || sViewValue === "DayEventDetailView" || sViewValue === "QuickAgendaView")
	{
		$(".row-restrictedSection").show();
		$(".row-isRestrictedSectionDroppable").show();
		bRowRestrictedSection = true;

		$(".row-isNonBusinessHoursDroppable").show();
		bRowNonBusinessHoursDroppable = true;
	}

	if(sViewValue === "AgendaView")
	{
		$(".row-cagvDuration").show();
		bRowCAGVDuration = true;
	}

	if(sViewValue === "AgendaView" && $(".cagvDuration").val() === "CustomDays")
	{
		$(".row-cagvDays").show();
		bRowCAGVDays = true;
	}

	if(sViewValue === "QuickAgendaView")
	{
		$(".row-cqavDuration").show();
		bRowCQAVDuration = true;
	}

	if(sViewValue === "QuickAgendaView" && $(".cqavDuration").val() === "CustomDays")
	{
		$(".row-cqavDays").show();
		bRowCQAVDays = true;
	}

	if(sViewValue === "TaskPlannerView")
	{
		$(".row-ctpvDuration").show();
		bRowCTPVDuration = true;
	}

	if(sViewValue === "TaskPlannerView" && $(".ctpvDuration").val() === "CustomDays")
	{
		$(".row-ctpvDays").show();
		bRowCTPVDays = true;
	}

	if(sViewValue === "MonthView")
	{
		$(".row-cmvEventIndicator").show();
		$(".row-actionOnDayClickInMonthView").show();
		bCMVEventIndicator = true;
	}

	if((bCMVEventIndicator && $(".cmvEventIndicator").val() === "DayHighlight") || sViewValue === "DayEventListView" || sViewValue === "DayEventDetailView")
	{
		$(".row-averageEventsPerDay").show();
	}
}

function setDataForVisibleView()
{
	var data = [];

	var bRefreshViewsToDisplayData = false;
	if(sArrViewsToDisplay === undefined || sArrViewsToDisplay === null)
	{
		sArrViewsToDisplay = ["DetailedMonthView", "WeekView", "DayView", "AgendaView"];
		bRefreshViewsToDisplayData = true;
	}

	if(sArrViewsToDisplay !== null)
	{
		$('.row-visibleView').show();	
		if(bRefreshViewsToDisplayData)
			$('.viewToDisplay').multiselect("dataprovider", data);
	}
}

function getViewsToDisplayArray()
{
	var data = [];

	for(var iTempIndex = 0; iTempIndex < sArrViewsToDisplay.length; iTempIndex++)
	{
		var sViewValue = sArrViewsToDisplay[iTempIndex];
	
		var viewOptions = {};
		if(sViewValue === "DetailedMonthView")
		{
			viewOptions.viewName = "DetailedMonthView";
			viewOptions.viewDisplayName = "Month";
		}
		else if(sViewValue === "MonthView")
		{
			viewOptions.viewName = "MonthView";
			viewOptions.viewDisplayName = "Month";
		}
		else if(sViewValue === "WeekView")
		{
			viewOptions.viewName = "WeekView";
			viewOptions.viewDisplayName = "Week";
		}
		else if(sViewValue === "DayView")
		{
			viewOptions.viewName = "DayView";
			viewOptions.viewDisplayName = "Day";
		}
		else if(sViewValue === "AgendaView")
		{
			viewOptions.viewName = "AgendaView";
			viewOptions.viewDisplayName = "Agenda";
		}
		else if(sViewValue === "QuickAgendaView")
		{
			viewOptions.viewName = "QuickAgendaView";
			viewOptions.viewDisplayName = "QuickAgenda";
		}
		else if(sViewValue === "CustomView")
		{
			var iNumberOfDays = $(".cvDays").val();
		
			viewOptions.viewName = "CustomView";
			viewOptions.viewDisplayName = iNumberOfDays + " Days";
		}
		else if(sViewValue === "DatePicker")
		{
			viewOptions.viewName = "DatePicker";
			viewOptions.viewDisplayName = "DatePicker";
		}
		else if(sViewValue === "DayEventListView")
		{
			var iNumberOfDays = $(".dlvDays").val();
		
			viewOptions.viewName = "DayEventListView";
			viewOptions.viewDisplayName = iNumberOfDays + " Days";
		}
		else if(sViewValue === "DayEventDetailView")
		{
			var iNumberOfDays = $(".dlvDays").val();
		
			viewOptions.viewName = "DayEventDetailView";
			viewOptions.viewDisplayName = iNumberOfDays + " Days";
		}
		else if(sViewValue === "AppointmentView")
		{
			var iNumberOfDays = $(".cavDays").val();
		
			viewOptions.viewName = "AppointmentView";
			viewOptions.viewDisplayName = iNumberOfDays + " Days";
		}
		data.push(viewOptions);	
	}

	return data;
}

function getPluginData(bEventCalendar, bEvent, bRestrictedSection, bSlotAvailability)
{
	var iJsonCount = 0;
	if(bEventCalendar)
		iJsonCount++;
	if(bEvent)
		iJsonCount++;
	if(bRestrictedSection)
		iJsonCount++;
	if(bSlotAvailability)
		iJsonCount++;

	var sJson = [					
		{
			sourceFetchType: "DateRange",
			sourceType: "FUNCTION",
		
			source: function(fetchStartDate, fetchEndDate, durationStartDate, durationEndDate, oConfig, loadViewCallback)
			{
				var calObj1 = this;
				calObj1.incrementDataLoadingCount(iJsonCount);
			
				if(bEventCalendar)
				{
					var oEventCalendarResponse = getEventCalendarList(fetchStartDate, fetchEndDate);
					if(oEventCalendarResponse !== undefined)
					{
						if(oEventCalendarResponse[0])
						{
							calObj1.parseDataSource("eventCalendarSource", oEventCalendarResponse[1], durationStartDate, durationEndDate, loadViewCallback, {}, false);
						}
					}
				}
			
				if(bEvent)
				{
					var oEventResponse = generateJsonEvents(fetchStartDate, fetchEndDate);
					if(oEventResponse !== undefined)
					{
						if(oEventResponse[0])
						{
							calObj1.parseDataSource("eventSource", oEventResponse[1], durationStartDate, durationEndDate, loadViewCallback, oConfig, false);
						}
					}
				}
			
				if(bRestrictedSection)
				{
					var oRestrictedSectionResponse = generateJsonRestrictedSection(fetchStartDate, fetchEndDate);
					if(oRestrictedSectionResponse !== undefined)
					{
						if(oRestrictedSectionResponse[0])
						{
							calObj1.parseDataSource("restrictedSectionSource", oRestrictedSectionResponse[1], durationStartDate, durationEndDate, loadViewCallback, {}, false);
						}
					}
				}
			
				if(bSlotAvailability)
				{
					var oSlotAvailabilityResponse = generateJsonSlotAvailability(fetchStartDate, fetchEndDate);
					if(oSlotAvailabilityResponse !== undefined)
					{
						if(oSlotAvailabilityResponse[0])
						{
							calObj1.parseDataSource("slotAvailabilitySource", oSlotAvailabilityResponse[1], durationStartDate, durationEndDate, loadViewCallback, {}, false);
						}
					}
				}			
			}
		}
	];

	return sJson;
}

var bDropdownMenuElement = false, bFullscreenElement = false;
function setHeaderSectionsListDropdownArray(sArrHeaderSections)
{
	var sArrSections = ["Left", "Center", "Right"];
	bDropdownMenuElement = false, bFullscreenElement = false;

	for(iSectionIndex = 0; iSectionIndex < 3; iSectionIndex++)
	{
		var sArrHeaderSectionsDropdown = [];
		for(var iTempIndex1 = 0; iTempIndex1 < sArrHeaderComponents.length; iTempIndex1++)
		{
			var bElemSelected = false, bElemDisabled = false,
			sComponent = sArrHeaderComponents[iTempIndex1];

			for(var iTempIndex2 = 0; iTempIndex2 < 3; iTempIndex2++)
			{
				var sArrHeaderSection = sArrHeaderSections[iTempIndex2];
			
				if($.cf.isValid(sArrHeaderSection))
				{
					for(var iTempIndex3 = 0; iTempIndex3 < sArrHeaderSection.length; iTempIndex3++)
					{
						if(sComponent === sArrHeaderSection[iTempIndex3])
						{
							if(iSectionIndex === iTempIndex2)
								bElemSelected = true;
							else
								bElemDisabled = true;

							if(sComponent === "MenuDropdownIcon" || sComponent === "HeaderLabelWithDropdownMenuArrow")
								bDropdownMenuElement = true;
							if(sComponent === "FullscreenButton")
								bFullscreenElement = true;
						}
					}
				}
			}

			sArrHeaderSectionsDropdown.push({label: sComponent, value: sComponent, disabled: bElemDisabled, selected: bElemSelected});
		}
		$(".headerSectionsList" + sArrSections[iSectionIndex]).multiselect("dataprovider", sArrHeaderSectionsDropdown);
	}
}

function changePluginProperties()
{
	var bEventCalendar, bEvent, bRestrictedSection, bSlotAvailability;
	options = {};
	options.initialize = oInitialize;

	var sDevice = $(".devices").val(),
	bWeb = (sDevice === "Web"),
	bTab = (sDevice === "Tablet"),
	bPhone = (sDevice === "Phone"),
	sDeviceClass = "";
	$(".calendarContOuter").removeClass("calendarContOuterWeb calendarContOuterTablet calendarContOuterPhone");
	if(bWeb)
		sDeviceClass = "calendarContOuterWeb";
	else if(bTab)
		sDeviceClass = "calendarContOuterTablet";
	else if(bPhone)
		sDeviceClass = "calendarContOuterPhone";
	$(".calendarContOuter").addClass(sDeviceClass);	
	$(".calendarContOuter").removeAttr("style");

	options.sectionsList = sArrSectionsList;

	options.viewsToDisplay = getViewsToDisplayArray();

	var sArrHeaderSections = [], sArrHeaderSectionsDropdown = [];
	sArrHeaderSections.push($(".headerSectionsListLeft").val());
	sArrHeaderSections.push($(".headerSectionsListCenter").val());
	sArrHeaderSections.push($(".headerSectionsListRight").val());

	setHeaderSectionsListDropdownArray(sArrHeaderSections);

	options.headerSectionsList = {};
	options.headerSectionsList.left = sArrHeaderSections[0];
	options.headerSectionsList.center = sArrHeaderSections[1];
	options.headerSectionsList.right = sArrHeaderSections[2];

	if(bDropdownMenuElement)
	{
		options.dropdownMenuElements = $(".dropdownMenuElements").val();
		$(".row-dropdownMenuElements").show();
	}
	else
		$(".row-dropdownMenuElements").hide();
	
	options.visibleView = $(".visibleView").val();

	options.hideEventIcon = {Default: ($(".hideEventIcon").val() === "true") ? true : false};

	options.hideEventTime = {Default: ($(".hideEventTime").val() === "true") ? true : false};

	if(options.visibleView === "DetailedMonthView")
	{
		options.hideExtraEvents = ($(".hideExtraEvents").val() === "true") ? true : false;
	}

	if(bCMVEventIndicator)
		options.eventIndicatorInMonthView = $(".cmvEventIndicator").val();

	if((bCMVEventIndicator && options.eventIndicatorInMonthView === "DayHighlight") || options.visibleView === "DayEventListView" || options.visibleView === "DayEventDetailView")
		options.averageEventsPerDayForDayHighlightView = parseInt($(".averageEvents").val()) || 5;

	if(bCMVEventIndicator)
		options.actionOnDayClickInMonthView = $(".actionOnDayClickInMonthView").val();

	if(bRowCVDays)
	{
		if(bChangedCVDays)
			options.daysInCustomView = parseInt($(".cvDays").val());
		else
		{
			if(bPhone)
				options.daysInCustomView = 2;
			else if(bTab)
				options.daysInCustomView = 3;
			else if(bWeb)
				options.daysInCustomView = 7;

			$(".cvDays *").attr('selected', false);
			$(".cvDays option[value='" + options.daysInCustomView + "']").attr('selected', true);
			$(".cvDays").multiselect('refresh');
		}
	}
	bChangedCVDays = false;

	if(bRowDLVDays)
	{
		if(bChangedDLVDays)
			options.daysInDayListView = parseInt($(".dlvDays").val());
		else
		{
			if(bPhone)
				options.daysInDayListView = 3;
			else if(bTab)
				options.daysInDayListView = 7;
			else if(bWeb)
				options.daysInDayListView = 7;

			$(".dlvDays *").attr('selected', false);
			$(".dlvDays option[value='" + options.daysInDayListView + "']").attr('selected', true);
			$(".dlvDays").multiselect('refresh');
		}
	}
	bChangedDLVDays = false;

	if(bRowCAVDays)
	{
		if(bChangedCAVDays)
			options.daysInAppointmentView = parseInt($(".cavDays").val());
		else
		{
			if(bPhone)
				options.daysInAppointmentView = 2;
			else if(bTab)
				options.daysInAppointmentView = 3;
			else if(bWeb)
				options.daysInAppointmentView = 4;

			$(".cavDays *").attr('selected', false);
			$(".cavDays option[value='" + options.daysInAppointmentView + "']").attr('selected', true);
			$(".cavDays").multiselect('refresh');
		}
	}

	if(bRowWeekNumber)
		options.displayWeekNumInMonthView = ($(".weekNumber").val() === "true") ? true : false;

	if(bRowCAGVDuration)
		options.agendaViewDuration = $(".cagvDuration").val();

	if(bRowCAGVDays)
		options.daysInAgendaView = parseInt($(".cagvDays").val()) || 15;


	if(bRowCQAVDuration)
	{
		options.quickAgendaViewDuration = $(".cqavDuration").val();

		if((!bRowCQAVDays || (bRowCQAVDays && !bChangedCQAVDays)) && (bPhone || bTab))
		{
			options.quickAgendaViewDuration = "CustomDays";
			$(".cqavDuration *").attr('selected', false);
			$(".cqavDuration option[value='" + options.quickAgendaViewDuration + "']").attr('selected', true);
			$(".cqavDuration").multiselect('refresh');

			$(".row-cqavDays").show();
			bRowCQAVDays = true;
		}
	}
	if(bRowCQAVDays)
	{
		if(bChangedCQAVDays)
			options.daysInQuickAgendaView = parseInt($(".cqavDays").val());
		else
		{
			if(bPhone)
				options.daysInQuickAgendaView = 2;
			else if(bTab)
				options.daysInQuickAgendaView = 3;
			else if(bWeb)
				options.daysInQuickAgendaView = 7;
		}

		$(".cqavDays *").attr('selected', false);
		$(".cqavDays option[value='" + options.daysInQuickAgendaView + "']").attr('selected', true);
		$(".cqavDays").multiselect('refresh');
	}
	bChangedCQAVDays = false;


	if(bRowCTPVDuration)
	{
		options.taskPlannerViewDuration = $(".ctpvDuration").val();

		if((!bRowCTPVDays || (bRowCTPVDays && !bChangedCTPVDays)) && (bPhone || bTab))
		{
			options.taskPlannerViewDuration = "CustomDays";
			$(".ctpvDuration *").attr('selected', false);
			$(".ctpvDuration option[value='" + options.taskPlannerViewDuration + "']").attr('selected', true);
			$(".ctpvDuration").multiselect('refresh');

			$(".row-ctpvDays").show();
			bRowCTPVDays = true;
		}
	}
	if(bRowCTPVDays)
	{
		if(bChangedCTPVDays)
			options.daysInTaskPlannerView = parseInt($(".ctpvDays").val());
		else
		{
			if(bPhone)
				options.daysInTaskPlannerView = 2;
			else if(bTab)
				options.daysInTaskPlannerView = 3;
			else if(bWeb)
				options.daysInTaskPlannerView = 7;
		
			$(".ctpvDays *").attr('selected', false);
			$(".ctpvDays option[value='" + options.daysInTaskPlannerView + "']").attr('selected', true);
			$(".ctpvDays").multiselect('refresh');
		}
	}
	bChangedCTPVDays = false;


	if(options.visibleView !== "DatePicker" && options.visibleView !== "AppointmentView")
	{
		bEvent = true;
	
		options.eventsAddedInView = oEventsAddedInView;

		options.saveChangesOnEventDrop = oSaveChangesOnEventDrop;
	
		if(bDisplayFilterBar)
		{
			bEventCalendar = true;
			options.eventFilterCriteria = getFilterCriteriaSource();
		
			var oFilterBarContent =  function(oFilterBarElement, oArrEventFilterCriteria, oArrEventFilterCount)
					{
						var thisObj = this;
					
						var bFilterCount = (oArrTempFilterCount !== null) ? ((oArrTempFilterCount.length > 0) ? true : false) : false;
					
						$(oFilterBarElement).html("<div class='cFilterBarHeader'>Filters</div>");
					
						for(var iTempIndex = 0; iTempIndex < oArrEventFilterCriteria.length; iTempIndex++)
						{
							var oArrTempFilter = oArrEventFilterCriteria[iTempIndex];
							var sTempKeyName = oArrTempFilter["keyName"];
							var sTempKeyDisplayName = oArrTempFilter.keyDisplayName || sTempKeyName;
							var oArrTempDataType = oArrTempFilter.dataType;
							var oArrTempValues = oArrTempFilter.values;
							var oArrTempSelectedValues = oArrTempFilter.selectedValues;
						
							var oArrTempFilterCount;
							for(var iTempIndex2 = 0; iTempIndex2 < oArrEventFilterCount.length; iTempIndex2++)
							{
								var oTempFilterCount = oArrEventFilterCount[iTempIndex2];
								if(oTempFilterCount["keyName"] === sTempKeyName)
								{
									oArrTempFilterCount = oTempFilterCount;
									break;
								}
							}
						
							var sTempStr = "";
						
							sTempStr += "<div class='filterBox'>";
						
							sTempStr += "<div class='filterBoxTitle'>" + sTempKeyDisplayName + "</div>";
						
							sTempStr += "<div class='filterBoxContent'>";
						
							for(var iTempIndex2 = 0; iTempIndex2 < oArrTempValues.length; iTempIndex2++)
							{
								var sTempValue = oArrTempValues[iTempIndex2];
								var iTempValueCount = bFilterCount ? oArrTempFilterCount[sTempValue] : 0;
							
								var sChecked = "";
								for(iTempIndex3 = 0; iTempIndex3 < oArrTempSelectedValues.length; iTempIndex3++)
								{
									if(sTempValue === oArrTempSelectedValues[iTempIndex3])
									{
										sChecked = "checked";
										break;
									}
								}
							
								sTempStr += "<div>";
							
								sTempStr += "<input type='checkbox' value='" + sTempValue + "' "+ sChecked +">";
							
								sTempStr += "  " + sTempValue;
							
								if(bFilterCount)
									sTempStr += "(" + iTempValueCount + ")";
							
								sTempStr += "</div>";
							}
						
							sTempStr += "</div>";
						
							sTempStr += "</div>";
						
							$(oFilterBarElement).append(sTempStr);
						}
					
						$("input[type='checkbox']").change(function() 
						{
							var $this = $(this),
							bInputStatus = $this.is(':checked'),
							sInputValue = $this.val(),
						
							$parent = $this.parent().parent().parent(),
							childCheckbox = $parent.find("input[type='checkbox']"),
							sKeyName = $parent.find('.filterBoxTitle').text();
						
							for(var iTempIndex1 = 0; iTempIndex1 < oArrEventFilterCriteria.length; iTempIndex1++)
							{
								var oTempFilter = oArrEventFilterCriteria[iTempIndex1];
								if(thisObj.compareStrings(oTempFilter["keyName"], sKeyName))
								{
									var oArrSelected = [];
									for(var iTempIndex2 = 0; iTempIndex2 < childCheckbox.length; iTempIndex2++)
									{
										var $checkbox = $(childCheckbox[iTempIndex2]);
										if($checkbox.is(':checked'))
											oArrSelected.push($checkbox.val());
									}
								
									oArrEventFilterCriteria[iTempIndex1].selectedValues = oArrSelected;
									thisObj.applyFilter(oArrEventFilterCriteria);
									break;
								}
							}
						});
					};
		
			options.modifyFilterBarView = oFilterBarContent;
		
			options.filterBarPosition = $(".filterBarPosition").val();
		}
	}

	if(options.visibleView === "AppointmentView")
	{
		bSlotAvailability = true;	
		options.timeSlotsAddedInView = oTimeSlotsAddedInView;

		options.clickedAppointmentSlot = oTimeSlotClicked;
	}

	if(bRowNonBusinessHoursDroppable)
		options.isNonBusinessHoursDroppable = ($(".isNonBusinessHoursDroppable").val() === "true") ? true : false;

	if(bRowRestrictedSection && $(".restrictedSection").val() === "nonempty")
	{
		bRestrictedSection = true;

		options.isRestrictedSectionDroppable = ($(".isRestrictedSectionDroppable").val() === "true") ? true : false;
	}

	if(bDisplayEventList && (options.visibleView === "DayEventListView" || options.visibleView === "MonthView"))
	{
		options.displayEventsForPeriodInList = oDisplayEventList;
		options.eventListAppended = oEventListAppended;
	}
	
	if(bDisplayEventList && (options.visibleView === "AgendaView"))
	{
		options.displayEventsForPeriodInList = oDisplayEventListAgenda;
		options.eventListAppended = oEventListAppended;
	}

	if(options.visibleView === "MonthView")
		options.displayWeekNumInMonthView = ($(".weekNumber").val() === "true") ? true : false;

	options.calDataSource = getPluginData(bEventCalendar, bEvent, bRestrictedSection, bSlotAvailability);
	oCalenStyle.modifySettings(options);
	oCalenStyle.loadView();

	$(".calendarContOuter").resizable("destroy");
	setTimeout(function()
	{
		$(".calendarContOuter").resizable();
		adjustElements();
		adjustList();
	
	}, 100);
}
