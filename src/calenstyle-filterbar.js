/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

/*! ---------------------------------- CalenStyle Filter View Start --------------------------------- */

//"use strict";

CalenStyle.prototype = $.extend(CalenStyle.prototype, {

 	__addEventCalendarToEventFilterCriteriaArray: function()
	{
		var to = this;
		var oFilterCal = {},
		bFilterCalExist = false,
		sArrValues = [],
		sArrSelectedValues = [],
		sArrDisplayValues = [],
		sArrDisplayStatus = [],
		iValIndex, sValue,
		iSCalIndex, oEventCalendar, sCalendarId, bCalendarExist;

		for(var iFilterIndex = 0; iFilterIndex < to.setting.eventFilterCriteria.length; iFilterIndex++)
		{
			var oFilter = to.setting.eventFilterCriteria[iFilterIndex];
			if($.cf.compareStrings(oFilter.keyName, "calendarId"))
			{
				oFilterCal = oFilter;
				bFilterCalExist = true;
				break;
			}
		}

		if(bFilterCalExist)
		{
			// Add New Values

			sArrValues = oFilterCal.values;
			sArrSelectedValues = oFilterCal.selectedValues;
			sArrDisplayValues = oFilterCal.displayValues;
			sArrDisplayStatus = oFilterCal.displayStatus;

			for(iSCalIndex = 0; iSCalIndex < to.tv.oAECalendar.length; iSCalIndex++)
			{
				oEventCalendar = to.tv.oAECalendar[iSCalIndex];
				sCalendarId = oEventCalendar.calendarId;
				bCalendarExist = false;

				for(iValIndex = 0; iValIndex < sArrValues.length; iValIndex++)
				{
					sValue = sArrValues[iValIndex];
					if($.cf.compareStrings(sCalendarId, sValue))
						bCalendarExist = true;
				}

				if(!bCalendarExist)
				{
					sArrValues.push(sCalendarId);
					sArrSelectedValues.push(sCalendarId);
					sArrDisplayValues.push(oEventCalendar.calendar);
					if(oEventCalendar.displayStatus)
						sArrDisplayStatus.push(oEventCalendar.displayStatus);
				}
			}

			// Delete Removed values
			var sArrRemoved = [];
			for(iValIndex = 0; iValIndex < sArrValues.length; iValIndex++)
			{
				sValue = sArrValues[iValIndex];
				bCalendarExist = false;

				for(iSCalIndex = 0; iSCalIndex < to.tv.oAECalendar.length; iSCalIndex++)
				{
					oEventCalendar = to.tv.oAECalendar[iSCalIndex];
					sCalendarId = oEventCalendar.calendarId;
					if($.cf.compareStrings(sCalendarId, sValue))
						bCalendarExist = true;
				}

				if(!bCalendarExist)
				{
					sArrRemoved.push(sValue);
					sArrValues[iValIndex] = "remove";
					if(sArrDisplayStatus.length > 0)
						sArrDisplayStatus[iValIndex] = "remove";
					if(sArrDisplayValues.length > 0)
						sArrDisplayValues[iValIndex] = "remove";
				}
			}

			var sArrTempValues = [],
			sArrTempDisplayStatus = [],
			sArrTempDisplayValues = [];
			for(iValIndex = 0; iValIndex < sArrValues.length; iValIndex++)
			{
				if(!$.cf.compareStrings(sArrValues[iValIndex], "remove"))
				{
					sArrTempValues.push(sArrValues[iValIndex]);
					sArrTempDisplayValues.push(sArrDisplayValues[iValIndex]);
					sArrTempDisplayStatus.push(sArrDisplayStatus[iValIndex]);
				}
			}
			sArrValues = sArrTempValues;
			sArrDisplayValues = sArrTempDisplayValues;
			sArrDisplayStatus = sArrTempDisplayStatus;

			var sArrTempSelectedValues = [];
			for(iValIndex = 0; iValIndex < sArrSelectedValues.length; iValIndex++)
			{
				var bRemoved = false;
				for(var iRValIndex = 0; iRValIndex < sArrRemoved.length; iRValIndex++)
				{
					if($.cf.compareStrings(sArrSelectedValues[iValIndex], sArrRemoved[iRValIndex]))
						bRemoved = true;
				}
				if(!bRemoved)
					sArrTempSelectedValues.push(sArrSelectedValues[iValIndex]);
			}
			sArrSelectedValues = sArrTempSelectedValues;


			oFilterCal.values = sArrValues;
			oFilterCal.selectedValues = sArrSelectedValues;
			oFilterCal.displayValues = sArrDisplayValues;
			oFilterCal.displayStatus = sArrDisplayStatus;
		}
		else
		{
			for(iSCalIndex = 0; iSCalIndex < to.tv.oAECalendar.length; iSCalIndex++)
			{
				oEventCalendar = to.tv.oAECalendar[iSCalIndex];
				sArrValues.push(oEventCalendar.calendarId);
				sArrSelectedValues.push(oEventCalendar.calendarId);
				sArrDisplayValues.push(oEventCalendar.calendar);
				if(oEventCalendar.displayStatus)
					sArrDisplayStatus.push(oEventCalendar.displayStatus);
			}
			oFilterCal.keyName = "calendarId";
			oFilterCal.keyDisplayName = "Calendars";
			oFilterCal.dataType = "String";
			oFilterCal.values = sArrValues;
			oFilterCal.selectedValues = sArrSelectedValues;
			oFilterCal.displayValues = sArrDisplayValues;
			oFilterCal.displayStatus = sArrDisplayStatus;
			to.setting.eventFilterCriteria.unshift(oFilterCal);
		}
	},

	_changeEventCalendarAfterApplicationOfFilter: function()
	{
		var to = this;
		var oFilterCal = null;
		for(var iFilterIndex = 0; iFilterIndex < to.setting.eventFilterCriteria.length; iFilterIndex++)
		{
			var oFilter = to.setting.eventFilterCriteria[iFilterIndex];
			if($.cf.compareStrings(oFilter.keyName, "calendar"))
			{
				oFilterCal = oFilter;
				break;
			}
		}

		if(oFilterCal !== null)
		{
			var oArrSelectedValues = oFilterCal.selectedValues;
			for(var iValIndex = 0; iValIndex < oArrSelectedValues.length; iValIndex++)
			{
				var sValue = oArrSelectedValues[iValIndex];
				for(var iSCalIndex = 0; iSCalIndex < to.tv.oAECalendar.length; iSCalIndex++)
				{
					var oEventCalendar = to.tv.oAECalendar[iSCalIndex];
					if($.cf.compareStrings(oEventCalendar.calendar, sValue))
						oEventCalendar.isSelected = true;
				}
			}
		}
	},

	__whetherToDisplayAnEventOnCalendar: function(oTempEvent)
	{
		var to = this;
		var oArrEventFilterCriteria = to.setting.eventFilterCriteria;
		if(oArrEventFilterCriteria.length <= 0)
			return true;

		var bDisplayEvent = false, bNoneSelectedForAllFilters = true,
		bArrTempDisplay = [],
		iTempIndex1, oArrTempFilter, oArrTempSelectedValues;

		for(iTempIndex1 = 0; iTempIndex1 < oArrEventFilterCriteria.length; iTempIndex1++)
		{
			oArrTempFilter = oArrEventFilterCriteria[iTempIndex1];
			oArrTempSelectedValues = oArrTempFilter.selectedValues;
			if(oArrTempSelectedValues.length > 0)
			{
				bNoneSelectedForAllFilters = false;
				break;
			}
		}

		for(iTempIndex1 = 0; iTempIndex1 < oArrEventFilterCriteria.length; iTempIndex1++)
		{
			oArrTempFilter = oArrEventFilterCriteria[iTempIndex1];
			var sTempKeyName = oArrTempFilter.keyName,
			oArrTempDataType = oArrTempFilter.dataType,
			oArrTempValues = oArrTempFilter.values;
			oArrTempSelectedValues = oArrTempFilter.selectedValues;

			var bNoneSelected = true;
			if(oArrTempSelectedValues.length > 0)
				bNoneSelected = false;

			bDisplayEvent = false;
			if(bNoneSelectedForAllFilters && $.cf.compareStrings(to.setting.noneSelectedFilterAction, "SelectNone"))
			{
				bDisplayEvent = false;
			}
			else
			{
				if((oArrTempValues.length === oArrTempSelectedValues.length) || bNoneSelected)
				{
					bDisplayEvent = true;
				}
				else
				{
					var oValuesInEvent = oTempEvent[sTempKeyName];
					if(oValuesInEvent !== null || oValuesInEvent !== undefined)
					{
						for(var iTempIndex2 = 0; iTempIndex2 < oArrTempSelectedValues.length; iTempIndex2++)
						{
							var oTempValue1 = oArrTempSelectedValues[iTempIndex2];

							if($.cf.compareStrings(oArrTempDataType, "Array"))
							{
								for(var iTempIndex3 = 0; iTempIndex3 < oValuesInEvent.length; iTempIndex3++)
								{
									var oTempValue2 = oValuesInEvent[iTempIndex3];
									if($.cf.compareStrings(oTempValue1, oTempValue2))
									{
										bDisplayEvent = true;
									}
								}
							}
							else if($.cf.compareStrings(oArrTempDataType, "String"))
							{
								if($.cf.compareStrings(oTempValue1, oValuesInEvent))
								{
									bDisplayEvent = true;
								}
							}
							else
							{
								if(oTempValue1 === oValuesInEvent)
								{
									bDisplayEvent = true;
								}
							}
						}
					}
				}
			}
			bArrTempDisplay.push(bDisplayEvent);
		}

		// AND Logic (if 1 value is false, output is false)

		bDisplayEvent = false;
		for(var iTempIndex = 0; iTempIndex < bArrTempDisplay.length; iTempIndex++)
		{
			if(bArrTempDisplay[iTempIndex])
				bDisplayEvent = true;
			else
			{
				bDisplayEvent = false;
				break;
			}
		}


		/*

		// OR Logic (if 1 value is true, output is true)

		bDisplayEvent = false;
		for(var iTempIndex = 0; iTempIndex < bArrTempDisplay.length; iTempIndex++)
		{
			if(!bArrTempDisplay[iTempIndex])
				bDisplayEvent = false;
			else
			{
				bDisplayEvent = true;
				break;
			}
		}
		*/

		return bDisplayEvent;
	},

	// Public Method
	applyFilter: function(oArrTempEventFilterCriteria, oSourceURLParams)
	{
		var to = this;
		to.setting.eventFilterCriteria = oArrTempEventFilterCriteria;
		if(oSourceURLParams !== null && oSourceURLParams !== undefined && oSourceURLParams.length > 0)
			to.reloadData(oSourceURLParams);
		else
			to.__reloadCurrentView(true, false);
	},

	__setEventCountBasedOnCriteria: function(oArrTempEvents)
	{
		var to = this;
		if(to.setting.eventFilterCriteria.length <= 0)
			return null;

		to.tv.oAEvFltrCnt = [];
		for(var iTempIndex1 = 0; iTempIndex1 < to.setting.eventFilterCriteria.length; iTempIndex1++)
		{
			var oArrTempFilter = to.setting.eventFilterCriteria[iTempIndex1],
			sTempKeyName = oArrTempFilter.keyName,
			oArrTempValues = oArrTempFilter.values,
			oTemp = {};

			oTemp.keyName = sTempKeyName;
			for(var iTempIndex2 = 0; iTempIndex2 < oArrTempValues.length; iTempIndex2++)
			{
				var iTempValueCount = 0;
				var sTempValue = oArrTempValues[iTempIndex2];
				for(var iTempIndex3 = 0; iTempIndex3 < oArrTempEvents.length; iTempIndex3++)
				{
					var oTempEvent = oArrTempEvents[iTempIndex3];
					if(sTempValue === oTempEvent[sTempKeyName])
						iTempValueCount++;
				}
				oTemp[sTempValue] = iTempValueCount;
			}
			to.tv.oAEvFltrCnt.push(oTemp);
		}
	}

 });

/*! ---------------------------------- CalenStyle Filter View End --------------------------------- */
