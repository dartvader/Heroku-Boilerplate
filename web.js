
/*
	CalendarsRepo class is being used for persistance
*/

function CalendarsRepo() {
	this.calendars = [];
	// id for calendars
	this.nextId = 1;
	this.nextEventId = 1;
}

CalendarsRepo.prototype.findAll = function () {
    return this.calendars;
}

CalendarsRepo.prototype.find = function (id) {
	var calendar = this.calendars.filter(function (item) {
		return item.calId == id;
	})[0];

	if (null == calendar) {
		throw new Error('Calendar does not exist');
	} 
	return calendar;
}

CalendarsRepo.prototype.findIndex = function (id) {
    var index = null;
    this.calendars.forEach(function(item, key) {
        if (item.calId == id) {
            index = key;
        }
    });
    if (null == index) {
        throw new Error('calendar not found');
    }
    return index;
}

CalendarsRepo.prototype.addCalendar = function (calendar) {
    if (calendar.calId == null || calendar.calId == 0) {
        calendar.calId = this.nextId;
        // add calendar to the array
        calendar.events = [];
        this.calendars.push(calendar);
        // auto increment
        this.nextId++;
    } else {
    	throw new Error('This id is aready used');
    }
}

CalendarsRepo.prototype.addEvent = function (newEvent, calId) {
    newEvent.Id = this.nextEventId;
    // add calendar to the array
    this.calendars[calId - 1].events.push(newEvent);
    this.nextEventId++;
}


CalendarsRepo.prototype.removeEvent = function (eventId, calId) {
    var index = null;
    var calId = this.findIndex(calId);

    this.calendars[calId].events.forEach(function(item, key) {
        if (item.calId == id) {
            index = key;
        }
    });

    if (null == index) {
        throw new Error('event not found');
    }

    this.calendars[calId].events.splice(index, 1);
    return index;
}

CalendarsRepo.prototype.removeCal = function (id) {
    var index = this.findIndex(id);
    this.calendars.splice(index, 1);
}

/* 
	-----------------
	intialise the api
	------------------
*/

var express = require('express');
var app = express();
var calRepo = new CalendarsRepo();

var port = Number(process.env.PORT || 5000);

app.configure(function () {
    app.use(express.bodyParser());
});

app.get('/calendars', function (request, response) {
    response.json({calendars: calRepo.findAll()});
});
/*
	retrieve a specific calendar
*/
app.get('/calendars/:id', function (request, response) {
	var id = request.params.id;;
    try {
		console.log('Calendarid ' + id);
        response.json(calRepo.find(id));
    } catch (exeception) {
        response.send(404);
    }
});
/* 
	get events if they are between start date and end date

*/
app.get('/calendars/:id/:startDate/:endDate', function (request, response) {
	var id = request.params.id;
	var startDate = request.params.startDate;
	var endDate = request.params.endDate;

    try {
		console.log('Calendarid ' + id);
        response.json(calRepo.find(id));
    } catch (exeception) {
        response.send(404);
    }
});
/*
	create a new calendar

	curl -i -X POST http://calendernodejs-lee.herokuapp.com/calendars 
	--data '{"userName":"leeee","password":"leeeespass"}' -H "Content-Type: application/json"
*/
app.post('/calendars', function (request, response) {
	var cal = request.body;
	calRepo.addCalendar({
		// intialise the caled
		userName: cal.userName || 'Default name',
		password: cal.password || 'Default'
	});
	response.send(200);
});
/*
	adding a new event to a specific calendar

	curl -i -X PUT http://calendernodejs-lee.herokuapp.com/calendars/newEvent/1 --data '{"startTime":"13/06/2014 08:00:00","endTime":"15/06/2014 08:00:00"}' -H "content-Type: application/json"

*/
app.put('/calendars/newEvent/:id', function (request, response) {
    var newEvent = request.body;
    var calId = request.params.id;
    try {
        calRepo.addEvent({
	            description: newEvent.description || 'something boring',
	            startTime: newEvent.startTime || 'format 02-20-2012 00:00:00',
	            endTime: newEvent.endTime || 'format 02-20-2012 00:00:00',
	            location: newEvent.location || 'home town',
	            repeats: newEvent.repeats || 'None'}
        	, calId);
        response.send(200);
    } catch (exception) {
        response.send(404);
    }
});
/*
	delete a specific event from a calendar
*/
app.delete('/calendars/:calId/:eventId', function (request, response) {
    try {
        calRepo.removeEvent(request.params.calId, eventId);
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});
/*
 	delete a specific calendar from calendars
*/
app.delete('/calendars/:id', function (request, response) {
    try {
        calRepo.removeCal(request.params.id);
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});

app.listen(port);
console.log("Listening on " + port);

