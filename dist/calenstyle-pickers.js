/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

/*! ---------------------------------- CalenStyle Month Picker Start --------------------------------- */

//"use strict";

function CalenStyle_MonthPicker(cso, bIsPopup)
{
	this.showOrHideMonthList = showOrHideMonthListInMonthPicker;

	// Public Method
	function showOrHideMonthListInMonthPicker()
	{
		if($(cso.elem).find(".cmlvOuterCont").length > 0)
			removeMonthListInMonthPicker();
		else
			showMonthListInMonthPicker();

		$(document).on($.CalenStyle.extra.sClickHandler+".MonthPicker", function(e)
		{
			removeMonthListInMonthPicker();
		});
	}

	function showMonthListInMonthPicker()
	{
		var sTempStr = "",
		sPopupClass = (bIsPopup) ? "cmlvPopup" : "cmlvFull";
		sTempStr += "<div class='cmlvOuterCont "+sPopupClass+"'>";
		sTempStr += "<div class='cmlvCont'>";
		if(bIsPopup)
			sTempStr += "<span class='cmlvContTooltip cmlvContTooltipBottom'></span>";
		sTempStr += "<table class='cmlvMonthListTable'>";

		var iCountMonth = 0;
		for(var iMonthIndex = 0; iMonthIndex < 3; iMonthIndex++)
		{
			sTempStr += "<tr>";
			for(var iMonthInnerIndex = 0; iMonthInnerIndex < 4; iMonthInnerIndex++)
			{
				var sMonthId = "cmlvMonth"+iCountMonth;
				if(cso.setting.selectedDate.getMonth() === iCountMonth)
					sTempStr += "<td id='" + sMonthId + "' class='cmlvMonth cmlvMonthCurrent'>" + cso.getDateInFormat({"iDate": {M: iCountMonth}}, "MMM", false, true) + "</td>";
				else
					sTempStr += "<td id='" + sMonthId + "' class='cmlvMonth cmlvMonthOther clickableLink'>" + cso.getDateInFormat({"iDate": {M: iCountMonth}}, "MMM", false, true) + "</td>";
				iCountMonth++;
			}
			sTempStr += "</tr>";
		}

		sTempStr += "</table>";
		sTempStr += "</div>";
		sTempStr += "</div>";
		$(cso.elem).find(".calendarCont").append(sTempStr);

		adjustMonthListInMonthPicker();
		if(cso.setting.adjustViewOnWindowResize)
			$(window).bind("resize." + cso.tv.pluginId, function(e){ adjustMonthListInMonthPicker(); });

		if(!$.CalenStyle.extra.bTouchDevice)
		{
			$(cso.elem).find(".cmlvMonth").hover(
				function(e)
				{
					var iCMLVMonthId = $(this).attr("id");
					iCMLVMonthId = iCMLVMonthId.replace("cmlvMonth", "");
					if(iCMLVMonthId !== cso.setting.selectedDate.getMonth())
						$(this).addClass("cmlvMonthOtherHover");
				},
				function(e)
				{
					var iCMLVMonthId = $(this).attr("id");
					iCMLVMonthId = iCMLVMonthId.replace("cmlvMonth", "");
					if(iCMLVMonthId !== cso.setting.selectedDate.getMonth())
						$(this).removeClass("cmlvMonthOtherHover");
				}
			);
		}

		$(cso.elem).find(".cmlvMonth").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();
			var sMonthId = $(this).attr("id"),
			iCurMonth = parseInt(sMonthId.replace("cmlvMonth", ""));
			setMonthInMonthPicker(iCurMonth);
		});

		$(cso.elem).find(".cmlvOuterCont").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();
			showOrHideMonthListInMonthPicker();
		});
	}

	function adjustMonthListInMonthPicker()
	{
		var $occCMLVCont = $(cso.elem).find(".cmlvCont");
		if(bIsPopup)
		{
			var $occCContHeaderLabelMonth = $(cso.elem).find(".cContHeaderLabelMonth"),
			iCMLVContHalfWidth = $occCMLVCont.width() / 2,
			iCMLVContTop =  $(cso.elem).find(".calendarContInner").position().top + $occCContHeaderLabelMonth.height() + 4 + ($.cf.compareStrings(cso.setting.sectionsList[0], "ActionBar") ? $(cso.elem).find(".cActionBar").height() : 0),
			iContHeaderLabelWidth = $occCContHeaderLabelMonth.width(),
			iContHeaderLabelLeft = $occCContHeaderLabelMonth.position().left || $(cso.elem).find(".cContHeaderLabelOuter").position().left,
			iContHeaderLabelMid = iContHeaderLabelLeft + (iContHeaderLabelWidth / 2),
			iCMLVContLeft =  $(cso.elem).find(".calendarContInner").position().left + (iContHeaderLabelMid - iCMLVContHalfWidth) - 4;
			iCMLVContLeft = (iCMLVContLeft < 0) ? 2 : iCMLVContLeft;
			$occCMLVCont.css({"top": iCMLVContTop, "left": iCMLVContLeft});
			$(".cmlvContTooltipBottom").css({"left": (iCMLVContHalfWidth - 5)});
		}

		if($(cso.elem).find(".cContHeader").length > 0)
			$occCMLVCont.css({"font-size": $(cso.elem).find(".cContHeader").css("font-size")});
		else
			$occCMLVCont.css({"font-size": $(cso.elem).css("font-size")});
		cso.setCalendarBorderColor();
	}

	function removeMonthListInMonthPicker()
	{
		if(cso.setting.adjustViewOnWindowResize)
			$(window).unbind("resize." + cso.tv.pluginId, adjustMonthListInMonthPicker);
		$(cso.elem).find(".cmlvOuterCont").remove();
	}

	function setMonthInMonthPicker(iCurMonth)
	{
		var iPrevMonthNum = cso.setting.selectedDate.getMonth();
		$(cso.elem).find("#cmlvMonth"+iPrevMonthNum).removeClass("cmlvMonthCurrent cmlvMonthOtherHover").addClass("cmlvMonthOther " +"clickableLink");

		cso.setting.selectedDate.setDate(1);
		cso.setting.selectedDate.setMonth(iCurMonth);
		cso.tv.dLoadDt = cso.setDateInFormat({"date": cso.setting.selectedDate}, "START");

		if(iCurMonth === (iPrevMonthNum - 1))
			cso.tv.sLoadType = "Prev";
		else if(iCurMonth === (iPrevMonthNum + 1))
			cso.tv.sLoadType = "Next";
		else
			cso.tv.sLoadType = "Load";

		cso.modifyCalenStyleObject(cso);
		$(cso.elem).find("#cmlvMonth"+iCurMonth).removeClass("cmlvMonthOther clickableLink cmlvMonthOtherHover").addClass("cmlvMonthCurrent");

		setTimeout(function()
		{
			if($.cf.compareStrings(cso.setting.visibleView, "AgendaView"))
			{
				cso.updateAgendaView(true);
				cso.adjustAgendaView();
			}
			else
			{
				cso.updateMonthTableAndContents(true);
				cso.adjustMonthTable();
			}
			removeMonthListInMonthPicker();
		}, cso.setting.transitionSpeed);
	}

}

