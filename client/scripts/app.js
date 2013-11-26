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
      $(Object.keys(rooms)).each(function(i, room){
        // $('.rooms').append('<li>' + room + '</li>');
        room = that.sanatize(room);
        results.push($('<li><a href="#" class="roomLink" data-roomname="' + room + '">' + room + '</a></li>'));
      });
      $('.rooms').html(results);

      $('.roomLink').on('click', function(event) {
        event.preventDefault();
        that.room = $(this).data('roomname');
      });
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
                  '</span></div>'));

  });

  $('.messages').html(results);
};

ChatterBox.prototype.sanatize = function(string) {
  return $('<div></div>').text(string).html();
};

// Returns array of messages that aren't already displayed.
// ChatterBox.prototype.compareTime = function(messages) {
//   var oldMessage = $('.messages').find('.message')[0];
//   var oldTimestamp = $(oldMessage).find('.timeStamp').data('timestamp');

//   if(oldTimestamp === undefined) {
//     return messages;
//   } else {
//     // compare timestamps
//     for(var i = 0; i < messages.length; i++) {
//       console.log('Comparing', moment(oldTimestamp).unix(), moment(messages[i].createdAt).unix());
//       if(moment(oldTimestamp).unix() < moment(messages[i].createdAt).unix()) {
//         console.log('removed', messages.splice(i, 1));
//       }
//     }
//     return messages;
//   }
// };


$(document).ready(function() {
  var chat = new ChatterBox();

  $('.textMessage').submit(function(event){
    event.preventDefault();
    var $messageInput = $('.textMessage input[type=text]');
    var msg = $messageInput.val();

    if(chat.postMessage(chat.username, msg, 'hackreactor')) {
      $messageInput.val("");
    }


  });



  setInterval(function(){
    chat.roomDisplay();
    chat.getMessages();
  }, 2000);
});
