
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
        calendar.events = [];
        this.calendars.push(calendar);
        // auto increment ids that are being applied to the calanders
        this.nextId++;
    } else {
    	throw new Error('This id is aready used');
    }
}

CalendarsRepo.prototype.updateCalendar = function (updatedCalendar) {

    var index = this.findIndex(updatedCalendar.calId);
    this.calendars[index] = updatedCalendar;
}

CalendarsRepo.prototype.addEvent = function (newEvent, calId) {
    newEvent.Id = this.nextEventId;
    this.calendars[calId - 1].events.push(newEvent);
    this.nextEventId++;
}

CalendarsRepo.prototype.removeEvent = function (calId, eventId) {
    var index = null;
    var calId = this.findIndex(calId);

    this.calendars[calId].events.forEach(function(item, key) {
        if (item.Id == eventId) {
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
	REST api
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
	works
*/
app.get('/calendars/:id', function (request, response) {
	var id = request.params.id;;
    try {
        response.json(calRepo.find(id));
    } catch (exeception) {
        response.send(404);
    }
});
/* 
	get calendars belong to the specific user name passed through 

*/
app.get('/calendars/:user/getByUser', function (request, response) {
	try {
		var userName = request.params.user;
		response.json(calRepo.getByUser(userName));

    } catch (exeception) {
        response.send(404);
    }
});
/* 
	get events if they are between start date and end date
	this call requires full dates MM-DD-YYYY HH:MM:SS
	curl -i -X GET http://localhost:5000/calendars/getEvents/1/ "13-06-2014 08:00:00"/"13-12-2014 18:00:00"

*/
app.get('/calendars/:id/getEvents/:startTime/:endTime', function (request, response) {
	var calId = request.params.id;
	var start = request.params.startTime;
	var end = request.params.endTime;

    try {
        response.json(calRepo.findEvents(calId , start, end));
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});
/*
	create a new calendar
	curl -i -X POST http://calendernodejs-lee.herokuapp.com/calendars --data '{"userName":"leeee","password":"leeeespass"}' -H "Content-Type: application/json"
	WORKS
*/
app.post('/calendars/new', function (request, response) {
	var cal = request.body;
	try {
		calRepo.addCalendar({
			userName: cal.userName  || 'need a userName',
			password: cal.password || 'need a password'
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
app.put('/calendars/:id/newEvent', function (request, response) {

    var newEvent = request.body;
    var calId = request.params.id;

    var start, end;

    try {
        calRepo.addEvent({
	            description: newEvent.description || 'something boring',
	            startTime: newEvent.startTime || 'not specified',
	            endTime: newEvent.endTime || 'not specified',
	            location: newEvent.location || 'url',
	            repeats: newEvent.repeats || 'None'}
        	, calId);
        response.send(200);
    } catch (exception) {
        response.send(404);
    }
});
// updating the calenders itself
// curl -i -X PUT http://localhost:5000/updateCalendar/3 --data '{"userName":"fffffffff","password":"fffffff"}' -H "Content-Type: application/json"
app.put('/calendars/:id/updateCalendar', function (request, response) {

    var updatedCal = request.body;
    var calId = request.params.id;
    try {
    	var persistedCal = calRepo.find(calId);

    	calRepo.updateCalendar({
        	calId: persistedCal.calId,
	        userName: updatedCal.userName || persistedCal.userName,
	        password: updatedCal.password || persistedCal.password,
	        events: persistedCal.events
	    });

        response.send(200);
    } catch (exception) {
        response.send(404);
    }
});
/*
	delete a specific event from a calendar
*/
app.delete('/calendars/:calId/deleteEvent/:eventId', function (request, response) {
    try {
        calRepo.removeEvent(request.params.calId, request.params.eventId);
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});
/*
 	delete a specific calendar from calendars
*/
app.delete('/calendars/:id/delete', function (request, response) {
    try {
        calRepo.removeCal(request.params.id);
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});

// delete all
app.delete('/calendars/deleteAll', function (request, response) {
    try {
        calRepo.calendars = [];
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});

app.listen(port);
console.log("Listening on " + port);

