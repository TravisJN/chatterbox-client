// YOUR CODE HERE:
var currentDate = new Date();
currentDate = currentDate.toISOString();
var index=0;
//currentDate = "2014-03-17T02:36:08.233Z"

var filter = '{"createdAt" : {"$gte" : "' + currentDate + '"}}';
var app = {
	server : 'https://api.parse.com/1/classes/chatterbox'
};

var Message = function(username, text, roomname){
	this.username = username;
	this.text = text;
	this.roomname = roomname;
}

app.init = function(){
	$('#messageBox').focus();
	
	setInterval(function(){
		
		console.log(filter);
		app.fetch(filter);
	}, 3000);
}

app.send = function(message){
  $.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: 'https://api.parse.com/1/classes/chatterbox',
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message sent');
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message');
	  }
	});
}

app.fetch = function(filter){
var result = $.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: 'https://api.parse.com/1/classes/chatterbox',
	  type: 'GET',
	  data: 'where=' + filter,
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message received');
	    currentDate = new Date();
	    currentDate=currentDate.toISOString();
	    console.log(currentDate);
	    filter = '{"createdAt" : {"$gte" : "' + currentDate + '"}}';
	    console.log("now we have these results", data.results);
	    app.updateMessages(data.results);
	    index=data.results.length;


	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to receive message');
	  }
	});
}

app.clearMessages = function(){
	$('#chats').children().remove();
}

app.addMessage = function(message){
	$('#chats').append('<div class="chat"></div>');
	$('#chats').children().last().append('<div class="username">'+ message.username +'</div>');
	$('#chats').children().last().append('<div class="message">'+ message.text +'</div>');
}

app.addRoom = function(roomName){
	$('#roomSelect').append('<a href="#" class="room">' + roomName + '</a>');	
}

app.addFriend = function() {
	console.log("click");
}

app.handleSubmit = function(messageText){
	$('#messageBox').val('');
	var userNameIndex=window.location.search.indexOf("username=");
	userNameIndex+=9; // offset pass username=
	var username=window.location.search.substr(userNameIndex);
	var roomname="main";

	var message = new Message(username, messageText, roomname);
	app.send(message);
	app.addMessage(message);
}

app.updateMessages = function(data) {
  for (var i = index; i < data.length; i++){
	  var message = new Message(data[i].username, data[i].text, data[i].roomname);
	  app.addMessage(message);
  }
}

$(document).ready(function(){
	$('#main').on('click', '.username', function(event){
		app.addFriend();
	});

	$('form').submit(function(event){
		// debugger;
		event.preventDefault();
		$('#messageBox').focus();
		var messageText = $(this).children('#messageBox').val();
		app.handleSubmit(messageText);
	});
});
app.init();
// app.send(message);

