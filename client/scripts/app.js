var othermessage = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};

var app = {};
app.init = function(){};
app.send = function(){};


window.lastAddedAt = 0;
window.intervalExists = undefined;
window.chatWindow = $('#container');
window.friends = {};
window.rooms = {lobby:'lobby'};

var displayMessage = function(data, isAppend) {
  _.each(data, function(messageObj) {
    var $msg = $('<div class="chat" data-id="' + messageObj.objectId +
     '"><div class="username"><a href="" data-username="'+messageObj.username+'">' + messageObj.username + '</a></div>' +
    '<div class="message">'+ messageObj.text + '</div>' +
    '<div class="time-created">' + messageObj.createdAt +'</div>' +
    '</div>');
    if(isAppend) {
      chatWindow.append($msg);
    } else {
      chatWindow.prepend($msg);
    }
  });
};

var submitMessage = function(){};


var sendMessage = function(message){
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
    data: {limit:20,order:'-createdAt'},
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
    data: {where:{'createdAt':{"$gt":lastAddedAt}}},
    contentType: 'application/json',
    success: function (data) {
      if(data.results.length > 0) {
        window.lastAddedAt = data.results[data.results.length-1].createdAt;
        displayMessage(data.results, true);
        chatWindow.find(".chat:nth-child(-n+" + data.results.length +")").remove();
        console.log('chatterbox: Message retrieved');
      }
    },
    error: function(data) {
      console.error('chatterbox: Message NOT retrieved');
    }
  });
};

var getRooms = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {limit:200, order:'-createdAt', keys:'roomname'},
    contentType: 'application/json',
    success: function (data) {
      console.log('Got Rooms');
      populateRooms(data.results);
    },
    error: function(data) {
      console.error('chatterbox: Message NOT retrieved');
    }
  });
};

var populateRooms = function(roomData) {

  var roomsD = roomData.map(function(object){
    return object.roomname;
  });
  for(var i = 0; i < roomsD.length; i++) {
    if(roomsD[i] !== undefined && roomsD[i] !== "" && roomsD[i].indexOf('script') < 0){
      var currentRoom =  sanitizeData(roomsD[i]);
      rooms[currentRoom] = currentRoom;
    }
  }
};

var sanitizeData = function(inputText) {
  return inputText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
};


$(".getMsg").click(getMessages);
$(".sendMsg").click(sendMessage);

$("#input-form").submit(function(e){
  var message = {
    'username': "fsdfdsfds",
    'text': document.getElementsByTagName('input')[0].value,
    'roomname': 'lobby'
  };
  document.getElementsByTagName('input')[0].value = "";
  console.log(message);
  sendMessage(message);
  e.preventDefault();
});

chatWindow.on('click','a', function(e){
  e.preventDefault();
  console.log(e.target);
  var username = $(e.target).data('username');
  friends[username] = username;
});
