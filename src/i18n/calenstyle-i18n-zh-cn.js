/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */


/*

	language: Chinese
	file: CalenStyle-i18n-zh-cn

*/

(function ($) {
    $.CalenStyle.i18n["zh-cn"] = $.extend($.CalenStyle.i18n["zh-cn"],
    {
        veryShortDayNames: '日_一_二_三_四_五_六'.split('_'),
		shortDayNames: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
		fullDayNames: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
		shortMonthNames: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
		fullMonthNames: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
		numbers: "0_1_2_3_4_5_6_7_8_9".split("_"),
		eventTooltipContent: "Default",
		formatDates: {
						"hh:mm": function(iDate)
						{
							var iHm = iDate.H * 100 + iDate.m,
							sFormat = "";

				            if (iHm < 600)
				                sFormat = '凌晨';
				            else if (iHm < 900)
				                sFormat = '早上';
				            else if (iHm < 1130)
				                sFormat = '上午';
				            else if (iHm < 1230)
				                sFormat = '中午';
				            else if (iHm < 1800)
				                sFormat = '下午';
				            else
				                sFormat = '晚上';

				        	sFormat += iDate.h + "点" + this.getDateInFormat({"iDate": iDate}, "mm", false, true);

				        	return sFormat;
						},

						"HH:mm": function(iDate)
						{
							var iHm = iDate.H * 100 + iDate.m,
							sFormat = "";

				            if (iHm < 600)
				                sFormat = '凌晨';
				            else if (iHm < 900)
				                sFormat = '早上';
				            else if (iHm < 1130)
				                sFormat = '上午';
				            else if (iHm < 1230)
				                sFormat = '中午';
				            else if (iHm < 1800)
				                sFormat = '下午';
				            else
				                sFormat = '晚上';

				        	sFormat += iDate.h + "点" + this.getDateInFormat({"iDate": iDate}, "mm", false, true);

				        	return sFormat;
						}
		},
		miscStrings: {
			today: "今天",
			week: "星期",
			allDay: "整天",
			ends: "结束"
		},
		duration: "Default",
		durationStrings: {
			y: ["岁 ", "岁 "],
			M: ["月 ", "月 "],
			w: ["周 ", "周 "],
			d: ["日 ", "日 "],
			h: ["钟头 ", "钟头 "],
			m: ["分钟 ", "分钟 "],
			s: ["秒 ", "秒 "]
		},
		viewDisplayNames: {
			DetailedMonthView: "月份",
			MonthView: "月份",
			WeekView: "星期",
			DayView: "白天",
			AgendaView: "应办事项"
		}
    });
})(jQuery);

