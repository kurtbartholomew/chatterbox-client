


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

app.getNewMessages = function(room){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {where:{'createdAt':{"$gt":lastAddedAt},'roomname':room}},
    contentType: 'application/json',
    success: function (data) {
      if(data.results.length > 0) {
        window.lastAddedAt = data.results[data.results.length-1].createdAt;
        displayMessage(data.results, true);
        if(chatWindow.children().length > 20){
          chatWindow.find(".chat:nth-child(-n+" + data.results.length +")").remove();
        }
      }
      if($('#roomSelect option:selected').val() === room) {
        app.getNewMessages(room);
      }
    },
    error: function(data) {
      console.error('chatterbox: Message NOT retrieved');
    }
  });
};

app.joinRoom = function(room){
  app.clearMessages();
  $('#send').show();

  app.fetch({where:{'roomname': room}}, { initial: true });
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

  $(".room-create").on('click', function(e){

    var $roomName = $('#room-input');
    app.addRoom($roomName.val());

    $roomName.val('');
    e.preventDefault();

  });

   app.joinRoom('lobby');
};

app.send = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
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
      if(data.results.length > 0){
        window.lastAddedAt = data.results[data.results.length-1].createdAt;
        displayMessage(data.results, displayOptions );
        if(options.where.roomname){
          app.getNewMessages(options.where.roomname);
        }
      }
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
  app.send(message);
};

app.getRooms = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {limit:100, order:'-createdAt', keys:'roomname'},
    contentType: 'application/json',
    success: function (data) {
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

var displayMessage = function(data, displayOptions) {
  _.each(data, function(messageObj) {
    var $msg = $('<div class="chat"><div class="username"><a href="" data-username="'+
    sanitizeData(messageObj.username)+'">' + sanitizeData(messageObj.username) + '</a></div>' +
  '<div class="message">'+ sanitizeData(messageObj.text) + '</div>' +
  '</div>');
    if(displayOptions.initial) {
      chatWindow.prepend($msg);
    } else {
      chatWindow.append($msg);
    }
  });
};

app.init();
