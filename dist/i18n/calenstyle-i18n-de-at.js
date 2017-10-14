/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

/*

	language: Austrian German ("de-at")
	file: CalenStyle-i18n-de-at

*/

(function ($) {
    $.CalenStyle.i18n["de-at"] = $.extend($.CalenStyle.i18n["de-at"], {

        veryShortDayNames: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
		shortDayNames: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
		fullDayNames: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
		shortMonthNames: 'Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
		fullMonthNames: 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
		numbers: '0_1_2_3_4_5_6_7_8_9'.split('_'),
		eventTooltipContent: "Default",
		formatDates: {},
		miscStrings: {
			today: "Heute",
			week: "Woche",
			allDay: "ganztägige",
			ends: "Ende"
		},
		duration: "Default",
		durationStrings: {
			y: ["Jahre ", "Jahren "],
			M: ["Monate ", "Monaten "],
			w: ["w ", "w "],
			d: ["Tage ", "Tagen "],
			h: ["Stunde ", "Stunde "],
			m: ["Minute ", "Minute "],
			s: ["s ", "s "]
		},
		viewDisplayNames: {
			DetailedMonthView: "Monat",
			MonthView: "Monat",
			WeekView: "Woche",
			DayView: "Tag",
			AgendaView: "Tagesordnung"
		}
	});
})(jQuery);