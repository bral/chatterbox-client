$(document).ready(function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    success: function(data){
      // console.log(data.results);
      messageDisplay(data.results);
    }
  });

  var messageDisplay = function(messages) {
    _.each(messages, function(message) {
      $('.messages').append('<div>' + sanatize(message.text) + '</div>');
    });
  };

  var sanatize = function(string) {
    return encodeURIComponent(string);
  };
});
