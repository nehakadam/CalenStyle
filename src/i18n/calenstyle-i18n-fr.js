/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */


/*

	language: French
	file: CalenStyle-i18n-fr

*/

(function ($) {
    $.CalenStyle.i18n["fr"] = $.extend($.CalenStyle.i18n["fr"], {
        veryShortDayNames: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
		shortDayNames: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
		fullDayNames: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
		shortMonthNames: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
		fullMonthNames: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
		numbers: "0_1_2_3_4_5_6_7_8_9".split("_"),
		eventTooltipContent: "Default",
		formatDates: {},
		miscStrings: {
			today: "Aujourd\'hui",
			week: "semaine",
			allDay: "toute la journée",
			ends: "finir"
		},
		duration: "Default",
		durationStrings: {
			y: ["an ", "ans "],
			M: ["mois ", "mois "],
			w: ["semaine ", "semaine "],
			d: ["jour ", "jours "],
			h: ["heure ", "heures "],
			m: ["minute ", "minutes "],
			s: ["s ", "s "]
		},
		viewDisplayNames: {
			DetailedMonthView: "mois",
			MonthView: "mois",
			WeekView: "semaine",
			DayView: "jour",
			AgendaView: "ordre du jour"
		}
    });
})(jQuery);

