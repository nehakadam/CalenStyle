/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */


/*

	language: Russian
	file: CalenStyle-i18n-ru

*/

(function ($) {
    $.CalenStyle.i18n["ru"] = $.extend($.CalenStyle.i18n["ru"], {
        veryShortDayNames: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
		shortDayNames: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
		fullDayNames: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
		shortMonthNames: 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
		fullMonthNames: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
		numbers: "0_1_2_3_4_5_6_7_8_9".split("_"),
		eventTooltipContent: "Default",
		formatDates: {},
		miscStrings: {
			today: "Сегодня",
			week: "Неделя",
			allDay: "весь день",
			ends: "кончать"
		},
		duration: "Default",
		durationStrings: {
			y: ["Год ", "Год "],
			M: ["Месяц ", "Месяц "],
			w: ["w ", "w "],
			d: ["d ", "d "],
			h: ["h ", "h "],
			m: ["m ", "m "],
			s: ["s ", "s "]
		},
		viewDisplayNames: {
			DetailedMonthView: "Месяц",
			MonthView: "Месяц",
			WeekView: "Неделя",
			DayView: "День",
			AgendaView: "повестка дня"
		}
    });
})(jQuery);

