/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

/*! ------------------------------------ CalenStyle Appointment View Start ----------------------------------- */

//"use strict";

CalenStyle.prototype = $.extend(CalenStyle.prototype, {

	_getSlotAvailabilityForCurrentView: function(dThisDate)
	{
		var to = this;
		var oArrThisDateStatus = [];
		for(var iTempIndex = 0; iTempIndex < to.tv.oASltAvail.length; iTempIndex++)
		{
			var oTempStatus = to.tv.oASltAvail[iTempIndex];
			var dTempStatusStart = new Date(oTempStatus.start);
			var dTempStatusEnd = new Date(oTempStatus.end);
			if(to.compareDates(dThisDate, dTempStatusStart) === 0 && to.compareDates(dThisDate, dTempStatusEnd) === 0)
			{
				if(to.compareDateTimes(dTempStatusStart, dTempStatusEnd) < 0)
					oArrThisDateStatus.push(oTempStatus);
			}
		}
		return oArrThisDateStatus;
	},

	__updateAppointmentTable: function()
	{
		var to = this;
		var iDateIndex;

		if($.cf.compareStrings(to.tv.sLoadType, "Prev"))
			to.tv.dLoadDt = to.tv.dAVDt[0];
		else if($.cf.compareStrings(to.tv.sLoadType, "Next"))
			to.tv.dLoadDt = to.tv.dAVDt[(to.tv.dAVDt.length - 1)];

		var sTemplate = "";

		sTemplate += "<thead>";
		sTemplate += "<tr class='cavTableRow cavTableRow1'>";
		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDay; iDateIndex++)
		{
			var sTempId = "cavRowDay"+iDateIndex,
			sLastElemClass = "";
			if(iDateIndex === (to.tv.iNoVDay - 1))
				sLastElemClass = "cavLastColumn";
			sTemplate += "<td id='" + sTempId + "' class='cavTableColumns cavTableColumn1 "+sLastElemClass+"'>";
			sTemplate += "<div class='cavTableRowDays'> &nbsp; </div>";
			sTemplate += "<div class='cavTableRowDates'><span>&nbsp;</span></div>";
			sTemplate += "</td>";
		}
		if($.CalenStyle.extra.iScrollbarWidth > 0)
			sTemplate += "<td class='cavTableScroll'> &nbsp; </td>";
		sTemplate += "</tr>";
		sTemplate += "</thead>";

		sTemplate += "<tbody>";
		sTemplate += "<tr class='cavTableRow cavTableRow2'>";
		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDay; iDateIndex++)
		{
			sTemplate += "<td id='" + "cavRowSlotCont"+iDateIndex + "' class='cavTableColumns cavTableColumnTimes'>  &nbsp; </td>";
		}
		if($.CalenStyle.extra.iScrollbarWidth > 0)
			sTemplate += "<td class='cavTableScroll'> &nbsp; </td>";
		sTemplate += "</tr>";
		sTemplate += "</tbody>";

		$(to.elem).find(".cavTableMain").html(sTemplate);

		//-------------------------------------------------------------------------------------

		sTemplate = "";
		sTemplate += "<table class='cavSlotTable cavSlotTableMain'>";
		for(var iTempIndex1 = 0; iTempIndex1 < 4; iTempIndex1++)
		{
			var sTitle = "";
			if(iTempIndex1 === 0)
				sTitle = "Night";
			else if(iTempIndex1 === 1)
				sTitle = "Morning";
			else if(iTempIndex1 === 2)
				sTitle = "Afternoon";
			else if(iTempIndex1 === 3)
				sTitle = "Evening";

			sTemplate += "<tr class='cavSlotTableRow' title='" + sTitle + "'>";
			sTemplate += "<td class='cavSlotTableSection' colspan='" + to.tv.iNoVDay + "'>" + sTitle + "</td>";
			sTemplate += "</tr>";

			sTemplate += "<tr class='cavSlotTableRow cavSlotTableRow" + (iTempIndex1 + 1) + "' title='" + sTitle + "'>";

			for(var iTempIndex2 = 1; iTempIndex2 < (to.tv.iNoVDay + 1); iTempIndex2++)
			{
				sTemplate += "<td class='cavSlotTableColumns cavSlotTableCol"+iTempIndex2+"'>";

				for(var iTempIndex3 = 0; iTempIndex3 < 3; iTempIndex3++)
					sTemplate += "<div class='cavSlotTableSubColumns cavSlotTableSubCol"+iTempIndex3+"'> &nbsp; </div>";

				sTemplate += "</td>";
			}

			sTemplate += "</tr>";
		}

		sTemplate += "</table>";

		$(to.elem).find(".cavContRow2Main").html(sTemplate);

		to._setDateStringsInAppointmentView();
	},

	_setDateStringsInAppointmentView: function()
	{
		var to = this;
		for(var iDateIndex = 0; iDateIndex < to.tv.iNoVDay; iDateIndex++)
		{
			var dTempDate = to.tv.dAVDt[iDateIndex];

			var bTodayMatched = (to.compareDates(dTempDate, $.CalenStyle.extra.dToday) === 0) ? true : false,

			/* -------------------------- Table Row 1 Start ------------------------------- */

			sDayId = ".cavTableMain #cavRowDay"+iDateIndex;

			if(bTodayMatched)
			{
				$(to.elem).find(sDayId+" .cavTableRowDays").addClass("cTodayHighlightTextColor");
				$(to.elem).find(sDayId+" .cavTableRowDates span").addClass("cTodayHighlightCircle");
			}

			$(to.elem).find(sDayId+" .cavTableRowDays").html(to.getDateInFormat({"date": dTempDate}, "DDD", false, true));
			$(to.elem).find(sDayId+" .cavTableRowDates span").html(to.getNumberStringInFormat(dTempDate.getDate(), 0, true));

			/* -------------------------- Table Row 1 End ------------------------------- */
		}

		var oAVStart = to.getDateInFormat({"date": to.tv.dVSDt}, "object", to.setting.is24Hour, true),
		oAVEnd = to.getDateInFormat({"date": to.tv.dVEDt}, "object", to.setting.is24Hour, true);

		var sHeaderViewLabel;
		if(to.tv.iNoVDay > 1)
		{
			if(oAVStart.y === oAVEnd.y)
			{
				if(oAVStart.M === oAVEnd.M)
					sHeaderViewLabel = "<b>" + to.getDateInFormat({"iDate": oAVStart}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAVStart.d, 0, true) + "</b>  -  <b>" + to.getNumberStringInFormat(oAVEnd.d, 0, true) + "</b>  " + to.getNumberStringInFormat(oAVEnd.y, 0, true);
				else
					sHeaderViewLabel = "<b>" + to.getDateInFormat({"iDate": oAVStart}, "MMM", false, true) + "  " + to.getNumberStringInFormat(oAVStart.d, 0, true) + "</b>  -  <b>" + to.getDateInFormat({"iDate": oAVEnd}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAVEnd.d, 0, true) + "</b>  " + to.getNumberStringInFormat(oAVEnd.y, 0, true);
			}
			else
				sHeaderViewLabel = "<b>" + to.getDateInFormat({"iDate": oAVStart}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAVStart.d, 0, true) + "</b>  " + to.getNumberStringInFormat(oAVStart.y, 0, true) + "  -  <b>" + to.getDateInFormat({"iDate": oAVEnd}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAVEnd.d, 0, true) + "</b>  " + to.getNumberStringInFormat(oAVEnd.y, 0, true);
		}
		else
			sHeaderViewLabel = "<b>" + to.getDateInFormat({"iDate": oAVStart}, "DDDD", false, true) + " " + to.getDateInFormat({"iDate": oAVEnd}, "MMMM", false, true) + " " + to.getNumberStringInFormat(oAVEnd.d, 0, true) + "</b>  " + to.getNumberStringInFormat(oAVEnd.y, 0, true);

		if(to.setting.modifyHeaderViewLabels)
			to.setting.modifyHeaderViewLabels.call(to, to.tv.dVSDt, to.tv.dVEDt, to.setting.selectedDate, sHeaderViewLabel, to.setting.visibleView);

		$(to.elem).find(".cContHeaderLabel").html(sHeaderViewLabel);
	},

	__displayAppointments: function()
	{
		var to = this;
		var iSlotIndex = 0, iMaxLength = 0, iDateIndex,
		oArrTemp = [], dTempDate, oArrTempStatus;

		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDay; iDateIndex++)
		{
			dTempDate = to.tv.dAVDt[iDateIndex];
			oArrTempStatus = to._getSlotAvailabilityForCurrentView(dTempDate);
			var iTempStatusLength = oArrTempStatus.length;
			if(iMaxLength < iTempStatusLength)
				iMaxLength = iTempStatusLength;
			oArrTemp.push(oArrTempStatus);
		}

		$(to.elem).find(".cavSlotTableMain .cavSlotTableRow .cavSlotTableSubColumns").html("");

		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDay; iDateIndex++)
		{
			dTempDate = to.tv.dAVDt[iDateIndex];
			oArrTempStatus = oArrTemp[iDateIndex];
			var iSlot1Index = 2, iSlot2Index = 2, iSlot3Index = 2;

			for(var iTempIndex = 0; iTempIndex < oArrTempStatus.length; iTempIndex++)
			{
				var oTempStatus = oArrTempStatus[iTempIndex],
				dTempStartTime = oTempStatus.start,
				sTempStartTime = to.getDateInFormat({"date": dTempStartTime}, "hh:mm", to.setting.is24Hour, true),
				sTempStatus = oTempStatus.status,

				iTimeIndex, iSubColIndex;
				if(dTempStartTime.getHours() >= 0 && dTempStartTime.getHours() < 6)
				{
					iTimeIndex = 1;
					iSubColIndex = ++iSlot1Index;
				}
				else if(dTempStartTime.getHours() >= 6 && dTempStartTime.getHours() < 12)
				{
					iTimeIndex = 2;
					iSubColIndex = ++iSlot1Index;
				}
				else if(dTempStartTime.getHours() >= 12 && dTempStartTime.getHours() < 18)
				{
					iTimeIndex = 3;
					iSubColIndex = ++iSlot2Index;
				}
				else if(dTempStartTime.getHours() >= 18 && dTempStartTime.getHours() < 24)
				{
					iTimeIndex = 4;
					iSubColIndex = ++iSlot3Index;
				}

				var sRowId = ".cavSlotTableMain .cavSlotTableRow"+iTimeIndex+" .cavSlotTableCol"+(iDateIndex+1)+" .cavSlotTableSubCol"+(iSubColIndex%3),
				sClass = "cavSlot",
				sTitle = "";

				if(to.setting.isTooltipInAppointmentView && to.setting.slotTooltipContent)
				{
					sTitle = to.setting.slotTooltipContent.call(to, oTempStatus);
					sClass += " cTimeSlotTooltip";
				}

				if($.cf.compareStrings(sTempStatus, "Free"))
					sClass += " cavStatusFree";
				else if($.cf.compareStrings(sTempStatus, "Busy"))
					sClass += " cavStatusBusy";

				if($.cf.compareStrings(sTempStatus, "Free") || $.cf.compareStrings(sTempStatus, "Busy"))
				{
					var sSlotId = "cavSlot" + (++iSlotIndex);
				 	var sTemplate = "<div id='" + sSlotId + "' class='" + sClass + "' title='' data-tooltipcontent='" + sTitle + "'>" + sTempStartTime +"</div>";
					$(to.elem).find(sRowId).append(sTemplate);

					if(to.setting.clickedAppointmentSlot)
						$(to.elem).find("#"+sSlotId).bind($.CalenStyle.extra.sClickHandler, {"oTempStatus": oTempStatus, "pluginId": to.tv.pluginId}, to._makeAppointmentSlotClickable);
				}
			}
		}

		for(var iRowIndex = 1; iRowIndex < 5; iRowIndex++)
		{
			var $oRow = $(to.elem).find(".cavSlotTableRow" + iRowIndex);
			if($oRow.length > 0 && $oRow.find(".cavSlot").length === 0)
				$oRow.remove();
		}

		to.addRemoveViewLoader(false, "cEventLoaderBg");
		to.addRemoveLoaderIndicators(false, "cEventLoaderIndicator");

		if(to.setting.isTooltipInAppointmentView)
			to._addTooltipInAppointmentView();

		if(to.setting.timeSlotsAddedInView)
			to.setting.timeSlotsAddedInView.call(to, to.setting.visibleView, ".cavSlot");
	},

	_addTooltipInAppointmentView: function(oElement)
	{
		var to = this;

		var $oElement = $.cf.isValid(oElement) ? $(oElement) : $(to.elem).find(".cTimeSlotTooltip");
		$oElement.tooltip(
		{
			content: function()
			{
				var sTooltipContent = $(this).data("tooltipcontent");
				if(sTooltipContent === "")
					return false;
				else
					return ("<div class='title'>" + sTooltipContent + "</div>");
			},

			position:
			{
				my: "center bottom-10",
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

	_makeAppointmentSlotClickable: function(e)
	{
		var oData = e.data,
		to = $.CalenStyle.extra.oArrCalenStyle[(oData.pluginId - 1)],
		oElement = e.target,
		oTempStatus = oData.oTempStatus;
		if(to.setting.clickedAppointmentSlot)
			to.setting.clickedAppointmentSlot.call(to, oTempStatus, oElement);
	},

	// Public Method
	modifyAppointmentSlot: function(oTempStatus, oElement)
	{
		var to = this;

		if($.cf.isValid(oTempStatus))
		{
			if($.cf.compareStrings(oTempStatus.status, "Free"))
			{
				if($.cf.isValid(oTempStatus.count))
				{
					if(oTempStatus.count === 0)
						oTempStatus.status = "Busy";
					else
					{
						if($(oElement).data('ui-tooltip'))
							$(oElement).tooltip("destroy");
					}
				}
			}

			if($.cf.compareStrings(oTempStatus.status, "Busy") && $(oElement).hasClass("cavStatusFree"))
			{
				if($(oElement).data('ui-tooltip'))
					$(oElement).tooltip("destroy");
				$(oElement).data("tooltipcontent", "");
				$(oElement).removeClass("cavStatusFree cTimeSlotTooltip").addClass("cavStatusBusy");
			}

			if($.cf.compareStrings(oTempStatus.status, "Free"))
				$(oElement).data("tooltipcontent", to.setting.slotTooltipContent.call(to, oTempStatus));

			if(to.setting.isTooltipInAppointmentView)
				to._addTooltipInAppointmentView(oElement);
		}
	},

	__goToPrevAppointmentView: function()
	{
		var to = this;
		if(to.setting.showTransition)
		{
			//-----------------------------------------------------------------------------------
			var $occCAVTableMain = $(to.elem).find(".cavTableMain"),
			icavTableWidth = $occCAVTableMain.width(),
			icavTableLeft = $occCAVTableMain.position().left,
			icavTableTop = 0;
			if($(to.elem).find(".cContHeader").length > 0)
				icavTableTop = $(to.elem).find(".cContHeader").position().top +  $(to.elem).find(".cContHeader").outerHeight() - 1;
			else
				icavTableTop = $(to.elem).position().top;

			var newElem = $occCAVTableMain.clone();
			$(newElem).removeClass(".cavTableMain").addClass("cavTableTemp");

			$(newElem).css({"position": "absolute", "top": icavTableTop, "left": icavTableLeft});
			$occCAVTableMain.parent().append(newElem);

			icavTableLeft = icavTableLeft + icavTableWidth;

			//-----------------------------------------------------------------------------------

			var $occCAVContRow2Main = $(to.elem).find(".cavContRow2Main"),
			icavContRow2Left = $occCAVContRow2Main.position().left,
			icavContRow2Width= $occCAVContRow2Main.width();

			var newElemCont2 = $occCAVContRow2Main.clone();
			$(newElemCont2).removeClass("cavContRow2Main").addClass("cavContRow2Temp");
			$occCAVContRow2Main.parent().append(newElemCont2);

			icavContRow2Left = icavContRow2Left + icavContRow2Width;

			//-----------------------------------------------------------------------------------
			$(to.elem).find(".cavContRow2Temp .cavSlotTableMain").removeClass("cavSlotTableMain").addClass("cavSlotTableTemp");
			//-----------------------------------------------------------------------------------

			$(newElem).animate({"left": icavTableLeft}, to.setting.transitionSpeed);
			$(newElemCont2).animate({"left": icavContRow2Left}, to.setting.transitionSpeed);

			setTimeout(function()
			{
				$(to.elem).find(".cavTableTemp").remove();
				$(to.elem).find(".cavContRow2Temp").remove();
			}, to.setting.transitionSpeed);

			//-----------------------------------------------------------------------------------
		}

		var iCurrentDateMS = to.tv.dVSDt.getTime();
		if(to.setting.daysInAppointmentView === 7)
			iCurrentDateMS -= (to.tv.iNoVDay * $.CalenStyle.extra.iMS.d);
		else
			iCurrentDateMS -= $.CalenStyle.extra.iMS.d;
		to.setting.selectedDate = to.setDateInFormat({"date": new Date(iCurrentDateMS)}, "START");
		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.sLoadType = "Prev";
		to.__reloadCurrentView(true, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	__goToNextAppointmentView: function()
	{
		var to = this;
		if(to.setting.showTransition)
		{
			//-----------------------------------------------------------------------------------
			var $occCAVTableMain = $(to.elem).find(".cavTableMain"),
			icavTableWidth = $occCAVTableMain.width(),
			icavTableLeft = $occCAVTableMain.position().left,
			icavTableTop = 0;
			if($(to.elem).find(".cContHeader").length > 0)
				icavTableTop = $(to.elem).find(".cContHeader").position().top +  $(to.elem).find(".cContHeader").outerHeight() - 1;
			else
				icavTableTop = $(to.elem).position().top;

			var newElem = $occCAVTableMain.clone();
			$(newElem).removeClass(".cavTableMain").addClass("cavTableTemp");

			$(newElem).css({"position": "absolute", "top": icavTableTop, "left": icavTableLeft});
			$occCAVTableMain.parent().append(newElem);

			icavTableLeft = icavTableLeft - icavTableWidth;

			//-----------------------------------------------------------------------------------

			var $occCAVContRow2Main = $(to.elem).find(".cavContRow2Main"),
			icavContRow2Left = $occCAVContRow2Main.position().left,
			icavContRow2Width= $occCAVContRow2Main.width();

			var newElemCont2 = $occCAVContRow2Main.clone();
			$(newElemCont2).removeClass("cavContRow2Main").addClass("cavContRow2Temp");
			$occCAVContRow2Main.parent().append(newElemCont2);

			icavContRow2Left = icavContRow2Left - icavContRow2Width;

			//-----------------------------------------------------------------------------------

			$(newElem).animate({"left": icavTableLeft}, to.setting.transitionSpeed);
			$(newElemCont2).animate({"left": icavContRow2Left}, to.setting.transitionSpeed);

			setTimeout(function()
			{
				$(to.elem).find(".cavTableTemp").remove();
				$(to.elem).find(".cavContRow2Temp").remove();

			}, to.setting.transitionSpeed);

			//-----------------------------------------------------------------------------------
		}

		var iCurrentDateMS = to.tv.dVEDt.getTime();
		iCurrentDateMS += $.CalenStyle.extra.iMS.d;
		to.setting.selectedDate = to.setDateInFormat({"date": new Date(iCurrentDateMS)}, "START");
		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.sLoadType = "Next";
		to.__reloadCurrentView(true, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	__adjustAppointmentTable: function()
	{
		var to = this;
		var icavCalendarContMaxHeight = $(to.elem).find(".cavCalendarCont").css("max-height");
		icavCalendarContMaxHeight = parseInt(icavCalendarContMaxHeight.replace("px", "")) || 0;
		var icavCalendarContMinHeight = $(to.elem).find(".cavCalendarCont").css("min-height");
		icavCalendarContMinHeight = parseInt(icavCalendarContMinHeight.replace("px", "")) || 0;

		if(icavCalendarContMaxHeight > 0 && $(to.elem).height() > icavCalendarContMaxHeight)
			$(to.elem).css({"height": icavCalendarContMaxHeight});
		else if(icavCalendarContMinHeight > 0 && $(to.elem).height() < icavCalendarContMinHeight)
			$(to.elem).css({"height": icavCalendarContMinHeight});
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
		to.__adjustHeader();

		if($.cf.compareStrings(to.setting.filterBarPosition, "Right"))
			$(to.elem).find(".cFilterBar").css({"left": iCalendarContWidth});

		iCalendarContHeight -= ($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerHeight() : 0;
		if(to.tv.bDisABar)
			iCalendarContHeight -= $(to.elem).find(".cActionBar").outerHeight();

		var icavTableRow1Height = $(to.elem).find(".cavTableRow1").height();
		icavTableRow2Height = iCalendarContHeight - icavTableRow1Height;
		$(to.elem).find(".cavTableRow2").css({"height": icavTableRow2Height});

		var icavTableWidth = iCalendarContWidth;
		$(to.elem).find(".cavTableMain").css({"width": icavTableWidth});

		$(to.elem).find(".cavTableScroll").css({"width": ($.CalenStyle.extra.iScrollbarWidth + $.CalenStyle.extra.iBorderOverhead)});

		icavTableWidth -= $.CalenStyle.extra.iScrollbarWidth;
		$(to.elem).find(".cavTableColumns").css({"width": (icavTableWidth / to.tv.iNoVDay)});

		var icavContRow2Top = $(to.elem).find(".cavTableMain").position().top + icavTableRow1Height,
		icavContRow2Left = $(to.elem).find(".cavTableMain").position().left,
		icavContRow2Width = $(to.elem).find(".cavTableMain").width() - $.CalenStyle.extra.iBorderOverhead,
		icavContRow2Height = icavTableRow2Height - $.CalenStyle.extra.iBorderOverhead;

		$(to.elem).find(".cavContRow2").css({"top": icavContRow2Top, "left": icavContRow2Left, "width": icavContRow2Width, "height": icavContRow2Height});

		var icavSlotTableWidth = icavContRow2Width - $.CalenStyle.extra.iScrollbarWidth;
		$(to.elem).find(".cavSlotTableMain").css({"width": icavSlotTableWidth});

		var icavSlotColumnsWidth = (icavContRow2Width - $.CalenStyle.extra.iScrollbarWidth) / to.tv.iNoVDay;
		$(to.elem).find(".cavSlotTableMain .cavSlotTableColumns").css({"width": icavSlotColumnsWidth});

		// ---------------------------------------------------------------------------------

		var icavSlotTableHeight = $(to.elem).find(".cavSlotTable").height(),
		icavTableRow2Height = $(to.elem).find(".cavTableRow2").height();

		if(!$(".calendarCont").hasClass("calendarContMobile") && !to._isFullScreen() && icavSlotTableHeight < icavTableRow2Height)
		{
			$(to.elem).find(".cavContRow2Main").css({"height": icavSlotTableHeight});
			$(to.elem).find(".cavTableRow2").css({"height": (icavSlotTableHeight + 1)});
			var icavTableHeight = $(to.elem).find(".cavTable").height(),
			icavContHeaderHeight = ($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").height() : 0,
			iCalendarContInnerHeight = icavContHeaderHeight + icavTableHeight;
			$(to.elem).find(".calendarContInner").css({"height": iCalendarContInnerHeight});

			iCalendarContHeight = iCalendarContInnerHeight;
			if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
			{
				iCalendarContHeight += $(to.elem).find(".cFilterBar").height();
				if($.cf.compareStrings(to.setting.filterBarPosition, "Bottom"))
					$(to.elem).find(".cFilterBar").css({"top": iCalendarContInnerHeight});
			}
			$(to.elem).css({"height": iCalendarContHeight});

			icavTableWidth = $(to.elem).find(".cavTable").width();
			$(to.elem).find(".cavTableScroll").css({"width": 0});
			$(to.elem).find(".cavTableColumns").css({"width": (icavTableWidth / to.tv.iNoVDay)});
		}

		//to.__adjustFontSize();
		to.setCalendarBorderColor();
	}

});

/*! ------------------------------------ CalenStyle Appointment View End ----------------------------------- */
