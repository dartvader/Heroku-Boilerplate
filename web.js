
/*
	CalendarsRepo class is being used for persistance
*/

function CalendarsRepo() {
	this.calendars = [];
	this.userNames = [];
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

CalendarsRepo.prototype.getByUser =  function(userName) {
	var calFound = [];

	this.calendars.filter(function (item) {
		if (item.userName == userName) {
			console.log("passed in user name " + userName);
			console.log("Calendar user name " + item.userName);
			calFound.push(item);
		}
	}); 

	if (calFound == null) {
		throw new Error('User name has no calendars');
	}
	return calFound
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
        // add events array
        calendar.events = [];
        this.userNames.forEach(function(value) {

        	console.log('events found ' + value.userName);

	        if (value.userName != calendar.userName) {
        		this.userNames.push(calendar.userName);
	        } else {
	        	throw new Error('User Name already exists');
	        }
	    });
        this.calendars.push(calendar);
        // auto increment ids that are being applied to the calanders
        this.nextId++;
    } else {
    	throw new Error('This id is aready used');
    }
}

CalendarsRepo.prototype.addEvent = function (newEvent, calId) {
    newEvent.Id = this.nextEventId;
    // add calendar to the array
    console.log('adding events ' + newEvent.description);
    this.calendars[calId - 1].events.push(newEvent);
    this.nextEventId++;
}


CalendarsRepo.prototype.findEvents = function (calId, start, end) {

    var calId = this.findIndex(calId);
    var eventsFound = [];

    this.calendars[calId - 1].events.forEach(function(value) {
        if (value.startTime > start && value.endTime < end) {
            console.log('events found ' + value.Id);
            eventsFound.push[value];
        }
    });

    if (null == index) {
        throw new Error('No events are in this time frame');
    }
    return eventsFound;
}

CalendarsRepo.prototype.removeEvent = function (eventId, calId) {
    var index = null;

    var calId = this.findIndex(calId);

    console.log("found calendar " + calId);
    this.calendars[calId].events.forEach(function(item, key) {
        if (item.Id == eventId) {
        	console.log("found event " + key);
            index = key;
        }
    });
    if (index == null) {
        throw new Error('event not found');
    }
    this.calendars[calId].events.splice(index, 1);
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

app.get('/', function (request, response) {
	console.log("Hello ");
    response.json({calendars: calRepo.findAll()});
});
app.get('/calendars', function (request, response) {
    response.json({calendars: calRepo.findAll()});
});
/*
	retrieve a specific calendar
	works
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
	this call requires full dates MM-DD-YYYY HH:MM:SS
	curl -i -X GET http://localhost:5000/calendars/1/ "13-06-2014 08:00:00"/"13-12-2014 18:00:00"

*/
app.get('/calendars/getEvents/:id/:startTime/:endTime', function (request, response) {
	var id = request.params.id;
	var start = request.params.startTime;
	var end = request.params.endTime;

	console.log('Calendarid ' + id + ' start ' + start + ' end ' + end);

    try {
		console.log('Calendarid ' + id + ' start ' + start + ' end ' + end);
        response.json(calRepo.findEvents(id , start, end));
    } catch (exeception) {
        response.send(404);
    }
});
/* 
	get calendars belong to the specific user name passed through 
	WORKS
*/
app.get('/calendars/getByUser/:user', function (request, response) {
	try {
		var userName = request.params.user;
		console.log("passed variable " + request.params.user);
    	console.log("Calendar user name " + userName);
		response.json(calRepo.getByUser(userName));

    } catch (exeception) {
        response.send(404);
    }
});
/*
	create a new calendar
	curl -i -X POST http://calendernodejs-lee.herokuapp.com/calendars --data '{"userName":"leeee","password":"leeeespass"}' -H "Content-Type: application/json"
	WORKS
*/
app.post('/newCalendar', function (request, response) {
	var cal = request.body;
	try {
		calRepo.addCalendar({
			// intialise the caled
			userName: cal.userName,
			password: cal.password
		});
		response.send(200);
	} catch (exeception) {
		response.send(404);
	}
});
/*
	adding a new event to a specific calendar

	curl -i -X PUT http://calendernodejs-lee.herokuapp.com/calendars/newEvent/1 --data '{"startTime":"13-06-2014 08:00:00","endTime":"15-12-2014 18:00:00"}' -H "content-Type: application/json"
	curl -i -X PUT http://localhost:5000/calendars/newEvent/1 --data '{"startTime":"13-06-2014 08:00:00","endTime":"15-12-2014 18:00:00"}' -H "content-Type: application/json"
	

	WORKING
*/
app.put('/calendars/newEvent/:id', function (request, response) {

    var newEvent = request.body;
    var calId = request.params.id;
    console.log('adding events ' + calId);
    var start, end;

    try {
        calRepo.addEvent({
	            description: newEvent.description || 'something boring',
	            startTime: newEvent.startTime || new Date(),
	            endTime: newEvent.endTime || new Date(),
	            location: newEvent.location || 'url',
	            repeats: newEvent.repeats || 'None'}
        	, calId);
        console.log('adding events ' + calId);
        response.send(200);
    } catch (exception) {
        response.send(404);
    }
});
/*
	delete a specific event from a calendar
	WORKING
*/
app.delete('/deleteEvent/:calId/:eventId', function (request, response) {
    try {
    	console.log("Removing event ");
        calRepo.removeEvent(request.params.calId, request.params.eventId);
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});
/*
 	delete a specific calendar from calendars
 	works
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

