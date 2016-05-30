
var express = require('express'),
routes = require('./index.js');

var app = express();

app.get('/events', routes.events);
app.get('/eventcalender', routes.eventcalender);
app.get('/eventcount', routes.eventcount);
app.get('/timeslotcount', routes.timeslotcount);
app.get('/slotavailability', routes.slotavailability);
app.get('/filtercriteria', routes.filtercriteria);
app.get('/misc', routes.misc);

app.listen(3000, function()
{
  console.log("Express server listening on port 3000");
  console.log("Use following URLS - http://localhost:3000 or http://[IP address of your machine]:3000");
});
