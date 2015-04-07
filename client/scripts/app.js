var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};

window.lastAddedAt = 0;
window.intervalExists = undefined;

var displayMessage = function(data, isAppend) {
   var container = $('.container');
  _.each(data, function(messageObj) {
    var $msg = $('<div class="chat" data-id="' + messageObj.objectId +
     '"><div class="username">' + messageObj.username + '</div>' +
    '<div class="message">'+ messageObj.text + '</div>' +
    '<div class="time-created">' + messageObj.createdAt +'</div>' +
    '<div class="time-updated" data-updated-at ="' + messageObj.updatedAt +
    '">' + messageObj.updatedAt + '</div>' +
    '</div>');
    if(isAppend) {
      container.append($msg);
    } else {
      container.prepend($msg);
    }
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
    data: {limit:50,order:'-createdAt'},
    contentType: 'application/json',
    success: function (data) {
      window.lastAddedAt = data.results[data.results.length-1].createdAt;
      displayMessage(data.results, false);
      console.log(data);
      console.log('chatterbox: Message retrieved');
      if(!intervalExists){
        window.intervalExists = setInterval(getNewMessages,1000);
      }
    },
    error: function(data) {
      console.error('chatterbox: Message NOT retrieved');
    }
  });
};

var getNewMessages = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {where:{'createdAt':{"$gte":lastAddedAt}}},
    contentType: 'application/json',
    success: function (data) {
      window.lastAddedAt = data.results[data.results.length-1].createdAt;
      displayMessage(data.results, true);
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
