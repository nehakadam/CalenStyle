/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

/*! ---------------------------------- CalenStyle Task Planner View Start --------------------------------- */

//"use strict";

CalenStyle.prototype = $.extend(CalenStyle.prototype, {

	__updateTaskPlannerView: function(bLoadAllData)
	{
		var to = this;

		var sTemplate = "",
		iDateIndex, sDVDaysClass,
		sColumnClass = (to.tv.iNoVDayDis === 1) ? " ctpvSingleColumn" : " ctpvMultiColumn",
		sTempId;

		//---------------------------------------------------------------------------------------------

		sTemplate += "<thead>";
		sTemplate += "<tr class='ctpvTableRow1'>";
		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
		{
			sTempId = "ctpvDayColumn"+iDateIndex;
			sDVDaysClass = "ctpvTableColumns " + sTempId;
			sDVDaysClass += sColumnClass;
			if(iDateIndex === (to.tv.iNoVDayDis - 1))
				sDVDaysClass += " ctpvLastColumn";
			sTemplate += "<td class='"+sDVDaysClass+"'>&nbsp;</td>";
		}
		sTemplate += "</tr>";
		sTemplate += "</thead>";

		//---------------------------------------------------------------------------------------------

		sTemplate += "<tbody>";

		// -------------- Day Summary --------------------

		if(to.setting.addDaySummaryInTaskPlannerView)
		{
			sTemplate += "<tr class='ctpvTableRowSummary'>";
			for(iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
			{
				sTempId = "ctpvSummaryColumn"+iDateIndex;
				sDVDaysClass = "ctpvTableColumns";
				if(iDateIndex === (to.tv.iNoVDayDis - 1))
					sDVDaysClass += " ctpvLastColumn";
				sTemplate += "<td id='" + sTempId + "' class='"+sDVDaysClass+"'></td>";
			}
			sTemplate += "</tr>";
		}

		// ----------------------------------------------

		// -------------- Task Container --------------------

		sTemplate += "<tr class='ctpvTableRow2'>";
		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
		{
			sTempId = "ctpvDayColumn"+iDateIndex;
			sDVDaysClass = "ctpvTableColumns";
			if(iDateIndex === (to.tv.iNoVDayDis - 1))
				sDVDaysClass += " ctpvLastColumn";
			sTemplate += "<td id='"+sTempId+"' class='"+sDVDaysClass+"' title='"+to.getDateInFormat({"date": to.tv.dAVDt[iDateIndex]}, "dd-MMM-yyyy", to.setting.is24Hour, true)+"'> &nbsp; </td>";
		}
		sTemplate += "</tr>";

		// ----------------------------------------------

		sTemplate += "</tbody>";

		$(to.elem).find(".ctpvTableMain").html(sTemplate);

		//---------------------------------------------------------------------------------------------

		to._updateDaySummaryView();
		to._setDateStringsInHeaderOfTaskPlannerView();
		to._makeEventContDroppableInTaskPlannerView();
		to._takeActionOnDayClickInTaskPlannerView();
	},

	_setDateStringsInHeaderOfTaskPlannerView: function()
	{
		var to = this;

		for(var iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
		{
			var dTempDate = to.tv.dAVDt[iDateIndex];
			var bFullDateMatched = to.compareDates(dTempDate, $.CalenStyle.extra.dToday),

			/* -------------------------- Table Row 1 Start ------------------------------- */
			iDayOfWeek = dTempDate.getDay(),
			sRow1Id = ".ctpvTableRow1 .ctpvDayColumn"+iDateIndex,
			$oRow1 = $(to.elem).find(sRow1Id),
			iDay = dTempDate.getDate(),

			bWeekDayUnavailable = to.tv.bABsDays[iDayOfWeek] ? false : true,

			// Set Style For All-Day Restricted Section
			dArrTempResSec = to._getRestrictedSectionForCurrentView(dTempDate),
			iTempIndex, sBgColor = "", sResSecClass = "";

			for(iTempIndex = 0; iTempIndex < dArrTempResSec.length; iTempIndex++)
			{
				var dArrResSec = dArrTempResSec[iTempIndex],
				dTempResSecStart = new Date(dArrResSec.start),
				bCompStart = to.compareDates(dTempDate, dTempResSecStart) === 0,
				dTempResSecEnd = new Date(dArrResSec.end),
				bCompEnd = to.compareDates(dTempDate, dTempResSecEnd) === 0,
				iNumOfHours;

				if(!bCompStart)
					dTempResSecStart = to._normalizeDateTime(dTempDate, "START", "T");
				if(!bCompEnd)
					dTempResSecEnd = to._normalizeDateTime(dTempDate, "END", "T");

				iNumOfHours = Math.round((dTempResSecEnd.getTime() - dTempResSecStart.getTime()) / $.CalenStyle.extra.iMS.h);
				if(iNumOfHours > 23 || dArrResSec.isAllDay)
				{
					if($.cf.isValid(dArrResSec.backgroundColor))
						sBgColor = $.cf.addHashToHexcode(dArrResSec.backgroundColor);
					if($.cf.isValid(dArrResSec.class))
						sResSecClass = dArrResSec.class;
				}
			}

			if(bWeekDayUnavailable && bFullDateMatched === 0)
				$oRow1.addClass("cRestrictedTodayBg cTodayHighlightTextColor");
			else
			{
				if(bWeekDayUnavailable)
					$oRow1.addClass("cNonBusinessHoursBg");
				if(bFullDateMatched === 0)
					$oRow1.addClass("cTodayHighlightTextColor");

				// Set Style For All-Day Restricted Section
				if($.cf.isValid(sBgColor))
					$oRow1.css({"background": sBgColor});
				if($.cf.isValid(sResSecClass))
					$oRow1.addClass(sResSecClass);
			}

			if(bFullDateMatched === 0)
				$(to.elem).find(sRow1Id).html("<span class='ctpvDayColumnLeft'>"+to.setting.miscStrings.today+"</span><span class='ctpvDayColumnRight'>" + to.getNumberStringInFormat(iDay, 0, true) + "</span>");
			else
				$(to.elem).find(sRow1Id).html("<span class='ctpvDayColumnLeft'>" + to.getDateInFormat({"iDate": {D: iDayOfWeek}}, "DDD", false, true) + "</span><span class='ctpvDayColumnRight'>" + to.getNumberStringInFormat(iDay, 0, true) + "</span>");

			/* -------------------------- Table Row 1 End ------------------------------- */

			/* -------------------------- Table Row 2 Start ---------------------------- */
			var sRow2Id = ".ctpvTableRow2 #ctpvDayColumn"+iDateIndex,
			$oRow2 = $(to.elem).find(sRow2Id);
			if(bWeekDayUnavailable && bFullDateMatched === 0)
				$oRow2.addClass("cRestrictedTodayBg cTodayHighlightTextColor");
			else
			{
				if(bWeekDayUnavailable)
					$oRow2.addClass("cNonBusinessHoursBg");
				if(bFullDateMatched === 0)
					$oRow2.addClass("cTodayHighlightTextColor");

				// Set Style For All-Day Restricted Section
				if($.cf.isValid(sBgColor))
					$oRow2.css({"background": sBgColor});
				if($.cf.isValid(sResSecClass))
					$oRow2.addClass(sResSecClass);
			}
			/* -------------------------- Table Row 2 End ------------------------------- */
		}

		var oDVStart = to.getDateInFormat({"date": to.tv.dVSDt}, "object", false, true),
		oDVEnd = to.getDateInFormat({"date": to.tv.dVEDt}, "object", false, true);

		var sHeaderViewLabel;
		if($.cf.compareStrings(to.setting.TaskPlannerViewDuration, "CustomDays") && to.setting.daysInTaskPlannerView === 1)
			sHeaderViewLabel = "<b>" + to.getDateInFormat({"iDate": oDVStart}, "DDDD", false, true) + " " + to.getDateInFormat({"iDate": oDVEnd}, "MMMM", false, true) + " " + to.getNumberStringInFormat(oDVEnd.d, 0, true) + "</b>  " + to.getNumberStringInFormat(oDVEnd.y, 0, true);
		else
		{
			if(oDVStart.y === oDVEnd.y)
			{
				if(oDVStart.M === oDVEnd.M)
					sHeaderViewLabel = "<b>" + to.getDateInFormat({"iDate": oDVStart}, "MMM", false, true) + " " + to.getNumberStringInFormat(oDVStart.d, 0, true) + "</b>  -  <b>" + to.getNumberStringInFormat(oDVEnd.d, 0, true) + "</b>  " + to.getNumberStringInFormat(oDVEnd.y, 0, true);
				else
					sHeaderViewLabel = "<b>" + to.getDateInFormat({"iDate": oDVStart}, "MMM", false, true) + "  " + to.getNumberStringInFormat(oDVStart.d, 0, true) + "</b>  -  <b>" + to.getDateInFormat({"iDate": oDVEnd}, "MMM", false, true) + " " + to.getNumberStringInFormat(oDVEnd.d, 0, true) + "</b>  " + to.getNumberStringInFormat(oDVEnd.y, 0, true);
			}
			else
				sHeaderViewLabel = "<b>" + to.getDateInFormat({"iDate": oDVStart}, "MMM", false, true) + "  " + to.getNumberStringInFormat(oDVStart.d, 0, true) + "</b>  " + to.getNumberStringInFormat(oDVStart.y, 0, true) + "  -  <b>" + to.getDateInFormat({"iDate": oDVEnd}, "MMM", false, true) + " " + to.getNumberStringInFormat(oDVEnd.d, 0, true) + "</b>  " + to.getNumberStringInFormat(oDVEnd.y, 0, true);
		}

		if(to.setting.modifyHeaderViewLabels)
			to.setting.modifyHeaderViewLabels.call(to, to.tv.dVSDt, to.tv.dVEDt, to.setting.selectedDate, sHeaderViewLabel, to.setting.visibleView);

		$(to.elem).find(".cContHeaderLabel").html(sHeaderViewLabel);
	},

	_takeActionOnDayClickInTaskPlannerView: function()
	{
		var to = this;

		$(to.elem).find(".ctpvTableRow2 .ctpvTableColumns").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			var pClickedAt = {};
			pClickedAt.x = e.pageX || e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
			pClickedAt.y = e.pageY || e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;

			var iDayIndex = parseInt($(this).attr("id").replace("ctpvDayColumn", "")),
			dSelectedDateTime = to.tv.dAVDt[iDayIndex];

			if(to.setting.cellClicked)
				to.setting.cellClicked.call(to, to.setting.visibleView, dSelectedDateTime, true, pClickedAt);
		});
	},

	__goToPrevTaskPlannerView: function()
	{
		var to = this;

		if(to.setting.showTransition)
		{
			//-----------------------------------------------------------------------------------
			var $ocCTPVTableMain = $(to.elem).find(".ctpvTableMain"),
			ictpvTableWidth = $ocCTPVTableMain.width(),
			ictpvTableLeft = $ocCTPVTableMain.position().left,
			ictpvTableTop = 0;
			if($(to.elem).find(".cContHeader").length > 0)
				ictpvTableTop = $(to.elem).find(".cContHeader").position().top +  $(to.elem).find(".cContHeader").outerHeight() - 1;
			else
				ictpvTableTop = $(to.elem).position().top;

			var oNewElem = $ocCTPVTableMain.clone();
			$(oNewElem).removeClass("ctpvTableMain").addClass("ctpvTableTemp");
			$(oNewElem).css({"position": "absolute", "top": ictpvTableTop, "left": ictpvTableLeft});
			$ocCTPVTableMain.parent().append(oNewElem);

			ictpvTableLeft = ictpvTableLeft + ictpvTableWidth;

			$(oNewElem).animate({"left": ictpvTableLeft}, to.setting.transitionSpeed);

			setTimeout(function()
			{
				$(to.elem).find(".ctpvTableTemp").remove();
			}, to.setting.transitionSpeed);

			//-----------------------------------------------------------------------------------
		}

		var iCurrentDateMS;
		if(to.setting.navigateOneDayInTaskPlannerView)
		{
			iCurrentDateMS = to.tv.dVEDt.getTime();
			iCurrentDateMS -= $.CalenStyle.extra.iMS.d;
		}
		else
		{
			iCurrentDateMS = to.tv.dVSDt.getTime();
			if(to.setting.daysInTaskPlannerView === 7)
				iCurrentDateMS -= (to.tv.iNoVDay * $.CalenStyle.extra.iMS.d);
			else
				iCurrentDateMS -= $.CalenStyle.extra.iMS.d;
		}

		to.setting.selectedDate = to.setDateInFormat({"date": new Date(iCurrentDateMS)}, "START");
		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.sLoadType = "Prev";
		to.__reloadCurrentView(false, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	__goToNextTaskPlannerView: function()
	{
		var to = this;

		if(to.setting.showTransition)
		{
			//-----------------------------------------------------------------------------------

			var $ocCTPVTableMain = $(to.elem).find(".ctpvTableMain"),
			ictpvTableWidth = $ocCTPVTableMain.width(),
			ictpvTableLeft = $ocCTPVTableMain.position().left,
			ictpvTableTop = 0;
			if($(to.elem).find(".cContHeader").length > 0)
				ictpvTableTop = $(to.elem).find(".cContHeader").position().top +  $(to.elem).find(".cContHeader").outerHeight() - 1;
			else
				ictpvTableTop = $(to.elem).position().top;

			var oNewElem = $ocCTPVTableMain.clone();
			$(oNewElem).removeClass("ctpvTableMain").addClass("ctpvTableTemp");
			$(oNewElem).css({"position": "absolute", "top": ictpvTableTop, "left": ictpvTableLeft});
			$ocCTPVTableMain.parent().append(oNewElem);

			ictpvTableLeft = ictpvTableLeft - ictpvTableWidth;

			$(oNewElem).animate({"left": ictpvTableLeft}, to.setting.transitionSpeed);

			setTimeout(function()
			{
				$(to.elem).find(".ctpvTableTemp").remove();
			}, to.setting.transitionSpeed);

			//-----------------------------------------------------------------------------------
		}

		var iCurrentDateMS;
		if(to.setting.navigateOneDayInTaskPlannerView)
		{
			iCurrentDateMS = to.tv.dVSDt.getTime();
			iCurrentDateMS += $.CalenStyle.extra.iMS.d;
		}
		else
		{
			iCurrentDateMS = to.tv.dVEDt.getTime();
			iCurrentDateMS += $.CalenStyle.extra.iMS.d;
		}
		to.setting.selectedDate = to.setDateInFormat({"date": new Date(iCurrentDateMS)}, "START");

		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");
		to.tv.sLoadType = "Next";
		to.__reloadCurrentView(false, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	__adjustTaskPlannerView: function(bIsResized)
	{
		var to = this;

		var ictpvCalendarContMaxHeight = $(to.elem).find(".ctpvCalendarCont").css("max-height");
		ictpvCalendarContMaxHeight = parseInt(ictpvCalendarContMaxHeight.replace("px", "")) || 0;
		var ictpvCalendarContMinHeight = $(to.elem).find(".ctpvCalendarCont").css("min-height");
		ictpvCalendarContMinHeight = parseInt(ictpvCalendarContMinHeight.replace("px", "")) || 0;

		if(ictpvCalendarContMaxHeight > 0 && $(to.elem).height() > ictpvCalendarContMaxHeight)
			$(to.elem).css({"height": ictpvCalendarContMaxHeight});
		else if(ictpvCalendarContMinHeight > 0 && $(to.elem).height() < ictpvCalendarContMinHeight)
			$(to.elem).css({"height": ictpvCalendarContMinHeight});
		if(to.tv.iCalHeight !== 0)
			$(to.elem).css({"height": to.tv.iCalHeight});

		var bIsValidView = ($(to.elem).find(".ctpvCalendarCont").length > 0) ? true : false;
		if(bIsValidView && !to.tv.bDVDrgEv && !to.tv.bDVResEv)
		{
			var iCalendarContWidth = $(to.elem).find(".calendarCont").parent().outerWidth(),
			iCalendarContHeight = $(to.elem).find(".calendarCont").outerHeight();

			if(to.tv.bDisFBar)
			{
				if($.cf.compareStrings(to.setting.filterBarPosition, "Left") || $.cf.compareStrings(to.setting.filterBarPosition, "Right"))
					iCalendarContWidth -= to.setting.filterBarWidth;
				else if($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom"))
				{
					var iTempFilterBarWidth = iCalendarContWidth;
					$(to.elem).find(".cFilterBar").css({"width": iTempFilterBarWidth});
					iCalendarContHeight -= $(to.elem).find(".cFilterBar").height();
				}
			}
			$(to.elem).find(".calendarContInner").css({"width": iCalendarContWidth, "height": iCalendarContHeight});

			to.__adjustHeader();

			if($.cf.compareStrings(to.setting.filterBarPosition, "Right"))
				$(to.elem).find(".cFilterBar").css({"left": iCalendarContWidth});

			var ictpvContRow2Width = iCalendarContWidth,
			icContHeaderWidth = iCalendarContWidth;
			if($(to.elem).find(".cContHeader").length > 0)
				$(to.elem).find(".cContHeader").css({"width": icContHeaderWidth});

			var ictpvTableWidth = iCalendarContWidth,
			icContHeaderHeight = ($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerHeight() : 0;

			if(to.tv.bDisABar)
				iCalendarContHeight -= $(to.elem).find(".cActionBar").height();

			var ictpvTableHeight = iCalendarContHeight - icContHeaderHeight;
			if(!to.tv.bDisABar || !(to.tv.bDisFBar && $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
				ictpvTableHeight += $.CalenStyle.extra.iBorderOverhead;
			else
				ictpvTableHeight -= $.CalenStyle.extra.iBorderOverhead;

			if(to.setting.fixedHeightOfTaskPlannerView)
			{
				$(to.elem).find(".ctpvTableMain").css({"height": ictpvTableHeight, "width": ictpvTableWidth});

				var ictpvTableBodyHeight = ictpvTableHeight - $(to.elem).find(".ctpvTableRow1").height();
				$(to.elem).find(".ctpvTableMain tbody").css({"height": ictpvTableBodyHeight, "width": ictpvTableWidth});

				var ictpvTableRow2Height = ictpvTableBodyHeight - $(to.elem).find(".ctpvTableRowSummary").height();
				$(to.elem).find(".ctpvTableRow2").css({"height": (ictpvTableRow2Height - 1)});

				var ictpvTableRow1Width = $(to.elem).find(".ctpvTableMain tbody").width() - 2;
				$(to.elem).find(".ctpvTableMain thead").css({"width": ictpvTableRow1Width});
			}
			else
			{
				ictpvTableHeight = $(to.elem).find(".ctpvTableRow1").height() + $(to.elem).find(".ctpvTableRow2").height() + $(to.elem).find(".ctpvTableRowSummary").height();
				$(to.elem).find(".ctpvTableMain").css({"height": ictpvTableHeight, "width": ictpvTableWidth});

				iCalendarContHeight = ictpvTableHeight;
				iCalendarContHeight += $(to.elem).find(".cContHeader").height();
				if(to.tv.bDisABar)
					iCalendarContHeight += $(to.elem).find(".cActionBar").height();
				$(to.elem).find(".calendarContInner").css({"height": iCalendarContHeight});

				if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
					iCalendarContHeight += $(to.elem).find(".cFilterBar").height();
				$(to.elem).css({"height": iCalendarContHeight});
			}

			var iBorderOverheadAllDays = to.tv.iNoVDay * $.CalenStyle.extra.iBorderOverhead;

			var ictpvTableColumnsWidth = (ictpvContRow2Width - iBorderOverheadAllDays) / (to.tv.iNoVDayDis);
			$(to.elem).find(".ctpvTableColumns").css({"width": ictpvTableColumnsWidth});

			to.tv.fADVDayLftPos = [];
			for(var iWeekDayIndex = 0; iWeekDayIndex < to.tv.iNoVDayDis; iWeekDayIndex++)
			{
				var fLeftPos = $(to.elem).find(".ctpvTableRow2 #ctpvDayColumn"+iWeekDayIndex).position().left;
				to.tv.fADVDayLftPos.push(fLeftPos);
			}
		}

		if(to.setting.isDragNDropInTaskPlannerView && $.cf.isValid(bIsResized) && bIsResized)
		{
			if($(to.elem).find(".ctpvEvent").hasClass("ui-draggable"))
				$(to.elem).find(".ctpvEvent").draggable("destroy");
			$(to.elem).find(".ctpvEvent").removeClass("ui-draggable-dragging");
			to._makeEventDraggableInTaskPlannerView(".EventDraggable");
		}
	},

	__addEventsInTaskPlannerView: function()
	{
		var to = this;
		if($(to.elem).find(".ctpvTableRow2"))
			$(to.elem).find(".ctpvTableRow2 td").html("");

		var oArrTempEvents = to.getArrayOfEventsForView(to.tv.dVSDt, to.tv.dVEDt),
		bHideEventIcon = $.cf.isValid(to.setting.hideEventIcon[to.setting.visibleView]) ? to.setting.hideEventIcon[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventIcon.Default) ? to.setting.hideEventIcon.Default : false,
		bHideEventTime = $.cf.isValid(to.setting.hideEventTime[to.setting.visibleView]) ? to.setting.hideEventTime[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventTime.Default) ? to.setting.hideEventTime.Default : false;

		to.tv.bAWkRw = [];

		if(oArrTempEvents.length > 0)
		{
			for(var iEventIndex = 0; iEventIndex < oArrTempEvents.length; iEventIndex++)
			{
				var oEvent = oArrTempEvents[iEventIndex],
				dStartDateTime = null, dEndDateTime = null, bIsAllDay = 0,
				sTitle = "", sDesc = "", sType = "", sURL = "", bDragNDrop = false, bIsMarked = false,
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

				if(oEvent.isDragNDropInTaskPlannerView !== null)
					bDragNDrop = oEvent.isDragNDropInTaskPlannerView;

				if(oEvent.isMarked !== null)
					bIsMarked = oEvent.isMarked;

				if(bIsMarked)
					bIsAllDay = true;

				var iArrTempNum = to.getNumberOfDaysOfEvent(bIsAllDay, dStartDateTime, dEndDateTime, true, true, true),
				iNumOfEventElements = iArrTempNum[0],
				iNumberOfHours = iArrTempNum[1];

				if(iNumOfEventElements > 0)
				{
					var sDayId = "", iColumn;
					var iNumOfSegs = iNumOfEventElements, iNumOfHours, iNumOfDays,
					sDataDroppableId, sDateTimeString,
					dTempStartDateTime = new Date(dStartDateTime),
					dTempEndDateTime = new Date(dEndDateTime);

					if(to.compareDates(dStartDateTime, to.tv.dVSDt) < 0 && Math.abs(to.__getDifference("m", to.tv.dVSDt, dStartDateTime)) > 1)
						dTempStartDateTime = new Date(to.tv.dVSDt);
					if(to.compareDates(to.tv.dVEDt, dEndDateTime) < 0 && Math.abs(to.__getDifference("m", to.tv.dVEDt, dEndDateTime)) > 1)
						dTempEndDateTime = new Date(to.tv.dVEDt);

					var dTempSDT = new Date(dTempStartDateTime),
					bActualStartDate = true;
					while(!to.__findWhetherDateIsVisibleInCurrentView(dTempSDT, (bIsAllDay || iNumberOfHours > 23), dTempStartDateTime, dTempEndDateTime))
					{
						dTempSDT.setDate(dTempSDT.getDate() + 1);
						bActualStartDate = false;
						if(to.compareDates(dTempSDT, dTempEndDateTime) > 0)
							break;
					}
					dTempStartDateTime = new Date(dTempSDT);

					iNumOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dTempStartDateTime, dTempEndDateTime, true, true, bActualStartDate);
					iNumOfSegs = iNumOfDays[0];
					iNumOfHours = iNumOfDays[1];

					if(iNumOfHours > 0)
					{
						var sEventClass = "ctpvEvent ";

						var sEventColor = oEvent.backgroundColor;
						sEventColor = ($.cf.compareStrings(sEventColor, "") || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;
						var sEventBorderColor = oEvent.borderColor || $.cf.addHashToHexcode(to.setting.borderColor);
						sEventBorderColor = ($.cf.compareStrings(sEventBorderColor, "") || $.cf.compareStrings(sEventBorderColor, "transparent")) ? "transparent" : sEventBorderColor;
						var sEventTextColor = oEvent.textColor || $.cf.addHashToHexcode(to.setting.textColor);
						sEventTextColor = ($.cf.compareStrings(sEventTextColor, "") || $.cf.compareStrings(sEventTextColor, "transparent")) ? $.cf.addHashToHexcode(to.setting.textColor) : sEventTextColor;
						var sNonAllDayEventTextColor = $.cf.isValid(oEvent.nonAllDayEventsTextColor) ? oEvent.nonAllDayEventsTextColor : oEvent.backgroundColor;
						sNonAllDayEventTextColor = (!$.cf.isValid(sNonAllDayEventTextColor) || $.cf.compareStrings(sNonAllDayEventTextColor, "transparent")) ? oEvent.backgroundColor : sNonAllDayEventTextColor;

						var sColorStyle = "", sEventIconStyle = "",
						sIcon = "";

						if(bIsMarked)
						{
							if(oEvent.fromSingleColor)
							{
								sColorStyle += "border-color: " + sEventTextColor + "; ";
								sEventIconStyle = "background: " + sEventTextColor + "; color: #FFFFFF";
							}
							else
							{
								sColorStyle += "border-color: " + sEventColor + "; ";
								sEventIconStyle = "background: " + sEventColor + "; color: " + sEventTextColor;
							}
						}
						else
						{
							sColorStyle += "border-color: " + sEventTextColor + "; ";
							sEventIconStyle = "color: " + sEventTextColor + "; ";
						}

						if(bIsMarked)
							sIcon = ($.cf.isValid(oEvent.icon) && oEvent.icon !== "Dot") ? oEvent.icon : "cs-icon-Mark";
						else
							sIcon = $.cf.isValid(oEvent.icon) ? oEvent.icon : to.setting.eventIcon;

						if(to.compareDates(dEndDateTime, to.tv.dAVDt[0]) < 0)
							sEventClass += ("cBlurredEvent ");
						if(bDragNDrop)
							sEventClass += ("EventDraggable cDragNDrop ");
						if(to.setting.isTooltipInTaskPlannerView)
							sEventClass += ("cEventTooltip ");
						sEventClass += sId;
						if(bIsMarked)
							sEventClass += " cMarkedDayEvent";

						iColumn = to._getDayNumberFromDateInTaskPlannerView(dTempStartDateTime);

						var dTemp = new Date(dTempStartDateTime);
						for(var iEventSegIndex = 1; iEventSegIndex <= iNumOfSegs; iEventSegIndex++)
						{
							sDateTimeString = to.getEventDateTimeDataForTaskPlannerView(dStartDateTime, dEndDateTime, bIsAllDay, dTemp);
							sDayId = "#ctpvDayColumn"+iColumn;

							var sEventSegId = sId + "-" + iEventSegIndex;

							//--------------------------- Add Event Start -----------------------------

							sDataDroppableId = $.cf.isValid(sDroppableId) ? " data-droppableid='" + sDroppableId + "'" : "";

							var sTemplate = "<div id='" + sEventSegId + "' class='" + sEventClass + "' style='" + sColorStyle + "' " + sDataDroppableId + " title='' data-id='" + oEvent.calEventId + "'>";

							sTemplate += "<a class='cEventLink'>";

							sTemplate += "<div class='ctpvEventTitle'>" + sTitle + "</div>";

							sTemplate += "<div class='ctpvEventExtra'>";

							if($.cf.isValid(oEvent.status))
								sTemplate += "<span class='ctpvEventStatus' style='background: " + oEvent.statusColor + ";'></span>";

							if(bIsMarked)
							{
								if($.cf.isValid(oEvent.status))
									sTemplate += "<span class='ctpvEventStatus' style='border-color: " + oEvent.statusColor + ";'></span>";

								//if(!bHideEventIcon && !$.cf.compareStrings(sIcon, "Dot"))
									sTemplate += "<span class='ctpvEventIcon "+sIcon+"' style='" + sEventIconStyle + "'></span>";
							}
							else
							{
								if(!bHideEventTime && bIsAllDay === false)
									sTemplate += "<span class='ctpvEventTime'>" + sDateTimeString + "</span>";

								if(!bHideEventIcon && !$.cf.compareStrings(sIcon, "Dot"))
									sTemplate += "<span class='ctpvEventIcon "+sIcon+"' style='" + sEventIconStyle + "'></span>";
							}

							sTemplate += "</div>";

							sTemplate += "</a>";

							sTemplate += "</div>";

							$(to.elem).find(".ctpvTableRow2 " + sDayId).append(sTemplate);

							var sIdElem = "#"+sEventSegId,
							$oSeg = $(to.elem).find(sIdElem),
							$oSegContent = $oSeg.find(".cEventLink");
							var oEventTooltip, sDateTime;
							oEventTooltip = {};
							sDateTime = to.getEventDateTimeString(dStartDateTime, dEndDateTime, bIsAllDay, "&&");
							var sArrDateTime = sDateTime.split("&&");
							oEventTooltip.title = sTitle;
							oEventTooltip.startDateTime = sArrDateTime[0];
							oEventTooltip.endDateTime = sArrDateTime[1];
							$oSeg.data("tooltipcontent", oEventTooltip);

							if(to.setting.eventRendered)
								to.setting.eventRendered.call(to, oEvent, $oSeg, $oSegContent, to.setting.visibleView, false);

							if($.cf.isValid(sURL) || to.setting.eventClicked)
							{
								$oSegContent.on($.CalenStyle.extra.sClickHandler, {"url": sURL, "eventId": oEvent.calEventId, "eventElemSelector": sIdElem, "view": "TaskPlannerView", "pluginId": to.tv.pluginId}, to.__bindClick);
							}
							//--------------------------- Add Event End -----------------------------

							iColumn++;
							dTemp = new Date(dTemp.getTime() + $.CalenStyle.extra.iMS.d);
							if(iEventSegIndex === 1)
								dTemp = to._normalizeDateTime(dTemp, "START", "T");
						}
					}
				}
			}

			if(to.setting.isTooltipInTaskPlannerView)
				to._addTooltipInTaskPlannerView(".cEventTooltip");

			if(to.setting.isDragNDropInTaskPlannerView)
				to._makeEventDraggableInTaskPlannerView(".EventDraggable");

			if(to.setting.eventsAddedInView)
				to.setting.eventsAddedInView.call(to, to.setting.visibleView, ".ctpvEvent");
		}
		else
			console.log("to._addEventsInMonthView - No Events");

		to._updateDaySummaryView();

		to.addRemoveViewLoader(false, "cEventLoaderBg");
		to.addRemoveLoaderIndicators(false, "cEventLoaderIndicator");
	},

	_makeEventContDroppableInTaskPlannerView: function()
	{
		var to = this;
		var $oElemDragged, sDroppableId,
		sEventId, sId, oDraggedEvent, sEventClass,
		dStartDateTime = null, dEndDateTime = null, bIsAllDay = 0,
		iArrNumOfDays, iNumOfDays, iNumOfHours, dNextDate, iDroppedDayIndex,
		bEventEntered = false, dStartDateAfterDrop = null, dEndDateAfterDrop = null,
		iElemIndex, iNextDay,
		sDroppedCellId;

		$(to.elem).find(".ctpvTableRow2 .ctpvTableColumns").droppable(
		{
			scope: "Events",

			over: function(event, ui)
			{
				$oElemDragged = $(ui.draggable);
				sEventId = $oElemDragged.attr("id");
				sId = $oElemDragged.attr("data-id");
				oDraggedEvent = to.getEventWithId(sId);
				sEventClass = ".Event-" + sId;
				dStartDateTime = null; dEndDateTime = null; bIsAllDay = false;
				sDroppedCellId = $(this).attr("id");

				if(oDraggedEvent.start !== null)
					dStartDateTime = oDraggedEvent.start;
				if(oDraggedEvent.end !== null)
					dEndDateTime = oDraggedEvent.end;
				if(oDraggedEvent.isAllDay !== null)
					bIsAllDay = oDraggedEvent.isAllDay;

				iArrNumOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dStartDateTime, dEndDateTime, true, false, true);
				iNumOfDays = iArrNumOfDays[0];
				iNumOfHours = iArrNumOfDays[1];

				iDroppedDayIndex = parseInt(sDroppedCellId.replace("ctpvDayColumn", ""));
				dNextDate = to.tv.dAVDt[iDroppedDayIndex];

				dStartDateAfterDrop = to.setDateInFormat({"iDate": {d: dNextDate.getDate(), M: dNextDate.getMonth(), y: dNextDate.getFullYear(), H: dStartDateTime.getHours(), m: dStartDateTime.getMinutes(), s: dStartDateTime.getSeconds()}}, "");
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

				$(to.elem).find(".ctpvTableColumns").removeClass("cActivatedCell");
				for(iElemIndex = 0; iElemIndex < iNumOfDays; iElemIndex++)
				{
					iNextDay = iDroppedDayIndex + iElemIndex;
					if(iNextDay <= (to.tv.dAVDt.length - 1))
					{
						$(to.elem).find(".ctpvTableRow2 #ctpvDayColumn"+iNextDay).addClass("cActivatedCell");
					}
				}
			},

			drop: function(event, ui)
			{
				$oElemDragged = $(ui.draggable);
				sEventId = $oElemDragged.attr("id");
				sId = $oElemDragged.attr("data-id");
				oDraggedEvent = to.getEventWithId(sId);
				sEventClass = ".Event-" + sId;
				dStartDateTime = null; dEndDateTime = null; bIsAllDay = false;
				sDroppedCellId = $(this).attr("id");

				if(sDroppedCellId === to.tv.draggableParent)
				{
					setTimeout(function()
					{
						$(sEventClass+".cEventBeingDragged").remove();
						$(sEventClass).removeClass("ui-draggable-dragging cEditingEvent cEditingEventUI");
					}, 300);

					to.tv.iTSEndEditing = $.cf.getTimestamp();
					return true;
				}

				if(oDraggedEvent.start !== null)
					dStartDateTime = oDraggedEvent.start;
				if(oDraggedEvent.end !== null)
					dEndDateTime = oDraggedEvent.end;
				if(oDraggedEvent.isAllDay !== null)
					bIsAllDay = oDraggedEvent.isAllDay;

				iArrNumOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dStartDateTime, dEndDateTime, true, false, true);
				iNumOfDays = iArrNumOfDays[0];
				iNumOfHours = iArrNumOfDays[1];

				iDroppedDayIndex = parseInt(sDroppedCellId.replace("ctpvDayColumn", ""));
				var dDroppedDate = new Date(to.tv.dAVDt[iDroppedDayIndex]);

				dStartDateAfterDrop = to.setDateInFormat({"iDate": {d: dDroppedDate.getDate(), M: dDroppedDate.getMonth(), y: dDroppedDate.getFullYear(), H: dStartDateTime.getHours(), m: dStartDateTime.getMinutes(), s: dStartDateTime.getSeconds()}}, "");
				dEndDateAfterDrop = new Date(dStartDateAfterDrop.getTime() + (dEndDateTime.getTime() - dStartDateTime.getTime()));

				if(to.tv.bChkDroppable)
				{
					$oElemDragged = $(to.elem).find("#" + sEventId + ".ui-draggable-dragging");
					sDroppableId = $oElemDragged.attr("data-droppableid");
					bEventEntered = to._findWhetherEventEnteredNonDroppableZone(dStartDateAfterDrop, dEndDateAfterDrop, bIsAllDay, iNumOfDays, sDroppableId);

					$oElemDragged.removeClass("cCursorNotAllowed");
					$oElemDragged.find(".cEventLink").removeClass("cCursorNotAllowed");
				}

				if(bEventEntered)
				{
					setTimeout(function()
					{
						if(to.tv.bChkDroppable)
							$oElemDragged.removeClass("cEditingEvent cEventBeingDragged ui-draggable-dragging");
						to.tv.iTSEndEditing = $.cf.getTimestamp();

						return false;
					}, 300);
				}
				else
				{
					var iComp = to.compareDates(dEndDateTime, $.CalenStyle.extra.dToday);
					if(iComp > 0)
						$(to.elem).find(sEventClass).css({"opacity": 1});
					else if(iComp < 0)
						$(to.elem).find(sEventClass).css({"opacity": 0.7});

					if(to.__updateEventWithId(sId, dStartDateAfterDrop, dEndDateAfterDrop))
					{
						to.__addEventsInTaskPlannerView();
						if(to.setting.addDaySummaryInTaskPlannerView)
							to.__adjustTaskPlannerView();
					}
					$(to.elem).find(".ctpvTableColumns").removeClass("cActivatedCell");
				}

				if(to.setting.saveChangesOnEventDrop)
					to.setting.saveChangesOnEventDrop.call(to, oDraggedEvent, dStartDateTime, dEndDateTime, dStartDateAfterDrop, dEndDateAfterDrop);

				to.tv.iTSEndEditing = $.cf.getTimestamp();
			}
		});
	},

	_makeEventDraggableInTaskPlannerView: function(sClass)
	{
		var to = this;
		var iEventHeight = $(to.elem).find(".ctpvEvent").height(),
		iEventWidth = $(to.elem).find("#ctpvDayColumn0").width(),
		iTimeSlotWidth = iEventWidth + 1,

		iCalendarLeft = $(to.elem).position().left,
		iCalendarMarginLeft = $(to.elem).css("margin-left");
		iCalendarMarginLeft = parseInt(iCalendarMarginLeft.replace("px", ""));
		var iLeft = iCalendarLeft + iCalendarMarginLeft + $(to.elem).find(".ctpvTableMain").position().left,
		iX1 = iLeft,
		iX2 = iX1 + $(to.elem).find(".ctpvTableMain").width() - iEventWidth,

		iCalendarTop = $(to.elem).position().top,
		iCalendarMarginTop = $(to.elem).css("margin-top");
		iCalendarMarginTop = parseInt(iCalendarMarginTop.replace("px", ""));
		var iY1 = iCalendarTop + iCalendarMarginTop + $(to.elem).find(".ctpvTableMain").position().top;
		if(to.tv.bDisFBar && $.cf.compareStrings(to.setting.filterBarPosition, "Top"))
			iY1 += to.setting.filterBarHeight;
		var iY2 = iY1 + $(to.elem).find(".ctpvTableMain").height() - iEventHeight;

		iEventWidth = iEventWidth - 10;

		$(to.elem).find(sClass).draggable(
		{
			zIndex: 100,
			scope: "Events",
			grid: [iTimeSlotWidth, 1],
			containment: [iX1, iY1, iX2, iY2],
			scroll: false,
			cursor: "move",
			delay: 300,
			revertDuration: 300,

			start: function()
			{
				var $oElemDragged = $(this);

				to.tv.draggableParent = $oElemDragged.closest(".ctpvDayColumns").attr("id");

				if(!$oElemDragged.hasClass("cEventOnlyText"))
					$oElemDragged.addClass("cEditingEvent cEditingEventUI");
				else
					$oElemDragged.addClass("cEditingEvent");

				iEventWidth = $(to.elem).find(".ctpvTableColumns").width() - 10;
				$oElemDragged.css({"width": iEventWidth});
			},

			revert: function()
			{
				$(to.elem).find(".ctpvTableColumns").removeClass("cActivatedCell");

				return true;
			}
		});
	},

	_addTooltipInTaskPlannerView: function(sClass)
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

	//----------------------------------------------------------------------------

	_getDayNumberFromDateInTaskPlannerView: function(dThisDate)
	{
		var to = this;
		for(var iTempIndex = 0; iTempIndex < to.tv.dAVDt.length; iTempIndex++)
		{
			if(to.compareDates(dThisDate, to.tv.dAVDt[iTempIndex]) === 0)
				return iTempIndex;
		}
		return -1;
	},

	getEventDateTimeDataForTaskPlannerView: function(dEvStartDate, dEvEndDate, bIsAllDay, dThisDate)
	{
		var to = this;
		var sDateTimeString = "", sSeparator = "";

		if(bIsAllDay)
		{
			if(to.compareDates(dEvStartDate, dEvEndDate) === 0)
				sDateTimeString = "<span class='ctpvEventTimeTop ctpvEventTimeLabel'>"+to.setting.miscStrings.allDay+"</span>";
			else
				sDateTimeString = "<span class='ctpvEventTimeTop ctpvEventTimeLabel'>"+to.setting.miscStrings.allDay+"</span>" + sSeparator + "<span class='ctpvEventTimeBottom ctpvEventTimeDuration'> "+ ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dThisDate, dEvEndDate, "d", false, false) : to.setting.duration.call(to, dThisDate, dEvEndDate, "d")) +"</span>";
		}
		else
		{
			if(to.compareDates(dEvStartDate, dEvEndDate) === 0)
				sDateTimeString = "<span class='ctpvEventTimeTop'>" + to.getDateInFormat({"date": dEvStartDate}, "hh:mm", to.setting.is24Hour, true) + "</span>" + sSeparator + "<span class='ctpvEventTimeBottom ctpvEventTimeDuration'> " + ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dEvStartDate, dEvEndDate, "dhm", false, false) : to.setting.duration.call(to, dEvStartDate, dEvEndDate, "dhm")) + "</span>";
			else
			{
				if(to.compareDates(dEvStartDate, dThisDate) === 0)
					sDateTimeString = "<span class='ctpvEventTimeTop'>" + to.getDateInFormat({"date": dEvStartDate}, "hh:mm", to.setting.is24Hour, true) + "</span>" + sSeparator + "<span class='ctpvEventTimeBottom ctpvEventTimeDuration'> " + ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dEvStartDate, dEvEndDate, "dhm", false, false) : to.setting.duration.call(to, dEvStartDate, dEvEndDate, "dhm")) + "</span>";
				else if(to.compareDates(dEvEndDate, dThisDate) === 0)
					sDateTimeString = "<span class='ctpvEventTimeTop ctpvEventTimeLabel'>"+to.setting.miscStrings.ends+"</span>" + sSeparator + "<span class='ctpvEventTimeBottom'> " + to.getDateInFormat({"date": dEvEndDate}, "hh:mm", to.setting.is24Hour, true) + "</span>";
				else
					sDateTimeString = "<span class='ctpvEventTimeTop ctpvEventTimeLabel'>"+to.setting.miscStrings.allDay+"</span>" + sSeparator + "<span class='ctpvEventTimeBottom ctpvEventTimeDuration'> "+ ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dThisDate, dEvEndDate, "dhm", false, false) : to.setting.duration.call(to, dThisDate, dEvEndDate, "dhm"))+"</span>";
			}
		}
		return sDateTimeString;
	},

	_updateDaySummaryView: function()
	{
		var to = this;

		if(to.setting.addDaySummaryInTaskPlannerView)
		{
			for(var iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
			{
				to.setting.addDaySummaryInTaskPlannerView.call(to, to.tv.dAVDt[iDateIndex], $(to.elem).find("#ctpvSummaryColumn" + iDateIndex));
			}
		}
	},

	updateDaySummaryViewForDate: function(dThisDate)
	{
		var to = this;

		if(to.setting.addDaySummaryInTaskPlannerView)
		{
			var iDateIndex = to._getDayNumberFromDateInTaskPlannerView(dThisDate);
			if(iDateIndex !== -1)
			{
				to.setting.addDaySummaryInTaskPlannerView.call(to, dThisDate, $(to.elem).find("#ctpvSummaryColumn" + iDateIndex));
			}
		}
		else
			console.log("Please write a definition for addDaySummaryInTaskPlannerView callback function to update view for date");
	}

});

/*! ---------------------------------- CalenStyle Task Planner View End --------------------------------- */
