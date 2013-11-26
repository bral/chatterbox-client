var ChatterBox = function(){
  this.url = 'https://api.parse.com/1/classes/chatterbox';
  this.numMessages = 10;
};

ChatterBox.prototype.getMessages = function() {
  var that = this;
  $.ajax({
    url: this.url,
    data: {limit: this.numMessages, order: '-createdAt'},
    type: 'GET',
    success: function(data){
      // var messages = that.compareTime(data.results);
      that.messageDisplay(data.results);
    }
  });
};

ChatterBox.prototype.postMessage = function(username, message, roomname) {
  var that = this;

  $.ajax({
    url: this.url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({username: username, text: message, roomname: roomname}),
    success: function(data){
      console.log('Message posted');
    }
  });
};

ChatterBox.prototype.messageDisplay = function(messages) {
  var that = this;

  messages = messages.reverse();

  // Get current oldest message
  // var oldMessage = $('.messages').find('.message')[0];
  // var oldTimestamp = $(oldMessage).find('.timeStamp').data('timestamp');
  // console.log(oldMessage);

  var results = [];

  _.each(messages, function(message) {

    // if(oldTimestamp > message.updatedAt) {
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
    // }
  });

  // console.log(results);
  console.log('updating');
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

  setInterval(function(){
    chat.getMessages();
  }, 2000);
});
