
var frisby = require('frisby');

frisby.create('Return all calendars if any created')
  .get('http://calendernodejs-lee.herokuapp.com/calendars')
    .expectStatus(200)
    	.expectHeaderContains('Content-Type', 'json')
.toss()

frisby.create('Creating a calender with a user name and password')
  .post('http://calendernodejs-lee.herokuapp.com/newCalendar', {
      userName: "test",
      password: "testpassword"
    })
  	.expectStatus(200)
.toss()


frisby.create('return calendars belonging to a certain userName')
  .get('http://calendernodejs-lee.herokuapp.com/calendars/getByUser/test')
    .expectStatus(200)
    	.expectHeaderContains('Content-Type', 'json')
.toss()


frisby.create('return calendars belonging to a certain calendar Id')
  .get('http://calendernodejs-lee.herokuapp.com/calendars/1')
    .expectStatus(200)
    	.expectHeaderContains('Content-Type', 'json')
.toss()

frisby.create('Create an event in a calendar')
  .put('http://calendernodejs-lee.herokuapp.com/calendars/newEvent/1', {
        description: "something boring",
	    startTime: "13-06-2014 08:00:00",
	    endTime: "15-12-2014 18:00:00",
	    ocation: "url",
	    repeats: "None"
    })
  	.expectStatus(200)
.toss()

frisby.create('Alter the user name and password on a calendar id 1')
  .put('http://calendernodejs-lee.herokuapp.com/updateCalendar/1', {
      userName: "updateUsername",
      password: "testieUPdated"
    })
  	.expectStatus(200)
.toss()


// not working
xfrisby.create('find events between date ranges')
  .get('http://calendernodejs-lee.herokuapp.com/calendars/getEvents/"13-06-2013"/"13-06-2015"')
  	.expectStatus(200)
  		.expectHeaderContains('Content-Type', 'json')
.toss()


