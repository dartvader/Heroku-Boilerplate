
var frisby = require('frisby');

frisby.create('Return all calendars if any created')
  .get('http://calendernodejs-lee.herokuapp.com/calendars')
    .expectStatus(200)
    	.expectHeaderContains('Content-Type', 'json')
.toss()

frisby.create('Creating a calender with a user name and password')
  .post('http://calendernodejs-lee.herokuapp.com/calendars/new', {
      userName: "test",
      password: "testpassword"
    })
  	.expectStatus(200)
.toss()


frisby.create('return calendars belonging to a certain userName')
  .get('http://calendernodejs-lee.herokuapp.com/calendars/test/getByUser')
    .expectStatus(200)
    	.expectHeaderContains('Content-Type', 'json')
.toss()


frisby.create('return calendars belonging to a certain calendar Id')
  .get('http://calendernodejs-lee.herokuapp.com/calendars/1')
    .expectStatus(200)
    	.expectHeaderContains('Content-Type', 'json')
.toss()


frisby.create('Alter the user name and password on a calendar id 1')
  .put('http://calendernodejs-lee.herokuapp.com/calendars/1/updateCalendar', {
      userName: "updateUsername",
      password: "testieUPdated"
    })
  	.expectStatus(200)
.toss()


frisby.create('Create an event on a calendar id 1')
  .put('http://calendernodejs-lee.herokuapp.com/calendars/1/newEvent', {
        description: "something boring",
	    startTime: "13-06-2014 08:00:00",
	    endTime: "15-12-2014 18:00:00",
	    location: "url",
	    repeats: "None"
    })
  	.expectStatus(200)
.toss()

frisby.create('Create an event in a calendar that will not exist -- epecting error')
  .put('http://calendernodejs-lee.herokuapp.com/calendars/newEvent/100000000000000', {
        description: "something boring",
	    startTime: "13-06-2014 08:00:00",
	    endTime: "15-12-2014 18:00:00",
	    location: "url",
	    repeats: "None"
    })
  	.expectStatus(404)
.toss()







