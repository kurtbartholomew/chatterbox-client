// YOUR CODE HERE:
// 

var getMessages = function() {
  console.log("Looking for messages");
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      displayMessages(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}

var updateMessages = function() {

};

var displayMessages = function(messageData) {
  console.log(messageData);  
  messageData.results.forEach(function(message){
    $messageDiv = $('<div class="chat"><div class="username" data-username="'+message.username+'">'+ message.username
      +'</div><div class="message" data-message="'+message.text+'">'+ message.text
      +'</div><div class="dateCreated" data-created="'+message.createdAt+'">'+ message.createdAt
      +'</div><div class="lastUpdated" data-updated="'+message.updatedAt+'">'+ message.updatedAt
      +'</div>');
    $('.container').append($messageDiv);
  });
};

$('.retrieve').on('click', getMessages);

var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};

// $.ajax({
//   // always use this url
//   url: 'https://api.parse.com/1/classes/chatterbox',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message');
//   }
// });
