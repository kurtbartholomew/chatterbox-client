// TODO: NEED TO place rooms in a select box.
// Selecting join will call app.init()
// Need to connect display messages and getnewmessages
// with the refactored settings

window.lastAddedAt = 0;
window.intervalExists = undefined;
window.chatWindow = $('#chats');
window.friends = {};
window.rooms = {lobby:'lobby'};

var sanitizeData = function(inputText) {
  if (inputText === null || inputText === undefined) {
    return "";
  }
  return inputText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
};

var app = {};

app.joinRoom = function(room){
  console.log(room);
  app.clearMessages();
  $('#send').show();

  app.fetch({where:{'roomname':room}}, { recurring:true });

//setInterval( function(){       })

};

app.init = function(){

  app.getRooms();
  // add an onclick handler to chat window for friending
  $("#send").hide();
  $(".join-room").on('click', function(e){
    app.joinRoom($('#roomSelect option:selected').val());
    e.preventDefault();
  });

  chatWindow.on('click','a', function(e){
    e.preventDefault();
    app.addFriend(e.target);
  });



  // add an onsubmit handler to handle chat message submission
  $("#send").submit(function(e){
    e.preventDefault();
    app.handleSubmit();
  });


  // **************************** Added recently
   app.joinRoom($('#roomSelect option:selected').val());
  // setInterval( function() { app.fetch({where:{'roomname':$('#roomSelect option:selected').val()}}, { recurring:true }); }, 10000);

};

app.send = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(options, displayOptions){
  options = options || {};
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: options,
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Messages retrieved');
      displayMessage(data.results, displayOptions );
    },
    error: function(data) {
      console.error('chatterbox: Messages NOT retrieved');
    }
  });
};
app.clearMessages = function() {
  chatWindow.html("");
};

app.addMessage = function(messageObj) {
  app.send(messageObj);
  var $msg = $('<div class="chat"><div class="username"><a href="" data-username="'+
    messageObj.username+'">' + messageObj.username + '</a></div>' +
  '<div class="message">'+ messageObj.text + '</div>' +
  '</div>');
  chatWindow.append($msg);
};

app.addRoom = function(roomName) {
  $('#roomSelect').append('<option value="'+roomName+'">'+roomName+'</option>');
};

app.addFriend = function(domNode) {
  console.log(domNode);
  var username = $(domNode).data('username');
  friends[username] = username;
};

app.handleSubmit = function() {
  var $currentMessage = $('#message');
  var message = {
    'username': "fsdfdsfds",
    'text': $currentMessage.val(),
    'roomname': $('#roomSelect option:selected').val()
  };
  $currentMessage.val('');
  console.log(message);
  app.send(message);
};

app.getRooms = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {limit:100, order:'-createdAt', keys:'roomname'},
    contentType: 'application/json',
    success: function (data) {
      console.log('Got Rooms');
      app.populateRooms(data.results);
    },
    error: function(data) {
      console.error('chatterbox: Message NOT retrieved');
    }
  });
};

app.populateRooms = function(roomData) {

  var roomsD = roomData.map(function(object){
    return object.roomname;
  });

  for(var i = 0; i < roomsD.length; i++) {
    if(roomsD[i] !== undefined  && roomsD[i] !== null  && roomsD[i] !== "" && roomsD[i].indexOf('script') < 0){
      var currentRoom =  sanitizeData(roomsD[i]);
      rooms[currentRoom] = currentRoom;
    }
  }
  _.each(rooms,function(room){
    app.addRoom(room);
  });
};

app.init();

//////////////////////////////////////////////////////////////

var displayMessage = function(data, displayOptions) {
  _.each(data, function(messageObj) {
    var $msg = $('<div class="chat"><div class="username"><a href="" data-username="'+
    sanitizeData(messageObj.username)+'">' + sanitizeData(messageObj.username) + '</a></div>' +
  '<div class="message">'+ sanitizeData(messageObj.text) + '</div>' +
  '</div>');
    if(displayOptions.recurring) {
      // append and remove old
      //
      // call
      chatWindow.append($msg);
    } else {
      chatWindow.prepend($msg);
    }
  });
};

// var sendMessage = function(message){
//   $.ajax({
//     // always use this url
//     url: 'https://api.parse.com/1/classes/chatterbox',
//     type: 'POST',
//     data: JSON.stringify(message),
//     contentType: 'application/json',
//     success: function (data) {
//       console.log('chatterbox: Message sent');
//     },
//     error: function (data) {
//       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to send message');
//     }
//   });
// };

// var getMessages = function(){
//   $.ajax({
//     url: 'https://api.parse.com/1/classes/chatterbox',
//     type: 'GET',
//     data: {limit:20,order:'-createdAt'},
//     contentType: 'application/json',
//     success: function (data) {
//       window.lastAddedAt = data.results[data.results.length-1].createdAt;
//       displayMessage(data.results, false);
//       console.log(data);
//       console.log('chatterbox: Message retrieved');
//       if(!intervalExists){
//         window.intervalExists = setInterval(getNewMessages,1000);
//       }
//     },
//     error: function(data) {
//       console.error('chatterbox: Message NOT retrieved');
//     }
//   });
// };

// var getNewMessages = function(){
//   $.ajax({
//     url: 'https://api.parse.com/1/classes/chatterbox',
//     type: 'GET',
//     data: {where:{'createdAt':{"$gt":lastAddedAt}}},
//     contentType: 'application/json',
//     success: function (data) {
//       if(data.results.length > 0) {
//         window.lastAddedAt = data.results[data.results.length-1].createdAt;
//         displayMessage(data.results, true);
//         chatWindow.find(".chat:nth-child(-n+" + data.results.length +")").remove();
//         console.log('chatterbox: Message retrieved');
//       }
//     },
//     error: function(data) {
//       console.error('chatterbox: Message NOT retrieved');
//     }
//   });
// };

app.getRooms = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {limit:100, order:'-createdAt', keys:'roomname'},
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

app.populateRooms = function(roomData) {

  var roomsD = roomData.map(function(object){
    return object.roomname;
  });
  for(var i = 0; i < roomsD.length; i++) {
    if(roomsD[i] !== undefined  && roomsD[i] !== null  && roomsD[i] !== "" && roomsD[i].indexOf('script') < 0){
      var currentRoom =  sanitizeData(roomsD[i]);
      rooms[currentRoom] = currentRoom;
    }
  }
  _.each(rooms,function(room){
    app.addRoom(room);
  });
};


// $(".getMsg").click(getMessages);
// $(".sendMsg").click(sendMessage);

// $("#input-form").submit(function(e){
//   var message = {
//     'username': "fsdfdsfds",
//     'text': document.getElementsByTagName('input')[0].value,
//     'roomname': 'lobby'
//   };
//   document.getElementsByTagName('input')[0].value = "";
//   console.log(message);
//   sendMessage(message);
//   e.preventDefault();
// });

// chatWindow.on('click','a', function(e){
//   e.preventDefault();
//   console.log(e.target);
//   var username = $(e.target).data('username');
//   friends[username] = username;
// });
