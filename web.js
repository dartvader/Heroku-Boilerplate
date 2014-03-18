

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
    // auto increment
    this.nextEventId++;
}

CalendarsRepo.prototype.removeEvent = function (eventId, calId) {
    var index = null;
    this.calendars[this.findIndex(calId)].events.forEach(function(item, key) {
        if (item.calId == id) {
            index = key;
        }
    });
    if (null == index) {
        throw new Error('event not found');
    }
    return index;
}

CalendarsRepo.prototype.remove = function (id) {
    var index = this.findIndex(id);
    // remove
    this.calendars.splice(index, 1);
}

// Develop the api
// Intialise the CRUD calls

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

// retrieve a specific calendar
app.get('/calendars/:id', function (request, response) {
	var id = request.params.id;;
    try {
		console.log('Calendarid ' + id);
        response.json(calRepo.find(id));
    } catch (exeception) {
        response.send(404);
    }
});

// create a new calendar
app.post('/calendars', function (request, response) {
	var cal = request.body;
	calRepo.addCalendar({
		// intialise the caled
		userName: cal.userName || 'Default name',
		password: cal.password || 'Default'
	});
	response.send(200);
});

// add a calendar
app.put('/calendars/newEvent/:id', function (request, response) {
    var newEvent = request.body;
    var calId = request.params.id;
    try {
        calRepo.addEvent({
        		date: newEvent.date || 'today',
	            description: newEvent.description || 'something boring',
	            startTime: newEvent.start || 'today oclock',
	            endTime: newEvent.status || 'never oclock',
	            location: newEvent.location || 'home town',
	            repeats: newEvent.repeats || 'None'}
        	, calId);
        response.send(200);
    } catch (exception) {
        response.send(404);
    }
});
// delete a specific event from a calendar
app.delete('/calendars/:calId/:eventId', function (request, response) {
    try {
        calRepo.removeEvent(request.params.calId, eventId);
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});
// delete a calendar
app.delete('/calendars/:id', function (request, response) {
    try {
        calRepo.remove(request.params.id);
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});

app.listen(port);

