/* -----------------------------------------------------------------------------

  CalenStyle - Responsive Event Calendar
  Version 2.0.8
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/CalenStyle/contributors
  Repository : https://github.com/nehakadam/CalenStyle
  Homepage : https://nehakadam.github.io/CalenStyle

 ----------------------------------------------------------------------------- */

var documentation = {

    tags:
    [
        "Basic",
        "UI",
        "i18n",
        "DateTime",
        "Events",
        "DetailedMonthView",
        "MonthView",
        "DetailView",
        "Week",
        "CustomView",
        "AgendaView",
        "WeekPlannerView",
        "QuickAgendaView",
        "TaskPlannerView",
        "DayListView",
        "AppointmentView",
        "EventList",
        "FilterBar",
        "Data",
        "DatePicker"
    ],

    parameters:
    [
        {
            "name": "sectionsList",
            "tags": ["UI"],
            "default": "[\"Header\", \"Calendar\"]",
            "datatype": "Array",
            "options": "<ul>\n  <li>\"Header\"</li>\n  <li>\"Calendar\"</li>\n  <li>\"EventList\"</li>\n  <li>\"FilterBar\"</li>\n  <li>\"ActionBar\"</li>\n</ul>",
            "description": "<p>\n  <code>sectionsList</code> is the array of sections to add to the Calendar View.\n</p>\n<p>\n  <code>\"Calendar\"</code> is one of the default value and is required for all Calendar Views.\n</p>",
            "examples": ["../demo/QuickUse-WidthBasedRendering.htm"]
        },
        {
            "name": "language",
            "tags": ["i18n"],
            "default": "",
            "datatype": "String",
            "options": "",
            "description": "<p>\n  <code>language</code> can be any language for which i18n strings are specified in \"calenstyle-i18n.js\".\n  For example, \"en\", \"de\"\n</p>",
            "examples": ["../demo/Other-Internationalization.htm"]
        },
        {
            "name": "veryShortDayNames",
            "tags": ["i18n"],
            "default": "[\"Su\", \"Mo\", \"Tu\", \"We\", \"Th\", \"Fr\", \"Sa\"]",
            "datatype": "Array",
            "options": "",
            "description": "<p><code>veryShortDayNames</code> is an array of Very Short Day Names from Sunday to Saturday.</p><p><code>veryShortDayNames</code> are used in a DatePicker.</p>"
        },
        {
            "name": "shortDayNames",
            "tags": ["i18n"],
            "default": "[\"Sun\", \"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\"]",
            "datatype": "Array",
            "options": "",
            "description": "<p><code>shortDayNames</code> is an array of Short Day Names from Sunday to Saturday.</p>",
            "examples": ["../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "fullDayNames",
            "tags": ["i18n"],
            "default": "[\"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"]",
            "datatype": "Array",
            "options": "",
            "description": "<p><code>fullDayNames</code> is an array of Full Day Names from Sunday to Saturday.</p>"
        },
        {
            "name": "shortMonthNames",
            "tags": ["i18n"],
            "default": "[\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\"]",
            "datatype": "Array",
            "options": "",
            "description": "<p><code>shortMonthNames</code> is an array of Short Month Names from January to December.</p>"
        },
        {
            "name": "fullMonthNames",
            "tags": ["i18n"],
            "default": "[\"January\", \"February\", \"March\", \"April\", \"May\", \"June\", \"July\", \"August\", \"September\", \"October\", \"November\", \"December\"]",
            "datatype": "Array",
            "options": "",
            "description": "<p><code>fullMonthNames</code> is an array of Full Month Names from January to December.</p>",
            "examples": ["../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "numbers",
            "tags": ["i18n"],
            "default": "[\"0\", \"1\", \"2\", \"3\", \"4\", \"5\", \"6\", \"7\", \"8\", \"9\"]",
            "options": "",
            "description": "<p>\n  <code>numbers</code> is an array numbers from 0 to 9 which will be used to display numeric values.\n</p>"
        },
        {
            "name": "eventTooltipContent",
            "tags": ["i18n"],
            "default": "\"Default\"",
            "datatype": "<ul>\n  <li>string or html code string</li>\n  <li>callback function returning string or html code string</li>\n</ul>",
            "options": "<ul>\n  <li>\"Default\"</li>\n  <li>\n<pre>\nfunction(oEventRecord)\n{\n    return \"tooltipcontent\";\n}\n</pre>\n  </li>\n</ul>",
            "description": "<p>\n  <code>eventTooltipContent</code> is a content displayed on tooltip.\n</p>"
        },
        {
            "name": "formatDates",
            "tags": ["i18n"],
            "default": "<pre>{}</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<p>\n  <code>formatDates</code> can be used to apply a custom datetime format.\n</p>\n<p>\n  It can be specified as an object with callback functions returning formatted datetime string named as format specifier. \n</p>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm"]
        },
        {
           "name": "slotTooltipContent",
           "tags": ["i18n"],
           "default": "function(oSlotAvailability)\n{\n  if(oSlotAvailability.status === \"Busy\")\n    return \"\";\n  else if(oSlotAvailability.status === \"Free\")\n  {\n    if(oSlotAvailability.count === undefined || oSlotAvailability.count === null)\n      return \"<div class=cavTooltipBookNow>Book Now</div>\";\n    else\n      return \"<div class=cavTooltipSlotCount>\" + oSlotAvailability.count + \" slots available</div><div class=cavTooltipBookNow>Book Now</div>\";\n  }\t\t\t\n}",
           "datatype": "String or Function returning String",
           "options": "",
           "description": "<p>Tooltip content for time slot in the AppointmentView.</p>"
        },
        {
            "name": "miscStrings",
            "tags": ["i18n"],
            "default": "<pre>miscStrings:\n{\n    today: \"Today\",\n    week: \"Week\",\n    allDay: \"All Day\",\n    ends: \"Ends\",\n    emptyEventTitle: \"(No Title)\",\n    emptyGoogleCalendarEventTitle: \"Busy\"\n}</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<p>\n  <code>miscStrings</code> is an object containing strings displayed on CalenStyle UI which can be customized\n</p>"
        },
        {
            "name": "duration",
            "tags": ["i18n"],
            "default": "\"Default\"",
            "datatype": "<ul>\n  <li>string or html code string</li>\n  <li>callback function returning string or html code string</li>\n</ul>",
            "options": "<ul>\n  <li>\"Default\"</li>\n  <li>\n    <pre>\nfunction(dStartDate, dEndDate, sDurationUnits)\n{\n    return iDuration + sOutputDurationUnit; // 2d or 1d 8h 45m\n}\n    </pre>\n  </li>\n</ul>",
            "description": "<p>\n  To customize duration strings use <code>duration</code> as a callback function.\n</p>\n<p>\n  This function is called with parameters start date, end date and duration units(any combination of 'y', 'M', 'w', 'd', 'h', 'm', 's', but only 'd', 'dhm' is used in CalenStyle). So you can calculate duration between specified dates and return duration string. \n</p>"
        },
        {
            "name": "durationStrings",
            "tags": ["i18n"],
            "default": "<pre>{\n    y: [\"year \", \"years \"],\n    M: [\"month \", \"months \"],\n    w: [\"w \", \"w \"],\n    d: [\"d \", \"d \"],\n    h: [\"h \", \"h \"],\n    m: [\"m \", \"m \"],\n    s: [\"s \", \"s \"]\n}</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<p>\n  Custom duration unit strings can be specified to replace default duration unit strings displayed on CalenStyle UI.\n</p>"
        },
        {
            "name": "viewsToDisplay",
            "tags": ["UI"],
            "default": "<pre>[{\n  \"viewName\": \"DetailedMonthView\",\n  \"viewDisplayName\": \"Month\"\n},\n{\n  \"viewName\": \"WeekView\",\n  \"viewDisplayName\": \"Week\"\n},\n{\n  \"viewName\": \"DayView\",\n  \"viewDisplayName\": \"Day\"\n}]</pre>",
            "datatype": "Array",
            "options": "",
            "description": "<p>\n  <code>viewsToDisplay</code> is an array of views available to be displayed on the Calendar View. A view specified in the array will be added as a menu item in the Header section. A view specified as <a class=\"parameter-link icon-link\" href=\"#link-visibleView\"><code>visibleView</code></a> will be displayed first. You can switch between Views by selecting menu item. </p>\n<p>\n  <code>\"viewName\"</code> - name of the View (refer <a class=\"parameter-link icon-link\" href=\"#link-visibleView\"><code>visibleView</code></a> options).\n</p>\n<p>\n  <code>\"viewDisplayName\"</code> - name to display on menu item.\n</p>",
            "examples": ["../demo/QuickUse-WidthBasedRendering.htm"]
        },
        {
            "name": "visibleView",
            "tags": ["UI"],
            "default": "\"DetailedMonthView\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"DetailedMonthView\"</li>\n  <li>\"MonthView\"</li>\n  <li>\"WeekView\"</li>\n  <li>\"DayView\"</li>\n  <li>\"AgendaView\"</li>\n  <li>\"WeekPlannerView\"</li>\n  <li>\"QuickAgendaView\"</li>\n  <li>\"TaskPlannerView\"</li>\n  <li>\"CustomView\"</li>\n  <li>\"DayEventListView\"</li>\n  <li>\"DayEventDetailView\"</li>\n  <li>\"AppointmentView\"</li>\n  <li>\"DatePicker\"</li>\n</ul>",
            "description": "<p><code>visibleView</code> is the Calendar View you want to display.</p>",
            "examples": ["../demo/QuickUse-WidthBasedRendering.htm"]
        },
        {
            "name": "selectedDate",
            "tags": ["Basic"],
            "default": "new Date()",
            "datatype": "Date",
            "options": "",
            "description": "<p><code>selectedDate</code> is the Date for which the Calendar View is rendered.</p><p>Today is the default value of <code>selectedDate</code>.",
            "examples": ["../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "headerComponents",
            "tags": ["Basic", "UI"],
            "default": "<pre>\n{\n    DatePickerIcon: \"&lt;span class='cContHeaderDatePickerIcon clickableLink icon-Calendar'&gt;&lt;/span&gt;\",\n    FullscreenButton: function(bIsFullscreen)\n    {\n        var sIconClass = (bIsFullscreen) ? \"icon-Contract\" : \"icon-Expand\";\n        return \"&lt;span class='cContHeaderFullscreen clickableLink \"+ sIconClass +\"'&gt;&lt;/span&gt;\";\n    },\n    PreviousButton: \"&lt;span class='cContHeaderButton cContHeaderNavButton cContHeaderPrevButton clickableLink icon-Prev'&gt;&lt;/span&gt;\",\n    NextButton: \"&lt;span class='cContHeaderButton cContHeaderNavButton cContHeaderNextButton clickableLink icon-Next'&gt;&lt;/span&gt;\",\n    TodayButton: \"&lt;span class='cContHeaderButton cContHeaderToday clickableLink'&gt;&lt;/span&gt;\",\n    HeaderLabel: \"&lt;span class='cContHeaderLabelOuter'&gt;&lt;span class='cContHeaderLabel'&gt;&lt;/span&gt;&lt;/span&gt;\",\n    HeaderLabelWithDropdownMenuArrow: \"&lt;span class='cContHeaderLabelOuter clickableLink'&gt;&lt;span class='cContHeaderLabel'&gt;&lt;/span&gt;&lt;span class='cContHeaderDropdownMenuArrow'&gt;&lt;/span&gt;&lt;/span&gt;\",\n    MenuSegmentedTab: \"&lt;span class='cContHeaderMenuSegmentedTab'&gt;&lt;/span&gt;\",\n    MenuDropdownIcon: \"&lt;span class='cContHeaderMenuButton clickableLink'&gt;&#9776;&lt;/span&gt;\"\n}\n</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<p><code>headerComponents</code> is a set of components which can be added in Header Sections.</p>\n<p>The value of each component is a string of HTML markup or function returning a string of HTML markup.</p>\n<p>Header Component Views - </p>\n<div class=\"ss-header ss-headercomp1\">\n  <img src=\"images/headerComponents1.png\">\n</div>\n<div class=\"ss-header ss-headercomp2\">\n  <img src=\"images/headerComponents2.png\">\n</div>\n<div class=\"ss-header ss-headercomp3\">\n  <img src=\"images/headerComponents3.png\">\n</div>\n<div class=\"ss-header ss-headercomp4\">\n  <img src=\"images/headerComponents4.png\">\n</div>\n<ul>\n\t<li>\n      \"DatePickerIcon\" - Show \"DatePicker\".\n  \t</li>\n  \t<li>\n      \"FullscreenButton\" - Expand/Contract CalenStyle view.\n  \t</li>  \n  \t<li>\n      \"PreviousButton\" - Navigate to View displaying previous set of dates .\n  \t</li>  \n  \t<li>\n      \"NextButton\" - Navigate to View displaying next set of dates .\n  \t</li>\n  \t<li>\n      \"TodayButton\" - Navigate to View displaying Today.\n  \t</li>\n  \t<li>\n      \"HeaderLabel\" - Display Label.\n  \t</li>  \n  \t<li>\n      \"HeaderLabelWithDropdownMenuArrow\" - Display Label which shows Dropdown Menu when clicked. Elements to be added in the dropdown menu can be configured in <a class=\"parameter-link icon-link\" href=\"#link-dropdownMenuElements\"><code>dropdownMenuElements</code></a> parameter.\n  \t</li>  \n  \t<li>\n      \"MenuSegmentedTab\" - Show Segmented Tab Menu.\n  \t</li>\n  \t<li>\n      \"MenuDropdownIcon\" - Show Dropdown Menu. Elements to be added in the dropdown menu can be configured in <a class=\"parameter-link icon-link\" href=\"#link-dropdownMenuElements\"><code>dropdownMenuElements</code></a> parameter.\n  \t</li>\n</ul>"
        },
        {
            "name": "headerSectionsList",
            "tags": ["Basic", "UI"],
            "default": "<pre>\n{\n    left: [\"DatePickerIcon\", \"FullscreenButton\", \"PreviousButton\", \"NextButton\"],\n    center: [\"HeaderLabel\"],\n    right: [\"MenuSegmentedTab\"]\n}\n</pre>",
            "datatype": "Object",
            "options": "<ul>\n  <li>\"DatePickerIcon\"</li>\n  <li>\"FullscreenButton\"</li>\n  <li>\"PreviousButton\"</li>\n  <li>\"NextButton\"</li>\n  <li>\"TodayButton\"</li>\n  <li>\"HeaderLabel\"</li>\n  <li>\"HeaderLabelWithDropdownMenuArrow\"</li>\n  <li>\"MenuSegmentedTab\"</li>\n  <li>\"MenuDropdownIcon\"</li>\n</ul>\n",
            "description": "<p>Header is divided into three sections - <code>left</code>, <code>center</code> and <code>right</code>.</p>\n<p><code>headerSectionList</code> defines an array of components to include in each Header Section. Youn can customize Header as per visual and functional requirements.</p>",
            "examples": ["../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "dropdownMenuElements",
            "tags": ["Basic", "UI", "DatePicker"],
            "default": "[\"ViewsToDisplay\"]",
            "datatype": "Array",
            "options": "<ul>\n  <li>\"ViewsToDisplay\"</li>\n  <li>\"DatePicker\"</li>\n</ul>\n",
            "description": "<p>The Menu Items to display are specified in <code>dropdownMenuElements</code>.</p>\n<p>\"ViewsToDisplay\" adds menu items as \"viewDisplayName\" from <a class=\"parameter-link icon-link\" href=\"#link-viewsToDisplay\"><code>viewsToDisplay</code></a>.</p>\n<p>\"DatePicker\" adds menu item as \"Date Picker\".</p>",
            "examples": ["../demo/Mobile/View-Detail_Custom_Days.htm"]
        },
        {
            "name": "parentObject",
            "tags": ["Basic", "DatePicker"],
            "default": "null",
            "datatype": "Object",
            "options": "",
            "description": "<p><code>parentObject</code> is the CalenStyle object for which DatePicker is created.</p>\n<p>A value for this property is set only for the CalenStyle object which is used as a DatePicker. <code>parentObject</code> along with <code>datePickerCalDataSource.config.sourceCountType</code>: \"Event\" is used for calculating Source Count from the eventSource of the Parent CalenStyle object.</p>\n",
            "examples": ["../demo/Section-Header_NonCalenStyle.htm"]
        },
        {
            "name": "datePickerObject",
            "tags": ["Basic", "DatePicker"],
            "default": "null",
            "datatype": "Object",
            "options": "",
            "description": "<p><code>datePickerObject</code> is the CalenStyle object of the DatePicker.</p>\n<p>A value of this parameter is used to modify DatePicker when some changes takes place in the parent CalenStyle object. For example, on view navigation, <code>highlightDatesInDatePicker</code> method is called on <code>datePickerObject</code>.</p>\n"
        },
        {
            "name": "formatSeparatorDateTime",
            "tags": ["DateTime"],
            "default": "Space(\" \")",
            "datatype": "Character",
            "options": "",
            "description": "<p>\n  <code>formatSeparatorDateTime</code> is the DateTime Format Separator. (* values of formatSeparatorDateTime, formatSeparatorDate and formatSeparatorTime should be different).\n</p>\n<p>\n  When a Custom <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a> (other than \"Milliseconds\" and \"ISO8601\") is used and <code>formatSeparatorDateTime</code> for the calDataSource is different than one specified in the Settings Parameters, <code>formatSeparatorDateTime</code> can be specified in the <a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>calDataSource</code></a> to facilitate Date Parsing. Otherwise Date Parsing will fail.\n</p>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm"]
        },
        {
            "name": "formatSeparatorDate",
            "tags": ["DateTime"],
            "default": "Dash(\"-\")",
            "datatype": "Character",
            "options": "",
            "description": "<p>\n  <code>formatSeparatorDate</code> is the Date Format Separator. (* values of formatSeparatorDateTime, formatSeparatorDate and formatSeparatorTime should be different).\n</p>\n<p>\n  When a Custom <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a> (other than \"Milliseconds\" and \"ISO8601\") is used and <code>formatSeparatorDate</code> for the calDataSource is different than one specified in the Settings Parameters, <code>formatSeparatorDate</code> can be specified in the <a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>calDataSource</code></a> to facilitate Date Parsing. Otherwise Date Parsing will fail.\n</p>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm"]
        },
        {
            "name": "formatSeparatorTime",
            "tags": ["DateTime"],
            "default": "Colon(\":\")",
            "datatype": "Character",
            "options": "",
            "description": "<p>\n  <code>formatSeparatorTime</code> is the Time Format Separator. (* values of formatSeparatorDateTime, formatSeparatorDate and formatSeparatorTime should be different).\n</p>\n<p>\n  <code>formatSeparatorTime</code> can be specified in the <a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>calDataSource</code></a>, when a Custom <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a> (other than \"Milliseconds\" and \"ISO8601\") is used and <code>formatSeparatorTime</code> for the calDataSource is different than one specified in as Settings Parameters Option to facilitate Date Parsing. Otherwise Date Parsing will fail.\n</p>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm"]
        },
        {
            "name": "is24Hour",
            "tags": ["DateTime"],
            "default": "true",
            "datatype": "Boolean",
            "options": "<ul>\n  <li>true</li>\n  <li>false</li>\n</ul>",
            "description": "<p><code>is24Hour</code> specifies the time format in which the time is displayed inside the Calendar View.</p>",
            "examples": ["../demo/View-QuickAgenda.htm"]
        },
        {
            "name": "inputDateTimeFormat",
            "tags": ["DateTime"],
            "default": "\"dd-MM-yyyy HH:mm:ss\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"Milliseconds\"</li>\n  <li>\"ISO8601\"</li>\n  <li>\"dd-MM-yyyy hh:mm:ss AA\"</li>\n  <li>\"dd-MM-yyyy HH:mm:ss\"</li>\n  <li>\"MM-dd-yyyy hh:mm:ss AA\"</li>\n  <li>\"MM-dd-yyyy HH:mm:ss\"</li>\n  <li>\"yyyy-MM-dd hh:mm:ss AA\"</li>\n  <li>\"yyyy-MM-dd HH:mm:ss\"</li>\n</ul>",
            "description": "<p>\n  <code>inputDateTimeFormat</code> is the DateTime Format specified in the Events.\n</p>\n<p>\n  When <code>inputDateTimeFormat</code> for the eventSource is different than one specified in the Settings Parameters, <code>inputDateTimeFormat</code> can be specified in the <a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>calDataSource</code></a> to facilitate Date Parsing. Otherwise Date Parsing will fail.\n</p>"
        },
        {
            "name": "eventDuration",
            "tags": ["DateTime"],
            "default": "30",
            "datatype": "Integer",
            "options": "",
            "description": "<p>\n  <code>eventDuration</code> indicates default event duration, which can be used to create end date of event for which end date is not supplied in the event source.\n</p>"
        },
        {
            "name": "allDayEventDuration",
            "tags": ["DateTime"],
            "default": "1",
            "datatype": "Integer",
            "options": "",
            "description": "<p>\n  <code>allDayEventDuration</code> indicates default event duration for all day event, which can be used to create end date of event for which end date is not supplied in the event source.\n</p>"
        },
        {
            "name": "timeIndicatorUpdationInterval",
            "tags": ["UI"],
            "default": "10",
            "datatype": "Integer",
            "options": "",
            "description": "<p>\n  <code>timeIndicatorUpdationInterval</code> is an interval after which Current Time Indicator position is auto updated to indicate Current Time. Time Indicator is displayed in Detail Views(\"WeekView\", \"DayView\") in the column indicating timeLabels and the column for Today . <code>timeIndicatorUpdationInterval</code> is specified in minutes.\n</p>"
        },
        {
            "name": "unitTimeInterval",
            "tags": ["UI", "Events"],
            "default": "30",
            "datatype": "Integer",
            "options": "<ul>\n  <li>60</li>\n  <li>30</li>\n  <li>20</li>\n  <li>15</li>\n  <li>10</li>\n  <li>5</li>\n</ul>",
            "description": "<p>\n  <code>unitTimeInterval</code> is a value of a time slot(one row) in the Detail Views(\"WeekView\", \"DayView\"). <code>unitTimeInterval</code> is specified in minutes.\n</p>"
        },
        {
            "name": "timeLabels",
            "tags": ["UI"],
            "default": "\"Hour\"",
            "datatype": "String",
            "options": "<ul><li>\"Hour\"</li><li>\"All\"</li></ul>",
            "description": "<p><code>timeLabels</code> sets whether to display time labels (for example, 01:00) for Hour or time labels for Each Time Slot in the Detail Views(\"WeekView\", \"DayView\").</p>"
        },
        {
            "name": "inputTZOffset",
            "tags": ["DateTime", "Events"],
            "default": "\"+05:30\"",
            "datatype": "TZD(Time Zone Designator) String",
            "options": "",
            "description": "<p>\n  <code>inputTZOffset</code> is the TZD string of timezone in which input dates from data sources is specified. For example. values of \"start\" and \"end\" for Event.\n</p>\n<p>\n  <code>outputTZOffset</code> is the TZD string of timezone in which you want to display dates on CalenStyle UI.\n</p>\n<p>\n  You can specify <code>inputTZOffset</code> for each data source separately in <code>\"config\"</code> object of <code>calDataSource</code>.\n</p>\n<p>\n  While parsing data, dates in <code>inputTZOffset</code> will be offset to <code>outputTZOffset</code>.\n  This will let you to display dates in different offsets\n</p>\n<p>\n  If you set <code>inputTZOffset</code> to \"\"(empty string), timezone offset of browser will be used.\n</p>",
            "examples": ["../demo/View-Detail_Week.htm", "../demo/Callback-CellClicked_AddEvent.htm"]
        },
        {
            "name": "tz",
            "tags": ["DateTime", "Events"],
            "default": "\"Asia/Calcutta\"",
            "datatype": "TZ String",
            "options": "",
            "description": "<p>\n  <code>timezone</code> value will be used when you specify Google Calendar as a source, to send it as a Query Parameter.\n</p>",
            "examples": ["../demo/Other-Internationalization.htm"]
        },
        {
            "name": "outputTZOffset",
            "tags": ["DateTime", "Events"],
            "default": "\"+05:30\"",
            "datatype": "TZD(Time Zone Designator) String",
            "options": "",
            "description": "<p>\n  <code>inputTZOffset</code> is the TZD string of timezone in which input dates from data sources is specified. For example. values of \"start\" and \"end\" for Event.\n</p>\n<p>\n  <code>outputTZOffset</code> is the TZD string of timezone in which you want to display dates on CalenStyle UI.\n</p>\n<p>\n  You can specify <code>inputTZOffset</code> for each data source separately in <code>\"config\"</code> object of <code>calDataSource</code>.\n</p>\n<p>\n  While parsing data, dates in <code>inputTZOffset</code> will be offset to <code>outputTZOffset</code>.\n  This will let you to display dates in different offsets\n</p>\n<p>\n  If you set <code>inputTZOffset</code> to \"\"(empty string), timezone offset of browser will be used.\n</p>",
            "examples": ["../demo/Other-Internationalization.htm"]
        },
        {
            "name": "weekStartDay",
            "tags": ["Basic"],
            "default": "1",
            "datatype": "Integer",
            "options": "0 - 7 (Sunday - Saturday)",
            "description": "<p><code>weekStartDay</code> is Start Day of the week.</p>"
        },
        {
            "name": "weekNumCalculation",
            "tags": ["Basic", "Week"],
            "default": "\"US\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"US\"</li>\n  <li>\"Europe/ISO\"</li>\n</ul>",
            "description": "<p>\n  <code>weekNumCalculation</code> specifies Week Number Calculation Method - \"US\" or \"Europe/ISO\".\n</p>"
        },
        {
            "name": "daysInCustomView",
            "tags": ["UI", "CustomView"],
            "default": "4",
            "datatype": "Integer",
            "options": "",
            "description": "<p><code>daysInCustomView</code> is a value of Number of Days To Display in DetailView.</p>",
            "examples": ["../demo/View-Detail_Custom_Days.htm"]
        },
        {
            "name": "daysInDayListView",
            "tags": ["UI", "DayListView"],
            "default": "7",
            "datatype": "Integer",
            "options": "",
            "description": "<p><code>daysInDayListView</code> is a value of Days To Display in DayListView(\"DayEventListView\", \"DayEventDetailView\").</p>",
            "examples": ["../demo/View-DayList_DayEventList.htm"]
        },
        {
            "name": "daysInAppointmentView",
            "tags": ["UI", "AppointmentView"],
            "default": "7",
            "datatype": "Integer",
            "options": "",
            "description": "<p><code>daysInAppointmentView</code> is a value of Days To Display in AppointmentView.</p>",
            "examples": ["../demo/View-Appointment.htm"]
        },
        {
            "name": "agendaViewDuration",
            "tags": ["UI", "AgendaView"],
            "default": "\"Month\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"Month\"</li>\n  <li>\"Week\"</li>\n  <li>\"CustomDays\"</li>\n</ul>",
            "description": "<p>\n  <code>agendaViewDuration</code> specifies the duration of AgendaView.\n</p>",
            "examples": ["../demo/View-Agenda_Timeline2.htm"]
        },
        {
            "name": "daysInAgendaView",
            "tags": ["UI", "AgendaView"],
            "default": "15",
            "datatype": "Integer",
            "options": "",
            "description": "<p>\n  <code>daysInAgendaView</code> is a value of days to display in the AgendaView if \"agendaViewDuration: CustomDays\".\n</p>",
            "examples": ["../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "agendaViewTheme",
            "tags": ["UI", "AgendaView"],
            "default": "Timeline2",
            "datatype": "String",
            "options": "<ul>\n  <li>\"Timeline1\"</li>\n  <li>\"Timeline2\"</li>\n  <li>\"Timeline3\"</li>\n</ul>",
            "description": "<p>\n  Set theme of Agenda View. You can have a look at all themes of Agenda View in Demo.\n</p>\n",
            "examples": ["../demo/View-Agenda_Timeline3.htm"]
        },
        {
            "name": "showDaysWithNoEventsInAgendaView",
            "tags": ["UI", "AgendaView"],
            "default": "false",
            "datatype": "Boolean",
            "options": "",
            "description": "<p>\n  Set whether you want to show Days with no events in Agenda View. If you set it to true, \"No Events\" text is displayed below Date String.\n</p>"
        },
        {
            "name": "fixedHeightOfWeekPlannerViewCells",
            "tags": ["UI", "WeekPlannerView"],
            "default": "true",
            "datatype": "Boolean",
            "options": "",
            "description": "<p>\n  Set whether you want to display a fixed height for each cell of \"WeekPlannerView\".\n</p>\n<p>\n  If you set <code>fixedHeightOfWeekPlannerViewCells</code> to true, each cell of \"WeekPlannerView\" is assigned a height based on height available for calendar. Each cell is made scrollable so you can view entire content added in each cell. \n  View Demo in Web section.\n</p>\n<p>\n  If you set <code>fixedHeightOfWeekPlannerViewCells</code> to false, height of cell increases as elements are added in cells and \"WeekPlannerView\" is made scrollable rather than cells. View Demo in Web section.\n</p>\n",
            "examples": ["../demo/View-WeekPlanner.htm"]
        },
        {
            "name": "quickAgendaViewDuration",
            "tags": ["UI", "QuickAgendaView"],
            "default": "\"Week\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"Week\"</li>\n  <li>\"CustomDays\"</li>\n</ul>",
            "description": "<p>\n  <code>quickAgendaViewDuration</code> specifies the duration of Quick Agenda View.\n</p>",
            "examples": ["../demo/Mobile/View-QuickAgenda.htm"]
        },
        {
            "name": "daysInQuickAgendaView",
            "tags": ["UI", "QuickAgendaView"],
            "default": "5",
            "datatype": "Integer",
            "options": "",
            "description": "<p>\n  <code>daysInQuickAgendaView</code> is a value of days to display in the Quick Agenda View if \"quickAgendaViewDuration: CustomDays\".\n</p>",
            "examples": ["../demo/Mobile/View-QuickAgenda.htm"]
        },
        {
            "name": "taskPlannerViewDuration",
            "tags": ["UI", "TaskPlannerView"],
            "default": "\"Week\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"Week\"</li>\n  <li>\"CustomDays\"</li>\n</ul>",
            "description": "<p>\n  <code>taskPlannerViewDuration</code> specifies the duration of Task Planner View.\n</p>",
            "examples": ["../demo/Mobile/View-TaskPlanner.htm"]
        },
        {
            "name": "daysInTaskPlannerView",
            "tags": ["UI", "TaskPlannerView"],
            "default": "5",
            "datatype": "Integer",
            "options": "",
            "description": "<p>\n  <code>daysInTaskPlannerView</code> is a value of days to display in the Task Planner View if \"taskPlannerViewDuration: CustomDays\".\n</p>",
            "examples": ["../demo/Mobile/View-TaskPlanner.htm"]
        },
        {
            "name": "fixedHeightOfTaskPlannerView",
            "tags": ["UI", "TaskPlannerView"],
            "default": "true",
            "datatype": "Boolean",
            "options": "",
            "description": "<p>\n  Set whether you want to display a fixed height for each cell of \"TaskPlannerView\".\n</p>\n<p>\n  If you set <code>fixedHeightOfTaskPlannerView</code> to true, \"TaskPlannerView\" will be displayed with a height based on height available for calendar causing view to become scrollable for overflowing events/tasks.\n</p>\n<p>\n  If you set <code>fixedHeightOfTaskPlannerView</code> to false, height of \"TaskPlannerView\" will increase as events/tasks are added in cells.\n</p>\n",
            "examples": ["../demo/View-TaskPlanner.htm"]
        },
        {
            "name": "transitionSpeed",
            "tags": ["UI"],
            "default": "300",
            "datatype": "Integer",
            "options": "",
            "description": "<p>\n  <code>transitionSpeed</code> is a value of View Transition Animation Speed in milliseconds.\n</p>"
        },
        {
            "name": "showTransition",
            "tags": ["UI"],
            "default": "true",
            "datatype": "Boolean",
            "options": "",
            "description": "<p>\n  <code>showTransition</code> specifies whether to perform view transition animations or simply replace a view.\n</p>"
        },
        {
            "name": "fixedNumberOfWeeksInMonthView",
            "tags": ["UI", "DetailedMonthView", "MonthView"],
            "default": "false",
            "datatype": "Boolean",
            "options": "",
            "description": "<p>\n  If <code>fixedNumberOfWeeksInMonthView</code> is set to true, 6 weeks will be displayed in month views.\n  Else, number of weeks for a selected month will be displayed.\n</p>"
        },
        {
            "name": "displayWeekNumInMonthView",
            "tags": ["UI", "DetailedMonthView", "MonthView"],
            "default": "false",
            "datatype": "Boolean",
            "options": "",
            "description": "<p>\n  <code>displayWeekNumInMonthView</code> specifies whether to display Week Number in MonthView and DetailedMonthView.\n</p>",
            "examples": ["../demo/View-DetailedMonth.htm"]
        },
        {
            "name": "actionOnDayClickInMonthView",
            "tags": ["UI", "MonthView"],
            "default": "\"ModifyEventList\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"ModifyEventList\"</li>\n  <li>\"ChangeDate\"</li>\n  <li>\"DisplayEventListDialog\"</li>  \n</ul>",
            "description": "<p>\n  <code>actionOnDayClickInMonthView</code> defines action to perform on day click in MonthView. \n</p>\n<p>\n  <b>\"ModifyEventList\"</b> - if EventList View is added, this option can be used to modify Event List.\n</p>\n<p>\n  <b>\"Change Date\"</b> - Use MonthView as a DatePicker.\n</p>\n<p>\n  <b>\"DisplayEventListDialog\"</b> - Display EventList in a Dialog which is positioned relative to the Day cell in MonthView.\n</p>",
            "examples": ["../demo/View-Month_Events_Dialog.htm", "../demo/Mobile/View-Month_Events_Dialog.htm"]
        },
        {
            "name": "eventIndicatorInMonthView",
            "tags": ["UI", "MonthView"],
            "default": "\"Events\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"Events\"</li>\n  <li>\"DayHighlight\"</li>\n  <li>\"Custom\"</li>\n</ul>",
            "description": "<p>\n  <code>eventIndicatorInMonthView</code> is used to set whether to add Events or Event Indicator Line or Custom Event View in the MonthView.\n  You will have to write code for Custom Event View creation in the <a class=\\\"parameter-link icon-link\\\" href=\"#link-modifyCustomView\"><code>modifyCustomView</code></a> function.\n</p>",
            "examples": ["../demo/View-Month_DayHighlight_List.htm", "../demo/Mobile/View-Month_DayHighlight_List.htm", "../demo/View-Month_Custom_Events_Dialog"]
        },
        {
            "name": "eventIndicatorInDatePicker",
            "tags": ["UI", "DatePicker"],
            "default": "\"DayNumberBold\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"DayNumberBold\"</li>\n  <li>\"Dot\"</li>\n</ul>",
            "description": "<p>\n  <code>eventIndicatorInDatePicker</code> is used to set the way to indicate the existence of Events for day. If events exist for day, day number is displayed in bold font or dot is displayed below day number. \n</p>",
            "examples": ["../demo/View-DetailedMonth.htm"]
        },
        {
            "name": "eventIndicatorInDayListView",
            "tags": ["UI", "DayListView"],
            "default": "\"Events\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"DayHighlight\"</li>\n  <li>\"Custom\"</li>\n</ul>",
            "description": "<p>\n  <code>eventIndicatorInDayListView</code> is used to set whether to Event Indicator Line or Custom Event View in the DayListView.\n  You will have to write code for Custom Event View creation in the <a class=\\\"parameter-link icon-link\\\" href=\"#link-modifyCustomView\"><code>modifyCustomView</code></a> function.\n</p>",
            "examples": ["../demo/View-DayList_DayEventList_Custom_EventCount.htm", "../demo/Mobile/View-DayList_DayEventList_Custom_Event.htm"]
        },
        {
            "name": "averageEventsPerDayForDayHighlightView",
            "tags": ["UI", "MonthView"],
            "default": "5",
            "datatype": "Integer",
            "options": "",
            "description": "<p>\n  Width of the Day Highlighter Line is calculated as a percentage of <code>averageEventsPerDayForDayHighlightView</code>.\n</p>",
            "examples": ["../demo/View-Month_DayHighlight_List.htm"]
        },
        {
           "name": "hideExtraEvents",
           "tags": ["UI", "DetailedMonthView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  If set to true, height of all rows of DetailedMonthView is set equal and Events that fit into the Row are added. \n  <a class=\"parameter-link icon-link\" href=\"#link-hiddenEventsIndicatorLabel\"><code>hiddenEventsIndicatorLabel</code></a> is added in the days for which all events can not be added. \n  <a class=\"parameter-link icon-link\" href=\"#link-hiddenEventsIndicatorAction\"><code>hiddenEventsIndicatorAction</code></a> will be taken on click of <a class=\"parameter-link icon-link\" href=\"#link-hiddenEventsIndicatorLabel\"><code>hiddenEventsIndicatorLabel</code></a>.\n</p>\n<p>\n  If set to false, height of each row in the DetailedMonthView will be increased to accommodate all events for the day.\n</p>\n",
            "examples": ["../demo/View-DetailedMonth_HideExtraEvents.htm"]
        },
        {
           "name": "hiddenEventsIndicatorLabel",
           "tags": ["UI", "DetailedMonthView", "i18n"],
           "default": "\"+(count) more\"",
           "datatype": "String",
           "options": "",
           "description": "<p>\n  If <a class=\"parameter-link icon-link\" href=\"#link-hideExtraEvents\"><code>hideExtraEvents</code></a> is set to true, height of all rows of DetailedMonthView is set equal and Events that fit into the Row are added. \n  <code>hiddenEventsIndicatorLabel</code> is added in the days for which all events can not be added. \n  <a class=\"parameter-link icon-link\" href=\"#link-hiddenEventsIndicatorAction\"><code>hiddenEventsIndicatorAction</code></a> will be taken on click of <code>hiddenEventsIndicatorLabel</code>.\n  You can set any string or html string as a <code>hiddenEventsIndicatorLabel</code>.\n  If you want to show count of hidden events in the <code>hiddenEventsIndicatorLabel</code> you can use string \"(count)\".\n</p>\n"
        },
        {
           "name": "hiddenEventsIndicatorAction",
           "tags": ["UI", "DetailedMonthView"],
           "default": "\"ShowEventDialog\"",
           "datatype": "<ul>\n  <li>String Specifying Action(\"ShowEventDialog\")</li>\n  <li>Callback Function</li>\n  ",
           "options": "",
           "description": "<p>\n  This is an action to be taken on click of <a class=\"parameter-link icon-link\" href=\"#link-hiddenEventsIndicatorLabel\"><code>hiddenEventsIndicatorLabel</code></a>.\n</p>\n<p>\n  With the default action, \"ShowEventDialog\", Event dialog listing all events will be displayed over a Month Day cell for which <a class=\"parameter-link icon-link\" href=\"#link-hiddenEventsIndicatorLabel\"><code>hiddenEventsIndicatorLabel</code></a> is clicked.\n</p>\n<p>\n  <code>hiddenEventsIndicatorAction</code> can also be used as a callback function with parameters (dDate, oArrEvents, bShow).\n  Here, \n  dDate is the date for which event is triggered,\n  oArrEvents is the array of Events for dDate,\n  bShow indicates whether callback is to show dialog/start action or hide dialog/end action.\n</p>  \n"
        },
        {
           "name": "addEventsInMonthView",
           "tags": ["UI", "MonthView", "DetailedMonthView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  If set to false, events will not be displayed on the calendar even if calDataSource is specified.\n</p>"
        },
        {
           "name": "displayEventsInMonthView",
           "tags": ["UI", "MonthView", "DetailedMonthView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  If set to false, events will not be displayed on the calendar even if calDataSource is specified. \n  But Event Dialog can be displayed. \n  This View can be used where less space is available for displaying calendar.\n</p>",
            "examples": ["../demo/View-Month_Events_Hidden.htm"]
        },
        {
           "name": "isDragNDropInMonthView",
           "tags": ["UI", "MonthView", "DetailedMonthView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  Enable or disable Drag and Drop of Event in Month View.\n</p>\n<p><code>isDragNDropInMonthView</code> can be specified in -  </p>\n\t<ul>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>\"config\" in calDataSource</code></a> - if its value for the calDataSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a> - if its value for the Calendar in eventCalendarSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>Events</code></a> - if its value for the Event in eventSource is different than one specified in other places.</li>\n\t</ul>\n<p>\n  Also read, <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInMonthView\"><code>isDragNDropInMonthView Property Preferences</code></a> to decide where to set a value of the property.\n</p>",
            "examples": ["../demo/Mobile/View-Month_Events_List.htm"]
        },
        {
           "name": "isTooltipInMonthView",
           "tags": ["UI", "MonthView", "DetailedMonthView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  Show or hide Event Tooltip in Month View.\n</p>\n<p><code>isTooltipInMonthView</code> can be specified in -  </p>\n    <ul>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>\"config\" in calDataSource</code></a> - if its value for the calDataSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a> - if its value for the Calendar in eventCalendarSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>Events</code></a> - if its value for the Event in eventSource is different than one specified in other places.</li>\n    </ul>\n<p>\n  Also read, <a class=\"parameter-link icon-link\" href=\"#link-isTooltipInMonthView\"><code>isTooltipInMonthView Property Preferences</code></a> to decide where to set a value of the property.\n</p>",
            "examples": ["../demo/Mobile/View-Month_Events_List.htm"]
        },
        {
           "name": "isDragNDropInDetailView",
           "tags": ["UI", "DetailView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  Enable or disable Drag and Drop of Event in Detail View.\n</p>\n<p><code>isDragNDropInDetailView</code> can be specified in -  </p>\n\t<ul>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>\"config\" in calDataSource</code></a> - if its value for the calDataSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a> - if its value for the Calendar in eventCalendarSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>Events</code></a> - if its value for the Event in eventSource is different than one specified in other places.</li>\n\t</ul>\n<p>\n  Also read, <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInDetailView\"><code>isDragNDropInDetailView Property Preferences</code></a> to decide where to set a value of the property.\n</p>"
        },
        {
           "name": "isResizeInDetailView",
           "tags": ["UI", "DetailView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  Enable or disable Resizing of Event in Detail View.\n</p>\n<p><code>isResizeInDetailView</code> can be specified in -  </p>\n\t<ul>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>\"config\" in calDataSource</code></a> - if its value for the calDataSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a> - if its value for the Calendar in eventCalendarSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>Events</code></a> - if its value for the Event in eventSource is different than one specified in other places.</li>\n\t</ul>\n<p>\n  Also read, <a class=\"parameter-link icon-link\" href=\"#link-isResizeInDetailView\"><code>isResizeInDetailView Property Preferences</code></a> to decide where to set a value of the property.\n</p>"
        },
        {
           "name": "isTooltipInDetailView",
           "tags": ["UI", "DetailView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  Show or hide Event Tooltip in Detail View.\n</p>\n<p><code>isTooltipInDetailView</code> can be specified in -  </p>\n    <ul>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>\"config\" in calDataSource</code></a> - if its value for the calDataSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a> - if its value for the Calendar in eventCalendarSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>Events</code></a> - if its value for the Event in eventSource is different than one specified in other places.</li>\n    </ul>\n<p>\n  Also read, <a class=\"parameter-link icon-link\" href=\"#link-isTooltipInDetailView\"><code>isTooltipInDetailView Property Preferences</code></a> to decide where to set a value of the property.\n</p>",
            "examples": ["../demo/Mobile/QuickUse-Default.htm"]
        },
        {
           "name": "isDragNDropInQuickAgendaView",
           "tags": ["UI", "QuickAgendaView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  Enable or disable Drag and Drop of Event in Quick Agenda View.\n</p>\n<p><code>isDragNDropInQuickAgendaView</code> can be specified in -  </p>\n\t<ul>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>\"config\" in calDataSource</code></a> - if its value for the calDataSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a> - if its value for the Calendar in eventCalendarSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>Events</code></a> - if its value for the Event in eventSource is different than one specified in other places.</li>\n\t</ul>\n<p>\n  Also read, <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInQuickAgendaView\"><code>isDragNDropInQuickAgendaView Property Preferences</code></a> to decide where to set a value of the property.\n</p>",
            "examples": ["../demo/Mobile/QuickUse-Default.htm"]
        },
        {
           "name": "isTooltipInQuickAgendaView",
           "tags": ["UI", "QuickAgendaView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  Show or hide Event Tooltip in Quick Agenda View.\n</p>\n<p><code>isTooltipInQuickAgendaView</code> can be specified in -  </p>\n    <ul>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>\"config\" in calDataSource</code></a> - if its value for the calDataSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a> - if its value for the Calendar in eventCalendarSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>Events</code></a> - if its value for the Event in eventSource is different than one specified in other places.</li>\n    </ul>\n<p>\n  Also read, <a class=\"parameter-link icon-link\" href=\"#link-isTooltipInQuickAgendaView\"><code>isTooltipInQuickAgendaView Property Preferences</code></a> to decide where to set a value of the property.\n</p>"
        },
        {
           "name": "isDragNDropInTaskPlannerView",
           "tags": ["UI", "TaskPlannerView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  Enable or disable Drag and Drop of Event in Task Planner View.\n</p>\n<p><code>isDragNDropInTaskPlannerView</code> can be specified in -  </p>\n\t<ul>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>\"config\" in calDataSource</code></a> - if its value for the calDataSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a> - if its value for the Calendar in eventCalendarSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>Events</code></a> - if its value for the Event in eventSource is different than one specified in other places.</li>\n\t</ul>\n<p>\n  Also read, <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInTaskPlannerView\"><code>link-isDragNDropInTaskPlannerView Property Preferences</code></a> to decide where to set a value of the property.\n</p>"
        },
        {
           "name": "isTooltipInTaskPlannerView",
           "tags": ["UI", "TaskPlannerView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  Show or hide Event Tooltip in Task Planner View.\n</p>\n<p><code>isTooltipInTaskPlannerView</code> can be specified in -  </p>\n    <ul>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>\"config\" in calDataSource</code></a> - if its value for the calDataSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a> - if its value for the Calendar in eventCalendarSource is different than one specified in other places.</li>\n      <li><a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>Events</code></a> - if its value for the Event in eventSource is different than one specified in other places.</li>\n    </ul>\n<p>\n  Also read, <a class=\"parameter-link icon-link\" href=\"#link-isTooltipInTaskPlannerView\"><code>isTooltipInTaskPlannerView Property Preferences</code></a> to decide where to set a value of the property.\n</p>",
            "examples": ["../demo/Mobile/View-TaskPlanner.htm"]
        },
        {
           "name": "isTooltipInAppointmentView",
           "tags": ["UI", "AppointmentView"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p><code>isTooltipInAppointmentView</code> specifies whether to show or hide tooltip in AppointmentView.</p>",
            "examples": ["../demo/Mobile/View-Appointment.htm"]
        },
        {
           "name": "actionBarHeight",
           "tags": ["UI", "FilterBar"],
           "default": "30",
           "datatype": "Integer",
           "options": "",
           "description": "<p>Set Height Of Action Bar.</p>"
        },
        {
           "name": "filterBarPosition",
           "tags": ["UI", "FilterBar"],
           "default": "\"Top\"",
           "datatype": "String",
           "options": "<ul>\n  <li>\"Top\"</li>\n  <li>\"Bottom\"</li>\n  <li>\"Left\"</li>\n  <li>\"Right\"</li>\n</ul>",
           "description": "<p>Set Position of Filter Bar in the View.</p>",
            "examples": ["../demo/Section-FilterRight.htm"]
        },
        {
           "name": "filterBarHeight",
           "tags": ["UI", "FilterBar"],
           "default": "100",
           "datatype": "Integer",
           "options": "",
           "description": "<p>Set Height Of Filter Bar.</p>"
        },
        {
           "name": "filterBarWidth",
           "tags": ["UI", "FilterBar"],
           "default": "200",
           "datatype": "Integer",
           "options": "",
           "description": "<p>Set Width Of Filter Bar.</p>"
        },
        {
           "name": "eventFilterCriteria",
           "tags": ["UI", "FilterBar"],
           "default": "[]",
           "datatype": "Array",
           "options": "",
           "description": "<p><code>eventFilterCriteria</code> is an array used to set parameters of Filter to be applied on Events Array. </p>\n<p>See Sample Structure of <a class=\"parameter-link icon-link\" href=\"#link-eventFilterCriteria-IA\"><code>eventFilterCriteria</code></a></p>",
            "examples": ["../demo/Section-Filter.htm"]
        },
        {
           "name": "noneSelectedFilterAction",
           "tags": ["UI", "FilterBar"],
           "default": "\"SelectNone\"",
           "datatype": "String",
           "options": "<ul>\n  <li>\"SelectNone\"</li>\n  <li>\"SelectAll\"</li>\n</ul>",
           "description": "<p><code>noneSelectedFilterAction</code> defines an action to take when no filter criteria is selected by user.</p>\n<p><b>\"SelectNone\"</b> - Events are not displayed on the Calendar.</p>\n<p><b>\"SelectAll\"</b> - All Events are displayed on the Calendar.</p>",
            "examples": ["../demo/Section-Filter.htm"]
        },
        {
           "name": "calendarBorderColor",
           "tags": ["UI"],
           "default": "\"F6F6F6\"",
           "datatype": "Color(in hexadecimal format)",
           "options": "",
           "description": "<p>\n  If <a class=\"parameter-link icon-link\" href=\"#link-changeCalendarBorderColorInJS\"><code>changeCalendarBorderColorInJS</code></a> is set to true then, calendarBorderColor value will be set as a border-color of all calendar structure borders. \n  Else, border-color specified in CSS will be rendered.\n</p>"
        },
        {
           "name": "changeCalendarBorderColorInJS",
           "tags": ["UI"],
           "default": "false",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  If <code>changeCalendarBorderColorInJS</code> is set to true then, <a class=\"parameter-link icon-link\" href=\"#link-calendarBorderColor\"><code>calendarBorderColor</code></a> value will be set as a border-color of all calendar structure borders. \n  Else, border-color specified in CSS will be rendered.\n</p>"
        },
        {
           "name": "extraMonthsForDataLoading",
           "tags": ["Basic", "Data"],
           "default": "1",
           "datatype": "Integer",
           "options": "",
           "description": "<p>\n  <code>extraMonthsForDataLoading</code> defines a number of months for which data needs to be loaded. \n</p>\n<p>\n  Total Months for which data is loaded is (<code>extraMonthsForDataLoading</code> * 2) + 1.\n</p>\n<p>\n  The default value of 1 indicate that, load data for one extra month before and after.\n</p>\n<p>\n  For example, if Current Month is June(6), then data for May(6-1), June(6) and July(6+1) is loaded.\n</p>"
        },
        {
           "name": "deleteOldDataWhileNavigating",
           "tags": ["Basic", "Data"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  When <a class=\"parameter-link icon-link\" href=\"#link-extraMonthsForDataLoading\"><code>extraMonthsForDataLoading</code></a> is set to a value other than 0, data for specified number of extra months is loaded.\n</p>\n<p>\n  If <a class=\"parameter-link icon-link\" href=\"#link-extraMonthsForDataLoading\"><code>extraMonthsForDataLoading</code></a> is set to 1 and Current Month is June(6), then data for May(6-1), June(6) and July(6+1) is loaded.\n</p>\n<p>\n  If \"Previous\" button is clicked, then Current Month is May(5), Previous Month is April(5-1) and next Month is June(5+1). But data for May, June and July is already present so data for April is requested and the data for July is deleted.\n</p>\n<p>\n  If you don't want to delete existing data while navigating then set <a class=\"parameter-link icon-link\" href=\"#link-deleteOldDataWhileNavigating\"><code>deleteOldDataWhileNavigating</code></a> to false.\n</p>\n<p>\n  If you set <a class=\"parameter-link icon-link\" href=\"#link-datasetModificationRule\"><code>datasetModificationRule</code></a> as \"ReplaceSpecified\", then you need to set <a class=\"parameter-link icon-link\" href=\"#link-deleteOldDataWhileNavigating\"><code>deleteOldDataWhileNavigating</code></a> to false.\n</p>"
        },
        {
           "name": "datasetModificationRule",
           "tags": ["Basic", "Data"],
           "default": "\"Default\"",
           "datatype": "String",
           "options": "<ul>\n  <li>\"Default\"</li>\n  <li>\"ReplaceAll\"</li>\n  <li>\"ReplaceSpecified\"</li>\n</ul>",
           "description": "<ul>\n  <li>\n    <p><b>\"Default\"</b> -</p>\n    <p>\n      When <a class=\"parameter-link icon-link\" href=\"#link-extraMonthsForDataLoading\"><code>extraMonthsForDataLoading</code></a> is set to a value other than 0, data for specified number of extra months is loaded.\n    </p>\n    <p>\n      If <a class=\"parameter-link icon-link\" href=\"#link-extraMonthsForDataLoading\"><code>extraMonthsForDataLoading</code></a> is 1 and Current Month is June(6), then data for May(6-1), June(6) and July(6+1) is loaded.\n    </p>\n    <p>\n      If \"Previous\" button is clicked, then Current Month is May(5), Previous Month is April(5-1) and next Month is June(5+1).\n    </p>\n    <p>\n    \tBut data for May, June and July is already present so data for April is requested and the data for July is deleted.\n    </p>\n    <p>\n      If \"Next\" button is clicked, then Current Month is July(7), Previous Month is June(7-1) and next Month is august(7+1).\n    </p>\n    <p>\n      But data for May, June and July is already present so data for August is requested and the data for May is deleted.\n  \t</p>\n  </li>\n  <li>\n    <p><b>\"ReplaceAll\"</b> -</p>\n    <p>Every time data is requested, old data is replaced. </p>\n  </li>\n  <li>\n    <p><b>\"ReplaceSpecified\"</b> -</p>\n    <p>\n      Events - Records for which \"id\" field matches with the Events in the existing dataset, are replaced. Otherwise, Events are added to the Events dataset.\n    </p>\n    <p>\n      SlotAvailability - Records for which \"start\" and \"end\" fields match with existing records, are replaced. Other records are appended to SlotAvailability dataset.\n    </p>\n    <p>\n      If you set <a class=\"parameter-link icon-link\" href=\"#link-datasetModificationRule\"><code>datasetModificationRule</code></a> as \"ReplaceSpecified\", then you need to set <a class=\"parameter-link icon-link\" href=\"#link-deleteOldDataWhileNavigating\"><code>deleteOldDataWhileNavigating</code></a> to false.\n    </p>\n  </li>\n</ul>"
        },
        {
           "name": "changeColorBasedOn",
           "tags": ["UI", "Events"],
           "default": "\"EventType\"",
           "datatype": "String",
           "options": "<ul>\n  <li>\"Event\"</li>\n  <li>\"EventCalendar\"</li>\n  <li>\"EventSource\"</li>\n</ul>",
           "description": "<p>\n  Event Color will be set based on value of <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn\"><code>changeColorBasedOn</code></a> property.\n</p>\n<p>\n  If value is \"Event\", then each Event is applied a different Color. If \"color\" is specified in the <a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>Event</code></a>, then those colors will be used, otherwise colors from <a class=\"parameter-link icon-link\" href=\"#link-eventColorsArray\"><code>eventColorsArray</code></a> will be used.\n</p>\n<p>\n  If value is \"EventCalendar\", then one color is applied to all Events in the same EventCalendar. If \"color\" is specified in the <a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a>, then those colors will be used, otherwise colors from <a class=\"parameter-link icon-link\" href=\"#link-eventColorsArray\"><code>eventColorsArray</code></a> will be used.\n</p>\n<p>\n  If value is \"EventSource\", then one color is applied to all Events from the same Source. If \"color\" is specified in the <a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>\"config\" in calDataSource</code></a>, then those colors will be used, otherwise colors from <a class=\"parameter-link icon-link\" href=\"#link-eventColorsArray\"><code>eventColorsArray</code></a> will be used.\n</p>",
            "examples": ["../demo/Data-GoogleCalendar.htm"]
        },
        {
           "name": "borderColor",
           "tags": ["UI", "Events"],
           "default": "\"\"",
           "datatype": "Color(in hexadecimal format)",
           "options": "",
           "description": "<p>\n  Default border-color of an event in case it is not specified in the Event, Event Source Array or Event Type Array. To get transparent borders, specify \"transparent\" or \"\".\n</p>"
        },
        {
           "name": "textColor",
           "tags": ["UI", "Events"],
           "default": "\"FFFFFF\"",
           "datatype": "Color(in hexadecimal format)",
           "options": "",
           "description": "<p>\n  Default text-color of an event in case it is not specified in the <a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>eventSource</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>calDataSource</code></a> or <a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a>.\n</p>",
           "examples": ["../demo/View-Month_Custom_Events_Dialog.htm"]
        },
        {
           "name": "onlyTextForNonAllDayEvents",
           "tags": ["UI", "Events", "DetailedMonthView", "QuickAgendaView"],
           "default": "",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>\n  When <code>onlyTextForNonAllDayEvents</code> is set to true, Non All Day Event is displayed as a Text in nonAllDayEventsTextColor; else it is displayed same as All Day Event.\n</p>\n<p>\n  This is applicable only for \"DetailedMonthView\" and \"QuickAgendaView\".\n</p>"
        },
        {
           "name": "eventColorsArray",
           "tags": ["UI", "Events"],
           "default": "[\"89C4E2\", \"EDB8B5\", \"78D2B3\", \"C4ADD2\", \"B7CDF4\", \"C1DAD6\", \"EBB6B0\", \"FFD45B\", \"09829A\", \"D3649F\"]",
           "datatype": "Array of Colors(in hexadecimal format)",
           "options": "",
           "description": "<p>\n  If Event Color is not specified in <a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>eventSource</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>calDataSource</code></a> or <a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a>, a Color from this array will be assigned to the Event. \n  If all colors from this array are used up then, programmatically generated colors will be assigned.\n</p>"
        },
        {
           "name": "eventIcon",
           "tags": ["UI", "Events"],
           "default": "\"Dot\"",
           "datatype": "String",
           "options": "<ul>\n  <li>\"Dot\"</li>\n  <li>\"cs-icon-Event\"</li>\n</ul>",
           "description": "<p>\n  Default Event Indicator in case it event Icon is not specified in the <a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>eventSource</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-calDataSource\"><code>calDataSource</code></a> or <a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a>.\n</p>\n<p>\n  You can use your own font icon class in place of cs-icon-Event.\n</p>"
        },
        {
           "name": "hideEventIcon",
           "tags": ["UI", "Events"],
           "default": "<pre>{\n  Default: false,\n  DetailedMonthView: false,\n  MonthView: false,\n  WeekView: false,\n  DayView: false,\n  CustomView: false,\n  QuickAgendaView: false,\n  TaskPlannerView: false,\n  DayEventDetailView: false,\n  AgendaView: false,\n  WeekPlannerView: false\n}</pre>",
           "datatype": "Object",
           "options": "",
           "description": "<p>\n  Event Icon is displayed, if <code>hideEventIcon</code> is set to false for a particular view, otherwise it will not be displayed.\n</p>\n<p>\n  If you want hide/show Event Icon, you can set Default parameter of <code>hideEventIcon</code> to true/false.\n</p>",
           "examples": ["../demo/Mobile/QuickUse-Default.htm"]
        },
        {
           "name": "hideEventTime",
           "tags": ["UI", "Events"],
           "default": "<pre>{\n  Default: false,\n  DetailedMonthView: false,\n  MonthView: false,\n  WeekView: false,\n  DayView: false,\n  CustomView: false,\n  QuickAgendaView: false,\n  TaskPlannerView: false,\n  DayEventDetailView: false,\n  AgendaView: false,\n  WeekPlannerView: false\n}</pre>",
           "datatype": "Object",
           "options": "",
           "description": "<p>\n  Event Time is displayed, if <code>hideEventTime</code> is set to false for a particular view, otherwise it will not be displayed.\n</p>\n<p>\n  If you want hide/show Event Time, you can set Default parameter of <code>hideEventTime</code> to true/false.\n</p>",
           "examples": ["../demo/Mobile/QuickUse-Default.htm"]
        },
        {
            "name": "businessHoursSource",
            "tags": ["Data"],
            "default": "<pre>[\n  {\n    \"dayName\": \"Monday\", \n    \"times\": [\n    {\n        \"startTime\": \"10:00\", \n        \"endTime\": \"17:00\"\n    }]\n  },\n  {\n    \"dayName\": \"Tuesday\", \n    \"times\": [\n    {\n        \"startTime\": \"10:00\", \n        \"endTime\": \"17:00\"\n    }]\n  },\n  {\n    \"dayName\": \"Wednesday\", \n    \"times\": [\n    {\n        \"startTime\": \"10:00\", \n        \"endTime\": \"17:00\"\n    }]\n  },\n  {\n    \"dayName\": \"Thursday\", \n    \"times\": [\n    {\n        \"startTime\": \"10:00\", \n        \"endTime\": \"17:00\"\n    }]\n  },\n  {\n    \"dayName\": \"Friday\", \n    \"times\": [\n    {\n        \"startTime\": \"10:00\", \n        \"endTime\": \"17:00\"\n    }]\n  }\n]</pre>",
            "datatype": "Array",
            "options": "",
            "description": "<p>It is an array of business Hours for each Day of the Week.</p>"
        },
        {
            "name": "excludeNonBusinessHours",
            "tags": ["UI", "Data"],
            "default": "false",
            "datatype": "Boolean",
            "options": "",
            "description": "<p>Hide dates and times apart from business hours.</p>",
           "examples": ["../demo/Other-Exclude_NonBusinessHours.htm"]
        },
        {
            "name": "isNonBusinessHoursDroppable",
            "tags": ["UI", "Data", "DetailedMonthView", "MonthView", "DetailView", "QuickAgendaView", "TaskPlannerView"],
            "default": "true",
            "datatype": "Boolean",
            "options": "",
            "description": "<p>Allow events to be dropped on Non Business Hours.</p>",
           "examples": ["../demo/Data-RestrictedSection.htm"]
        },
        {
            "name": "isRestrictedSectionDroppable",
            "tags": ["UI", "Data", "DetailedMonthView", "MonthView", "DetailView", "QuickAgendaView", "TaskPlannerView"],
            "default": "true",
            "datatype": "Boolean",
            "options": "",
            "description": "<p>\n  Allow events to be dropped on Restricted Section. \n  You can also set <code>isDroppable</code> property of a <a class=\"parameter-link icon-link\" href=\"#link-restrictedSectionSource-IA\"><code>Restricted Section</code></a>.\n</p>",
           "examples": ["../demo/Data-RestrictedSection.htm"]
        },
        {
           "name": "calDataSource",
           "tags": ["Data", "Events"],
           "default": "[]",
           "datatype": "Object",
           "options": "<p>JSON object set to source in calDataSource with sourceType as a JSON</p>\n<p>OR</p>\n<p>JSON object returned by URL specified as a source in calDataSource with sourceType as a URL</p>\n\n<pre>\n{\n    eventSource: [], // Array of Event objects; add only if required\n    \n    eventCalendarSource: [] // Array of Event Calendar objects; add only if required\n    \n    restrictedSectionSource: [], // Array of Restricted Section objects; add only if required\n    \n    slotAvailabilitySource: [], // Array of Slot Availability objects; add only if required\n    \n    sourceCount: [], // Array of Event Count or TimeSlot Count objects; add only if required\n}\n</pre>\n\n<p>calDataSource with sourceType as a JSON</p>\n\n<pre>\ncalDataSource: \n[\n    {\n        sourceFetchType: \"ALL\",\n        sourceType: \"JSON\",\t\t\t\t\t\t\n        source: \n        {\n            eventSource: \n            [\n                {\n                  \"identifier\": \"1\", \n                  \"isAllDay\": false, \n                  \"start\": \"22-02-2014 09:00\",\n                  \"end\": \"22-02-2014 10:00\",\n                  \"calendar\": \"Meeting\", \n                  \"tag\": \"Work\",\n                  \"title\": \"Meeting with Ana\", \n                  \"description\": \"\", \n                  \"url\": \"\", \n\n                  \"icon\": \"icon-Meeting\", \n                  \"color\": \"20DAEC\", \n                  \"borderColor\": \"000000\", \n                  \"textColor\": \"000000\",\n                  \"nonAllDayEventsTextColor\": \"000000\",\n\n                  \"isDragNDropInMonthView\": true, \n                  \"isDragNDropInDetailView\": true, \n                  \"isResizeInDetailView\": true \n                }\n            ]\n        }\n    }\n]\n</pre>\n\n<p>calDataSource with sourceType as a FUNCTION</p>\n\n<pre>\ncalDataSource: \n[\n    {\n        sourceFetchType: \"DATERANGE\",\n        sourceType: \"FUNCTION\",\t\t\t\t\t\t\n        source: function(fetchStartDate, fetchEndDate, durationStartDate, durationEndDate, oConfig, loadViewCallback)\n        {\n            var calObj1 = this;\n            calObj1.incrementDataLoadingCount(1);\n\n            var oEventResponse = generateJsonEvents(fetchStartDate, fetchEndDate);\n            if(oEventResponse != undefined)\n            {\n                if(oEventResponse[0])\n                {\n                    calObj1.parseDataSource(\"eventSource\", oEventResponse[1], durationStartDate, durationEndDate, loadViewCallback, oConfig, false);\n                }\n            }\n        }\n    }\n]\n</pre>\n\n<p>calDataSource with sourceType as a URL</p>\n\n<pre>\ncalDataSource: \n[\n    {\n        sourceFetchType: \"DATERANGE\",\n        sourceType: \"URL\",\n        source: \"Your API EndPoint\" \n    }\n]\n</pre>\n\n\n<p>calDataSource with sourceType as a URL(Google Calendar)</p>\n\n<pre>\ncalDataSource: \n[\n    {\n        sourceFetchType: \"DATERANGE\",\n        sourceType: \"URL\",\n        source: \"https://www.google.com/calendar/ical/en-gb.usa%23holiday%40group.v.calendar.google.com/public/basic\"\n    }\n]\n</pre>\n\n<p>calDataSource with config</p>\n\n<pre>\ncalDataSource: \n[\n    {\n        sourceFetchType: \"DATERANGE\",\n        sourceType: \"URL\",\n        config:\n        {\n            changeColorBasedOn: \"EventSource\",\n            color: \"DB5F69\"\n        },\n        source: \"https://www.google.com/calendar/ical/en-gb.usa%23holiday%40group.v.calendar.google.com/public/basic\"\n    }\n]\n</pre>",
           "description": "<p>\n  calDataSource is an array of objects in which you can specify settings to load data.\n</p>\n<p>\n  Each object in calDataSource has following properties - \n</p>\n<ul>\n  <li>\n    <p><b>sourceFetchType</b> - </p>\n    <p>Options: \"ALL\" or \"DATERANGE\"</p>\n    <p>The value of this property defines when to load the data.</p>\n    <ul>\n    \t<li>If sourceFetchType is set to \"ALL\", data is loaded once after plugin initialization.</li>\n    \t<li>If sourceFetchType is set to \"DATERANGE\", data is loaded on every navigation event.</li>\n  \t</ul>\n  </li>\n  <li>\n    <p><b>sourceType</b> - </p>\n    <p>Options: \"JSON\" or \"FUNCTION\" or \"URL\"</p>\n    <p>It should be set based on the type of source you will be specifying in the <code>calDataSource</code></p>\n    <ul>\n    \t<li>If sourceType is \"JSON\", source object is parsed as JSON</li>\n   \t\t<li>If sourceType is \"FUNCTION\", it is called on plugin initialization and each navigation event.</li>\n    \t<li>If sourceType is \"URL\", ajax request will be sent to the URL specified.</li>\n    </ul>\n  </li>\n  <li>\n    <p><b>source</b> - </p>\n    <p>Options: JSON source or FUNCTION returning JSON or URL returning JSON </p>\n    <p>The type of source should be specified as a <code>sourceType</code></p>\n    <p>Even if you are using any type of source you need to follow json specification for <a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-eventSource-IA\"><code>eventSource</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-restrictedSectionSource-IA\"><code>restrictedSectionSource</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-slotAvailabilitySource-IA\"><code>slotAvailabilitySource</code></a>.</p>\n    <ul>\n    \t<li>If source is JSON, source object is parsed as JSON</li>\n    \t<li>\n          <p>If source is \"FUNCTION\", it is called on plugin initialization and each navigation event.</p>\n          <p>Parameters passed to this function include -</p>\n          <ul>\n            <li>fetchStartDate - start date for fetching data</li>\n            <li>fetchEndDate - end date for fetching data</li>\n            <li>durationStartDate - start date of data stored in the plugin</li>\n            <li>durationEndDate - end date of data stored in the plugin</li>\n            <li>config - <code>\"config\" in calDataSource</code></li>\n            <li>loadViewCallback - function to call after data is loaded</li>\n          </ul>\n      \t</li>\n    \t<li>If sourceType is \"URL\", ajax request will be sent to the URL specified.</li>\n    </ul>\n  </li>\n  <li>\n    <p><b>config</b> - </p>\n    <p>You can specify following data source configuration setting for each source include in <code>calDataSource</code> - </p>\n    <ul>\n      <li>tzOffset - <a class=\"parameter-link icon-link\" href=\"#link-inputTZOffset\"><code>inputTZOffset</code></a> for data source</li>\n      <li>inputDateTimeFormat - <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a> for data source</li>\n      <li>formatSeparatorDateTime - <a class=\"parameter-link icon-link\" href=\"#link-formatSeparatorDateTime\"><code>formatSeparatorDateTime</code></a> for data source</li>\n      <li>formatSeparatorDate - <a class=\"parameter-link icon-link\" href=\"#link-formatSeparatorDate\"><code>formatSeparatorDate</code></a> for data source</li>\n      <li>formatSeparatorTime - <a class=\"parameter-link icon-link\" href=\"#link-formatSeparatorTime\"><code>formatSeparatorTime</code></a> for data source</li>\n      <li>changeColorBasedOn - <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn\"><code>changeColorBasedOn</code></a> for data source</li>\n      <li>color - background color of events for data source</li>\n      <li>borderColor - <a class=\"parameter-link icon-link\" href=\"#link-borderColor\"><code>borderColor</code></a> for data source</li>\n      <li>textColor - <a class=\"parameter-link icon-link\" href=\"#link-textColor\"><code>textColor</code></a> for data source</li>\n\t  <li>nonAllDayEventsTextColor - non all day events text color for data source</li>\n      <li>icon - <a class=\"parameter-link icon-link\" href=\"#link-icon\"><code>icon</code></a> for data source</li>\n      <li>isDragNDropInMonthView - <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInMonthView\"><code>isDragNDropInMonthView</code></a> for data source</li>\n      <li>isDragNDropInDetailView - <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInDetailView\"><code>isDragNDropInDetailView</code></a> for data source</li>\n      <li>isResizeInDetailView - <a class=\"parameter-link icon-link\" href=\"#link-isResizeInDetailView\"><code>isResizeInDetailView</code></a> for data source</li>\n    </ul>\n  </li>\n</ul>",
           "examples": ["../demo/Data-URL.htm", "../demo/Data-JSON.htm", "../demo/Data-GoogleCalendar.htm", "../demo/QuickUse-Default.htm", "../demo/Data-RestrictedSection.htm", "../demo/View-Appointment.htm"]
        },
        {
            "name": "datePickerCalDataSource",
            "tags": ["Basic", "Data", "Events", "DatePicker"],
            "default": "<pre>\n[\n    {\n        config:\n        {\n            sourceCountType: \"Event\"\n        }\n    }\n]\n</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<p><code>datePickerCalDataSource</code> is used to define data source for DatePicker.</p>\n<p>Data source for the DatePicker is the sourceCount which is used to highlight dates for which data exist.</p>\n<p>Since DatePicker is created inside the plugin code, <code>datePickerCalDataSource</code> is specified in the Parent CalenStyle object initialization. A value of this property is assigned to the calDataSource parameter of the DatePicker CalenStyle object while initializing it.</p>\n<p>Data source can be specified in two ways - </p>\n<ul>\n   <li>If the default value of the <code>datePickerCalDataSource</code> (i.e. <code>datePickerCalDataSource.config.sourceCountType</code>: \"Event\") is used with <code>parentObject</code> property set to the Parent CalenStyle object of the DatePicker, \"SourceCount\" is calculated based on the eventSource data of the Parent CalenStyle object.</li>\n   <li>If data source is specified as the <a class=\"parameter-link icon-link\" href=\"#link-sourceCount-IA\"><code>sourceCount</code></a>, then data is requested.</li>\n</ul>\n<p>Dates for which data exists are styled as bold.</p>\n\n",
            "examples": ["../demo/View-Appointment.htm"]
        },
        {
            "name": "eventOrTaskStatusIndicators",
            "tags": ["UI", "Data"],
            "default": "<pre>[\n  {\n    name: \"Overdue\",\n    color: \"E74C3C\"\n  },\n  {\n    name: \"Completed\",\n    color: \"27AE60\"\n  },\n  {\n    name: \"InProgress\",\n    color: \"F1C40F\"\n  }\n]</pre>",
            "datatype": "Array",
            "options": "",
            "description": "<p>It is an array of event or task status indicators.</p>\n<p>name is the status name which is used for matching with <a class=\"parameter-link icon-link\" href=\"#link-eventSource\"><code>event</code></a> status to count events for each status to be indicated in the \"DayEventListView\" and \"DayEventDetailView\".</p>\n<p>color is the background color of the status indicators.</p>"
        },
        {
           "name": "adjustViewOnWindowResize",
           "tags": ["UI"],
           "default": "true",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>Set whether Calendar should be responsive to the Window Resize Event.</p>"
        },
        {
           "name": "useHammerjsAsGestureLibrary",
           "tags": ["UI"],
           "default": "false",
           "datatype": "Boolean",
           "options": "",
           "description": "<p>Set whether Hammer.js should be used as a Touch Gesture Library. Default Gestures added will be \"swiperight\" for navigating to Previous View and \"swipeleft\" for navigating to Next View.</p>",
            "examples": ["../demo/Mobile/QuickUse-TouchLibrary.htm"]
        }
    ],

    callbackfunctions:
    [
        {
            "name": "initialize",
            "tags": ["Basic"],
            "parameters": "",
            "description": "<p>Called when plugin is initialized.</p>",
            "examples": ["../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "modifyHeaderViewLabels",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>view start date(Date Object)</li>\n  <li>view end date(Date Object)</li>\n  <li>selected date(Date Object)</li>\n  <li>Header Label String</li>\n  <li>visibleView</li>\n</ul>",
            "description": "<p>\n  This function is called when Header view label is to be modified on some navigation event or view refresh event. \n  This function will be particularly useful when you design a custom Header view rather than using default Header view of CalenStyle.\n  You can either use the same Header Label String supplied as a function parameter or use your custom formatted string to display in your custom Header view.\n</p>",
            "examples": ["../demo/Section-Header_NonCalenStyle.htm"]
        },
        {
            "name": "addEventHandlersInHeader",
            "tags": ["UI"],
            "parameters": "",
            "description": "<p>\nThis function is called after default event handlers will be attached to Header view components.\n  It can be used to add event handlers to any of the CalenStyle view components.\n  For example, You can initialize any third party touch gesture library on CalenStyle view in this function, so that you can use gestures for navigation.\n</p>",
            "examples": ["../demo/Mobile/QuickUse-TouchLibrary.htm"]
        },
        {
            "name": "dataLoadingStart",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>visibleView</li>\n</ul>",
            "description": "<p>Perform operations when data loading starts.</p>\n<p>For example, show loading indicator.</p>"
        },
        {
            "name": "dataLoadingEnd",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>visibleView</li>\n</ul>",
            "description": "<p>Perform operations when data loading is complete.</p>\n<p>For example, hide loading indicator.</p>"
        },
        {
            "name": "cellClicked",
            "tags": ["UI", "DetailedMonthView", "MonthView", "DatePicker", "DetailView", "QuickAgendaView", "TaskPlannerView"],
            "parameters": "<ul>\n  <li>visibleView</li>\n  <li>datetime</li>\n  <li>isAllDay</li>\n  <li>position</li>\n</ul>",
            "description": "<p>\n  This function will be called when cell is clicked in DetailedMonthView, MonthView, Detail Views(\"WeekView\", \"DayView\", \"CustomView\"), QuickAgendaView or TaskPlannerView.\n</p>\n<p>\n  visibleView is the currently visible view, so that you will be able to write different code based on view.\n</p>\n<p>\n  datetime is datetime of the clicked area.\n</p>\n<p>\n  isAllDay will be false for all cells except cells in the non-all day time slot tables of DetailView.\n</p>\n<p>\n  position is the position of click p where p.x is left and p.y is top position.\n</p>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm", "../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "viewLoaded",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>selectedDate</li>\n  <li>datesInCurrentView</li>\n</ul>",
            "description": "<p>This function is called when calendar view is loaded for the first time.</p>",
            "examples": ["../demo/Section-Header_NonCalenStyle.htm"]
        },
        {
            "name": "previousButtonClicked",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>selectedDate</li>\n  <li>datesInCurrentView</li>\n</ul>",
            "description": "<p>This function is called after calendar view is updated on \"Previous\" button click.</p>",
            "examples": ["../demo/Section-Header_NonCalenStyle.htm"]
        },
        {
            "name": "nextButtonClicked",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>selectedDate</li>\n  <li>datesInCurrentView</li>\n</ul>",
            "description": "<p>This function is called after calendar view is updated on \"Next\" button click.</p>",
            "examples": ["../demo/Section-Header_NonCalenStyle.htm"]
        },
        {
            "name": "todayButtonClicked",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>selectedDate</li>\n  <li>datesInCurrentView</li>\n</ul>",
            "description": "<p>This function is called after calendar view is updated on \"Today\" button click.</p>",
            "examples": ["../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "visibleViewChanged",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>new visibleView</li>\n  <li>selectedDate</li>\n  <li>datesInCurrentView</li>\n</ul>",
            "description": "<p>This function is called after calendar view is updated when <a class=\"parameter-link icon-link\" href=\"#link-visibleView\"><code>visibleView</code></a> is changed.</p>",
            "examples": ["../demo/Section-Header_NonCalenStyle.htm"]
        },
        {
            "name": "modifyCustomView",
            "tags": ["UI", "MonthView", "DayListView"],
            "parameters": "<ul>\n  <li>array of view dates</li>\n</ul>",
            "description": "<p>\n  This function is called when event view should be modified and you set <a class=\"parameter-link icon-link\" href=\"#link-eventIndicatorInMonthView\"><code>eventIndicatorInMonthView</code></a> value as \"Custom\" for MonthView.\n  You can create your own view to display events in MonthView. You will have to append event view inside day cell of MonthView.\n</p>\n",
            "examples": ["../demo/View-DayList_DayEventList_Custom_EventCount.htm", "../demo/Mobile/View-Month_Custom_Events_Dialog.htm"]
        },
        {
            "name": "displayEventsForPeriodInListInAgendaView",
            "tags": ["UI", "Events", "EventList", "AgendaView"],
            "parameters": "<ul>\n  <li>viewdetails object which contains following information -\n    <ul>\n      <li>viewStartDate</li>\n      <li>viewEndDate</li>\n      <li>eventCount</li>\n      <li>eventList</li>\n    </ul>\n   </li>\n</ul>",
            "description": "<p>This function can be used to add EventsView in EventsList for \"AgendaView\".</p> \n<p>View for Events in EventList is not provided in the plugin. Sample code for EventList Generation and Style is included in \"CalJsonGenerator.js\" and \"CalEventList.css\" files respectively.</p>",
            "examples": ["../demo/View-Agenda_User.htm"]
        },
        {
            "name": "displayEventsForPeriodInList",
            "tags": ["UI", "Events", "EventList", "MonthView", "DayListView"],
            "parameters": "<ul>\n  <li>viewStartDate</li>\n  <li>viewEndDate</li>\n</ul>",
            "description": "<p>This function can be used to add EventsView in EventsList for \"MonthView\" and \"DayEventListView\".</p> <p>View for Events in EventList is not provided in the plugin. Sample code for EventList Generation and Style is included in \"CalJsonGenerator.js\" and \"CalEventList.css\" files respectively.</p>",
            "examples": ["../demo/View-Agenda_User.htm", "../demo/Mobile/View-DayList_DayEventList.htm"]
        },
        {
            "name": "eventListAppended",
            "tags": ["UI", "Events", "EventList"],
            "parameters": "",
            "description": "<p>This function is called after Events are appended to the Event List.</p>",
            "examples": ["../demo/View-Agenda_User.htm"]
        },
        {
            "name": "displayEventListDialog",
            "tags": ["UI", "Events", "MonthView"],
            "parameters": "<ul>\n  <li>events array for selected date</li>\n  <li>position of DisplayAllEvents button</li>\n</ul>",
            "description": "<p>This function is called when - </p>\n<ul>\n  <li><a class=\"parameter-link icon-link\" href=\"#link-actionOnDayClickInMonthView\"><code>actionOnDayClickInMonthView</code></a> is set as \"DisplayEventListDialog\"</li>\n  <li>DisplayAllEvents button for day is clicked</li>\n</ul>"
        },
        {
            "name": "eventInADialogClicked",
            "tags": ["UI", "Events", "MonthView"],
            "parameters": "<ul>\n  <li>clicked event object</li>\n</ul>",
            "description": "<p>This function is called when an Event in the Event List of Event Dialog View is clicked.</p>"
        },
        {
            "name": "eventRendered",
            "tags": ["UI", "Events", "DetailedMonthView", "DetailView", "QuickAgendaView", "TaskPlannerView"],
            "parameters": "<ul>\n  <li>oEvent - Event Object</li>\n  <li>oEventSegment - jQuery Element of Rendered Event</li>\n  <li>oEventSegmentContent - jQuery Element of Rendered Event Content</li>\n  <li>visibleView</li>\n  <li>isEventInDetailedMonthViewDialog</li>\n</ul>",
            "description": "<p>This function is called after event is added in the view and it can be used to modify view of Event or add event handlers for components inside event element.</p>\n<p>oEvent is the event object which contains event properties.</p>\n<p>oEventSegment is the jQuery object of event element. \n  This event element will have default event components added in CalenStyle.\n  So you can either modify a particular component or replace it.\n</p>\n<p>\n  oEventSegmentContent is the jQuery object of the \".cEventLink\" inside event element.\n  To modify view, you will have to replace the contents of this element, since removing/replacing contents of oEventSegment will disable event url and <a class=\"parameter-link icon-link\" href=\"#link-eventClicked\"><code>eventClicked</code></a> functionality as these events are bound on \".cEventLink\". \n</p>\n<p>\n  visibleView will help you treat events in each view differently.\n</p>\n<p>\n  isEventInDetailedMonthViewDialog will be true if function is called for events in the Dialog of \"DetailedMonthView\" which lists all events for the day.\n</p>\n\n<p>\n  You can change height of the event elements in \"DetailedMonthView\", all-day section of \"DetailView\"(\"WeekView\", \"DayView\", \"CustomView\", \"DayEventDetailView\") and \"QuickAgendaView\" by specifying height in \".cdmvEvent\", \".cdvEventAllDay\" and \".cqavEvent\" classes respectively.\n</p>\n<p>\n  Event elements in \"TaskPlannerView\" will be rendered with auto height to display entire content of the event title, in all other view the content of the title will be truncated to fit in the space allocated to event title.\n</p>",
            "examples": ["../demo/Callback-EventRendered_CustomizedEventUI.htm"]
        },
        {
            "name": "eventsAddedInView",
            "tags": ["UI", "Events"],
            "parameters": "<ul>\n  <li>visibleView</li>\n  <li>eventClass</li>\n</ul>",
            "description": "<p>This function is called when events are added in the view.</p>\n<p>This function can be used to add a custom tooltip for displaying Event Details.",
            "examples": ["../demo/Callback-EventsAdded_Tooltip.htm"]
        },
        {
            "name": "timeSlotsAddedInView",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>visibleView</li>\n  <li>timeSlotClass</li>\n</ul>",
            "description": "<p>This function is called when appointment time slots are added in the view.</p><p>For example, this function can be used to add a custom tooltip for displaying time slot availability details.</p>",
            "examples": ["../demo/Callback-EventsAdded_Tooltip.htm"]
        },
        {
            "name": "eventClicked",
            "tags": ["UI", "Events"],
            "parameters": "<ul>\n  <li>visibleView</li>\n  <li>clickedEventElementSelector</li>\n  <li>clickedEventObject</li>\n</ul>",
            "description": "<p>This function is called when event is clicked.</p>\n<p>For example, this function can be used to show Popover for displaying Event Details and adding action links like Edit and Delete buttons.",
            "examples": ["../demo/Callback-EventClicked_Popover.htm"]
        },
        {
            "name": "clickedAppointmentSlot",
            "tags": ["UI", "AppointmentView"],
            "parameters": "<ul>\n  <li>timeSlotData</li>\n  <li>timeSlotElement</li>\n</ul>",
            "description": "<p>\n  Take Action when Appointment Time Slot View is clicked by User.\n  For example, modify booking status or available booking count of the time slot.\n</p>\n<p>\n  After modifying timeSlotData, you can call <a class=\"parameter-link icon-link\" href=\"#link-modifyAppointmentSlot\"><code>modifyAppointmentSlot</code></a> function to save changes in count or status in CalenStyle Slot Availability Data for display purpose and to get a modified view for changed status or count.\n</p>",
            "examples": ["../demo/View-Appointment.htm"]
        },
        {
            "name": "saveChangesOnEventDrop",
            "tags": ["UI", "DetailView"],
            "parameters": "<ul>\n  <li>droppedEventObject</li>\n  <li>startDateBeforeDrop</li>\n  <li>endDateBeforeDrop</li>\n  <li>startDateAfterDrop</li>\n  <li>endDateAfterDrop</li>\n</ul>",
            "description": "<p>Take action on Event Drop. To Revert changes, call <a class=\"parameter-link icon-link\" href=\"#link-revertToOriginalEvent\"><code>revertToOriginalEvent</code></a></p>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm", "../demo/Callback-EventClicked_Popover.htm", "../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "saveChangesOnEventResize",
            "tags": ["UI", "DetailView"],
            "parameters": "<ul>\n  <li>resizedEventObject</li>\n  <li>startDateBeforeResizing</li>\n  <li>endDateBeforeResizing</li>\n  <li>startDateAfterResizing</li>\n  <li>endDateAfterResizing</li>\n</ul>",
            "description": "<p>Take action on Event Resize in the Detail Views(\"WeekView\", \"DayView\"). To Revert changes, call <a class=\"parameter-link icon-link\" href=\"#link-revertToOriginalEvent\"><code>revertToOriginalEvent</code></a>.</p>",
            "examples": ["../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "modifyFilterBarView",
            "tags": ["UI", "FilterBar"],
            "parameters": "<ul>\n  <li>filterBarElement</li>\n  <li>eventFilterCriteriaArray</li>\n  <li>eventFilterCountArray</li>\n</ul>",
            "description": "<p>Modify FilterBar View. FilterBar View is modified every time view is reloaded.</p>",
            "examples": ["../demo/Section-Filter.htm"]
        },
        {
            "name": "modifyActionBarView",
            "tags": ["UI", "ActionBar"],
            "parameters": "<ul>\n  <li>actionBarElement</li>\n  <li>visibleView</li>\n</ul>",
            "description": "<p>Modify ActionBar View. ActionBar View is modified every time view is reloaded.</p>",
            "examples": ["../demo/Section-ActionBar.htm"]
        },
        {
            "name": "addDaySummaryInTaskPlannerView",
            "tags": ["UI", "TaskPlannerView"],
            "parameters": "<ul>\n  <li>date</li>\n  <li>daySummaryElement</li>\n</ul>",
            "description": "<p>\n  This function can be used to add day summary view in \"TaskPlannerView\" and attach event handlers to views in day summary.\n</p>\n<p>\n  You can add day summary view for a specified day in daySummaryElement.\n</p>",
            "examples": ["../demo/View-TaskPlanner.htm"]
        }
    ],

    functions:
    [
        {
            "name": "loadView",
            "tags": ["UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "<p>Load visibleView specified in settings while initializing plugin or after modifying CalenStyle Settings.</p>",
            "examples": ["../demo/QuickUse-WidthBasedRendering.htm"]
        },
        {
            "name": "setCurrentView",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>viewName</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Set visibleView to the specified view, reload data and refresh view.</p>",
            "examples": ["../demo/Section-Header_NonCalenStyle.htm"]
        },
        {
            "name": "refreshView",
            "tags": ["UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "<p>Refresh visibleView to reflect changes in Data. </p>\n  This function should be used to refresh view after Event Data is modified using any of the following functions - \n<ul> \n  <li>\n    <a class=\"parameter-link icon-link\" href=\"#link-addEventsForSource\"><code>addEventsForSource</code></a>\n  </li> \n  <li>\n    <a class=\"parameter-link icon-link\" href=\"#link-replaceEventWithId\"><code>replaceEventWithId</code></a>\n  </li>\n  <li>\n    <a class=\"parameter-link icon-link\" href=\"#link-replaceEventsWithRule\"><code>replaceEventsWithRule</code></a>\n  </li>\n  <li>\n    <a class=\"parameter-link icon-link\" href=\"#link-replaceEvents\"><code>replaceEvents</code></a>\n  </li>\n  <li>\n    <a class=\"parameter-link icon-link\" href=\"#link-removeEventsWithIds\"><code>removeEventsWithIds</code></a>\n  </li> \n  <li>\n    <a class=\"parameter-link icon-link\" href=\"#link-removeEventsWithRule\"><code>removeEventsWithRule</code></a>\n  </li>\n  <li>\n    <a class=\"parameter-link icon-link\" href=\"#link-removeEvents\"><code>removeEvents</code></a>\n  </li>\n</ul>",
            "examples": ["../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "reloadData",
            "tags": ["Basic", "UI"],
            "parameters": "<ul>\n  <li> \n    URL Parameters Array\n    <pre>\n    [\n\n      {\n          \"sourceId\": \"source1\",\n          \"params\":[\n              {\n                  \"keyName\": \"key1\",\n                  \"values\": \"value1\"\n              },\n              {\n                  \"keyName\": \"key2\",\n                  \"values\": \"value2\"\n              }\n          ]\n      }\n\n    ]\n    </pre>\n  </li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Reload data and refresh visibleView.</p>",
            "examples": ["../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "navigateToToday",
            "tags": ["Basic", "UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "<p>Navigate To Today.</p>"
        },
        {
            "name": "navigateToPrevView",
            "tags": ["Basic", "UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "<p>Navigate To Previous View.</p>",
            "examples": ["../demo/Section-Header_NonCalenStyle.htm", "../demo/Mobile/QuickUse-jQueryMobile.htm", "../demo/Mobile/QuickUse-TouchLibrary.htm"]
        },
        {
            "name": "navigateToNextView",
            "tags": ["Basic", "UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "<p>Navigate To Next View.</p>",
            "examples": ["../demo/Section-Header_NonCalenStyle.htm", "../demo/Mobile/QuickUse-jQueryMobile.htm", "../demo/Mobile/QuickUse-TouchLibrary.htm"]
        },
        {
            "name": "getVisibleDates",
            "tags": ["Basic", "UI"],
            "parameters": "",
            "returnvalue": "Array Of Dates",
            "description": "<p>Get dates of visible in View.</p>",
            "examples": ["../demo/Section-Header_NonCalenStyle.htm"]
        },
        {
            "name": "parseDataSource",
            "tags": ["Data", "Events"],
            "parameters": "<ul>\n  <li>Source Type\n    <ul>\n      <li>\"eventCalendarSource\"</li>\n  \t  <li>\"eventSource\"</li>\n  \t  <li>\"restrictedSectionSource\"</li>\n      <li>\"slotAvailabilitySource\"</li>\n\t</ul>\n  </li>\n  <li>SourceJson</li>\n  <li>startDate</li>\n  <li>endDate</li>\n  <li>callback function to load next view</li>\n  <li>source configuration object (<code>\"config of calDataSource\"</code>)</li>\n  <li>isGoogleCalendarURL</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Parses input data and triggers view updation functions.</p>\n<p>When sourceType in a <a class=\\\"parameter-link icon-link\\\" href=\"#link-calDataSource\"><code>calDataSource</code></a> is set as \"FUNCTION\", <code>parseDataSource</code> function is used to trigger functions to parse and display data after data is loaded from function or ajax request.</p>",
            "examples": ["../demo/QuickUse-Default.htm", "../demo/Data-RestrictedSection.htm"]
        },
        {
            "name": "incrementDataLoadingCount",
            "tags": ["Data"],
            "parameters": "<ul>\n  <li>count</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Sets count of number of data sources to load.</p>\n<p>When sourceType in a <a class=\\\"parameter-link icon-link\\\" href=\"#link-calDataSource\"><code>calDataSource</code></a> is set as \"FUNCTION\", <code>incrementDataLoadingCount</code> function is used to indicate number of data sources you are loading.</p>\n<p>The value of count will be equal to number of <code>parseDataSource</code> function you will be calling inside source callback function of calDataSource.</p>\n<p>View will be displayed only after data from all data sources is loaded and parse using <code>parseDataSource</code> function.</p>",
            "examples": ["../demo/QuickUse-Default.htm", "../demo/Data-RestrictedSection.htm"]
        },
        {
            "name": "getEventWithId",
            "tags": ["Data", "Events"],
            "parameters": "<ul>\n  <li>event \"id\"</li>\n</ul>",
            "returnvalue": "Event Object",
            "description": "<p>Get Event with specified identifier.</p>",
            "examples": ["../demo/Callback-EventRendered_CustomizedEventUI.htm"]
        },
        {
            "name": "addEventsForSource",
            "tags": ["Data", "Events"],
            "parameters": "<ul>\n  <li>Json object or string</li>\n  <li>source id</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Add events for the specified \"sourceid\". This function will be useful when you need to add events on some trigger like Drag and Drop of an Event.</p>\n<p>Call refreshView() after adding Events.</p>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm"]
        },
        {
            "name": "replaceEvents",
            "tags": ["Data", "Events"],
            "parameters": "<ul>\n  <li>Array</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Input array contains object with following properties - </p>\n<ul>\n  <li>replaceId</li>\n  <li>new/modified event object</li>\n</ul>\n<p><b>OR</b></p>\n<ul>\n  <li>replaceRule</li>\n  <li>array of new/modified event object</li>\n</ul>\n<p>If \"replaceId\" is specified, event matching with replaceId is replaced with New Event Object.</p>\n<p>\n  When you want replace events by matching value of property other than \"id\", use \"replaceRule\". replaceRule should be a function which returns a boolean value. Event object(\"oEv\") is passed as a parameter to replaceRule. \n  For example,\n</p>\n<pre>\n  replaceRule = function(oEv)\n  {\n      if(oEv.type === \"Meeting\" && oEv.id === 20)\n          return true;\n      else\n          return false;\n  }\n</pre>\n<p>This function will be useful when you need to update events on some trigger like Drag and Drop of an Event.</p>\n<p>Call refreshView() after removing Events, if you want a view to reflect changes you made.</p>",
            "examples": ["../demo/Callback-EventRendered_CustomizedEventUI.htm"]
        },
        {
            "name": "revertToOriginalEvent",
            "tags": ["Data", "Events"],
            "parameters": "<ul>\n  <li>dragged event object</li>\n  <li>startDateBeforeChange(Date Object)</li>\n  <li>endDateBeforeChange(Date Object)</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Revert Changes after Drag n Drop or Resize.</p>\n<p>This function should be called inside <a class=\"parameter-link icon-link\" href=\"#link-saveChangesOnEventDrop\"><code>saveChangesOnEventDrop</code></a> or <a class=\"parameter-link icon-link\" href=\"#link-saveChangesOnEventResize\"><code>saveChangesOnEventResize</code></a> to revert changes to Events.</p>\n<p>Call refreshView() after reverting to Original Event.</p>",
            "examples": ["../demo/View-Month_Custom_Events_Dialog.htm"]
        },
        {
            "name": "removeEvents",
            "tags": ["Data", "Events"],
            "parameters": "<ul>\n  <li>Array</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Input array contains object with following properties - </p>\n<ul>\n  <li>removeIds or removeRule</li>\n</ul>\n<p>If \"removeIds\" is specified, events matching with removeIds are removed.</p>\n\n<p>\n  When you want remove event by matching value of property other than \"id\", use \"removeRule\". removeRule should be a function which returns a boolean value. Event object(\"oEv\") is passed as a parameter to removeRule. \n  For example,\n</p>\n<pre>\n  removeRule = function(oEv)\n  {\n      if(oEv.type === \"Meeting\" && oEv.id === 20)\n          return true;\n      else\n          return false;\n  }\n</pre>\n<p>removeEvents function will be useful when you need to remove events on some trigger like Drag and Drop of an Event.</p>\n<p>Call refreshView() after removing Events, if you want a view to reflect changes you made.</p>\n\n\n"
        },
        {
            "name": "applyFilter",
            "tags": ["UI", "FilterBar"],
            "parameters": "<ul>\n  <li>filterCriteriaArray</li>\n  <li>\n  \tURL Parameters Array\n    <pre>\n    [\n\n      {\n          \"sourceId\": \"source1\",\n          \"params\":[\n              {\n                  \"keyName\": \"key1\",\n                  \"values\": \"value1\"\n              },\n              {\n                  \"keyName\": \"key2\",\n                  \"values\": \"value2\"\n              }\n          ]\n      }\n\n    ]\n    </pre>\n  </li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Filter events by specified filtering criteria.</p>\n<p>See Sample Structure of <a class=\\\"parameter-link icon-link\\\" href=\\\"#link-eventFilterCriteria-IA\\\"><code>eventFilterCriteria</code></a></p>\n",
            "examples": ["../demo/Section-Filter.htm"]
        },
        {
            "name": "getDateInFormat",
            "tags": ["DateTime", "i18n"],
            "parameters": "<ul>\n  <li>date(Date Object) or iDate object</li>\n  <li>output format</li>\n  <li>is24Hour</li>\n  <li>isLocalized</li>\n</ul>",
            "returnvalue": "Formatted DateTime String",
            "description": "<p>It returns date in specified format.</p>\n<ul>\n  <li>\n    <p>date or iDate object</p>\n    <p>iDate object should be in following format</p>\n    <pre>\n      var dToday = new Date();\n      {\n          D: dToday.getDay(),\n          d: dToday.getDate(),\n          M: dToday.getMonth(),\n          y: dToday.getFullYear(),\n          H: dToday.getHours(),\n          h: (dToday.getHours() > 12) ? (dToday.getHours() - 12) : dToday.getHours(),\n          m: dToday.getMinutes(),\n          s: dToday.getSeconds(),\n          ms: dToday.getMilliseconds(),\n          me: (dToday.getHours() < 12) ? \"am\" : \"pm\",\n          sm: (dToday.getHours() < 12) ? \"a\" : \"p\"\n      }\n    </pre>\n  </li>\n  <li>\n    <p>You can specify one of the following date formats - </p>\n    <ul>\n      \n      <li>\"d\"</li>\n      <li>\"M\"</li>\n      <li>\"y\"</li>\n      <li>\"H\"</li>\n      <li>\"h\"</li>\n      <li>\"m\"</li>\n      <li>\"s\"</li>\n      \n      <li>\"dd\"</li>\n      <li>\"MM\"</li>\n      <li>\"yyyy\"</li>\n      <li>\"HH\"</li>\n      <li>\"hh\"</li>\n      <li>\"mm\"</li>\n      <li>\"ss\"</li>\n      \n      <li>\"DD\"</li>\n      <li>\"DDD\"</li>\n      <li>\"DDDD\"</li>\n      <li>\"MMM\"</li>\n      <li>\"MMMM\"</li>\n      \n      <li>\"dd-MM-yyyy\"</li>\n      <li>\"dd MMM\"</li>\n      <li>\"dd-MMM-yyyy\"</li>\n      <li>\"DDD MMM dd, yyyy\"</li>\n      <li>\"yyyy-MM-dd\"</li>\n      <li>\"ISO8601Date\"</li>\n      \n      <li>\"hh:mm sm\" | \"hh:mm SM\"</li>\n      <li>\"hh:mm\" | \"hh:mm me\" | \"hh:mm ME\"</li>\n      <li>\"hh:mm:ss\" | \"hh:mm:ss me\" | \"hh:mm:ss ME\"</li>\n      \n      <li>\"HH:mm\"</li>\n      <li>\"HH:mm:ss\"</li>\n      <li>\"ISO8601Time\"</li>\n      \n      <li>\"dd-MM-yyyy HH:mm\"</li>\n      <li>\"dd-MM-yyyy hh:mm\"</li>\n      \n      <li>\"HH:mm dd-MMM-yyyy\"</li>\n      <li>\"hh:mm dd-MMM-yyyy\"</li>\n      \n      <li>\"yyyy-MM-ddTHH:mm:ss\"</li>\n      <li>\"ISO8601DateTime\"</li>\n     \n      \n    </ul>\n    \n  </li>\n  \n  <li>\n    is24Hour defines Time Display Format 24 Hour or 12 hour\n  </li>\n  \n  <li>\n    isLocalized defines whether output should be localized. If set to true output datetime string will be returned in the <code>language</code> specified. \n  </li>\n</ul>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm"]
        },
        {
            "name": "setDateInFormat",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>date(Date Object) or iDate object</li>\n  <li>format - \"START\" | \"END\" | \"\"</li>\n</ul>",
            "returnvalue": "Date",
            "description": "<p>Returns a date object in format specified \"START\", \"END\" or default.</p>\n<ul>\n  <li>\n    <p>date or iDate object</p>\n    <p>iDate object should be in following format</p>\n    <pre>\n      var dToday = new Date();\n      {\n          D: dToday.getDay(),\n          d: dToday.getDate(),\n          M: dToday.getMonth(),\n          y: dToday.getFullYear(),\n          H: dToday.getHours(),\n          h: (dToday.getHours() > 12) ? (dToday.getHours() - 12) : dToday.getHours(),\n          m: dToday.getMinutes(),\n          s: dToday.getSeconds(),\n          ms: dToday.getMilliseconds(),\n          me: (dToday.getHours() < 12) ? \"am\" : \"pm\",\n          sm: (dToday.getHours() < 12) ? \"a\" : \"p\"\n      }\n    </pre>\n  </li>\n  <li>\n    Depending on format specified a new date is created\n    <ul>\n      <li>If format is \"START\" then hours, minutes, seconds and milliseconds will be set to 0.</li>\n      <li>If format is \"END\" then hours, minutes, seconds and milliseconds will be set to 23, 59, 59 and 999 respectively.</li>\n      <li>If format is \"\" or undefined then hours, minutes, seconds and milliseconds are set from input \"date\" or \"iDate\".</li>\n    </ul>\n  </li>\n</ul>"
        },
        {
            "name": "getNumberStringInFormat",
            "tags": ["Basic", "i18n"],
            "parameters": "<ul>\n  <li>number</li>\n  <li>number of characters</li>\n  <li>isLocalized</li>\n</ul>",
            "returnvalue": "Formatted Number",
            "description": "<p>Returns Formatted Number.</p>\n<p>When value of number of characters is set to 0, number of characters of input number are returned. Else string will be formatted to return specified number of characters.</p>\n<p>isLocalized defines whether output should be localized. If set to true output datetime string will be returned in the <code>language</code> specified.</p>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm"]
        },
        {
            "name": "getEventDateTimeString",
            "tags": ["DateTime", "Events"],
            "parameters": "<ul>\n  <li>event start datetime(Date Object)</li>\n  <li>event end datetime(Date Object)</li>\n  <li>isAllDay</li>\n  <li>separator</li>\n</ul>",
            "returnvalue": "DateTime String",
            "description": "<p>Returns Start and End DateTime String displayed on Event or Tooltip</p>"
        },
        {
            "name": "getEventDateTimeDataForAgendaView",
            "tags": ["DateTime", "Events"],
            "parameters": "<ul>\n  <li>event start datetime(Date Object)</li>\n  <li>event end datetime(Date Object)</li>\n  <li>isAllDay</li>\n  <li>selected date(Date Object)</li>\n</ul>",
            "returnvalue": "DateTime String",
            "description": "<p>Returns DateTime strings displayed on AgendaView.</p>\n<p>This function can be used when you are creating custom event list for AgendaView</p>"
        },
        {
            "name": "compareDates",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>date1(Date Object)</li>\n  <li>date2(Date Object)</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>less than 0 - date1 is less than date2</li>\n  <li>0 - date1 is equal to date2</li>\n  <li>greater than 0 - date1 is greater than date2</li>\n</ul>",
            "description": "<p>Date Comparison</p>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm"]
        },
        {
            "name": "compareDateTimes",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>datetime1(Date Object)</li>\n  <li>datetime2(Date Object)</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>less than 0 - datetime1 is less than datetime2</li>\n  <li>0 - datetime1 is equal to datetime2</li>\n  <li>greater than 0 - datetime1 is greater than datetime2</li>\n</ul>",
            "description": "<p>DateTime Comparison</p>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm"]
        },
        {
            "name": "compareStrings",
            "tags": ["Basic"],
            "parameters": "<ul>\n  <li>string1</li>\n  <li>string2</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>boolean</li>\n</ul>",
            "description": "<p>Case-insensitive string comparison function</p>",
            "examples": ["../demo/Section-Filter.htm"]
        },
        {
            "name": "convertToUTC",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>Date Object</li>\n  <li>TZD String of input date or \"\"</li>\n</ul>",
            "returnvalue": "Date Object",
            "description": "<p>Convert input Date to UTC Date.</p>"
        },
        {
            "name": "getDateByAddingOutputTZOffset",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>Date Object</li>\n  <li>TZD String of output date or \"\"</li>\n</ul>",
            "returnvalue": "Date Object",
            "description": "<p>Returns date converted in timezone for which TZD string is specified.</p>\n<p>If TZD string for output timezone is set to \"\", date is converted to timezone of the browser.</p>"
        },
        {
            "name": "normalizeDateTimeWithOffset",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>Date Object</li>\n  <li>Input TZD String or \"\"</li>\n  <li>Output TZD String or \"\"</li>\n</ul>",
            "returnvalue": "Date Object",
            "description": "<p>This function returns date converted to Output timezone from Input timezone.</p>",
            "examples": ["../demo/Callback-CellClicked_AddEvent.htm"]
        },
        {
            "name": "getDurationOfEventInHHmmFormat",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>start datetime(Date Object)</li>\n  <li>end datetime(Date Object)</li>\n</ul>",
            "returnvalue": "Array[hours, minutes]",
            "description": "<p>This function returns duration of event in hours and minutes.</p>"
        },
        {
            "name": "getArrayOfEventsForView",
            "tags": ["UI", "Events"],
            "parameters": "<ul>\n  <li>startDate(Date Object)</li>\n  <li>endDate(Date Object)</li>\n</ul>",
            "returnvalue": "<ul><li>arrayOfEvents</li></ul>",
            "description": "<p>Get Array of Events that fall in the specified DateRange.</p>",
            "examples": ["../demo/Mobile/View-DayList_DayEventList_Custom_Events.htm", "../demo/Mobile/View-Month_Custom_Events_Dialog.htm"]
        },
        {
            "name": "getNumberOfDaysOfEvent",
            "tags": ["Events"],
            "parameters": "<ul>\n  <li>isAllDay</li>\n  <li>start datetime(Date Object)</li>\n  <li>end datetime(Date Object)</li>\n  <li>returnHours?</li>\n  <li>calculateForView?</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>numberOfDays</li>\n  <li>numberOfHours (if returnHours == true)</li>\n</ul>",
            "description": "<p>Get number of days and/or number of hours event has spanned over.</p>\n<p>If calculateForView parameter and <a class=\"parameter-link icon-link\" href=\"#link-excludeNonBusinessHours\"><code>excludeNonBusinessHours</code></a> are set to true, number of days and/or hours for business hours are calculated.</p>"
        },
        {
            "name": "highlightDatesInDatePicker",
            "tags": ["UI", "DateTime"],
            "parameters": "<ul>\n  <li>\n    Array of dates to highlight in DatePicker view\n  </li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Highlights Input Dates in a DatePicker view.</p>",
            "examples": ["../demo/QuickUse-Default_DatePicker_EventList.htm"]
        },
        {
            "name": "updateMonthTableAndContents",
            "tags": ["UI", "MonthView", "DetailedMonthView"],
            "parameters": "<ul>\n  <li>loadData?</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Update MonthView.</p>\n<p>If loadData parameter is set to true, data request is sent again.</p>"
        },
        {
            "name": "adjustMonthTable",
            "tags": ["UI", "MonthView", "DetailedMonthView"],
            "parameters": "",
            "returnvalue": "",
            "description": "<p>Adjust MonthView to fit current container.</p>",
            "examples": ["../demo/Mobile/View-Month_Custom_EventCount_List.htm"]
        },
        {
            "name": "updateAgendaView",
            "tags": ["UI", "AgendaView"],
            "parameters": "<ul>\n  <li>loadData?</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Update AgendaView.</p>\n<p>If loadData parameter is set to true, data request is sent again.</p>"
        },
        {
            "name": "adjustAgendaView",
            "tags": ["UI", "AgendaView"],
            "parameters": "",
            "returnvalue": "",
            "description": "<p>Adjust AgendaView to fit current container.</p>"
        },
        {
            "name": "updateDaySummaryViewForDate",
            "tags": ["UI", "TaskPlannerView"],
            "parameters": "<ul>\n  <li>date</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>If you want to update day summary for a particular day on some event other than viewLoad or drag and drop for which <a class=\"parameter-link icon-link\" href=\"#link-addDaySummaryInTaskPlannerView\"><code>addDaySummaryInTaskPlannerView</code></a> callback function is not called.</p>\n<p>In this function <a class=\"parameter-link icon-link\" href=\"#link-addDaySummaryInTaskPlannerView\"><code>addDaySummaryInTaskPlannerView</code></a> function will be called for the date supplied, so you have to provide it's definition when you want to use <code>updateDaySummaryViewForDate</code> function.</p>"
        },
        {
            "name": "setCalendarBorderColor",
            "tags": ["UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "<p>Set calendar border color as specified in settings.</p>"
        },
        {
            "name": "modifySettings",
            "tags": ["Basic"],
            "parameters": "<ul>\n  <li>options</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Modify CalenStyle Settings.</p>",
            "examples": ["../demo/QuickUse-WidthBasedRendering.htm"]
        },
        {
            "name": "modifyCalenStyleObject",
            "tags": ["Basic"],
            "parameters": "<ul>\n  <li>\n    CalenStyle Object\n  </li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Replace current CalenStyle Object with one passed as a parameter.</p>"
        },
        {
            "name": "setLanguage",
            "tags": ["UI", "i18n"],
            "parameters": "<ul>\n  <li>language</li>\n  <li>loadData?</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>CalenStyle Object updated with i18n strings of the language you set</li>\n</ul>",
            "description": "<p>Change language of the CalenStyle UI.</p>\n<p>You should include a file listing i18n strings for the specified language.</p>\n<p>If loadData? parameter is set to true, Data(Events, RestrictedSection, SlotAvailability) is loaded again.</p>",
            "examples": ["../demo/Other-Internationalization.htm"]
        },
        {
            "name": "changeOutputTimezone",
            "tags": ["UI", "i18n"],
            "parameters": "<ul>\n  <li>Output TZ String (For example, \"Asia/Calcutta\")</li>\n  <li>Output TZD(Time Zone Designator) String (For example, \"+05:30\")</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>CalenStyle Object with updated <code>tz</code> and <code>outputTZOffset</code></li>\n</ul>",
            "description": "<p>Change Timezone and Timezone Designator strings of the CalenStyle UI.</p>\n<p>If loadData? parameter is set to - </p>\n<ul>\n  <li>true - Data(Events, RestrictedSection, SlotAvailability) is loaded again and DateTime of Data Record is converted to output timezone.</li>\n  <li>false - DateTime of the Data Record is converted to specified Timezone.</li>\n</ul>\n<p>If you are using Google Calendar Feeds, you need to specify the value of Timezone string.</p>",
            "examples": ["../demo/Other-Internationalization.htm"]
        },
        {
            "name": "modifyAppointmentSlot",
            "tags": ["UI", "AppointmentView"],
            "parameters": "<ul>\n  <li>timeSlotData</li>\n  <li>timeSlotElement</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>\n  Saves timeSlotData changes in the CalenStyle Slot Availability data source and modifies time slot view based on the modified timeSlotData count or status values.\n  This function can be called inside <a class=\"parameter-link icon-link\" href=\"#link-clickedAppointmentSlot\"><code>clickedAppointmentSlot</code></a> callback function after modifying timeSlotData.\n</p>\n",
            "examples": ["../demo/View-Appointment.htm"]
        }
    ],

    inputarrays:
    [
        {
            "name": "eventCalendarSource",
            "title": "eventCalendarSource",
            "tags": ["Data", "Events"],
            "description": "<p>eventCalendarSource is an array of objects defined properties of Calendar object.</p>\n<p>Properties of Calendar Object - </p>\n<ul> \n  <li><code>calendar</code> - is the name of <code>calendar</code>.</li>\n  <li><code>icon</code> - is the font icon class of events with <code>calendar</code>.</li>\n  <li><code>color</code> - is the color of events with <code>calendar</code>. Refer <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn\"><code>changeColorBasedOn</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn-PP\"><code>changeColorBasedOn Property Preferences</code></a></li>\n  <li><code>borderColor</code> - is the border color of events with <code>calendar</code>. Refer <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn\"><code>changeColorBasedOn</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn-PP\"><code>changeColorBasedOn Property Preferences</code></a></li>\n  <li><code>nonAllDayEventsTextColor</code> - is the color of non all day events with <code>calendar</code>. Refer <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn\"><code>changeColorBasedOn</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn-PP\"><code>changeColorBasedOn Property Preferences</code></a></li>  \n  <li><code>textColor</code> - is the text color of events with <code>calendar</code>. Refer <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn\"><code>changeColorBasedOn</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn-PP\"><code>changeColorBasedOn Property Preferences</code></a></li>\n  <li><code>isDragNDropInMonthView</code> - enable or disable Drag and Drop of events with <code>calendar</code> in \"MonthView\" and \"DetailedMonthView\". Refer <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInMonthView\"><code>isDragNDropInMonthView</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInMonthView-PP\"><code>isDragNDropInMonthView Property Preferences</code></a></li>\n  <li><code>isDragNDropInDetailView</code> - enable or disable Drag and Drop of events with <code>calendar</code> in Detail Views(\"WeekView\", \"DayView\"). Refer <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInDetailView\"><code>isDragNDropInDetailView</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInDetailView-PP\"><code>isDragNDropInDetailView Property Preferences</code></a></li>\n  <li><code>isResizeInDetailView</code> - enable or disable Resizing of events with <code>calendar</code> in Detail Views(\"WeekView\", \"DayView\"). Refer <a class=\"parameter-link icon-link\" href=\"#link-isResizeInDetailView\"><code>isResizeInDetailView</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-isResizeInDetailView-PP\"><code>isResizeInDetailView Property Preferences</code></a></li>\n</ul>",
            "format": "<pre>[\n  {\n    \"calendar\": \"Birthday\",\n\n    \"icon\": \"icon-Birthday\", // Optional, font-icon class name\n    \"color\": \"7EE1D4\", // Optional\n    \"borderColor\": \"000000\", //Optional\n    \"textColor\": \"000000\", //Optional\n    \"nonAllDayEventsTextColor\": \"000000\", //Optional\n\n    \"isDragNDropInMonthView\": true, // Optional \n    \"isDragNDropInDetailView\": true, // Optional\n    \"isResizeInDetailView\": true // Optional\n  },\n  {\n    \"calendar\": \"Meeting\",\n\n    \"icon\": \"icon-Meeting\", // Optional, font-icon class name\n    \"color\": \"20DAEC\", // Optional\n    \"borderColor\": \"000000\", //Optional\n    \"textColor\": \"000000\", //Optional\n\n    \"isDragNDropInMonthView\": true, // Optional\n    \"isDragNDropInDetailView\": true, // Optional\n    \"isResizeInDetailView\": true // Optional\n  }\n]</pre>"
        },
        {
            "name": "eventSource",
            "title": "eventSource",
            "tags": ["Data", "Events"],
            "description": "<p>eventSource is an array of Events.</p>\n<p>Properties of a particular event can also be set.</p>\n<ul> \n  \n  <li><code>start</code> - is the compulsory field, which is a start date of an event.</li>\n  \n  <li>If <code>end</code> is not specified, it will be calculated by adding <a class=\"parameter-link icon-link\" href=\"#link-eventDuration\"><code>eventDuration</code></a>(default) or <a class=\"parameter-link icon-link\" href=\"#link-allDayEventDuration\"><code>allDayEventDuration</code></a>(isAllDay == true) to start date.</li>\n  \n  <li>All other fields are optional.</li> \n  \n  <li>If you want to filter events with some attributes, you need to specify those attribute in the Events Json.</li>\n  \n  <li><code>id</code> - is provided you can uniquely identify events when date or time changes in case of drag and drop or resize.</li>\n  \n  <li><code>isAllDay</code> - is set to true if event is an All Day Event.</li> \n  \n  <li><code>calendar</code> - is a calendar to which event belongs. All calendar are specified in <a class=\"parameter-link icon-link\" href=\"#link-eventCalendarSource-IA\"><code>eventCalendarSource</code></a></li>\n  \n  <li><code>title</code> - is a title text which appears on the Event.</li> \n  \n  <li><code>description</code> - is a description or summary of the Event.</li> \n  \n  <li><code>url</code> - is a url associated with the Event. When URL is specified in the Event, it will be opened in the new Browser tab on click of Event.</li>\n  \n  <li><code>icon</code> - is a font icon class of the Event.</li> \n  \n  <li><code>backgroundColor</code> - is a color of the Event. Refer <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn\"><code>changeColorBasedOn</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn-PP\"><code>changeColorBasedOn Property Preferences</code></a></li>\n  \n  <li><code>borderColor</code> - is a border color of the Event. Refer <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn\"><code>changeColorBasedOn</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn-PP\"><code>changeColorBasedOn Property Preferences</code></a></li>\n  \n  <li><code>textColor</code> - is a text color of the Event. Refer <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn\"><code>changeColorBasedOn</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn-PP\"><code>changeColorBasedOn Property Preferences</code></a></li>\n  \n  <li><code>singleColor</code> - is a color of the Event. \n    If you specify <code>singleColor</code>, <code>backgroundColor</code>, <code>borderColor</code> and <code>textColor</code> values will be calculated based on it.\n    Refer <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn\"><code>changeColorBasedOn</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn-PP\"><code>changeColorBasedOn Property Preferences</code></a>\n  </li>\n  \n  <li><code>nonAllDayEventsTextColor</code> - is a text color of the non all day Event. Refer <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn\"><code>changeColorBasedOn</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-changeColorBasedOn-PP\"><code>changeColorBasedOn Property Preferences</code></a></li> \n  \n  <li><code>isDragNDropInMonthView</code> - enable or disable Drag and Drop of the Event in \"MonthView\" and \"DetailedMonthView\". Refer <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInMonthView\"><code>isDragNDropInMonthView</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInMonthView-PP\"><code>isDragNDropInMonthView Property Preferences</code></a></li>\n  \n  <li><code>isDragNDropInDetailView</code> - enable or disable Drag and Drop of the Event in Detail Views(\"WeekView\", \"DayView\"). Refer <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInDetailView\"><code>isDragNDropInDetailView</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-isDragNDropInDetailView-PP\"><code>isDragNDropInDetailView Property Preferences</code></a></li>\n  \n  <li><code>isResizeInDetailView</code> - enable or disable Resizing of the Event in Detail Views(\"WeekView\", \"DayView\"). Refer <a class=\"parameter-link icon-link\" href=\"#link-isResizeInDetailView\"><code>isResizeInDetailView</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-isResizeInDetailView-PP\"><code>isResizeInDetailView Property Preferences</code></a></li>\n\n  <li><code>isMarked</code> - display event as a marked day in calendar view. \n    Marked Day will be indicated differently for different view.\n    <p>\n      For example - \n      In DetailedMonthView and MonthView, day background color of marked event will be set as Month Day background color.\n      In all views, Marked Events are designed to be visually different than non Marked Events.\n    </p>\n  </li>\n  \n  <li><code>droppableId</code> - is an identifier of the restricted section. \n    This is useful when you want to restrict particular events in the particular section.\n    For example, if you want a particular type of event to be executed on Friday from 3pm to 6pm, you can add a <code>droppableId</code> for restricted section and event.\n    When event has droppableId property set, event can only be dropped in a restricted section with same droppableId. \n  \tYou can set multiple droppableIds separated by commas, if you want the event to be dropped in multiple sections.\n  </li>\n  \n  <li><code>status</code> -  set status of the event or task. When Status of the Event is specified, Events Status Indicators will be added in \"DayEventListView\" or \"DayEventDetailView\" with Status-wise Event Count.\n  \tYou can customize status indicators using <a class=\"parameter-link icon-link\" href=\"#link-eventOrTaskStatusIndicators\"><code>eventOrTaskStatusIndicators</code></a> setting parameter.\n     </li>\n  \n</ul>",

            "examples": ["../demo/View-DayList_DayEventList.htm", "../demo/View-DayList_DayEventDetail.htm"],

            "format": "<pre>[\n  {\n    \"id\": 1, // Optional\n    \"isAllDay\": true, // Optional\n    \"start\": \"05-07-2014 00:00\",\n    \"end\": \"05-07-2014 00:00\",\n    \"calendar\": \"Birthday\", // Optional\n    \"tag\": \"Personal\", // Optional\n    \"title\": \"Mike's Birthday\", // Optional\n    \"description\": \"\", // Optional\n    \"url\": \"\", // Optional\n\n    \"icon\": \"icon-Birthday\", // Optional, font-icon class name\n    \"color\": \"7EE1D4\", // Optional\n    \"borderColor\": \"000000\", //Optional\n    \"textColor\": \"000000\", //Optional\n    \"nonAllDayEventsTextColor\": \"000000\", //Optional\n\n    \"isDragNDropInMonthView\": true, // Optional\n    \"isDragNDropInDetailView\": true, // Optional\n    \"isResizeInDetailView\": true // Optional\n  },\n  {\n    \"id\": 2, // Optional\n    \"isAllDay\": false, // Optional\n    \"start\": \"22-02-2014 09:00\",\n    \"end\": \"22-02-2014 10:00\",\n    \"calendar\": \"Meeting\", // Optional\n    \"tag\": \"Personal\", // Optional\n    \"title\": \"Meeting with Ana\", // Optional\n    \"description\": \"\", // Optional\n    \"url\": \"\", // Optional\n\n    \"icon\": \"icon-Meeting\", // Optional, font-icon class name\n    \"color\": \"20DAEC\", // Optional\n    \"borderColor\": \"000000\", //Optional\n    \"textColor\": \"000000\" //Optional\n\n    \"isDragNDropInMonthView\": true, // Optional\n    \"isDragNDropInDetailView\": true, // Optional\n    \"isResizeInDetailView\": true, // Optional,\n    \n    \"droppableId\": \"Meeting\"\n  }\n]</pre>"
        },
        {
            "name": "restrictedSectionSource",
            "title": "restrictedSectionSource",
            "tags": ["Data", "UI", "DetailedMonthView", "MonthView", "DetailView", "QuickAgendaView", "TaskPlannerView"],
            "description": "<p>In <code>restrictedSectionSource</code> array contains restricted sections which can be used for following purposes -</p>\n<ul>\n  <li>Holidays where no events should be allowed.</li>\n  <li>Irregular Times where work time is different from that of regular business hours.</li>\n  <li>Allow specific events in the specific sections.</li>\n</ul>\n\n<p>Default indicator of the restricted section is an image having diagonal dashed black lines.</p>\n\n<p>Restricted section is indicated in -\n<ul>\n  <li>DetailedMonthView & Month View - only all-day events</li>\n  <li>Detail Views(\"WeekView\", \"CustomView\", \"DayView\") - Both all-day and non all-day events</li>\n  <li>QuickAgendaView - only all-day events</li>\n  <li>TaskPlannerView - only all-day events</li>\n</ul>\n\n<p>Properties of Restricted Section Object - </p>\n<ul>\n  <li><code>start</code> - is a start date/datetime of the restricted section.</li>\n  \n  <li><code>end</code> - is an end date/datetime of the restricted section.</li>\n  \n  <li><code>isAllDay</code> - is restricted section spanning entire day?</li>\n  \n  <li><code>backgroundColor </code> - is a background color of the restricted section on UI. \n    This color will override default background image of the restricted section.\n  </li>\n  \n  <li><code>class</code> - is a css class specifying style of the restricted section.</li>\n  \n  <li><code>isDroppable</code> - can events be dropped on a restricted section?</li>\n  \n  <li><code>droppableId</code> - is an identifier of the restricted section. \n    This is useful when you want to restrict particular events in the particular section.\n    For example, if you want a particular type of event to be executed on Friday from 3pm to 6pm, you can add a <code>droppableId</code> for restricted section and event.\n    When event has droppableId property set, event can only be dropped in a restricted section with same droppableId. \n  </li>\n  \n  <li><code>allowedDroppables</code> - is an array of droppableIds allowed in the restricted section.\n  \tIf allowedDroppables value is not specified all events will be allowed to be dropped in the restricted section.\n    For example, if you want a only particular type event to be executed on Friday from 3pm to 6pm, you can add a <code>droppableId</code> for restricted section and event. \n    And you have to specify the droppableId in allowedDroppables.\n  </li>\n  \n</ul>",
            "format": "<pre>[\n {\n    \"start\": \"2014-03-05T15:00:00.000Z\",\n    \"end\": \"2014-03-05T17:00:00.000Z\",\n    \"isAllDay\": false\n },\n {\n    \"start\": \"2014-04-15T00:00:00.000Z\",\n    \"end\": \"2014-04-15T23:59:59.000Z\",\n    \"isAllDay\": true,\n    \"backgroundColor\": \"E4F1FE\",\n    \"isDroppable\": true,\n    \"droppableId\": \"Meeting\",\n    \"allowedDroppables\": [\"RS-Meeting\"]\n }\n]</pre>"
        },
        {
            "name": "slotAvailabilitySource",
            "title": "slotAvailabilitySource",
            "tags": ["Data", "AppointmentView", "UI"],
            "description": "<p><code>slotAvailabilitySource</code> is an array of slot availability objects.</p>\n<p>Properties of Slot Availability Object - </p>\n<ul>\n  <li><code>start datetime</code> - is the start of the slot availability.</li>\n  <li><code>end datetime</code> - is the end of the slot availability.</li>\n  <li><code>status</code> - is the availability status. It can have values - \"Free\" or \"Busy\"</li>\n  <li><code>count</code> - is the count of seats available for booking in a time slot.</li>\n</ul>",
            "format": "<pre>[\n  {\n    \"start\": \"15-03-2014 08:00\",\n    \"end\": \"15-03-2014 08:59\",\n    \"isAllDay\": false,\n    \"status\":\"Busy\"\n  },\n  {\n    \"start\": \"15-03-2014 09:00\",\n    \"end\": \"15-03-2014 09:59\",\n    \"isAllDay\": false,\n    \"status\": \"Free\",\n    \"count\": 3\n  }\n]</pre>"
        },
        {
            "name": "eventFilterCriteria",
            "title": "eventFilterCriteria",
            "tags": ["Data", "Events", "FilterBar"],
            "description": "<p>eventFilterCriteria is an array in which event filter criteria is specified when you want to use event filtering functionality.</p>\n<p>Properties of Event Filter Object - </p>\n<ul>\n  <li><code>keyName</code> - is a name of the filter criteria key. In order to filter events based on event filter criteria, you will need to specify a value for this key in the Event object.</li>\n  <li><code>keyDisplayName</code> - is a display name for the filter criteria key. </li>\n  <li><code>dataType</code> - is a data type of the value of the key specified.</li>\n  <li><code>values</code> - is an array of all possible values of the key. Values will be used for filtering.</li>\n  <li><code>displayValues</code> - is an array of all possible display values of the key. Display Values will be used as a display text for Values.</li>\n  <li><code>displayStatus</code> - is an array of show or hide values for each value of the key.</li>\n  <li><code>selectedValues</code> - is an array of selected values of the key.</li>\n</ul>\n<p>Length of array for <code>values</code>, <li><code>displayValues</code> and <code>displayStatus</code> should be same.</p>",
            "format": "<pre>[\n  {\n    \"keyName\":\"type\",\n    \"keyDisplayName\":\"Type\",\n    \"dataType\":\"String\",\n    \"values\":[\"birthday\", \"coffee\", \"dinner\", \"travel\", \"meeting\"],\n    \"displayValues\":[\"Birthday\", \"Coffee\", \"Dinner\", \"Travel\", \"Meeting\"],\n    \"displayStatus\":[\"show\", \"show\", \"hide\", \"show\", \"show\"]\n    \"selectedValues\":[\"Coffee\", \"Meeting\"]\n  },\n  {\n    \"keyName\":\"tag\",\n    \"keyDisplayName\":\"Tag\",\n    \"dataType\":\"String\",\n    \"values\":[\"personal\", \"work\"],\n    \"values\":[\"Personal\", \"Work\"],\n    \"displayStatus\":[\"show\", \"show\"],\n    \"selectedValues\":[\"Personal\"]    \n  }\n]</pre>"
        },
        {
            "name": "sourceCount",
            "title": "sourceCount",
            "tags": ["Data", "DatePicker"],
            "description": "<p>sourceCount is an array of Source Count.</p>\n<p>Properties of a record in the sourceCount array - </p>\n<ul> \n  <li><code>date</code> - is the compulsory field, which is a date for which the count is specified.</li>\n  <li><code>count</code> - count of the data(i.e. events, free or busy appointment slots)</li>\n</ul>",
            "format": "<pre>[\n  {\n    \"date\": \"22-02-2014\",\n    \"count\": 5\n  },\n  {\n    \"date\": \"23-02-2014\",\n    \"count\": 4\n  }\n]</pre>"
        }
    ],

    propertypreferences:
    [
        {
            "name": "changeColorBasedOn",
            "tags": ["UI", "Events"],
            "preference": "<ol>\n  <li>value of changeColorBasedOn specified in \"config\" of calDataSource</li>\n  <li>value of changeColorBasedOn specified in CalenStyle Settings</li>\n  <li>value of changeColorBasedOn specified in Event Object from eventSource</li>\n</ol>"
        },
        {
            "name": "isDragNDropInMonthView",
            "tags": ["UI", "MonthView", "DetailedMonthView"],
            "preference": "<ol>\n  <li>value of isDragNDropInMonthView specified in \"config\" of calDataSource</li>\n  <li>value of isDragNDropInMonthView specified in Calendar Object from eventCalendarSource</li>\n  <li>value of isDragNDropInMonthView specified in Event Object from eventSource</li>\n  <li>value of isDragNDropInMonthView specified in CalenStyle Settings</li>\n</ol>"
        },
        {
            "name": "isDragNDropInDetailView",
            "tags": ["UI", "DetailView"],
            "preference": "<ol>\n  <li>value of isDragNDropInDetailView specified in \"config\" of calDataSource</li>\n  <li>value of isDragNDropInDetailView specified in Calendar Object from eventCalendarSource</li>\n  <li>value of isDragNDropInDetailView specified in Event Object from eventSource</li>\n  <li>value of isDragNDropInDetailView specified in CalenStyle Settings</li>\n</ol>"
        },
        {
            "name": "isDragNDropInQuickAgendaView",
            "tags": ["UI", "QuickAgendaView"],
            "preference": "<ol>\n  <li>value of isDragNDropInQuickAgendaView specified in \"config\" of calDataSource</li>\n  <li>value of isDragNDropInQuickAgendaView specified in Calendar Object from eventCalendarSource</li>\n  <li>value of isDragNDropInQuickAgendaView specified in Event Object from eventSource</li>\n  <li>value of isDragNDropInQuickAgendaView specified in CalenStyle Settings</li>\n</ol>"
        },
        {
            "name": "isDragNDropInTaskPlannerView",
            "tags": ["UI", "TaskPlannerView"],
            "preference": "<ol>\n  <li>value of isDragNDropInTaskPlannerView specified in \"config\" of calDataSource</li>\n  <li>value of isDragNDropInTaskPlannerView specified in Calendar Object from eventCalendarSource</li>\n  <li>value of isDragNDropInTaskPlannerView specified in Event Object from eventSource</li>\n  <li>value of isDragNDropInTaskPlannerView specified in CalenStyle Settings</li>\n</ol>"
        },
        {
            "name": "isResizeInDetailView",
            "tags": ["UI", "DetailView"],
            "preference": "<ol>\n  <li>value of isResizeInDetailView specified in \"config\" of calDataSource</li>\n  <li>value of isResizeInDetailView specified in Calendar Object from eventCalendarSource</li>\n  <li>value of isResizeInDetailView specified in Event Object from eventSource</li>\n  <li>value of isResizeInDetailView specified in CalenStyle Settings</li>\n</ol>"
        }
    ],

    changelog:
    [
        {
            "version": "1.0.0",
            "date": "Aug 15, 2015",
            "description": "Initial Release"
        },
        {
            "version": "2.0.0",
            "date": "Jan 25, 2016",
            "description": "Made CalenStyle free for personal use."
        },
        {
            "version": "2.0.1",
            "date": "Mar 30, 2016",
            "description": "Added Examples of CalenStyle Implementation using AngularJS and ionic framework"
        },
        {
            "version": "2.0.2",
            "date": "May 29, 2016",
            "description": "Improved Documentation to add explanation of calDataSource and added example to illustrate the same."
        },
        {
            "version": "2.0.3",
            "date": "May 31, 2016",
            "description": "Added Documentation for DataServer and examples of loading Data from URL. demo/Data-URL.htm and demo/Mobile/Data-URL.htm"
        },
        {
            "version": "2.0.4",
            "date": "Sep 13, 2016",
            "description": "Fixed DST issue - because of DST, some days were appearing twice/ month appring twice or month skipped entirely. Fixed issue of Month View height on IE. Removed fixed heights from cContHeaderSections. Added some bottom padding to cContHeaderMenuSections. Changed sourceFetchType to ALL, to prevent duplicating events on previous and next button click and changed icon classname, so icon is now visible."
        },
        {
            "version": "2.0.5",
            "date": "Oct 02, 2016",
            "description": "Added scroll to selectedDate option in Agenda View."
        },
        {
            "version": "2.0.6",
            "date": "Oct 11, 2016",
            "description": "Fixed a bug in eventTooltipContent callback function parameter. This bug caused oEventRecord parameter to be undefined."
        },
        {
            "version": "2.0.7",
            "date": "Apr 1, 2017",
            "description": "Changed Copyright Text and Repository URLs."
        }
    ]
};
