// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('App-CS', ['ionic'])

.run(function($ionicPlatform) 
{
  	$ionicPlatform.ready(function() 
  	{
		if(window.cordova && window.cordova.plugins.Keyboard) 
		{
	  		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
	  		// for form inputs)
	  		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

	  		// Don't remove this line unless you know what you are doing. It stops the viewport
	  		// from snapping when text inputs are focused. Ionic handles this internally for
	  		// a much nicer keyboard experience.
	  		cordova.plugins.Keyboard.disableScroll(true);
		}
		
		if(window.StatusBar) 
		{
	  		StatusBar.styleDefault();
		}
  	});
});

/* ------------------ CalenStyle Initialization Start ------------------ */

$(document).ready(function()
{
    $(".calendarContOuter").CalenStyle(
	{                            
		sectionsList: ["Header", "Calendar", "EventList"],
	
        headerSectionsList: 
		{
			left: ["HeaderLabelWithDropdownMenuArrow"],
			center: [],
			right: ["PreviousButton", "NextButton"]
		},
	
		visibleView: "DayEventListView",
	
		daysInDayListView: 3,

		eventIndicatorInDayListView: "Custom",
	
        dropdownMenuElements: ["DatePicker"],
    
		displayEventsForPeriodInList: function(listStartDate, listEndDate)
		{
			return displayEventsInList(this, listStartDate, listEndDate);
		},
	
		eventListAppended: function()
		{
			adjustList();
		},
	
		calDataSource: 
		[
			{
				sourceFetchType: "DateRange",
				sourceType: "FUNCTION",						
				source: function(fetchStartDate, fetchEndDate, durationStartDate, durationEndDate, oConfig, loadViewCallback)
				{
					var calObj1 = this;
					calObj1.incrementDataLoadingCount(1);
				
					var oEventResponse = generateJsonEvents(fetchStartDate, fetchEndDate);
					console.log("Response " + fetchStartDate + " " + fetchEndDate);
					console.log(oEventResponse);
					if(oEventResponse != undefined)
					{
						if(oEventResponse[0])
						{
							calObj1.parseDataSource("eventSource", oEventResponse[1], durationStartDate, durationEndDate, loadViewCallback, oConfig, false);
						}
					}
				}
			}
		],
	
		modifyCustomView: function(dArrViewDates)
		{
			var calObj1 = this;

			for(var iTempIndex = 0; iTempIndex < dArrViewDates.length; iTempIndex++)
			{
				var dThisDate = dArrViewDates[iTempIndex],
				sDayId = "#cdlvRowDay"+iTempIndex,
				oArrEvents = calObj1.getArrayOfEventsForView(dThisDate, dThisDate),
				sTempStr = "",
				iTempIndex2,
				sBgColor = "", bIsMarkedG = false;

				for(iTempIndex2 = 0; iTempIndex2 < oArrEvents.length; iTempIndex2++)
				{
					var oEvent = oArrEvents[iTempIndex2],
					sEventColor = oEvent.fromSingleColor ? oEvent.textColor : oEvent.backgroundColor,
					bIsMarked = ($.cf.isValid(oEvent.isMarked) && oEvent.isMarked);
					if(bIsMarked)
					{
						bIsMarkedG = true;
						sBgColor = oEvent.fromSingleColor ? oEvent.backgroundColor : $.cf.addHashToHexcode(oEvent.backgroundColor, 0.1);
					}

					sTempStr += "<span class='custEvent' style='background: "+sEventColor+";'></span>";
				}

				var sTemp = sTempStr;
				/*
				for(iTempIndex3 = 0; iTempIndex3 < 15; iTempIndex3++)
				{
					sTemp += sTempStr;
				}
				*/

				if(bIsMarkedG)
					$(calObj1.elem).find(sDayId).css({"background": sBgColor});

				$(calObj1.elem).find(sDayId + " .cdlvDaysTableRowCustom").html(sTemp);
			}

			calObj1.addRemoveViewLoader(false, "cEventLoaderBg");
			calObj1.addRemoveLoaderIndicators(false, "cEventLoaderIndicator");
        
           	//alert("Modified CustomView");
		},
    
        //useHammerjsAsGestureLibrary: true,

        //hideEventIcon: {Default: false},
    
        hideEventTime: {Default: true}
	
	});
  
    adjustList();
	$(window).resize(function()
	{
		adjustList();
	});

	function adjustList()
	{
        var oCal3 = $(".calendarContOuter").CalenStyle();
		var iEventWidth = $(oCal3.elem).width(),
        iEventColorWidth = $(".cListEventColor").outerWidth(true),
        iEventIconWidth = $(".cListEventIcon span").outerWidth(true),
        oElems = $(".cListEventTime span");
        var iMaxWidth = Math.max.apply(null, $(oElems).map(function()
        {
            return $(this).outerWidth(true);
        }).get());
        iMaxWidth += 5;
        $(".cListEventTime").css({"width": iMaxWidth});
  
        var iEventTitleWidth = iEventWidth - (iEventColorWidth + iMaxWidth + iEventIconWidth) - 25;
        $(".cListEventTitle").css({"width": iEventTitleWidth});
	}

});

/* ------------------ CalenStyle Initialization End ------------------ */
