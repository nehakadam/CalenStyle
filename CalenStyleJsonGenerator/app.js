
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");// restrict it to the required domain
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	 // Set custom headers for CORS
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
	next();
});

// development only
if ('development' === app.get('env')) 
{
	app.use(express.errorHandler());
}
app.get('/',function(req,res){
	res.json('hello');
});
app.get('/events', routes.events);
app.get('/eventcalender', routes.eventcalender);
app.get('/eventcount', routes.eventcount);
app.get('/timeslotcount', routes.timeslotcount);
app.get('/slotavailability', routes.slotavailability);
app.get('/filtercriteria', routes.filtercriteria);
app.get('/misc', routes.misc);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
