/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

/*! ---------------------------------- CalenStyle Agenda View Start --------------------------------- */

//"use strict";

CalenStyle.prototype = $.extend(CalenStyle.prototype, {

	// Public Method
	updateAgendaView: function(bLoadAllData)
	{
		var to = this;

		var iTempIndex, iEventIndex,
		dTempViewDate, dTempViewStartDate, dTempViewEndDate, oAEventsForView,
		iNumOfDays = to.tv.dAVDt.length,
		bHideEventIcon = $.cf.isValid(to.setting.hideEventIcon[to.setting.visibleView]) ? to.setting.hideEventIcon[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventIcon.Default) ? to.setting.hideEventIcon.Default : false,
		bHideEventTime = $.cf.isValid(to.setting.hideEventTime[to.setting.visibleView]) ? to.setting.hideEventTime[to.setting.visibleView] : $.cf.isValid(to.setting.hideEventTime.Default) ? to.setting.hideEventTime.Default : false;

		to.__getCurrentViewDates();
		if($.cf.compareStrings(to.tv.sLoadType, "Prev"))
			to.tv.dLoadDt = to.tv.dAVDt[0];
		else if($.cf.compareStrings(to.tv.sLoadType, "Next"))
			to.tv.dLoadDt = to.tv.dAVDt[(iNumOfDays - 1)];

		to._setDateStringsInHeaderOfAgendaView();

		to.__parseData(bLoadAllData, function()
		{
			var iEventId = 0, sSelectedDateElemId,
			sFullDate, sDateId, iColspan, sTemplate, bIsToday, sDateClass = "", sDayClass = "",
			oEvent = null, dStartDateTime = null, dEndDateTime = null,
			bIsAllDay = 0, sTitle = "",  sURL = "", sDesc = "", bIsMarked = false,
			sArrEventDateTime = null, sEventDateTime = null,
			sEventColor = "", sEventBorderColor = "", sEventTextColor = "",
			sStyle = "", sStyleColorHeight = "", sIcon = "", sEventDetailsStyle = "",
			sEventIconStyle = "", sEventBorderStyle = "", sEventBeforeStyle = "",
			sId = "", sIdElem = "", sEventClass = "",
			$oDateElem;

			if(to.setting.displayEventsForPeriodInListInAgendaView)
			{
				var oViewDetails = {};
				oViewDetails.viewStartDate = to.tv.dVSDt;
				oViewDetails.viewEndDate = to.tv.dVEDt;

				var iEventCount = 0;
				var oDateList = [];
				for(iTempIndex = 0; iTempIndex < iNumOfDays; iTempIndex++)
				{
					dTempViewDate = to.tv.dAVDt[iTempIndex];
					dTempViewStartDate = to.setDateInFormat({"date": dTempViewDate}, "START");
					dTempViewEndDate = to.setDateInFormat({"date": dTempViewDate}, "END");
					oAEventsForView = to.getArrayOfEventsForView(dTempViewStartDate, dTempViewEndDate);
					var oDate = {};
					oDate.date = dTempViewStartDate;

					var oEventList = [];
					for(iEventIndex = 0; iEventIndex < oAEventsForView.length; iEventIndex++)
					{
						oEventList.push(oAEventsForView[iEventIndex]);
						iEventCount++;
					}

					oDate.events = oEventList;
					oDateList.push(oDate);
				}

				oViewDetails.eventCount = iEventCount;
				oViewDetails.eventList = oDateList;

				sTemplate = to.setting.displayEventsForPeriodInListInAgendaView.call(to, oViewDetails);
				$(to.elem).find(".cListOuterCont").html(sTemplate);
			}
			else
			{
				if(iNumOfDays > 0)
				{
					if(to.compareDates(to.setting.selectedDate, to.tv.dAVDt[0]) >= 0 || to.compareDates(to.setting.selectedDate, to.tv.dAVDt[iNumOfDays - 1]) <= 0)
						sSelectedDateElemId = "#Date-" + to.getDateInFormat({"date": to.setting.selectedDate}, "dd-MM-yyyy", false, true);
				}

				if($.cf.compareStrings(to.setting.agendaViewTheme, "Timeline1"))
				{
					$(to.elem).find(".cListOuterCont").html("<table class='cagvTable'></table>");

					iColspan = 4;
					if(bHideEventIcon)
						iColspan--;
					if(bHideEventTime)
						iColspan--;

					for(iTempIndex = 0; iTempIndex < iNumOfDays; iTempIndex++)
					{
						dTempViewDate = to.tv.dAVDt[iTempIndex];
						dTempViewStartDate = to.setDateInFormat({"date": dTempViewDate}, "START");
						dTempViewEndDate = to.setDateInFormat({"date": dTempViewDate}, "END");
						oAEventsForView = to.getArrayOfEventsForView(dTempViewStartDate, dTempViewEndDate);
						bIsToday = (to.compareDates(dTempViewDate, $.CalenStyle.extra.dToday) === 0);

						sFullDate = to.getDateInFormat({"date": dTempViewStartDate}, "dd-MM-yyyy", false, true);
						sDateId = "Date-" + sFullDate;
						sDateClass = bIsToday ? "cagvDate cagvDateToday" : "cagvDate";

						if(iTempIndex === 0 && sSelectedDateElemId === undefined)
							sSelectedDateElemId = "#" + sDateId;

						if(oAEventsForView.length !== 0)
						{
							$(to.elem).find(".cagvTable").append("<tr><td colspan='"+iColspan+"'><div id='" + sDateId + "' class='" + sDateClass + "'>" + to.getDateInFormat({"date": dTempViewStartDate}, "DDDD MMMM dd yyyy", false, true) + "</div></td></tr>");

							for(iEventIndex = 0; iEventIndex < oAEventsForView.length; iEventIndex++)
							{
								oEvent = oAEventsForView[iEventIndex];

								dStartDateTime = null; dEndDateTime = null;
								bIsAllDay = 0; sTitle = "";  sURL = ""; sEventColor = ""; sDesc = "";
								sId = ""; sIdElem = "";
								sEventColor = ""; sEventBorderColor = ""; sEventTextColor = "";
								sStyle = ""; sStyleColorHeight = ""; sIcon = ""; sEventDetailsStyle = ""; sEventIconStyle = "";

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

								sArrEventDateTime = to.getEventDateTimeDataForAgendaView(dStartDateTime, dEndDateTime, bIsAllDay, dTempViewStartDate);
								sEventDateTime = sArrEventDateTime[0];
								if(sEventDateTime === "")
									sEventDateTime = to.setting.miscStrings.allDay;

								sEventColor = oEvent.fromSingleColor ? oEvent.textColor : oEvent.backgroundColor;
								sEventColor = ($.cf.compareStrings(sEventColor, "") || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;
								sId = "Event" + (++iEventId);
								sStyleColorHeight = sArrEventDateTime[1];
								sEventIconStyle = "background: " + sEventColor + "; ";

								if(bIsMarked)
								{
									sEventBeforeStyle = "border-right: 12px solid " + sEventColor;
									sEventBorderStyle = "border-color: " + sEventColor + ";";
								}
								else
								{
									sEventBeforeStyle = "";
									sEventBorderStyle = "";
								}

								sEventClass = "cagvEvent";
								if(bIsMarked)
								{
									sEventClass += " cMarkedDayEvent";
									sIcon = ($.cf.isValid(oEvent.icon) && oEvent.icon !== "Dot") ? oEvent.icon : "cs-icon-Mark";
								}
								else
									sIcon = $.cf.isValid(oEvent.icon) ? oEvent.icon : to.setting.eventIcon;

								sTemplate = "";
								sTemplate += "<tr id='" + sId + "' class='cagvEvent'>";

								if(bIsMarked)
								{
									sTemplate += "<td class='cagvEventIcon'><span class='cagvEventIconLine'></span><span class='cagvEventIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span></td>";
								}
								else
								{
									if(!bHideEventIcon)
									{
										if($.cf.compareStrings(sIcon, "Dot"))
											sTemplate += "<td class='cagvEventIcon'><span class='cagvEventIconLine'></span><span class='cagvEventIconDot' style='" + sEventIconStyle + "'></span></td>";
										else
											sTemplate += "<td class='cagvEventIcon'><span class='cagvEventIconLine'></span><span class='cagvEventIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span></td>";
									}
								}

								sTemplate += "<td class='cagvContDetails'>";

								sTemplate += "<div class='cagvEventCard' style='" + sEventBorderStyle + "'>";

								sTemplate += "<span class='cagvEventCardBefore' style='" + sEventBeforeStyle + "'></span>";

								if(!bHideEventTime)
									sTemplate += "<div class='cagvEventTime'>" + sEventDateTime + "</div>";

								sTemplate += "<div class='cagvEventContent'>";

								sTemplate += "<div class='cagvEventTitle'>" + sTitle + "</div>";
								sTemplate += "<div class='cagvEventDesc'>" + sDesc + "</div>";

								sTemplate += "</div>";

								sTemplate += "</div>";

								sTemplate += "</td>";
								sTemplate += "</tr>";

								$(to.elem).find(".cagvTable").append(sTemplate);

								if(bIsMarked)
								{
									$oDateElem = $(to.elem).find("#"+sDateId);
									if($oDateElem.find(".cMarkedDayIndicator").length === 0)
										$oDateElem.append("<span class='cMarkedDayIndicator cs-icon-Mark'></span>");
								}

								if($.cf.isValid(sURL) || to.setting.eventClicked)
								{
									sIdElem = "#"+sId;
									$(to.elem).find(sIdElem).on($.CalenStyle.extra.sClickHandler, {"url": sURL, "eventId": oEvent.calEventId, "eventElemSelector": sIdElem, "view": "AgendaView", "pluginId": to.tv.pluginId}, to.__bindClick);
								}
							}
						}
						else if(to.setting.showDaysWithNoEventsInAgendaView)
						{
							sTemplate = "<tr><td colspan='"+iColspan+"'><div id='" + sDateId + "' class='" + sDateClass + "'>" + to.getDateInFormat({"date": dTempViewStartDate}, "DDDD MMMM dd yyyy", false, true) + "</div></td></tr>";
							sTemplate += "<tr><td colspan='"+iColspan+"'><div class='cagvNoEvent'>No Events</div></td></tr>";
							$(to.elem).find(".cagvTable").append(sTemplate);
						}
					}
				}
				else if($.cf.compareStrings(to.setting.agendaViewTheme, "Timeline2"))
				{
					$(to.elem).find(".cListOuterCont").html("<table class='cagvTable'></table>");

					for(iTempIndex = 0; iTempIndex < iNumOfDays; iTempIndex++)
					{
						dTempViewDate = to.tv.dAVDt[iTempIndex];
						dTempViewStartDate = to.setDateInFormat({"date": dTempViewDate}, "START");
						dTempViewEndDate = to.setDateInFormat({"date": dTempViewDate}, "END");
						oAEventsForView = to.getArrayOfEventsForView(dTempViewStartDate, dTempViewEndDate);
						bIsToday = (to.compareDates(dTempViewDate, $.CalenStyle.extra.dToday) === 0);
						var bAddedDate = false;

						sFullDate = to.getDateInFormat({"date": dTempViewStartDate}, "dd-MM-yyyy", false, true);
						sDateId = "Date-" + sFullDate;

						sDateClass = bIsToday ? "cagvDate cagvDateToday" : "cagvDate";
						sDayClass = bIsToday ? "cagvDay cagvDateToday" : "cagvDay";

						if(iTempIndex === 0 && sSelectedDateElemId === undefined)
							sSelectedDateElemId = "#" + sDateId;

						if(oAEventsForView.length !== 0)
						{
							for(iEventIndex = 0; iEventIndex < oAEventsForView.length; iEventIndex++)
							{
								oEvent = oAEventsForView[iEventIndex];

								dStartDateTime = null; dEndDateTime = null;
								bIsAllDay = 0; sTitle = "";  sURL = ""; sEventColor = ""; sDesc = "";
								sId = ""; sIdElem = "";
								sEventColor = ""; sEventBorderColor = ""; sEventTextColor = "";
								sStyle = ""; sStyleColorHeight = ""; sIcon = ""; sEventDetailsStyle = ""; sEventIconStyle = "";

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

								sEventColor = oEvent.backgroundColor;
								sEventColor = ($.cf.compareStrings(sEventColor, "") || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;
								sEventBorderColor = oEvent.borderColor || $.cf.addHashToHexcode(to.setting.borderColor);
								sEventBorderColor = ($.cf.compareStrings(sEventBorderColor, "") || $.cf.compareStrings(sEventBorderColor, "transparent")) ? "transparent" : sEventBorderColor;
								sEventTextColor = oEvent.textColor || $.cf.addHashToHexcode(to.setting.textColor);
								sEventTextColor = ($.cf.compareStrings(sEventTextColor, "") || $.cf.compareStrings(sEventTextColor, "transparent")) ? $.cf.addHashToHexcode(to.setting.textColor) : sEventTextColor;

								sStyle = "background: " + sEventColor + "; border-color: " + sEventBorderColor + "; color: " + sEventTextColor + "; ";
								if(sEventBorderColor === "transparent")
									sStyle += "border-width: 0px; ";

								sArrEventDateTime = to.getEventDateTimeDataForAgendaView(dStartDateTime, dEndDateTime, bIsAllDay, dTempViewStartDate);
								sEventDateTime = sArrEventDateTime[0];
								if(sEventDateTime === "")
									sEventDateTime = to.setting.miscStrings.allDay;

								sId = "Event" + (++iEventId);
								sStyleColorHeight = sArrEventDateTime[1];

								if(bIsMarked)
								{
									sEventDetailsStyle =  "color: " + sEventTextColor + "; border-color: " + sEventBorderColor + "; background: " + sEventColor + "; ";
									if(oEvent.fromSingleColor)
										sEventIconStyle = "background: " + sEventTextColor;
									else
										sEventIconStyle = "color: " + sEventTextColor + "; background: " + sEventColor;
								}
								else
								{
									sEventDetailsStyle =  "color: " + sEventTextColor + "; border-color: " + sEventBorderColor + "; background: " + sEventColor + "; ";
									sEventIconStyle = "color: " + sEventTextColor + "; ";
								}

								sTemplate = "";
								sTemplate += "<tr id='" + sId + "'>";

								sTemplate += "<td id='" + sDateId + "' class='cagvContDate'>";
								if(!bAddedDate)
								{
									sTemplate += "<div class='"+sDateClass+"'>" + to.getDateInFormat({"date": dTempViewDate}, "d", false, true) + "</div>";
									sTemplate += "<div class='"+sDayClass+"'>" + to.getDateInFormat({"date": dTempViewDate}, "DDD", false, true) + "</div>";
									bAddedDate = true;
								}
								sTemplate += "</td>";

								sEventClass = "cagvEvent";
								if(bIsMarked)
								{
									sEventClass += " cMarkedDayEvent";
									sIcon = ($.cf.isValid(oEvent.icon) && oEvent.icon !== "Dot") ? oEvent.icon : "cs-icon-Mark";
								}
								else
									sIcon = $.cf.isValid(oEvent.icon) ? oEvent.icon : to.setting.eventIcon;

								sTemplate += "<td class='" + sEventClass + "'>";
								sTemplate += "<div class='cagvContDetails' style='" + sEventDetailsStyle + "'>";
								sTemplate += "<div class='cagvContTitle'>";

								if(bIsMarked)
								{
									sTemplate += "<span class='cagvEventIcon cagvEventIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span>";
									sTemplate += "<span class='cagvEventTitle'>" + sTitle + "</span>";
									sTemplate += "</div>";
								}
								else
								{
									if(!bHideEventIcon)
									{
										if($.cf.compareStrings(sIcon, "Dot"))
										{
											sEventIconStyle = "background: " + sEventTextColor + "; ";
											sTemplate += "<span class='cagvEventIcon cagvEventIconDot' style='" + sEventIconStyle + "'></span>";
										}
										else
											sTemplate += "<span class='cagvEventIcon cagvEventIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span>";
									}

									sTemplate += "<span class='cagvEventTitle'>" + sTitle + "</span>";
									sTemplate += "</div>";

									sTemplate += "<div class='cagvContTime'>";
									if(!bHideEventTime)
										sTemplate += "<span class='cagvEventTime'>" + sEventDateTime + "</span>";
									sTemplate += "</div>";
								}

								sTemplate += "</div>";
								sTemplate += "</td>";

								sTemplate += "</tr>";

								if(iEventIndex === (oAEventsForView.length - 1))
								{
									sTemplate += "<tr><td class='cagvDaySeparator' colspan='2'><hr/></td></tr>";
								}

								$(to.elem).find(".cagvTable").append(sTemplate);

								sIdElem = "#"+sId;
								$(to.elem).find(sIdElem + " .cagvEventTimeLabel").css({"background": sEventTextColor});
								if($.cf.isValid(sURL) || to.setting.eventClicked)
								{
									$(to.elem).find(sIdElem).on($.CalenStyle.extra.sClickHandler, {"url": sURL, "eventId": oEvent.calEventId, "eventElemSelector": sIdElem, "view": "AgendaView", "pluginId": to.tv.pluginId}, to.__bindClick);
								}
							}
						}
						else if(to.setting.showDaysWithNoEventsInAgendaView)
						{
							sTemplate = "";
							sTemplate += "<tr>";

							sTemplate += "<td id='" + sDateId + "' class='cagvContDate'>";
							if(!bAddedDate)
							{
								sTemplate += "<div class='cagvDate'>" + to.getDateInFormat({"date": dTempViewDate}, "d", false, true) + "</div>";
								sTemplate += "<div class='cagvDay'>" + to.getDateInFormat({"date": dTempViewDate}, "DDD", false, true) + "</div>";
								bAddedDate = true;
							}
							sTemplate += "</td>";
							sTemplate += "<td class='cagvNoEvent'>No Events</td>";
							sTemplate += "</tr>";

							sTemplate += "<tr><td class='cagvDaySeparator' colspan='2'><hr/></td></tr>";

							$(to.elem).find(".cagvTable").append(sTemplate);
						}
					}
				}
				else if($.cf.compareStrings(to.setting.agendaViewTheme, "Timeline3"))
				{
					$(to.elem).find(".cListOuterCont").html("<table class='cagvTable'></table>");

					iColspan = 4;
					if(bHideEventIcon)
						iColspan--;
					if(bHideEventTime)
						iColspan--;

					for(iTempIndex = 0; iTempIndex < iNumOfDays; iTempIndex++)
					{
						dTempViewDate = to.tv.dAVDt[iTempIndex];
						dTempViewStartDate = to.setDateInFormat({"date": dTempViewDate}, "START");
						dTempViewEndDate = to.setDateInFormat({"date": dTempViewDate}, "END");
						oAEventsForView = to.getArrayOfEventsForView(dTempViewStartDate, dTempViewEndDate);
						bIsToday = (to.compareDates(dTempViewDate, $.CalenStyle.extra.dToday) === 0);

						sFullDate = to.getDateInFormat({"date": dTempViewStartDate}, "dd-MM-yyyy", false, true);
						sDateId = "Date-" +  sFullDate;
						sDateClass = bIsToday ? "cagvDate cagvDateToday" : "cagvDate";

						if(iTempIndex === 0 && sSelectedDateElemId === undefined)
							sSelectedDateElemId = "#" + sDateId;

						if(oAEventsForView.length !== 0)
						{
							$(to.elem).find(".cagvTable").append("<tr><td colspan='"+iColspan+"'><div id='" + sDateId + "' class='" + sDateClass + "'>" + to.getDateInFormat({"date": dTempViewStartDate}, "DDDD MMMM dd yyyy", false, true) + "</div></td></tr>");

							for(iEventIndex = 0; iEventIndex < oAEventsForView.length; iEventIndex++)
							{
								oEvent = oAEventsForView[iEventIndex];

								dStartDateTime = null; dEndDateTime = null;
								bIsAllDay = 0; sTitle = "";  sURL = ""; sEventColor = ""; sDesc = "";
								sId = ""; sIdElem = "";
								sEventColor = ""; sEventBorderColor = ""; sEventTextColor = "";
								sStyle = ""; sStyleColorHeight = ""; sIcon = ""; sEventDetailsStyle = ""; sEventIconStyle = "";

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

								sArrEventDateTime = to.getEventDateTimeDataForAgendaView(dStartDateTime, dEndDateTime, bIsAllDay, dTempViewStartDate);
								sEventDateTime = sArrEventDateTime[0];
								if(sEventDateTime === "")
									sEventDateTime = to.setting.miscStrings.allDay;

								sEventColor = oEvent.fromSingleColor ? oEvent.textColor : oEvent.backgroundColor;
								sEventColor = ($.cf.compareStrings(sEventColor, "") || $.cf.compareStrings(sEventColor, "transparent")) ? "transparent" : sEventColor;
								sId = "Event" + (++iEventId);
								sStyleColorHeight = sArrEventDateTime[1];

								sEventClass = "cagvEvent";
								if(bIsMarked)
								{
									sEventClass += " cMarkedDayEvent";
									sIcon = ($.cf.isValid(oEvent.icon) && oEvent.icon !== "Dot") ? oEvent.icon : "cs-icon-Mark";
									sEventIconStyle = "background: " + sEventColor + ";";
								}
								else
								{
									sIcon = $.cf.isValid(oEvent.icon) ? oEvent.icon : to.setting.eventIcon;
									sEventIconStyle = "background: " + sEventColor + "; ";
								}

								sTemplate = "";

								sTemplate += "<tr id='" + sId + "' class='" + sEventClass + "'>";

								sTemplate += "<td class='cagvEventColor'><span style='background:" + sEventColor + "; height:" + sStyleColorHeight + ";'></span></td>";

								if(!bHideEventTime)
									sTemplate += "<td class='cagvEventTime'>" + sEventDateTime + "</td>";

								if(bIsMarked)
								{
									sTemplate += "<td class='cagvEventIcon'><span class='cagvEventIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span></td>";
								}
								else
								{
									if(!bHideEventIcon)
									{
										if($.cf.compareStrings(sIcon, "Dot"))
											sTemplate += "<td class='cagvEventIcon'><span class='cagvEventIconDot' style='" + sEventIconStyle + "'></span></td>";
										else
											sTemplate += "<td class='cagvEventIcon'><span class='cagvEventIconFont "+sIcon+"' style='" + sEventIconStyle + "'></span></td>";
									}
								}

								sTemplate += "<td class='cagvEventContent'>";

								sTemplate += "<div class='cagvEventTitle'>" + sTitle + "</div>";
								sTemplate += "<div class='cagvEventDesc'>" + sDesc + "</div>";
								sTemplate += "</td>";

								sTemplate += "</tr>";

								sTemplate += "<tr class='cagvEventSeparator'><td colspan='"+iColspan+"'><hr/></td></tr>";
								$(to.elem).find(".cagvTable").append(sTemplate);

								if(bIsMarked)
								{
									$oDateElem = $(to.elem).find("#"+sDateId);
									if($oDateElem.find(".cMarkedDayIndicator").length === 0)
										$oDateElem.append("<span class='cMarkedDayIndicator cs-icon-Mark'></span>");
								}

								if($.cf.isValid(sURL) || to.setting.eventClicked)
								{
									sIdElem = "#"+sId;
									$(to.elem).find(sIdElem).on($.CalenStyle.extra.sClickHandler, {"url": sURL, "eventId": oEvent.calEventId, "eventElemSelector": sIdElem, "view": "AgendaView", "pluginId": to.tv.pluginId}, to.__bindClick);
								}
							}
						}
						else if(to.setting.showDaysWithNoEventsInAgendaView)
						{
							sTemplate = "<tr><td colspan='"+iColspan+"'><div id='" + sDateId + "' class='" + sDateClass + "'>" + to.getDateInFormat({"date": dTempViewStartDate}, "DDDD MMMM dd yyyy", false, true) + "</div></td></tr>";
							sTemplate += "<tr><td colspan='"+iColspan+"'><div class='cagvNoEvent'>No Events</div></td></tr>";
							$(to.elem).find(".cagvTable").append(sTemplate);
						}
					}
				}

				setTimeout(function()
				{
					$(to.elem).find(".cListOuterCont").scrollTop(0);
					if(sSelectedDateElemId !== undefined)
					{
						$(to.elem).find(".cListOuterCont").animate(
						{
							scrollTop: $(to.elem).find(sSelectedDateElemId).position().top
						}, 300);
					}
				}, 0);
			}

			to.addRemoveViewLoader(false, "cEventLoaderBg");
			to.addRemoveLoaderIndicators(false, "cEventLoaderIndicator");

			if(to.setting.eventListAppended)
				to.setting.eventListAppended.call(to);

			to.adjustAgendaView();

			to.__modifyFilterBarCallback();
		});
	},

	_setDateStringsInHeaderOfAgendaView: function()
	{
		var to = this;
		var sHeaderViewLabel = "";
		if($.cf.compareStrings(to.setting.agendaViewDuration, "Month"))
		{
			var oSelectedDate = to.getDateInFormat({"date": to.setting.selectedDate}, "object", false, true);
			sHeaderViewLabel = "<span class='cContHeaderLabelMonth'><b>" + to.getDateInFormat({"iDate": oSelectedDate}, "MMMM", false, true) + "</b></span></span>";
			sHeaderViewLabel += "<span class='cContHeaderLabelYear'>" + to.getNumberStringInFormat(oSelectedDate.y, 0, true) + "</span></span>";
		}
		else
		{
			var oAGVStart = to.getDateInFormat({"date": to.tv.dVSDt}, "object", false, true),
			oAGVEnd = to.getDateInFormat({"date": to.tv.dVEDt}, "object", false, true);

			if(to.tv.iNoVDay > 1)
			{
				if(oAGVStart.y === oAGVEnd.y)
					sHeaderViewLabel = to.getDateInFormat({"iDate": oAGVStart}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAGVStart.d, 0, true) + "  -  " + to.getDateInFormat({"iDate": oAGVEnd}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAGVEnd.d, 0, true) + ",  " + to.getNumberStringInFormat(oAGVEnd.y, 0, true);
				else
					sHeaderViewLabel = to.getDateInFormat({"iDate": oAGVStart}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAGVStart.d, 0, true) + ",  " + to.getNumberStringInFormat(oAGVStart.y, 0, true) + "  -  " + to.getDateInFormat({"iDate": oAGVEnd}, "MMM", false, true) + " " + to.getNumberStringInFormat(oAGVEnd.d, 0, true) + ",  " + to.getNumberStringInFormat(oAGVEnd.y, 0, true);
			}
			else
				sHeaderViewLabel = to.getDateInFormat({"iDate": oAGVStart}, "DDDD", false, true) + " " + to.getDateInFormat({"iDate": oAGVEnd}, "MMMM", false, true) + " " + to.getNumberStringInFormat(oAGVEnd.d, 0, true) + ",  " + to.getNumberStringInFormat(oAGVEnd.y, 0, true);
		}

		if(to.setting.modifyHeaderViewLabels)
			to.setting.modifyHeaderViewLabels.call(to, to.tv.dVSDt, to.tv.dVEDt, to.setting.selectedDate, sHeaderViewLabel, to.setting.visibleView);

		$(to.elem).find(".cContHeaderLabel").html(sHeaderViewLabel);
	},

	// Public Method
	getEventDateTimeDataForAgendaView: function(dEvStartDate, dEvEndDate, bIsAllDay, dThisDate, sClassPrefix)
	{
		var to = this;
		var iBaseHeight = 48, sStyleColorHeight = iBaseHeight + "px", sDateTimeString = "";
		var dThisEndDate = to.setDateInFormat({"iDate": {y: dThisDate.getFullYear(), M: dThisDate.getMonth(), d: (dThisDate.getDate() + 1)}}, "START"),
		iHours, iHeight, sSeparator = "",
		sEventTimeFormat = to.setting.is24Hour ? "HH:mm" : "h[:m]sm";

		if($.cf.compareStrings(to.setting.visibleView, "AgendaView") && !$.cf.isValid(to.setting.displayEventsForPeriodInListInAgendaView))
			sClassPrefix = "cagvEventTime";

		var sClassTop = sClassPrefix + "Top",
		sClassMiddle = sClassPrefix + "Middle",
		sClassBottom = sClassPrefix + "Bottom",
		sClassLabel = sClassPrefix + "Label",
		sClassDuration = sClassPrefix + "Duration";

		if(!$.cf.compareStrings(to.setting.agendaViewTheme, "Timeline2") || $.cf.isValid(to.setting.displayEventsForPeriodInListInAgendaView) || !$.cf.compareStrings(to.setting.visibleView, "AgendaView") )
			sSeparator = "<br/>";

		if(bIsAllDay)
		{
			if(to.compareDates(dEvStartDate, dEvEndDate) === 0)
				sDateTimeString = "<span class='"+sClassMiddle+" "+sClassLabel+" cagvEventTimeAllDay'>"+to.setting.miscStrings.allDay+"</span>";
			else
				sDateTimeString = "<span class='"+sClassTop+" "+sClassLabel+" cagvEventTimeAllDay'>"+to.setting.miscStrings.allDay+"</span>" + sSeparator + "<span class='"+sClassBottom+" "+sClassDuration+"'>"+ ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dThisDate, dEvEndDate, "d", false, false) : to.setting.duration.call(to, dThisDate, dEvEndDate, "d")) +"</span>";
		}
		else
		{
			if(to.compareDates(dEvStartDate, dEvEndDate) === 0)
			{
				iHours = to.__getDurationBetweenDates(dEvStartDate, dEvEndDate, "h", false, true).h;
				iHeight = (iHours/24)*iBaseHeight;
				iHeight = (iHeight < 1) ? 1 : iHeight;
				sStyleColorHeight = iHeight + "px";
				sDateTimeString = "<span class='"+sClassTop+"'>" + to.getDateInFormat({"date": dEvStartDate}, sEventTimeFormat, to.setting.is24Hour, true) + "</span>" + sSeparator + "<span class='"+sClassBottom+" "+sClassDuration+"'>" + ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dEvStartDate, dEvEndDate, "dhm", false, false) : to.setting.duration.call(to, dEvStartDate, dEvEndDate, "dhm")) + "</span>";
			}
			else
			{
				var dCompStartDate = (to.compareDateTimes(dEvStartDate, dThisDate) >= 0 && to.compareDateTimes(dEvStartDate, dThisEndDate) <= 0) ? dEvStartDate : dThisDate;
				var dCompEndDate = (to.compareDateTimes(dEvEndDate, dThisEndDate) <= 0) ? dEvEndDate : dThisEndDate;
				iHours = to.__getDurationBetweenDates(dCompStartDate, dCompEndDate, "h", false, true).h;
				iHeight = (iHours/24)*iBaseHeight;
				iHeight = (iHeight < 1) ? 1 : iHeight;
				sStyleColorHeight = iHeight + "px";

				if(to.compareDates(dEvStartDate, dThisDate) === 0)
					sDateTimeString = "<span class='"+sClassTop+"'>" + to.getDateInFormat({"date": dEvStartDate}, sEventTimeFormat, to.setting.is24Hour, true) + "</span>" + sSeparator + "<span class='"+sClassBottom+" "+sClassDuration+"'>" + ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dEvStartDate, dEvEndDate, "dhm", false, false) : to.setting.duration.call(to, dEvStartDate, dEvEndDate, "dhm")) + "</span>";
				else if(to.compareDates(dEvEndDate, dThisDate) === 0)
					sDateTimeString = "<span class='"+sClassTop+" "+sClassLabel+"'>"+to.setting.miscStrings.ends+"</span>" + sSeparator + "<span class='"+sClassBottom+"'>" + to.getDateInFormat({"date": dEvEndDate}, sEventTimeFormat, to.setting.is24Hour, true) + "</span>";
				else
					sDateTimeString = "<span class='"+sClassTop+" "+sClassLabel+" cagvEventTimeAllDay'>"+to.setting.miscStrings.allDay+"</span>" + sSeparator + "<span class='"+sClassBottom+" "+sClassDuration+"'>"+ ($.cf.compareStrings(to.setting.duration, "Default") ? to.__getDurationBetweenDates(dThisDate, dEvEndDate, "dhm", false, false) : to.setting.duration.call(to, dThisDate, dEvEndDate, "dhm"))+"</span>";
			}
		}
		return [sDateTimeString, sStyleColorHeight];
	},

	__goToPrevAgendaView: function()
	{
		var to = this;

		if($.cf.compareStrings(to.setting.agendaViewDuration, "Month"))
		{
			var iMonth = to.tv.dVSDt.getMonth();
			to.tv.dVSDt.setMonth(iMonth - 1);
			to.setting.selectedDate = to.setDateInFormat({"date": to.tv.dVSDt}, "START");
		}
		else
		{
			var iCurrentDateMS = to.tv.dVSDt.getTime();
			if(to.setting.daysInAgendaView === 7)
				iCurrentDateMS -= (to.tv.iNoVDay * $.CalenStyle.extra.iMS.d);
			else
				iCurrentDateMS -= $.CalenStyle.extra.iMS.d;
			to.setting.selectedDate = to.setDateInFormat({"date": new Date(iCurrentDateMS)}, "START");
		}
		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.sLoadType = "Prev";
		to.__reloadCurrentView(false, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	__goToNextAgendaView: function()
	{
		var to = this;

		if($.cf.compareStrings(to.setting.agendaViewDuration, "Month"))
		{
			var iMonth = to.tv.dVSDt.getMonth();
			to.tv.dVSDt.setMonth(iMonth + 1);
			to.setting.selectedDate = to.setDateInFormat({"date": to.tv.dVSDt}, "START");
		}
		else
		{
			var iCurrentDateMS = to.tv.dVEDt.getTime();
			iCurrentDateMS += $.CalenStyle.extra.iMS.d;
			to.setting.selectedDate = to.setDateInFormat({"date": new Date(iCurrentDateMS)}, "START");
		}
		to.tv.dLoadDt = to.setDateInFormat({"date": to.setting.selectedDate}, "START");

		to.tv.sLoadType = "Next";
		to.__reloadCurrentView(false, true);
		setTimeout(function()
		{
			to.__reloadDatePickerContentOnNavigation();
		}, 10);
	},

	// Public Method
	adjustAgendaView: function()
	{
		var to = this;
		var icagvCalendarContMaxHeight = $(to.elem).find(".cagvCalendarCont").css("max-height");
		icagvCalendarContMaxHeight = parseInt(icagvCalendarContMaxHeight.replace("px", "")) || 0;
		var icagvCalendarContMinHeight = $(to.elem).find(".cagvCalendarCont").css("min-height");
		icagvCalendarContMinHeight = parseInt(icagvCalendarContMinHeight.replace("px", "")) || 0;

		if(icagvCalendarContMaxHeight > 0 && $(to.elem).height() > icagvCalendarContMaxHeight)
			$(to.elem).css({"height": icagvCalendarContMaxHeight});
		else if(icagvCalendarContMinHeight > 0 && $(to.elem).height() < icagvCalendarContMinHeight)
			$(to.elem).css({"height": icagvCalendarContMinHeight});
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

		if(to.tv.bDisFBar && $.cf.compareStrings(to.setting.filterBarPosition, "Right"))
			$(to.elem).find(".cFilterBar").css({"left": iCalendarContWidth});

		iCalendarContHeight -= (($(to.elem).find(".cContHeader").length > 0) ? $(to.elem).find(".cContHeader").outerHeight() : 0);
		if(to.tv.bDisABar)
			iCalendarContHeight -= $(to.elem).find(".cActionBar").outerHeight();

		$(to.elem).find(".cListOuterCont").css({"height": iCalendarContHeight});
		$(to.elem).find(".cagvTable").css({"width": (iCalendarContWidth - $.CalenStyle.extra.iScrollbarWidth)});

		var iEventWidth = iCalendarContWidth,
		iEventColorWidth = $(to.elem).find(".cagvEventColor").outerWidth(true),
		oElems = $(to.elem).find(".cagvEventTime span");
		var iTimeMaxWidth = Math.max.apply(null, $(oElems).map(function()
		{
			return $(this).outerWidth(true);
		}).get());
		iTimeMaxWidth += 10;
		$(to.elem).find(".cagvEventTime").css({"min-width": iTimeMaxWidth});

		var iEventTitleWidth = iEventWidth - (iEventColorWidth + iTimeMaxWidth) - 10;
		if($.cf.compareStrings(to.setting.agendaViewTheme, "Timeline1"))
		{
			iEventTitleWidth = iEventTitleWidth - ($(to.elem).find(".cagvEventIcon").width() + 40);
			$(to.elem).find(".cagvEventContent").css({"width": iEventTitleWidth});
		}
		else if($.cf.compareStrings(to.setting.agendaViewTheme, "Timeline2"))
			$(to.elem).find(".cagvEventTitle").css({"max-width": (iEventTitleWidth - 40)});
		else if($.cf.compareStrings(to.setting.agendaViewTheme, "Timeline3"))
			$(to.elem).find(".cagvEventContent").css({"width": iEventTitleWidth});
	}

});

/*! ---------------------------------- CalenStyle Agenda View End --------------------------------- */
