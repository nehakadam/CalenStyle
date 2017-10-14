/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

/*! ------------------------------------ CalenStyle Month View Start ----------------------------------- */

//"use strict";

CalenStyle.prototype = $.extend(CalenStyle.prototype, {

	_arrayContains: function(iArrTemp, iValue)
	{
		var to = this;
		for(var iTempIndex = 0; iTempIndex < iArrTemp.length; iTempIndex++)
		{
			if(iArrTemp[iTempIndex] === iValue)
				return 1;
		}
		return 0;
	},

	_setNextPreviousMonthDates: function()
	{
		var to = this;
		var dPMDt = new Date(to.tv.dCMDt.getTime() - (30 * $.CalenStyle.extra.iMS.d));
		dPMDt.setDate(15);
		to.tv.dPMDt = new Date(dPMDt);

		var dNMDt = new Date(to.tv.dCMDt.getTime() + (30 * $.CalenStyle.extra.iMS.d));
		dNMDt.setDate(15);
		to.tv.dNMDt = new Date(dNMDt);
	},

	_updateMonthTable: function()
	{
		var to = this;
		to.__getCurrentViewDates();

		var sTemplate = "";

		sTemplate += "<thead>";
		sTemplate += "<tr class='cmvMonthTableRowDayHeader'>";
		if(to.setting.displayWeekNumInMonthView)
			sTemplate += "<td class='cmvDayHeader cmvWeekNumber cmvThinBorderRight cmvFirstColumn'></td>";
		var iCountDays = to.setting.weekStartDay,
		iNumWeekDays = (to.setting.excludeNonBusinessHours) ? to.tv.iBsDays : 7,
		iWeekDayIndex;

		for(iWeekDayIndex = 0; iWeekDayIndex < 7; iWeekDayIndex++)
		{
			var sClass = "";
			if(!to.setting.displayWeekNumInMonthView && iWeekDayIndex === 0)
				sClass = "cmvFirstColumn";

			if((to.setting.excludeNonBusinessHours && to.tv.bABsDays[iCountDays]) || !to.setting.excludeNonBusinessHours)
				sTemplate += "<td id='" + "cmvDayName"+(iCountDays + 1) + "' class='cmvDayHeader cmvTableColumns "+sClass+"'>" + to.getDateInFormat({"iDate": {D: iCountDays}}, "DDD", false, true) + "</td>";

			iCountDays++;
			if(iCountDays > 6)
				iCountDays = 0;
		}
		sTemplate += "</tr>";
		sTemplate += "</thead>";

		to.tv.dCMDt = new Date(to.setting.selectedDate);
		to.tv.dCMDt.setDate(15);
		to._setNextPreviousMonthDates();

		var iTodayDateNum = $.CalenStyle.extra.dToday.getDate(),
		iTodayMonthNum = $.CalenStyle.extra.dToday.getMonth(),
		iTodayYearNum = $.CalenStyle.extra.dToday.getFullYear();

		sTemplate += "<tbody>";

		var iDateIndex = 0;
		for(var iMonthWeeks = 1; iMonthWeeks <= to.tv.iWkInMonth; iMonthWeeks++)
		{
			sTemplate += "<tr id='"+ ("cmvMonthTableRow"+iMonthWeeks) +"' class='cmvMonthTableRows'>";

			var bCurrentWeek = false;
			if(to.setting.displayWeekNumInMonthView)
			{
				var dWkSDate = to.tv.dAVDt[iDateIndex],
				dWkEDate = to.setDateInFormat({"date": to.tv.dAVDt[(iDateIndex + 6)]}, "END"),
				sWkNumber = to.__getWeekNumber(dWkSDate, dWkEDate);

				var sCellClass = "cmvDay cmvWeekNumber cmvThinBorderRight cmvWeekNumberBorderLeft";
				if(iMonthWeeks === 1)
					sCellClass += " cmvWeekNumberBorderBottom";
				else if(iMonthWeeks === to.tv.iWkInMonth)
					sCellClass += " cmvWeekNumberBorderTop";
				else
					sCellClass += " cmvWeekNumberBorderBottom cmvWeekNumberBorderTop";

				var dArrTempDates = to._getWeekForDate($.CalenStyle.extra.dToday, false),
				dWkSDateToday = dArrTempDates[0],
				dWkEDateToday = dArrTempDates[1];
				if(to.compareDates(dWkSDateToday, dWkSDate) === 0 && to.compareDates(dWkEDateToday, dWkEDate) === 0)
				{
					sCellClass += " cTodayHighlightTextColor";
					bCurrentWeek = true;
				}

				sTemplate += "<td id='"+ dWkSDate.getTime() +"' class='"+ sCellClass +"'><span>" + sWkNumber + "</span></td>";
			}

			for(iWeekDayIndex = 0; iWeekDayIndex < iNumWeekDays; iWeekDayIndex++)
			{
				var dCurrentDate = to.tv.dAVDt[iDateIndex],
				iCurrentDateNum = dCurrentDate.getDate(),
				iCurrentMonthNum = dCurrentDate.getMonth(),
				iCurrentYearNum = dCurrentDate.getFullYear(),

				iSourceCount = to.__getSourceCountForDate(dCurrentDate),
				sDayNumberClass = ($.cf.compareStrings(to.setting.eventIndicatorInDatePicker, "DayNumberBold") && ($.cf.compareStrings(to.setting.visibleView, "DatePicker") || to.setting.parentObject !== null) && (iSourceCount > 0)) ? " cBold" : "",

				dArrTempResSec = [], sStyle = "", iTempIndex,
				sTempId,
				sCellClassTemp = "cmvDay" + " " + "cmvTableColumns" + " " + "cmvTableColumn" + iWeekDayIndex;

				if(to.tv.dCMDt.getMonth() !== iCurrentMonthNum)
					sCellClassTemp += " " + "cmvOtherMonthDay";
				else
					sCellClassTemp += " " + "cmvCurrentMonthDay";

				if(!to.setting.displayWeekNumInMonthView && iWeekDayIndex === 0)
					sCellClassTemp += (" " + "cmvFirstColumn");

				sTempId = "cmvDay" + "-" + iCurrentDateNum + "-" + iCurrentMonthNum + "-" + iCurrentYearNum;

				var iSelectedDateNum = to.setting.selectedDate.getDate(),
				iSelectedMonthNum = to.setting.selectedDate.getMonth(),
				iSelectedYearNum = to.setting.selectedDate.getFullYear();

				if(iCurrentDateNum === iTodayDateNum && iCurrentMonthNum === iTodayMonthNum && iCurrentYearNum === iTodayYearNum)
					sCellClassTemp += " " + "cTodayHighlightTextColor";
				else if(iCurrentDateNum === iSelectedDateNum && iCurrentMonthNum === iSelectedMonthNum && iCurrentYearNum === iSelectedYearNum)
					sCellClassTemp += " " + "cCurrentDateHighlightColor";

				if(($.cf.compareStrings(to.setting.visibleView, "MonthView") && !$.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "DisplayEventListDialog")) || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
					sCellClassTemp += " clickableLink";

				// Set Style For Non Busienss Hours

				if(!to.tv.bABsDays[dCurrentDate.getDay()])
					sCellClassTemp += " cNonBusinessHoursBg";

				// Set Style For All-Day Restricted Section

				dArrTempResSec = to._getRestrictedSectionForCurrentView(dCurrentDate);
				for(iTempIndex = 0; iTempIndex < dArrTempResSec.length; iTempIndex++)
				{
					var dArrResSec = dArrTempResSec[iTempIndex],
					dTempResSecStart = new Date(dArrResSec.start),
					bCompStart = (to.compareDates(dCurrentDate, dTempResSecStart) === 0),
					dTempResSecEnd = new Date(dArrResSec.end),
					bCompEnd = (to.compareDates(dCurrentDate, dTempResSecEnd) === 0),
					iNumOfHours;

					if(!bCompStart)
						dTempResSecStart = to._normalizeDateTime(dCurrentDate, "START", "T");
					if(!bCompEnd)
						dTempResSecEnd = to._normalizeDateTime(dCurrentDate, "END", "T");

					iNumOfHours = Math.round((dTempResSecEnd.getTime() - dTempResSecStart.getTime()) / $.CalenStyle.extra.iMS.h);
					if(iNumOfHours > 23 || dArrResSec.isAllDay)
					{
						if($.cf.isValid(dArrResSec.backgroundColor))
							sStyle = "style='background: " + $.cf.addHashToHexcode(dArrResSec.backgroundColor) + ";'";
						if($.cf.isValid(dArrResSec.class))
							sCellClassTemp += " " + dArrResSec.class;
					}
				}

				sTemplate += "<td id='"+ sTempId +"' class='" + sCellClassTemp + "' " + sStyle + ">";
				sTemplate += "<span class='cmvDayNumber" + sDayNumberClass + "'>" + to.getNumberStringInFormat(iCurrentDateNum, 0, true) + "</span>";
				if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
				{
					if($.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "DisplayEventListDialog"))
						sTemplate += "<span class='cmvDisplayAllEvents'>..</span>";

					if($.cf.compareStrings(to.setting.eventIndicatorInMonthView, "DayHighlight"))
						sTemplate += "<div class='cmvMonthTableRowIndicator' ><span>&nbsp;</span></div>";
					else if($.cf.compareStrings(to.setting.eventIndicatorInMonthView, "Custom"))
						sTemplate += "<div class='cmvMonthTableRowCustom' >&nbsp;</div>";
			    }
			    else if($.cf.compareStrings(to.setting.visibleView, "DatePicker"))
			    {
			    	sTemplate += "<div class='cElemDatePickerCustom'>";
			    	if($.cf.compareStrings(to.setting.eventIndicatorInDatePicker, "Dot") && iSourceCount > 0)
			    	{
			    		sTemplate += "<span class='cElemDatePickerDot'></span>";
			    	}
			    	sTemplate += "</div>";
			    }
			    sTemplate += "</td>";

				iDateIndex++;
			}
			sTemplate += "</tr>";
		}

		sTemplate += "</tbody>";

		$(to.elem).find(".cmvMonthTableMain").html(sTemplate);

		$(to.elem).find(".cTodayHighlightTextColor").find(".cmvDayNumber").addClass("cTodayHighlightCircle");
		if($.cf.compareStrings(to.setting.visibleView, "MonthView") && $.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "ModifyEventList"))
			$(to.elem).find(".cCurrentDateHighlightColor").find(".cmvDayNumber").addClass("cCurrentHighlightCircle");

		to.adjustMonthTable();
		if(!to.setting.addEventsInMonthView)
			to.adjustMonthTable();

		to._setMonthStrings();
		if(!$.CalenStyle.extra.bTouchDevice)
			to._addHoverClassesInMonthView();
	},

	_updateMonthTableContents: function(bLoadAllData)
	{
		var to = this;
		if(to.setting.addEventsInMonthView && !$.cf.compareStrings(to.setting.visibleView, "DatePicker"))
		{
			if($.cf.compareStrings(to.setting.eventIndicatorInMonthView, "DayHighlight"))
				to._updateDayHighlightViewInMonthView(bLoadAllData);
			else if($.cf.compareStrings(to.setting.eventIndicatorInMonthView, "Events"))
				to._addEventContInMonthView(bLoadAllData);
			else if($.cf.compareStrings(to.setting.eventIndicatorInMonthView, "Custom"))
			{
				to.__parseData(bLoadAllData, function()
				{
					if(to.setting.modifyCustomView)
						to.setting.modifyCustomView.call(to, to.tv.dAVDt);

					if(!$.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "ChangeDate"))
						to._displayEventOnDayClickInMonthView();

					to.adjustMonthTable();
					to.__modifyFilterBarCallback();
				});
			}
		}
		else if($.cf.compareStrings(to.setting.visibleView, "DatePicker"))
			to._updateDayHighlightInDatePickerView(bLoadAllData);

		if(!$.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "DisplayEventListDialog"))
			to._makeDayClickableInMonthView();
	},

	_updateDayHighlightInDatePickerView: function(bLoadAllData)
	{
		var to = this;
		to.__parseData(bLoadAllData, function()
		{
			for(var iTempIndex = 0; iTempIndex < to.tv.dAVDt.length; iTempIndex++)
			{
				var dTempViewDate = to.tv.dAVDt[iTempIndex],
				sDayId = "#cmvDay-"+dTempViewDate.getDate()+"-"+dTempViewDate.getMonth()+"-"+dTempViewDate.getFullYear(),
				$oDay = $(to.elem).find(sDayId),
				iSourceCount = to.__getSourceCountForDate(dTempViewDate),
				sDayNumberClass = (($.cf.compareStrings(to.setting.visibleView, "DatePicker") || to.setting.parentObject !== null) && (iSourceCount > 0)) ? " cBold" : "";

				if($.cf.compareStrings(to.setting.eventIndicatorInDatePicker, "DayNumberBold"))
				{
					if(sDayNumberClass !== "")
						$oDay.find(".cmvDayNumber").addClass(sDayNumberClass);
				}
				else if($.cf.compareStrings(to.setting.eventIndicatorInDatePicker, "Dot"))
				{
					if($oDay.find(".cElemDatePickerCustom").length === 0)
					{
						var sTemplate = "<div class='cElemDatePickerCustom'>";
				    	sTemplate += "<span class='cElemDatePickerDot'></span>";
				    	sTemplate += "</div>";
				    	$oDay.append(sTemplate);
				    }
				}
			}
		});
	},

	_updateDayHighlightViewInMonthView: function(bLoadAllData)
	{
		var to = this;
		to.__parseData(bLoadAllData, function()
		{
			for(var iTempIndex = 0; iTempIndex < to.tv.dAVDt.length; iTempIndex++)
			{
				var dTempViewDate = to.tv.dAVDt[iTempIndex],
				sDayId = "#cmvDay-"+dTempViewDate.getDate()+"-"+dTempViewDate.getMonth()+"-"+dTempViewDate.getFullYear();

				var dTempViewStartDate = to.setDateInFormat({"date": dTempViewDate}, "START"),
				dTempViewEndDate = to.setDateInFormat({"date": dTempViewDate}, "END"),
				oArrDayDetails = to.getEventCountAndIsMarkedDay(dTempViewStartDate, dTempViewEndDate),
				iArrTempLength = oArrDayDetails[0],
				bIsMarked = oArrDayDetails[1],
				sMarkedColor = oArrDayDetails[2],
				$oMonthInd = $(to.elem).find(sDayId+" .cmvMonthTableRowIndicator");

				if(iArrTempLength !== 0)
				{
					if(iArrTempLength < to.setting.averageEventsPerDayForDayHighlightView)
						iArrTempLength = iArrTempLength * (100 / to.setting.averageEventsPerDayForDayHighlightView);
					else
						iArrTempLength = 100;
					if(iArrTempLength > 100)
						iArrTempLength = 100;
				}

				if(bIsMarked)
				{
					$oMonthInd.addClass("cMarkedDayLineIndicator");
					if($.cf.isValid(sMarkedColor))
						$oMonthInd.find("span").css({"background": sMarkedColor});
				}
				$oMonthInd.find("span").css({"width": iArrTempLength + "%"});
				if($.cf.compareStrings(to.setting.visibleView, "MonthView") && $.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "DisplayEventListDialog"))
				{
					if($(to.elem).find(".cmvMonthTableMain " +sDayId).has(".cmvDisplayAllEvents").length === 0)
						$(to.elem).find(".cmvMonthTableMain " +sDayId).prepend("<span class='cmvDisplayAllEvents'>...</span>");
				}
			}

			if(!$.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "ChangeDate"))
				to._displayEventOnDayClickInMonthView();

			to.adjustMonthTable();

			to.addRemoveViewLoader(false, "cEventLoaderBg");
			to.addRemoveLoaderIndicators(false, "cEventLoaderIndicator");

			to.__modifyFilterBarCallback();
		});
	},

	// Public Method
	updateMonthTableAndContents: function(bLoadAllData)
	{
		var to = this;
		$(to.elem).find(".cmvDisplayAllEvents").remove();
		$(to.elem).find(".cmvEvent").remove();
		$(to.elem).find(".cdmvEvent").remove();
		$(to.elem).find(".cHiddenEventsIndicator").remove();
		$(to.elem).find(".cHiddenEventsCont").remove();
		$(to.elem).find(".cmvDialog").remove();

		to._updateMonthTable();
		to._updateMonthTableContents(bLoadAllData);
	},

	_addHoverClassesInMonthView: function()
	{
		var to = this;
		if($(to.elem).find(".cContHeaderLabelMonth" + ", " + ".cContHeaderLabelYear").hasClass("sClickableClass"))
		{
			$(to.elem).find(".cContHeaderLabelMonth" + ", " + ".cContHeaderLabelYear").hover(

				function(e)
				{
					$(this).addClass("cContHeaderLabelHover");
				},
				function(e)
				{
					$(this).removeClass("cContHeaderLabelHover");
				}
			);
		}

		$(to.elem).find(".cmvDay").hover(

			function(e)
			{
				$(this).addClass("cContHeaderButtonsHover");
			},
			function(e)
			{
				$(this).removeClass("cContHeaderButtonsHover");
			}
		);
	},

	_addEventContInMonthView: function(bLoadAllData)
	{
		var to = this;
		var sTempInner = "", iElemIndex,
		$oElemDragged, sDroppableId, sEventId, sId, oDraggedEvent, sEventClass, sElemId,
		dStartDateTime = null, dEndDateTime = null, bIsAllDay = 0,
		iArrNumOfDays, iNumOfDays, iNumOfHours, sDayId, sArrDayId, dThisDate, dNextDate, bNextDate,
		dStartDateAfterDrop, dEndDateAfterDrop, bEventEntered = false;

		if($.cf.compareStrings(to.setting.visibleView, "MonthView") && to.setting.displayEventsInMonthView)
		{
			sTempInner += "<div class='cmvEventCont'><div class='cmvEventContSmall'></div><div class='cmvEventContAllDay'></div></div>";
			$(to.elem).find(".cmvMonthTableMain .cmvDay").not(".cmvWeekNumber").append(sTempInner);
		}

		$(to.elem).find(".cmvDay").droppable(
		{
			scope: "Events",

			over: function(event, ui)
			{
				$oElemDragged = $(ui.draggable);
				sEventId = $oElemDragged.attr("id");
				sId = $oElemDragged.attr("data-id");
				oDraggedEvent = to.getEventWithId(sId);
				sEventClass = "." + "Event-" + sId;
				dStartDateTime = null; dEndDateTime = null; bIsAllDay = 0;

				$(to.elem).find(sEventClass).addClass("cEditingEventClone");

				if(oDraggedEvent.start !== null)
					dStartDateTime = oDraggedEvent.start;
				if(oDraggedEvent.end !== null)
					dEndDateTime = oDraggedEvent.end;
				if(oDraggedEvent.isAllDay !== null)
					bIsAllDay = oDraggedEvent.isAllDay;

				iArrNumOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dStartDateTime, dEndDateTime, true, false, true);
				iNumOfDays = iArrNumOfDays[0];
				iNumOfHours = iArrNumOfDays[1];

				sDayId = $(this).attr("id");
				sArrDayId = sDayId.split("-");
				dThisDate = new Date(sArrDayId[3], sArrDayId[2], sArrDayId[1], 0, 0, 0, 0);
				dNextDate = new Date(dThisDate);
				bNextDate = false;

				dStartDateAfterDrop = to.setDateInFormat({"iDate": {d: parseInt(sArrDayId[1]), M: parseInt(sArrDayId[2]), y: parseInt(sArrDayId[3]), H: dStartDateTime.getHours(), m: dStartDateTime.getMinutes(), s: dStartDateTime.getSeconds()}}, "");
				dEndDateAfterDrop = new Date(dStartDateAfterDrop.getTime() + (dEndDateTime.getTime() - dStartDateTime.getTime()));

				if(to.tv.bChkDroppable)
				{
					$oElemDragged = $(to.elem).find("#" + sEventId + ".ui-draggable-dragging");
					sDroppableId = $oElemDragged.attr("data-droppableid");
					bEventEntered = to._findWhetherEventEnteredNonDroppableZone(dStartDateAfterDrop, dEndDateAfterDrop, bIsAllDay, iNumOfDays, sDroppableId);
					if(bEventEntered)
					{
						$oElemDragged.addClass("cCursorNotAllowed");
						$oElemDragged.find(".cEventLink").addClass("cCursorNotAllowed");
					}
					else
					{
						$oElemDragged.removeClass("cCursorNotAllowed");
						$oElemDragged.find(".cEventLink").removeClass("cCursorNotAllowed");
					}
				}

				$(to.elem).find(".cmvDay").removeClass("cActivatedCell");
				for(iElemIndex = 0; iElemIndex < iNumOfDays; iElemIndex++)
				{
					if(iElemIndex > 0)
					{
						dNextDate = new Date(dNextDate.getTime() + $.CalenStyle.extra.iMS.d);
						bNextDate = to.compareDates(dNextDate, to.tv.dVEDt);
					}
					if((iElemIndex === 0 || bNextDate <= 0) && to.__findWhetherDateIsVisibleInCurrentView(dNextDate, (bIsAllDay || iNumOfHours > 23), dStartDateTime, dEndDateTime))
					{
						sElemId = "#cmvDay" + "-" + dNextDate.getDate() + "-" + dNextDate.getMonth() + "-" + dNextDate.getFullYear();
						$(to.elem).find(sElemId).addClass("cActivatedCell");
					}
				}
			},

			drop: function(event, ui)
			{
				$oElemDragged = $(ui.draggable);
				sEventId = $oElemDragged.attr("id");
				sId = $oElemDragged.attr("data-id");
				oDraggedEvent = to.getEventWithId(sId);
				sEventClass = "." + "Event-" + sId;
				dStartDateTime = null; dEndDateTime = null; bIsAllDay = 0;

				if(oDraggedEvent.start !== null)
					dStartDateTime = oDraggedEvent.start;
				if(oDraggedEvent.end !== null)
					dEndDateTime = oDraggedEvent.end;
				if(oDraggedEvent.isAllDay !== null)
					bIsAllDay = oDraggedEvent.isAllDay;

				iArrNumOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dStartDateTime, dEndDateTime, true, false, true);
				iNumOfDays = iArrNumOfDays[0];
				iNumOfHours = iArrNumOfDays[1];

				sDayId = $(this).attr("id");
				sArrDayId = sDayId.split("-");

				dStartDateAfterDrop = to.setDateInFormat({"iDate": {d: parseInt(sArrDayId[1]), M: parseInt(sArrDayId[2]), y: parseInt(sArrDayId[3]), H: dStartDateTime.getHours(), m: dStartDateTime.getMinutes(), s: dStartDateTime.getSeconds()}}, "");
				dEndDateAfterDrop = new Date(dStartDateAfterDrop.getTime() + (dEndDateTime.getTime() - dStartDateTime.getTime()));

				if(to.tv.bChkDroppable)
				{
					$oElemDragged = $(to.elem).find("#" + sEventId + ".ui-draggable-dragging");
					sDroppableId = $oElemDragged.attr("data-droppableid");
					bEventEntered = to._findWhetherEventEnteredNonDroppableZone(dStartDateAfterDrop, dEndDateAfterDrop, bIsAllDay, iNumOfDays, sDroppableId);

					$oElemDragged.removeClass("cCursorNotAllowed");
					$oElemDragged.find(".cEventLink").removeClass("cCursorNotAllowed");
				}

				var iComp = to.compareDates(dEndDateTime, $.CalenStyle.extra.dToday);
				if(iComp >= 0)
					$(to.elem).find(sEventClass).removeClass("cEditingEventClone");
				else if(iComp < 0)
					$(to.elem).find(sEventClass).removeClass("cEditingEventClone").addClass("cBlurredEvent");

				if(to.tv.draggableParent === $(this).attr("id") || bEventEntered)
				{
					to.tv.iTSEndEditing = $.cf.getTimestamp();
					to.tv.bDroppedInDifferent = false;
					setTimeout(function()
					{
						var $oEventClone = $("#"+sEventId+".cEventClone");
						$("#"+sEventId).attr("style", $oEventClone.attr("style"));
						$(sEventClass).removeClass("cEditingEvent cEditingEventUI cEventBeingDragged");
						$oEventClone.remove();
					}, 300);
					return true;
				}

				to.tv.bDroppedInDifferent = true;

				var sEventContClass = "";
				if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
				{
					if(bIsAllDay === true || iNumOfHours> 23)
						sEventContClass += ".cmvEventContAllDay";
					else
						sEventContClass += ".cmvEventContSmall";
				}

				if(to.__updateEventWithId(sId, dStartDateAfterDrop, dEndDateAfterDrop))
				{
					$(to.elem).find(".cmvDisplayAllEvents").remove();
					$(to.elem).find(".cmvEvent").remove();
					$(to.elem).find(".cdmvEvent").remove();
					$(to.elem).find(".cHiddenEventsIndicator").remove();
					$(to.elem).find(".cHiddenEventsCont").remove();
					$(to.elem).find(".cmvDialog").remove();

					to._addEventsInMonthView(null);
					if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
						to._adjustEventsInMonthView();
				}
				$(to.elem).find(".cmvDay").removeClass("cActivatedCell");

				if(to.setting.saveChangesOnEventDrop)
					to.setting.saveChangesOnEventDrop.call(to, oDraggedEvent, dStartDateTime, dEndDateTime, dStartDateAfterDrop, dEndDateAfterDrop);

				to.tv.iTSEndEditing = $.cf.getTimestamp();
			}
		});

		if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
			to.adjustMonthTable();

		to.__parseData(bLoadAllData, function()
		{
			to._addEventsInMonthView(null);
			to.adjustMonthTable();

			to.__modifyFilterBarCallback();
		});
	},

	_addEventsInMonthView: function(oHiddenEventsDialog)
	{
		var to = this;
		var bEventsInDialog, oArrTempEvents, dDialogDayStart, dDialogDayEnd,
		dMonthStartDate = new Date($.CalenStyle.extra.dToday);
		dMonthStartDate.setDate(1);
		var bHideEventIcon = $.cf.isValid(to.setting.hideEventIcon[to.setting.visibleView]) ? to.setting.hideEventIcon[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventIcon.Default) ? to.setting.hideEventIcon.Default : false,
		bHideEventTime = $.cf.isValid(to.setting.hideEventTime[to.setting.visibleView]) ? to.setting.hideEventTime[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventTime.Default) ? to.setting.hideEventTime.Default : false,
		sEventTimeFormat = to.setting.is24Hour ? "HH:mm" : "h[:m]sm",
		iNoBsDays = to.setting.excludeNonBusinessHours ? to.tv.iBsDays : 7;

		if($.cf.isValid(oHiddenEventsDialog) && oHiddenEventsDialog.oArrEvents.length > 0)
		{
			bEventsInDialog = true;
			oArrTempEvents = oHiddenEventsDialog.oArrEvents;
			dDialogDayStart = oHiddenEventsDialog.dDayStart;
			dDialogDayEnd = oHiddenEventsDialog.dDayEnd;
		}
		else
		{
			if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
				$(to.elem).find(".cdmvEventContMain").html("");

			oArrTempEvents = to.getArrayOfEventsForView(to.tv.dVSDt, to.tv.dVEDt);

			to.tv.bAWkRw = [];
			for(var iTempIndex = 0; iTempIndex < 6; iTempIndex++)
			{
				var oArrTempRow = [];
				for(var iRowIndex = 0; iRowIndex < (to.tv.iMxEvRw - 1); iRowIndex++)
				{
					oArrTempRow.push(new Array(0, 0, 0, 0, 0, 0, 0));
				}

				to.tv.bAWkRw.push(oArrTempRow);
			}
		}

		if(oArrTempEvents.length > 0)
		{
			// DetailedMonthView
			var iEventHeightForAllEvents = $.CalenStyle.extra.iEventHeights[to.setting.visibleView],
			sTooltipEventClass = "",

			// MonthView
			iDayWidth = $(to.elem).find(".cmvTableColumn0").width(),
			iHeightOfAllDayEvents = to._getHeightForAllDayEventInMonthView(),
			iHeightOfSmallEvents = to._getHeightForSmallEventInMonthView(),
			iMarginForSmallEvent = to._getMarginValueForSmallEventInMonthView(),
			sMarginForSmallEvent = iMarginForSmallEvent + "px" + " " + iMarginForSmallEvent+ "px";

			for(var iEventIndex = 0; iEventIndex < oArrTempEvents.length; iEventIndex++)
			{
				var oEvent = oArrTempEvents[iEventIndex],
				dStartDateTime = null, dEndDateTime = null, bIsAllDay = 0,
				sTitle = "", sDesc = "", sType = "", sURL = "",
				bIsMarked = false,
				bDragNDrop = false,
				sDroppableId = "",
				sId = "Event-" + oEvent.calEventId;

				if(oEvent.start !== null)
					dStartDateTime = oEvent.start;

				if(oEvent.end !== null)
					dEndDateTime = oEvent.end;

				if(oEvent.isAllDay !== null)
					bIsAllDay = oEvent.isAllDay;

				if(oEvent.title !== null)
					sTitle = oEvent.title;

				if(oEvent.desc !== null)
					sDesc = oEvent.desc;

				if(oEvent.type !== null)
					sType = oEvent.type;

				if(oEvent.url !== null)
					sURL = oEvent.url;

				if(oEvent.droppableId !== null)
					sDroppableId = oEvent.droppableId;

				if(oEvent.isDragNDropInMonthView !== null)
					bDragNDrop = oEvent.isDragNDropInMonthView;

				if(oEvent.isMarked !== null)
					bIsMarked = oEvent.isMarked;

				if(bIsMarked)
					bIsAllDay = true;

				var iArrTempNum = to.getNumberOfDaysOfEvent(bIsAllDay, dStartDateTime, dEndDateTime, true, true, true),
				iNumOfEventElements = iArrTempNum[0],
				iNumberOfHours = iArrTempNum[1];

				if(iNumOfEventElements > 0)
				{
					var sDayId = "", $oDay,
					iNumOfSegs = iNumOfEventElements, iNumOfDays, sPartialEvent = "", iNumberOfHrs = 0,
					dTempStartDateTime = new Date(dStartDateTime),
					dTempEndDateTime = new Date(dEndDateTime),
					dTempSDT, dTemp, iDateIndex, sArrDateTime, sEventColor, sEventBorderColor, sEventTextColor, sNonAllDayEventTextColor,
					sColorStyle = "", sEventIconStyle = "", sEventIconDotStyle = "", sLinkStyle = "", sStyle = "",
					sPartialEventStyle = "",
					sIcon, sEventClass, oEventTooltip, sDateTime, sTemplate, sIdElem, $oSeg, $oSegContent,
					sEventTitle, sEventContent, iArrNumOfDays, bActualStartDate,
					sDataDroppableId, bLeftPartial = false, bRightPartial = false,
					bAddedHidden = false, bAddedLessElems = false, iAddedElemsLength = 0;

					if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
					{
						sTooltipEventClass = ".cdmvEvent";

						if(bEventsInDialog)
						{
							if(to.compareDates(dStartDateTime, dDialogDayStart) < 0 && Math.abs(to.__getDifference("m", dDialogDayStart, dStartDateTime)) > 1)
							{
								bLeftPartial = true;
								sPartialEvent = "Left";
								dTempStartDateTime = new Date(dDialogDayStart);
							}
							if(to.compareDates(dDialogDayEnd, dEndDateTime) < 0 && Math.abs(to.__getDifference("m", dDialogDayEnd, dEndDateTime)) > 1)
							{
								bRightPartial = true;
								sPartialEvent = "Right";
								dTempEndDateTime = new Date(dDialogDayEnd);
							}
							sDayId = "#cmvDay" + "-" + dDialogDayStart.getDate() + "-" + dDialogDayStart.getMonth() + "-" + dDialogDayStart.getFullYear();
						}
						else
						{
							if(to.compareDates(dStartDateTime, to.tv.dVSDt) < 0 && Math.abs(to.__getDifference("m", to.tv.dVSDt, dStartDateTime)) > 1)
							{
								sPartialEvent = "Left";
								dTempStartDateTime = new Date(to.tv.dVSDt);
							}
							if(to.compareDates(to.tv.dVEDt, dEndDateTime) < 0 && Math.abs(to.__getDifference("m", to.tv.dVEDt, dEndDateTime)) > 1)
							{
								sPartialEvent = "Right";
								dTempEndDateTime = new Date(to.tv.dVEDt);
							}

							dTempSDT = new Date(dTempStartDateTime);
							bActualStartDate = true;
							while(!to.__findWhetherDateIsVisibleInCurrentView(dTempSDT, (bIsAllDay || iNumberOfHours > 23), dTempStartDateTime, dTempEndDateTime))
							{
								dTempSDT.setDate(dTempSDT.getDate() + 1);
								bActualStartDate = false;
								if(to.compareDates(dTempSDT, dTempEndDateTime) > 0)
									break;
							}
							dTempStartDateTime = new Date(dTempSDT);
							sDayId = "#cmvDay" + "-" + dTempStartDateTime.getDate() + "-" + dTempStartDateTime.getMonth() + "-" + dTempStartDateTime.getFullYear();
						}

						iArrNumOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dTempStartDateTime, dTempEndDateTime, true, true, bActualStartDate);
						iNumOfDays = iArrNumOfDays[0];
						iNumOfSegs = iArrNumOfDays[0];
						iNumberOfHrs = iArrNumOfDays[1];

						if(iNumberOfHrs > 0)
						{
							sEventClass = "cdmvEvent ";

							sEventColor = oEvent.backgroundColor;
							sEventColor = (!$.cf.isValid(sEventColor) || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;
							sEventBorderColor = oEvent.borderColor || $.cf.addHashToHexcode(to.setting.borderColor);
							sEventBorderColor = (!$.cf.isValid(sEventBorderColor) || $.cf.compareStrings(sEventBorderColor, "transparent")) ? "transparent" : sEventBorderColor;
							sEventTextColor = oEvent.textColor || $.cf.addHashToHexcode(to.setting.textColor);
							sEventTextColor = (!$.cf.isValid(sEventTextColor) || $.cf.compareStrings(sEventTextColor, "transparent")) ? $.cf.addHashToHexcode(to.setting.textColor) : sEventTextColor;
							sNonAllDayEventTextColor = $.cf.isValid(oEvent.nonAllDayEventsTextColor) ? oEvent.nonAllDayEventsTextColor : oEvent.backgroundColor;
							sNonAllDayEventTextColor = (!$.cf.isValid(sNonAllDayEventTextColor) || $.cf.compareStrings(sNonAllDayEventTextColor, "transparent")) ? oEvent.backgroundColor : sNonAllDayEventTextColor;

							if(bIsAllDay === true || iNumberOfHours > 23)
							{
								if(bIsMarked)
								{
									if(oEvent.fromSingleColor)
									{
										sColorStyle += "background: " + sEventColor + "; ";
										sColorStyle += "border-color: " + sEventBorderColor + "; ";
										sColorStyle += "color: " + sEventTextColor + "; ";
										sLinkStyle += "color: " + sEventTextColor + "; ";
										sEventIconStyle = "background: " + sEventTextColor + "; color: #FFFFFF";
										sEventIconDotStyle = "background: " + sEventTextColor + "; ";
									}
									else
									{
										sEventBorderColor = sEventColor;

										sColorStyle += "background: " + $.cf.getRGBAString(sEventColor, 0.1) + "; ";
										sColorStyle += "border-color: " + sEventBorderColor + "; ";
										sColorStyle += "color: " + sEventColor + "; ";
										sLinkStyle += "color: " + sEventColor + "; ";
										sEventIconStyle = "background: " + sEventColor + "; color: " + sEventTextColor;
										sEventIconDotStyle = "background: " + sEventColor + "; ";
									}
								}
								else
								{
									sColorStyle += "background: " + sEventColor + "; ";
									sColorStyle += "border-color: " + sEventBorderColor + "; ";
									sColorStyle += "color: " + sEventTextColor + "; ";
									sLinkStyle += "color: " + sEventTextColor + "; ";
									sEventIconStyle = "color: " + sEventTextColor + "; ";
									sEventIconDotStyle = "background: " + sEventTextColor + "; ";
								}
							}
							else
							{
								if(to.setting.onlyTextForNonAllDayEvents)
								{
									sEventClass += "cEventOnlyText ";

									sColorStyle += "color: " + sNonAllDayEventTextColor + "; ";
									sColorStyle += "border-color: transparent; ";
									iNumOfSegs = 1;
									sPartialEvent = "";
									sLinkStyle += "color: " + sNonAllDayEventTextColor + "; ";
									sEventIconStyle = "color: " + sNonAllDayEventTextColor + "; ";
									sEventIconDotStyle = "background: " + sNonAllDayEventTextColor + "; ";
								}
								else
								{
									sColorStyle += "background: " + sEventColor + "; ";
									sColorStyle += "border-color: " + sEventBorderColor + "; ";
									sColorStyle += "color: " + sEventTextColor + "; ";
									sLinkStyle += "color: " + sEventTextColor + "; ";
									sEventIconStyle = "color: " + sEventTextColor + "; ";
									sEventIconDotStyle = "background: " + sEventTextColor + "; ";
								}
							}
							sPartialEventStyle = "border-color: " + (oEvent.fromSingleColor ? sEventTextColor : "#000000");

							if(bIsMarked)
								sIcon = ($.cf.isValid(oEvent.icon) && oEvent.icon !== "Dot") ? oEvent.icon : "cs-icon-Mark";
							else
								sIcon = $.cf.isValid(oEvent.icon) ? oEvent.icon : to.setting.eventIcon;

							if(to.compareDates(dEndDateTime, dMonthStartDate) < 0)
								sEventClass += "cBlurredEvent ";
							if(bDragNDrop)
								sEventClass += "EventDraggable cDragNDrop ";
							if(to.setting.isTooltipInMonthView)
								sEventClass += "cEventTooltip ";
							sEventClass += sId;
							if(bIsMarked)
								sEventClass += " cMarkedDayEvent";

							sEventTitle = sTitle;
							sEventContent = sDesc;

							var $oRow = $(to.elem).find(sDayId).parent(),
							sRow = $oRow.attr("id"),
							iRow = parseInt(sRow.replace("cmvMonthTableRow", "")) - 1,
							iColumn = $(to.elem).find(sDayId).index(),
							sHeight, sPartialClass;

							if(to.setting.displayWeekNumInMonthView)
								iColumn--;

							if(bEventsInDialog)
							{
								iTableRowIndex = 0;
								iEventRow = iEventIndex;
								iEventColumn = 0;
								iEventLengthInRow = 1;
								sEventSegId = sId + "-Hidden";

								sName = iTableRowIndex + "|" + (iEventRow + 1) + "|" + iEventColumn + "|" + iEventLengthInRow;

								sHeight = iEventHeightForAllEvents + "px";
								sStyle = sColorStyle;
								sStyle += "height: " + sHeight + "; ";
								if(sEventBorderColor === "transparent")
									sStyle += "border-width: 0px; ";

								sEventClass += " cHiddenEvent";

								sDataDroppableId = $.cf.isValid(sDroppableId) ? "data-droppableid='" + sDroppableId + "'" : "";

								sTemplate = "<div id='" + sEventSegId + "' class='" + sEventClass + "' style='" + sStyle + "'  data-pos='" + sName + "' " + sDataDroppableId + " title='' data-id='" + oEvent.calEventId + "'>";

								sTemplate += "<a class='cEventLink' style='" + sLinkStyle + "'>";

								sPartialClass = "";
								if(bRightPartial && bLeftPartial)
								{
									sPartialClass = "cPartialEvent";
									sTemplate += "<span class='" + sPartialClass + " cPartialEventLeft' style='" + sPartialEventStyle + "'></span>";
									sTemplate += "<span class='" + sPartialClass + " cPartialEventRight' style='" + sPartialEventStyle + "'></span>";
								}
								else if(bRightPartial || bLeftPartial)
								{
									sPartialClass = "cPartialEvent";
									if(bLeftPartial)
										sPartialClass += " cPartialEventLeft";
									if(bRightPartial)
										sPartialClass += " cPartialEventRight";

									sTemplate += "<span class='" + sPartialClass + "' style='" + sPartialEventStyle + "'></span>";
								}

								if(bIsMarked)
								{
									sTemplate += "<span class='cdmvEventTitle'>" + sTitle + "</span>";

									//if(!bHideEventIcon && !$.cf.compareStrings(sIcon, "Dot"))
										sTemplate += "<span class='cdmvEventIcon "+sIcon+"' style='" + sEventIconStyle + "'></span>";
								}
								else
								{
									if(!bHideEventTime && bIsAllDay === false && (iNumOfEventElements === 1 || (iNumOfEventElements > 1 && !bLeftPartial && bRightPartial)))
										sTemplate += "<span class='cdmvEventTime'>" + to.getDateInFormat({"date": dStartDateTime}, sEventTimeFormat, to.setting.is24Hour, true) + "</span>";

									if(!bHideEventTime && bIsAllDay === false && (iNumOfEventElements === 1 || (iNumOfEventElements > 1 && bLeftPartial && !bRightPartial)))
										sTemplate += "<span class='cdmvEventTimeRight'>" + to.getDateInFormat({"date": dEndDateTime}, sEventTimeFormat, to.setting.is24Hour, true) + "</span>";

									if(!bHideEventIcon && !$.cf.compareStrings(sIcon, "Dot"))
										sTemplate += "<span class='cdmvEventIcon "+sIcon+"' style='" + sEventIconStyle + "'></span>";

									sTemplate += "<span class='cdmvEventTitle'>" + sTitle + "</span>";
								}

								sTemplate += "</a>";

								sTemplate += "</div>";

								$(to.elem).find(".cHiddenEventsCont").append(sTemplate);

								sIdElem = "#"+sEventSegId;
								$oSeg = $(to.elem).find(sIdElem);
								$oSegContent = $oSeg.find(".cEventLink");
								oEventTooltip = {};
								sDateTime = to.getEventDateTimeString(dStartDateTime, dEndDateTime, bIsAllDay, "&&");
								sArrDateTime = sDateTime.split("&&");
								oEventTooltip.title = sTitle;
								oEventTooltip.startDateTime = sArrDateTime[0];
								oEventTooltip.endDateTime = sArrDateTime[1];
								$oSeg.data("tooltipcontent", oEventTooltip);

								if(to.setting.eventRendered)
									to.setting.eventRendered.call(to, oEvent, $oSeg, $oSegContent, to.setting.visibleView, true);

								if($.cf.isValid(sURL) || to.setting.eventClicked)
								{
									$oSegContent.on($.CalenStyle.extra.sClickHandler, {"url": sURL, "eventId": oEvent.calEventId, "eventElemSelector": sIdElem, "view": "MonthView", "pluginId": to.tv.pluginId}, to.__bindClick);
								}
							}
							else
							{
								var iAddedDays = 0, iEventSegIndex = 0, sName;

								for(var iTableRowIndex = iRow; iTableRowIndex < to.tv.bAWkRw.length; iTableRowIndex++)
								{
									sId = "Event-" + oEvent.calEventId;

									var bArrCurrentRow = to.tv.bAWkRw[iTableRowIndex],
									iEventRow = -1;
									bLeftPartial = false; bRightPartial = false;

									if($.cf.compareStrings(sPartialEvent, "Left"))
										bLeftPartial = (iAddedDays > 0) ? false : true;

									if($.cf.compareStrings(sPartialEvent, "Right"))
										bRightPartial = true;

									if(iAddedDays < iNumOfSegs)
									{
										var iEventColumn = (iAddedDays > 0 && !bAddedHidden && !bAddedLessElems) ? 0 : iColumn,
										iEventLengthInRow = (iNumOfSegs - iAddedDays),
										iEventLengthInWeek = ((to.setting.excludeNonBusinessHours) ? to.tv.iBsDays : 7) - iEventColumn;

										bAddedHidden = false;
										bAddedLessElems = false;
										iAddedElemsLength = 0;

										if(iEventLengthInRow > iEventLengthInWeek)
										{
											iEventLengthInRow = iEventLengthInWeek;
											bRightPartial = true;
										}
										if(iAddedDays > 0)
											bLeftPartial = true;

										var iMaxColumn = iEventColumn + iEventLengthInRow;
										var bInnerRow, iTempIndex2, iTempIndex3, iTempEventLengthInRow;
										for(iTempIndex2 = 0; iTempIndex2 < bArrCurrentRow.length; iTempIndex2++)
										{
											bInnerRow = bArrCurrentRow[iTempIndex2];

											if(iEventRow !== -1)
												break;

											iTempEventLengthInRow = 0;
											for(iTempIndex3 = iEventColumn; iTempIndex3 < iMaxColumn; iTempIndex3++)
											{
												if(bInnerRow[iTempIndex3] === 0 && iTempEventLengthInRow < iEventLengthInRow)
												{
													if(to.setting.hideExtraEvents)
													{
														if(iTempIndex3 === iEventColumn)
															iTempEventLengthInRow++;
														else if(iTempEventLengthInRow > 0)
															iTempEventLengthInRow++;
													}
													else
														iTempEventLengthInRow++;

													if(iTempEventLengthInRow === iEventLengthInRow)
													{
														iEventRow = iTempIndex2;
														break;
													}
												}
												else
												{
													if(to.setting.hideExtraEvents)
														break;
												}
											}

											if(to.setting.hideExtraEvents && (iTempEventLengthInRow > 0) && (iTempEventLengthInRow < iEventLengthInRow))
											{
												iEventRow = iTempIndex2;
												bRightPartial = true;
												bAddedLessElems = true;
												iAddedElemsLength = iTempEventLengthInRow;

											}
										}

										iEventColumn = (iEventColumn > (iNoBsDays - 1)) ? (iNoBsDays - 1) : iEventColumn;

										if((to.setting.hideExtraEvents && iEventRow !== -1) || !to.setting.hideExtraEvents)
										{
											if(iEventRow === -1)
											{
												bArrCurrentRow.push([0, 0, 0, 0, 0, 0, 0]);
												iEventRow = bArrCurrentRow.length - 1;
											}

											bInnerRow = bArrCurrentRow[iEventRow];

											var sEventSegId = sId + "-" + (++iEventSegIndex);

											//--------------------------- Add Event Start -----------------------------

											sName = iTableRowIndex + "|" + (iEventRow + 1) + "|" + iEventColumn + "|" + (bAddedLessElems ? iAddedElemsLength : iEventLengthInRow);

											sHeight = iEventHeightForAllEvents + "px";
											sStyle = sColorStyle;
											sStyle += "height: " + sHeight + "; ";

											if(sEventBorderColor === "transparent")
												sStyle += "border-width: 0px; ";

											sDataDroppableId = $.cf.isValid(sDroppableId) ? "data-droppableid='" + sDroppableId + "'" : "";

											sTemplate = "<div id='" + sEventSegId + "' class='" + sEventClass + "' style='" + sStyle + "'  data-pos='" + sName + "' " + sDataDroppableId + " title='' data-id='" + oEvent.calEventId + "'>";

											sTemplate += "<a class='cEventLink' style='" + sLinkStyle + "'>";

											sPartialClass = "";
											if(bRightPartial && bLeftPartial)
											{
												sPartialClass = "cPartialEvent";
												sTemplate += "<span class='" + sPartialClass + " cPartialEventLeft' style='" + sPartialEventStyle + "'></span>";
												sTemplate += "<span class='" + sPartialClass + " cPartialEventRight' style='" + sPartialEventStyle + "'></span>";
											}
											else if(bRightPartial || bLeftPartial)
											{
												sPartialClass = "cPartialEvent";
												if(bLeftPartial)
													sPartialClass += " cPartialEventLeft";
												if(bRightPartial)
													sPartialClass += " cPartialEventRight";

												sTemplate += "<span class='" + sPartialClass + "' style='" + sPartialEventStyle + "'></span>";
											}

											if(bIsMarked)
											{
												sTemplate += "<span class='cdmvEventTitle'>" + sTitle + "</span>";

												//if(!bHideEventIcon && !$.cf.compareStrings(sIcon, "Dot"))
													sTemplate += "<span class='cdmvEventIcon "+sIcon+"' style='" + sEventIconStyle + "'></span>";
											}
											else
											{
												if(!bHideEventTime && bIsAllDay === false && ((iEventSegIndex === 1 && !bLeftPartial && iNumOfEventElements > 1) || iNumOfEventElements === 1))
													sTemplate += "<span class='cdmvEventTime'>" + to.getDateInFormat({"date": dStartDateTime}, sEventTimeFormat, to.setting.is24Hour, true) + "</span>";

												if(!bHideEventTime && bIsAllDay === false && (iNumOfSegs > 1 || (bAddedLessElems ? iAddedElemsLength : iEventLengthInRow) > 1 || iNumberOfHours > 23) && !bRightPartial)
													sTemplate += "<span class='cdmvEventTimeRight'>" + to.getDateInFormat({"date": dEndDateTime}, sEventTimeFormat, to.setting.is24Hour, true) + "</span>";

												if(!bHideEventIcon && !$.cf.compareStrings(sIcon, "Dot"))
													sTemplate += "<span class='cdmvEventIcon "+sIcon+"' style='" + sEventIconStyle + "'></span>";

												sTemplate += "<span class='cdmvEventTitle'>" + sTitle + "</span>";
											}

											sTemplate += "</a>";

											sTemplate += "</div>";

											$(to.elem).find(".cdmvEventContMain").append(sTemplate);

											sIdElem = "#"+sEventSegId;
											$oSeg = $(to.elem).find(sIdElem);
											$oSegContent = $oSeg.find(".cEventLink");
											oEventTooltip = {};
											sDateTime = to.getEventDateTimeString(dStartDateTime, dEndDateTime, bIsAllDay, "&&");
											sArrDateTime = sDateTime.split("&&");
											oEventTooltip.title = sTitle;
											oEventTooltip.startDateTime = sArrDateTime[0];
											oEventTooltip.endDateTime = sArrDateTime[1];
											$oSeg.data("tooltipcontent", oEventTooltip);

											if(to.setting.eventRendered)
												to.setting.eventRendered.call(to, oEvent, $oSeg, $oSegContent, to.setting.visibleView, false);

											if($.cf.isValid(sURL) || to.setting.eventClicked)
												$oSegContent.on($.CalenStyle.extra.sClickHandler, {"url": sURL, "eventId": oEvent.calEventId, "eventElemSelector": sIdElem, "view": "MonthView", "pluginId": to.tv.pluginId}, to.__bindClick);

											if(bIsMarked)
											{
												$oDay = $(to.elem).find(sDayId);

												dTemp = new Date(dTempStartDateTime);
												for(iDateIndex = 0; iDateIndex < iNumOfDays; iDateIndex++)
												{
													if(iDateIndex > 0)
													{
														dTemp.setDate(dTemp.getDate() + 1);
														sDayId = "#cmvDay" + "-" + dTemp.getDate() + "-" + dTemp.getMonth() + "-" + dTemp.getFullYear();
														$oDay = $(to.elem).find(sDayId);
													}

													if($oDay.find(".cMarkedDayIndicator").length === 0)
														$oDay.append("<span class='cMarkedDayIndicator cs-icon-Mark'></span>");

													if($.cf.isValid(sEventColor))
													{
														if(oEvent.fromSingleColor)
															$oDay.css({"background": sEventColor});
														else
															$oDay.css({"background": $.cf.getRGBAString(sEventColor, 0.1)});
													}
												}
											}

											//--------------------------- Add Event End -----------------------------

											if(to.setting.hideExtraEvents)
											{
												var iMaxElemIndex = iEventColumn + (bAddedLessElems ? iAddedElemsLength : iEventLengthInRow);
												for(iTempIndex3 = iEventColumn; iTempIndex3 < iMaxElemIndex; iTempIndex3++)
												{
													bInnerRow[iTempIndex3] = 1;
													iAddedDays++;
												}

												if(bAddedLessElems)
													iTableRowIndex--;

												dTempStartDateTime = new Date(dTempStartDateTime.getTime() +  ((iMaxElemIndex - iEventColumn) * $.CalenStyle.extra.iMS.d));
												sDayId = "#cmvDay" + "-" + dTempStartDateTime.getDate() + "-" + dTempStartDateTime.getMonth() + "-" + dTempStartDateTime.getFullYear();
												iColumn = $(to.elem).find(sDayId).index();
											}
											else
											{
												for(iTempIndex3 = iEventColumn; iTempIndex3 < iMaxColumn; iTempIndex3++)
												{
													bInnerRow[iTempIndex3] = 1;
													iAddedDays++;
												}
											}
										}
										else
										{
											var $oCDMVEvContM = $(to.elem).find(".cdmvEventContMain"),
											dDayStart = to.setDateInFormat({"date": dTempStartDateTime}, "START"),
											dDayEnd = to.setDateInFormat({"date": dTempStartDateTime}, "END"),
											iEventLength = to.getEventCountAndIsMarkedDay(dDayStart, dDayEnd)[0],
											sDateId = dDayStart.getDate() + "-" + dDayStart.getMonth() + "-" + dDayStart.getFullYear();
											sId = "HiddenEvents-" + sDateId;
											var iExtraEventCount = iEventLength - bArrCurrentRow.length,
											sExtraEventCount = to.getNumberStringInFormat(iExtraEventCount, 0, true),
											$oDateDay = $(to.elem).find("#cmvDay-" + sDateId),
											sDateRow = $oDateDay.closest('.cmvMonthTableRows').index(),
											sDateColumn = $oDateDay.index();

											sDateColumn = to.setting.displayWeekNumInMonthView ? (sDateColumn - 1) : sDateColumn;
											sName = sDateRow + "|" + (bArrCurrentRow.length + 1) + "|" + sDateColumn + "|" + 1;

											if($oCDMVEvContM.find("#"+sId).length === 0 && iExtraEventCount > 0)
											{
												var sEventOverflow = "<span class='cHiddenEventsIndicator clickableLink' id='" + sId + "' data-pos='" + sName + "'>";
												sEventOverflow += to.setting.hiddenEventsIndicatorLabel.replace("(count)", sExtraEventCount);
												sEventOverflow += "</span>";

												$oCDMVEvContM.append(sEventOverflow);
											}
											else
												$oCDMVEvContM.find("#"+sId).html(to.setting.hiddenEventsIndicatorLabel.replace("(count)", sExtraEventCount));

											iAddedDays++;

											if(iEventColumn !== (iNoBsDays - 1))
											{
												bAddedHidden = true;
												iTableRowIndex--;
											}

											dTempStartDateTime = new Date(dTempStartDateTime.getTime() + $.CalenStyle.extra.iMS.d);
											sDayId = "#cmvDay" + "-" + dTempStartDateTime.getDate() + "-" + dTempStartDateTime.getMonth() + "-" + dTempStartDateTime.getFullYear();
											iColumn = $(to.elem).find(sDayId).index();
										}
									}
									else
										break;
								}
							}
						}
					}
					else if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
					{
						sTooltipEventClass = ".cmvEvent";

						var iEventElemTopPosition = 0,
						bShowDetails = 0;

						if(to.compareDates(dStartDateTime, to.tv.dVSDt) < 0)
						{
							sPartialEvent = "Left";
							dTempStartDateTime = new Date(to.tv.dVSDt);
						}
						if(to.compareDates(to.tv.dVEDt, dEndDateTime) < 0)
						{
							sPartialEvent = "Right";
							dTempEndDateTime = new Date(to.tv.dVEDt);
						}

						dTempSDT = new Date(dTempStartDateTime);
						bActualStartDate = true;
						while(!to.__findWhetherDateIsVisibleInCurrentView(dTempSDT, (bIsAllDay || iNumberOfHours > 23), dTempStartDateTime, dTempEndDateTime))
						{
							dTempSDT.setDate(dTempSDT.getDate() + 1);
							bActualStartDate = false;
							if(to.compareDates(dTempSDT, dTempEndDateTime) > 0)
								break;
						}
						dTempStartDateTime = new Date(dTempSDT);

						iArrNumOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dTempStartDateTime, dTempEndDateTime, true, false, bActualStartDate);
						iNumOfSegs = iArrNumOfDays[0];
						iNumberOfHrs = iArrNumOfDays[1];

						sEventColor = oEvent.fromSingleColor ? oEvent.textColor : oEvent.backgroundColor;
						sEventColor = ($.cf.compareStrings(sEventColor, "") || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;

						if(bIsMarked)
						{
							dTemp = new Date(dTempStartDateTime);
							for(iDateIndex = 0; iDateIndex < iNumOfSegs; iDateIndex++)
							{
								if(iDateIndex > 0)
									dTemp.setDate(dTemp.getDate() + 1);

								sDayId = "#cmvDay" + "-" + dTemp.getDate() + "-" + dTemp.getMonth() + "-" + dTemp.getFullYear();
								$oDay = $(to.elem).find(sDayId);

								if($.cf.isValid(sEventColor))
									$oDay.css({"background": $.cf.getRGBAString(sEventColor, 0.1)});
							}
						}
						else
						{
							if(!(bIsAllDay === true || iNumberOfHrs > 23))
							{
								sPartialEvent = "";
								iNumOfSegs = 1;
							}

							var dThisDate = new Date(dTempStartDateTime),
							iThisDate = dThisDate.getTime();

							for(var iEventElem = 1; iEventElem <= iNumOfSegs; iEventElem++)
							{
								if(to.__findWhetherDateIsVisibleInCurrentView(dThisDate, (bIsAllDay || iNumberOfHours > 23), dTempStartDateTime, dTempEndDateTime))
								{
									sDayId = "#cmvDay" + "-" + dThisDate.getDate() + "-" + dThisDate.getMonth() + "-" + dThisDate.getFullYear();

									var isFirstDay = false;
									if(iEventElem === 1)
										isFirstDay = true;

									if(to.setting.displayEventsInMonthView)
									{
										sEventClass = "cmvEvent ";
										if(bIsAllDay === true || iNumberOfHours > 23)
										{
											sEventClass += "cmvEventAllDay ";
											if(to.compareDates(dThisDate, dStartDateTime) === 0 && iNumOfSegs === 1)
												sEventClass += "cmvEventAllDaySingle ";
											else if(to.compareDates(dThisDate, dStartDateTime) === 0)
												sEventClass += "cmvEventAllDayFirst ";
											else if(to.compareDates(dThisDate, dEndDateTime) === 0)
												sEventClass += "cmvEventAllDayLast ";
											else
												sEventClass += "cmvEventAllDayMiddle ";
										}
										else
											sEventClass += "cmvEventSmall ";

										if(to.compareDates(dEndDateTime, dMonthStartDate) < 0)
											sEventClass += ("cBlurredEvent ");
										if(bDragNDrop)
											sEventClass += ("EventDraggable cDragNDrop ");
										if(to.setting.isTooltipInMonthView)
											sEventClass += ("cEventTooltip ");
										sEventClass += sId;

										sEventTitle = sTitle;
										sEventContent = sDesc;

										if(bIsAllDay === 1 || bIsAllDay === true || iNumberOfHours > 23)
										{
											if(isFirstDay)
											{
												var iTopPosition;
												var oArrChildren = $(to.elem).find(".cmvMonthTableMain "+sDayId+" .cmvEventCont .cmvEventContAllDay").children();

												var iArrTopPositions = [];
												for(var iChildElem = 0; iChildElem < oArrChildren.length; iChildElem++)
													iArrTopPositions.push($(to.elem).find(oArrChildren[iChildElem]).position().top);

												var iAllDayEventHeight = to._getHeightForAllDayEventInMonthView(),
												iSpaceBetweenEvents = 2;
												iTopPosition = iSpaceBetweenEvents;
												var iTopPositionIncrements = iAllDayEventHeight + iSpaceBetweenEvents;
												if(iArrTopPositions.length > 0 && bShowDetails === 0)
												{
													if(iArrTopPositions.length < 2)
													{
														while(to._arrayContains(iArrTopPositions, iTopPosition) === 1)
															iTopPosition += iTopPositionIncrements;
													}
													else
														bShowDetails = 1;
												}
												iEventElemTopPosition = iTopPosition;
											}
										}
										else
										{
											var iMaxNumberOfElements = Math.floor(iDayWidth / (iHeightOfSmallEvents + iMarginForSmallEvent)) - 1,
											iNumberOfElements = $(to.elem).find(".cmvMonthTableMain "+sDayId+" .cmvEventCont .cmvEventContSmall").children().length;
											if(iNumberOfElements >= iMaxNumberOfElements)
												bShowDetails = 1;
										}

										if(bShowDetails === 0)
										{
											sStyle = "background: " + sEventColor + "; ";

											sStyle += " top: " + iEventElemTopPosition + "px;";
											if(bIsAllDay === true || iNumberOfHours > 23)
												sStyle += " height: " + iHeightOfAllDayEvents + "px;";
											else
												sStyle += " height: " + iHeightOfSmallEvents + "px; width: " + iHeightOfSmallEvents + "px; margin: " + sMarginForSmallEvent + ";";

											oEventTooltip = {};
											sDateTime = to.getEventDateTimeString(dStartDateTime, dEndDateTime, bIsAllDay, "&&");
											sArrDateTime = sDateTime.split("&&");
											oEventTooltip.title = sTitle;
											oEventTooltip.startDateTime = sArrDateTime[0];
											oEventTooltip.endDateTime = sArrDateTime[1];

											sDataDroppableId = $.cf.isValid(sDroppableId) ? "data-droppableid='" + sDroppableId + "'" : "";

											sTemplate = "<span id='" + sId + "' class='" + sEventClass + "' style='" + sStyle + "' " + sDataDroppableId + " title='' data-id='" + oEvent.calEventId + "'>";
											sTemplate += "</span>";

											if(bIsAllDay === true || iNumberOfHours > 23)
												$(to.elem).find(".cmvMonthTableMain "+sDayId+" .cmvEventCont .cmvEventContAllDay").append(sTemplate);
											else
												$(to.elem).find(".cmvMonthTableMain "+sDayId+" .cmvEventCont .cmvEventContSmall").append(sTemplate);
										}
									}
								}
								iThisDate = iThisDate + $.CalenStyle.extra.iMS.d;
								dThisDate.setTime(iThisDate);
							}

							sIdElem = "."+sId;
							oEventTooltip = {};
							sDateTime = to.getEventDateTimeString(dStartDateTime, dEndDateTime, bIsAllDay, "&&");
							sArrDateTime = sDateTime.split("&&");
							oEventTooltip.title = sTitle;
							oEventTooltip.startDateTime = sArrDateTime[0];
							oEventTooltip.endDateTime = sArrDateTime[1];
							$(to.elem).find(sIdElem).data("tooltipcontent", oEventTooltip);

							$(to.elem).find(sIdElem).on($.CalenStyle.extra.sClickHandler, {"url": sURL, "eventId": oEvent.calEventId, "eventElemSelector": sIdElem, "view": "MonthView", "pluginId": to.tv.pluginId}, to.__bindClick);
						}
					}
				}
			}

			if(bEventsInDialog)
			{
				if(to.setting.isTooltipInMonthView)
					to._addTooltipInMonthView(".cEventTooltip.cHiddenEvent");
				if(to.setting.isDragNDropInMonthView)
					to._makeEventDraggableInMonthView(".EventDraggable.cHiddenEvent");
			}
			else
			{
				if(!$.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "ChangeDate"))
					to._displayEventOnDayClickInMonthView();

				if(to.setting.hideExtraEvents)
					to._hiddenEventsIndicatorActionHandler();

				if(to.setting.displayEventsInMonthView)
				{
					if(to.setting.isTooltipInMonthView)
						to._addTooltipInMonthView(".cEventTooltip");
					if(to.setting.isDragNDropInMonthView)
						to._makeEventDraggableInMonthView(".EventDraggable");
				}

				if(to.setting.datePickerObject !== null)
					to.setting.datePickerObject.refreshView();
				if(to.setting.eventsAddedInView)
					to.setting.eventsAddedInView.call(to, to.setting.visibleView, sTooltipEventClass);
			}
		}
		else
			console.log("to._addEventsInMonthView - No Events");

		to.addRemoveViewLoader(false, "cEventLoaderBg");
		to.addRemoveLoaderIndicators(false, "cEventLoaderIndicator");
	},

	_hiddenEventsIndicatorActionHandler: function()
	{
		var to = this;

		$(to.elem).find(".cHiddenEventsIndicator").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();

			var $oHiddenEventsIndicator = $(this),
			sHiddenEventId = $oHiddenEventsIndicator.attr("id"),
			sArrHiddenEventId,  dHiddenEventsDate, dDayStart, dDayEnd, oArrEvents,
			$oHiddenEventsDialog = $(to.elem).find(".cHiddenEventsCont");

			sHiddenEventId = sHiddenEventId.replace("HiddenEvents-", "");
			sArrHiddenEventId = sHiddenEventId.split("-");
			dHiddenEventsDate = new Date(parseInt(sArrHiddenEventId[2]), parseInt(sArrHiddenEventId[1]), parseInt(sArrHiddenEventId[0]), 0, 0, 0, 0);
			dDayStart = to.setDateInFormat({"date": dHiddenEventsDate}, "START");
			dDayEnd = to.setDateInFormat({"date": dHiddenEventsDate}, "END");
			oArrEvents = to.getArrayOfEventsForView(dDayStart, dDayEnd);

			var sCMVDayId = "#cmvDay-" + sHiddenEventId,
			$oCMVDay = $(to.elem).find(sCMVDayId),

			iLeft = $oCMVDay.position().left,
			iTop = $oCMVDay.closest(".cmvMonthTableRows").position().top,
			iWidth = $oCMVDay.width(),

			sHeaderClass = "cHiddenEventsContHeader";

			if(to.compareDates(dHiddenEventsDate, $.CalenStyle.extra.dToday) === 0)
				sHeaderClass += " cHiddenEventsContToday";

			if($.cf.compareStrings(typeof to.setting.hiddenEventsIndicatorAction, "function"))
			{
				to.setting.hiddenEventsIndicatorAction.call(to, dHiddenEventsDate, oArrEvents, true);
			}
			else if($.cf.compareStrings(typeof to.setting.hiddenEventsIndicatorAction, "string"))
			{
				if($.cf.compareStrings(to.setting.hiddenEventsIndicatorAction, "ShowEventDialog"))
				{
					if(oArrEvents.length > 0)
					{
						if($oHiddenEventsDialog.length > 0)
							$oHiddenEventsDialog.remove();

						var sHiddenDialogStr = "<div class='cHiddenEventsCont' data-date='" + sHiddenEventId + "'></span>";
						sHiddenDialogStr += "<span class='" + sHeaderClass + "'>";
						sHiddenDialogStr += to.getDateInFormat({"date": dHiddenEventsDate}, "DDD MMM dd, yyyy", false, true);
						sHiddenDialogStr += "<span class='cHiddenEventsContClose'>&times;</span>";
						sHiddenDialogStr += "</span>";
						sHiddenDialogStr += "</div>";
						$(to.elem).find(".cdmvEventContMain").append(sHiddenDialogStr);

						var oHiddenEventsDialog = {};
						$oHiddenEventsDialog = $(to.elem).find(".cHiddenEventsCont");
						oHiddenEventsDialog.oArrEvents = oArrEvents;
						oHiddenEventsDialog.dDayStart = dDayStart;
						oHiddenEventsDialog.dDayEnd = dDayEnd;
						to._addEventsInMonthView(oHiddenEventsDialog);

						$oHiddenEventsDialog.css({ "left": iLeft, "top": iTop, "width": iWidth + (iWidth / 2) });

						to._adjustEventsInMonthView(true);

						$(document).on($.CalenStyle.extra.sClickHandler + ".CalenStyleDialog", function(e)
						{
							e.stopPropagation();
							to._endHiddenEventsIndicatorHandlerAction();
						});

						$(to.elem).find(".cdmvEventContMain, .cdmvEvent:not(.cHiddenEvent), .cdmvEvent:not(.cHiddenEvent) .cEventLink").on($.CalenStyle.extra.sClickHandler + ".CalenStyleDialog", function(e)
						{
							e.stopPropagation();
							to._endHiddenEventsIndicatorHandlerAction();
						});

						$oHiddenEventsDialog.find(".cHiddenEventsContClose").on($.CalenStyle.extra.sClickHandler, function(e)
						{
							e.stopPropagation();
							to._endHiddenEventsIndicatorHandlerAction();
						});
					}
				}
			}

		});
	},

	_endHiddenEventsIndicatorHandlerAction: function()
	{
		var to = this;

		if($.cf.compareStrings(typeof to.setting.hiddenEventsIndicatorAction, "function"))
		{
			to.setting.hiddenEventsIndicatorAction.call(to, null, null, false);
		}
		else if($.cf.compareStrings(typeof to.setting.hiddenEventsIndicatorAction, "string"))
		{
			if($.cf.compareStrings(to.setting.hiddenEventsIndicatorAction, "ShowEventDialog"))
			{
				var $oHiddenEventsDialog = $(to.elem).find(".cHiddenEventsCont");
				$oHiddenEventsDialog.find(".cHiddenEvent").remove();
				$oHiddenEventsDialog.remove();

				/*
				if($oHiddenEventsDialog !== null)
				{
					$oHiddenEventsDialog.animate({opacity: 0}, 100);
					setTimeout(function()
					{
						$oHiddenEventsDialog.remove();
					}, 100);
				}
				*/
			}
		}
	},

	_displayEventOnDayClickInMonthView: function()
	{
		var to = this;

		if($.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "DisplayEventListDialog"))
		{
			to._displayEventsForDayInDialog();

			$(document).off($.CalenStyle.extra.sClickHandler+".CalenStyleDialog");
			$(document).on($.CalenStyle.extra.sClickHandler+".CalenStyleDialog", function(e)
			{
				//e.stopPropagation();
				to._closeDialogOfEventsForDay();
			});
		}
		else if(to.tv.bCMVDisEvLst)
		{
			var sHTMLElements = "";
			if(to.setting.displayEventsForPeriodInList)
				sHTMLElements = to.setting.displayEventsForPeriodInList.call(to, to.setDateInFormat({"date": to.setting.selectedDate}, "START"), to.setDateInFormat({"date": to.setting.selectedDate}, "END")) || "";
			$(to.elem).find(".cListOuterCont").html(sHTMLElements);
			if(to.setting.eventListAppended)
				to.setting.eventListAppended.call(to);
		}
	},

	_adjustEventsInMonthView: function(bHiddenEvents)
	{
		var to = this;
		if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
		{
			var iEventFirstRowTop = 30,
			iCMVMonthTableRowMinHeight = $(to.elem).find(".cmvMonthTableRows").css("min-height"),
			iEventRowHeight = $.CalenStyle.extra.iEventHeights[to.setting.visibleView],
			sArrEventElems = $(to.elem).find(".cdmvEvent, .cHiddenEventsIndicator"),

			iCMVMonthTableHeight = 0,
			iCMVMonthTableWidth = $(to.elem).find(".cdmvEventContMain").width(),
			iHiddenEventContWidth = 0,
			iHiddenEventContHeight = 30,
			iHiddenEvents = 0;

			iCMVMonthTableRowMinHeight = parseInt(iCMVMonthTableRowMinHeight.replace("px", ""));

			if(to.setting.hideExtraEvents)
			{
				iCMVMonthTableHeight = $(to.elem).find(".cmvMonthTableMain").height();

				iHiddenEventContWidth = $(to.elem).find(".cmvDay").width();
				iHiddenEventContWidth += (iHiddenEventContWidth / 2);
				iHiddenEventContWidth = (iHiddenEventContWidth < 200) ? 200 : iHiddenEventContWidth;
			}
			else
			{
				iCMVMonthTableHeight += $(to.elem).find(".cmvMonthTableRowDayHeader").height();

				for(var iTempIndex1 = 0; iTempIndex1 < to.tv.bAWkRw.length; iTempIndex1++)
				{
					var bArrCurrentRow = to.tv.bAWkRw[iTempIndex1],
					iRowMaxHeight = bArrCurrentRow.length,
					iWeekRowHeight = iEventFirstRowTop + (iRowMaxHeight * iEventRowHeight);

					if(iWeekRowHeight < iCMVMonthTableRowMinHeight)
						iWeekRowHeight = iCMVMonthTableRowMinHeight;

					$(to.elem).find("#cmvMonthTableRow"+(iTempIndex1 + 1)).css({"height": iWeekRowHeight});
					iCMVMonthTableHeight += iWeekRowHeight;
				}

				$(to.elem).find(".cmvMonthTableMain").css({"height": iCMVMonthTableHeight});
				$(to.elem).find(".cdmvEventContMain").css({"height": iCMVMonthTableHeight});
			}

			//--------------------------------------		Start		-----------------------------------------
			var iCMVMonthTableHeight1 = $(to.elem).find(".cmvMonthTableMain").height();

			var iCalendarContInnerHeight, iCalendarContHeight, iCalendarContOuterHeight;
			if(to.setting.hideExtraEvents)
			{
				if($(to.elem).find(".cmvTableContainer").height() < 30)
					$(to.elem).find(".cmvTableContainer").css({"height": iCMVMonthTableHeight1});
				if($(to.elem).find(".cmvTableContainerOuter").height() < 30)
					$(to.elem).find(".cmvTableContainerOuter").css({"height": iCMVMonthTableHeight1});

				iCalendarContInnerHeight = $(to.elem).find(".calendarContInner").height();

				iCalendarContInnerHeight = iCMVMonthTableHeight1 + (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").height() : 0);
				if(to.tv.bDisABar)
					iCalendarContInnerHeight += $(to.elem).find(".cActionBar").height();
				$(to.elem).find(".calendarContInner").css({"height": iCalendarContInnerHeight});

				iCalendarContHeight = iCalendarContInnerHeight;

				if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
					iCalendarContHeight = iCalendarContInnerHeight + $(to.elem).find(".cFilterBar").height();
				$(to.elem).find(".calendarCont").css({"height": iCalendarContHeight});

			}
			else
			{
				$(to.elem).find(".cmvTableContainer").css({"height": iCMVMonthTableHeight1});
				$(to.elem).find(".cmvTableContainerOuter").css({"height": iCMVMonthTableHeight1});

				iCalendarContInnerHeight = iCMVMonthTableHeight1 + (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").height() : 0);
				if(to.tv.bDisABar)
					iCalendarContInnerHeight += $(to.elem).find(".cActionBar").height();
				$(to.elem).find(".calendarContInner").css({"height": iCalendarContInnerHeight});

				iCalendarContHeight = iCalendarContInnerHeight;
				if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
					iCalendarContHeight += $(to.elem).find(".cFilterBar").height();
				$(to.elem).find(".calendarCont").css({"height": iCalendarContHeight});

				iCalendarContOuterHeight = iCalendarContHeight;
				$(to.elem).find(".calendarCont").parent().css({"height": iCalendarContOuterHeight});
			}

			if(to.tv.bDisFBar && $.cf.compareStrings(to.setting.filterBarPosition, "Bottom"))
				$(to.elem).find(".cFilterBar").css({"top": iCalendarContInnerHeight});

			if(to.tv.iDocHtPrev < $(document).height())
			{
				if($(window).height() < $(document).height())
					to.adjustMonthTable();
			}
			else
			{
				if($(window).height() > $(document).height())
					to.adjustMonthTable();
			}

			//-----------------------------------------		End	------------------------------------------------

			var iCMVCalendarContHeight = iCMVMonthTableHeight + $.CalenStyle.extra.iBorderOverhead;
			if($(to.elem).find(".cContHeader").length > 0)
				iCMVCalendarContHeight += $(to.elem).find(".cContHeader").outerHeight();
			if(to.tv.bDisABar)
				iCMVCalendarContHeight += $(to.elem).find(".cActionBar").outerHeight();
			if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
				iCMVCalendarContHeight += $(to.elem).find(".cFilterBar").outerHeight();
			if(to.tv.bCMVDisEvLst)
				iCMVCalendarContHeight += $(to.elem).find(".cListOuterCont").height();

			//-----------------------------------------------------------------

			for(var iElemIndex = 0; iElemIndex < sArrEventElems.length; iElemIndex++)
			{
				var oElem = sArrEventElems[iElemIndex],
				sElemName = $(to.elem).find(oElem).attr("data-pos"),
				sArrElemName = sElemName.split("|"),

				iRowNo = parseInt(sArrElemName[0]) + 1,
				iInnerRowIndex = parseInt(sArrElemName[1]),
				iColumnNo = parseInt(sArrElemName[2]),
				iWidthUnits = parseInt(sArrElemName[3]),

				iEventTop, iEventLeft, iEventWidth,
				iEventEndColumnNo, iEventEndColumnLeft, iEventEndColumnWidth;

				if($(oElem).hasClass("cHiddenEvent"))
				{
					iEventTop = (iHiddenEvents === 0) ? 30 : (iEventTop + iEventRowHeight + 2);
					iEventLeft = 10;
					iEventWidth = iHiddenEventContWidth - 25;

					iHiddenEventContHeight += (iEventRowHeight + 2);
					iHiddenEvents++;
				}
				else if(!bHiddenEvents)
				{
					iEventTop = $(to.elem).find("#cmvMonthTableRow"+iRowNo).position().top;
					iEventLeft = $(to.elem).find(".cmvTableColumn"+iColumnNo).position().left;

					if(to.setting.hideExtraEvents && $(to.elem).find("#cmvMonthTableRow"+iRowNo).height() < 40)
					{
						var iDayNumberWidth = $(".cmvDayNumber").width();
						iEventWidth = $(to.elem).find(".cmvTableColumn"+iColumnNo).width() - (iDayNumberWidth - 10);
						iEventTop += 6;
						iEventLeft += iDayNumberWidth;
					}
					else
					{
						iEventTop += iEventFirstRowTop + ((iInnerRowIndex - 1) * (iEventRowHeight + 1));
						iEventLeft += (2 * $.CalenStyle.extra.iBorderOverhead);
						iEventWidth = $(to.elem).find(".cmvTableColumn"+iColumnNo).width();
						if(iWidthUnits > 1)
						{
							iEventEndColumnNo = iColumnNo + (iWidthUnits - 1);
							iEventEndColumnLeft = $(to.elem).find(".cmvTableColumn"+iEventEndColumnNo).position().left + (2 * $.CalenStyle.extra.iBorderOverhead);
							iEventEndColumnWidth = $(to.elem).find(".cmvTableColumn"+iEventEndColumnNo).width();
							iEventWidth = (iEventEndColumnLeft + iEventEndColumnWidth) - iEventLeft;
						}
						iEventWidth -= (2 * $.CalenStyle.extra.iBorderOverhead);
					}
				}
				$(oElem).css({"left": iEventLeft, "top": iEventTop, "width": iEventWidth});

				if(!$(oElem).hasClass("cHiddenEventsIndicator"))
				{
					var $oEventTitle = $(oElem).find(".cdmvEventTitle"),
					iEventTitleHeight = $(oElem).height(),
					$oEventIcon = $(oElem).find(".cdmvEventIcon"),
					iEventIconWidth = ($oEventIcon !== null) ? $oEventIcon.outerWidth(true) : 0,
					$oEventTime = $(oElem).find(".cdmvEventTime"),
					iEventTimeWidth = ($oEventTime !== null) ? $oEventTime.outerWidth(true) : 0,
					iEventTimeWidthRight = 0,
					$oEventTimeRight = $(oElem).find(".cdmvEventTimeRight");
					if($oEventTimeRight !== null)
						iEventTimeWidthRight = ($oEventTimeRight !== null) ? $oEventTimeRight.outerWidth(true) : 0;
					var iPartialSymbolWidth = $(oElem).find(".cPartialEventLeft").outerWidth(true) + $(oElem).find(".cPartialEventRight").outerWidth(true);
					var iEventTitleWidth = iEventWidth - (iEventIconWidth + iEventTimeWidth + iEventTimeWidthRight + (10 * $.CalenStyle.extra.iBorderOverhead) + iPartialSymbolWidth);

					$oEventTitle.css({"height": iEventTitleHeight, "line-height": iEventTitleHeight + "px", "width": iEventTitleWidth});
					$oEventTime.css({"height": iEventTitleHeight, "line-height": iEventTitleHeight + "px"});
					if($oEventTimeRight !== null)
						$oEventTimeRight.css({"height": iEventTitleHeight, "line-height": iEventTitleHeight + "px"});
				}
			}

			var $oHiddenEventsDialog = $(to.elem).find(".cHiddenEventsCont");
			if(to.setting.hideExtraEvents && $oHiddenEventsDialog.length > 0)
			{
				var iHiddenEventContLeft = $oHiddenEventsDialog.position().left,
				iHiddenEventContTop = $oHiddenEventsDialog.position().top;
				iHiddenEventContHeight += 10;

				iHiddenEventContWidth = (iHiddenEventContWidth > iCMVMonthTableWidth) ? (iCMVMonthTableWidth - 10) : iHiddenEventContWidth;
				iHiddenEventContLeft = ((iHiddenEventContLeft + iHiddenEventContWidth) > iCMVMonthTableWidth) ? (iCMVMonthTableWidth - iHiddenEventContWidth - 1) : iHiddenEventContLeft;
				iHiddenEventContHeight = (iHiddenEventContHeight > iCMVMonthTableHeight) ? (iCMVMonthTableHeight - 10) : iHiddenEventContHeight;
				iHiddenEventContTop = ((iHiddenEventContTop + iHiddenEventContHeight) > iCMVMonthTableHeight) ? (iCMVMonthTableHeight - iHiddenEventContHeight - 2) : iHiddenEventContTop;

				$oHiddenEventsDialog.css({"width": iHiddenEventContWidth, "height": iHiddenEventContHeight, "left": iHiddenEventContLeft, "top": iHiddenEventContTop});
			}

			if(to.setting.isDragNDropInMonthView)
				to._makeEventDraggableInMonthView(".EventDraggable");
		}
	},

	//---------------------------------------- Events Dialog Start ----------------------------------------

	_displayEventsForDayInDialog: function()
	{
		var to = this;
		var iCalendarContWidth = $(to.elem).find(".calendarCont").parent().outerWidth(),
		iCalendarContHeight = $(to.elem).find(".calendarCont").parent().outerHeight();

		$(to.elem).find(".cmvDay").css("cursor", "pointer");
		$(to.elem).find(".cmvDay, .cmvDisplayAllEvents").off($.CalenStyle.extra.sClickHandler);

		$(to.elem).find(".cmvDay, .cmvDisplayAllEvents").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();

			var $oDayElem = $(this).hasClass("cmvDay") ? $(this) : $(this).parent(),
			sDayId = $oDayElem.attr("id"),
			dThisDate = to._getDateForDayIdInMonthView(sDayId),
			sEventTimeFormat = to.setting.is24Hour ? "HH:mm" : "h[:m]sm",
			sHeaderDateString = "cmvDialog-" + dThisDate.getDate() + "-" + dThisDate.getMonth() + "-" + dThisDate.getFullYear(),
			$oDialog = $(to.elem).find(".cmvDialog"),
			sPrevDialogHeader;

			if($oDialog !== null)
			{
				sPrevDialogHeader = $oDialog.attr("data-date");
				$oDialog.remove();

				if(sPrevDialogHeader === sHeaderDateString)
					return false;
			}

			var oThisDateEventsArray = to.getArrayOfEventsForView(dThisDate, dThisDate),

			pClickedAt = {};
			pClickedAt.x = e.pageX || e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
			pClickedAt.y = e.pageY || e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;

			if(to.setting.displayEventListDialog)
				to.setting.displayEventListDialog.call(to, dThisDate, oThisDateEventsArray, pClickedAt);
			else if(oThisDateEventsArray.length > 0)
			{
				var sRowId = $oDayElem.parent().attr("id"),
				iRowId = parseInt(sRowId.replace("cmvMonthTableRow", "")),
				iDayIndex = 0,
				iDayNumber = dThisDate.getDay();
				if(iDayNumber < to.setting.weekStartDay)
					iDayIndex = (6 - to.setting.weekStartDay) + iDayNumber + 1;
				else
					iDayIndex = iDayNumber - to.setting.weekStartDay;

				// ------------------------------------- Dialog HTML Start ----------------------------------------

				var iDayHeight = $oDayElem.height(),
				iDayWidth = $oDayElem.width(),
				iDialogHeight = iDayHeight * 3,
				iDialogWidth = iDayWidth * 1.25;
				iDialogWidth = (iDialogWidth < 200) ? 200 : iDialogWidth;
				iCalendarContWidth = $(to.elem).find(".calendarCont").parent().outerWidth();
				iCalendarContHeight = $(to.elem).find(".calendarCont").parent().outerHeight();

				var sTemplate = "";
				sTemplate += "<div class='cmvDialog' data-date='" + sHeaderDateString + "'>";
				sTemplate += "<span class='cmvDialogTooltip'></span>";
				sTemplate += "<div class='cmvDialogInnerCont'>";
				sTemplate += "<table class='cmvDialogTable'>";

				for(var iEventIndex = 0; iEventIndex < oThisDateEventsArray.length; iEventIndex++)
				{
					var oTempEvent = oThisDateEventsArray[iEventIndex],
					sEventTitle = oTempEvent.title,
					sEventId = oTempEvent.id,
					dEventStartDate = oTempEvent.start,
					dEventEndDate = oTempEvent.end,
					bIsAllDay = oTempEvent.isAllDay,
					bIsMarked = oTempEvent.isMarked,
					sEventColor, sEventColorStyle,
					sClass = "cmvDialogEvent",
					sEventBgColor, sIcon,
					sEventStyle = "", sEventIconStyle = "",

					bHideEventIcon = $.cf.isValid(to.setting.hideEventIcon[to.setting.visibleView]) ? to.setting.hideEventIcon[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventIcon.Default) ? to.setting.hideEventIcon.Default : false,
					bHideEventTime = $.cf.isValid(to.setting.hideEventTime[to.setting.visibleView]) ? to.setting.hideEventTime[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventTime.Default) ? to.setting.hideEventTime.Default : false,

					sStartDate, sDuration, sDateTimeString = "",

					bCompStart = to.compareDates(dEventStartDate, dThisDate),
					bCompEnd = to.compareDates(dEventEndDate, dThisDate);

					if(bIsAllDay)
					{
						sStartDate = "All Day";

						if(bCompEnd !== 0)
							sDuration = ($.cf.compareStrings(to.setting.duration, "Default") ?
							to.__getDurationBetweenDates(dThisDate, dEventEndDate, "dhm", false, false) :
							to.setting.duration.call(to, dThisDate, dEventEndDate, "dhm"));
						else
							sDuration = "";
					}
					else
					{
						if(bCompStart === 0)
							sStartDate = to.getDateInFormat({"date": dEventStartDate}, sEventTimeFormat, to.setting.is24Hour, true);
						else if(bCompEnd === 0)
							sStartDate = "Ends " +  to.getDateInFormat({"date": dEventEndDate}, sEventTimeFormat, to.setting.is24Hour, true);
						else
							sStartDate = "All Day";

						if(bCompStart === 0 && bCompEnd === 0)
						{
							sDuration = ($.cf.compareStrings(to.setting.duration, "Default") ?
								to.__getDurationBetweenDates(dEventStartDate, dEventEndDate, "dhm", false, false) :
								to.setting.duration.call(to, dEventStartDate, dEventEndDate, "dhm"));
						}
						else
						{
							sDuration = ($.cf.compareStrings(to.setting.duration, "Default") ?
								to.__getDurationBetweenDates(dThisDate, dEventEndDate, "dhm", false, false) :
								to.setting.duration.call(to, dThisDate, dEventEndDate, "dhm"));
						}
					}

					if($.cf.isValid(sStartDate))
						sDateTimeString += "<span class='cmvDialogTimeStart'>" + sStartDate + "</span>";

					if($.cf.isValid(sDuration))
						sDateTimeString += "<span class='cmvDialogTimeDuration'>" + sDuration + "</span>";

					sEventColor = oTempEvent.fromSingleColor ? oTempEvent.textColor : oTempEvent.backgroundColor;
					sEventBgColor = oTempEvent.fromSingleColor ? oTempEvent.backgroundColor : $.cf.addHashToHexcode(sEventColor, "0.1");

					if(bIsMarked)
					{
						sClass += " cMarkedDayEvent";
						sEventStyle = "background: " + sEventBgColor + ";";
						sEventIconStyle = "color: " + sEventColor + ";";
						sIcon = ($.cf.isValid(oTempEvent.icon) && oTempEvent.icon !== "Dot") ? oTempEvent.icon : "cs-icon-Mark";
					}
					else
					{
						sEventColorStyle = "background: " + sEventColor + ";";
						sEventIconStyle = "color: " + sEventColor + ";";
						sIcon = $.cf.isValid(oTempEvent.icon) ? oTempEvent.icon : to.setting.eventIcon;
					}

					sTemplate += "<tr id='cmvDialogEvent-"+sEventId+"' class='" + sClass + "'>";

					sTemplate += "<td style='" + sEventStyle + "'>";
					sTemplate += "<div>";
					sTemplate += "<div class='cmvDialogTitle'>" + sEventTitle + "</div>";

					if(!bHideEventTime && !bIsMarked && sDateTimeString !== "")
						sTemplate += "<div class='cmvDialogTime'>" + sDateTimeString + "</div>";

					sTemplate += "</div>";
					sTemplate += "</td>";

					sTemplate += "<td class='cmvDialogIcon' style='" + sEventStyle + "'>";
					if(bIsMarked)
						sTemplate += "<span class='cmvDialogIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span>";
					else
					{
						if(!bHideEventIcon)
						{
							if($.cf.compareStrings(sIcon, "Dot"))
							{
								sEventIconStyle = "background: " + sEventColor + ";";
								sTemplate += "<span class='cmvDialogIconDot' style='" + sEventIconStyle + "'></span>";
							}
							else
								sTemplate += "<span class='cmvDialogIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span>";
						}
					}
					sTemplate += "</td>";

					sTemplate += "</tr>";

					if(bIsMarked)
						sTemplate += "<tr class='cmvDialogEventSeparator'><td colspan='2'></td></tr>";
					else if(iEventIndex !== oThisDateEventsArray.length - 1)
						sTemplate += "<tr class='cmvDialogEventSeparator'><td colspan='2'><hr></td></tr>";
				}

				sTemplate += "</table>";
				sTemplate += "</div>";
				sTemplate += "</div>";

				if(sPrevDialogHeader !== sHeaderDateString)
				{
					$(to.elem).find(".calendarContInner").append(sTemplate);

					// ------------------------------------- Dialog HTML End ----------------------------------------

					var iDialogWidthActual = $(to.elem).find(".cmvDialog").width();
					iDialogWidthActual = (iDialogWidthActual < 200) ? 200 : iDialogWidthActual;

					if(iCalendarContWidth <= 400)
					{
						iDialogWidth = iCalendarContWidth - 2;
						iDialogWidthActual = iDialogWidth;

						iDialogHeight = iDayHeight * 3;
					}
					else if(iCalendarContHeight <= 400)
						iDialogHeight = iDayHeight * 4;

					$(to.elem).find(".cmvDialog").css({"max-height": iDialogHeight, "max-width": iDialogWidth, "width": iDialogWidthActual});

					iCalendarContWidth = $(to.elem).find(".cmvCalendarCont").width();
					iCalendarContHeight = $(to.elem).find(".cmvCalendarCont").height();

					var iDialogCalcWidth = $(to.elem).find(".cmvDialog").width(),
					iDialogCalcHeight = $(to.elem).find(".cmvDialog").height(),
					iDayLeft = $(to.elem).find("#"+sDayId).position().left,

					iRowTop = $(to.elem).find("#"+sRowId).position().top,

					iDialogMaxHeight = iDialogHeight - 24;
					iDialogCalcHeight = (iDialogCalcHeight > iDialogMaxHeight) ? iDialogMaxHeight : iDialogCalcHeight;

					var iCMVMonthTableTop = $(to.elem).find(".cmvMonthTableMain").position().top,
					iDialogTop, iDialogLeft, iTooltipTop, iTooltipLeft,
					sInnerContMargin = "", sTooltipClass = "";

					if(iCalendarContWidth <= 400)
					{
						if(iRowId <= 3)
						{
							iDialogTop = iCMVMonthTableTop + iRowTop + (iDayHeight - 10);
							iTooltipTop = -11;

							sTooltipClass = "cmvDialogTooltipBottom";
							sInnerContMargin = "10px 0px 0px 0px";

							iDialogHeight =  ((iDialogTop + iDialogHeight) > iCalendarContHeight) ? (iCalendarContHeight - iDialogTop) : iDialogHeight;
						}
						else
						{
							iDialogTop = iCMVMonthTableTop + iRowTop - (iDialogCalcHeight + 6);
							if(iDialogTop < 50)
							{
								iDialogTop =  50;
								iDialogCalcHeight = (iCMVMonthTableTop + iRowTop - 3) - 50;
								iDialogHeight = (iCMVMonthTableTop + iRowTop - 3) - 50;
								iTooltipTop = iDialogCalcHeight - 1;
							}
							else
								iTooltipTop = iDialogCalcHeight - 1;
							iTooltipTop = iDialogCalcHeight - 1;

							sTooltipClass = "cmvDialogTooltipTop";
							sInnerContMargin = "0px 0px 10px 0px";
						}
					}
					else
					{
						if(iRowId <= 3)
						{
							iDialogTop = iCMVMonthTableTop + iRowTop + $(to.elem).find(".cmvDisplayAllEvents").height() - 2;
							iTooltipTop = -11;
							sTooltipClass = "cmvDialogTooltipBottom";
							sInnerContMargin = "10px 0px 0px 0px";

							iDialogHeight =  ((iDialogTop + iDialogHeight) > iCalendarContHeight) ? (iCalendarContHeight - iDialogTop) : iDialogHeight;
						}
						else
						{
							iDialogTop = (iCMVMonthTableTop + iRowTop) - (iDialogCalcHeight - 3);
							if(iDialogTop < 50)
							{
								iDialogTop =  50;
								iDialogCalcHeight = (iCMVMonthTableTop + iRowTop - 3) - 50;
								iDialogHeight = (iCMVMonthTableTop + iRowTop - 3) - 50;
								iTooltipTop = iDialogCalcHeight - 1;
							}
							else
								iTooltipTop = iDialogCalcHeight - 1;
							sTooltipClass = "cmvDialogTooltipTop";
							sInnerContMargin = "0px 0px 10px 0px";
						}
					}

					if(iCalendarContWidth <= 400)
					{
						iDialogLeft = 0;
						iTooltipLeft = iDayLeft + (iDayWidth / 2) - 10;
					}
					else
					{
						if(iDayIndex === 0)
						{
							iDialogLeft = iDayLeft + 5;
							iTooltipLeft = iDayWidth - 34;
						}
						else if(iDayIndex === (to.setting.excludeNonBusinessHours ? to.tv.iBsDays : 6))
						{
							iDialogLeft = iCalendarContWidth - iDialogCalcWidth;
							iTooltipLeft = iDialogCalcWidth - 28;
						}
						else
						{
							iTooltipLeft = (iDialogCalcWidth / 2) - 14;
							var iDayMid = iDayLeft + iDayWidth - 10;
							iDialogLeft = iDayMid - (iDialogCalcWidth / 2) - 4;

							var iDay1Left = $(to.elem).find(".cmvTableColumn0").position().left,
							iMaxHoriPos = iDialogLeft + iDialogCalcWidth,
							iMinHoriPos = iDialogLeft - (iDialogCalcWidth / 2),
							iDialogLeftPrev, iDiff;

							if(iMaxHoriPos >= iCalendarContWidth)
							{
								iDialogLeftPrev = iDialogLeft;
								iDialogLeft = iCalendarContWidth - iDialogCalcWidth - 5;
								iDiff = iDialogLeftPrev - iDialogLeft;
								iTooltipLeft += iDiff;
							}
							if(iMinHoriPos <= iDay1Left)
							{
								iDialogLeftPrev = iDialogLeft;
								iDialogLeft = iDay1Left + 5;
								iDiff = iDialogLeft - iDialogLeftPrev;
								iTooltipLeft -= iDiff;
							}
						}
					}

					$(to.elem).find(".cmvDialogTooltip").addClass(sTooltipClass);
					$(to.elem).find(".cmvDialogTooltip").css({"top": iTooltipTop, "left": iTooltipLeft});
					$(to.elem).find(".cmvDialog").css({"top": iDialogTop, "left": iDialogLeft});

					iDialogHeight -= 24;
					$(to.elem).find(".cmvDialogInnerCont").css({"margin": sInnerContMargin, "max-height": iDialogHeight, "max-width": iDialogWidth});

					$(to.elem).find(".cmvDialogClose").on($.CalenStyle.extra.sClickHandler, function(e)
					{
						e.stopPropagation();
						to._closeDialogOfEventsForDay();
					});
					$(to.elem).find(".cmvDialog").on($.CalenStyle.extra.sClickHandler, function(e)
					{
						e.stopPropagation();
					});

					to._addDialogEventAction();
				}

				if($("body").hasClass("br-ios"))
				{
					var iCMVDialogTableHeight = $(to.elem).find(".cmvDialogTable").height() + 20;
					iDialogHeight = (iCMVDialogTableHeight > iDialogHeight) ? iDialogHeight : iCMVDialogTableHeight;
					$(to.elem).find(".cmvDialogInnerCont").css({"height": iDialogHeight});

					if(iRowId > 3)
					{
						iDialogTop = iCMVMonthTableTop + iRowTop - (iDialogHeight + 6);
						$(to.elem).find(".cmvDialog").css({"top": iDialogTop});

						iTooltipTop = iDialogHeight - 1;
						$(to.elem).find(".cmvDialogTooltip").css({"top": iTooltipTop});
					}
				}
			}
		});
	},

	_closeDialogOfEventsForDay: function()
	{
		var to = this;
		var $oDialog = $(to.elem).find(".cmvDialog");
		if($oDialog !== null)
		{
			$oDialog.animate({opacity: 0}, 100);
			setTimeout(function()
			{
				$oDialog.remove();
			}, 100);
		}
	},

	_addDialogEventAction: function()
	{
		var to = this;
		$(to.elem).find(".cmvDialogEvent").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();

			var oTempEvent = to.getEventWithId($(this).attr("data-id"));
			if(to.setting.eventInADialogClicked)
				to.setting.eventInADialogClicked.call(to, oTempEvent);
		});
	},

	//-----------------------------------------	Events Dialog End -----------------------------------------

	//------------------------------------------ Events List Start ------------------------------------------

	_makeDayClickableInMonthView: function()
	{
		var to = this;
		var $oElem;
		if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
			$oElem = $(to.elem).find(".cdmvEventContMain");
		else
			$oElem = $(to.elem).find(".cmvDay");

		$oElem.on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();

			var pClickedAt = {};
			pClickedAt.x = e.pageX || e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
			pClickedAt.y = e.pageY || e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;
			var oArrElemsAtPt = to.__getElementsAtPoint(pClickedAt.x, pClickedAt.y);
			for(var iTempIndex  = 0; iTempIndex <= oArrElemsAtPt.length; iTempIndex++)
			{
				var $oTempElem = $(oArrElemsAtPt[iTempIndex]);
				if($oTempElem.hasClass("cmvDay"))
					$oElem = $oTempElem;
			}

			if($oElem.hasClass("cmvDay"))
			{
				$(to.elem).find(".cmvDay .cmvDayNumber").removeClass("cCurrentHighlightCircle cContHeaderButtonsHover");

				var sDayId = $oElem.attr("id");
				to.setting.selectedDate = to._getDateForDayIdInMonthView(sDayId);

				if($(to.elem).find(".cHiddenEventsCont").length === 0 && to.setting.cellClicked)
					to.setting.cellClicked.call(to, to.setting.visibleView, to.setting.selectedDate, true, pClickedAt);

				if($.cf.compareStrings(to.setting.visibleView, "MonthView") && $.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "ModifyEventList"))
				{
					if(to.compareDates($.CalenStyle.extra.dToday, to.setting.selectedDate) !== 0)
						$oElem.find(".cmvDayNumber").addClass("cCurrentHighlightCircle");

					var sHTMLElements = "";
					if(to.setting.displayEventsForPeriodInList)
						sHTMLElements = to.setting.displayEventsForPeriodInList.call(to, to.setDateInFormat({"date": to.setting.selectedDate}, "START"), to.setDateInFormat({"date": to.setting.selectedDate}, "END")) || "";
					$(to.elem).find(".cListOuterCont").html(sHTMLElements);

					if(to.setting.eventListAppended)
						to.setting.eventListAppended.call(to);
				}
			}
		});
	},

	//------------------------------------------ Events List End ------------------------------------------

	_getDateForDayIdInMonthView: function(sDayId)
	{
		var sArrDayId = sDayId.split("-");
		return new Date(sArrDayId[3], sArrDayId[2], sArrDayId[1], 0, 0, 0, 0);
	},

	_addTooltipInMonthView: function(sClass)
	{
		var to = this;
		$(to.elem).find(sClass).tooltip(
		{
			content: function()
			{
				var sTooltipText = "";
				if($.cf.compareStrings(to.setting.eventTooltipContent, "Default"))
				{
					var oTooltipContent = $(this).data("tooltipcontent");
					if(oTooltipContent.title !== undefined)
						sTooltipText += "<div class='cTooltipTitle'>" + oTooltipContent.title + "</div>";
					if(oTooltipContent.startDateTime !== undefined || oTooltipContent.endDateTime === undefined)
					{
						sTooltipText += "<div class='cTooltipTime'>";
						if(oTooltipContent.startDateTime !== undefined)
							sTooltipText += oTooltipContent.startDateTime;
						if(oTooltipContent.endDateTime !== undefined)
							sTooltipText += ("<br/>" + oTooltipContent.endDateTime);
						sTooltipText += "</div>";
					}
				}
				else
				{
					var oEventRecord = to.getEventWithId($(this).attr("data-id"));
					sTooltipText = to.setting.eventTooltipContent.call(to, oEventRecord);
				}
				return sTooltipText;
			},

			position:
			{
				my: "center bottom-15",
				at: "center top",
				using: function(position, feedback)
				{
					$(this).css(position);
					$("<div>")
					.addClass("tooltip-arrow")
					.addClass(feedback.vertical)
					.addClass(feedback.horizontal)
					.appendTo(this);
				}
			}
		});
	},

	_makeEventDraggableInMonthView: function(sClass)
	{
		var to = this;
		var iEventHeight, iColumnWidth, iColumnHeight;

		if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
			iEventHeight = $.CalenStyle.extra.iEventHeights[to.setting.visibleView];
		else if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
			iEventHeight = to._getHeightForAllDayEventInMonthView();

		iColumnWidth = $(to.elem).find("#cmvMonthTableRow1 .cmvTableColumn0").width();
		iColumnHeight = $(to.elem).find(".cmvMonthTableRows").css("height");
		if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
			iColumnHeight = $(to.elem).find(".cmvMonthTableRows").css("height");
		iColumnHeight = parseInt(iColumnHeight.replace("px", "")) || 0;

		var iX1 = $(to.elem).find("#cmvMonthTableRow1 .cmvTableColumn0").offset().left,
		iX2 = $(to.elem).find("#cmvMonthTableRow1 .cmvTableColumns:last").offset().left,
		iY1 = $(to.elem).find("#cmvMonthTableRow1 .cmvTableColumn0").offset().top,
		iY2 = $(to.elem).find("#cmvMonthTableRow"+to.tv.iWkInMonth+" .cmvTableColumn0").offset().top + iColumnHeight - iEventHeight;
		if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
			iY2 = iY2 - (2 * iEventHeight);

		var $oElemDragged, sId, oDraggedEvent, sEventClass, dStartDateTime,
		iEventTitleWidthBeforeDrag;

		$(to.elem).find(sClass).draggable(
		{
			zIndex: 100,
			scope: "Events",
			containment: [iX1, iY1, iX2, iY2],
			scroll: false,
			revertDuration: 300,

			start: function()
			{
				$oElemDragged = $(this);

				var oElementClone = $oElemDragged.clone();
				$(oElementClone).removeClass("ui-draggable-dragging").addClass("cEventClone cEventBeingDragged");
				$oElemDragged.parent().append(oElementClone);

				sId = $oElemDragged.attr("data-id");
				oDraggedEvent = to.getEventWithId(sId);
				sEventClass = ".Event-" + sId;
				dStartDateTime = null;

				if(!$oElemDragged.hasClass("cEventOnlyText"))
					$oElemDragged.addClass("cEditingEvent cEditingEventUI");
				else
					$oElemDragged.addClass("cEditingEvent");

				if(oDraggedEvent.start !== null)
					dStartDateTime = oDraggedEvent.start;

				to.tv.draggableParent = "cmvDay-" + dStartDateTime.getDate() + "-" + dStartDateTime.getMonth() + "-" + dStartDateTime.getFullYear();

				$oElemDragged.css({"position": "absolute"});
				$oElemDragged.css({"width": iColumnWidth, "height": iEventHeight});

				if(to.setting.hideExtraEvents)
				{
					iEventTitleWidthBeforeDrag = $oElemDragged.find(".cdmvEventTitle").width();

					var $oEventIcon = $oElemDragged.find(".cdmvEventIcon"),
					iEventIconWidth = ($oEventIcon !== null) ? $oEventIcon.outerWidth(true) : 0,
					$oEventTime = $oElemDragged.find(".cdmvEventTime"),
					iEventTimeWidth = ($oEventTime !== null) ? $oEventTime.outerWidth(true) : 0,
					iEventTimeWidthRight = 0,
					$oEventTimeRight = $oElemDragged.find(".cdmvEventTimeRight");
					if($oEventTimeRight !== null)
						iEventTimeWidthRight = ($oEventTimeRight !== null) ? $oEventTimeRight.outerWidth(true) : 0;
					var iPartialSymbolWidth = $oElemDragged.find(".cPartialEventLeft").outerWidth(true) + $oElemDragged.find(".cPartialEventRight").outerWidth(true);
					var iEventTitleWidth = iColumnWidth - (iEventIconWidth + iEventTimeWidth + iEventTimeWidthRight + (10 * $.CalenStyle.extra.iBorderOverhead) + iPartialSymbolWidth);
					$oElemDragged.find(".cdmvEventTitle").css({"width": iEventTitleWidth});
				}
			},

			revert: function()
			{
				$oElemDragged = $(this);

				if(to.setting.hideExtraEvents)
					$oElemDragged.find(".cdmvEventTitle").css({"width": iEventTitleWidthBeforeDrag});

				$(to.elem).find(".cmvDay").removeClass("cActivatedCell");

				if(to.tv.bDroppedInDifferent)
				{
					if(to.setting.isTooltipInMonthView)
						to._addTooltipInMonthView(".cEventTooltip");
					if(to.setting.isDragNDropInMonthView)
						to._makeEventDraggableInMonthView(".EventDraggable");
				}

				return true;
			}

		});
	},

	// Public Method
	adjustMonthTable: function()
	{
		var to = this;
		var iCalendarContWidth = $(to.elem).outerWidth(),
		iCalendarContHeight = $(to.elem).outerHeight(),
		iCalendarContMaxWidth = $.cf.getSizeValue($(to.elem), "max-width"),

		iCMVMonthTableMinHeight = $.cf.getSizeValue($(to.elem).find(".cmvMonthTable"), "min-height") || 0;
		to.tv.iDocHtPrev = $(document).height();
		iCalendarContHeight += (2 * $.CalenStyle.extra.iBorderOverhead);

		to._closeDialogOfEventsForDay();

		iCalendarContWidth = (iCalendarContMaxWidth && iCalendarContWidth > iCalendarContMaxWidth) ? iCalendarContMaxWidth : iCalendarContWidth;

		var iCalendarContHeightMV = iCalendarContHeight;
		if(to.tv.bDisFBar)
		{
			if($.cf.compareStrings(to.setting.filterBarPosition, "Left") || $.cf.compareStrings(to.setting.filterBarPosition, "Right"))
				iCalendarContWidth -= to.setting.filterBarWidth;
			else if($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom"))
			{
				iCalendarContHeightMV -= to.setting.filterBarHeight;
				$(to.elem).find(".cFilterBar").css({"width": iCalendarContWidth});
			}
		}
		if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
			$(to.elem).find(".calendarContInner").css({"height": iCalendarContHeightMV});
		$(to.elem).find(".calendarContInner").css({"width": iCalendarContWidth});

		to.__adjustHeader();

		if($.cf.compareStrings(to.setting.filterBarPosition, "Right"))
			$(to.elem).find(".cFilterBar").css({"left": iCalendarContWidth});

		if(iCalendarContWidth >= 300 && iCalendarContHeight >= 300)
		{
			$(to.elem).find(".cmvDayHeader").removeClass("cmvThinBorderBottom cmvThinBorder").addClass("cmvThinBorderBottom");
			$(to.elem).find(".cmvWeekNumber").removeClass("cmvThinBorderRight cmvThinBorder").addClass("cmvThinBorderRight");
			$(to.elem).find(".cmvTableContainerOuter").addClass("cmvThinBorder");
		}
		else
		{
			$(to.elem).find(".cmvWeekNumber").removeClass("cmvThinBorderRight cmvThinBorder").addClass("cmvThinBorder");
			$(to.elem).find(".cmvTableContainerOuter").addClass("cmvThinBorder");
		}

		var iCalendarSectionMaxHeight;
		if($.cf.compareStrings(to.setting.visibleView, "MonthView") && $.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "ModifyEventList") && to.tv.bCMVDisEvLst)
		{
			if(to.setting.displayEventsInMonthView)
			{
				iCalendarSectionMaxHeight = iCalendarContHeight / 2;
				if(iCalendarSectionMaxHeight < (300 - (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").height() : 0)))
					iCalendarSectionMaxHeight = (300 - (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").height() : 0));
			}
			else
			{
				if(iCalendarContHeight > iCalendarContWidth)
					iCalendarSectionMaxHeight = iCalendarContWidth;
				else
				{
					iCalendarSectionMaxHeight = iCalendarContHeight / 2;
					if(iCalendarSectionMaxHeight < (300 - (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").height() : 0)))
						iCalendarSectionMaxHeight = (300 - (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").height() : 0));
				}
			}

			if(iCMVMonthTableMinHeight !== 0)
				iCalendarSectionMaxHeight = iCMVMonthTableMinHeight;
			$(to.elem).find(".cmvMonthTableMain").css({"height": iCalendarSectionMaxHeight});
		}

		var iAvailableHeightForEvents, iCMVMonthTableHeight,
		iCMVMonthTableWidth, iCMVTableColumnsWidth,
		iCMVTableHeaderRowHeight, iCMVTableRowHeight,
		iDayNumberHeight, iDisplayAllDayEventsButtonHeight, iMaxNumberSectionHeight,
		iCMVMonthTableHeightModified, iMonthCustomMaxHeight;

		if(iCalendarContWidth > 500 && iCalendarContHeight > 500)
		{
			if($.cf.compareStrings(to.setting.visibleView, "MonthView") && $.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "ModifyEventList") && to.tv.bCMVDisEvLst)
				iCMVMonthTableHeight = iCalendarSectionMaxHeight;
			else
			{
				iCMVMonthTableHeight = iCalendarContHeight - (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerHeight() : 0);
				if(to.tv.bDisABar)
					iCMVMonthTableHeight -= $(to.elem).find(".cActionBar").outerHeight();
				if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
					iCMVMonthTableHeight -= $(to.elem).find(".cFilterBar").outerHeight();
			}

			$(to.elem).find(".calendarCont").css({"height": iCalendarContHeight});

			if($(to.elem).find(".cContHeader").length > 0)
				$(to.elem).find(".cContHeader").css({"width": iCalendarContWidth});

			iCMVMonthTableWidth = (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerWidth() : $(to.elem).find(".calendarContInner").outerWidth());
			iCMVTableColumnsWidth = iCMVMonthTableWidth / (to.setting.excludeNonBusinessHours ? to.tv.iBsDays : 7);

			if(to.setting.displayWeekNumInMonthView)
			{
				if(iCMVTableColumnsWidth > 50)
				{
					iCMVTableColumnsWidth = (iCMVMonthTableWidth - 50) / (to.setting.excludeNonBusinessHours ? to.tv.iBsDays : 7);
					$(to.elem).find(".cmvWeekNumber").css({"width": 50});
				}
				else
					$(to.elem).find(".cmvWeekNumber").css({"width": iCMVTableColumnsWidth});
			}

			$(to.elem).find(".cmvTableColumns").css({"width": iCMVTableColumnsWidth});

			iCMVTableHeaderRowHeight = $(to.elem).find(".cmvMonthTableRowDayHeader").outerHeight();
			if($.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
			{
				iCMVTableRowHeight = (iCMVMonthTableHeight - iCMVTableHeaderRowHeight) / to.tv.iWkInMonth;

				iDayNumberHeight = $(to.elem).find(".cmvDayNumber").height() + 2;
				iDisplayAllDayEventsButtonHeight = $(to.elem).find(".cmvDisplayAllEvents").height();
				iMaxNumberSectionHeight = (iDayNumberHeight > iDisplayAllDayEventsButtonHeight) ? iDayNumberHeight : iDisplayAllDayEventsButtonHeight;
				iAvailableHeightForEvents = iCMVTableRowHeight - iMaxNumberSectionHeight;
			}
			else if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
			{
				iCMVTableRowHeight = (iCMVMonthTableHeight - iCMVTableHeaderRowHeight) / to.tv.iWkInMonth;

				if(to.tv.bDisABar || (to.tv.bDisFBar && $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
					iCMVMonthTableHeight += $.CalenStyle.extra.iBorderOverhead;
			}
			$(to.elem).find(".cmvTableContainerOuter").css({"height": iCMVMonthTableHeight, "width": iCMVMonthTableWidth});

			if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
			{
				iCMVMonthTableWidth -= $.CalenStyle.extra.iBorderOverhead;
				iCMVMonthTableHeight -= $.CalenStyle.extra.iBorderOverhead;
			}
			$(to.elem).find(".cmvTableContainer").css({"height": iCMVMonthTableHeight, "width": iCMVMonthTableWidth, "top": -$.CalenStyle.extra.iBorderOverhead, "left": -$.CalenStyle.extra.iBorderOverhead});

			iCMVMonthTableHeightModified = 0;
			if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
			{
				$(to.elem).find(".cmvMonthTableMain").css({"top": -$.CalenStyle.extra.iBorderOverhead});
				if(to.setting.hideExtraEvents)
				{
					$(to.elem).find(".cmvMonthTableRows").css({"height": iCMVTableRowHeight});

					to.tv.iMxEvRw = Math.floor((iCMVTableRowHeight - 30) / ($.CalenStyle.extra.iEventHeights[to.setting.visibleView]));

					iCMVMonthTableHeightModified = iCMVTableHeaderRowHeight + (to.tv.iWkInMonth * iCMVTableRowHeight);
					if(iCMVMonthTableHeightModified > iCMVMonthTableHeight)
						iCMVMonthTableHeight = iCMVMonthTableHeightModified;
				}
			}
			else
			{
				$(to.elem).find(".cmvMonthTableRows").css({"height": iCMVTableRowHeight});
				if(iCMVTableRowHeight < 60)
				{
					$(to.elem).find(".cmvMonthTableRows").css({"min-height": iCMVTableRowHeight});
				}

				if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
				{
					if($.cf.compareStrings(to.setting.eventIndicatorInMonthView, "Custom"))
					{
						iMonthCustomMaxHeight = iCMVTableRowHeight - iDayNumberHeight;
						$(to.elem).find(".cmvMonthTableRowCustom").css({"max-height": iMonthCustomMaxHeight});
					}
				}
			}

			$(to.elem).find(".cmvMonthTableMain").css({"height": iCMVMonthTableHeight, "width": iCMVMonthTableWidth});
			$(to.elem).find(".cdmvEventContMain").css({"height": iCMVMonthTableHeight, "width": iCMVMonthTableWidth});
			$(to.elem).find(".cmvDayHeader").removeClass("cmvThinBorderBottom cmvThinBorder").addClass("cmvThinBorderBottom");
		}
		else
		{
			if($(to.elem).find(".cContHeader").length > 0)
			{
				if(iCalendarContWidth >= 300)
					$(to.elem).find(".cContHeader").css({"width": iCalendarContWidth});
				else
					$(to.elem).find(".cContHeader").css({"width": iCalendarContWidth});
			}

			if($.cf.compareStrings(to.setting.visibleView, "MonthView") && $.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "ModifyEventList") && to.tv.bCMVDisEvLst)
			{
				iCMVMonthTableHeight = iCalendarSectionMaxHeight;
				$(to.elem).find(".cmvMonthTable").css({"height": iCMVMonthTableHeight});
			}
			else
			{
				if(!(to.tv.bDisABar || to.tv.bDisFBar))
					iCMVMonthTableHeight = iCalendarContHeight - (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerHeight() : 0);
				else
				{
					iCMVMonthTableHeight = iCalendarContHeight - (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerHeight() : 0);
					if(to.tv.bDisABar)
						iCMVMonthTableHeight -= to.setting.actionBarHeight;
					if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
						iCMVMonthTableHeight -= to.setting.filterBarHeight;
				}
			}

			iCMVMonthTableWidth = (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerWidth() : $(to.elem).find(".calendarContInner").outerWidth());
			iCMVTableColumnsWidth = iCMVMonthTableWidth / (to.setting.excludeNonBusinessHours ? to.tv.iBsDays : 7);

			if(to.setting.displayWeekNumInMonthView)
			{
				if(iCMVTableColumnsWidth > 50)
				{
					iCMVTableColumnsWidth = (iCMVMonthTableWidth - 50) / (to.setting.excludeNonBusinessHours ? to.tv.iBsDays : 7);
					$(to.elem).find(".cmvWeekNumber").css({"width": 50});
				}
				else
					$(to.elem).find(".cmvWeekNumber").css({"width": iCMVTableColumnsWidth});
			}
			$(to.elem).find(".cmvTableColumns").css({"width": iCMVTableColumnsWidth});

			iCMVTableHeaderRowHeight = $(to.elem).find(".cmvMonthTableRowDayHeader").outerHeight();

			if($.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
			{
				iCMVTableRowHeight = (iCMVMonthTableHeight - iCMVTableHeaderRowHeight) / to.tv.iWkInMonth;

				iDayNumberHeight = $(to.elem).find(".cmvDayNumber").height() + 2;
				iDisplayAllDayEventsButtonHeight = $(to.elem).find(".cmvDisplayAllEvents").height();
				iMaxNumberSectionHeight = (iDayNumberHeight > iDisplayAllDayEventsButtonHeight) ? iDayNumberHeight : iDisplayAllDayEventsButtonHeight;
				iAvailableHeightForEvents = iCMVTableRowHeight - iMaxNumberSectionHeight;
			}
			else
			{
				if(to.setting.hideExtraEvents)
					iCMVTableRowHeight = (iCMVMonthTableHeight - iCMVTableHeaderRowHeight) / to.tv.iWkInMonth;
			}

			if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
			{
				if(to.tv.bDisABar || (to.tv.bDisFBar && $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
					iCMVMonthTableHeight += $.CalenStyle.extra.iBorderOverhead;
			}
			$(to.elem).find(".cmvTableContainerOuter").css({"height": iCMVMonthTableHeight, "width": iCMVMonthTableWidth});

			if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
			{
				iCMVMonthTableWidth -= $.CalenStyle.extra.iBorderOverhead;
				iCMVMonthTableHeight -= $.CalenStyle.extra.iBorderOverhead;
			}
			$(to.elem).find(".cmvTableContainer").css({"height": iCMVMonthTableHeight, "width": iCMVMonthTableWidth, "top": -$.CalenStyle.extra.iBorderOverhead, "left": -$.CalenStyle.extra.iBorderOverhead});

			iCMVMonthTableHeightModified = 0;
			if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
			{
				$(to.elem).find(".cmvMonthTableMain").css({"top": -$.CalenStyle.extra.iBorderOverhead});
				if(to.setting.hideExtraEvents)
				{
					$(to.elem).find(".cmvMonthTableRows").css({"height": iCMVTableRowHeight});

					to.tv.iMxEvRw = Math.floor((iCMVTableRowHeight - 30) / ($.CalenStyle.extra.iEventHeights[to.setting.visibleView]));

					iCMVMonthTableHeightModified = iCMVTableHeaderRowHeight + (to.tv.iWkInMonth * iCMVTableRowHeight);
					if(iCMVMonthTableHeightModified > iCMVMonthTableHeight)
						iCMVMonthTableHeight = iCMVMonthTableHeightModified;
				}
			}
			else
			{
				$(to.elem).find(".cmvMonthTableRows").css({"height": iCMVTableRowHeight});
				if(iCMVTableRowHeight < 60)
				{
					$(to.elem).find(".cmvMonthTableRows").css({"min-height": iCMVTableRowHeight});
				}

				if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
				{
					if($.cf.compareStrings(to.setting.eventIndicatorInMonthView, "Custom"))
					{
						iMonthCustomMaxHeight = iCMVTableRowHeight - iDayNumberHeight;
						$(to.elem).find(".cmvMonthTableRowCustom").css({"max-height": iMonthCustomMaxHeight});
					}
				}
			}

			$(to.elem).find(".cmvMonthTableMain").css({"height": iCMVMonthTableHeight, "width": iCMVMonthTableWidth});
			$(to.elem).find(".cdmvEventContMain").css({"height": iCMVMonthTableHeight, "width": iCMVMonthTableWidth});
		}

		//------------------------ Events Adjustment Start ---------------------------------

		var iHeightForEvents = iAvailableHeightForEvents / 2;
		$(to.elem).find(".cmvEventContSmall").css({"height": iHeightForEvents});
		$(to.elem).find(".cmvEventContAllDay").css({"height": iHeightForEvents});

		var iHeightOfAllDayEvents = to._getHeightForAllDayEventInMonthView(),
		iHeightOfSmallEvents = to._getHeightForSmallEventInMonthView(),
		iMarginForSmallEvent = to._getMarginValueForSmallEventInMonthView(),
		sMarginForSmallEvent = iMarginForSmallEvent + "px " + iMarginForSmallEvent + "px;";

		$(to.elem).find(".cmvEventSmall").css({"width": iHeightOfSmallEvents, "height": iHeightOfSmallEvents, "margin": sMarginForSmallEvent, "top": 0});
		$(to.elem).find(".cmvEventAllDay").css({"height": iHeightOfAllDayEvents});

		//------------------------ Events Adjustment End ---------------------------------

		if(iCalendarContWidth >= 550)
			$(to.elem).find(".cmvMonthTableRows .cmvWeekNumber").addClass("clickableLink");
		else
			$(to.elem).find(".cmvMonthTableRows .cmvWeekNumber").removeClass("clickableLink");

		//-----------------------------------------------------------------------------------

		var iMonthListHeight = $(to.elem).find(".calendarCont").height();
		if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
			iMonthListHeight -= $(to.elem).find(".cFilterBar").height();
		for(var iTempIndex = 0; iTempIndex < to.setting.sectionsList.length; iTempIndex++)
		{
			var sSectionName = to.setting.sectionsList[iTempIndex];
			if($.cf.compareStrings(sSectionName, "Calendar"))
			{
				iMonthListHeight -= ((($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").height() : 0) + 4);
				iMonthListHeight -= $(to.elem).find(".cmvMonthTable").height();
			}
			else if($.cf.compareStrings(sSectionName, "ActionBar"))
				iMonthListHeight -= ($(to.elem).find(".cActionBar").height() + 1);
		}
		$(to.elem).find(".cListOuterCont").css({"height": iMonthListHeight});

		var iCMVMonthTableLeft = $(to.elem).find(".cmvMonthTableMain").position().left,
		iCMVMonthTableTop = 0;
		if($(to.elem).find(".cContHeader").length > 0)
			iCMVMonthTableTop = $(to.elem).find(".cContHeader").position().top +  $(to.elem).find(".cContHeader").outerHeight() - 1;
		else
			iCMVMonthTableTop = $(to.elem).position().top;
		$(to.elem).find(".cdmvEventContMain").css({"left": iCMVMonthTableLeft, "top": -$.CalenStyle.extra.iBorderOverhead});

		//to.__adjustFontSize();
		to._adjustEventsInMonthView();
		to.setCalendarBorderColor();

		if($.cf.compareStrings(to.setting.visibleView, "MonthView"))
		{
			if(to.setting.isDragNDropInMonthView)
				to._makeEventDraggableInMonthView(".EventDraggable");
		}

		if($.cf.compareStrings(to.setting.visibleView, "MonthView") && $.cf.compareStrings(to.setting.actionOnDayClickInMonthView, "DisplayEventListDialog"))
		{
			if(iCalendarContWidth <= 400)
				$(to.elem).find(".cmvDisplayAllEvents").remove();
			else if($(to.elem).find(".cmvDisplayAllEvents").length === 0)
				$(to.elem).find(".cmvDay").prepend("<span class='cmvDisplayAllEvents'>..</span>");
		}
		//-----------------------------------------------------------------------------------
	},

	_getHeightForAllDayEventInMonthView: function()
	{
		var to = this;
		var iHeightForEvents = $(to.elem).find(".cmvEventContAllDay").height(),
		iHeightOfAllDayEvents = Math.floor(iHeightForEvents / 5);
		if(iHeightOfAllDayEvents < 2)
			iHeightOfAllDayEvents = 2;
		else if(iHeightOfAllDayEvents > 4)
			iHeightOfAllDayEvents = 4;
		return iHeightOfAllDayEvents;
	},

	_getHeightForSmallEventInMonthView: function()
	{
		var to = this;
		var iHeightForEvents = $(to.elem).find(".cmvEventContAllDay").height(),
		iHeightOfSmallEvents = Math.floor(iHeightForEvents / 2);
		if(iHeightOfSmallEvents < 2)
			iHeightOfSmallEvents = 2;
		else if(iHeightOfSmallEvents > 10)
			iHeightOfSmallEvents = 10;
		return iHeightOfSmallEvents;
	},

	_getMarginValueForSmallEventInMonthView: function()
	{
		var to = this;
		var iHeightOfSmallEvents = to._getHeightForSmallEventInMonthView();
		if(iHeightOfSmallEvents <= 3)
			return 1;
		else if(iHeightOfSmallEvents > 3)
			return 2;
	},

	_setMonthStrings: function()
	{
		var to = this;
		var bDatePickerView = $.cf.compareStrings(to.setting.visibleView, "DatePicker"),
		sUnderlineClass = bDatePickerView ? "cContHeaderLabelUnderline" : "",
		sClickableClass = bDatePickerView ? "clickableLink" : "";
		var sHeaderViewLabel = "<span class='cContHeaderLabelMonth "+sClickableClass+"'><span class='"+sUnderlineClass+"'><b>" + to.getDateInFormat({"iDate": {M: to.setting.selectedDate.getMonth()}}, "MMMM", false, true) + "</b></span></span>";
		sHeaderViewLabel += "<span class='cContHeaderLabelYear "+sClickableClass+"'><span class='"+sUnderlineClass+"'>" + to.getNumberStringInFormat(to.setting.selectedDate.getFullYear(), 0, true) + "</span></span>";

		if(to.setting.modifyHeaderViewLabels)
			to.setting.modifyHeaderViewLabels.call(to, to.tv.dVSDt, to.tv.dVEDt, to.setting.selectedDate, sHeaderViewLabel, to.setting.visibleView);

		$(to.elem).find(".cContHeaderLabel").html(sHeaderViewLabel);

		if($.cf.compareStrings(to.setting.visibleView, "DatePicker"))
		{
			$(to.elem).find(".cContHeaderLabelMonth").on($.CalenStyle.extra.sClickHandler, function(e)
			{
				e.stopPropagation();

				var oMonthPicker = new CalenStyle_MonthPicker(to, false);
				oMonthPicker.showOrHideMonthList();
			});

			$(to.elem).find(".cContHeaderLabelYear").on($.CalenStyle.extra.sClickHandler, function(e)
			{
				e.stopPropagation();

				var oYearPicker = new CalenStyle_YearPicker(to, false);
				oYearPicker.showOrHideYearList();
			});
		}
	},

	__goToPrevMonthView: function()
	{
		var to = this;
		if($(to.elem).find(".cmlvOuterCont").length <= 0 && $(to.elem).find(".cylvOuterCont").length <= 0)
		{
			if(to.setting.showTransition)
			{
				var iCMVMonthTableWidth = $(to.elem).find(".cmvMonthTableMain").width(),
				iCMVMonthTableLeft = $(to.elem).find(".cmvMonthTableMain").position().left,
				iCMVMonthTableTop = 0;
				if($.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
				{
					if($(to.elem).find(".cContHeader").length > 0)
						iCMVMonthTableTop = $(to.elem).find(".cContHeader").position().top + $(to.elem).find(".cContHeader").outerHeight() - 1;
					else
						iCMVMonthTableTop = $(to.elem).position().top;
				}

				var newElem = $(to.elem).find(".cmvMonthTableMain").clone();
				$(newElem).removeClass("cmvMonthTableMain").addClass("cmvMonthTableTemp");
				$(newElem).css({"position": "absolute", "top": iCMVMonthTableTop, "left": iCMVMonthTableLeft});
				$(to.elem).find(".cmvMonthTableMain").parent().append(newElem);
				$(newElem).css({"z-index": 101});
				iCMVMonthTableLeft = iCMVMonthTableLeft + iCMVMonthTableWidth;

				//-----------------------------------------------------------------------------------

				var iCDMVEventContLeft, iCDMVEventContWidth, newElemCont2;
				if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
				{
					iCDMVEventContLeft = $(to.elem).find(".cdmvEventContMain").position().left;
					iCDMVEventContWidth= $(to.elem).find(".cdmvEventContMain").width();
					newElemCont2 = $(to.elem).find(".cdmvEventContMain").clone();
					$(newElemCont2).removeClass("cdmvEventContMain").addClass("cdmvEventContTemp");
					$(to.elem).find(".cdmvEventContMain").parent().append(newElemCont2);
					$(newElemCont2).css({"z-index": 102});
					iCDMVEventContLeft = iCDMVEventContLeft + iCDMVEventContWidth;
					$(newElemCont2).animate({"left": iCDMVEventContLeft}, to.setting.transitionSpeed);
				}
				//-----------------------------------------------------------------------------------

				$(newElem).animate({"left": iCMVMonthTableLeft}, to.setting.transitionSpeed);

				setTimeout(function()
				{
					$(newElem).remove();
					if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
						$(newElemCont2).remove();
				}, to.setting.transitionSpeed);
			}

			to.tv.dCMDt = new Date(to.tv.dPMDt);
			to._setNextPreviousMonthDates();

			var iMonth = to.tv.dCMDt.getMonth(),
			iYear = to.tv.dCMDt.getFullYear(),
			iNumOfDays = to.__getNumberOfDaysOfMonth(iMonth, iYear),
			iDate = to.setting.selectedDate.getDate();
			if(iDate > iNumOfDays)
				iDate = iNumOfDays;

			var iHours = to.setting.selectedDate.getHours(),
			iMinutes = to.setting.selectedDate.getMinutes(),
			iSeconds = to.setting.selectedDate.getSeconds();

			to.setting.selectedDate = to.setDateInFormat({"iDate": {y: iYear, M: iMonth, d: iDate, H: iHours, m: iMinutes, s: iSeconds}}, "");
			to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

			to.tv.sLoadType = "Prev";
			to.updateMonthTableAndContents(true);
			setTimeout(function()
			{
				to.__reloadDatePickerContentOnNavigation();
			}, 10);
		}
	},

	__goToNextMonthView: function()
	{
		var to = this;
		if($(to.elem).find(".cmlvOuterCont").length <= 0 && $(to.elem).find(".cylvOuterCont").length <= 0)
		{
			if(to.setting.showTransition)
			{
				var iCMVMonthTableWidth = $(to.elem).find(".cmvMonthTableMain").width(),
				iCMVMonthTableLeft = $(to.elem).find(".cmvMonthTableMain").position().left,
				iCMVMonthTableTop = 0;
				if($.cf.compareStrings(to.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.visibleView, "DatePicker"))
				{
					if($(to.elem).find(".cContHeader").length > 0)
						iCMVMonthTableTop = $(to.elem).find(".cContHeader").position().top + $(to.elem).find(".cContHeader").outerHeight() - 1;
					else
						iCMVMonthTableTop = $(to.elem).position().top;
				}

				var newElem = $(to.elem).find(".cmvMonthTableMain").clone();
				$(newElem).removeClass("cmvMonthTableMain").addClass("cmvMonthTableTemp");
				$(newElem).css({"position": "absolute", "top": iCMVMonthTableTop, "left": iCMVMonthTableLeft});
				$(newElem).css({"z-index": 101});

				iCMVMonthTableLeft = iCMVMonthTableLeft - iCMVMonthTableWidth;
				$(to.elem).find(".cmvMonthTableMain").parent().append(newElem);

				//-----------------------------------------------------------------------------------

				var iCDMVEventContLeft, iCDMVEventContWidth, newElemCont2;
				if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
				{
					iCDMVEventContLeft = $(to.elem).find(".cdmvEventContMain").position().left;
					iCDMVEventContWidth= $(to.elem).find(".cdmvEventContMain").width();
					newElemCont2 = $(to.elem).find(".cdmvEventContMain").clone();
					$(newElemCont2).removeClass("cdmvEventContMain").addClass("cdmvEventContTemp");
					$(to.elem).find(".cdmvEventContMain").parent().append(newElemCont2);
					$(newElemCont2).css({"z-index": 102});
					iCDMVEventContLeft = iCDMVEventContLeft - iCDMVEventContWidth;
					$(newElemCont2).animate({"left": iCDMVEventContLeft}, to.setting.transitionSpeed);
				}

				//-----------------------------------------------------------------------------------

				$(newElem).animate({"left": iCMVMonthTableLeft}, to.setting.transitionSpeed);

				setTimeout(function()
				{
					$(newElem).remove();
					if($.cf.compareStrings(to.setting.visibleView, "DetailedMonthView"))
						$(newElemCont2).remove();
				}, to.setting.transitionSpeed);
			}

			to.tv.dCMDt = new Date(to.tv.dNMDt);
			to._setNextPreviousMonthDates();

			var iMonth = to.tv.dCMDt.getMonth(),
			iYear = to.tv.dCMDt.getFullYear(),
			iNumOfDays = to.__getNumberOfDaysOfMonth(iMonth, iYear),
			iDate = to.setting.selectedDate.getDate();
			if(iDate > iNumOfDays)
				iDate = iNumOfDays;

			var iHours = to.setting.selectedDate.getHours(),
			iMinutes = to.setting.selectedDate.getMinutes(),
			iSeconds = to.setting.selectedDate.getSeconds();

			to.setting.selectedDate = to.setDateInFormat({"iDate": {y: iYear, M: iMonth, d: iDate, H: iHours, m: iMinutes, s: iSeconds}}, "");
			to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

			to.tv.sLoadType = "Next";
			to.updateMonthTableAndContents(true);
			setTimeout(function()
			{
				to.__reloadDatePickerContentOnNavigation();
			}, 10);
		}
	},

	// Public Method
	highlightDatesInDatePicker: function(dArrDates)
	{
		var to = this;
		if(dArrDates !== null || dArrDates !== undefined)
		{
			to.tv.dHighlightDPV = dArrDates;
			to.__highlightDaysInDatePicker();
		}
	},

	__highlightDaysInDatePicker: function()
	{
		var to = this;
		$(".cmvDay").removeClass("cDatePickerHighlightBg");
		if(!($.cf.compareStrings(to.setting.parentObject.setting.visibleView, "MonthView") || $.cf.compareStrings(to.setting.parentObject.setting.visibleView, "DetailedMonthView")))
		{
			if(to.tv.dHighlightDPV !== null || to.tv.dHighlightDPV !== undefined)
			{
				for(var iTempIndex = 0; iTempIndex < to.tv.dHighlightDPV.length; iTempIndex++)
				{
					var dThisDate = to.tv.dHighlightDPV[iTempIndex],
					sDayId = "#cmvDay-"+dThisDate.getDate()+"-"+dThisDate.getMonth()+"-"+dThisDate.getFullYear();
					$(to.elem).find(sDayId).addClass("cDatePickerHighlightBg");
				}
			}
		}
	}

});

/*! ------------------------------------ CalenStyle Month View End ----------------------------------- */
