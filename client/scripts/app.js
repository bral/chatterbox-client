var ChatterBox = function(){
  this.url = 'https://api.parse.com/1/classes/chatterbox';
  this.numMessages = 10;
  this.username = (prompt('What is your name?') || 'anonymous');
  this.room = undefined;
};

ChatterBox.prototype.getMessages = function() {
  var that = this;
  var query = {limit: this.numMessages, order: '-createdAt'};

  if (this.room !== undefined) {
    query['where'] = {roomname: this.room};
  }

  $.ajax({
    url: this.url,
    data: query,
    type: 'GET',
    success: function(data){
      that.messageDisplay(data.results);

    }
  });
};

ChatterBox.prototype.roomDisplay = function() {
  var that = this;

  $.ajax({
    url: this.url,
    data: {limit: 100, order: '-createdAt'},
    type: 'GET',
    success: function(data){
      var rooms = {};

      _.each(data.results, function(message) {
        // console.log(message);
        rooms[message.roomname] = true;
      });

      // $('.rooms').append(Object.keys(room));
      var results = [];
      results.push($('<option value="">Select a room</option>'));
      $(Object.keys(rooms)).each(function(i, room){
        // $('.rooms').append('<li>' + room + '</li>');
        room = that.sanatize(room);
        results.push($('<option value="' + room + '">' + room + '</option>'));
      });
      $('.rooms').html(results);


    }
  });
};

ChatterBox.prototype.postMessage = function(username, message, roomname) {
  var that = this;

  return $.ajax({
    url: this.url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({username: username, text: message, roomname: roomname}),
    success: function(data){
      return true;
    },
    error: function(){
      return false;
    }
  });
};

ChatterBox.prototype.messageDisplay = function(messages) {
  var that = this;

  messages = messages.reverse();

  var results = [];

  _.each(messages, function(message) {

  results.push($('<div class="message">' +
                  '<span class="username">' +
                  that.sanatize(message.username) +
                  '</span> ' +
                  that.sanatize(message.text) +
                  ' <span class="timeStamp" data-timestamp="' +
                  message.updatedAt +
                  '">' +
                  moment(message.updatedAt).startOf('hour').fromNow() +
                  '</span><span class="messageRoomName"> ' +
                  that.sanatize(message.roomname) +
                  '</span></div>'));

  });

  $('.messages').html(results);
};

ChatterBox.prototype.sanatize = function(string) {
  return $('<div></div>').text(string).html();
};


$(document).ready(function() {
  var chat = new ChatterBox();

  $('.textMessage').submit(function(event){
    event.preventDefault();
    var $messageInput = $('.textMessage input[type=text]');
    var msg = $messageInput.val();

    if(chat.postMessage(chat.username, msg, chat.room)) {
      $messageInput.val("");
    }

  });

  $('.rooms').change(function(event) {
    event.preventDefault();
    console.log($(this).val());
    chat.room = $(this).val();
  });

  $('.newRoom').submit(function(event) {
    event.preventDefault();

    chat.room = $(this).find('input').val();
  });

  setInterval(function(){
    chat.roomDisplay();
    chat.getMessages();
  }, 2000);
});
