/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

/*! ---------------------------------- CalenStyle Week Planner View Start --------------------------------- */

//"use strict";

CalenStyle.prototype = $.extend(CalenStyle.prototype, {

	// Public Method
	updateWeekPlannerView: function(bLoadAllData)
	{
		var to = this;

		var iTempIndex, iEventIndex, sTemplate = "",
		sArrViewDates = [], sFullDate = "",
		dTempViewDate, dTempViewStartDate, dTempViewEndDate, oAEventsForView,
		bHideEventIcon = $.cf.isValid(to.setting.hideEventIcon[to.setting.visibleView]) ? to.setting.hideEventIcon[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventIcon.Default) ? to.setting.hideEventIcon.Default : false,
		bHideEventTime = $.cf.isValid(to.setting.hideEventTime[to.setting.visibleView]) ? to.setting.hideEventTime[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventTime.Default) ? to.setting.hideEventTime.Default : false;

		to.__getCurrentViewDates();
		if($.cf.compareStrings(to.tv.sLoadType, "Prev"))
			to.tv.dLoadDt = to.tv.dAVDt[0];
		else if($.cf.compareStrings(to.tv.sLoadType, "Next"))
			to.tv.dLoadDt = to.tv.dAVDt[(to.tv.dAVDt.length - 1)];

		to._setDateStringsInHeaderOfWeekPlannerView();

		for(iTempIndex = 0; iTempIndex < to.tv.dAVDt.length; iTempIndex++)
		{
			sFullDate = to.getDateInFormat({"date": to.tv.dAVDt[iTempIndex]}, "dd-MM-yyyy", false, true);
			sArrViewDates.push("cwpvDate-"+sFullDate);
		}

		sTemplate += "<tr class='cwpvRowTwoColumn'>";
		sTemplate += "<td id='"+sArrViewDates[0]+"' class='cwpvColumn'></td>";
		sTemplate += "<td id='"+sArrViewDates[1]+"' class='cwpvColumn'></td>";
		sTemplate += "</tr>";
		sTemplate += "<tr class='cwpvRowTwoColumn'>";
		sTemplate += "<td id='"+sArrViewDates[2]+"' class='cwpvColumn'></td>";
		sTemplate += "<td id='"+sArrViewDates[3]+"' class='cwpvColumn'></td>";
		sTemplate += "</tr>";
		sTemplate += "<tr class='cwpvRowTwoColumn'>";
		sTemplate += "<td id='"+sArrViewDates[4]+"' class='cwpvColumn'></td>";
		sTemplate += "<td id='"+sArrViewDates[5]+"' class='cwpvColumn'></td>";
		sTemplate += "</tr>";
		sTemplate += "<tr class='cwpvRowOneColumn'>";
		sTemplate += "<td id='"+sArrViewDates[6]+"' class='cwpvColumn' colspan='2'></td>";
		sTemplate += "</tr>";
		$(to.elem).find(".cwpvTableMain").html(sTemplate);

		to.adjustWeekPlannerView();

		to.__parseData(bLoadAllData, function()
		{
			var iEventId = 0,
			sFullDate = "", sDateId = "", sTemplate = "", bIsToday = false, sDateClass = "", sDayClass = "",
			oEvent = null, dStartDateTime = null, dEndDateTime = null,
			bIsAllDay = 0, sTitle = "",  sURL = "", sDesc = "", bIsMarked = false,
			sArrEventDateTime = null, sEventDateTime = null,
			sEventColor = "", sEventBorderColor = "", sEventTextColor = "",
			sStyle = "", sStyleColorHeight = "", sIcon = "", sEventDetailsStyle = "", sEventIconStyle = "",
			sId = "", sIdElem = "", sClass = "",
			$oDateCell = null;

			for(iTempIndex = 0; iTempIndex < to.tv.dAVDt.length; iTempIndex++)
			{
				dTempViewDate = to.tv.dAVDt[iTempIndex];
				dTempViewStartDate = to.setDateInFormat({"date": dTempViewDate}, "START");
				dTempViewEndDate = to.setDateInFormat({"date": dTempViewDate}, "END");
				oAEventsForView = to.getArrayOfEventsForView(dTempViewStartDate, dTempViewEndDate);

				sFullDate = to.getDateInFormat({"date": dTempViewStartDate}, "dd-MM-yyyy", false, true);
				bIsToday = (to.compareDates(dTempViewDate, $.CalenStyle.extra.dToday) === 0);
				sDateId = "cwpvDate-" +  sFullDate;
				$oDateCell = $(to.elem).find("#"+sDateId);

				if(iTempIndex === (to.tv.dAVDt.length - 1))
				{
					sDateClass = bIsToday ? "cwpvDate cwpvDateToday" : "cwpvDate";
					sDayClass = bIsToday ? "cwpvDay cwpvDateToday" : "cwpvDay";
					sTemplate += "<div class='"+sDateClass+"'>" + to.getDateInFormat({"date": dTempViewDate}, "d", false, true);
					sTemplate += "<div class='"+sDayClass+"'>" + to.getDateInFormat({"date": dTempViewDate}, "DDD", false, true) + "</div>";
					sTemplate += "</div>";
					$oDateCell.append(sTemplate);
				}
				else
				{
					sDateClass = bIsToday ? "cwpvDate cwpvDateToday" : "cwpvDate";
					$oDateCell.append("<div class='"+sDateClass+"'>" + to.getDateInFormat({"date": dTempViewStartDate}, "DDD, MMM dd", false, true) + "</div>");
				}

				if(oAEventsForView.length > 0)
				{
					$oDateCell.append("<div class='cwpvEventCont'></div>");

					for(iEventIndex = 0; iEventIndex < oAEventsForView.length; iEventIndex++)
					{
						oEvent = oAEventsForView[iEventIndex];

						dStartDateTime = null; dEndDateTime = null;
						bIsAllDay = 0; sTitle = "";  sURL = ""; sEventColor = ""; sDesc = ""; bIsMarked = false;
						sId = ""; sIdElem = "";
						sEventColor = ""; sEventBorderColor = ""; sEventTextColor = "";
						sStyle = ""; sStyleColorHeight = ""; sIcon = ""; sEventDetailsStyle = ""; sEventIconStyle = "";
						bIsMarked = false;

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

						if(oEvent.url !== null)
							sURL = oEvent.url;

						if(oEvent.isMarked !== null)
							bIsMarked = oEvent.isMarked;

						if(bIsMarked)
							bIsAllDay = true;

						sArrEventDateTime = to.getEventDateTimeDataForWeekPlannerView(dStartDateTime, dEndDateTime, bIsAllDay, dTempViewStartDate);
						sEventDateTime = sArrEventDateTime;
						if(sEventDateTime === "")
							sEventDateTime = to.setting.miscStrings.allDay;

						sEventColor = oEvent.backgroundColor;
						sEventColor = ($.cf.compareStrings(sEventColor, "") || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;
						sEventBorderColor = oEvent.borderColor || $.cf.addHashToHexcode(to.setting.borderColor);
						sEventBorderColor = ($.cf.compareStrings(sEventBorderColor, "") || $.cf.compareStrings(sEventBorderColor, "transparent")) ? "transparent" : sEventBorderColor;
						sEventTextColor = oEvent.textColor || $.cf.addHashToHexcode(to.setting.textColor);
						sEventTextColor = ($.cf.compareStrings(sEventTextColor, "") || $.cf.compareStrings(sEventTextColor, "transparent")) ? $.cf.addHashToHexcode(to.setting.textColor) : sEventTextColor;

						sId = "Event-" + (++iEventId);
						sStyleColorHeight = sArrEventDateTime[1];

						sStyle = "";
						sClass = "cwpvEvent";
						if(bIsMarked)
						{
							sClass += " cMarkedDayEvent";
							sIcon = ($.cf.isValid(oEvent.icon) && oEvent.icon !== "Dot") ? oEvent.icon : "cs-icon-Mark";

							if(oEvent.fromSingleColor)
							{
								sStyle += "background: " + sEventColor + "; ";
								sEventIconStyle = "color: " + sEventTextColor + ";";
							}
							else
							{
								sStyle += "background: " + $.cf.getRGBAString(sEventColor, 0.1) + "; ";
								sEventIconStyle = "color: " + sEventColor + ";";
							}
						}
						else
						{
							sIcon = $.cf.isValid(oEvent.icon) ? oEvent.icon : to.setting.eventIcon;
						}

						sTemplate = "";
						sTemplate += "<div id='" + sId + "' class='" + sClass + "' style='" + sStyle + "'>";

						if(bIsMarked)
						{
							sTemplate += "<div class='cwpvEventContent'>";

							sTemplate += "<div class='cwpvEventTitle'>" + sTitle + "</div>";

							sTemplate += "</div>";

							sTemplate += "<div class='cwpvEventIcon' style='" + sEventIconStyle + "'><span class='cwpvEventIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span></div>";
						}
						else
						{
							if(!bHideEventIcon)
							{
								if($.cf.compareStrings(sIcon, "Dot"))
								{
									sEventIconStyle = "background: " + sEventTextColor + "; ";
									sTemplate += "<div class='cwpvEventIcon'><span class='cwpvEventIconDot' style='" + sEventIconStyle + "'></span></div>";
								}
								else
								{
									sEventIconStyle = "color: " + sEventTextColor + "; ";
									sTemplate += "<div class='cwpvEventIcon'><span class='cwpvEventIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span></div>";
								}
							}

							sTemplate += "<div class='cwpvEventContent'>";

							sTemplate += "<div class='cwpvEventTitle'>" + sTitle + "</div>";

							if(!bHideEventTime)
							sTemplate += "<div class='cwpvEventTime'>" + sEventDateTime + "</div>";

							sTemplate += "</div>";
						}

						sTemplate += "</div>";

						$oDateCell.find(".cwpvEventCont").append(sTemplate);

						if(bIsMarked)
						{
							var $oDateElem = $oDateCell.find(".cwpvDate");
							if($oDateElem.find(".cMarkedDayIndicator").length === 0)
								$oDateElem.append("<span class='cMarkedDayIndicator cs-icon-Mark'></span>");
						}

						sTemplate = "";

						sIdElem = "#"+sId;
						if($.cf.isValid(sURL) || to.setting.eventClicked)
						{
							$oDateCell.find(sIdElem).on($.CalenStyle.extra.sClickHandler, {"url": sURL, "eventId": oEvent.calEventId, "eventElemSelector": sIdElem, "view": "AgendaView", "pluginId": to.tv.pluginId}, to.__bindClick);
						}
					}
				}
				else
				{
					$oDateCell.append("<div class='cwpvNoEvents'>No Events</div>");
				}
			}

			to.addRemoveViewLoader(false, "cEventLoaderBg");
			to.addRemoveLoaderIndicators(false, "cEventLoaderIndicator");

			to.adjustWeekPlannerView();
			to.__modifyFilterBarCallback();
		});
	},

	_setDateStringsInHeaderOfWeekPlannerView: function()
	{
		var to = this;
		var sHeaderViewLabel = "";
		var oAGVStart = to.getDateInFormat({"date": to.tv.dVSDt}, "object", false, true),
		oAGVEnd = to.getDateInFormat({"date": to.tv.dVEDt}, "object", false, true);

		if(oAGVStart.y === oAGVEnd.y)
			sHeaderViewLabel = to.getDateInFormat({"iDate": oAGVStart}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAGVStart.d, 0, true) + "  -  " + to.getDateInFormat({"iDate": oAGVEnd}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAGVEnd.d, 0, true) + ",  " + to.getNumberStringInFormat(oAGVEnd.y, 0, true);
		else
			sHeaderViewLabel = to.getDateInFormat({"iDate": oAGVStart}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAGVStart.d, 0, true) + ",  " + to.getNumberStringInFormat(oAGVStart.y, 0, true) + "  -  " + to.getDateInFormat({"iDate": oAGVEnd}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAGVEnd.d, 0, true) + ",  " + to.getNumberStringInFormat(oAGVEnd.y, 0, true);

		if(to.setting.modifyHeaderViewLabels)
			to.setting.modifyHeaderViewLabels.call(to, to.tv.dVSDt, to.tv.dVEDt, to.setting.selectedDate, sHeaderViewLabel, to.setting.visibleView);

		$(to.elem).find(".cContHeaderLabel").html(sHeaderViewLabel);
	},

	// Public Method
	getEventDateTimeDataForWeekPlannerView: function(dEvStartDate, dEvEndDate, bIsAllDay, dThisDate)
	{
		var to = this;
		var sDateTimeString = "", sSeparator = "";
		if(bIsAllDay)
		{
			if(to.compareDates(dEvStartDate, dEvEndDate) === 0)
				sDateTimeString = "<span class='cwpvEventTimeTop cwpvEventTimeLabel'>"+to.setting.miscStrings.allDay+"</span>";
			else
				sDateTimeString = "<span class='cwpvEventTimeTop cwpvEventTimeLabel'>"+to.setting.miscStrings.allDay+"</span>" + sSeparator + "<span class='cwpvEventTimeBottom cwpvEventTimeDuration'>"+ ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dThisDate, dEvEndDate, "d", false, false) : to.setting.duration.call(to, dThisDate, dEvEndDate, "d")) +"</span>";
		}
		else
		{
			if(to.compareDates(dEvStartDate, dEvEndDate) === 0)
				sDateTimeString = "<span class='cwpvEventTimeTop'>" + to.getDateInFormat({"date": dEvStartDate}, "hh:mm", to.setting.is24Hour, true) + "</span>" + sSeparator + "<span class='cwpvEventTimeBottom cwpvEventTimeDuration'>" + ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dEvStartDate, dEvEndDate, "dhm", false, false) : to.setting.duration.call(to, dEvStartDate, dEvEndDate, "dhm")) + "</span>";
			else
			{
				if(to.compareDates(dEvStartDate, dThisDate) === 0)
					sDateTimeString = "<span class='cwpvEventTimeTop'>" + to.getDateInFormat({"date": dEvStartDate}, "hh:mm", to.setting.is24Hour, true) + "</span>" + sSeparator + "<span class='cwpvEventTimeBottom cwpvEventTimeDuration'>" + ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dEvStartDate, dEvEndDate, "dhm", false, false) : to.setting.duration.call(to, dEvStartDate, dEvEndDate, "dhm")) + "</span>";
				else if(to.compareDates(dEvEndDate, dThisDate) === 0)
					sDateTimeString = "<span class='cwpvEventTimeTop cwpvEventTimeLabel'>"+to.setting.miscStrings.ends+"</span>" + sSeparator + "<span class='cwpvEventTimeBottom'>" + to.getDateInFormat({"date": dEvEndDate}, "hh:mm", to.setting.is24Hour, true) + "</span>";
				else
					sDateTimeString = "<span class='cwpvEventTimeTop cwpvEventTimeLabel'>"+to.setting.miscStrings.allDay+"</span>" + sSeparator + "<span class='cwpvEventTimeBottom cwpvEventTimeDuration'>"+ ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dThisDate, dEvEndDate, "dhm", false, false) : to.setting.duration.call(to, dThisDate, dEvEndDate, "dhm"))+"</span>";
			}
		}
		return sDateTimeString;
	},

	__goToPrevWeekPlannerView: function()
	{
		var to = this;

		var iCurrentDateMS = to.tv.dVSDt.getTime();
		iCurrentDateMS -= (to.tv.iNoVDay * $.CalenStyle.extra.iMS.d);

		to.setting.selectedDate = to.setDateInFormat({"date": new Date(iCurrentDateMS)}, "START");
		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.sLoadType = "Prev";
		to.__reloadCurrentView(false, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	__goToNextWeekPlannerView: function()
	{
		var to = this;

		var iCurrentDateMS = to.tv.dVEDt.getTime();
		iCurrentDateMS += $.CalenStyle.extra.iMS.d;

		to.setting.selectedDate = to.setDateInFormat({"date": new Date(iCurrentDateMS)}, "START");
		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.sLoadType = "Next";
		to.__reloadCurrentView(false, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	// Public Method
	adjustWeekPlannerView: function()
	{
		var to = this;

		var icwpvCalendarContMaxHeight = $(to.elem).find(".cwpvCalendarCont").css("max-height");
		icwpvCalendarContMaxHeight = parseInt(icwpvCalendarContMaxHeight.replace("px", "")) || 0;
		var icwpvCalendarContMinHeight = $(to.elem).find(".cwpvCalendarCont").css("min-height");
		icwpvCalendarContMinHeight = parseInt(icwpvCalendarContMinHeight.replace("px", "")) || 0;

		if(icwpvCalendarContMaxHeight > 0 && $(to.elem).height() > icwpvCalendarContMaxHeight)
			$(to.elem).css({"height": icwpvCalendarContMaxHeight});
		else if(icwpvCalendarContMinHeight > 0 && $(to.elem).height() < icwpvCalendarContMinHeight)
			$(to.elem).css({"height": icwpvCalendarContMinHeight});
		if(to.tv.iCalHeight !== 0)
			$(to.elem).css({"height": to.tv.iCalHeight});

		var iCalendarContWidth = $(to.elem).find(".calendarCont").parent().outerWidth(),
		iCalendarContHeight = $(to.elem).find(".calendarCont").outerHeight();

		if($.cf.compareStrings(to.setting.filterBarPosition, "Left") || $.cf.compareStrings(to.setting.filterBarPosition, "Right"))
			iCalendarContWidth -= to.setting.filterBarWidth;

		if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
		{
			$(to.elem).find(".cFilterBar").css({"width": iCalendarContWidth});
			iCalendarContHeight -= $(to.elem).find(".cFilterBar").height();
		}
		$(to.elem).find(".calendarContInner").css({"width": iCalendarContWidth, "height": iCalendarContHeight});

		if(!to.setting.fixedHeightOfWeekPlannerViewCells)
			$(to.elem).find(".cwpvTableOuterCont").css({"width": iCalendarContWidth});

		iCalendarContWidth = iCalendarContWidth - 1;
		if(!to.setting.fixedHeightOfWeekPlannerViewCells)
			$(to.elem).find(".cwpvTableMain").css({"width": iCalendarContWidth});
		else
			$(to.elem).find(".cwpvTableMain").css({"width": iCalendarContWidth});

		$(to.elem).find(".cwpvRowTwoColumn .cwpvColumn").css({"width": (iCalendarContWidth / 2)});

		to.__adjustHeader();

		if(to.tv.bDisFBar && $.cf.compareStrings(to.setting.filterBarPosition, "Right"))
			$(to.elem).find(".cFilterBar").css({"left": iCalendarContWidth});

		iCalendarContHeight -= (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerHeight() : 0);
		if(to.tv.bDisABar)
			iCalendarContHeight -= $(to.elem).find(".cActionBar").outerHeight();

		if(to.setting.fixedHeightOfWeekPlannerViewCells)
			$(to.elem).find(".cwpvTableMain").css({"height": iCalendarContHeight});
		else
			$(to.elem).find(".cwpvTableOuterCont").css({"height": iCalendarContHeight});

		var iTwoColumnWidth = $(to.elem).find(".cwpvRowTwoColumn .cwpvColumn").width(),
		iOneColumnWidth = $(to.elem).find(".cwpvRowOneColumn .cwpvColumn").width(),
		iOneColumnDateWidth = $(to.elem).find(".cwpvRowOneColumn .cwpvDate").width();
		$(to.elem).find(".cwpvRowTwoColumn .cwpvEventContent").css({"width": (iTwoColumnWidth - 35)});
		$(to.elem).find(".cwpvRowOneColumn .cwpvEventContent").css({"width": (iOneColumnWidth - (iOneColumnDateWidth + 50))});
		$(to.elem).find(".cwpvRowOneColumn .cwpvEventCont").css({"width": (iOneColumnWidth - (iOneColumnDateWidth + 17))});

		if(to.setting.fixedHeightOfWeekPlannerViewCells)
		{
			var iTwoColumnCellsAvHeight = 0.8 * iCalendarContHeight,
			iTwoColumnCellsHeight = iTwoColumnCellsAvHeight/3,
			iOneColumnCellsHeight = 0.2 * iCalendarContHeight,
			$oTwoColumn = $(to.elem).find(".cwpvRowTwoColumn"),
			$oOneColumn = $(to.elem).find(".cwpvRowOneColumn"),
			iTwoColumnDateHeight = $oOneColumn.find(".cwpvDate").height(),
			iTwoColumnEventContHeight = iTwoColumnCellsHeight - iTwoColumnDateHeight;

			$oTwoColumn.css({"height": iTwoColumnCellsHeight});
			$oOneColumn.css({"height": iOneColumnCellsHeight});

			$oTwoColumn.find(".cwpvEventCont").css({"height": iTwoColumnEventContHeight});
			$oOneColumn.find(".cwpvEventCont").css({"height": (iOneColumnCellsHeight - 25)});
		}
	}

});

/*! ---------------------------------- CalenStyle Week Planner View End --------------------------------- */
