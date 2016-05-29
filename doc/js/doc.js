$(document).ready(function()
{
	$("#footer-year").text(new Date().getFullYear());
	
	//---------------------------------- Handlebars --------------------------------------------

	Handlebars.registerHelper('getIdForLink', function(name) 
	{
		return "link-"+name;
	});
	
	Handlebars.registerHelper('getHrefForLink', function(name) 
	{
		return "#link-"+name;
	});

	Handlebars.registerHelper('getIdForTagLink', function(name) 
	{
		return "tag-"+name;
	});

	Handlebars.registerHelper('getExampleName', function(sLink)
	{
		var sArrName = sLink.split("/"),
		iComponents = sArrName.length,
		sName = sArrName[iComponents - 1];
		sName = (sArrName[iComponents - 2] === "Mobile") ? sName + " (mobile)" : sName + " (web)";
		return sName;
	});
	
	//--------------------- Parameter Options List Sidebar Start -------------------------------

	var polSidebarSource = $("#tmpl-sidebar-ParameterOptionsList").html();
	var polSidebarTemplate = Handlebars.compile(polSidebarSource);	
	var polSidebarResult = polSidebarTemplate(documentation.parameters);
	$("#sidebar-ParameterOptionsList").html(polSidebarResult);

	//--------------------- Parameter Options List Sidebar End -------------------------------

	//--------------------- Parameter Options List Start -------------------------------

	var polSource = $("#tmpl-ParameterOptionsList").html();
	var polTemplate = Handlebars.compile(polSource);	
	var polResult = polTemplate(documentation.parameters);
	$(".ParameterOptionsList-Content").html(polResult);

	//--------------------- Parameter Options List End -------------------------------
	
	//--------------------- Callback Function List Sidebar Start -------------------------------

	var cflSidebarSource = $("#tmpl-sidebar-CallbackFunctionsList").html();
	var cflSidebarTemplate = Handlebars.compile(cflSidebarSource);	
	var cflSidebarResult = cflSidebarTemplate(documentation.callbackfunctions);
	$("#sidebar-CallbackFunctionsList").html(cflSidebarResult);

	//--------------------- Callback Function List Sidebar End -------------------------------
	
	//--------------------- Callback Function List Start -------------------------------

	var cflSource = $("#tmpl-CallbackFunctionsList").html();
	var cflTemplate = Handlebars.compile(cflSource);	
	var cflResult = cflTemplate(documentation.callbackfunctions);
	$(".CallbackFunctionsList-Content").html(cflResult);

	//--------------------- Callback Function List End -------------------------------
	
	//--------------------- Function List Sidebar Start -------------------------------

	var flSidebarSource = $("#tmpl-sidebar-FunctionsList").html();
	var flSidebarTemplate = Handlebars.compile(flSidebarSource);	
	var flSidebarResult = flSidebarTemplate(documentation.functions);
	$("#sidebar-FunctionsList").html(flSidebarResult);

	//---------------------  Function List Sidebar End -------------------------------
	
	//---------------------  Function List Start -------------------------------

	var flSource = $("#tmpl-FunctionsList").html();
	var flTemplate = Handlebars.compile(flSource);	
	var flResult = flTemplate(documentation.functions);
	$(".FunctionsList-Content").html(flResult);

	//--------------------- Function List End -------------------------------
		
	//--------------------- Input Arrays List Sidebar Start -------------------------------

	var ialSidebarSource = $("#tmpl-sidebar-InputArraysList").html();
	var ialSidebarTemplate = Handlebars.compile(ialSidebarSource);	
	var ialSidebarResult = ialSidebarTemplate(documentation.inputarrays);
	$("#sidebar-InputArraysList").html(ialSidebarResult);

	//---------------------  Input Arrays List Sidebar End -------------------------------

	//---------------------  Input Arrays List Start -------------------------------

	var ialSource = $("#tmpl-InputArraysList").html();
	var ialTemplate = Handlebars.compile(ialSource);	
	var ialResult = ialTemplate(documentation.inputarrays);
	$(".InputArraysList-Content").html(ialResult);

	//--------------------- Input Arrays List End -------------------------------
	
	//--------------------- Property Preferences Sidebar Start -------------------------------

	var ppSidebarSource = $("#tmpl-sidebar-PropertyPreferences").html();
	var ppSidebarTemplate = Handlebars.compile(ppSidebarSource);	
	var ppSidebarResult = ppSidebarTemplate(documentation.propertypreferences);
	$("#sidebar-PropertyPreferences").html(ppSidebarResult);

	//---------------------  Property Preferences Sidebar End -------------------------------
	
	//---------------------  Property Preferences Start -------------------------------

	var ppSource = $("#tmpl-PropertyPreferences").html();
	var ppTemplate = Handlebars.compile(ppSource);	
	var ppResult = ppTemplate(documentation.propertypreferences);
	$(".PropertyPreferences-Content").html(ppResult);

	//--------------------- Property Preferences End -------------------------------
	
	//---------------------  Filter Tags Start -------------------------------

	var tgSource = $("#tmpl-Tags").html();
	var tgTemplate = Handlebars.compile(tgSource);	
	var tgResult = tgTemplate(documentation.tags);
	$(".tag-filter-content").html(tgResult);

	//--------------------- Filter Tags End -------------------------------

	showHideScrollToTop();

	setTimeout(function()
	{
		$("body").scrollspy(
		{
			target: ".nav-sidebar", 
			offset: 72
		});
	}, 2000);

	$('.parameter-link').click(function(e) 
	{
		//e.preventDefault();
        $('html, body').stop().animate(
        {
            scrollTop: $($(this).attr('href')).offset().top - 70  		
        }, 700, 'easeInOutExpo');		
    });

    //------------------- Filter Events Start --------------------------------------
    
    $(".parameter-tag").click(function()
    {
    	$(".tag-filter").css("display", "block");
    	var tag = "#" + $(this).attr("id");
    	filterWithTag(tag);
    	
    });

    $(".filter-link").click(function()
    {
    	var tag = "#" + $(this).attr("id");
    	filterWithTag(tag);
    });

	$(".tag-filter-close").click(function()
	{
		selectedTags = [];
		$(".tag-filter").find(".filter-link").removeClass("active");

		$(".tag-filter").css("display", "none");
		$(".parameter-cont").show();
		window.location.href = "#Doc";
	});

	//------------------- Filter Events End --------------------------------------

});

$(document).scroll(function()
{
	showHideScrollToTop();
});

function showHideScrollToTop()
{
	if($(document).scrollTop() < 10)
	{
		$(".BackToTop").hide();
	}
	else
	{
		$(".BackToTop").show();
	}
}

var selectedTags = [];

function filterWithTag(tag) 
{
	var matchIndex = -1;
	for(var tagIndex = 0; tagIndex < selectedTags.length; tagIndex++)
	{
		if(tag == selectedTags[tagIndex])
			matchIndex = tagIndex;
	}

	if(matchIndex == -1)
	{
		selectedTags.push(tag);
		$(".tag-filter").find(tag).addClass("active");
	}		
	else
	{
		selectedTags.splice(matchIndex, 1);
		$(".tag-filter").find(tag).removeClass("active");
	}

	if(selectedTags.length > 0)
	{
		$(".parameter-cont").hide();
		$(".parameter-cont").has(selectedTags.join()).show();
	}
	else
	{
		$(".parameter-cont").show();
	}
	
	window.location.href = "#Doc";
}

