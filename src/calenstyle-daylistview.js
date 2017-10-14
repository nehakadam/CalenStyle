/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

/*! ---------------------------------- CalenStyle DayList View Start --------------------------------- */

//"use strict";

CalenStyle.prototype = $.extend(CalenStyle.prototype, {

	setEventOrTaskStatusForCurrentView: function()
	{
		var to = this;
		to.tv.bEvTskStatus = false;
		to.tv.oAEvTaskStatus = [];

		var oArrEvents = to.getArrayOfEventsForView(to.tv.dVSDt, to.tv.dVEDt),
		iEvIndex, oEvent,
		iEvStatusIndex, oEventStatus;

		for(iEvIndex = 0; iEvIndex < oArrEvents.length; iEvIndex++)
		{
			oEvent = oArrEvents[iEvIndex];
			if($.cf.isValid(oEvent.status))
			{
				for(iEvStatusIndex = 0; iEvStatusIndex < to.setting.eventOrTaskStatusIndicators.length; iEvStatusIndex++)
				{
					oEventStatus = to.setting.eventOrTaskStatusIndicators[iEvStatusIndex];
					if($.cf.compareStrings(oEvent.status, oEventStatus.name))
					{
						to.tv.bEvTskStatus = true;
						break;
					}
				}
			}
		}

		if(to.tv.bEvTskStatus)
		{
			var iDateIndex, dThisDate, oDayStatus,
			dStartDateTime, dEndDateTime, bIsAllDay, iNoOfDays, iEvDateIndex;

			for(iDateIndex = 0; iDateIndex < to.tv.iNoVDay; iDateIndex++)
			{
				dThisDate = to.tv.dAVDt[iDateIndex];
				oDayStatus = {};
				oDayStatus.date = dThisDate;
				oDayStatus.statuscount = [];
				for(iEvStatusIndex = 0; iEvStatusIndex < to.setting.eventOrTaskStatusIndicators.length; iEvStatusIndex++)
					oDayStatus.statuscount.push(0);
				to.tv.oAEvTaskStatus.push(oDayStatus);
			}

			for(iEvIndex = 0; iEvIndex < oArrEvents.length; iEvIndex++)
			{
				oEvent = oArrEvents[iEvIndex];
				if($.cf.isValid(oEvent.status))
				{
					for(iEvStatusIndex = 0; iEvStatusIndex < to.setting.eventOrTaskStatusIndicators.length; iEvStatusIndex++)
					{
						oEventStatus = to.setting.eventOrTaskStatusIndicators[iEvStatusIndex];
						if($.cf.compareStrings(oEvent.status, oEventStatus.name))
						{
							oEvent.statusColor = $.cf.addHashToHexcode(oEventStatus.color);

							dStartDateTime = $.cf.isValid(oEvent.start) ? oEvent.start : null;
							dEndDateTime = $.cf.isValid(oEvent.end) ? oEvent.end : null;
							bIsAllDay = $.cf.isValid(oEvent.isAllDay) ? oEvent.isAllDay : false;

							iNoOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dStartDateTime, dEndDateTime, false, true, true);

							dThisDate = new Date(dStartDateTime);
							dThisDate = to.setDateInFormat({"date": dThisDate}, "START");
							for(iDateIndex = 0; iDateIndex < iNoOfDays; iDateIndex++)
							{
								iEvDateIndex = to.__getDateIndexInView(dThisDate);
								if(iEvDateIndex !== -1)
								{
									to.tv.oAEvTaskStatus[iEvDateIndex].statuscount[iEvStatusIndex] = ++to.tv.oAEvTaskStatus[iEvDateIndex].statuscount[iEvStatusIndex];
									dThisDate = new Date(dThisDate.getTime() + $.CalenStyle.extra.iMS.d);
								}
							}
						}
					}
				}
			}
		}
	},

	__updateDayListViewTable: function(bLoadAllData, bAddView)
	{
		var to = this;
		if(bAddView)
		{
			if($.cf.compareStrings(to.tv.sLoadType, "Prev"))
				to.tv.dLoadDt = to.tv.dAVDt[0];
			else if($.cf.compareStrings(to.tv.sLoadType, "Next"))
				to.tv.dLoadDt = to.tv.dAVDt[(to.tv.dAVDt.length - 1)];

			var sTemplate = "";
			sTemplate += "<tr class='cdlvDaysTableRow'>";
			for(var iDateIndex = 0; iDateIndex < to.tv.iNoVDay; iDateIndex++)
			{
				var sTempId = "cdlvRowDay"+iDateIndex;
				sTemplate += "<td id='" + sTempId + "' class='cdlvTableColumns clickableLink'>";
				sTemplate += "<div class='cdlvDaysTableRowDays'> &nbsp; </div>";
				sTemplate += "<div class='cdlvDaysTableRowDates'><span>&nbsp;</span></div>";

				if($.cf.compareStrings(to.setting.visibleView, "DayEventListView") && $.cf.compareStrings(to.setting.eventIndicatorInDayListView, "Custom"))
					sTemplate += "<div class='cdlvDaysTableRowCustom' >&nbsp;</div>";

				sTemplate += "</td>";
			}
			sTemplate += "</tr>";
			$(to.elem).find(".cdlvDaysTableMain").html(sTemplate);
		}

		to.__setDateStringsForDayListView(to.tv.iNoVDay, to.tv.dAVDt, 0);

		if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
		{
			to.__parseData(bLoadAllData, function()
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

				var sHTMLElements = "";
				if(to.setting.displayEventsForPeriodInList)
					sHTMLElements = to.setting.displayEventsForPeriodInList.call(to, to.setDateInFormat({"date": to.setting.selectedDate}, "START"), to.setDateInFormat({"date": to.setting.selectedDate}, "END"));
				$(to.elem).find(".cListOuterCont").html(sHTMLElements);

				to.addRemoveViewLoader(false, "cEventLoaderBg");
				to.addRemoveLoaderIndicators(false, "cEventLoaderIndicator");

				if(to.setting.eventListAppended)
					to.setting.eventListAppended.call(to);

				to.__modifyFilterBarCallback();
			});
		}
	},

	__displayEventOrTaskStatusForDayListView: function()
	{
		var to = this;
		var iDateIndex, dThisDate, oDayStatus,
		iEvStatusIndex, oStatusSetting,
		sStatusClass, sStatusStyle, iStatusCount,
		sTemplate = "";

		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDay; iDateIndex++)
		{
			dThisDate = to.tv.dAVDt[iDateIndex];
			oDayStatus = to.tv.oAEvTaskStatus[iDateIndex];
			sTemplate = "";

			for(iEvStatusIndex = 0; iEvStatusIndex < to.setting.eventOrTaskStatusIndicators.length; iEvStatusIndex++)
			{
				oStatusSetting = to.setting.eventOrTaskStatusIndicators[iEvStatusIndex];
				sStatusClass = "cdlvStatus cdlvStatus" + oStatusSetting.name;
				sStatusStyle = "background: " + $.cf.addHashToHexcode(oStatusSetting.color);
				iStatusCount = oDayStatus.statuscount[iEvStatusIndex];

				if(iStatusCount > 0)
					sTemplate += "<span class='" + sStatusClass + "' style='" + sStatusStyle + "'>" + to.getNumberStringInFormat(iStatusCount, 0, true) + "</span>";
			}

			$(to.elem).find("#cdlvRowDay"+iDateIndex+" .cdlvTableRowStatusGroup").html(sTemplate);
		}

		$(to.elem).find(".cdlvDaysTableRowIndicator").remove(); // Comment this if you want to Indicator alongwith Event or Task Status
	},

	__setDateStringsForDayListView: function(iNoOfDays, oArrDates, iStartIndex)
	{
		var to = this;
		for(var iDateIndex = iStartIndex; iDateIndex < iNoOfDays; iDateIndex++)
		{
			var dTempDate = oArrDates[iDateIndex];

			var bTodayMatched = (to.compareDates(dTempDate, $.CalenStyle.extra.dToday) === 0) ? true : false,
			bCurrentDateMatched = (to.compareDates(dTempDate, to.setting.selectedDate) === 0) ? true : false,
			bTodaySelected = (to.compareDates(to.setting.selectedDate, $.CalenStyle.extra.dToday) === 0) ? true : false,

			/* -------------------------- Table Row 1 Start ------------------------------- */
			iDayOfWeek = dTempDate.getDay(),
			sDayId = ".cdlvDaysTableMain #cdlvRowDay"+iDateIndex,
			iDay = dTempDate.getDate(),
			iMonth = dTempDate.getMonth(),
			iYear = dTempDate.getFullYear(),
			iThisDateMS = dTempDate.getTime(),

			$oTableCell = $(to.elem).find(sDayId);

			if(bTodayMatched)
			{

				if(bTodaySelected)
					$oTableCell.find(".cdlvDaysTableRowDays").addClass("cdlvTodayHighlightSelectedText");
				$oTableCell.find(".cdlvDaysTableRowDays").addClass("cdlvTodayHighlightText");
				$oTableCell.find(".cdlvDaysTableRowDates span").addClass("cdlvTodayHighlightCircle");
			}
			else if(bCurrentDateMatched)
			{
				$oTableCell.find(".cdlvDaysTableRowDays").addClass("cdlvCurrentHighlightText");
				$oTableCell.find(".cdlvDaysTableRowDates span").addClass("cdlvCurrentHighlightCircle");
			}

			$oTableCell.find(".cdlvDaysTableRowDays").html(to.getDateInFormat({"iDate": {D: iDayOfWeek}}, "DDD", false, true));
			$oTableCell.find(".cdlvDaysTableRowDates span").html(to.getNumberStringInFormat(iDay, 0, true));
			$oTableCell.bind($.CalenStyle.extra.sClickHandler, {"iThisDateMS": iThisDateMS, "iDateIndex": iDateIndex, "pluginId": to.tv.pluginId}, to._makeDayClickableInDayListView);

			// Comment lines below if you want to Indicator alongwith Event or Task Status
			if(!to.tv.bEvTskStatus) // Comment
			{ // Comment

				var dTempViewStartDate = new Date(iYear, iMonth, iDay, 0, 0, 0, 0),
				dTempViewEndDate = new Date(iYear, iMonth, iDay, 23, 59, 59, 0),
				oArrDayDetails = to.getEventCountAndIsMarkedDay(dTempViewStartDate, dTempViewEndDate),
				iArrTempLength = oArrDayDetails[0],
				bIsMarked = oArrDayDetails[1],
				sMarkedColor = oArrDayDetails[2],
				sEventIndClass = "cdlvDaysTableRowIndicator ",
				sSpanStyle = "";

				if(iArrTempLength !== 0)
				{
					if(iArrTempLength < to.setting.averageEventsPerDayForDayHighlightView)
						iArrTempLength = iArrTempLength * (100 / to.setting.averageEventsPerDayForDayHighlightView);
					else
						iArrTempLength = 100;

					if(iArrTempLength > 100)
						iArrTempLength = 100;
				}

				$(to.elem).find("#cdlvRowDay"+iDateIndex+" .cdlvDaysTableRowIndicator").remove();
				//$(to.elem).find("#cdlvRowDay"+iDateIndex+" .cdlvDaysTableRowCustom").remove();

				sSpanStyle = "width:"+iArrTempLength+"%; ";
				if(bIsMarked)
				{
					sEventIndClass += "cMarkedDayLineIndicator";
					if($.cf.isValid(sMarkedColor))
						sSpanStyle += "background: " + sMarkedColor + ";";
				}

				if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
				{
					if($.cf.compareStrings(to.setting.eventIndicatorInDayListView, "DayHighlight"))
						$(to.elem).find("#cdlvRowDay"+iDateIndex).append("<div class='" + sEventIndClass + "'><span style='" + sSpanStyle + "'>&nbsp;</span></div>");
				}
				else if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
					$(to.elem).find("#cdlvRowDay"+iDateIndex).append("<div class='" + sEventIndClass + "'><span style='" + sSpanStyle + "'>&nbsp;</span></div>");

			}// Comment
			/* -------------------------- Table Row 1 End ------------------------------- */
		}

		if(to.tv.bEvTskStatus && $.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
		{
			if($.cf.compareStrings(to.setting.eventIndicatorInDayListView, "Custom"))
			{
				if(to.setting.modifyCustomView)
					to.setting.modifyCustomView.call(to, oArrDates);
			}
		}

		to._setDateStringsInHeaderForDayListView();

		if(!$.CalenStyle.extra.bTouchDevice)
			to._addHoverClassesForDayListView();
	},

	_setDateStringsInHeaderForDayListView: function()
	{
		var to = this;
		var oDVDate = to.getDateInFormat({"date": to.setting.selectedDate}, "object", false, true),
		sHeaderViewLabel = "<b>" + to.getDateInFormat({"iDate": oDVDate}, "MMMM", false, true) + " " + to.getNumberStringInFormat(oDVDate.d, 0, true) + "</b>  " + to.getNumberStringInFormat(oDVDate.y, 0, true);
		if(to.setting.modifyHeaderViewLabels)
			to.setting.modifyHeaderViewLabels.call(to, to.tv.dVSDt, to.tv.dVEDt, to.setting.selectedDate, sHeaderViewLabel, to.setting.visibleView);
		$(to.elem).find(".cContHeaderLabel").html(sHeaderViewLabel);
	},

	_addHoverClassesForDayListView: function()
	{
		var to = this;
		$(to.elem).find(".cdlvTableColumns").hover(

			function(e)
			{
				var bTodayMatched = ($(this).find(".cdlvDaysTableRowDays .cTodayHighlightTextColor").length > 0) ? true : false,
				bCurrentDateMatched = $(this).find(".cdlvDaysTableRowDays").hasClass("cCurrentDateHighlightBg");

				if(!bTodayMatched && !bCurrentDateMatched)
				{
					$(this).find(".cdlvDaysTableRowDays").addClass("cdlvDaysTableRowDatesHover");
					$(this).find(".cdlvDaysTableRowDates").addClass("cdlvDaysTableRowDatesHover");
				}
			},
			function(e)
			{
				$(this).find(".cdlvDaysTableRowDays").removeClass("cdlvDaysTableRowDatesHover");
				$(this).find(".cdlvDaysTableRowDates").removeClass("cdlvDaysTableRowDatesHover");
			}
		);
	},

	__goToPrevDayListView: function()
	{
		var to = this;
		if(to.setting.showTransition)
		{
			//-----------------------------------------------------------------------------------
			var $occCDLVDaysTableMain = $(to.elem).find(".cdlvDaysTableMain"),
			icdvDaysTableWidth = $occCDLVDaysTableMain.width(),
			icdvDaysTableLeft = $occCDLVDaysTableMain.position().left,
			icdvDaysTableTop = 0;
			if($(to.elem).find(".cContHeader").length > 0)
				icdvDaysTableTop = $(to.elem).find(".cContHeader").position().top +  $(to.elem).find(".cContHeader").outerHeight() - 1;
			else
				icdvDaysTableTop = $(to.elem).position().top;

			var newElem = $occCDLVDaysTableMain.clone();
			$(newElem).removeClass("cdlvDaysTableMain").addClass("cdlvDaysTableTemp");
			$(newElem).css({"position": "absolute", "top": icdvDaysTableTop, "left": icdvDaysTableLeft});
			$(newElem).css({"z-index": 101});
			$occCDLVDaysTableMain.parent().append(newElem);

			icdvDaysTableLeft = icdvDaysTableLeft + icdvDaysTableWidth;

			//-----------------------------------------------------------------------------------
			$(newElem).animate({"left": icdvDaysTableLeft}, to.setting.transitionSpeed);
			setTimeout(function()
			{
				$(to.elem).find(".cdlvDaysTableTemp").remove();
			}, to.setting.transitionSpeed);
			//-----------------------------------------------------------------------------------
		}

		var oArrDates = [],
		iNoOfDays = to.tv.iNoVDay + 1;
		if(to.setting.daysInDayListView === 7)
			oArrDates = to.__setCurrentViewDatesArray(iNoOfDays, to.tv.dVSDt, null, "Prev");
		else
			oArrDates = to.__setCurrentViewDatesArray(iNoOfDays, to.tv.dVEDt, null, "Prev");
		oArrDates.shift();
		oArrDates.reverse();
		to.setting.selectedDate = oArrDates[to.tv.iSelDay];
		to.setting.selectedDate = to.setDateInFormat({"date": to.setting.selectedDate}, "START");
		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.sLoadType = "Prev";
		to.__reloadCurrentView(false, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	__goToNextDayListView: function()
	{
		var to = this;
		if(to.setting.showTransition)
		{
			//-----------------------------------------------------------------------------------
			var $occCDLVDaysTableMain = $(to.elem).find(".cdlvDaysTableMain"),
			icdvDaysTableWidth = $occCDLVDaysTableMain.width(),
			icdvDaysTableLeft = $occCDLVDaysTableMain.position().left,
			icdvDaysTableTop = 0;
			if($(to.elem).find(".cContHeader").length > 0)
				icdvDaysTableTop = $(to.elem).find(".cContHeader").position().top +  $(to.elem).find(".cContHeader").outerHeight() - 1;
			else
				icdvDaysTableTop = $(to.elem).position().top;

			var newElem = $occCDLVDaysTableMain.clone();
			$(newElem).removeClass("cdlvDaysTableMain").addClass("cdlvDaysTableTemp");
			$(newElem).css({"z-index": 101});
			$(newElem).css({"position": "absolute", "top": icdvDaysTableTop, "left": icdvDaysTableLeft});
			$occCDLVDaysTableMain.parent().append(newElem);

			icdvDaysTableLeft = icdvDaysTableLeft - icdvDaysTableWidth;

			//-----------------------------------------------------------------------------------
			$(newElem).animate({"left": icdvDaysTableLeft}, to.setting.transitionSpeed);
			setTimeout(function()
			{
				$(to.elem).find(".cdlvDaysTableTemp").remove();
			}, to.setting.transitionSpeed);
			//-----------------------------------------------------------------------------------
		}

		var oArrDates = [],
		iNoOfDays = to.tv.iNoVDay + 1;
		if(to.setting.daysInDayListView === 7)
			oArrDates = to.__setCurrentViewDatesArray(iNoOfDays, to.tv.dVEDt, null, "Next");
		else
			oArrDates = to.__setCurrentViewDatesArray(iNoOfDays, to.tv.dVSDt, null, "Next");
		oArrDates.shift();
		to.setting.selectedDate = oArrDates[to.tv.iSelDay];
		to.setting.selectedDate = to.setDateInFormat({"date": to.setting.selectedDate}, "START");
		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.sLoadType = "Next";
		to.__reloadCurrentView(false, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	__adjustDayListView: function()
	{
		var to = this;
		var icdlvCalendarContMaxHeight = $(to.elem).find(".cdlvCalendarCont").css("max-height");
		icdlvCalendarContMaxHeight = parseInt(icdlvCalendarContMaxHeight.replace("px", "")) || 0;
		var icdlvCalendarContMinHeight = $(to.elem).find(".cdlvCalendarCont").css("min-height");
		icdlvCalendarContMinHeight = parseInt(icdlvCalendarContMinHeight.replace("px", "")) || 0;

		if(icdlvCalendarContMaxHeight > 0 && $(to.elem).height() > icdlvCalendarContMaxHeight)
			$(to.elem).css({"height": icdlvCalendarContMaxHeight});
		else if(icdlvCalendarContMinHeight > 0 && $(to.elem).height() < icdlvCalendarContMinHeight)
			$(to.elem).css({"height": icdlvCalendarContMinHeight});
		if(to.tv.iCalHeight !== 0)
			$(to.elem).css({"height": to.tv.iCalHeight});

		var iCalendarContWidth = $(to.elem).find(".calendarCont").parent().outerWidth(),
		iCalendarContHeight = $(to.elem).find(".calendarCont").outerHeight();

		if($.cf.compareStrings(to.setting.filterBarPosition, "Left") || $.cf.compareStrings(to.setting.filterBarPosition, "Right"))
			iCalendarContWidth -= to.setting.filterBarWidth;

		var icdlvTableWidth, icdlvTableColumnWidth;
		if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
		{
			if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
			{
				var iTempFilterBarWidth = iCalendarContWidth;
				$(to.elem).find(".cFilterBar").css({"width": iTempFilterBarWidth});
				iCalendarContHeight -= $(to.elem).find(".cFilterBar").height();
			}
			$(to.elem).find(".calendarContInner").css({"width": iCalendarContWidth, "height": iCalendarContHeight});
			to.__adjustHeader();

			if($.cf.compareStrings(to.setting.filterBarPosition, "Right"))
				$(to.elem).find(".cFilterBar").css({"left": iCalendarContWidth});

			iCalendarContHeight -= ($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerHeight() : 0;
			if(to.tv.bDisABar)
				iCalendarContHeight -= $(to.elem).find(".cActionBar").outerHeight();

			icdlvTableWidth = iCalendarContWidth;
			var iCDLVDaysTableRowHeight = $(to.elem).find(".cdlvDaysTableRowCustom").height();
			$(to.elem).find(".cdlvDaysTableMain").css({"width": icdlvTableWidth, "height": iCDLVDaysTableRowHeight});

			icdlvTableColumnWidth = icdlvTableWidth / to.tv.iNoVDay;
			$(to.elem).find(".cdlvTableColumns").css({"width": icdlvTableColumnWidth});

			var icdlvTableHeight = $(to.elem).find(".cdlvDaysTableMain").height();
			iCalendarContHeight -= icdlvTableHeight;
			$(to.elem).find(".cListOuterCont").css({"height": iCalendarContHeight});

			to.setCalendarBorderColor();
		}
		else if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
		{
			var icdvDetailTableColumnTimeWidth = $(to.elem).find(".cdvDetailTableColumnTime").width();

			icdlvTableWidth = iCalendarContWidth - icdvDetailTableColumnTimeWidth - $.CalenStyle.extra.iScrollbarWidth;
			$(to.elem).find(".cdlvDaysTableMain").css({"width": icdlvTableWidth});

			icdlvTableColumnWidth = icdlvTableWidth / to.tv.iNoVDay;
			$(to.elem).find(".cdlvTableColumns").css({"width": icdlvTableColumnWidth});
		}

		//to.__adjustFontSize();
	},

	_makeDayClickableInDayListView: function(e)
	{
		var oData = e.data,
		to = $.CalenStyle.extra.oArrCalenStyle[(oData.pluginId - 1)],
		dThisDate = new Date(oData.iThisDateMS),
		iDateIndex = oData.iDateIndex,
		bCompDates;

		if(to.setting.daysInDayListView === 7 || $.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
		{
			bCompDates = to.compareDates(to.setting.selectedDate, dThisDate);
			if(bCompDates === 0 || bCompDates < 0)
				to.tv.sLoadType = "Next";
			else
				to.tv.sLoadType = "Prev";
			to.tv.bDyClDLV = true;

			to.tv.iSelDay = iDateIndex;
			to.setting.selectedDate = to.setDateInFormat({"date": dThisDate}, "START");
			to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

			to.tv.dVDSDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");
			to.tv.dVDEDt = to.setDateInFormat({"date": to.setting.selectedDate}, "END");

			if($.cf.compareStrings(to.setting.visibleView, "DayEventListView"))
			{
				var sHTMLElements = "";
				if(to.setting.displayEventsForPeriodInList)
					sHTMLElements = to.setting.displayEventsForPeriodInList.call(to, to.setDateInFormat({"date": dThisDate}, "START"), to.setDateInFormat({"date": dThisDate}, "END")) || "";
				$(to.elem).find(".cListOuterCont").html(sHTMLElements);
				if(to.setting.eventListAppended)
					to.setting.eventListAppended.call(to);
			}
			else if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
				to.__reloadCurrentView(true, true);

			to._setDateStringsInHeaderForDayListView();

			$(to.elem).find(".cdlvTableColumns .cdlvDaysTableRowDays").removeClass("cdlvTodayHighlightText cdlvTodayHighlightSelectedText cdlvCurrentHighlightText cdlvDaysTableRowDatesHover");
			$(to.elem).find(".cdlvTableColumns .cdlvDaysTableRowDates span").removeClass("cdlvTodayHighlightCircle cdlvCurrentHighlightCircle cdlvDaysTableRowDatesHover");

			if(to.compareDates(dThisDate, $.CalenStyle.extra.dToday) === 0)
			{
				if(to.compareDates(to.setting.selectedDate, $.CalenStyle.extra.dToday) === 0)
					$(to.elem).find(".cdlvDaysTableMain #cdlvRowDay"+oData.iDateIndex+" .cdlvDaysTableRowDays").addClass("cdlvTodayHighlightSelectedText");
				$(to.elem).find(".cdlvDaysTableMain #cdlvRowDay"+oData.iDateIndex+" .cdlvDaysTableRowDays").addClass("cdlvTodayHighlightText");
				$(to.elem).find(".cdlvDaysTableMain #cdlvRowDay"+oData.iDateIndex+" .cdlvDaysTableRowDates span").addClass("cdlvTodayHighlightCircle");
			}
			else
			{
				$(to.elem).find(".cdlvDaysTableMain #cdlvRowDay"+oData.iDateIndex+" .cdlvDaysTableRowDays").addClass("cdlvCurrentHighlightText");
				$(to.elem).find(".cdlvDaysTableMain #cdlvRowDay"+oData.iDateIndex+" .cdlvDaysTableRowDates span").addClass("cdlvCurrentHighlightCircle");
			}

			to.tv.bDyClDLV = false;
		}
		else
		{
			bCompDates = to.compareDates(to.setting.selectedDate, dThisDate);
			if(bCompDates !== 0)
			{
				if(bCompDates < 0)
					to.tv.sLoadType = "Next";
				else if(bCompDates > 0)
					to.tv.sLoadType = "Prev";

				to.setting.selectedDate = new Date(dThisDate);
				to.__reloadCurrentView(false, true);
				to.__reloadDatePickerContentOnNavigation();
			}
		}
	}

});

/*! ---------------------------------- CalenStyle DayList View End --------------------------------- */
