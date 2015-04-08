

var Message = Backbone.Model.extend({
 url: 'https://api.parse.com/1/classes/chatterbox',
 defaults: {
  username: ''
 }

});

var Messages = Backbone.Collection.extend({
  model:Message,
  url: 'https://api.parse.com/1/classes/chatterbox',
  loadMessages: function(){
    this.fetch({data:{order:'-createdAt'}});
  },
  parse: function(data) {
    return data.results;
  }

});

var MessageView = Backbone.View.extend({

  template: _.template('<div class="chat"> \
    <div class="username"><a href="">      \
    <%- username %></a></div>              \
    <div class="message"><%- text %></div>'),

  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MessagesView = Backbone.View.extend({


  initialize: function(){
    this.collection.on('sync', this.render, this);
  },
  render: function(){
    this.collection.forEach(this.renderMessage, this)
  },

  renderMessage: function(message){
    var msgView = new MessageView({model:message});
    this.$el.append(msgView.render());
  }


});

var FormView = Backbone.View.extend({
  handleSubmit: function(e) {
    var message =
  }
});
