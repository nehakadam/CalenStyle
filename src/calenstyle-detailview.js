/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

/*! ---------------------------------- CalenStyle Detail View Start ---------------------------------- */

//"use strict";

CalenStyle.prototype = $.extend(CalenStyle.prototype, {

	_getTimeSlotsArrayForCurrentView: function()
	{
		var to = this;

		var iNumOfDays = $.cf.compareStrings(to.setting.visibleView, "DayEventDetailView") ? 1 : to.tv.iNoVDay,
		iMaxTimeSlots = 24 * to.tv.iUTmSlt,
		bArrTemp, iDateIndex, iSlotsIndex, iTempIndex, iNumOfSlotsSpanned,
		iTempHour, iTempMinutes, iTempSlot, iTempSlotIndex;
		to.tv.bADVCur = []; to.tv.sADVInfo = [];

		// ---------------------- Set arrayOfTimeSlots Start --------------------------

		for(iDateIndex = 0; iDateIndex < iNumOfDays; iDateIndex++)
		{
			bArrTemp = [];
			for(var iHoursIndex = 0; iHoursIndex < 24; iHoursIndex++)
			{
				for(iSlotsIndex = 0; iSlotsIndex < to.tv.iUTmSlt; iSlotsIndex++)
				{
					bArrTemp.push(0);
				}
			}
			bArrTemp.push(0); // For All Day
			to.tv.bADVCur.push(bArrTemp);
		}

		// ---------------------- Set arrayOfTimeSlots End ----------------------------

		// ------------- Set RestrictedSection and BusinessHours in arrayOfTimeSlots Start --------------

		var dThisTempDate = new Date(to.tv.dVDSDt),
		iThisTempDate = to.tv.dVDSDt.getTime();

		for(iDateIndex = 0; iDateIndex < iNumOfDays; iDateIndex++)
		{
			if(to.tv.bABsDays[dThisTempDate.getDay()] || !to.setting.excludeNonBusinessHours)
			{
				bArrTemp = to.tv.bADVCur[iDateIndex];

				var dArrTempResSec = to._getRestrictedSectionForCurrentView(dThisTempDate),
				oArrTempBusinessHours = to._getBusinessHoursForCurrentView(dThisTempDate);

				// ---------------------- Set Available Date Array Indicator Start --------------------------

				if(oArrTempBusinessHours.length > 0)
				{
					for(iTempIndex = 0; iTempIndex < oArrTempBusinessHours.length; iTempIndex++)
					{
						var dArrTempAvailable = oArrTempBusinessHours[iTempIndex],
						dTempAvailableStart = new Date(dArrTempAvailable[0]),
						dTempAvailableEnd = new Date(dArrTempAvailable[1]);
						iNumOfSlotsSpanned = Math.floor((dTempAvailableEnd.getTime() - dTempAvailableStart.getTime()) / to.tv.iUTmMS);

						iTempHour = dTempAvailableStart.getHours();
						iTempMinutes = dTempAvailableStart.getMinutes();
						iTempSlot = Math.floor(iTempMinutes / to.setting.unitTimeInterval);
						for(iSlotsIndex = 0; iSlotsIndex < iNumOfSlotsSpanned; iSlotsIndex++)
						{
							iTempSlotIndex = (iTempHour === 0) ? iTempSlot : ((iTempHour * to.tv.iUTmSlt) + iTempSlot);
							bArrTemp[iTempSlotIndex] = 1;

							iTempMinutes += to.setting.unitTimeInterval;
							iTempSlot = Math.floor(iTempMinutes / to.setting.unitTimeInterval);
							if(iTempMinutes >= 60)
							{
								iTempMinutes = iTempMinutes % to.setting.unitTimeInterval;
								iTempSlot = Math.floor(iTempMinutes / to.setting.unitTimeInterval);
								iTempHour += 1;
							}
						}
					}
				}
				// ----------------------- Set Available Date Array Indicator End ---------------------------

				// --------------- Set RestrictedSection Date Array Indicator Start ---------------------------------

				if(dArrTempResSec.length > 0)
				{
					for(iTempIndex = 0; iTempIndex < dArrTempResSec.length; iTempIndex++)
					{
						var dArrResSec = dArrTempResSec[iTempIndex],
						dTempResSecStart = new Date(dArrResSec.start),
						bCompStart = to.compareDates(dThisTempDate, dTempResSecStart) === 0,
						dTempResSecEnd = new Date(dArrResSec.end),
						bCompEnd = to.compareDates(dThisTempDate, dTempResSecEnd) === 0;

						if(!bCompStart)
							dTempResSecStart = to._normalizeDateTime(dThisTempDate, "START", "T");
						if(!bCompEnd)
							dTempResSecEnd = to._normalizeDateTime(dThisTempDate, "END", "T");

						iNumOfSlotsSpanned = Math.round((dTempResSecEnd.getTime() - dTempResSecStart.getTime()) / to.tv.iUTmMS);
						iNumOfSlotsSpanned = (iNumOfSlotsSpanned === 0) ? 1 : (iNumOfSlotsSpanned > iMaxTimeSlots) ? iMaxTimeSlots : iNumOfSlotsSpanned;

						var iInfoIndex = 2, oDVInfo,
						bBGColorFound = false,
						bClassFound = false,
						bMatchFound = false,
						sResSecBg = dArrResSec.backgroundColor,
						bValidBGColor = $.cf.isValid(sResSecBg),
						sResSecClass = dArrResSec.class,
						bValidClass = $.cf.isValid(sResSecClass);
						if(bValidBGColor || bValidClass)
						{
							for(iInfoIndex = 0; iInfoIndex < to.tv.sADVInfo.length; iInfoIndex++)
							{
								oDVInfo = to.tv.sADVInfo[iInfoIndex];
								bBGColorFound = bValidBGColor && (oDVInfo.bgColor === sResSecBg);
								bClassFound = bValidClass && (oDVInfo.class === sResSecClass);
								if(bValidBGColor && bValidClass)
								{
									if(bBGColorFound && bClassFound)
									{
										iInfoIndex = oDVInfo.index;
										bMatchFound = true;
										break;
									}
								}
								else
								{
									if(bBGColorFound || bClassFound)
									{
										iInfoIndex = oDVInfo.index;
										bMatchFound = true;
										break;
									}
								}
							}

							if(!bMatchFound)
							{
								oDVInfo = {};
								iInfoIndex = 3 + to.tv.sADVInfo.length;
								oDVInfo.index = iInfoIndex;
								if(bValidBGColor)
									oDVInfo.bgColor = sResSecBg;
								if(bValidClass)
									oDVInfo.class = sResSecClass;
								to.tv.sADVInfo.push(oDVInfo);
							}
						}

						if(iNumOfSlotsSpanned === iMaxTimeSlots)
						{
							bArrTemp[bArrTemp.length - 1] = iInfoIndex;
						}

						iTempHour = dTempResSecStart.getHours();
						iTempMinutes = dTempResSecStart.getMinutes();
						iTempSlot = Math.floor(iTempMinutes / to.setting.unitTimeInterval);

						for(iSlotsIndex = 0; iSlotsIndex < iNumOfSlotsSpanned; iSlotsIndex++)
						{
							iTempSlotIndex = (iTempHour === 0) ? iTempSlot : ((iTempHour * to.tv.iUTmSlt) + iTempSlot);
							bArrTemp[iTempSlotIndex] = iInfoIndex;

							iTempMinutes += to.setting.unitTimeInterval;
							iTempSlot = Math.floor(iTempMinutes / to.setting.unitTimeInterval);
							if(iTempMinutes >= 60)
							{
								iTempMinutes = iTempMinutes % to.setting.unitTimeInterval;
								iTempSlot = Math.floor(iTempMinutes / to.setting.unitTimeInterval);
								iTempHour += 1;
							}
						}
					}
				}
				// --------------- Set RestrictedSection Date Array Indicator End -----------------------------------

				to.tv.bADVCur[iDateIndex] = bArrTemp;
			}

			iThisTempDate += $.CalenStyle.extra.iMS.d;
			dThisTempDate = new Date(iThisTempDate);
		}

		// ------------- Set RestrictedSection and BusinessHours in arrayOfTimeSlots Start --------------
	},

	_getStartAndEndDatesOfEventWithId: function(iEventId)
	{
		var to = this;
		var oThisEvent = to.getEventWithId(iEventId);
		return [oThisEvent.start, oThisEvent.end];
	},

	_getNumberOfHoursOfEventWithId: function(sEventId)
	{
		var to = this;
		var oEvent = to.getEventWithId(sEventId);
		return to.__getNumberOfHoursOfEvent(oEvent.isAllDay, oEvent.start, oEvent.end);
	},

	_getNumberOfDaysOfEventForWeek: function(bIsAllDay, dStartDateTime, dEndDateTime, bWithHours, bForView)
	{
		var to = this;
		var dTempEndDateTime;
		if(bIsAllDay && to.compareDateTimes(dStartDateTime, dEndDateTime) === 0)
			dTempEndDateTime = new Date(dEndDateTime.getTime() + $.CalenStyle.extra.iMS.d);
		else
			dTempEndDateTime = new Date(dEndDateTime);
		if(dTempEndDateTime.getHours() === 0 && dTempEndDateTime.getMinutes() === 0)
			dTempEndDateTime.setMinutes(dTempEndDateTime.getMinutes() - 1);

		var iNumOfDays = 0,
		dArrTempDates = to.__getStartAndEndDatesOfEventForView(bIsAllDay, dStartDateTime, dTempEndDateTime),
		dTempStartDate = dArrTempDates[0], dTempEndDate = dArrTempDates[1],
		iNumOfMinutes = Math.round((dTempEndDate.getTime() - dTempStartDate.getTime()) / $.CalenStyle.extra.iMS.m),
		iNumOfHours = Math.round(iNumOfMinutes / 60);

		if(iNumOfMinutes < 0)
			console.log("Invalid Start And End Dates " + dStartDateTime + " " + dTempEndDateTime);
		else
		{
			iNumOfDays = 0;

			if(to.compareDates(dTempStartDate, dTempEndDate) !== 0)
			{
				var dNewStartDate = to.setDateInFormat({"date": dTempStartDate}, "START"),
				dNewEndDate = to.setDateInFormat({"date": dTempEndDate}, "START"),
				iNewNumOfHours = (dNewEndDate.getTime() - dNewStartDate.getTime()) / $.CalenStyle.extra.iMS.h;
				iNumOfDays = Math.round(iNewNumOfHours / 24) + 1;

				if(bForView)
				{
					var dTempDate = new Date(dNewStartDate), iTempNumOfDays = 0;
					for(var iTempIndex = 0; iTempIndex < iNumOfDays; iTempIndex++)
					{
						if(to.__findWhetherDateIsVisibleInCurrentView(dTempDate, (bIsAllDay || iNumOfHours > 23), dTempStartDate, dTempEndDate))
							iTempNumOfDays++;
						dTempDate.setDate(dTempDate.getDate() + 1);
					}
					iNumOfDays = iTempNumOfDays;
				}
			}
			else
			{
				if(bForView)
				{
					if(to.__findWhetherDateIsVisibleInCurrentView(dTempStartDate, (bIsAllDay || iNumOfHours > 23), dTempStartDate, dTempEndDate))
						iNumOfDays = 1;
				}
				else
					iNumOfDays = 1;
			}
		}

		if(bWithHours)
			return [iNumOfDays, iNumOfHours];
		else
			return iNumOfDays;
	},

	_getLeftPositionOfEventSeg: function(iLeftPos)
	{
		var to = this;
		var iArrDVDaysLength = to.tv.fADVDayLftPos.length,
		iDVTableColumnWidth = $(to.elem).find(".cdvTableColumns").width(),
		iNewLeftPos = 0;
		for(var iTempIndex1 = 0; iTempIndex1 < iArrDVDaysLength; iTempIndex1++)
		{
			var iHoriStartPos = to.tv.fADVDayLftPos[iTempIndex1],
			iHoriEndPos = iHoriStartPos + iDVTableColumnWidth;

			iHoriStartPos -= 5;
			iHoriEndPos -= 5;

			if(iTempIndex1 === (iArrDVDaysLength - 1))
				iHoriEndPos += 5;
			if(iLeftPos >= iHoriStartPos && iLeftPos <= iHoriEndPos)
			{
				iNewLeftPos = to.tv.fADVDayLftPos[iTempIndex1];
				break;
			}
		}
		return iNewLeftPos;
	},

	_getDateBasedOnLeftPosition: function(iLeftPos)
	{
		var to = this;
		if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
			return to.setting.selectedDate;

		var iDVTableColumnWidth = $(to.elem).find(".cdvTableColumns").width(),
		iArrDVDaysLength = to.tv.fADVDayLftPos.length,
		iTempIndex = 0, iThisIndex = 0, iTempIndex1;

		for(iTempIndex1 = 0; iTempIndex1 < iArrDVDaysLength; iTempIndex1++)
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

		for(iTempIndex1 = 0; iTempIndex1 < to.tv.dAVDt.length; iTempIndex1++)
		{
			var dThisDate = to.tv.dAVDt[iTempIndex1];
			if(to.__isDateInCurrentView(dThisDate))
			{
				iTempIndex++;
				if(iTempIndex === iThisIndex)
					return dThisDate;
			}
		}
	},

	_getDateForDayNumber: function(iDayNumber, bFromLeft)
	{
		var to = this;
		var iThisIndex = (bFromLeft) ? 0 : (to.tv.iNoVDay - 1),
		iThisDayNumber = 0;
		for(var iTempIndex = 0; iTempIndex < to.tv.iNoVDay; iTempIndex++)
		{
			iThisDayNumber++;
			if(iThisDayNumber === iDayNumber)
				return to.tv.dAVDt[iThisIndex];
			iThisIndex = (bFromLeft) ? (iThisIndex + 1) : (iThisIndex - 1);
		}
	},

	_createCopyOfArray: function(oArrInput)
	{
		var to = this;
		var oArrOutput = [];
		return oArrOutput.concat(oArrInput);
	},

	//------------------------------- Event Segment Manipulation Start -------------------------------

	_setPropertiesOfEventSeg: function()
	{
		var to = this;
		var oArrCollidingEvents = [], oTempArrEventSegs, oArrTempSlot, oArrTimeSlots, iSlotIndex;

		// ---------------------------- setPropertiesOfEventSegments ----------------------------

		for(var iThisDay = 0; iThisDay < to.tv.dAVDt.length; iThisDay++)
		{
			var oArrConditions = [];
			oArrConditions.push(["eventSegStart", to.tv.dAVDt[iThisDay]]);
			var oArrTempEvents = to._getEventSegWith(oArrConditions);
			oArrTempEvents = to._sortEventSeg(to._createCopyOfArray(oArrTempEvents));

			oArrTimeSlots = [];
			for(var iThisEvent = 0; iThisEvent < oArrTempEvents.length; iThisEvent++)
			{
				var oEventSeg = oArrTempEvents[iThisEvent],
				dSegStartDate = oEventSeg.eventSegStart,
				dSegEndDate = oEventSeg.eventSegEnd;

				if(oArrTimeSlots.length <= 0)
				{
					oTempArrEventSegs = new Array(oEventSeg);
					oArrTempSlot = new Array(dSegStartDate, dSegEndDate, oTempArrEventSegs);
					oArrTimeSlots.push(oArrTempSlot);
				}
				else
				{
					var bAddedInExisting = 0;
					for(iSlotIndex = 0; iSlotIndex < oArrTimeSlots.length; iSlotIndex++)
					{
						var oTimeSlot = oArrTimeSlots[iSlotIndex],
						dSlotStartDate = oTimeSlot[0],
						dSlotEndDate = oTimeSlot[1],

						bSegStartDate1 = 0, bSegStartDate2 = 0,
						bSegEndDate1 = 0, bSegEndDate2 = 0,
						iCompStartTime1 = to.compareDateTimes(dSegStartDate, dSlotStartDate),
						iCompStartTime2 = to.compareDateTimes(dSegStartDate, dSlotEndDate),
						iCompEndTime1 = to.compareDateTimes(dSegEndDate, dSlotStartDate),
						iCompEndTime2 = to.compareDateTimes(dSegEndDate, dSlotEndDate);
						if(iCompStartTime1 > 0 || iCompStartTime1 === 0)
							bSegStartDate1 = 1;
						if(iCompStartTime2 < 0)
							bSegStartDate2 = 1;
						if(iCompEndTime1 > 0)
							bSegEndDate1 = 1;
						if(iCompEndTime2 < 0 || iCompEndTime2 === 0)
							bSegEndDate2 = 1;

						if((bSegStartDate1 === 1 && bSegStartDate2 === 1) || (bSegEndDate1 === 1 && bSegEndDate2 === 1))
						{
							var oArrSlotSegments = oTimeSlot[2];
							oArrSlotSegments.push(oEventSeg);
							bAddedInExisting = 1;
						}

						if(iCompStartTime1 < 0)
							oTimeSlot[0] = dSegStartDate; // Changing StartTime
						if(iCompEndTime2 > 0 && iCompStartTime2 < 0)
							oTimeSlot[1] = dSegEndDate; // Changing EndTime
					}

					if(bAddedInExisting === 0)
					{
						oTempArrEventSegs = new Array(oEventSeg);
						oArrTempSlot = new Array(dSegStartDate, dSegEndDate, oTempArrEventSegs);
						oArrTimeSlots.push(oArrTempSlot);
					}
				}
			}
			oArrCollidingEvents.push(oArrTimeSlots);
		}

		// ------------------------------ Colliding Events -------------------------------

		var oAEventsegColumns = [];
		for(var iIndex = 0; iIndex < oArrCollidingEvents.length; iIndex++)
		{
			oArrTimeSlots = oArrCollidingEvents[iIndex];
			var oArrTempColumns =  [];
			for(iSlotIndex = 0; iSlotIndex < oArrTimeSlots.length; iSlotIndex++)
			{
				var oArrTempTimeSlot = oArrTimeSlots[iSlotIndex],
				oAEventSegs = oArrTempTimeSlot[2],
				oArrColumns = to._assignEventSegToColumnsInDetailView(oAEventSegs);
				oArrTempColumns.push([oArrTempTimeSlot[0], oArrTempTimeSlot[1], oArrColumns]);
			}
			oAEventsegColumns.push(oArrTempColumns);
		}
	},

	_getEventSegWith: function(oArrConditions)
	{
		var to = this;
		var oArrTempEvents = [];
		for(var iSeg = 0; iSeg < to.tv.oASmEvSeg.length; iSeg++)
		{
			var oEventSeg = to.tv.oASmEvSeg[iSeg],
			bConditionSatisfied = 0;
			for(var iCondition = 0; iCondition < oArrConditions.length; iCondition++)
			{
				var oCondition = oArrConditions[iCondition],
				propertyName = oCondition[0],
				compareToValue = oCondition[1];
				if($.cf.compareStrings(propertyName, "eventSegStart") || $.cf.compareStrings(propertyName, "eventSegEnd"))
				{
					if(to.compareDates(oEventSeg[propertyName], compareToValue) === 0)
						bConditionSatisfied++;
				}
				else
				{
					if(oEventSeg[propertyName] === compareToValue)
						bConditionSatisfied++;
				}
			}
			if(bConditionSatisfied === oArrConditions.length)
				oArrTempEvents.push(oEventSeg);
		}
		return oArrTempEvents;
	},

	_sortEventSeg: function(oArrTempEventSegs)
	{
		var to = this;
		// Event Segment Sorting Logic
		// 1. Sort Event Segments Based on StartDateTime
		// 2. Sort Events Based on Duration

		var iNumOfEventSegs = oArrTempEventSegs.length;
		if(iNumOfEventSegs > 1)
		{
			for(var iEventOut = 0; iEventOut < iNumOfEventSegs; iEventOut++)
			{
				var oEventSeg1 = oArrTempEventSegs[iEventOut],
				sEventSeg1Id = parseInt(oEventSeg1.eventId),
				dEvent1StartDate = to._getStartAndEndDatesOfEventWithId(sEventSeg1Id)[0],
				oTempEventSeg;

				for(var iEventIn = (iEventOut + 1); iEventIn < iNumOfEventSegs; iEventIn++)
				{
					var oEventSeg2 = oArrTempEventSegs[iEventIn],
					sEventSeg2Id = parseInt(oEventSeg2.eventId);
					if(sEventSeg1Id !== sEventSeg2Id)
					{
						var dEvent2StartDate = to._getStartAndEndDatesOfEventWithId(sEventSeg2Id)[0],
						iCompTimes = to.compareDateTimes(dEvent1StartDate, dEvent2StartDate);

						if(iCompTimes > 0)
						{
							oTempEventSeg = oEventSeg1;
							oEventSeg1 = oEventSeg2;
							oEventSeg2 = oTempEventSeg;
							oArrTempEventSegs[iEventOut] = oEventSeg1;
							dEvent1StartDate = dEvent2StartDate;
							oArrTempEventSegs[iEventIn] = oEventSeg2;
						}
						else if(iCompTimes === 0)
						{
							var iEvent1Hours = to._getNumberOfHoursOfEventWithId(sEventSeg1Id),
							iEvent2Hours = to._getNumberOfHoursOfEventWithId(sEventSeg2Id);
							if(iEvent2Hours > iEvent1Hours)
							{
								oTempEventSeg = oEventSeg1;
								oEventSeg1 = oEventSeg2;
								oEventSeg2 = oTempEventSeg;
								oArrTempEventSegs[iEventOut] = oEventSeg1;
								dEvent1StartDate = oEventSeg1.eventSegStart;
								oArrTempEventSegs[iEventIn] = oEventSeg2;
							}
						}
					}
				}
			}
		}
		return oArrTempEventSegs;
	},

	_whetherEventsAreColliding: function(oEventSeg1, oEventSeg2)
	{
		var to = this;
		var dEventSeg1StartDate = oEventSeg1.eventSegStart,
		dEventSeg1EndDate = oEventSeg1.eventSegEnd,
		dEventSeg2StartDate = oEventSeg2.eventSegStart,
		dEventSeg2EndDate = oEventSeg2.eventSegEnd,

		bSegStartDate1 = 0, bSegStartDate2 = 0,
		bSegEndDate1 = 0, bSegEndDate2 = 0,

		iCompStartTime1 = to.compareDateTimes(dEventSeg1StartDate, dEventSeg2StartDate),
		iCompStartTime2 = to.compareDateTimes(dEventSeg1StartDate, dEventSeg2EndDate),
		iCompEndTime1 = to.compareDateTimes(dEventSeg1EndDate, dEventSeg2StartDate),
		iCompEndTime2 = to.compareDateTimes(dEventSeg1EndDate, dEventSeg2EndDate);

		if(iCompStartTime1 > 0 || iCompStartTime1 === 0)
			bSegStartDate1 = 1;
		if(iCompStartTime2 < 0)
			bSegStartDate2 = 1;
		if(iCompEndTime1 > 0)
			bSegEndDate1 = 1;
		if(iCompEndTime2 < 0 || iCompEndTime2 === 0)
			bSegEndDate2 = 1;

		if((bSegStartDate1 === 1 && bSegStartDate2 === 1) || (bSegEndDate1 === 1 && bSegEndDate2 === 1))
			return true;
		else
			return false;
	},

	_removeEventSegWithId: function(sId)
	{
		var to = this;
		var oArrTemp = [];
		sId = parseInt(sId);
		for(var iSegIndex = 0; iSegIndex < to.tv.oASmEvSeg.length; iSegIndex++)
		{
			var oEventSeg = to.tv.oASmEvSeg[iSegIndex];
			if(parseInt(oEventSeg.eventId) !== parseInt(sId))
				oArrTemp.push(oEventSeg);
		}
		to.tv.oASmEvSeg = [];
		to.tv.oASmEvSeg = oArrTemp;
	},

	_createAndAddEventSegForId: function(sId, bIsAllDay, dStartDateTime, dEndDateTime)
	{
		var to = this;
		var dArrTempDates = to.__getStartAndEndDatesOfEventForView(bIsAllDay, dStartDateTime, dEndDateTime),
		dTempStartDate = dArrTempDates[0],
		dTempEndDate = dArrTempDates[1],
		iNumOfHours = to.__getNumberOfHoursOfEvent(bIsAllDay, dStartDateTime, dEndDateTime),
		iNumOfEventElements = to._getNumberOfDaysOfEventForWeek(bIsAllDay, dStartDateTime, dEndDateTime, false, true),
		sEventTimeFormat = to.setting.is24Hour ? "HH:mm" : "h[:m]sm",
		sStartDateTime = to.getDateInFormat({"date": dStartDateTime}, sEventTimeFormat, to.setting.is24Hour, true),
		sEndDateTime = to.getDateInFormat({"date": dEndDateTime}, sEventTimeFormat, to.setting.is24Hour, true);

		var dTempSDT = new Date(dTempStartDate);
		while(!to.__findWhetherDateIsVisibleInCurrentView(dTempSDT, (bIsAllDay || iNumOfHours > 23), dTempStartDate, dTempEndDate))
		{
			dTempSDT.setDate(dTempSDT.getDate() + 1);
			dTempSDT = to.setDateInFormat({"date": dTempSDT}, "START");
		}
		dTempStartDate = new Date(dTempSDT);

		var dThisDate = to.setDateInFormat({"date": dTempStartDate}, "START");

		for(var iSegIndex = 0; iSegIndex < iNumOfEventElements; iSegIndex++)
		{
			var iWkIndex = to.__getDayIndexInView(dThisDate);

			var oSegArgs = {};
			oSegArgs.iNumEvElem = iNumOfEventElements;
			oSegArgs.iId = sId;
			oSegArgs.sId = "Event-"+sId;
			oSegArgs.dStart = dStartDateTime;
			oSegArgs.dEnd = dEndDateTime;
			oSegArgs.dStartView = dTempStartDate;
			oSegArgs.dEndView = dTempEndDate;
			oSegArgs.dThisDate = dThisDate;
			oSegArgs.iEventElem = (iSegIndex + 1);
			oSegArgs.iWkIndex = iWkIndex;

			var oSegProperties = to._createAndAddEventSeg(oSegArgs),
			sSegId = "#" + oSegProperties.sId,
			sSegTitle = oSegProperties.sElemTitle,
			iSegTopPos = oSegProperties.iTopPos,
			iSegHeight = oSegProperties.iEventHeight,
			iSegLeftPos = to.tv.fADVDayLftPos[iWkIndex];

			if(to.tv.oDVEdtgEv !== {} && $.cf.isValid(to.tv.oDVEdtgEv.dEditingDate) && to.compareDates(to.tv.oDVEdtgEv.dEditingDate, dThisDate) === 0)
				to.tv.oDVEdtgEv.iElemLeft = iSegLeftPos;

			var $oThisSeg = $(to.elem).find(sSegId);
			$oThisSeg.css({"top": iSegTopPos, "height": iSegHeight, "left": iSegLeftPos});
			$oThisSeg.attr("data-pos", oSegProperties.sName);
			$oThisSeg.attr("title", sSegTitle);

			var oEventTooltip, sDateTime, sArrDateTime, oThisEvent;
			oEventTooltip = {};
			sDateTime = to.getEventDateTimeString(dStartDateTime, dEndDateTime, bIsAllDay, "&&");
			sArrDateTime = sDateTime.split("&&");

			oThisEvent = to.getEventWithId(sId);

			oEventTooltip.title = oThisEvent.title || "";
			oEventTooltip.startDateTime = sArrDateTime[0];
			oEventTooltip.endDateTime = sArrDateTime[1];
			$oThisSeg.data("tooltipcontent", oEventTooltip);

			if(iSegTopPos < 0)
				 $oThisSeg.find(".cEventLink").css({"margin-top": Math.abs(iSegTopPos)});
			else
				 $oThisSeg.find(".cEventLink").css({"margin-top": 0});

			$oThisSeg.find(".cdvEventTime").html(sStartDateTime + "-" + sEndDateTime);

			dThisDate = new Date(dThisDate.getTime() + $.CalenStyle.extra.iMS.d);
		}
	},

	_createAndAddEventSeg: function(oSegArgs)
	{
		var to = this;
		var iId = oSegArgs.iId,
		sId = oSegArgs.sId,
		dStartDateTime = oSegArgs.dStart,
		dEndDateTime = oSegArgs.dEnd,
		dThisDate = oSegArgs.dThisDate,
		iEventElem = oSegArgs.iEventElem,
		iWkIndex = oSegArgs.iWkIndex,

		iTimeSlotTableRowHeight = (($(to.elem).find(".cdvTimeSlotTableRow" + ":eq(0)").outerHeight() + $(to.elem).find(".cdvTimeSlotTableRow" + ":eq(1)").outerHeight()) / 2),
		iEventUnitHeight = iTimeSlotTableRowHeight / to.setting.unitTimeInterval,

		iStartMinutes = 0, iStartHour = 0, iSlotMinutes = 0,
		sStartTime = "", iTopPos = 0,

		oThisDate = to.getDateInFormat({"date": dThisDate}, "object", false, false),
		dStartDateTimeThis, dEndDateTimeThis;

		if(to.setting.excludeNonBusinessHours)
		{
			dStartDateTimeThis = to.setDateInFormat({"iDate": {d: oThisDate.d, M: oThisDate.M, y: oThisDate.y, H: to.tv.oBsHours.startTime[0], m: to.tv.oBsHours.startTime[1], s: 0, ms: 0}}, "");
			dEndDateTimeThis = to.setDateInFormat({"iDate": {d: oThisDate.d, M: oThisDate.M, y: oThisDate.y, H: to.tv.oBsHours.endTime[0], m: to.tv.oBsHours.endTime[1], s: 0, ms: 0}}, "");
		}
		else
		{
			dStartDateTimeThis = to.setDateInFormat({"iDate": oThisDate}, "START");
			dEndDateTimeThis = to.setDateInFormat({"iDate": oThisDate}, "END");
		}

		var bBeforeDayStart = (to.compareDateTimes(dStartDateTime, dStartDateTimeThis) < 0),
		bAfterDayEnd = (to.compareDateTimes(dEndDateTime, dEndDateTimeThis) > 0),

		dStartDateTimeEv = bBeforeDayStart ? dStartDateTimeThis : dStartDateTime,
		dEndDateTimeEv = bAfterDayEnd ? dEndDateTimeThis : dEndDateTime,

		iActualHeight = (((dEndDateTimeEv.getTime() - dStartDateTime.getTime()) / $.CalenStyle.extra.iMS.m) * iEventUnitHeight),
		iVisibleHeight = (((dEndDateTimeEv.getTime() - dStartDateTimeEv.getTime()) / $.CalenStyle.extra.iMS.m) * iEventUnitHeight),
		iHeight = iVisibleHeight;

		iStartHour = dStartDateTimeEv.getHours();
		iStartMinutes = dStartDateTimeEv.getMinutes();
		iSlotMinutes = Math.floor(iStartMinutes / to.setting.unitTimeInterval) * to.setting.unitTimeInterval;
		sStartTime = to.getNumberStringInFormat(iStartHour, 2, false) + to.getNumberStringInFormat(iSlotMinutes, 2, false);
		iTopPos = $(to.elem).find(".cdvTimeSlotTableRow"+sStartTime).position().top;

		if(bBeforeDayStart)
		{
			iHeight = iActualHeight;
			iTopPos -= (iActualHeight - iVisibleHeight);
		}

		var sName = sStartTime + "|" + iWkIndex + "|" + iTopPos,
		sElemTitle = dStartDateTime + "\n" + dEndDateTime;
		sId += "-" + iEventElem;

		var oEventSeg = new CalEventSeg((iWkIndex + 1), iId, sElemTitle, sId, dStartDateTimeEv, dEndDateTimeEv, 0, 0);
		to.tv.oASmEvSeg.push(oEventSeg);

		var oSegProperties = {};
		oSegProperties.sElemTitle = sElemTitle;
		oSegProperties.sId = sId;
		oSegProperties.sName = sName;
		oSegProperties.iTopPos = iTopPos;
		oSegProperties.iEventHeight = iHeight;

		return oSegProperties;
	},

	_setOpacityOfEventSeg: function(sId, dEndDateTime)
	{
		var to = this;
		var bPassedEvent = (to.compareDates(dEndDateTime, $.CalenStyle.extra.dToday) < 0) ? true : false,
		bHasClass = $(to.elem).find(".Event-"+sId).hasClass("cBlurredEvent");

		if(bPassedEvent && !bHasClass)
			$(to.elem).find(".Event-"+sId).addClass("cBlurredEvent");
		if(!bPassedEvent && bHasClass)
			$(to.elem).find(".Event-"+sId).removeClass("cBlurredEvent");
	},

	_changeViewPropertiesWhileEditing: function(sWhen, sId)
	{
		var to = this;
		var sSelector;
		if($.cf.isValid(to.tv.oDVEdtgEv))
		{
			if($.cf.compareStrings(to.tv.oDVEdtgEv.type, "cdvEvent"))
				sSelector = ".Event-"+sId;
			else if($.cf.compareStrings(to.tv.oDVEdtgEv.type, "cdvEventAllDay"))
				sSelector = "#Event-"+sId;
			if($.cf.compareStrings(sWhen, "BEFORE"))
			{
				if(! $(to.elem).find(sSelector).hasClass("cEditingEvent"))
				{
					if($.cf.compareStrings(to.tv.oDVEdtgEv.type, "cdvEvent"))
						$(to.elem).find(sSelector).addClass("cEditingEvent cEditingEventUI");
					else
						$(to.elem).find(sSelector).addClass("cEditingEvent cEditingEventUI cEditingEventAllDay");

					/*

					$(to.elem).find(".cEventTooltip").tooltip("close");

					The above line gives an error if bootstrap plugin is included in the webpage as it overrides jQuery UI tooltip plugin.
					So if you are including Bootstrap it will be better to use bootstrap Tooltip and Popover.

					*/
					// if bootstrap toolip or popover plugin is applied
					//if($(to.elem).find("[data-original-title]").length === 0 && $(to.elem).find(".cEventTooltip").length > 0)
					//	$(to.elem).find(".cEventTooltip").tooltip("close");
				}
			}
			else if($.cf.compareStrings(sWhen, "AFTER"))
			{
				$(to.elem).find(sSelector).removeClass("cEditingEvent cEditingEventAllDay cEditingEventUI");
				to.tv.iTSEndEditing = $.cf.getTimestamp();
			}
		}
	},

	//------------------------------- Event Segment Manipulation End -------------------------------

	__updateDetailViewTable: function()
	{
		var to = this;
		var iDateIndex, sDVDaysClass,
		sColumnClass = (to.tv.iNoVDayDis === 1) ? "cdvSingleColumn" : "cdvMultiColumn",
		iScrollbarWidth = $.CalenStyle.extra.iScrollbarWidth;
		to._getTimeSlotsArrayForCurrentView();

		if($.cf.compareStrings(to.tv.sLoadType, "Prev"))
			to.tv.dLoadDt = to.tv.dAVDt[0];
		else if($.cf.compareStrings(to.tv.sLoadType, "Next"))
			to.tv.dLoadDt = to.tv.dAVDt[(to.tv.dAVDt.length - 1)];

		var sTemplate = "";
		//---------------------------------------------------------------------------------------------

		sTemplate += "<thead>";
		if(!$.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
			sTemplate += "<tr class='cdvDetailTableRow1 cExceptDayEventDetailView'>";
		else
			sTemplate += "<tr class='cdvDetailTableRow1 cDayEventDetailView'>";

		sTemplate += "<td  class='cdvDetailTableColumnTime'>";
		sTemplate += "<div class='cdvCellWeekNumberLabel'></div>";
		sTemplate += "<div class='cdvCellWeekNumber'></div>";
		sTemplate += "</td>";

		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
		{
			var sTempId = "cdvCellDay"+iDateIndex;
			sDVDaysClass = sColumnClass;
			if(iDateIndex === (to.tv.iNoVDayDis - 1))
				sDVDaysClass += " cdvLastColumn";
			sTemplate += "<td id='" + sTempId + "' class='cdvTableColumns "+sDVDaysClass+"'>";

			if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
				sTemplate += "<table class='cTable cdlvDaysTable cdlvDaysTableMain' cellspacing='0'></table>";
			else
				sTemplate += "&nbsp;";
			sTemplate += "</td>";
		}

		if(iScrollbarWidth > 0)
			sTemplate += "<td class='cdvDetailTableScroll'>&nbsp;</td>";

		sTemplate += "</tr>";
		sTemplate += "</thead>";

		//---------------------------------------------------------------------------------------------

		sTemplate += "<tbody>";

		sTemplate += "<tr class='cdvDetailTableRow2'>";
		sTemplate += "<td class='cdvDetailTableColumnTime'> &nbsp; </td>";
		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
		{
			var sDVDaysId = "cdvAllDayColumn"+iDateIndex;
			sDVDaysClass = "";
			if(iDateIndex === (to.tv.iNoVDayDis - 1))
				sDVDaysClass += " cdvLastColumn";
			sTemplate += "<td id='"+sDVDaysId+"' class='cdvAllDayColumns "+sDVDaysClass+"' title='"+to.tv.dAVDt[iDateIndex]+"'> &nbsp; </td>";
		}
		if(iScrollbarWidth > 0)
			sTemplate += "<td class='cdvDetailTableScroll'>&nbsp;</td>";
		sTemplate += "</tr>";

		//---------------------------------------------------------------------------------------------

		sTemplate += "<tr class='cdvDetailTableRow3'>";
		sTemplate += "<td class='cdvDetailTableColumnTime'> &nbsp; </td>";
		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
		{
			sDVDaysClass = "cdvDetailTableColumn"+iDateIndex;
			if(iDateIndex === (to.tv.iNoVDayDis - 1))
				sDVDaysClass += " cdvLastColumn";
			sTemplate += "<td class='cdvTableColumns "+sDVDaysClass+"'> &nbsp; </td>";
		}
		if(iScrollbarWidth > 0)
			sTemplate += "<td class='cdvDetailTableScroll'>&nbsp;</td>";
		sTemplate += "</tr>";

		sTemplate += "</tbody>";

		//---------------------------------------------------------------------------------------------
		$(to.elem).find(".cdvDetailTableMain").html(sTemplate);
		//----------------------------------------------------------------------------------------------

		sTemplate = "";
		sTemplate += "<span class='cdvCellHeaderAllDay'><span>"+to.setting.miscStrings.allDay+"</span></span>";
		$(to.elem).find(".cdvContRow2Main").html(sTemplate);

		//------------------------------------------------------------------------------

		if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
			to.__updateDayListViewTable(false, true);
		else
			to._setDateStringsInDetailView();

		//------------------------------------------------------------------------------

		to._addTimeSlotTable();

		//------------------------------------------------------------------------------

		sTemplate = "";
		sTemplate += "<div class='cdvContRow3Events'></div>";
		$(to.elem).find(".cdvContRow3Main").append(sTemplate);

		//------------------------------------------------------------------------------

		to._takeActionOnTimeSlotTableClick();
	},

	__addEventsInDetailView: function(sEventTypeToAdd)
	{
		var to = this;
		if(($.cf.compareStrings(sEventTypeToAdd, "AllDay") || $.cf.compareStrings(sEventTypeToAdd, "Both")) && $(to.elem).find(".cdvContRow2Main").length > 0)
			$(to.elem).find(".cdvContRow2Main .cdvEventAllDay").remove();
		if(($.cf.compareStrings(sEventTypeToAdd, "Small") || $.cf.compareStrings(sEventTypeToAdd, "Both")) && $(to.elem).find(".cdvContRow3Events").length > 0)
			$(to.elem).find(".cdvContRow3Events").html("");

		var oArrTempEvents = to.getArrayOfEventsForView(to.tv.dVDSDt, to.tv.dVDEDt),
		bHideEventIcon = $.cf.isValid(to.setting.hideEventIcon[to.setting.visibleView]) ? to.setting.hideEventIcon[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventIcon.Default) ? to.setting.hideEventIcon.Default : false,
		bHideEventTime = $.cf.isValid(to.setting.hideEventTime[to.setting.visibleView]) ? to.setting.hideEventTime[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventTime.Default) ? to.setting.hideEventTime.Default : false,
		sEventTimeFormat = to.setting.is24Hour ? "HH:mm" : "h[:m]sm";

		if($.cf.compareStrings(sEventTypeToAdd, "Small") || $.cf.compareStrings(sEventTypeToAdd, "Both"))
			to.tv.oASmEvSeg = [];
		if($.cf.compareStrings(sEventTypeToAdd, "AllDay") || $.cf.compareStrings(sEventTypeToAdd, "Both"))
			to.tv.oAADEvSeg = [];

		if(oArrTempEvents.length > 0)
		{
			var oArrTempTopPos = [];

			for(var iEventIndex = 0; iEventIndex < oArrTempEvents.length; iEventIndex++)
			{
				var oEvent = oArrTempEvents[iEventIndex],

				dStartDateTime = null, dEndDateTime = null,
				bIsAllDay = 0,
				sTitle = "", sDesc = "", sType = "", sURL = "",
				sDroppableId = "", bIsMarked = false;

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

				if(oEvent.isMarked !== null)
					bIsMarked = oEvent.isMarked;

				if(bIsMarked)
					bIsAllDay = true;

				var dArrTempDates = to.__getStartAndEndDatesOfEventForView(bIsAllDay, dStartDateTime, dEndDateTime),
				dTempStartDate = dArrTempDates[0],
				dTempEndDate = dArrTempDates[1],

				iNumOfDaysOfEvent = to.getNumberOfDaysOfEvent(bIsAllDay, dStartDateTime, dEndDateTime, false, false, true),
				iNumOfEventElements = to._getNumberOfDaysOfEventForWeek(bIsAllDay, dStartDateTime, dEndDateTime, false, true),
				iTotalNumberOfHours = to.__getNumberOfHoursOfEvent(bIsAllDay, dStartDateTime, dEndDateTime);

				var sId;
				if(iNumOfEventElements > 0)
				{
					var dTempSDT = new Date(dTempStartDate);
					while(!to.__findWhetherDateIsVisibleInCurrentView(dTempSDT, (bIsAllDay || iTotalNumberOfHours > 23), dTempStartDate, dTempEndDate))
					{
						dTempSDT.setDate(dTempSDT.getDate() + 1);
						dTempSDT = to.setDateInFormat({"date": dTempSDT}, "START");
					}
					dTempStartDate = new Date(dTempSDT);
					var dThisDate = to.setDateInFormat({"date": dTempStartDate}, "START"),
					iThisDate = dThisDate.getTime();

					//-------------------------------------------------------------------------------------------

					var sEventColor = oEvent.backgroundColor;
					sEventColor = ($.cf.compareStrings(sEventColor, "") || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;
					var sEventBorderColor = oEvent.borderColor || $.cf.addHashToHexcode(to.setting.borderColor);
					sEventBorderColor = ($.cf.compareStrings(sEventBorderColor, "") || $.cf.compareStrings(sEventBorderColor, "transparent")) ? "transparent" : sEventBorderColor;
					var sEventTextColor = oEvent.textColor || $.cf.addHashToHexcode(to.setting.textColor);
					sEventTextColor = ($.cf.compareStrings(sEventTextColor, "") || $.cf.compareStrings(sEventTextColor, "transparent")) ? $.cf.addHashToHexcode(to.setting.textColor) : sEventTextColor;

					var sStyle = "", sIcon = "", sEventIconStyle  = "", sEventIconDotStyle = "", sPartialEventStyle = "", sLinkStyle ="";

					if(bIsMarked)
					{
						if(oEvent.fromSingleColor)
						{
							sStyle += "background: " + sEventColor + "; ";
							sStyle += "border-color: " + sEventBorderColor + "; ";
							sStyle += "color: " + sEventTextColor + "; ";
							sLinkStyle = "color: " + sEventTextColor + "; ";
							sEventIconStyle = "background: " + sEventTextColor + "; color: #FFFFFF";
							sEventIconDotStyle = "background: " + sEventTextColor + "; ";
						}
						else
						{
							sEventBorderColor = sEventColor;

							sStyle += "background: " + $.cf.getRGBAString(sEventColor, 0.1) + "; ";
							sStyle += "border-color: " + sEventBorderColor + "; ";
							sStyle += "color: " + sEventColor + "; ";
							sLinkStyle = "color: " + sEventColor + "; ";
							sEventIconStyle = "background: " + sEventColor + "; color: " + sEventTextColor;
							sEventIconDotStyle = "background: " + sEventColor + "; ";
						}
					}
					else
					{
						sStyle += "background: " + sEventColor + "; ";
						sStyle += "border-color: " + sEventBorderColor + "; ";
						sStyle += "color: " + sEventTextColor + "; ";
						sLinkStyle = "color: " + sEventTextColor + "; ";
						sEventIconStyle = "color: " + sEventTextColor + "; ";
						sEventIconDotStyle = "background: " + sEventTextColor + "; ";
						sPartialEventStyle = "border-color: " + (oEvent.fromSingleColor ? sEventTextColor : "#000000");
					}

					if(sEventBorderColor === "transparent")
						sStyle += "border-width: 0px; ";

					if(bIsMarked)
						sIcon = ($.cf.isValid(oEvent.icon) && oEvent.icon !== "Dot") ? oEvent.icon : "cs-icon-Mark";
					else
						sIcon = $.cf.isValid(oEvent.icon) ? oEvent.icon : to.setting.eventIcon;

					var iWkIndex = to.__getDayIndexInView(dThisDate),
					iLeftPos = to.tv.fADVDayLftPos[iWkIndex],
					iTopPos = 0,
					iEventHeight = 0,
					sEventClass, sDateTime, oEventTooltip, sTemplate, sIdElem, $oSeg, $oSegContent,
					sDataDroppableId,
					sArrDateTime;

					//-------------------------------------------------------------------------------------------

					if(bIsAllDay === 1 || bIsAllDay === true || (iTotalNumberOfHours > 23))
					{
						if($.cf.compareStrings(sEventTypeToAdd, "AllDay") || $.cf.compareStrings(sEventTypeToAdd, "Both"))
						{
							sId = "Event-"+oEvent.calEventId;

							var bElementExists = $(to.elem).find("#"+sId).length > 0,
							bElementHasStartDate = false;
							if(bElementExists)
							{
								var dElemStartDate = new Date($(to.elem).find("#"+sId).data("startdate"));
								bElementHasStartDate = to.compareDates(dElemStartDate, dTempStartDate) !== 0;
							}
							if((bElementExists && bElementHasStartDate) || !bElementExists)
							{
								var iWidthUnits = iNumOfEventElements,

								bCompStartDates = to.compareDates(dStartDateTime, dTempStartDate),
								bVSDCompESD = to.compareDates(to.tv.dVDSDt, dStartDateTime),
								bVEDCompESD = to.compareDates(to.tv.dVDEDt, dStartDateTime),
								isFirstSegment = (bVSDCompESD <= 0) && (bVEDCompESD >= 0),
								bVSDCompEED = to.compareDates(to.tv.dVDSDt, dEndDateTime),
								bVEDCompEED = to.compareDates(to.tv.dVDEDt, dEndDateTime),
								isLastSegment = (bVSDCompEED <= 0) && (bVEDCompEED >= 0),
								bCompEndDates = to.compareDates(dEndDateTime, dTempEndDate),

								iNewTopIndex = 0,
								oArrTemp;

								if(oArrTempTopPos.length === 0)
								{
									iNewTopIndex = 1;
									oArrTemp = [];
									oArrTemp.push([dTempStartDate, dTempEndDate]);
									oArrTempTopPos.push([iNewTopIndex, oArrTemp]);
								}
								else
								{
									var iMaxTopIndex = 0;
									for(var iTempIndex = 0; iTempIndex < oArrTempTopPos.length; iTempIndex++)
									{
										oArrTemp = oArrTempTopPos[iTempIndex];
										var iArrTempTopIndex = oArrTemp[0];

										if(iArrTempTopIndex > iMaxTopIndex)
											iMaxTopIndex = iArrTempTopIndex;

										var oArrTempDates = oArrTemp[1];

										var bSpaceAvailableForSegment = false;
										for(var iInnerIndex = 0; iInnerIndex < oArrTempDates.length; iInnerIndex++)
										{
											var oArrTempSEDates = oArrTempDates[iInnerIndex];
										 	if(to.compareDates(dTempStartDate, oArrTempSEDates[1]) <= 0)
											{
												bSpaceAvailableForSegment = false;
												break;
											}
											else
												bSpaceAvailableForSegment = true;
										}

										if(bSpaceAvailableForSegment)
										{
											iNewTopIndex = iArrTempTopIndex;
											oArrTempDates.push([dTempStartDate, dTempEndDate]);
											break;
										}
									}

									if(iNewTopIndex === 0)
									{
										iNewTopIndex = iMaxTopIndex + 1;
										oArrTemp = [];
										oArrTemp.push([dTempStartDate, dTempEndDate]);
										oArrTempTopPos.push([iNewTopIndex, oArrTemp]);
									}
								}
								to.tv.oAADEvSeg.push([sId, iWidthUnits, iWkIndex, iNewTopIndex]);

								sEventClass = "cdvEventAllDay ";
								if(to.compareDates(dEndDateTime, $.CalenStyle.extra.dToday) < 0)
									sEventClass += "cBlurredEvent" +" ";
								if(to.setting.isTooltipInDetailView)
									sEventClass += " cEventTooltip";
								if(bIsMarked)
									sEventClass += " cMarkedDayEvent";

								sDataDroppableId = $.cf.isValid(sDroppableId) ? "data-droppableid='" + sDroppableId + "'" : "";

								sTemplate = "<span id='" + sId + "' class='" + sEventClass + "' style='" + sStyle + "' data-startdate='" + dTempStartDate + "' " + sDataDroppableId + " title='' data-id='" + oEvent.calEventId + "'>";

								sTemplate += "<a class='cEventLink' style='" + sLinkStyle + "'>";

								if(bIsMarked)
								{
									sTemplate += "<span class='cdvEventTitle'>" + sTitle + "</span>";

									//if(!bHideEventIcon && !$.cf.compareStrings(sIcon, "Dot"))
										sTemplate += "<span class='cdvEventIcon "+sIcon+"' style='" + sEventIconStyle + "'></span>";

									if($.cf.compareStrings(to.setting.visibleView, "DayEventListView") && $.cf.isValid(oEvent.status))
										sTemplate += "<span class='cdvEventStatus' style='border-color: " + oEvent.statusColor + ";'></span>";
								}
								else
								{
									if(bCompStartDates !== 0)
										sTemplate += "<span class='cPartialEvent cPartialEventLeft' style='" + sPartialEventStyle + "'></span>";

									if(!bHideEventTime && !bIsAllDay && (iNumOfDaysOfEvent > 1 && isFirstSegment))
										sTemplate += "<span class='cdvEventTimeLeft'>" + to.getDateInFormat({"date": dStartDateTime}, sEventTimeFormat, to.setting.is24Hour, true) + "</span>";

									if(!bHideEventIcon && !$.cf.compareStrings(sIcon, "Dot"))
										sTemplate += "<span class='cdvEventIcon " +sIcon+"' style='"+sEventIconStyle+"'></span>";

									if($.cf.compareStrings(to.setting.visibleView, "DayEventListView") && $.cf.isValid(oEvent.status))
										sTemplate += "<span class='cdvEventStatus' style='border-color: " + oEvent.statusColor + ";'></span>";

									sTemplate += "<span class='" + "cdvEventTitle" + "'>" + sTitle + "</span>";

									if(!bHideEventTime && !bIsAllDay && (iNumOfDaysOfEvent > 1 && isLastSegment))
										sTemplate += "<span class='cdvEventTimeRight'>" + to.getDateInFormat({"date": dEndDateTime}, sEventTimeFormat, to.setting.is24Hour, true) + "</span>";

									if(bCompEndDates !== 0)
										sTemplate += "<span class='cPartialEvent cPartialEventRight' style='" + sPartialEventStyle + "'></span>";
								}

								sTemplate += "</a>";

								sTemplate += "</span>";

								$(to.elem).find(".cdvContRow2Main").append(sTemplate);

								sIdElem = "#"+sId;
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
								{
									$oSegContent.on($.CalenStyle.extra.sClickHandler, {"url": sURL, "eventId": oEvent.calEventId, "eventElemSelector": sIdElem, "eventType": "AllDay", "view": "DetailView", "pluginId": to.tv.pluginId}, to.__bindClick);
								}
							}
						}
					}
					else
					{
						if($.cf.compareStrings(sEventTypeToAdd, "Small") || $.cf.compareStrings(sEventTypeToAdd, "Both"))
						{
							var sClass = "Event-"+oEvent.calEventId;
							if($(to.elem).find("."+sClass).length === 0)
							{
								for(var iEventElem = 1; iEventElem <= iNumOfEventElements; iEventElem++)
								{
									sId = sClass;

									iWkIndex = to.__getDayIndexInView(dThisDate);
									iLeftPos = to.tv.fADVDayLftPos[iWkIndex];

									sEventClass = "cdvEvent ";
									if(to.compareDates(dEndDateTime, $.CalenStyle.extra.dToday) < 0)
										sEventClass += "cBlurredEvent ";
									sEventClass += sId;
									if(to.setting.isTooltipInDetailView)
										sEventClass += " cEventTooltip";

									var oSegArgs = {};
									oSegArgs.iNumEvElem = iNumOfEventElements;
									oSegArgs.iId = oEvent.calEventId;
									oSegArgs.sId = sId;
									oSegArgs.dStart = dStartDateTime;
									oSegArgs.dEnd = dEndDateTime;
									oSegArgs.dStartView = dTempStartDate;
									oSegArgs.dEndView = dTempEndDate;
									oSegArgs.dThisDate = dThisDate;
									oSegArgs.iEventElem = iEventElem;
									oSegArgs.iWkIndex = iWkIndex;

									var oSegProperties = to._createAndAddEventSeg(oSegArgs);

									var sName = oSegProperties.sName;
									sId = oSegProperties.sId;
									iTopPos = oSegProperties.iTopPos;
									iEventHeight = oSegProperties.iEventHeight;

									var sEventTime = to.getDateInFormat({"date": dStartDateTime}, sEventTimeFormat, to.setting.is24Hour, true) + " - " + to.getDateInFormat({"date": dEndDateTime}, sEventTimeFormat, to.setting.is24Hour, true);

									sStyle += "left: " + 0 + "px; top: " + 0 + "px; height: " + parseInt(iEventHeight) + "px; width: " + 10 + "px;";

									sTemplate = "";

									sDataDroppableId = $.cf.isValid(sDroppableId) ? "data-droppableid='" + sDroppableId + "'" : "";

									sTemplate += "<span id='" + sId + "' class='" + sEventClass + "' style='" + sStyle + "' data-pos='" + sName + "' " + sDataDroppableId + " title='' data-id='" + oEvent.calEventId + "'>";

									sTemplate += "<a class='cEventLink' style='color: " + sEventTextColor+ ";'>";

									if(!bHideEventIcon && !$.cf.compareStrings(sIcon, "Dot"))
										sTemplate += "<span class='cdvEventIcon "+sIcon+"' style='"+sEventIconStyle +"' align='left'></span>";

									sTemplate += "<div class='cdvEventDetails'>";

									if($.cf.compareStrings(to.setting.visibleView, "DayEventListView") && $.cf.isValid(oEvent.status))
										sTemplate += "<span class='cdvEventStatus' style='border-color: " + oEvent.statusColor + ";'></span>";

									sTemplate += "<div class='cdvEventTitle'>" + sTitle + "</div>";

									if(!bHideEventTime)
										sTemplate += "<div class='cdvEventTime'>" + sEventTime + "</div>";

									sTemplate += "</div>";

									sTemplate += "</a>";

									sTemplate += "</span>";

									$(to.elem).find(".cdvContRow3Main .cdvContRow3Events").append(sTemplate);

									sIdElem = "#"+sId;
									$oSeg = $(to.elem).find(sIdElem);
									$oSegContent = $oSeg.find(".cEventLink");
									oEventTooltip = {};
									sDateTime = to.getEventDateTimeString(dStartDateTime, dEndDateTime, bIsAllDay, "&&");
									sArrDateTime = sDateTime.split("&&");
									oEventTooltip.title = sTitle;
									oEventTooltip.startDateTime = sArrDateTime[0];
									oEventTooltip.endDateTime = sArrDateTime[1];
									$oSeg.data("tooltipcontent", oEventTooltip);

									iThisDate = iThisDate + $.CalenStyle.extra.iMS.d;
									dThisDate.setTime(iThisDate);

									if(to.setting.eventRendered)
										to.setting.eventRendered.call(to, oEvent, $oSeg, $oSegContent, to.setting.visibleView, false);

									if($.cf.isValid(sURL) || to.setting.eventClicked)
									{
										$oSegContent.on($.CalenStyle.extra.sClickHandler, {"url": sURL, "eventId": oEvent.calEventId, "eventElemSelector": sIdElem, "eventType": "Small", "view": "DetailView", "pluginId": to.tv.pluginId}, to.__bindClick);
									}
								}
							}
						}
					}
				}
			}

			to.tv.dDrgSDt = null;
			to.tv.dDrgEDt = null;

			if($.cf.compareStrings(sEventTypeToAdd, "AllDay") || $.cf.compareStrings(sEventTypeToAdd, "Both"))
				to._makeEventEditableInDetailView(".cdvEventAllDay");
			if($.cf.compareStrings(sEventTypeToAdd, "Small") || $.cf.compareStrings(sEventTypeToAdd, "Both"))
			{
				to._setPropertiesOfEventSeg();
				to._makeEventEditableInDetailView(".cdvEvent");
			}

			if(to.setting.isTooltipInDetailView)
				to._addTooltipInDetailView();

			if(to.setting.eventsAddedInView)
				to.setting.eventsAddedInView.call(to, to.setting.visibleView, ".cdvEvent, .cdvEventAllDay");
		}
		else
			console.log("to.__addEventsInDetailView - No Events");

		to.addRemoveViewLoader(false, "cEventLoaderBg");
		to.addRemoveLoaderIndicators(false, "cEventLoaderIndicator");
	},

	_takeActionOnTimeSlotTableClick: function()
	{
		var to = this;

		$(to.elem).find(".calendarCont").on($.CalenStyle.extra.sClickHandler, function(e)
		{
			if(!$(to.elem).find(".cdvEvent").hasClass("cEditingEvent") && to.setting.cellClicked)
			{
				var pClickedAt = {};
				pClickedAt.x = e.pageX || e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
				pClickedAt.y = e.pageY || e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;
				var oArrElemsAtPt = to.__getElementsAtPoint(pClickedAt.x, pClickedAt.y);
				var dSelectedDateTime, iHours = 0, iMinutes = 0;
				var bElemAllDay, bElemSlot, bElemColumn;
				for(var iTempIndex = 0; iTempIndex < oArrElemsAtPt.length; iTempIndex++)
				{
					var $oTempElem = $(oArrElemsAtPt[iTempIndex]),
					bCDVAllDayColumns = $oTempElem.hasClass("cdvAllDayColumns"),
					bCDVTableColumns = $oTempElem.hasClass("cdvTableColumns"),
					bCDVSlotTableRow = $oTempElem.hasClass("cdvTimeSlotTableRow"),
					sDate;

					if(bCDVAllDayColumns)
					{
						sDate = $oTempElem.attr("title");
						dSelectedDateTime = new Date(sDate);
						bElemAllDay = true;
					}
					if(bCDVTableColumns)
					{
						sDate = $oTempElem.attr("title");
						dSelectedDateTime = new Date(sDate);
						bElemColumn = true;
					}
					if(bCDVSlotTableRow)
					{
						var sTime = $oTempElem.attr("class");
						sTime = sTime.replace(/cdvTimeSlotTableRow/g, "");
						sTime = sTime.replace(/ /g, "");
						iHours = parseInt(sTime.substr(0, 2));
						iMinutes = parseInt(sTime.substr(2, 2));
						bElemSlot = true;
					}
				}

				if(to.setting.cellClicked)
				{
					if(bElemAllDay)
						to.setting.cellClicked.call(to, to.setting.visibleView, dSelectedDateTime, true, pClickedAt);
					else if(bElemColumn && bElemSlot)
					{
						dSelectedDateTime.setHours(iHours);
						dSelectedDateTime.setMinutes(iMinutes);
						to.setting.cellClicked.call(to, to.setting.visibleView, dSelectedDateTime, false, pClickedAt);
					}
				}
			}

			e.stopPropagation();
			to._makeEventNonEditableInDetailView();
			to._callCommonEvents();
		});
	},

	_makeEventNonEditableInDetailView: function()
	{
		var to = this;
		if(to.tv.oEvEdt !== null)
		{
			$("body").css("cursor", "default");

			var sId = to.tv.oEvEdt.calEventId,
			dEndDateTime = to.tv.oEvEdt.end;

			to._changeViewPropertiesWhileEditing("AFTER", sId);
			to._setOpacityOfEventSeg(sId, dEndDateTime);

			if($.cf.compareStrings(to.tv.oDVEdtgEv.type, "cdvEvent"))
			{
				to._adjustEventsInDetailView();
				if($.CalenStyle.extra.bTouchDevice)
				{
					if($(to.elem).find(".Event-"+sId).hasClass("ui-resizable"))
						$(to.elem).find(".Event-"+sId).resizable("destroy");
				}
			}
			else
				to._adjustAllDayEventsInDetailView();

			to.tv.oEvEdt = null;
			to.tv.oDVEdtgEv = {};
		}
	},

	_makeEventEditableInDetailView: function(sClass)
	{
		var to = this;

		$(to.elem).find(sClass).on($.CalenStyle.extra.sClickHandler, function(e)
		{
			e.stopPropagation();
		});

		var sEditableClass, sDraggableClass, sResizableClass;
		if($.cf.compareStrings(sClass, ".cdvEvent"))
		{
			sEditableClass = "EventEditable";
			sDraggableClass = "EventDraggable";
			sResizableClass = "EventResizable";
		}
		else if($.cf.compareStrings(sClass, ".cdvEventAllDay"))
		{
			sEditableClass = "EventAllDayEditable";
			sDraggableClass = "EventAllDayDraggable";
			sResizableClass = "EventAllDayResizable";
		}

		var oArrElements = $(to.elem).find(sClass);
		for(var iElemIndex = 0; iElemIndex < oArrElements.length; iElemIndex++)
		{
			var oElem = oArrElements[iElemIndex],
			sEventId = $(oElem).attr("data-id"),
			oEvent = to.getEventWithId(sEventId);

			var sEventClass = "";
			if(oEvent.isDragNDropInDetailView || oEvent.isResizeInDetailView)
			{
				sEventClass += sEditableClass;
				if(oEvent.isDragNDropInDetailView)
					sEventClass += (" "+sDraggableClass+" cDragNDrop");
				if(oEvent.isResizeInDetailView)
				{
					sEventClass += (" "+sResizableClass);
					if(!$.CalenStyle.extra.bTouchDevice)
					{
						if(to.setting.isResizeInDetailView)
							to._makeEventResizableInDetailView(".Event-"+sEventId);
						else
							$(".cdvEvent").removeClass("EventResizable");
					}
				}
			}

			$(oElem).addClass(sEventClass);
		}

		if(to.setting.isDragNDropInDetailView)
			to._makeEventDraggableInDetailView(sClass, sDraggableClass);
		else
		{
			$(".cdvEvent").removeClass("EventDraggable cDragNDrop");
			$(".cdvEventAllDay").removeClass("EventAllDayDraggable cDragNDrop");
		}

		$(to.elem).find("." + sEditableClass).each(function()
		{
			var bMouseDown = false;

			var iMouseStartX, iMouseStartY;
			var iMouseEndX, iMouseEndY;

			var iRadius = 8;
			var iMinX, iMinY, iMaxX, iMaxY;
			var iTouchStartTime,
			iLongPressTimeout = $.CalenStyle.extra.bTouchDevice ? 300 : 0;

			var sElemId, bChangedWidth = false;

			$(this).on(
			{
				mousedown: function(ev)
				{
					if($.cf.compareStrings(sClass, ".cdvEvent"))
					{
						if(to.tv.bDVScrlg)
							return false;
					}

					iTouchStartTime = ev.timeStamp;
					bMouseDown = true;

					iMouseStartX = ev.pageX;
					iMouseStartY = ev.pageY;

					iMinX = iMouseStartX - iRadius;
					iMinY = iMouseStartY - iRadius;
					iMaxX = iMouseStartX + iRadius;
					iMaxY = iMouseStartY + iRadius;

					bChangedWidth= false;
					setTimeout(function()
					{
						if(bMouseDown)
						{
							var iMouseHoldX = ev.pageX;
							var iMouseHoldY = ev.pageY;

							if(to.tv.oEvEdt === null)
							{
								var bSingleTouchX1 = (iMinX <= iMouseHoldX && iMouseHoldX <= iMaxX) ? true : false;
								var bSingleTouchY1 = (iMinY <= iMouseHoldY && iMouseHoldY <= iMaxY) ? true : false;

								if(bSingleTouchX1 && bSingleTouchY1)
									to.tv.bEvLgPresd = true;
							}

							if(to.tv.bEvLgPresd)
							{
								bMouseDown = false;
								if(to.tv.oEvEdt === null)
								{
									var oThisElem = ev.target;
									var bHasClass = $(to.elem).find(oThisElem).hasClass(sEditableClass);
									while(! bHasClass)
									{
										oThisElem = $(to.elem).find(oThisElem).parent();
										bHasClass = $(to.elem).find(oThisElem).hasClass(sEditableClass);
										if($(to.elem).find(oThisElem).attr("class") === undefined)
											break;
									}

									sElemId = $(to.elem).find(oThisElem).attr("id");
									if($.cf.compareStrings(sClass, ".cdvEvent"))
										bChangedWidth = to._setSmallEventBeingEditedInDetailView(bChangedWidth, sElemId);
									else if($.cf.compareStrings(sClass, ".cdvEventAllDay"))
										to._setAllDayEventBeingEditedInDetailView(sElemId);
								}
							}
						}
					}, iLongPressTimeout);
				},

				mousemove: function(ev)
				{
					if($.cf.compareStrings(sClass, ".cdvEvent"))
					{
						if(to.tv.bDVScrlg)
							return false;
					}

					if(bMouseDown)
					{
						iMouseEndX = ev.pageX;
						iMouseEndY = ev.pageY;

						if(to.tv.oEvEdt === null)
						{
							var bSingleTouchX1 = (iMinX <= iMouseEndX && iMouseEndX <= iMaxX) ? true : false;
							var bSingleTouchY1 = (iMinY <= iMouseEndY && iMouseEndY <= iMaxY) ? true : false;

							if(bSingleTouchX1 && bSingleTouchY1)
							{
								var iTouchEndTime = ev.timeStamp;
								if((iTouchEndTime - iTouchStartTime) > iLongPressTimeout)
									to.tv.bEvLgPresd = true;
							}
						}

						if(to.tv.bEvLgPresd)
						{
							var bMouseMovementX = (Math.abs(iMouseEndX - iMouseStartX) > 5) ? true : false;
							var bMouseMovementY = (Math.abs(iMouseEndY - iMouseStartY) > 1) ? true : false;

							if(bMouseDown && (bMouseMovementX || bMouseMovementY))
							{
								bMouseDown = false;
								if(to.tv.oEvEdt === null)
								{
									var oThisElem = ev.target;
									var bHasClass = $(to.elem).find(oThisElem).hasClass(sEditableClass);
									while(! bHasClass)
									{
										oThisElem = $(to.elem).find(oThisElem).parent();
										bHasClass = $(to.elem).find(oThisElem).hasClass(sEditableClass);
										if($(to.elem).find(oThisElem).attr("class") === undefined)
											break;
									}

									sElemId = $(to.elem).find(oThisElem).attr("id");
									if($.cf.compareStrings(sClass, ".cdvEvent"))
										bChangedWidth = to._setSmallEventBeingEditedInDetailView(bChangedWidth, sElemId);
									else if($.cf.compareStrings(sClass, ".cdvEventAllDay"))
										to._setAllDayEventBeingEditedInDetailView(sElemId);
								}
							}
						}
					}
				},

				mouseup: function()
				{
					bMouseDown = false;
				}

			});
		});
	},

	_setSmallEventBeingEditedInDetailView: function(bChangedWidth, sElemId)
	{
		var to = this;
		var sElemDOMId = "#"+sElemId,

		iEventWidth = $(to.elem).find(".cdvTableColumns").width() - 5,
		iElemPosLeft = $(to.elem).find(sElemDOMId).position().left,
		iElemPosLeftNew = iElemPosLeft,

		dEditingDate = to._getDateBasedOnLeftPosition(iElemPosLeft),

		sArrElemId = sElemId.split("-"),
		sEventId = sArrElemId[1],
		iSegIndex = sArrElemId[2],
		sEventClass = ".Event-"+sEventId;

		if(!bChangedWidth)
		{
			iElemPosLeftNew = to._getLeftPositionOfEventSeg(iElemPosLeft);
			$(to.elem).find(".Event-"+sEventId).css({"width": iEventWidth});

			var oThisEvent = to.getEventWithId(sEventId),
			dDragStartDate = oThisEvent.start,
			dDragEndDate = oThisEvent.end,
			bIsAllDay = oThisEvent.isAllDay,

			dArrTempDates = to.__getStartAndEndDatesOfEventForView(bIsAllDay, dDragStartDate, dDragEndDate),
			dTempStartDate = dArrTempDates[0],
			dTempEndDate = dArrTempDates[1];

			$(to.elem).find(sElemDOMId).css({"left": iElemPosLeftNew});

			var bCompStartDate = to.compareDates(dEditingDate, dTempStartDate),
			bCompEndDate = to.compareDates(dEditingDate, dTempEndDate),
			bCompStartOrEndDate = ((bCompStartDate === 0) || (bCompEndDate === 0));

			if($(to.elem).find(".Event-"+sEventId).length > 1 && bCompStartOrEndDate)
			{
				var dThisDate, sOtherEventId;
				if(bCompStartDate === 0)
				{
					dThisDate = dTempEndDate;
					sOtherEventId = "#Event-"+sEventId+"-2";
				}
				else if(bCompEndDate === 0)
				{
					dThisDate = dTempStartDate;
					sOtherEventId = "#Event-"+sEventId+"-1";
				}

				var iWkIndex = to.__getDayIndexInView(dThisDate),
				iThisLeftPos = to.tv.fADVDayLftPos[iWkIndex];
				$(to.elem).find(sOtherEventId).css({"left": iThisLeftPos});
			}

			bChangedWidth = true;
			to.tv.oEvEdt = to.getEventWithId(sEventId);

			to.tv.oDVEdtgEv = {};
			to.tv.oDVEdtgEv.type = "cdvEvent";
			to.tv.oDVEdtgEv.sEventId = sEventId;
		}

		to.tv.oDVEdtgEv.iSegIndex = iSegIndex;
		to.tv.oDVEdtgEv.dEditingDate = dEditingDate;
		to.tv.oDVEdtgEv.iElemLeft = iElemPosLeftNew;

		if($.CalenStyle.extra.bTouchDevice)
		{
			to._changeViewPropertiesWhileEditing("BEFORE", sEventId);
			if(to.setting.isResizeInDetailView && to.tv.oEvEdt !== null)
			{
				if(to.tv.oEvEdt.isResizeInDetailView)
					to._makeEventResizableInDetailView(sEventClass);
			}
		}

		return bChangedWidth;
	},

	_setAllDayEventBeingEditedInDetailView: function(sElemId)
	{
		var to = this;
		var sEventId = sElemId.split("-")[1];
		to.tv.oEvEdt = to.getEventWithId(sEventId);

		to.tv.oDVEdtgEv = {};
		to.tv.oDVEdtgEv.type = "cdvEventAllDay";
		to.tv.oDVEdtgEv.sEventId = sEventId;

		to._changeViewPropertiesWhileEditing("BEFORE", sEventId);
	},

	_getWhetherEventIsAllDay: function(sId)
	{
		var to = this;
		var oThisEvent = to.getEventWithId(sId);
		if(oThisEvent.isAllDay !== null)
			return oThisEvent.isAllDay;
		else
			return false;
	},

	_makeEventDraggableInDetailView: function(sClass, sDraggableClass)
	{
		var to = this;
		var sScope;
		if($.cf.compareStrings(sClass, ".cdvEvent"))
			sScope = "Events";
		else if($.cf.compareStrings(sClass, ".cdvEventAllDay"))
			sScope = "AllDayEvents";

		var iEventHeight, iEventWidth, iColumn1Width, bCanDrag,
		iCalendarLeft, iCalendarMarginLeft, iLeft, iX1, iX2,
		iCalendarTop, iCalendarMarginTop, iY1, iY2,
		oElemDragged, $oElemDragged, sElemId, sArrElemId, sEventId, iSegIndex,
		sEventTimeFormat = to.setting.is24Hour ? "HH:mm" : "h[:m]sm",
		iScrollbarWidth = $.CalenStyle.extra.iScrollbarWidth;

		if($.cf.compareStrings(sClass, ".cdvEvent"))
		{
			var iDVTableColumnWidth = $(to.elem).find(".cdvTableColumns").width() - 5;
			iEventWidth = iDVTableColumnWidth;
			var iTimeSlotWidth = iDVTableColumnWidth + 6,
			iTimeSlotHeight = (($(to.elem).find(".cdvTimeSlotTableRow" + ":eq(0)").outerHeight() + $(to.elem).find(".cdvTimeSlotTableRow" + ":eq(1)").outerHeight()) / 2),

			iStartPosX, iStartPosY, iPrevPosX, iPrevPosY,
			iPrevSnapPosX, iPrevSnapPosY,
			$oOtherSeg, sOtherSegId, sThisSegId,
			iEventMidPoint, iDragStartDateMS, iDragEndDateMS, dArrTempDates,
			dDragStartDate = to.tv.dDrgSDt, dDragEndDate = to.tv.dDrgEDt,
			bIsAllDay, sDragStartDate, sDragEndDate,
			dTempStartDate, dTempEndDate,
			iNumOfEventElements, iWkIndex, iDraggedDistance,
			bEventEntered = false, sDroppableId, bDragStart, sDirectionY;

			/* -----------------

			MouseDown and MouseMove events are just used to change the style of an element when user has started dragging.
			Position properties of an element could not be changed in jQuery Draggable so mousedown and mousemove events are used.

			------------------- */

			iCalendarMarginLeft = $(to.elem).css("margin-left");
			iCalendarMarginLeft = parseInt(iCalendarMarginLeft.replace("px", ""));

			iColumn1Width = $(to.elem).find(".cdvDetailTableColumnTime").width();
			iX1 = $(to.elem).find(".cdvContRow3Events").position().left + iCalendarMarginLeft + iColumn1Width;
			iX2 = iX1 + ($(to.elem).find(".cdvContRow3Events").width() - iColumn1Width);
			iY2 = 1440;
			iY1 = -1440;

			bCanDrag = false;
			$(to.elem).find("."+sDraggableClass).draggable(
			{
				zIndex: 10,
				scope: sScope,
				grid: [iTimeSlotWidth, iTimeSlotHeight],
				scroll: false,
				containment: [iX1, iY1, iX2, iY2],
				delay: 10,
				cursor: "move",
				revertDuration: 300,

				start: function(event, ui)
				{
					if(to.tv.bDVResEv || to.tv.bDVScrlg)
						return false;

					oElemDragged = this;
					sElemId = $(oElemDragged).attr("id");
					sArrElemId = sElemId.split("-");
					sEventId = sArrElemId[1];
					iSegIndex = sArrElemId[2];

					if(!$.CalenStyle.extra.bTouchDevice)
						to._changeViewPropertiesWhileEditing("BEFORE", sEventId);

					bCanDrag = ((to.tv.oEvEdt !== null) && (to.tv.oDVEdtgEv.sEventId === sEventId)) ? true : false;
					if(bCanDrag)
					{
						to.tv.bDVDrgEv = true;

						var oThisEvent = to.getEventWithId(sEventId);
						dDragStartDate = oThisEvent.start;
						dDragEndDate = oThisEvent.end;
						bIsAllDay = oThisEvent.isAllDay;

						dArrTempDates = to.__getStartAndEndDatesOfEventForView(bIsAllDay, dDragStartDate, dDragEndDate);
						dTempStartDate = dArrTempDates[0];
						dTempEndDate = dArrTempDates[1];

						iStartPosX = ui.position.left;
						iPrevPosX = iStartPosX;
						iPrevSnapPosX = iStartPosX;

						iStartPosY = ui.position.top;
						iPrevPosY = iStartPosY;
						iPrevSnapPosY = iStartPosY;

						bDragStart = true;
					}
					else
						return false;
				},

				drag: function(event, ui)
				{
					//if(to.tv.bDVResEv || to.tv.bDVScrlg) - removed to avoid event becoming undraggable after returning false for this condition
					//	return false;

					oElemDragged = this;
					sElemId = $(oElemDragged).attr("id");
					sArrElemId = sElemId.split("-");
					sEventId = sArrElemId[1];
					iSegIndex = sArrElemId[2];
					bIsAllDay = to._getWhetherEventIsAllDay(sEventId);

					bCanDrag = ((to.tv.oEvEdt !== null) && (to.tv.oDVEdtgEv.sEventId === sEventId)) ? true : false;

					if(bCanDrag)
					{
						var iCurrentPosX = ui.position.left,
						iCurrentPosY = ui.position.top,

						bCurrentPosX = (iCurrentPosX >= 40) ? true : false,
						iCalculatedX = Math.round((iCurrentPosX - iPrevSnapPosX) / iTimeSlotWidth),
						iCalculatedY = Math.round((iCurrentPosY - iStartPosY) / iTimeSlotHeight),
						iCalculatedAbsX = Math.abs(iCalculatedX),
						iCalculatedAbsY = Math.abs(iCalculatedY),
						bSnappedX = (bCurrentPosX && (iCurrentPosX !== iPrevSnapPosX) && (iCalculatedAbsX >= 1)) ? true : false,
						bSnappedY = ((iCurrentPosY !== iPrevSnapPosY) && (iCalculatedAbsY >= 1)) ? true : false,
						iEventDaysPresent;

						if(bSnappedX)
						{
							var iStartSnapUnitsX = Math.round((iCurrentPosX - iStartPosX) / iTimeSlotWidth);
							iDraggedDistance = Math.abs(iStartSnapUnitsX * iTimeSlotWidth);

							var iCurrentDiffX = iCurrentPosX - iPrevPosX,
							sDirectionX = "None";
							if(iCurrentDiffX > 0)
								sDirectionX = "Right";
							else if(iCurrentDiffX < 0)
								sDirectionX = "Left";

							var bCompWkSDate = to.compareDates(to.tv.dVDSDt, to.tv.oDVEdtgEv.dEditingDate), //  EventSegment being dragged is On WeekStartDate ?
							bCompWkEDate = to.compareDates(to.tv.dVDEDt, to.tv.oDVEdtgEv.dEditingDate), //  EventSegment being dragged is on WeekEndDate ?
							bCompStartDate = to.compareDates(dDragStartDate, to.tv.oDVEdtgEv.dEditingDate), //  EventSegment Being Dragged is Event Starting Segment ?
							bCompEndDate = to.compareDates(dDragEndDate, to.tv.oDVEdtgEv.dEditingDate), //  EventSegment Being Dragged is Event Ending Segment ?

							dWeekStart2Date = to._getDateForDayNumber(2, true), // get Second Day of the Week
							dWeekEnd2Date = to._getDateForDayNumber(2, false), // get secondLast Day of the Week
							bCompWkS2Date = to.compareDates(dWeekStart2Date, to.tv.oDVEdtgEv.dEditingDate), //  EventSegment being dragged is on Second Day Of Week ?
							bCompWkE2Date = to.compareDates(dWeekEnd2Date, to.tv.oDVEdtgEv.dEditingDate); // EventSegment being dragged is on Second Last Day Of the Week ?

							iEventDaysPresent = $(to.elem).find(".Event-"+sEventId).length;

							if($.cf.compareStrings(sDirectionX, "Right") && bCompWkEDate !== 0)
							{
								iEventMidPoint = iCurrentPosX + (iTimeSlotWidth / 2);
								to.tv.oDVEdtgEv.dEditingDate = to._getDateBasedOnLeftPosition(iEventMidPoint);

								iDragStartDateMS = dDragStartDate.getTime();
								iDragStartDateMS += $.CalenStyle.extra.iMS.d;
								dDragStartDate = new Date(iDragStartDateMS);

								iDragEndDateMS = dDragEndDate.getTime();
								iDragEndDateMS += $.CalenStyle.extra.iMS.d;
								dDragEndDate = new Date(iDragEndDateMS);

								to.tv.dDrgSDt = dDragStartDate;
								to.tv.dDrgEDt = dDragEndDate;

								dArrTempDates = to.__getStartAndEndDatesOfEventForView(bIsAllDay, dDragStartDate, dDragEndDate);
								dTempStartDate = dArrTempDates[0];
								dTempEndDate = dArrTempDates[1];

								if(iEventDaysPresent > 1)
								{
									if(parseInt(iSegIndex) === 1)
									{
										$oOtherSeg = $(to.elem).find("#Event-"+sEventId+"-2");
										if(bCompWkE2Date === 0)
										{
											$oOtherSeg.remove();
										}
									}
								}
								else
								{
									if(bCompWkSDate === 0 && bCompStartDate !== 0)
									{
										sThisSegId = "Event-"+sEventId+"-2";
										$(this).attr("id", sThisSegId);

										$oOtherSeg = $(this).clone();
										sOtherSegId = "Event-"+sEventId+"-1";
										$oOtherSeg.attr("id", sOtherSegId);
										$(to.elem).find(".cdvContRow3Events").append($oOtherSeg);
										to._makeEventEditableInDetailView(".cdvEvent");
									}
								}
								to._removeEventSegWithId(sEventId);
								to._createAndAddEventSegForId(sEventId, bIsAllDay, dDragStartDate, dDragEndDate);
							}
							else if($.cf.compareStrings(sDirectionX, "Left") && bCompWkSDate !== 0)
							{
								iEventMidPoint = iCurrentPosX + (iTimeSlotWidth / 2);
								to.tv.oDVEdtgEv.dEditingDate = to._getDateBasedOnLeftPosition(iEventMidPoint);

								iDragStartDateMS = dDragStartDate.getTime();
								iDragStartDateMS -= $.CalenStyle.extra.iMS.d;
								dDragStartDate = new Date(iDragStartDateMS);

								iDragEndDateMS = dDragEndDate.getTime();
								iDragEndDateMS -= $.CalenStyle.extra.iMS.d;
								dDragEndDate = new Date(iDragEndDateMS);

								to.tv.dDrgSDt = dDragStartDate;
								to.tv.dDrgEDt = dDragEndDate;

								dArrTempDates = to.__getStartAndEndDatesOfEventForView(bIsAllDay, dDragStartDate, dDragEndDate);
								dTempStartDate = dArrTempDates[0];
								dTempEndDate = dArrTempDates[1];

								if(iEventDaysPresent > 1)
								{
									if(parseInt(iSegIndex) === 2)
									{
										$oOtherSeg = $(to.elem).find("#Event-"+sEventId+"-1");
										if(bCompWkS2Date === 0)
										{
											$oOtherSeg.remove();
										}
									}
								}
								else
								{
									if(bCompWkEDate === 0 && bCompEndDate !== 0)
									{
										$oOtherSeg = $(this).clone();
										sOtherSegId = "Event-"+sEventId+"-2";
										$oOtherSeg.attr("id", sOtherSegId);
										$(to.elem).find(".cdvContRow3Events").append($oOtherSeg);
										to._makeEventEditableInDetailView(".cdvEvent");
									}
								}

								to._removeEventSegWithId(sEventId);
								to._createAndAddEventSegForId(sEventId, bIsAllDay, dDragStartDate, dDragEndDate);
							}
							sDragStartDate = to.getDateInFormat({"date": dDragStartDate}, sEventTimeFormat, to.setting.is24Hour, true);
							sDragEndDate = to.getDateInFormat({"date": dDragEndDate}, sEventTimeFormat, to.setting.is24Hour, true);

							$(to.elem).find(".Event-"+sEventId+ " .cdvEventDetails .cdvEventTime").html(sDragStartDate + "-" + sDragEndDate);

							iPrevSnapPosX = iCurrentPosX;
						}

						if(bSnappedY)
						{
							var iCurrentDiffY = iCurrentPosY - iPrevSnapPosY,
							iCurrentSnapUnitsY = Math.round(iCurrentDiffY / iTimeSlotHeight),
							iDraggedAmount = iCurrentSnapUnitsY * to.tv.iUTmMS;
							iDraggedDistance = Math.abs(iCurrentSnapUnitsY * iTimeSlotHeight);

							sDirectionY  = "None";

							if(iCurrentDiffY > 0)
								sDirectionY = "Down";
							else if(iCurrentDiffY < 0)
								sDirectionY = "Up";

							var iPageX, iPageY, iCont3Top, iCont3ScrollTop, iPageYMap, iElemHeight, bInLastRow, bWithinTwoRows,
							iVisibleHeight, iHeightOverhead, iTempHeight, bMinHeightReached, bMaxHeightReached,
							bStartDate, bEndDate;
							if($.cf.compareStrings(sDirectionY, "Up"))
							{
								var iFirstElemTop = $(to.elem).find(".cdvTimeSlotTableRow").first().position().top,
								iFirstTwoRowsHeight = iFirstElemTop + (2 * iTimeSlotHeight);

								iPageX = event.pageX;
								iPageY = event.pageY;

								iCont3Top = $(to.elem).find(".cdvContRow3Main").position().top;
								iPageYMap = iPageY - iCont3Top;

								iElemHeight = $(this).height();
								bWithinTwoRows = (iPageYMap < iFirstTwoRowsHeight);
								iVisibleHeight = iElemHeight - Math.abs(iCurrentPosY);
								iHeightOverhead = iElemHeight % iTimeSlotHeight;
								iTempHeight = (1 * iTimeSlotHeight) + iHeightOverhead;
								bMinHeightReached = ((iCurrentPosY < 0) && (iVisibleHeight < iTempHeight)) ? true : false;

								if(iCurrentPosY < 0)
									$(this).find(".cEventLink").css({"margin-top": Math.abs(iCurrentPosY)});
								else
									$(this).find(".cEventLink").css({"margin-top": 0});

								iDragStartDateMS = dDragStartDate.getTime();
								iDragStartDateMS += iDraggedAmount;
								dDragStartDate = new Date(iDragStartDateMS);

								iDragEndDateMS = dDragEndDate.getTime();
								iDragEndDateMS += iDraggedAmount;
								dDragEndDate = new Date(iDragEndDateMS);

								dArrTempDates = to.__getStartAndEndDatesOfEventForView(bIsAllDay, dDragStartDate, dDragEndDate);
								dTempStartDate = dArrTempDates[0];
								dTempEndDate = dArrTempDates[1];

								iNumOfEventElements = to._getNumberOfDaysOfEventForWeek(bIsAllDay, dDragStartDate, dDragEndDate, false, true);
								iEventDaysPresent = $(to.elem).find(".Event-"+sEventId).length;
								iWkIndex = to.__getDayIndexInView(to.tv.oDVEdtgEv.dEditingDate);

								if(iEventDaysPresent > 0 && iNumOfEventElements === 0)
								{
									$(this).remove();
									return false;
								}
								else if(iEventDaysPresent > 0 || iNumOfEventElements > 0)
								{
									if(iEventDaysPresent > iNumOfEventElements)
									{
										sThisSegId = "#Event-"+sEventId+"-2";
										$(to.elem).find(sThisSegId).remove();
										to._performOperationsAfterDraggingStopsInDetailView(sEventId, dDragStartDate, dDragEndDate, false);
									}

									if(iEventDaysPresent < iNumOfEventElements)
									{
										bStartDate = to.compareDates(to.tv.oDVEdtgEv.dEditingDate, dTempStartDate);
										bEndDate = to.compareDates(to.tv.oDVEdtgEv.dEditingDate, dTempEndDate);

										to.tv.dDrgSDt = dDragStartDate;
										to.tv.dDrgEDt = dDragEndDate;

										if(bStartDate === 0)
											sOtherSegId = "Event-"+sEventId+"-2";
										else if(bEndDate === 0)
										{
											sOtherSegId = "Event-"+sEventId+"-1";

											sThisSegId = "Event-"+sEventId+"-2";
											$(this).attr("id", sThisSegId);
										}

										$oOtherSeg = $(this).clone();
										$oOtherSeg.attr("id", sOtherSegId);
										$(to.elem).find(".cdvContRow3Events").append($oOtherSeg);
										to._makeEventEditableInDetailView(".cdvEvent");

										to._removeEventSegWithId(sEventId);
										to._createAndAddEventSegForId(sEventId, bIsAllDay, dDragStartDate, dDragEndDate);
									}
									else if(iEventDaysPresent === iNumOfEventElements)
									{
										to._removeEventSegWithId(sEventId);
										to._createAndAddEventSegForId(sEventId, bIsAllDay, dDragStartDate, dDragEndDate);
									}
								}
							}
							else if($.cf.compareStrings(sDirectionY, "Down"))
							{
								var iLastElemTop = $(to.elem).find(".cdvTimeSlotTableRow").last().position().top,
								iLastElemBottom = iLastElemTop + iTimeSlotHeight,
								iLastTwoRowsHeight = iLastElemTop - (1 * iTimeSlotHeight);

								iPageX = event.pageX;
								iPageY = event.pageY;

								iCont3Top = $(to.elem).find(".cdvContRow3Main").position().top;
								iCont3ScrollTop = $(to.elem).find(".cdvContRow3Main").scrollTop();
								iPageYMap = iPageY - iCont3Top + iCont3ScrollTop;

								iElemHeight = $(this).height();
								bInLastRow = (iPageYMap > iLastElemTop);
								bWithinTwoRows = (iPageYMap > iLastTwoRowsHeight);
								iHeightOverhead = iElemHeight % iTimeSlotHeight;
								iTempHeight = (1 * iTimeSlotHeight) + iHeightOverhead;
								bMaxHeightReached = (iElemHeight <= iTempHeight) ? true : false;

								if(iCurrentPosY < 0)
									$(this).find(".cEventLink").css({"margin-top": Math.abs(iCurrentPosY)});
								else
									$(this).find(".cEventLink").css({"margin-top": 0});

								iDragStartDateMS = dDragStartDate.getTime();
								iDragStartDateMS += iDraggedAmount;
								dDragStartDate = new Date(iDragStartDateMS);

								iDragEndDateMS = dDragEndDate.getTime();
								iDragEndDateMS += iDraggedAmount;
								dDragEndDate = new Date(iDragEndDateMS);

								iElemHeight = $(this).height();
								var iElemBottom = iCurrentPosY + iElemHeight;
								if((iElemBottom) > iLastElemBottom)
								{
									iElemHeight -= (iElemBottom - iLastElemBottom);
									$(this).css({"height": iElemHeight});
								}

								dArrTempDates = to.__getStartAndEndDatesOfEventForView(bIsAllDay, dDragStartDate, dDragEndDate);
								dTempStartDate = dArrTempDates[0];
								dTempEndDate = dArrTempDates[1];

								sDragStartDate = to.getDateInFormat({"date": dDragStartDate}, sEventTimeFormat, to.setting.is24Hour, true);
								sDragEndDate = to.getDateInFormat({"date": dDragEndDate}, sEventTimeFormat, to.setting.is24Hour, true);

								iNumOfEventElements = to._getNumberOfDaysOfEventForWeek(bIsAllDay, dDragStartDate, dDragEndDate, false, true);
								iEventDaysPresent = $(to.elem).find(".Event-"+sEventId).length;
								iWkIndex = to.__getDayIndexInView(to.tv.oDVEdtgEv.dEditingDate);

								if(iEventDaysPresent > 0 && iNumOfEventElements === 0)
								{
									$(this).remove();
									return false;
								}
								else if(iEventDaysPresent > 0 || iNumOfEventElements > 0)
								{
									if(iEventDaysPresent > iNumOfEventElements)
									{
										var sSeg1Id = "Event-"+sEventId+"-1";
										sThisSegId = "#"+sSeg1Id;
										$(to.elem).find(sThisSegId).remove();

										sOtherSegId = "#Event-"+sEventId+"-2";
										$(to.elem).find(sOtherSegId).attr("id", sSeg1Id);
										to._performOperationsAfterDraggingStopsInDetailView(sEventId, dDragStartDate, dDragEndDate, false);
									}
									else if(iEventDaysPresent < iNumOfEventElements)
									{
										bStartDate = to.compareDates(to.tv.oDVEdtgEv.dEditingDate, dTempStartDate);
										bEndDate = to.compareDates(to.tv.oDVEdtgEv.dEditingDate, dTempEndDate);

										to.tv.dDrgSDt = dDragStartDate;
										to.tv.dDrgEDt = dDragEndDate;

										if(bStartDate === 0)
											sOtherSegId = "Event-"+sEventId+"-2";
										else if(bEndDate === 0)
										{
											sOtherSegId = "Event-"+ sEventId+"-1";

											sThisSegId = "Event-"+sEventId+"-2";
											$(this).attr("id", sThisSegId);
										}

										$oOtherSeg = $(this).clone();
										$oOtherSeg.attr("id", sOtherSegId);
										$(to.elem).find(".cdvContRow3Events").append($oOtherSeg);
										to._makeEventEditableInDetailView(".cdvEvent");

										to._removeEventSegWithId(sEventId);
										to._createAndAddEventSegForId(sEventId, bIsAllDay, dDragStartDate, dDragEndDate);
									}
									else if(iEventDaysPresent === iNumOfEventElements)
									{
										to._removeEventSegWithId(sEventId);
										to._createAndAddEventSegForId(sEventId, bIsAllDay, dDragStartDate, dDragEndDate);
									}
								}
							}
							iPrevSnapPosY = iCurrentPosY;
						}

						if(to.tv.bDVDrgEv)
							ui.position.left = to.tv.oDVEdtgEv.iElemLeft;

						iPrevPosX = iCurrentPosX;
						iPrevPosY = iCurrentPosY;

						if(to.tv.bChkDroppable)
						{
							$oElemDragged = $(to.elem).find("#" + sElemId + ".ui-draggable-dragging");

							iNumOfEventElements = to._getNumberOfDaysOfEventForWeek(bIsAllDay, dDragStartDate, dDragEndDate, false, true);
							sDroppableId = $oElemDragged.attr("data-droppableid");
							bEventEntered = to._findWhetherEventEnteredNonDroppableZone(dDragStartDate, dDragEndDate, bIsAllDay, iNumOfEventElements, sDroppableId);

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
					}
					else
					{
						return false;
					}
				},

				stop: function(event, ui)
				{
					//if(to.tv.bDVResEv || to.tv.bDVScrlg)
					//	return false;

					oElemDragged = this;
					sElemId = $(oElemDragged).attr("id");
					sArrElemId = sElemId.split("-");
					sEventId = sArrElemId[1];
					iSegIndex = sArrElemId[2];

					bCanDrag = ((to.tv.oEvEdt !== null) && (to.tv.oDVEdtgEv.sEventId === sEventId)) ? true : false;

					if(to.tv.bChkDroppable)
					{
						$oElemDragged = $(to.elem).find("#" + sElemId + ".ui-draggable-dragging");

						iNumOfEventElements = to._getNumberOfDaysOfEventForWeek(bIsAllDay, dDragStartDate, dDragEndDate, false, true);
						sDroppableId = $oElemDragged.attr("data-droppableid");
						bEventEntered = to._findWhetherEventEnteredNonDroppableZone(dDragStartDate, dDragEndDate, bIsAllDay, iNumOfEventElements, sDroppableId);

						$oElemDragged.removeClass("cCursorNotAllowed");
						$oElemDragged.find(".cEventLink").removeClass("cCursorNotAllowed");
					}

					if(bEventEntered)
					{
						setTimeout(function()
						{
							to._performOperationsAfterDraggingStopsInDetailView(sEventId, null, null, true);

							to.tv.dDrgSDt = null;
							to.tv.dDrgEDt = null;

							if(!bCanDrag)
								return false;
						}, 300);
					}
					else
					{
						if(bCanDrag)
						{
							to._performOperationsAfterDraggingStopsInDetailView(sEventId, dDragStartDate, dDragEndDate, true);

							to.tv.bDVDrgEv = false;
							to.tv.dDrgSDt = null;
							to.tv.dDrgEDt = null;
						}
						else
						{
							if(!$.CalenStyle.extra.bTouchDevice)
								to._makeEventNonEditableInDetailView();
							to.tv.dDrgSDt = null;
							to.tv.dDrgEDt = null;
							return false;
						}
					}
				},

				revert: function(event, ui)
				{
					if(bEventEntered)
						return true;
					return false;
				}

			});
		}
		else if($.cf.compareStrings(sClass, ".cdvEventAllDay"))
		{
			iEventHeight = $(to.elem).find(".cdvEventAllDay").height();
			iEventWidth = $(to.elem).find(".cdvTableColumns").width();
			if(iEventWidth > 140)
				iEventWidth = 140;

			iColumn1Width = $(to.elem).find(".cdvDetailTableColumnTime").width();
			iCalendarLeft = $(to.elem).position().left;
			iCalendarMarginLeft = $(to.elem).css("margin-left");
			iCalendarMarginLeft = parseInt(iCalendarMarginLeft.replace("px", ""));
			iLeft = iCalendarLeft + iCalendarMarginLeft + $(to.elem).find(".cdvContRow2Main").position().left;
			iX1 = iLeft + iColumn1Width;
			iX2 = iX1 + $(to.elem).find(".cdvContRow2Main").width() - (iEventWidth + iScrollbarWidth + iColumn1Width);

			iCalendarTop = $(to.elem).position().top;
			iCalendarMarginTop = $(to.elem).css("margin-top");
			iCalendarMarginTop = parseInt(iCalendarMarginTop.replace("px", ""));
			iY1 = iCalendarTop + iCalendarMarginTop + $(to.elem).find(".cdvContRow2Main").position().top;
			if(to.tv.bDisFBar && $.cf.compareStrings(to.setting.filterBarPosition, "Top"))
				iY1 += to.setting.filterBarHeight;
			iY2 = iY1 + $(to.elem).find(".cdvContRow2Main").height() - (iEventHeight);

			bCanDrag = false;
			$(to.elem).find("."+sDraggableClass).draggable(
			{
				zIndex: 100,
				scope: sScope,
				cursorAt: { top: 5, left: 5 },
				containment: [iX1, iY1, iX2, iY2],
				cursor: "move",
				revertDuration: 300,

				start: function()
				{
					$oElemDragged = $(this);
					sElemId = $oElemDragged.attr("id");
					sArrElemId = sElemId.split("-");
					sEventId = sArrElemId[1];

					bCanDrag = ((to.tv.oEvEdt !== null) && (to.tv.oDVEdtgEv.sEventId === sEventId)) ? true : false;
					if(bCanDrag)
					{
						var oElementClone = $oElemDragged.clone();
						$oElemDragged.parent().append(oElementClone);
						$(oElementClone).removeClass("cEditingEvent").addClass("cEventBeingDragged");

						$oElemDragged.find(".cPartialEventLeft, .cPartialEventRight, .cPartialEventBoth").remove();
						$oElemDragged.css({"width": iEventWidth, "height": iEventHeight});
					}
					else
						return false;
				},

				revert: function()
				{
					return true;
				}
			});
		}
	},

	_performOperationsAfterDraggingStopsInDetailView: function(sId, dStartDateAfterDrop, dEndDateAfterDrop, bFromStop)
	{
		var to = this;
		var oDraggedEvent = to.getEventWithId(sId),
		bIsAllDay = oDraggedEvent.isAllDay,
		dStartDateTime = oDraggedEvent.start,
		dEndDateTime = oDraggedEvent.end;

		if(!$.cf.isValid(dStartDateAfterDrop))
			dStartDateAfterDrop = new Date(dStartDateTime);
		if(!$.cf.isValid(dEndDateAfterDrop))
			dEndDateAfterDrop = new Date(dEndDateTime);

		oDraggedEvent.start = dStartDateAfterDrop;
		oDraggedEvent.end = dEndDateAfterDrop;

		to._removeEventSegWithId(sId);
		to._createAndAddEventSegForId(sId, bIsAllDay, dStartDateAfterDrop, dEndDateAfterDrop);

		to._setPropertiesOfEventSeg();
		to.tv.oEvEdt = oDraggedEvent;

		$(to.elem).find(".cdvEvent").removeClass("ui-draggable-dragging");

		to.tv.bDVDrgEv = false;
		if(to.setting.saveChangesOnEventDrop)
		{
			to._makeEventNonEditableInDetailView();
			to.setting.saveChangesOnEventDrop.call(to, oDraggedEvent, dStartDateTime, dEndDateTime, dStartDateAfterDrop, dEndDateAfterDrop);
		}
		else if(bFromStop && !$.CalenStyle.extra.bTouchDevice)
			to._makeEventNonEditableInDetailView();
	},

	_adjustAllDayEventsInDetailView: function()
	{
		var to = this;
		var iNumOfWkDays = to.tv.iNoVDayDis,
		iPosTopDiff = 6,
		iEventHeight = $.CalenStyle.extra.iEventHeights[to.setting.visibleView],
		iEventWidth = 0,
		iTopPos = 0,
		iLeftPos = 0,
		iMaxTopPos = 0;

		for(var iTempIndex = 0; iTempIndex < to.tv.oAADEvSeg.length; iTempIndex++)
		{
			var oAllDayEvent = to.tv.oAADEvSeg[iTempIndex],

			sEventId = oAllDayEvent[0],
			iWidthUnits = oAllDayEvent[1],
			iNewLeftIndex = oAllDayEvent[2],
			iNewTopIndex = oAllDayEvent[3];

			iTopPos = ((iNewTopIndex - 1) * (iEventHeight + iPosTopDiff)) + iPosTopDiff;
			iLeftPos = to.tv.fADVDayLftPos[iNewLeftIndex];
			var iNewLeftIndexEnd = iNewLeftIndex + iWidthUnits;
			var iLeftPosEnd;
			if(iNewLeftIndexEnd >= iNumOfWkDays)
				iLeftPosEnd = to.tv.fADVDayLftPos[iNumOfWkDays - 1] + to.tv.fDVDayWth + 2;
			else
				iLeftPosEnd = to.tv.fADVDayLftPos[iNewLeftIndexEnd];
			iEventWidth = (iLeftPosEnd - iLeftPos) - 5;

			var $oEvent = $(to.elem).find("#"+sEventId);
			$oEvent.css({"top": iTopPos, "left": iLeftPos, "width": iEventWidth, "height": iEventHeight, "line-height": iEventHeight + "px"});

			if(iTopPos > iMaxTopPos)
				iMaxTopPos = iTopPos;

			var iEventWidthMinus = 0;
			iEventWidthMinus += $oEvent.find(".cdvEventIcon").outerWidth(true);
			iEventWidthMinus += $oEvent.find(".cPartialEventLeft").outerWidth(true);
			iEventWidthMinus += $oEvent.find(".cPartialEventRight").outerWidth(true);
			iEventWidthMinus += $oEvent.find(".cdvEventTimeLeft").outerWidth(true);
			iEventWidthMinus += $oEvent.find(".cdvEventTimeRight").outerWidth(true);
			iEventWidthMinus += $oEvent.find(".cdvEventStatus").outerWidth(true);
			iEventWidthMinus +=  (10 * $.CalenStyle.extra.iBorderOverhead);

			var iEventTitleWidth = iEventWidth - iEventWidthMinus;
			$(to.elem).find("#"+sEventId).find(".cdvEventTitle").css({"max-height": iEventHeight, "line-height": iEventHeight + "px", "width": iEventTitleWidth});
		}

		var iRow2Height = iMaxTopPos + iEventHeight + 2 * iPosTopDiff;
		$(to.elem).find(".cdvContRow2Main").css({"height": iRow2Height});
		iRow2Height = $(to.elem).find(".cdvContRow2Main").height();
		$(to.elem).find(".cdvDetailTableRow2").css({"height": iRow2Height});

		$(to.elem).find(".cdvCellHeaderAllDay").css({"height": iRow2Height});

		var iRow2Top = $(to.elem).find(".cdvContRow2Main").position().top,
		iWeekTableHeight = $(to.elem).find(".cdvDetailTableMain").height(),
		iWeekTableRow1Height = $(to.elem).find(".cdvDetailTableRow1").height(),
		iRow3Top = iRow2Top + iRow2Height + $.CalenStyle.extra.iEventHeightOverhead,
		iRow3Height = iWeekTableHeight - (iWeekTableRow1Height + iRow2Height + $.CalenStyle.extra.iEventHeightOverhead);
		$(to.elem).find(".cdvContRow3Main").css({"height": iRow3Height, "top": iRow3Top});

		to._makeEventEditableInDetailView(".cdvEventAllDay");
	},

	_getLeftColumnAndWidthOfAnEventSegInDetailView: function(sEventSegID)
	{
		var to = this;
		var iSegLength = to.tv.oASmEvSeg.length;
		for(var iSegIndex = 0; iSegIndex < iSegLength; iSegIndex++)
		{
			var oTempSeg = to.tv.oASmEvSeg[iSegIndex];
			if(oTempSeg.eventSegId === sEventSegID)
				return [oTempSeg.segLeftColumn, oTempSeg.segColumns];
		}
		return 0;
	},

	_assignEventSegToColumnsInDetailView: function(oAEventSegs)
	{
		var to = this;
		var iEventSegsLength = oAEventSegs.length,
		oArrColumns = [],
		iSegLeftColumn = 0, iEventSegIndex, oCurrentSeg;

		if(iEventSegsLength > 0)
		{
			for(iEventSegIndex = 0; iEventSegIndex < iEventSegsLength; iEventSegIndex++)
			{
				oCurrentSeg = oAEventSegs[iEventSegIndex];

				if(iEventSegIndex === 0)
				{
					iSegLeftColumn = 1;
					oCurrentSeg.segLeftColumn = iSegLeftColumn;
					oArrColumns.push([iSegLeftColumn, [oCurrentSeg]]);
				}
				else if(iEventSegIndex === 1)
				{
					iSegLeftColumn = 2;
					oCurrentSeg.segLeftColumn = iSegLeftColumn;
					oArrColumns.push([iSegLeftColumn, [oCurrentSeg]]);
				}
				else
				{
					var bEventAddedInExistingColumn = false;
					for(var iColumnIndex = 0; iColumnIndex < oArrColumns.length; iColumnIndex++)
					{
						var oArrTempColumn = oArrColumns[iColumnIndex],
						iTempLeftColumn = oArrTempColumn[0],
						oArrTempEventSegs = oArrTempColumn[1],

						bCollidingEventFound = false;
						for(var iSegIndex = 0; iSegIndex < oArrTempEventSegs.length; iSegIndex++)
						{
							var oTempSeg = oArrTempEventSegs[iSegIndex];
							var bIsColliding = to._whetherEventsAreColliding(oCurrentSeg, oTempSeg);
							if(bIsColliding)
							{
								bCollidingEventFound = true;
								break;
							}
						}
						if(!bCollidingEventFound) // Event Added In Existing Column
						{
							oCurrentSeg.segLeftColumn = iTempLeftColumn;
							oArrTempEventSegs.push(oCurrentSeg);
							bEventAddedInExistingColumn = true;
							break;
						}
					}

					if(!bEventAddedInExistingColumn)// Event Added In New Column
					{
						iSegLeftColumn++;
						oCurrentSeg.segLeftColumn = iSegLeftColumn;
						oArrColumns.push([iSegLeftColumn, [oCurrentSeg]]);
					}
				}
			}

			for(iEventSegIndex = 0; iEventSegIndex < iEventSegsLength; iEventSegIndex++)
			{
				oCurrentSeg = oAEventSegs[iEventSegIndex];
				oCurrentSeg.segColumns = iSegLeftColumn;
			}
		}
		return oArrColumns;
	},

	_addTimeSlotTable: function()
	{
		var to = this;
		var sTemplate = "", sTimeSlotClass = "", sDVDaysClass = "", iTopPos = 0;
		to.tv.fAHrTpPos = [];

		sTemplate += "<table class='cdvTimeSlotTable'>";
		for(var iSlotIndex = 0; iSlotIndex < (24 * to.tv.iUTmSlt); iSlotIndex++)
		{
			var iSlotHours = Math.floor(iSlotIndex / to.tv.iUTmSlt),
			iSlotInnerIndex = iSlotIndex % to.tv.iUTmSlt,
			iSlotMinutes = iSlotInnerIndex * to.setting.unitTimeInterval;

			var dSlotDate = new Date(),
			dSlotStartDate = new Date(),
			dSlotEndDate = new Date();

			dSlotDate.setHours(iSlotHours);
			dSlotDate.setMinutes(iSlotMinutes);
			dSlotStartDate.setHours(to.tv.oBsHours.startTime[0]);
			dSlotStartDate.setMinutes(to.tv.oBsHours.startTime[1]);
			dSlotEndDate.setHours(to.tv.oBsHours.endTime[0]);
			dSlotEndDate.setMinutes(to.tv.oBsHours.endTime[1]);

			var bAddRow = to.setting.excludeNonBusinessHours ? (to.compareDateTimes(dSlotDate, dSlotStartDate) >= 0 && to.compareDateTimes(dSlotDate, dSlotEndDate) < 0) : true;
			if(bAddRow)
			{
				var sSlotTime = to.getNumberStringInFormat(iSlotHours, 2, false) + to.getNumberStringInFormat(iSlotMinutes, 2, false),
				sHourStr = to.getDateInFormat({"iDate": {H: iSlotHours, m: iSlotMinutes}}, "hh:mm", to.setting.is24Hour, true);

				sTimeSlotClass = "cdvTimeSlotTableRow cdvTimeSlotTableRow"+sSlotTime;
				sTemplate += "<tr class='" + sTimeSlotClass + "' title='" + sHourStr + "'>";

				if(!to.setting.timeLabels[iSlotInnerIndex])
					sHourStr = "&nbsp;";

				sTemplate += "<td class='cdvDetailTableColumnTime'><span>" + sHourStr + "</span></td>";

				for(var iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
				{
					var bArrTemp = to.tv.bADVCur[iDateIndex],
					bTemp = bArrTemp[iSlotIndex],
					dThisTempDate = to.tv.dAVDt[iDateIndex],
					sStyle = "";

					sDVDaysClass = "cdvDetailTableColumn"+iDateIndex;
					var sCellClass = "cdvTableColumns " +sDVDaysClass;
					if(bTemp === 0)
						sCellClass += " cNonBusinessHoursBg";
					else if(bTemp === 2)
						sCellClass += " cRestrictedSectionBg";
					else if(bTemp !== 1)
					{
						for(var iInfoIndex = 0; iInfoIndex < to.tv.sADVInfo.length; iInfoIndex++)
						{
							var oDVInfo = to.tv.sADVInfo[iInfoIndex];
							if(oDVInfo.index === bTemp)
							{
								if($.cf.isValid(oDVInfo.class))
									sCellClass += " " + oDVInfo.class;
								if($.cf.isValid(oDVInfo.bgColor))
									sStyle = "style='background: " + $.cf.addHashToHexcode(oDVInfo.bgColor) + ";'";
								break;
							}
						}
					}
					else if(bTemp === 1)
						sCellClass += " cBusinessHoursBg";

					sTemplate += "<td class='" + sCellClass + "' title='"+ dThisTempDate +"' " + sStyle + "'> &nbsp; </td>";
				}
				sTemplate += "</tr>";

				to.tv.fAHrTpPos.push(iTopPos);
				iTopPos += 32;
			}
		}
		sTemplate += "</table>";
		$(to.elem).find(".cdvContRow3Main").html(sTemplate);

		$(to.elem).find(".cdvContRow3Main").scroll(function()
		{
			to.tv.bDVScrlg = true;
			setTimeout(function()
		    {
				to.tv.bDVScrlg = false;
		   	}, 1000);
		});

		setTimeout(function()
		{
			to._showCurrentTimeIndicator();
		}, 100);

		to._makeViewDroppableInDetailView();
	},

	__updateTimeSlotTableView: function()
	{
		var to = this;
		$(to.elem).find(".cdvTableColumns").removeClass("cNonBusinessHoursBg cRestrictedSectionBg cBusinessHoursBg");

		to._getTimeSlotsArrayForCurrentView();
		var iMaxTimeSlots = 24 * to.tv.iUTmSlt,
		iSlotIndex, iDateIndex, bArrTemp, bTemp, iInfoIndex, oDVInfo;
		for(iSlotIndex = 0; iSlotIndex < iMaxTimeSlots; iSlotIndex++)
		{
			var iSlotHours = Math.floor(iSlotIndex / to.tv.iUTmSlt),
			iSlotInnerIndex = iSlotIndex % to.tv.iUTmSlt,
			iSlotMinutes = iSlotInnerIndex * to.setting.unitTimeInterval,
			sSlotTime = to.getNumberStringInFormat(iSlotHours, 2, false) + to.getNumberStringInFormat(iSlotMinutes, 2, false),
			sTimeSlotClass = ".cdvTimeSlotTableRow"+sSlotTime;

			var rowElem = $(to.elem).find(sTimeSlotClass);
			for(iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
			{
				bArrTemp = to.tv.bADVCur[iDateIndex];
				bTemp = bArrTemp[iSlotIndex];
				var $oDayElem = $(rowElem).find(".cdvDetailTableColumn"+iDateIndex),
				sCellClass = "";

				if(bTemp === 0)
					sCellClass = "cNonBusinessHoursBg";
				else if(bTemp === 2)
					sCellClass = "cRestrictedSectionBg";
				else if(bTemp !== 1)
				{
					for(iInfoIndex = 0; iInfoIndex < to.tv.sADVInfo.length; iInfoIndex++)
					{
						oDVInfo = to.tv.sADVInfo[iInfoIndex];
						if(oDVInfo.index === bTemp)
						{
							if($.cf.isValid(oDVInfo.class))
								sCellClass += " " + oDVInfo.class;
							if($.cf.isValid(oDVInfo.bgColor))
								$oDayElem.css({"background" : $.cf.addHashToHexcode(oDVInfo.bgColor)});
							break;
						}
					}
				}
				else if(bTemp === 1)
					sCellClass = "cBusinessHoursBg";

				$oDayElem.addClass(sCellClass);
			}
		}

		for(iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
		{
			bArrTemp = to.tv.bADVCur[iDateIndex];
			bTemp = bArrTemp[iMaxTimeSlots];
			var $oAllDayElem = $(to.elem).find(".cdvDetailTableMain #cdvAllDayColumn"+iDateIndex);

			if(bTemp === 2)
				$oAllDayElem.addClass("cRestrictedSectionBg");
			else if(bTemp !== 0 && bTemp !== 1)
			{
				for(iInfoIndex = 0; iInfoIndex < to.tv.sADVInfo.length; iInfoIndex++)
				{
					oDVInfo = to.tv.sADVInfo[iInfoIndex];
					if(oDVInfo.index === bTemp)
					{
						if($.cf.isValid(oDVInfo.class))
							$oAllDayElem.addClass(oDVInfo.class);
						if($.cf.isValid(oDVInfo.bgColor))
							$oAllDayElem.css({"background" : $.cf.addHashToHexcode(oDVInfo.bgColor)});
						break;
					}
				}
			}
		}
	},

	_makeViewDroppableInDetailView: function()
	{
		var to = this;

		var sDroppableId, iDroppedDayIndex, oDroppedElem,
		sEventId, iEventId, oDraggedEvent, dThisStartDate, dThisEndDate, bIsAllDay, iNumOfDays,
		dDroppedDate, dStartDateAfterDrop, dEndDateAfterDrop,
		$oElemDragged, bEventEntered = false;

		$(to.elem).find(".cdvDetailTableRow2 .cdvAllDayColumns").droppable(
		{
			scope: "AllDayEvents",

			over: function(event, ui)
			{
				sDroppableId = $(this).attr("id");
				iDroppedDayIndex = parseInt(sDroppableId.replace("cdvAllDayColumn", ""));

				oDroppedElem = ui.draggable;
				sEventId = $(to.elem).find(oDroppedElem).attr("id");
				iEventId = sEventId.replace("Event-", "");
				oDraggedEvent = to.getEventWithId(iEventId);
				dThisStartDate = oDraggedEvent.start;
				dThisEndDate = oDraggedEvent.end;
				bIsAllDay = oDraggedEvent.isAllDay;
				iNumOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dThisStartDate, dThisEndDate, false, false, true);

				dDroppedDate = to.tv.dAVDt[iDroppedDayIndex];
				dStartDateAfterDrop = to.setDateInFormat({"iDate": {d: dDroppedDate.getDate(), M: dDroppedDate.getMonth(), y: dDroppedDate.getFullYear(), H: dThisStartDate.getHours(), m: dThisStartDate.getMinutes(), s: dThisStartDate.getSeconds()}}, "");
				dEndDateAfterDrop = new Date(dStartDateAfterDrop.getTime() + (dThisEndDate.getTime() - dThisStartDate.getTime()));

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

				$(to.elem).find(".cdvAllDayColumns").removeClass("cActivatedCell");
				for(var iElemIndex = 0; iElemIndex < iNumOfDays; iElemIndex++)
				{
					var iNextDay = iDroppedDayIndex + iElemIndex;
					if(iNextDay <= (to.tv.dAVDt.length - 1))
					{
						var sElemId = "#cdvAllDayColumn"+iNextDay;
						$(to.elem).find(sElemId).addClass("cActivatedCell");
					}
				}
			},

			drop: function(event, ui)
			{
				sDroppableId = $(this).attr("id");
				iDroppedDayIndex = parseInt(sDroppableId.replace("cdvAllDayColumn", ""));

				$(to.elem).find(".cdvAllDayColumns").removeClass("cActivatedCell");

				oDroppedElem = ui.draggable;
				sEventId = $(to.elem).find(oDroppedElem).attr("id");
				iEventId = sEventId.replace("Event-", "");
				oDraggedEvent = to.getEventWithId(iEventId);
				dThisStartDate = oDraggedEvent.start;
				dThisEndDate = oDraggedEvent.end;
				bIsAllDay = oDraggedEvent.isAllDay;
				iNumOfDays = to.getNumberOfDaysOfEvent(bIsAllDay, dThisStartDate, dThisEndDate, false, false, true);

				dDroppedDate = to.tv.dAVDt[iDroppedDayIndex];
				dStartDateAfterDrop = to.setDateInFormat({"iDate": {d: dDroppedDate.getDate(), M: dDroppedDate.getMonth(), y: dDroppedDate.getFullYear(), H: dThisStartDate.getHours(), m: dThisStartDate.getMinutes(), s: dThisStartDate.getSeconds()}}, "");
				dEndDateAfterDrop = new Date(dStartDateAfterDrop.getTime() + (dThisEndDate.getTime() - dThisStartDate.getTime()));

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
							$oElemDragged.removeClass("cEventBeingDragged ui-draggable-dragging");
						$(ui.draggable).remove();
						to._makeEventNonEditableInDetailView();
						return false;
					}, 300);
				}
				else
				{
					if(to.__updateEventWithId(iEventId, dStartDateAfterDrop, dEndDateAfterDrop))
					{
						$(to.elem).find(".cdvEventAllDay").remove();
						to.__addEventsInDetailView("AllDay");
						to._adjustAllDayEventsInDetailView();
						to._makeEventNonEditableInDetailView();
					}
					else
					{
						$(ui.draggable).remove();
						to._makeEventNonEditableInDetailView();
						return false;
					}
				}

				to.tv.bDVDrgEv = false;
				if(to.setting.saveChangesOnEventDrop)
					to.setting.saveChangesOnEventDrop.call(to, oDraggedEvent, dThisStartDate, dThisEndDate, dStartDateAfterDrop, dEndDateAfterDrop);
			}
		});
	},

	_canEditEventInDetailView: function(sElemId)
	{
		var to = this;
		var sArrElemId = sElemId.split("-"),
		sEventId = sArrElemId[1],
		iSegIndex = sArrElemId[2],
		bCanEdit = ((to.tv.oEvEdt !== null) && (to.tv.oDVEdtgEv.sEventId === sEventId)) ? true : false;
		return [bCanEdit, sEventId, iSegIndex];
	},

	_makeEventResizableInDetailView: function(sEventClass)
	{
		var to = this;
		var iResizeGrid = (($(to.elem).find(".cdvTimeSlotTableRow" + ":eq(0)").outerHeight() + $(to.elem).find(".cdvTimeSlotTableRow" + ":eq(1)").outerHeight()) / 2),
		iResizeDistance = iResizeGrid / 4,
		iMaxHeight = iResizeGrid * 46,

		sTempEventClass, iNumOfEventSeg,
		sElemId, iSegId, iSegIndex, dArrTempDates, dSegStartDate, dSegEndDate,
		iTopPos, iPrevHeight, sArrElemId, sEventId,

		bCanResize = false,

		bIsAllDay = false,
		$oElemResized, sDroppableId, bEventEntered;


		$(to.elem).find(sEventClass).resizable(
		{
			grid: iResizeGrid,
			distance: iResizeDistance,
			handles: "s",
			maxHeight: iMaxHeight,
			minHeight: (iResizeGrid / 2),
			containment: "parent",

			create: function(ev, ui)
			{
				$(to.elem).find(sEventClass).find(".ui-resizable-handle").css({"text-align": "center"});

				var $oElem = $(to.elem).find(sEventClass + " .ui-resizable-s");
				$oElem.css({"bottom": 0});
				$oElem.addClass("cEventResizeHandle");
				$oElem.html("<div class ='cHandleSouth'></div>");

				$oElem.on($.CalenStyle.extra.sClickHandler, function(e)
				{
					e.stopPropagation();
				});
			},

			start: function(ev, ui)
			{
				if(to.tv.bDVDrgEv || to.tv.bDVScrlg)
					return false;

				sElemId = $(to.elem).find(ui.element).attr("id");
				if(!$.CalenStyle.extra.bTouchDevice)
				{
					sArrElemId = sElemId.split("-");
					sEventId = sArrElemId[1];
					to._changeViewPropertiesWhileEditing("BEFORE", sEventId);
				}
				var oArrCanEdit = to._canEditEventInDetailView(sElemId);
				bCanResize = oArrCanEdit[0];

				if(bCanResize)
				{
					to.tv.bDVResEv = true;

					sElemId = "#"+sElemId;
					iSegId = oArrCanEdit[1];
					iSegIndex = oArrCanEdit[2];
					iPrevHeight = $(to.elem).find(sElemId).height();
					sTempEventClass = "Event-"+iSegId;
					iTopPos = $(to.elem).find(sElemId).position().top;

					dArrTempDates = to._getStartAndEndDatesOfEventWithId(iSegId);
					dSegStartDate = new Date(dArrTempDates[0]);
					dSegEndDate = new Date(dArrTempDates[1]);
				}
			},

			resize: function(ev, ui)
			{
				if(to.tv.bDVDrgEv || to.tv.bDVScrlg)
					return false;

				sElemId = $(to.elem).find(ui.element).attr("id");
				var oArrCanEdit = to._canEditEventInDetailView(sElemId);
				bCanResize = oArrCanEdit[0];
				if(bCanResize)
				{
					iNumOfEventSeg = to._getNumberOfDaysOfEventForWeek(0, dSegStartDate, dSegEndDate, false, true);

					sElemId = "#"+sElemId;
					var iCurrentHeight = $(to.elem).find(sElemId).height();
					var iCurrentTop = iTopPos;
					$(to.elem).find(sElemId).css({"top": iCurrentTop});

					var iTempHeight = 0;
					if(iCurrentTop < 0)
					{
						iTempHeight = iCurrentTop + iPrevHeight;
						if(iCurrentHeight >= (iTempHeight - 10) && iCurrentHeight <= (iTempHeight + 10))
							iTempHeight = 0;
					}
					else
						iTempHeight = iCurrentHeight;

					var bResize = ((iTempHeight > 0) && (Math.abs(iCurrentHeight - iPrevHeight)) > 10);
					if(bResize)
					{
						var iSegEndDate;
						if(iCurrentHeight < iPrevHeight)
						{
							iSegEndDate = dSegEndDate.getTime();
							iSegEndDate -= to.tv.iUTmMS;
							dSegEndDate = new Date(iSegEndDate);
						}
						else if(iCurrentHeight > iPrevHeight)
						{
							iSegEndDate = dSegEndDate.getTime();
							iSegEndDate += to.tv.iUTmMS;
							dSegEndDate = new Date(iSegEndDate);
						}

						$oElemResized = $(to.elem).find(sElemId + ".ui-resizable-resizing");
						sDroppableId = $oElemResized.attr("data-droppableid");
						bEventEntered = to._findWhetherEventEnteredNonDroppableZone(dSegStartDate, dSegEndDate, bIsAllDay, iNumOfEventSeg, sDroppableId);

						if(bEventEntered)
						{
							$oElemResized.addClass("cCursorNotAllowed");
							$oElemResized.find(".cEventLink").addClass("cCursorNotAllowed");

							$oElemResized.css({"height": ui.originalSize.height});

							return false;
						}
						else
						{
							$oElemResized.removeClass("cCursorNotAllowed");
							$oElemResized.find(".cEventLink").removeClass("cCursorNotAllowed");
						}

						if(!bEventEntered)
						{
							if((iCurrentTop + iCurrentHeight) <= 0)
							{
								to._performOperationsAfterResizingStopsInDetailView(iSegId, dSegStartDate, dSegEndDate);
								return false;
							}
							if(iNumOfEventSeg === 2 && iSegIndex === 1)
							{
								$(to.elem).find("#Event-"+iSegId+"-2").remove();

								dSegEndDate = to.setDateInFormat({"date": dSegStartDate}, "END");
								dSegEndDate.setMinutes(30);
								dSegEndDate.setSeconds(0);

								to._performOperationsAfterResizingStopsInDetailView(iSegId, dSegStartDate, dSegEndDate);
								return false;
							}
							iPrevHeight = iCurrentHeight;
						}
					}
				}
			},

			stop: function(ev, ui)
			{
				if(to.tv.bDVDrgEv || to.tv.bDVScrlg)
					return false;

				sElemId = $(to.elem).find(ui.element).attr("id");
				var oArrCanEdit = to._canEditEventInDetailView(sElemId);
				bCanResize = oArrCanEdit[0];

				if(bCanResize)
				{
					if($.cf.isValid($oElemResized))
					{
						$oElemResized.removeClass("cCursorNotAllowed");
						$oElemResized.find(".cEventLink").removeClass("cCursorNotAllowed");
					}
					if(bEventEntered)
					{
						dArrTempDates = to._getStartAndEndDatesOfEventWithId(iSegId);
						dSegStartDate = new Date(dArrTempDates[0]);
						dSegEndDate = new Date(dArrTempDates[1]);
					}

					to._performOperationsAfterResizingStopsInDetailView(iSegId, dSegStartDate, dSegEndDate);
					to.tv.bDVResEv = false;
				}
				if(!$.CalenStyle.extra.bTouchDevice)
					to._makeEventNonEditableInDetailView();
			}
		});
	},

	_performOperationsAfterResizingStopsInDetailView: function(sId, dStartDateAfterResizing, dEndDateAfterResizing)
	{
		var to = this;
		var oResizedEvent = to.getEventWithId(sId),
		bIsAllDay = oResizedEvent.isAllDay,
		dStartDateTime = oResizedEvent.start,
		dEndDateTime = oResizedEvent.end;

		oResizedEvent.start = dStartDateAfterResizing;
		oResizedEvent.end = dEndDateAfterResizing;

		to._removeEventSegWithId(sId);
		to._createAndAddEventSegForId(sId, bIsAllDay, dStartDateAfterResizing, dEndDateAfterResizing);
		to._setPropertiesOfEventSeg();

		to.tv.oEvEdt = oResizedEvent;
		$(to.elem).find(".cdvEvent").removeClass("ui-resizable-resizing");

		to.tv.bDVResEv = false;
		if(to.setting.saveChangesOnEventResize)
			to.setting.saveChangesOnEventResize.call(to, oResizedEvent, dStartDateTime, dEndDateTime, dStartDateAfterResizing, dEndDateAfterResizing);
	},

	__adjustDetailViewTable: function()
	{
		var to = this;
		var icdvCalendarContMaxHeight = $(to.elem).find(".cdvCalendarCont").css("max-height");
		icdvCalendarContMaxHeight = parseInt(icdvCalendarContMaxHeight.replace("px", "")) || 0;
		var icdvCalendarContMinHeight = $(to.elem).find(".cdvCalendarCont").css("min-height");
		icdvCalendarContMinHeight = parseInt(icdvCalendarContMinHeight.replace("px", "")) || 0;
		var iScrollbarWidth = $.CalenStyle.extra.iScrollbarWidth;

		if(icdvCalendarContMaxHeight > 0 && $(to.elem).height() > icdvCalendarContMaxHeight)
			$(to.elem).css({"height": icdvCalendarContMaxHeight});
		else if(icdvCalendarContMinHeight > 0 && $(to.elem).height() < icdvCalendarContMinHeight)
			$(to.elem).css({"height": icdvCalendarContMinHeight});
		if(to.tv.iCalHeight !== 0)
			$(to.elem).css({"height": to.tv.iCalHeight});

		var bIsValidView = ($(to.elem).find(".cdvCalendarCont").length > 0) ? true : false;
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

			if(iScrollbarWidth > 0)
				$(to.elem).find(".cdvDetailTableScroll").css({"width": iScrollbarWidth});

			if($.cf.compareStrings(to.setting.filterBarPosition, "Right"))
				$(to.elem).find(".cFilterBar").css({"left": iCalendarContWidth});

			$(to.elem).find(".calendarCont").css("overflow", "hidden");

			var icdvContRow2Left = 0,
			icdvContRow2Width = iCalendarContWidth,
			icContHeaderWidth = iCalendarContWidth;
			if($(to.elem).find(".cContHeader").length > 0)
				$(to.elem).find(".cContHeader").css({"width": icContHeaderWidth});

			var icdvDetailTableWidth = iCalendarContWidth,
			icContHeaderHeight = ($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerHeight() : 0;

			if(to.tv.bDisABar)
				iCalendarContHeight -= $(to.elem).find(".cActionBar").height();
			if(to.tv.bDisFBar && ($.cf.compareStrings(to.setting.filterBarPosition, "Top") || $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
				iCalendarContHeight -= $(to.elem).find(".cFilterBar").height();

			var icdvDetailTableHeight = iCalendarContHeight - icContHeaderHeight;
			if(!to.tv.bDisABar || !(to.tv.bDisFBar && $.cf.compareStrings(to.setting.filterBarPosition, "Bottom")))
				icdvDetailTableHeight += $.CalenStyle.extra.iBorderOverhead;
			else
				icdvDetailTableHeight -= $.CalenStyle.extra.iBorderOverhead;
			$(to.elem).find(".cdvDetailTableMain").css({"height": icdvDetailTableHeight, "width": icdvDetailTableWidth});

			var icdvContRow2Top = $(to.elem).find(".cdvDetailTableMain").position().top + $(to.elem).find(".cdvDetailTableRow1").outerHeight();
			$(to.elem).find(".cdvContRow2Main").css({"left": icdvContRow2Left, "top": icdvContRow2Top, "width": icdvContRow2Width});

			var iBorderOverheadAllDays = to.tv.iNoVDay * $.CalenStyle.extra.iBorderOverhead;

			var icdvDetailTableColumnTimeWidth = $(to.elem).find(".cdvDetailTableColumnTime").width();
			icdvDetailTableColumnTimeWidth = (icdvDetailTableColumnTimeWidth !== 60) ? 60 : icdvDetailTableColumnTimeWidth;
			var icdvTableColumnsWidth = (icdvContRow2Width - icdvDetailTableColumnTimeWidth - iScrollbarWidth - iBorderOverheadAllDays) / (to.tv.iNoVDayDis);
			$(to.elem).find(".cdvTableColumns").css({"width": icdvTableColumnsWidth});
			$(to.elem).find(".cdvAllDayColumns").css({"width": icdvTableColumnsWidth});

			var icdvContRow3Left = 0,
			iPreviousRowsHeight = icdvContRow2Top + $(to.elem).find(".cdvContRow2Main").outerHeight(),
			icdvContRow3Top = iPreviousRowsHeight,
			icdvContRow3Height = iCalendarContHeight - iPreviousRowsHeight,
			icdvContRow3Width = iCalendarContWidth - $.CalenStyle.extra.iBorderOverhead;
			var icdvTimeSlotTableHeight = $(to.elem).find(".cdvTimeSlotTable").prop("scrollHeight");
			icdvContRow3Height = (icdvContRow3Height > icdvTimeSlotTableHeight) ? icdvTimeSlotTableHeight : icdvContRow3Height;
			$(to.elem).find(".cdvContRow3Main").css({"left": icdvContRow3Left, "top": icdvContRow3Top, "height": icdvContRow3Height, "width": icdvContRow3Width});

			if(iScrollbarWidth === 0)
				icdvContRow3Width = icdvContRow3Width + 1;
			else
            	icdvContRow3Width = (iScrollbarWidth > iBorderOverheadAllDays) ? (icdvContRow3Width - iScrollbarWidth) : (icdvContRow3Width - iBorderOverheadAllDays +iScrollbarWidth);
        	$(to.elem).find(".cdvTimeSlotTable").css({"width": icdvContRow3Width});
			$(to.elem).find(".cdvContRow3Events").css({"height": icdvTimeSlotTableHeight, "width": icdvContRow3Width});

			icdvDetailTableColumnTimeWidth = $(to.elem).find(".cdvDetailTableColumnTime").width();
			icdvDetailTableColumnTimeWidth = (icdvDetailTableColumnTimeWidth !== 60) ? 60: icdvDetailTableColumnTimeWidth;
			icdvTableColumnsWidth = (iCalendarContWidth - icdvDetailTableColumnTimeWidth - iScrollbarWidth - iBorderOverheadAllDays) / (to.tv.iNoVDayDis);
			$(to.elem).find(".cdvTableColumns").css({"width": icdvTableColumnsWidth});
			$(to.elem).find(".cdvAllDayColumns").css({"width": icdvTableColumnsWidth});
			if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
				$(to.elem).find(".cdlvDaysTable").css({"width": icdvTableColumnsWidth});

			to.tv.fDVDayWth = $(to.elem).find(".cdvTableColumns").width();
			var iTimeSlotLeft = to._getTimeSlotLeftPosition();
			if($(to.elem).find(".cdvContRow3Main .cTimeline").length > 0)
				$(to.elem).find(".cdvContRow3Main .cTimeline").css({"left": iTimeSlotLeft, "width": to.tv.fDVDayWth});

			to.tv.fADVDayLftPos = [];
			for(var iWeekDayIndex = 0; iWeekDayIndex < to.tv.iNoVDayDis; iWeekDayIndex++)
			{
				var sTempId = "#cdvCellDay"+iWeekDayIndex,
				fLeftPos = $(to.elem).find(sTempId).position().left;
				to.tv.fADVDayLftPos.push(fLeftPos);
			}

			to._adjustEventsInDetailView();
			to._adjustAllDayEventsInDetailView();
		}

		//to.__adjustFontSize();
		to.setCalendarBorderColor();
	},

	_adjustEventsInDetailView: function()
	{
		var to = this;
		var sArrEventElems = $(to.elem).find(".cdvEvent");

		for(var iElemIndex = 0; iElemIndex < sArrEventElems.length; iElemIndex++)
		{
			var oElem = sArrEventElems[iElemIndex],
			sElemName = $(to.elem).find(oElem).attr("data-pos"),
			sArrElemName = sElemName.split("|"),
			iElemCol = parseInt(sArrElemName[1]),

			$oElem =  $(to.elem).find(oElem);
			var sElemID = $oElem.attr("id"),
			iArrColumns = to._getLeftColumnAndWidthOfAnEventSegInDetailView(sElemID),
			iSegLeftColumn = iArrColumns[0],
			iSegColumns = iArrColumns[1],

			iLeftPos = to.tv.fADVDayLftPos[iElemCol],
			iTopPos = parseInt(sArrElemName[2]),
			iUnitWidth = 100 / iSegColumns,
			iEventWidth = (to.tv.fDVDayWth * iUnitWidth) / 100;

			iLeftPos = iLeftPos + ((iSegLeftColumn - 1) * iEventWidth);
			iEventWidth -= (0.05 * iEventWidth);
			$oElem.css({"left": iLeftPos, "top": iTopPos, "width": iEventWidth});
			if(iTopPos < 0)
				$oElem.find(".cEventLink").css({"margin-top": Math.abs(iTopPos)});

			var iEventHeight = $oElem.height(),
			iEventTimeHeight = $oElem.find(".cdvEventTime").height(),
			iEventTitleHeight = iEventHeight - iEventTimeHeight - 10,
			iEventTitleMinHeight = $oElem.find(".cdvEventTitle").css("min-height");
			iEventTitleMinHeight = $.cf.isValid(iEventTitleMinHeight) ? parseInt(iEventTitleMinHeight.replace("px", "")) : 0;

			if(iEventTitleMinHeight < iEventTitleHeight)
				$oElem.find(".cdvEventTitle").css({"max-height": iEventTitleHeight});
		}

		to._makeEventEditableInDetailView(".cdvEvent");
	},

	_displayWeekNumberInDetailView: function()
	{
		var to = this;
		var sWeekNumber = to.__getWeekNumber(to.tv.dVSDt, to.tv.dVEDt);
		$(to.elem).find(".cdvCellWeekNumberLabel").html(to.setting.miscStrings.week);
		$(to.elem).find(".cdvCellWeekNumber").html(sWeekNumber);
	},

	_setDateStringsInDetailView: function()
	{
		var to = this;

		var oDVStart = to.getDateInFormat({"date": to.tv.dVSDt}, "object", false, true),
		oDVEnd = to.getDateInFormat({"date": to.tv.dVEDt}, "object", false, true);

		var sHeaderViewLabel;
		if($.cf.compareStrings(to.setting.visibleView, "DayView") || ($.cf.compareStrings(to.setting.visibleView, "CustomView") && to.setting.daysInCustomView === 1))
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

		for(var iDateIndex = 0; iDateIndex < to.tv.iNoVDayDis; iDateIndex++)
		{
			var dTempDate = to.tv.dAVDt[iDateIndex],
			bFullDateMatched = to.compareDates(dTempDate, $.CalenStyle.extra.dToday),

			/* -------------------------- Table Row 1 Start ------------------------------- */
			iDayOfWeek = dTempDate.getDay(),
			sTempId = ".cdvDetailTableMain #cdvCellDay"+iDateIndex,
			iDay = dTempDate.getDate(),
			bWeekDayUnavailable = to.tv.bABsDays[iDayOfWeek] ? false : true,

			bArrTemp = to.tv.bADVCur[iDateIndex],
			bTemp = bArrTemp[24 * to.tv.iUTmSlt];

			if(bWeekDayUnavailable && bFullDateMatched === 0)
				$(to.elem).find(sTempId).addClass("cRestrictedTodayBg cTodayHighlightTextColor");
			else
			{
				if(bWeekDayUnavailable)
					$(to.elem).find(sTempId).addClass("cNonBusinessHoursBg");
				if(bFullDateMatched === 0)
					$(to.elem).find(sTempId).addClass("cTodayHighlightTextColor");
			}

			if(bFullDateMatched === 0)
				$(to.elem).find(sTempId).html("<span class='cdvCellDayLeft'>"+to.setting.miscStrings.today+"</span><span class='cdvCellDayRight'>" + to.getNumberStringInFormat(iDay, 0, true) + "</span>");
			else
				$(to.elem).find(sTempId).html("<span class='cdvCellDayLeft'>" + to.getDateInFormat({"iDate": {D: iDayOfWeek}}, "DDD", false, true) + "</span><span class='cdvCellDayRight'>" + to.getNumberStringInFormat(iDay, 0, true) + "</span>");

			/* -------------------------- Table Row 1 End ------------------------------- */

			/* -------------------------- Table Row 2 Start ---------------------------- */
			if(bWeekDayUnavailable && bFullDateMatched === 0)
				$(to.elem).find(".cdvDetailTableMain #cdvAllDayColumn"+iDateIndex).addClass("cRestrictedTodayBg cTodayHighlightTextColor");
			else
			{
				if(bWeekDayUnavailable)
					$(to.elem).find(".cdvDetailTableMain #cdvAllDayColumn"+iDateIndex).addClass("cNonBusinessHoursBg");
				if(bFullDateMatched === 0)
					$(to.elem).find(".cdvDetailTableMain #cdvAllDayColumn"+iDateIndex).addClass("cTodayHighlightTextColor");
				if(bTemp === 2)
					$(to.elem).find(".cdvDetailTableMain #cdvAllDayColumn"+iDateIndex).addClass("cRestrictedSectionBg");
			}
			/* -------------------------- Table Row 2 End ------------------------------- */

			/* -------------------------- Table Row 3 Start ---------------------------- */
			if(bWeekDayUnavailable && bFullDateMatched === 0)
				$(to.elem).find(".cdvDetailTableMain .cdvDetailTableColumn"+iDateIndex).addClass("cRestrictedTodayBg cTodayHighlightTextColor");
			else
			{
				if(bWeekDayUnavailable)
					$(to.elem).find(".cdvDetailTableMain .cdvDetailTableColumn"+iDateIndex).addClass("cNonBusinessHoursBg");
				if(bFullDateMatched === 0)
					$(to.elem).find(".cdvDetailTableMain .cdvDetailTableColumn"+iDateIndex).addClass("cTodayHighlightTextColor");
			}
			/* -------------------------- Table Row 3 End ------------------------------- */
		}

		if($.cf.compareStrings(to.setting.visibleView, "WeekView"))
			to._displayWeekNumberInDetailView();
	},

	__goToPrevDetailView: function()
	{
		var to = this;

		if(to.setting.showTransition)
		{
			//-----------------------------------------------------------------------------------
			var $occCDVDetailTableMain = $(to.elem).find(".cdvDetailTableMain"),
			icdvDetailTableWidth = $occCDVDetailTableMain.width(),
			icdvDetailTableLeft = $occCDVDetailTableMain.position().left,
			icdvDetailTableTop = 0;
			if($(to.elem).find(".cContHeader").length > 0)
				icdvDetailTableTop = $(to.elem).find(".cContHeader").position().top +  $(to.elem).find(".cContHeader").outerHeight() - 1;
			else
				icdvDetailTableTop = $(to.elem).position().top;

			var newElem = $occCDVDetailTableMain.clone();
			$(newElem).removeClass("cdvDetailTableMain").addClass("cdvDetailTableTemp");
			$(newElem).css({"position": "absolute", "top": icdvDetailTableTop, "left": icdvDetailTableLeft});
			$occCDVDetailTableMain.parent().append(newElem);

			icdvDetailTableLeft = icdvDetailTableLeft + icdvDetailTableWidth;

			//-----------------------------------------------------------------------------------

			$(to.elem).find(".cdvDetailTableTemp .cdlvDaysTableMain").removeClass("cdlvDaysTableMain").addClass("cdlvDaysTableTemp");

			//-----------------------------------------------------------------------------------

			var $occCDVContRow2Main = $(to.elem).find(".cdvContRow2Main"),
			icdvContRow2Left = $occCDVContRow2Main.position().left,
			icdvContRow2Width= $occCDVContRow2Main.width();

			var newElemCont2 = $occCDVContRow2Main.clone();
			$(newElemCont2).removeClass(".cdvContRow2Main").addClass("cdvContRow2Temp");
			$occCDVContRow2Main.parent().append(newElemCont2);

			icdvContRow2Left = icdvContRow2Left + icdvContRow2Width;

			//-----------------------------------------------------------------------------------
			var $occCDVContRow3Main = $(to.elem).find(".cdvContRow3Main"),
			icdvContRow3Left = $occCDVContRow3Main.position().left,
			icdvContRow3Width= $occCDVContRow3Main.width();

			var newElemCont3 = $occCDVContRow3Main.clone();
			$(newElemCont3).removeClass(".cdvContRow3Main").addClass("cdvContRow3Temp");
			$occCDVContRow3Main.parent().append(newElemCont3);

			icdvContRow3Left = icdvContRow3Left + icdvContRow3Width;

			//-----------------------------------------------------------------------------------

			$(to.elem).find(".cdvContRow3Main .cTimeline").remove();
			if(!$.CalenStyle.extra.bTouchDevice && $(to.elem).find(".cdvContRow3Temp .cTimeIndicator").length > 0)
			{
				var iTimeSlotTop = $(to.elem).find(".cdvContRow3Temp .cTimeIndicator").position().top;
				var iScrollTop = iTimeSlotTop - ($(to.elem).find(".cdvContRow3Temp").height() / 2);
				$(to.elem).find(".cdvContRow3Temp").scrollTop(iScrollTop);
			}

			//-----------------------------------------------------------------------------------

			$(newElem).animate({"left": icdvDetailTableLeft}, to.setting.transitionSpeed);
			$(newElemCont2).animate({"left": icdvContRow2Left}, to.setting.transitionSpeed);
			$(newElemCont3).animate({"left": icdvContRow3Left}, to.setting.transitionSpeed);

			setTimeout(function()
			{
				$(to.elem).find(".cdvDetailTableTemp").remove();
				$(to.elem).find(".cdvContRow2Temp").remove();
				$(to.elem).find(".cdvContRow3Temp").remove();

			}, to.setting.transitionSpeed);

			//-----------------------------------------------------------------------------------
		}

		if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
		{
			var iNoOfDays = to.tv.iNoVDay + 1,
			oArrDates = to.__setCurrentViewDatesArray(iNoOfDays, to.tv.dVSDt, null, "Prev");
			oArrDates.shift();
			oArrDates.reverse();
			to.setting.selectedDate = oArrDates[to.tv.iSelDay];
			to.setting.selectedDate = to.setDateInFormat({"date": to.setting.selectedDate}, "START");
		}
		else
		{
			var iCurrentDateMS = to.tv.dVSDt.getTime();
			if(to.setting.daysInCustomView === 7)
				iCurrentDateMS -= (to.tv.iNoVDay * $.CalenStyle.extra.iMS.d);
			else
				iCurrentDateMS -= $.CalenStyle.extra.iMS.d;
			to.setting.selectedDate = to.setDateInFormat({"date": new Date(iCurrentDateMS)}, "START");
		}
		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.sLoadType = "Prev";
		to.__reloadCurrentView(true, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	__goToNextDetailView: function()
	{
		var to = this;

		if(to.setting.showTransition)
		{
			//-----------------------------------------------------------------------------------
			var $occCDVDetailTableMain = $(to.elem).find(".cdvDetailTableMain"),
			icdvDetailTableWidth = $occCDVDetailTableMain.width(),
			icdvDetailTableLeft = $occCDVDetailTableMain.position().left,
			icdvDetailTableTop = 0;
			if($(to.elem).find(".cContHeader").length > 0)
				icdvDetailTableTop = $(to.elem).find(".cContHeader").position().top +  $(to.elem).find(".cContHeader").outerHeight() - 1;
			else
				icdvDetailTableTop = $(to.elem).position().top;

			var newElem = $occCDVDetailTableMain.clone();
			$(newElem).removeClass("cdvDetailTableMain").addClass("cdvDetailTableTemp");
			$(newElem).css({"position": "absolute", "top": icdvDetailTableTop, "left": icdvDetailTableLeft});
			$occCDVDetailTableMain.parent().append(newElem);

			icdvDetailTableLeft = icdvDetailTableLeft - icdvDetailTableWidth;

			//-----------------------------------------------------------------------------------

			$(to.elem).find(".cdvDetailTableTemp .cdlvDaysTableMain").removeClass("cdlvDaysTableMain").addClass("cdlvDaysTableTemp");

			//-----------------------------------------------------------------------------------

			var $occCDVContRow2Main = $(to.elem).find(".cdvContRow2Main"),
			icdvContRow2Left = $occCDVContRow2Main.position().left,
			icdvContRow2Width= $occCDVContRow2Main.width();

			var newElemCont2 = $occCDVContRow2Main.clone();
			$(newElemCont2).removeClass(".cdvContRow2Main").addClass("cdvContRow2Temp");
			$occCDVContRow2Main.parent().append(newElemCont2);

			icdvContRow2Left = icdvContRow2Left - icdvContRow2Width;

			//-----------------------------------------------------------------------------------
			var $occCDVContRow3Main = $(to.elem).find(".cdvContRow3Main"),
			icdvContRow3Left = $occCDVContRow3Main.position().left,
			icdvContRow3Width= $occCDVContRow3Main.width();

			var newElemCont3 = $occCDVContRow3Main.clone();
			$(newElemCont3).removeClass(".cdvContRow3Main").addClass("cdvContRow3Temp");
			$occCDVContRow3Main.parent().append(newElemCont3);

			icdvContRow3Left = icdvContRow3Left - icdvContRow3Width;

			//-----------------------------------------------------------------------------------

			$(to.elem).find(".cdvContRow3Main .cTimeline").remove();

			if(!$.CalenStyle.extra.bTouchDevice && $(to.elem).find(".cdvContRow3Temp .cTimeIndicator").length > 0)
			{
				var iTimeSlotTop = $(to.elem).find(".cdvContRow3Temp .cTimeIndicator").position().top;
				var iScrollTop = iTimeSlotTop - ($(to.elem).find(".cdvContRow3Temp").height() / 2);
				$(to.elem).find(".cdvContRow3Temp").scrollTop(iScrollTop);
			}

			//-----------------------------------------------------------------------------------

			$(newElem).animate({"left": icdvDetailTableLeft}, to.setting.transitionSpeed);
			$(newElemCont2).animate({"left": icdvContRow2Left}, to.setting.transitionSpeed);
			$(newElemCont3).animate({"left": icdvContRow3Left}, to.setting.transitionSpeed);

			setTimeout(function()
			{
				$(to.elem).find(".cdvDetailTableTemp").remove();
				$(to.elem).find(".cdvContRow2Temp").remove();
				$(to.elem).find(".cdvContRow3Temp").remove();
			}, to.setting.transitionSpeed);

			//-----------------------------------------------------------------------------------
		}

		if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
		{
			var iNoOfDays = to.tv.iNoVDay + 1,
			oArrDates = to.__setCurrentViewDatesArray(iNoOfDays, to.tv.dVEDt, null, "Next");
			oArrDates.shift();
			to.setting.selectedDate = oArrDates[to.tv.iSelDay];
			to.setting.selectedDate = to.setDateInFormat({"date": to.setting.selectedDate}, "START");
		}
		else
		{
			var iCurrentDateMS = to.tv.dVEDt.getTime();
			iCurrentDateMS += $.CalenStyle.extra.iMS.d;
			to.setting.selectedDate = to.setDateInFormat({"date": new Date(iCurrentDateMS)}, "START");
		}
		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.sLoadType = "Next";
		to.__reloadCurrentView(true, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	_showCurrentTimeIndicator: function()
	{
		var to = this;
		var bOCalenStyleExists = false, oTimeOut;
		for(var iTempIndex = 0; iTempIndex < $.CalenStyle.extra.oArrCalenStyle.length; iTempIndex++)
		{
			var oThisCalenStyle = $.CalenStyle.extra.oArrCalenStyle[iTempIndex];
			if(oThisCalenStyle.tv.pluginId === to.tv.pluginId)
			{
				bOCalenStyleExists = true;
				break;
			}
		}

		if(bOCalenStyleExists)
		{
			var iUnitTimeSlotHeight = Math.floor((($(to.elem).find(".cdvTimeSlotTableRow" + ":eq(0)").outerHeight() + $(to.elem).find(".cdvTimeSlotTableRow" + ":eq(1)").outerHeight()) / 2) / to.setting.unitTimeInterval);
			if($.cf.compareStrings(to.setting.visibleView, "WeekView") || $.cf.compareStrings(to.setting.visibleView, "DayView") || $.cf.compareStrings(to.setting.visibleView, "CustomView") || $.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
			{
				var dCurrentTime = to._getCurrentDate(),
				iCurrentHours = dCurrentTime.getHours(),
				iCurrentMinutes = dCurrentTime.getMinutes(),
				iCurrentMinutesOverhead = (iCurrentMinutes % to.setting.unitTimeInterval),
				iCurrentMinutesOverheadHeight = iUnitTimeSlotHeight * iCurrentMinutesOverhead;
				iCurrentMinutes = iCurrentMinutes - iCurrentMinutesOverheadHeight;
				var sCurrentHour = to.getNumberStringInFormat(iCurrentHours, 2, false),
				sCurrentMinutes = to.getNumberStringInFormat(iCurrentMinutes, 2, false),
				sTimeSlotClass = ".cdvContRow3Main .cdvTimeSlotTableRow"+sCurrentHour+sCurrentMinutes;

				if($(to.elem).find(sTimeSlotClass).length > 0)
				{
					var iTimeSlotTop = $(to.elem).find(sTimeSlotClass).position().top,
					iTimeSlotLeft = 0,
					iTimeSlotWidth = 0,
					sTemplate;
					if(to.tv.fDVDayWth > 0)
						iTimeSlotWidth = to.tv.fDVDayWth;
					iTimeSlotTop += iCurrentMinutesOverheadHeight;

					var bShowTimeline = $.cf.compareStrings(to.setting.visibleView, "DayEventDetailView") ? (to.compareDates(to.setting.selectedDate, $.CalenStyle.extra.dToday) === 0) : (to.__isDateInCurrentView(dCurrentTime));
					if(bShowTimeline)
					{
						iTimeSlotLeft = to._getTimeSlotLeftPosition();
						if($(to.elem).find(".cdvContRow3Main .cTimeline").length > 0)
							$(to.elem).find(".cdvContRow3Main .cTimeline").css({"left": iTimeSlotLeft, "top": iTimeSlotTop, "width": iTimeSlotWidth});
						else
						{
							sTemplate = "<div class='cTimeline'></div>";
							$(to.elem).find(".cdvContRow3Main .cdvTimeSlotTable").append(sTemplate);
							$(to.elem).find(".cdvContRow3Main .cTimeline").css({"left": iTimeSlotLeft, "top": iTimeSlotTop, "width": iTimeSlotWidth});
						}
					}
					else
						$(to.elem).find(".cdvContRow3Main .cTimeline").remove();

					if($(to.elem).find(".cdvContRow3Main .cTimeIndicator").length > 0)
						$(to.elem).find(".cdvContRow3Main .cTimeIndicator").css({"top": iTimeSlotTop});
					else
					{
						sTemplate = "<div class='cTimeIndicator'></div>";
						$(to.elem).find(".cdvContRow3Main .cdvTimeSlotTable").append(sTemplate);
						$(to.elem).find(".cdvContRow3Main .cTimeIndicator").css({"top": iTimeSlotTop});
					}

					if(!$.CalenStyle.extra.bTouchDevice)
					{
						setTimeout(function()
						{
							var iScrollTop = iTimeSlotTop - ($(to.elem).find(".cdvContRow3Main").height() / 2);
								$(to.elem).find(".cdvContRow3Main").scrollTop(iScrollTop);
						}, 500);
					}
				}

				oTimeOut = setTimeout(function()
				{
					to._showCurrentTimeIndicator();
				}, ($.CalenStyle.extra.iMS.m * to.setting.timeIndicatorUpdationInterval));
			}
			bOCalenStyleExists = false;
		}
		else
		{
			clearTimeout(oTimeOut);
		}
	},

	_getTimeSlotLeftPosition: function()
	{
		var to = this;
		var iTimeSlotLeft = 0;
		if(to.tv.fADVDayLftPos.length > 0)
		{
			for(var iWkDatesIndex = 0; iWkDatesIndex < to.tv.dAVDt.length; iWkDatesIndex++)
			{
				if(to.compareDates($.CalenStyle.extra.dToday, to.tv.dAVDt[iWkDatesIndex]) === 0)
				{
					if($.cf.compareStrings(to.setting.visibleView, "DayEventDetailView"))
						iTimeSlotLeft = to.tv.fADVDayLftPos[0];
					else
						iTimeSlotLeft = to.tv.fADVDayLftPos[iWkDatesIndex];
					break;
				}
			}
		}
		return iTimeSlotLeft;
	},

	_addTooltipInDetailView: function()
	{
		var to = this;
		$(to.elem).find(".cEventTooltip").tooltip(
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
					var sId = $(this).attr("data-id"),
					oEventRecord = to.getEventWithId(sId);
					sTooltipText = to.setting.eventTooltipContent.call(to, oEventRecord);
				}
				return sTooltipText;
			},

			position:
			{
				my: "left-25 bottom-15",
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
			},

			track: true
		});
	}

});

/*! ------------------------------------ CalenStyle Detail View End ------------------------------------ */
