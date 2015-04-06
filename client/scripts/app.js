var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};

var displayMessage = function(data) {
   var container = $('.container');
  _.each(data, function(messageObj) {
    var $msg = $('<div class="chat" data-id="' + messageObj.objectId +
     '"><div class="username">' + messageObj.username + '</div>' +
    '<div class="message">'+ messageObj.text + '</div>' +
    '<div class="time-created">' + messageObj.createdAt +'</div>' +
    '<div class="time-updated" data-updated-at ="' + messageObj.updatedAt +
    '">' + messageObj.updatedAt + '</div>' +
    '</div>');
    container.append($msg);
  });
};


var sendMessage = function(){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var getMessages = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      displayMessage(data.results);
   //   $('.container').append(JSON.stringify(data));
      console.log(data);
      console.log('chatterbox: Message retrieved');
    },
    error: function(data) {
      console.error('chatterbox: Message NOT retrieved');
    }
  });
};

$(".getMsg").click(getMessages);
$(".sendMsg").click(sendMessage);
