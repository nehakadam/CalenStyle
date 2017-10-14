/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

/*! ---------------------------------- CalenStyle Quick Agenda View Start --------------------------------- */

//"use strict";

CalenStyle.prototype = $.extend(CalenStyle.prototype, {

	__updateQuickAgendaView: function()
	{
		var to = this;

		var sTemplate = "",
		iDateIndex, sDVDaysClass,
		sColumnClass = (to.tv.iNoVDayDis === 1) ? " cqavSingleColumn" : " cqavMultiColumn";

		//---------------------------------------------------------------------------------------------

		sTemplate += "<thead>";
		sTemplate += "<tr class='cqavTableRow1'>";
		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
		{
			var sTempId = "cqavDayColumn"+iDateIndex;
			sDVDaysClass = "cqavTableColumns";
			sDVDaysClass += sColumnClass;
			if(iDateIndex === (to.tv.iNoVDayDis - 1))
				sDVDaysClass += " cqavLastColumn";
			sTemplate += "<td id='" + sTempId + "' class='"+sDVDaysClass+"'>&nbsp;</td>";
		}
		sTemplate += "</tr>";
		sTemplate += "</thead>";

		//---------------------------------------------------------------------------------------------

		sTemplate += "<tbody>";
		sTemplate += "<tr class='cqavTableRow2'>";
		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
		{
			var sDVDaysId = "cqavDayColumn"+iDateIndex;
			sDVDaysClass = "cqavTableColumns";
			if(iDateIndex === (to.tv.iNoVDayDis - 1))
				sDVDaysClass += " cqavLastColumn";
			sTemplate += "<td id='"+sDVDaysId+"' class='"+sDVDaysClass+"' title='"+to.getDateInFormat({"date": to.tv.dAVDt[iDateIndex]}, "dd-MMM-yyyy", to.setting.is24Hour, true)+"'> &nbsp; </td>";
		}
		sTemplate += "</tr>";
		sTemplate += "</tbody>";

		$(to.elem).find(".cqavTableMain").html(sTemplate);

		//---------------------------------------------------------------------------------------------

		to._setDateStringsInHeaderOfQuickAgendaView();
		to._makeEventContDroppableInQuickAgendaView();
		to._takeActionOnDayClickInQuickAgendaView();
	},

	_setDateStringsInHeaderOfQuickAgendaView: function()
	{
		var to = this;

		for(var iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
		{
			var dTempDate = to.tv.dAVDt[iDateIndex];
			var bFullDateMatched = to.compareDates(dTempDate, $.CalenStyle.extra.dToday),

			/* -------------------------- Table Row 1 Start ------------------------------- */
			iDayOfWeek = dTempDate.getDay(),
			sRow1Id = ".cqavTableRow1 #cqavDayColumn"+iDateIndex,
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
				$(to.elem).find(sRow1Id).html("<span class='cqavDayColumnLeft'>"+to.setting.miscStrings.today+"</span><span class='cqavDayColumnRight'>" + to.getNumberStringInFormat(iDay, 0, true) + "</span>");
			else
				$(to.elem).find(sRow1Id).html("<span class='cqavDayColumnLeft'>" + to.getDateInFormat({"iDate": {D: iDayOfWeek}}, "DDD", false, true) + "</span><span class='cqavDayColumnRight'>" + to.getNumberStringInFormat(iDay, 0, true) + "</span>");

			/* -------------------------- Table Row 1 End ------------------------------- */

			/* -------------------------- Table Row 2 Start ---------------------------- */
			var sRow2Id = ".cqavTableRow2 #cqavDayColumn"+iDateIndex,
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
		if($.cf.compareStrings(to.setting.quickAgendaViewDuration, "CustomDays") && to.setting.daysInQuickAgendaView === 1)
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

	_takeActionOnDayClickInQuickAgendaView: function()
	{
		var to = this;

		$(to.elem).find(".cqavContRow2Main").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			var pClickedAt = {};
			pClickedAt.x = e.pageX || e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
			pClickedAt.y = e.pageY || e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;

			var dSelectedDateTime = to._getDateBasedOnLeftPositionInQuickAgendaView(pClickedAt.x - $(this).offset().left);

			if(to.setting.cellClicked)
				to.setting.cellClicked.call(to, to.setting.visibleView, dSelectedDateTime, true, pClickedAt);
		});
	},

	__goToPrevQuickAgendaView: function()
	{
		var to = this;

		if(to.setting.showTransition)
		{
			//-----------------------------------------------------------------------------------
			var $ocCQAVTableMain = $(to.elem).find(".cqavTableMain"),
			icqavTableWidth = $ocCQAVTableMain.width(),
			icqavTableLeft = $ocCQAVTableMain.position().left,
			icqavTableTop = 0;
			if($(to.elem).find(".cContHeader").length > 0)
				icqavTableTop = $(to.elem).find(".cContHeader").position().top +  $(to.elem).find(".cContHeader").outerHeight() - 1;
			else
				icqavTableTop = $(to.elem).position().top;

			var newElem = $ocCQAVTableMain.clone();
			$(newElem).removeClass("cqavTableMain").addClass("cqavTableTemp");
			$(newElem).css({"position": "absolute", "top": icqavTableTop, "left": icqavTableLeft});
			$ocCQAVTableMain.parent().append(newElem);

			icqavTableLeft = icqavTableLeft + icqavTableWidth;

			//-----------------------------------------------------------------------------------

			var $ocCQAVContRow2Main = $(to.elem).find(".cqavContRow2Main"),
			icqavContRow2Left = $ocCQAVContRow2Main.position().left,
			icqavContRow2Width= $ocCQAVContRow2Main.width();

			var newElemCont2 = $ocCQAVContRow2Main.clone();
			$(newElemCont2).removeClass("cqavContRow2Main").addClass("cqavContRow2Temp");
			$ocCQAVContRow2Main.parent().append(newElemCont2);

			icqavContRow2Left = icqavContRow2Left + icqavContRow2Width;

			//-----------------------------------------------------------------------------------

			$(newElem).animate({"left": icqavTableLeft}, to.setting.transitionSpeed);
			$(newElemCont2).animate({"left": icqavContRow2Left}, to.setting.transitionSpeed);

			setTimeout(function()
			{
				$(to.elem).find(".cqavTableTemp").remove();
				$(to.elem).find(".cqavContRow2Temp").remove();
			}, to.setting.transitionSpeed);

			//-----------------------------------------------------------------------------------
		}

		var iCurrentDateMS;
		if(to.setting.navigateOneDayInQuickAgendaView)
		{
			iCurrentDateMS = to.tv.dVEDt.getTime();
			iCurrentDateMS -= $.CalenStyle.extra.iMS.d;
		}
		else
		{
			iCurrentDateMS = to.tv.dVSDt.getTime();
			if(to.setting.daysInQuickAgendaView === 7)
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

	__goToNextQuickAgendaView: function()
	{
		var to = this;

		if(to.setting.showTransition)
		{
			//-----------------------------------------------------------------------------------

			var $ocCQAVTableMain = $(to.elem).find(".cqavTableMain"),
			icqavTableWidth = $ocCQAVTableMain.width(),
			icqavTableLeft = $ocCQAVTableMain.position().left,
			icqavTableTop = 0;
			if($(to.elem).find(".cContHeader").length > 0)
				icqavTableTop = $(to.elem).find(".cContHeader").position().top +  $(to.elem).find(".cContHeader").outerHeight() - 1;
			else
				icqavTableTop = $(to.elem).position().top;

			var newElem = $ocCQAVTableMain.clone();
			$(newElem).removeClass("cqavTableMain").addClass("cqavTableTemp");
			$(newElem).css({"position": "absolute", "top": icqavTableTop, "left": icqavTableLeft});
			$ocCQAVTableMain.parent().append(newElem);

			icqavTableLeft = icqavTableLeft - icqavTableWidth;

			//-----------------------------------------------------------------------------------

			var $ocCQAVContRow2Main = $(to.elem).find(".cqavContRow2Main"),
			icqavContRow2Left = $ocCQAVContRow2Main.position().left,
			icqavContRow2Width= $ocCQAVContRow2Main.width();

			var newElemCont2 = $ocCQAVContRow2Main.clone();
			$(newElemCont2).removeClass("cqavContRow2Main").addClass("cqavContRow2Temp");
			$ocCQAVContRow2Main.parent().append(newElemCont2);

			icqavContRow2Left = icqavContRow2Left - icqavContRow2Width;

			//-----------------------------------------------------------------------------------

			$(newElem).animate({"left": icqavTableLeft}, to.setting.transitionSpeed);
			$(newElemCont2).animate({"left": icqavContRow2Left}, to.setting.transitionSpeed);

			setTimeout(function()
			{
				$(to.elem).find(".cqavTableTemp").remove();
				$(to.elem).find(".cqavContRow2Temp").remove();
			}, to.setting.transitionSpeed);

			//-----------------------------------------------------------------------------------
		}

		var iCurrentDateMS;
		if(to.setting.navigateOneDayInQuickAgendaView)
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

	__adjustQuickAgendaView: function(bIsResized)
	{
		var to = this;

		var icqavCalendarContMaxHeight = $(to.elem).find(".cqavCalendarCont").css("max-height");
		icqavCalendarContMaxHeight = parseInt(icqavCalendarContMaxHeight.replace("px", "")) || 0;
		var icqavCalendarContMinHeight = $(to.elem).find(".cqavCalendarCont").css("min-height");
		icqavCalendarContMinHeight = parseInt(icqavCalendarContMinHeight.replace("px", "")) || 0;

		if(icqavCalendarContMaxHeight > 0 && $(to.elem).height() > icqavCalendarContMaxHeight)
			$(to.elem).css({"height": icqavCalendarContMaxHeight});
		else if(icqavCalendarContMinHeight > 0 && $(to.elem).height() < icqavCalendarContMinHeight)
			$(to.elem).css({"height": icqavCalendarContMinHeight});
		if(to.tv.iCalHeight !== 0)
			$(to.elem).css({"height": to.tv.iCalHeight});

		var bIsValidView = ($(to.elem).find(".cqavCalendarCont").length > 0) ? true : false;
		if(bIsValidView && !to.tv.bDVDrgEv && !to.tv.bDVResEv)
		{
			var iCalendarContWidth = $(to.elem).find(".calendarCont").parent().outerWidth(),
			iCalendarContHeight = $(to.elem).find(".calendarCont").outerHeight(),

			iCalendarContInnerHeight = iCalendarContHeight;
			if(to.tv.bDisFBar)
			{
				if($.cf.compareStrings(to.setting.filterBarPosition, "Left") || $.cf.compareStrings(to.setting.filterBarPosition, "Right"))
					iCalendarContWidth -= to.setting.filterBarWidth;
				else if($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom"))
				{
					var iTempFilterBarWidth = iCalendarContWidth;
					$(to.elem).find(".cFilterBar").css({"width": iTempFilterBarWidth});
					iCalendarContInnerHeight -= $(to.elem).find(".cFilterBar").height();
				}
			}
			$(to.elem).find(".calendarContInner").css({"width": iCalendarContWidth, "height": iCalendarContInnerHeight});

			to.__adjustHeader();

			if($.cf.compareStrings(to.setting.filterBarPosition, "Right"))
				$(to.elem).find(".cFilterBar").css({"left": iCalendarContWidth});

			var icqavContRow2Left = 0,
			icqavContRow2Width = iCalendarContWidth,
			icContHeaderWidth = iCalendarContWidth;
			if($(to.elem).find(".cContHeader").length > 0)
				$(to.elem).find(".cContHeader").css({"width": icContHeaderWidth});

			var icqavTableWidth = iCalendarContWidth,
			icContHeaderHeight = ($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerHeight() : 0;

			if(to.tv.bDisABar)
				iCalendarContHeight -= $(to.elem).find(".cActionBar").height();
			if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
				iCalendarContHeight -= $(to.elem).find(".cFilterBar").height();

			var icqavTableHeight = iCalendarContHeight - icContHeaderHeight;
			if(!to.tv.bDisABar || !(to.tv.bDisFBar && $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
				icqavTableHeight += $.CalenStyle.extra.iBorderOverhead;
			else
				icqavTableHeight -= $.CalenStyle.extra.iBorderOverhead;
			$(to.elem).find(".cqavTableMain").css({"height": icqavTableHeight, "width": icqavTableWidth});

			var icqavContRow2Top = $(to.elem).find(".cqavTableMain").position().top + $(to.elem).find(".cqavTableRow1").outerHeight(),
			icqavContRow2Height = $(to.elem).find(".cqavTableRow2").height();
			$(to.elem).find(".cqavContRow2Main").css({"left": icqavContRow2Left, "top": icqavContRow2Top, "width": icqavContRow2Width, "height": icqavContRow2Height});

			var iBorderOverheadAllDays = to.tv.iNoVDay * $.CalenStyle.extra.iBorderOverhead;

			var icqavTableColumnsWidth = (icqavContRow2Width - iBorderOverheadAllDays) / (to.tv.iNoVDayDis);
			$(to.elem).find(".cqavTableColumns").css({"width": icqavTableColumnsWidth});

			to.tv.fADVDayLftPos = [];
			for(var iWeekDayIndex = 0; iWeekDayIndex < to.tv.iNoVDayDis; iWeekDayIndex++)
			{
				var fLeftPos = $(to.elem).find(".cqavTableRow2 #cqavDayColumn"+iWeekDayIndex).position().left;
				to.tv.fADVDayLftPos.push(fLeftPos);
			}
		}

		to._adjustEventsInQuickAgendaView();

		if(to.setting.isDragNDropInQuickAgendaView && $.cf.isValid(bIsResized) && bIsResized)
		{
			if($(to.elem).find(".cqavEvent").hasClass("ui-draggable"))
				$(to.elem).find(".cqavEvent").draggable("destroy");
			$(to.elem).find(".cqavEvent").removeClass("ui-draggable-dragging");
			to._makeEventDraggableInQuickAgendaView(".EventDraggable");
		}
	},

	__addEventsInQuickAgendaView: function()
	{
		var to = this;
		if($(to.elem).find(".cqavContRow2Main"))
			$(to.elem).find(".cqavContRow2Main").html("");

		var oArrTempEvents = to.getArrayOfEventsForView(to.tv.dVSDt, to.tv.dVEDt),
		bHideEventIcon = $.cf.isValid(to.setting.hideEventIcon[to.setting.visibleView]) ? to.setting.hideEventIcon[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventIcon.Default) ? to.setting.hideEventIcon.Default : false,
		bHideEventTime = $.cf.isValid(to.setting.hideEventTime[to.setting.visibleView]) ? to.setting.hideEventTime[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventTime.Default) ? to.setting.hideEventTime.Default : false,
		sEventTimeFormat = to.setting.is24Hour ? "HH:mm" : "h[:m]sm";

		to.tv.bAWkRw = [];

		if(oArrTempEvents.length > 0)
		{
			var iEventHeightForAllEvents = $.CalenStyle.extra.iEventHeights[to.setting.visibleView];

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

				if(oEvent.isDragNDropInQuickAgendaView !== null)
					bDragNDrop = oEvent.isDragNDropInQuickAgendaView;

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
					sPartialEvent = "", sDataDroppableId,
					dTempStartDateTime = new Date(dStartDateTime),
					dTempEndDateTime = new Date(dEndDateTime);

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

					iColumn = to._getDayNumberFromDateInQuickAgendaView(dTempStartDateTime);
					sDayId = "#cqavDayColumn"+iColumn;
					iNumOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dTempStartDateTime, dTempEndDateTime, true, true, bActualStartDate);
					iNumOfSegs = iNumOfDays[0];
					iNumOfHours = iNumOfDays[1];

					if(iNumOfHours > 0)
					{
						var sEventClass = "cqavEvent ";

						var sEventColor = oEvent.backgroundColor;
						sEventColor = ($.cf.compareStrings(sEventColor, "") || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;
						var sEventBorderColor = oEvent.borderColor || $.cf.addHashToHexcode(to.setting.borderColor);
						sEventBorderColor = ($.cf.compareStrings(sEventBorderColor, "") || $.cf.compareStrings(sEventBorderColor, "transparent")) ? "transparent" : sEventBorderColor;
						var sEventTextColor = oEvent.textColor || $.cf.addHashToHexcode(to.setting.textColor);
						sEventTextColor = ($.cf.compareStrings(sEventTextColor, "") || $.cf.compareStrings(sEventTextColor, "transparent")) ? $.cf.addHashToHexcode(to.setting.textColor) : sEventTextColor;
						var sNonAllDayEventTextColor = $.cf.isValid(oEvent.nonAllDayEventsTextColor) ? oEvent.nonAllDayEventsTextColor : oEvent.backgroundColor;
						sNonAllDayEventTextColor = (!$.cf.isValid(sNonAllDayEventTextColor) || $.cf.compareStrings(sNonAllDayEventTextColor, "transparent")) ? oEvent.backgroundColor : sNonAllDayEventTextColor;

						var sColorStyle = "", sEventIconStyle = "", sLinkStyle = "",
						sPartialEventStyle = "", sIcon = "";

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
								}
								else
								{
									sEventBorderColor = sEventColor;

									sColorStyle += "background: " + $.cf.getRGBAString(sEventColor, 0.1) + "; ";
									sColorStyle += "border-color: " + sEventBorderColor + "; ";
									sColorStyle += "color: " + sEventColor + "; ";
									sLinkStyle += "color: " + sEventColor + "; ";
									sEventIconStyle = "background: " + sEventColor + "; color: " + sEventTextColor;
								}
							}
							else
							{
								sColorStyle += "background: " + sEventColor + "; ";
								sColorStyle += "border-color: " + sEventBorderColor + "; ";
								sColorStyle += "color: " + sEventTextColor + "; ";
								sLinkStyle += "color: " + sEventTextColor + "; ";
								sEventIconStyle = "color: " + sEventTextColor + "; ";
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
							}
							else
							{
								sColorStyle += "background: " + sEventColor + "; ";
								sColorStyle += "border-color: " + sEventBorderColor + "; ";
								sColorStyle += "color: " + sEventTextColor + "; ";
								sLinkStyle += "color: " + sEventTextColor + "; ";
								sEventIconStyle = "color: " + sEventTextColor + "; ";
							}
						}

						sPartialEventStyle = "border-color: " + (oEvent.fromSingleColor ? sEventTextColor : "#000000");

						if(bIsMarked)
							sIcon = ($.cf.isValid(oEvent.icon) && oEvent.icon !== "Dot") ? oEvent.icon : "cs-icon-Mark";
						else
							sIcon = $.cf.isValid(oEvent.icon) ? oEvent.icon : to.setting.eventIcon;

						if(to.compareDates(dEndDateTime, to.tv.dAVDt[0]) < 0)
							sEventClass += ("cBlurredEvent ");
						if(bDragNDrop)
							sEventClass += ("EventDraggable cDragNDrop ");
						if(to.setting.isTooltipInQuickAgendaView)
							sEventClass += ("cEventTooltip ");
						sEventClass += sId;
						if(bIsMarked)
							sEventClass += " cMarkedDayEvent";

						var iAddedDays = 0, iEventSegIndex = 0,
						iEventRow = -1, bLeftPartial = false, bRightPartial = false;

						if($.cf.compareStrings(sPartialEvent, "Left"))
							bLeftPartial = (iAddedDays > 0) ? false : true;

						if($.cf.compareStrings(sPartialEvent, "Right"))
							bRightPartial = true;

						if(iAddedDays < iNumOfSegs)
						{
							var iEventColumn = (iAddedDays > 0) ? 0 : iColumn,
							iEventLengthInRow = (iNumOfSegs - iAddedDays),
							iEventLengthInWeek = to.tv.iNoVDayDis - iEventColumn;

							if(iEventLengthInRow > iEventLengthInWeek)
							{
								iEventLengthInRow = iEventLengthInWeek;
								bRightPartial = true;
							}
							if(iAddedDays > 0)
								bLeftPartial = true;
							var iMaxColumn = iEventColumn + iEventLengthInRow;

							var bInnerRow, iTempIndex3;
							for(var iTempIndex2 = 0; iTempIndex2 < to.tv.bAWkRw.length; iTempIndex2++)
							{
								bInnerRow = to.tv.bAWkRw[iTempIndex2];

								if(iEventRow !== -1)
									break;

								var iTempEventLengthInRow = 0;
								for(iTempIndex3 = iEventColumn; iTempIndex3 < iMaxColumn; iTempIndex3++)
								{
									if(bInnerRow[iTempIndex3] === 0 && iTempEventLengthInRow < iEventLengthInRow)
									{
										iTempEventLengthInRow++;
										if(iTempEventLengthInRow === iEventLengthInRow)
										{
											iEventRow = iTempIndex2;
											break;
										}
									}
								}
							}
							if(iEventRow === -1)
							{
								to.tv.bAWkRw.push([0, 0, 0, 0, 0, 0, 0]);
								iEventRow = to.tv.bAWkRw.length - 1;
							}

							bInnerRow = to.tv.bAWkRw[iEventRow];

							var sEventSegId = sId + "-" + (++iEventSegIndex);

							//--------------------------- Add Event Start -----------------------------

							var sName = (iEventRow + 1) + "|" + iEventColumn + "|" + iEventLengthInRow;

							var sHeight = iEventHeightForAllEvents + "px";
							var sStyle = sColorStyle;
							sStyle += "height: " + sHeight + "; ";
							if(sEventBorderColor === "transparent")
								sStyle += "border-width: 0px; ";

							sDataDroppableId = $.cf.isValid(sDroppableId) ? " data-droppableid='" + sDroppableId + "'" : "";

							var sTemplate = "<div id='" + sEventSegId + "' class='" + sEventClass + "' style='" + sStyle + "'  data-pos='" + sName + "' " + sDataDroppableId + " title='' data-id='" + oEvent.calEventId + "'>";

							sTemplate += "<a class='cEventLink' style='" + sLinkStyle + "'>";

							if(bIsMarked)
							{
								sTemplate += "<span class='cqavEventTitle'>" + sTitle + "</span>";

								//if(!bHideEventIcon && !$.cf.compareStrings(sIcon, "Dot"))
									sTemplate += "<span class='cqavEventIcon "+sIcon+"' style='" + sEventIconStyle + "'></span>";
							}
							else
							{
								var sPartialClass = "";
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

								if(!bHideEventTime && bIsAllDay === false && ((iEventSegIndex === 1 && !bLeftPartial && iNumOfEventElements > 1) || iNumOfEventElements === 1))
									sTemplate += "<span class='cqavEventTime'>" + to.getDateInFormat({"date": dStartDateTime}, sEventTimeFormat, to.setting.is24Hour, true) + "</span>";

								if(!bHideEventIcon && !$.cf.compareStrings(sIcon, "Dot"))
									sTemplate += "<span class='cqavEventIcon "+sIcon+"' style='" + sEventIconStyle + "'></span>";

								if(!bHideEventTime && bIsAllDay === false && (iNumOfSegs > 1 || iEventLengthInRow > 1 || iNumberOfHours > 23) && !bRightPartial)
									sTemplate += "<span class='cqavEventTimeRight'>" + to.getDateInFormat({"date": dEndDateTime}, sEventTimeFormat, to.setting.is24Hour, true) + "</span>";

								sTemplate += "<span class='cqavEventTitle'>" + sTitle + "</span>";
							}

							sTemplate += "</a>";

							sTemplate += "</div>";

							$(to.elem).find(".cqavContRow2Main").append(sTemplate);

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
								$oSegContent.on($.CalenStyle.extra.sClickHandler, {"url": sURL, "eventId": oEvent.calEventId, "eventElemSelector": sIdElem, "view": "QuickAgendaView", "pluginId": to.tv.pluginId}, to.__bindClick);
							}
							//--------------------------- Add Event End -----------------------------

							for(iTempIndex3 = iEventColumn; iTempIndex3 < iMaxColumn; iTempIndex3++)
							{
								bInnerRow[iTempIndex3] = 1;
								iAddedDays++;
							}
						}
						else
							break;
					}
				}
			}

			if(to.setting.isTooltipInQuickAgendaView)
				to._addTooltipInQuickAgendaView(".cEventTooltip");

			if(to.setting.isDragNDropInQuickAgendaView)
				to._makeEventDraggableInQuickAgendaView(".EventDraggable");

			if(to.setting.eventsAddedInView)
				to.setting.eventsAddedInView.call(to, to.setting.visibleView, ".cqavEvent");
		}
		else
			console.log("to._addEventsInMonthView - No Events");

		to.addRemoveViewLoader(false, "cEventLoaderBg");
		to.addRemoveLoaderIndicators(false, "cEventLoaderIndicator");
	},

	_adjustEventsInQuickAgendaView: function()
	{
		var to = this;

		var iEventFirstRowTop = 10,
		iEventRowHeight = $.CalenStyle.extra.iEventHeights[to.setting.visibleView] + 2,
		sArrEventElems = $(to.elem).find(".cqavEvent");

		for(var iElemIndex = 0; iElemIndex < sArrEventElems.length; iElemIndex++)
		{
			var oElem = sArrEventElems[iElemIndex],
			sElemName = $(to.elem).find(oElem).attr("data-pos"),
			sArrElemName = sElemName.split("|"),

			iInnerRowIndex = parseInt(sArrElemName[0]),
			iColumnNo = parseInt(sArrElemName[1]),
			iWidthUnits = parseInt(sArrElemName[2]),

			iEventTop = iEventFirstRowTop + ((iInnerRowIndex - 1) * iEventRowHeight),
			iEventLeft = $(to.elem).find("#cqavDayColumn"+iColumnNo).position().left + (2 * $.CalenStyle.extra.iBorderOverhead),
			iEventWidth;

			if(iWidthUnits > 1)
			{
				var iEventEndColumnNo = iColumnNo + (iWidthUnits - 1),
				iEventEndColumnLeft = $(to.elem).find("#cqavDayColumn"+iEventEndColumnNo).position().left + (2 * $.CalenStyle.extra.iBorderOverhead),
				iEventEndColumnWidth = $(to.elem).find("#cqavDayColumn"+iEventEndColumnNo).width();
				iEventWidth = (iEventEndColumnLeft + iEventEndColumnWidth) - iEventLeft;
			}
			else
				iEventWidth = $(to.elem).find("#cqavDayColumn"+iColumnNo).width();
			iEventWidth -= (2 * $.CalenStyle.extra.iBorderOverhead);

			$(oElem).css({"left": iEventLeft, "top": iEventTop, "width": iEventWidth});

			var $oEventTitle = $(oElem).find(".cqavEventTitle"),
			iEventTitleHeight = $(oElem).height(),
			$oEventIcon = $(oElem).find(".cqavEventIcon"),
			iEventIconWidth = ($oEventIcon !== null) ? $oEventIcon.outerWidth(true) : 0,
			$oEventTime = $(oElem).find(".cqavEventTime"),
			iEventTimeWidth = ($oEventTime !== null) ? $oEventTime.outerWidth(true) : 0,
			iEventTimeWidthRight = 0,
			$oEventTimeRight = $(oElem).find(".cqavEventTimeRight");
			if($oEventTimeRight !== null)
				iEventTimeWidthRight = ($oEventTimeRight !== null) ? $oEventTimeRight.outerWidth(true) : 0;
			var iPartialSymbolWidth = $(oElem).find(".cPartialEventLeft").outerWidth(true) + $(oElem).find(".cPartialEventRight").outerWidth(true);
			var iEventTitleWidth = iEventWidth - (iEventIconWidth + iEventTimeWidth + iEventTimeWidthRight + (10 * $.CalenStyle.extra.iBorderOverhead) + iPartialSymbolWidth);

			$oEventTitle.css({"height": iEventTitleHeight, "line-height": iEventTitleHeight + "px", "width": iEventTitleWidth});
			$oEventTime.css({"height": iEventTitleHeight, "line-height": iEventTitleHeight + "px"});
			if($oEventTimeRight !== null)
				$oEventTimeRight.css({"height": iEventTitleHeight, "line-height": iEventTitleHeight + "px"});
		}
	},

	_makeEventContDroppableInQuickAgendaView: function()
	{
		var to = this;
		var $oElemDragged, sDroppableId,
		sEventId, sId, oDraggedEvent, sEventClass,
		dStartDateTime = null, dEndDateTime = null, bIsAllDay = 0,
		iArrNumOfDays, iNumOfDays, iNumOfHours, dNextDate, iDroppedDayIndex,
		bEventEntered = false, dStartDateAfterDrop = null, dEndDateAfterDrop = null,
		iElemIndex, iNextDay;

		$(to.elem).find(".cqavTableRow2 .cqavTableColumns").droppable(
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

				if(oDraggedEvent.start !== null)
					dStartDateTime = oDraggedEvent.start;
				if(oDraggedEvent.end !== null)
					dEndDateTime = oDraggedEvent.end;
				if(oDraggedEvent.isAllDay !== null)
					bIsAllDay = oDraggedEvent.isAllDay;

				iArrNumOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dStartDateTime, dEndDateTime, true, false, true);
				iNumOfDays = iArrNumOfDays[0];
				iNumOfHours = iArrNumOfDays[1];

				dNextDate = to._getDateBasedOnLeftPositionInQuickAgendaView(ui.position.left);
				iDroppedDayIndex = to._getDayNumberFromDateInQuickAgendaView(dNextDate);

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

				$(to.elem).find(".cqavTableColumns").removeClass("cActivatedCell");
				for(iElemIndex = 0; iElemIndex < iNumOfDays; iElemIndex++)
				{
					iNextDay = iDroppedDayIndex + iElemIndex;
					if(iNextDay <= (to.tv.dAVDt.length - 1))
					{
						$(to.elem).find(".cqavTableRow2 #cqavDayColumn"+iNextDay).addClass("cActivatedCell");
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

				if($(this).attr("id") === to.tv.draggableParent)
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

				var dDroppedDate = to._getDateBasedOnLeftPositionInQuickAgendaView(ui.position.left);

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
						$("#"+sEventId+".cEventClone").remove();
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
						to.__addEventsInQuickAgendaView();
						to._adjustEventsInQuickAgendaView();
					}
					$(to.elem).find(".cqavTableColumns").removeClass("cActivatedCell");
				}

				if(to.setting.saveChangesOnEventDrop)
					to.setting.saveChangesOnEventDrop.call(to, oDraggedEvent, dStartDateTime, dEndDateTime, dStartDateAfterDrop, dEndDateAfterDrop);

				to.tv.iTSEndEditing = $.cf.getTimestamp();
			}
		});
	},

	_makeEventDraggableInQuickAgendaView: function(sClass)
	{
		var to = this;
		var iEventHeight = $(to.elem).find(".cqavEvent").height(),
		iEventWidth = $(to.elem).find(".cqavTableColumns").width(),
		iTimeSlotWidth = iEventWidth + 1,

		iCalendarLeft = $(to.elem).position().left,
		iCalendarMarginLeft = $(to.elem).css("margin-left");
		iCalendarMarginLeft = parseInt(iCalendarMarginLeft.replace("px", ""));
		var iLeft = iCalendarLeft + iCalendarMarginLeft + $(to.elem).find(".cqavContRow2Main").position().left,
		iX1 = iLeft,
		iX2 = iX1 + $(to.elem).find(".cqavContRow2Main").width() - iEventWidth,

		iCalendarTop = $(to.elem).position().top,
		iCalendarMarginTop = $(to.elem).css("margin-top");
		iCalendarMarginTop = parseInt(iCalendarMarginTop.replace("px", ""));
		var iY1 = iCalendarTop + iCalendarMarginTop + $(to.elem).find(".cqavContRow2Main").position().top;
		if(to.tv.bDisFBar && $.cf.compareStrings(to.setting.filterBarPosition, "Top"))
			iY1 += to.setting.filterBarHeight;
		var iY2 = iY1 + $(to.elem).find(".cqavContRow2Main").height() - iEventHeight;

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
				var $oElemDragged = $(this),
				sName = $oElemDragged.attr("data-pos"),
				sArrName = sName.split("|"),
				iColumn = parseInt(sArrName[1]);

				to.tv.draggableParent = "cqavDayColumn" + iColumn;

				$oElemDragged.removeClass("cPartialEventLeft cPartialEventRight cPartialEventBoth");

				var oElementClone = $oElemDragged.clone();
				$oElemDragged.parent().append(oElementClone);
				$(oElementClone).addClass("cEventBeingDragged cEventClone");

				if(!$oElemDragged.hasClass("cEventOnlyText"))
					$oElemDragged.addClass("cEditingEvent cEditingEventUI");
				else
					$oElemDragged.addClass("cEditingEvent");
				$oElemDragged.css({"width": iEventWidth, "height": iEventHeight});
			},

			revert: function()
			{
				$(to.elem).find(".cqavTableColumns").removeClass("cActivatedCell");

				return true;
			}
		});
	},

	_addTooltipInQuickAgendaView: function(sClass)
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

	_getDateBasedOnLeftPositionInQuickAgendaView: function(iLeftPos)
	{
		var to = this;

		var iDVTableColumnWidth = $(to.elem).find(".cqavTableColumns").width(),
		iArrDVDaysLength = to.tv.fADVDayLftPos.length,
		iTempIndex = 0, iThisIndex = 0;

		for(var iTempIndex1 = 0; iTempIndex1 < iArrDVDaysLength; iTempIndex1++)
		{
			var iHoriStartPos = to.tv.fADVDayLftPos[iTempIndex1] - 5,
			iHoriEndPos = iHoriStartPos + iDVTableColumnWidth - 5;

			if(iTempIndex1 === (iArrDVDaysLength - 1))
				iHoriEndPos += 5;

			if(iLeftPos >= iHoriStartPos && iLeftPos <= iHoriEndPos)
			{
				iThisIndex = iTempIndex1 + 1;
				break;
			}
		}

		for(var iTempIndex2 = 0; iTempIndex2 < to.tv.dAVDt.length; iTempIndex2++)
		{
			var dThisDate = to.tv.dAVDt[iTempIndex2];
			if(to.__isDateInCurrentView(dThisDate))
			{
				iTempIndex++;
				if(iTempIndex === iThisIndex)
					return dThisDate;
			}
		}
	},

	_getDayNumberFromDateInQuickAgendaView: function(dThisDate)
	{
		var to = this;
		for(var iTempIndex = 0; iTempIndex < to.tv.dAVDt.length; iTempIndex++)
		{
			if(to.compareDates(dThisDate, to.tv.dAVDt[iTempIndex]) === 0)
				return iTempIndex;
		}
		return -1;
	}

});

/*! ---------------------------------- CalenStyle Quick Agenda View End --------------------------------- */
