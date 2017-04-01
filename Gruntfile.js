module.exports = function(grunt) 
{
	var sBanner = '/* ----------------------------------------------------------------------------- ' +
	'\n\n  CalenStyle - Responsive Event Calendar' +
	'\n  Version <%= pkg.version %>' + 
	'\n  Copyright (c)<%= grunt.template.today("yyyy") %> Lajpat Shah' +
	'\n  Contributors : https://github.com/nehakadam/CalenStyle/contributors' +
	'\n  Repository : https://github.com/nehakadam/CalenStyle' +
	'\n  Homepage : https://nehakadam.github.io/CalenStyle' +
	'\n\n ----------------------------------------------------------------------------- */\n\n';
	
	var sJSHeader = sBanner + "(function () {\n\n    \"use strict\";\n\n",
	sJSFooter = "\n\n}());\n\n",

	sAJS = [

		'src/calenstyle-core.js', 
      	'src/calenstyle-monthview.js', 
      	'src/calenstyle-detailview.js',
      	'src/calenstyle-quickagendaview.js',
      	'src/calenstyle-taskplannerview.js',
      	'src/calenstyle-agendaview.js',
      	'src/calenstyle-weekplannerview.js',
      	'src/calenstyle-daylistview.js',
      	'src/calenstyle-appointmentview.js',
      	'src/calenstyle-filterbar.js',
      	'src/calenstyle-pickers.js'

	], 

	sAJSCustom = [
		'src/calenstyle-core.js', 
      	'src/calenstyle-monthview.js', 
      	'src/calenstyle-detailview.js',
      	'src/calenstyle-agendaview.js',
      	'src/calenstyle-quickagendaview.js',
      	'src/calenstyle-pickers.js'
	], 

	sACSS = [

		'src/calenstyle.css',
		'src/calenstyle-jquery-ui-override.css'

	],

	sAWatch = sAJS.concat(sACSS);

	grunt.initConfig(
	{

		pkg: grunt.file.readJSON('package.json'),
		concat: 
		{
			options: 
			{
		      	separator: '\n\n\n\n',
		      	stripBanners: true
		    },
		
		    dist: 
		    {
		      	src: sAJS,
		      	dest: 'src/calenstyle.js',
		      	
		      	options: 
				{
					nonull: true,
					banner: sJSHeader,
					footer: sJSFooter
				}
		    },

		    customconcat: 
		    {
		      	src: sAJSCustom,
		      	dest: 'src/calenstyle-custom.js',
		    
		      	options: 
				{
					nonull: true,
					banner: sJSHeader,
					footer: sJSFooter
				}
		    },

		    lang: 
		    {
		    	options: 
				{
					banner: sBanner
				},
				
		      	src: ['src/i18n/*', '!src/i18n/calenstyle-i18n.js'],
		      	dest: 'src/i18n/calenstyle-i18n.js',
		     	nonull: true
		    }
		},

		copy: 
		{
		  	main: 
		  	{
		    	expand: true,
		    	cwd: 'src/',
		    	src: '**',
		    	dest: 'dist'
		  	},
		  	
		  	lang: 
		  	{
		    	expand: true,
		    	cwd: 'src/i18n',
		    	src: '**',
		    	dest: 'dist/i18n'
		  	}
		},

		uglify: 
		{
			options: 
			{
				banner: sBanner,
				mangle: true
			},

			build: 
			{
				src: 'src/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js',
				nonull: true
			},

			customuglify: 
			{
		      	src: 'src/calenstyle-custom.js',
		      	dest: 'dist/calenstyle-custom.min.js',
		      	nonull: true
		    }
		},
		
		cssmin: 
		{
			options: 
			{
				banner: sBanner
			},
			build: 
			{
				src: ['src/<%= pkg.name %>.css', 'src/calenstyle-jquery-ui-override.css'],
				dest: 'dist/<%= pkg.name %>.min.css',
				nonull: true
			}
		},

		watch: 
		{
			dev: 
			{
				files: sAWatch,
				tasks: ['concat:dist']
			},

			prod: 
			{
				files: sAWatch,
				tasks: ['default']
			}
		},

		jshint: 
		{
			core: 'src/calenstyle-core.js',
			MonthView: 'src/calenstyle-monthview.js',
			DetailView: 'src/calenstyle-detailview.js',
			QuickAgendaView: 'src/calenstyle-quickagendaview.js',
			TaskPlannerView: 'src/calenstyle-taskplannerview.js',
			AgendaView: 'src/calenstyle-agendaview.js',
			DayListView: 'src/calenstyle-daylistview.js',
			WeekPlannerView: 'src/calenstyle-weekplannerview.js',
			AppointmentView: 'src/calenstyle-appointmentview.js',
			Pickers: 'src/calenstyle-pickers.js',
			FilterBar: 'src/calenstyle-filterbar.js',

			Main: ['src/calenstyle.js'],

			options:
			{
				strict: false,

				curly: false,
			
      			eqeqeq: true,
      			eqnull: true,
      			browser: true,
				devel: true,
				//unused: true,
				//undef: true,
			
				globals: 
				{
					$: false,
        			jQuery: false,
        			define: false,
        			require: false,
        			module: false,
        			Hammer: true,
        			CalenStyle: true
      			},

      			force: true
			}
		},

		csslint:
		{
			dist:
			{
				src: ['src/*.css']
			},

			options:
			{
				"adjoining-classes": false,
				"important": false,
				"universal-selector": false,
				"box-sizing": false,
				"box-model": false,
				"overqualified-elements": false,
				"unqualified-attributes": false,
				"fallback-colors": false,
				"font-sizes": false,
				"floats": false,
				"display-property-grouping": false,
				"ids": false,
				"vendor-prefix": false,
				"regex-selectors": false
			}
		},

		eslint:
		{
			target: ['src/calenstyle.js']
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
 	grunt.loadNpmTasks('grunt-contrib-copy'); 	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-eslint');

	grunt.registerTask('common', ['copy', 'uglify', 'cssmin']);

  	grunt.registerTask('default', ['concat:dist', 'common']);
  	//grunt.registerTask('default', ['concat:dist']);

  	grunt.registerTask('customconcat', ['concat:customconcat', 'default']);

  	grunt.registerTask('updateLanguages', ['concat:lang', 'copy:lang']);

  	grunt.registerTask('CalenStyleConcat', function()
	{
		var sViewBannerText = "\n You can use following views with CalenStyle Custom File - \n";
		sAJSCustom.push(sAJS[0]);

		grunt.log.writeln("Input Views");
		grunt.log.writeln(this.args);

		for(var iTempIndex = 0; iTempIndex < this.args.length; iTempIndex++)
		{
			var sViewName = this.args[iTempIndex];

			if(sViewName === "DetailedMonthView" || sViewName === "MonthView" || sViewName === "DatePicker")
				sViewBannerText += "\n DetailedMonthView, MonthView, DatePicker \n";
			else if(sViewName === "WeekView" || sViewName === "DayView" || sViewName === "CustomView" || sViewName === "DayEventDetailView")
				sViewBannerText += "\n WeekView, DayView, CustomView \n";
			else if(sViewName === "DayEventListView" || sViewName === "DayEventDetailView")
				sViewBannerText += "\n DayEventListView, DayEventDetailView \n";
			else if(sViewName === "AgendaView")
				sViewBannerText += "\n AgendaView \n";
			else if(sViewName === "QuickAgendaView")
				sViewBannerText += "\n QuickAgendaView \n";
			else if(sViewName === "TaskPlannerView")
				sViewBannerText += "\n TaskPlannerView \n";
			else if(sViewName === "WeekPlannerView")
				sViewBannerText += "\n WeekPlannerView \n";
			else if(sViewName === "AppointmentView")
				sViewBannerText += "\n AppointmentView \n";
			else if(sViewName === "FilterBar")
				sViewBannerText += "\n FilterBar \n";
			else if(sViewName === "Pickers")
				sViewBannerText += "\n MonthPicker and YearPicker \n";
		
			if(sViewName === "DetailedMonthView")
				addFileToCustomArray(sAJS[1]);
			else if(sViewName === "MonthView")
				addFileToCustomArray(sAJS[1]);
			else if(sViewName === "DatePicker")
				addFileToCustomArray(sAJS[1]);

			else if(sViewName === "WeekView")
				addFileToCustomArray(sAJS[2]);
			else if(sViewName === "DayView")
				addFileToCustomArray(sAJS[2]);
			else if(sViewName === "CustomView")
				addFileToCustomArray(sAJS[2]);

			else if(sViewName === "QuickAgendaView")
				addFileToCustomArray(sAJS[3]);

			else if(sViewName === "TaskPlannerView")
				addFileToCustomArray(sAJS[4]);

			else if(sViewName === "AgendaView")
				addFileToCustomArray(sAJS[5]);

			else if(sViewName === "WeekPlannerView")
				addFileToCustomArray(sAJS[6]);

			else if(sViewName === "DayEventListView")
				addFileToCustomArray(sAJS[7]);

			else if(sViewName === "DayEventDetailView")
			{
				addFileToCustomArray(sAJS[7]);
				addFileToCustomArray(sAJS[2]);
			}

			else if(sViewName === "AppointmentView")
				addFileToCustomArray(sAJS[8]);

			else if(sViewName === "FilterBar")
				addFileToCustomArray(sAJS[9]);

			else if(sViewName === "Pickers")
				addFileToCustomArray(sAJS[10]);
		}

		grunt.log.writeln(sViewBannerText);

		grunt.task.run('customconcat');
	});

	function addFileToCustomArray(sFileName)
	{
		for(iTempIndex = 0; iTempIndex < sAJSCustom.length; iTempIndex++)
		{
			if(sAJSCustom[iTempIndex] === sFileName)
				return true;
		}
		sAJSCustom.push(sFileName);
		return true;
	}

	grunt.registerTask('lint', ['jshint:Main', 'csslint']);

};