/*! ---------------------------------- CalenStyle Month Picker End --------------------------------- */

/*! ---------------------------------- CalenStyle Year Picker Start --------------------------------- */

function CalenStyle_YearPicker(cso, bIsPopup)
{
	this.showOrHideYearList = showOrHideYearListInYearPicker;
	var iCYLVStartYear, iCYLVEndYear;

	// Public Method
	function showOrHideYearListInYearPicker()
	{
		if($(cso.elem).find(".cylvOuterCont").length > 0)
			removeYearListInYearPicker();
		else
			showYearListInYearPicker();

		$(document).on($.CalenStyle.extra.sClickHandler+".YearPicker", function(e)
		{
			removeYearListInYearPicker();
		});
	}

	function showYearListInYearPicker()
	{
		var iCurrentDateYear = cso.setting.selectedDate.getFullYear();
		iCYLVStartYear = iCurrentDateYear - 5;
		iCYLVEndYear = iCYLVStartYear + 12;

		var sTempStr = "",
		sPopupClass = (bIsPopup) ? "cylvPopup" : "cylvFull";
		sTempStr += "<div class='cylvOuterCont "+sPopupClass+"'>";
		sTempStr += "<div class='cylvCont'>";
		if(bIsPopup)
			sTempStr += "<span class='cylvContTooltip cylvContTooltipBottom'></span>";
		sTempStr += "<table class='cylvYearListOuterTable'>";
		sTempStr += "<tr class='cylvTableHeaderRow'>";
		sTempStr += "<td class='cylvTableColumns cylvPrevYears clickableLink cs-icon-Prev'></td>";
		sTempStr += "<td class='cylvTableColumns cylvSelectedYear clickableLink'>" + cso.getNumberStringInFormat(iCurrentDateYear, 0, true) + "</td>";
		sTempStr += "<td class='cylvTableColumns cylvNextYears clickableLink cs-icon-Next'></td>";
		sTempStr += "</tr>";
		sTempStr += "<tr class='cylvTableContRow'>";
		sTempStr += "<td colspan='3'>";
		sTempStr += "<table class='cylvYearListTable cylvYearListTableMain'>";
		sTempStr += "</table>";
		sTempStr += "</td>";
		sTempStr += "</tr>";
		sTempStr += "</table>";
		sTempStr += "</div>";
		sTempStr += "</div>";
		$(cso.elem).find(".calendarCont").append(sTempStr);

		$(cso.elem).find(".cylvPrevYears").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();
			goToPrevYearListInYearPicker();
		});

		$(cso.elem).find(".cylvSelectedYear").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();
			showCurrentYearInYearPicker();
		});

		$(cso.elem).find(".cylvNextYears").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();
			goToNextYearListInYearPicker();
		});

		adjustYearListInYearPicker();
		if(cso.setting.adjustViewOnWindowResize)
			$(window).bind("resize." + cso.tv.pluginId, function(e){ adjustYearListInYearPicker(); });

		if(!$.CalenStyle.extra.bTouchDevice)
		{
			$(cso.elem).find(".cylvPrevYears, .cylvNextYears").hover(
				function(e)
				{
					$(this).addClass("cylvTableColumnsHover");
				},
				function(e)
				{
					$(this).removeClass("cylvTableColumnsHover");
				}
			);

			$(cso.elem).find(".cylvSelectedYear").hover(
				function(e)
				{
					$(this).addClass("cylvSelectedYearHover");
				},
				function(e)
				{
					$(this).removeClass("cylvSelectedYearHover");
				}
			);
		}
		updateYearListInYearPicker();

		$(cso.elem).find(".cylvOuterCont").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();
			showOrHideYearListInYearPicker();
		});
	}

	function adjustYearListInYearPicker()
	{
		var $occCYLVCont = $(cso.elem).find(".cylvCont"),

		iCYLVTableContRowHeight = $(".cylvTableContRow").height();
		$(".cylvYearListTable").css({"height": iCYLVTableContRowHeight});

		if(bIsPopup)
		{
			var $occCContHeaderLabelYear = $(cso.elem).find(".cContHeaderLabelYear"),
			iCYLVContHalfWidth = $occCYLVCont.width() / 2,
			iCYLVContTop = $(cso.elem).find(".calendarContInner").position().top + $occCContHeaderLabelYear.height() + 4 + ($.cf.compareStrings(cso.setting.sectionsList[0], "ActionBar") ? $(cso.elem).find(".cActionBar").height() : 0),
			iContHeaderLabelWidth = $occCContHeaderLabelYear.width(),
			iContHeaderLabelLeft = ($occCContHeaderLabelYear.position().left || $(cso.elem).find(".cContHeaderLabelOuter").position().left),
			iContHeaderLabelMid = iContHeaderLabelLeft + (iContHeaderLabelWidth / 2),
			iCYLVContLeft = $(cso.elem).find(".calendarContInner").position().left + (iContHeaderLabelMid - iCYLVContHalfWidth) - 4;
			iCYLVContLeft = (iCYLVContLeft < 0) ? 2 : iCYLVContLeft;
			$occCYLVCont.css({"top": iCYLVContTop, "left": iCYLVContLeft});
			$(".cylvContTooltipBottom").css({"left": (iCYLVContHalfWidth - 5)});
		}

		if($(cso.elem).find(".cContHeader").length > 0)
			$occCYLVCont.css({"font-size": $(cso.elem).find(".cContHeader").css("font-size")});
		else
			$occCYLVCont.css({"font-size": $(cso.elem).css("font-size")});
		cso.setCalendarBorderColor();
	}

	function updateYearListInYearPicker()
	{
		var iCurrentDateYear = cso.setting.selectedDate.getFullYear(),
		iCountYear = 0, sTempStr = "";
		for(var iYearIndex = iCYLVStartYear; iYearIndex < iCYLVEndYear; iYearIndex++)
		{
			if(iCountYear === 0 || iCountYear === 4 || iCountYear === 8)
				sTempStr += "<tr class='cylvTableRow'>";

			var sYearId = "cylvYear"+iYearIndex;
			if(iCurrentDateYear=== iYearIndex)
				sTempStr += "<td id='" + sYearId + "' class='cylvYear cylvYearCurrent'>" + cso.getNumberStringInFormat(iYearIndex, 0, true) + "</td>";
			else
				sTempStr += "<td id='" + sYearId + "' class='cylvYear cylvYearOther clickableLink'>" + cso.getNumberStringInFormat(iYearIndex, 0, true) + "</td>";

			if(iCountYear === 3 || iCountYear === 7 || iCountYear === 11)
				sTempStr += "</tr>";

			iCountYear++;
		}
		$(cso.elem).find(".cylvYearListTableMain").html(sTempStr);

		$(cso.elem).find(".cylvYear").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();

			var sYearId = $(this).attr("id"),
			iCurYear = parseInt(sYearId.replace("cylvYear", ""));
			setYearInYearPicker(iCurYear);
		});

		if(!$.CalenStyle.extra.bTouchDevice)
		{
			$(cso.elem).find(".cylvYear").hover(
				function(e)
				{
					if($(this).html() !== cso.setting.selectedDate.getFullYear())
						$(this).addClass("cylvYearOtherHover");
				},
				function(e)
				{
					if($(this).html() !== cso.setting.selectedDate.getFullYear())
						$(this).removeClass("cylvYearOtherHover");
				}
			);
		}
	}

	function removeYearListInYearPicker()
	{
		if(cso.setting.adjustViewOnWindowResize)
			$(window).unbind("resize." + cso.tv.pluginId, adjustYearListInYearPicker);
		$(cso.elem).find(".cylvOuterCont").remove();
	}

	function setYearInYearPicker(iCurYear)
	{
		var iPrevYearNum = cso.setting.selectedDate.getFullYear();
		$(cso.elem).find("#cylvYear"+iPrevYearNum).removeClass("cylvYearCurrent cylvYearOtherHover").addClass("cylvYearOther");

		cso.tv.sLoadType = "Load";
		cso.setting.selectedDate.setFullYear(iCurYear);
		cso.tv.dLoadDt = cso.setDateInFormat({"date": cso.setting.selectedDate}, "START");

		cso.modifyCalenStyleObject(cso);

		setTimeout(function()
		{
			if($.cf.compareStrings(cso.setting.visibleView, "AgendaView"))
			{
				cso.updateAgendaView(true);
				cso.adjustAgendaView();
			}
			else
			{
				cso.updateMonthTableAndContents(true);
				cso.adjustMonthTable();
			}
			$(cso.elem).find("#cylvYear"+iCurYear).removeClass("cylvYearOther cylvYearOtherHover").addClass("cylvYearCurrent");
			removeYearListInYearPicker();
		}, cso.setting.transitionSpeed);
	}

	function goToPrevYearListInYearPicker()
	{
		$(cso.elem).find(".cylvPrevYears").addClass("cylvTableColumnsHover");

		var $oElemCYLVYearListTable = $(cso.elem).find(".cylvYearListTableMain"),
		iCYLVTableTop = $oElemCYLVYearListTable.position().top,
		iCYLVTableLeft = $oElemCYLVYearListTable.position().left,
		iCYLVTableWidth = $oElemCYLVYearListTable.width(),
		iCYLVTableHeight = $oElemCYLVYearListTable.height();

		var newElem = $oElemCYLVYearListTable.clone();
		$(newElem).removeClass("cylvYearListTableMain").addClass("cylvYearListTableTemp");
		$(newElem).css({"position": "absolute", "top": iCYLVTableTop, "left": iCYLVTableLeft, "height": iCYLVTableHeight});
		$oElemCYLVYearListTable.parent().append(newElem);

		iCYLVTableLeft = iCYLVTableLeft + iCYLVTableWidth;
		$(newElem).animate({"left": iCYLVTableLeft}, cso.setting.transitionSpeed);

		setTimeout(function()
		{
			$(cso.elem).find(".cylvYearListTableTemp").remove();
		}, cso.setting.transitionSpeed);

		$(cso.elem).find(".cylvPrevYears").removeClass("cylvTableColumnsHover");

		iCYLVStartYear = iCYLVStartYear - 12;
		iCYLVEndYear = iCYLVStartYear + 12;

		updateYearListInYearPicker();
	}

	function goToNextYearListInYearPicker()
	{
		$(cso.elem).find(".cylvNextYears").addClass("cylvTableColumnsHover");

		var $oElemCYLVYearListTable = $(cso.elem).find(".cylvYearListTableMain"),
		iCYLVTableTop = $oElemCYLVYearListTable.position().top,
		iCYLVTableLeft = $oElemCYLVYearListTable.position().left,
		iCYLVTableWidth = $oElemCYLVYearListTable.width(),
		iCYLVTableHeight = $oElemCYLVYearListTable.height();

		var newElem = $oElemCYLVYearListTable.clone();
		$(newElem).removeClass("cylvYearListTableMain").addClass("cylvYearListTableTemp");
		$(newElem).css({"position": "absolute", "top": iCYLVTableTop, "left": iCYLVTableLeft, "height": iCYLVTableHeight});
		$oElemCYLVYearListTable.parent().append(newElem);

		iCYLVTableLeft = iCYLVTableLeft - iCYLVTableWidth;
		$(newElem).animate({"left": iCYLVTableLeft}, cso.setting.transitionSpeed);

		setTimeout(function()
		{
			$(cso.elem).find(".cylvYearListTableTemp").remove();
		}, cso.setting.transitionSpeed);

		$(cso.elem).find(".cylvNextYears").removeClass("cylvTableColumnsHover");

		iCYLVStartYear = iCYLVStartYear + 12;
		iCYLVEndYear = iCYLVStartYear + 12;

		updateYearListInYearPicker();
	}

	function showCurrentYearInYearPicker()
	{
		var iCYLVPrevStartYear = iCYLVStartYear;

		var iCurrentDateYear = cso.setting.selectedDate.getFullYear();
		iCYLVStartYear = iCurrentDateYear - 5;
		iCYLVEndYear = iCYLVStartYear + 12;

		if(iCYLVPrevStartYear !== iCYLVStartYear)
		{
			$(cso.elem).find(".cylvSelectedYear").addClass("cylvTableColumnsClick");

			var $oElemCYLVYearListTable = $(cso.elem).find(".cylvYearListTableMain"),
			iCYLVTableTop = $oElemCYLVYearListTable.position().top,
			iCYLVTableLeft = $oElemCYLVYearListTable.position().left,
			iCYLVTableWidth = $oElemCYLVYearListTable.width(),
			iCYLVTableHeight = $oElemCYLVYearListTable.height();

			var newElem = $oElemCYLVYearListTable.clone();
			$(newElem).removeClass("cylvYearListTableMain").addClass("cylvYearListTableTemp");
			$(newElem).css({"position": "absolute", "top": iCYLVTableTop, "left": iCYLVTableLeft, "height": iCYLVTableHeight});
			$oElemCYLVYearListTable.parent().append(newElem);

			if(iCYLVPrevStartYear < iCYLVStartYear)
				iCYLVTableLeft = iCYLVTableLeft - iCYLVTableWidth;
			else
				iCYLVTableLeft = iCYLVTableLeft + iCYLVTableWidth;
			$(newElem).animate({"left": iCYLVTableLeft}, cso.setting.transitionSpeed);

			setTimeout(function()
			{
				$(cso.elem).find(".cylvYearListTableTemp").remove();
			}, cso.setting.transitionSpeed);

			$(cso.elem).find(".cylvSelectedYear").removeClass("cylvTableColumnsClick");
			updateYearListInYearPicker();
		}
	}

}

/*! ---------------------------------- CalenStyle Year Picker End --------------------------------- */
