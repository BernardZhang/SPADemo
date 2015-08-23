define(['User', 'text!templates/list.html'], function (User, template) {
	var View = APP.View.extend({
	    el: $('#list-page'),
	    template: _.template(template),
	    events: {
		    "click #nav-btns .edit": "updateUser",
		    'click #nav-btns .add': 'prepareAddUser',
		    "click #nav-btns .delete": "deleteUser",
		    'click tr[data-id]': 'selectUser'
	    },
	
	    initialize: function() {
//	    	this.listenTo(this.model, "change", this.render);
	    },
	
	  	render: function() {
			var that = this;
	  		var Users = APP.Collection.extend({
	  			model: User
	  		});
	  		
	  		this.users = new Users();
	  		this.getUsers();
	  	},
	  	getUsers: function (successCb, errorCb, oCtx) {
	  		var that = this;
	  		
	  		this.users.fetch({
	  			url: that.users.buildUrl('users'),
	  			success: function (model, response, options) {
	  				that.$el.html(that.template({list: that.users.toJSON()}));
	  				successCb && successCb(response);
	  			},
	  			error: function (model, response, options) {
	  				alert('get users error!', response);
	  				errorCb && errorCb(response);
	  			}
	  		});
	  	},
	  	
	  	deleteUser: function (e) {
	  		var user = this.getSelectedUser();
	  		    
	  		user.delete(function () {
	  			this.getUsers();
	  		}, function () {
	  			alert('delete error!!!');
	  		}, this);
	  	},
	  	updateUser: function (e) {
	  		this.setParam(this.getSelectedUser());
	  		this.forward('edit', {
	  			action: 'edit'
	  		});
	  	},
	  	prepareAddUser: function (e) {
	  		this.forward('edit');
	  	},
	  	addUser: function () {
	  		var user = new User();
	  
	  		user.save(user.toJSON(), {
	  			url: user.buildUrl('addUser'),
	  			contentType: 'application/json; charset=UTF-8',
	  			success: function (model, res, options) {
	  				console.log('success', arguments);
	  			},
	  			error: function (model, res, options) {
	  				console.log('error', arguments);
	  			}
	  		});
	  	},
	  	selectUser: function (e) {
	  		var target = $(e.currentTarget),
	  		    id = target.data('id'),
	  		    selectedUser = this.getSelectedUser(),
	  		    user = this.users.get(id);
  		    
  		    selectedUser ? this.$el.find('tr[data-id=' + selectedUser.get('id')+ ']').removeClass('success') : '';
  		    this.setSelectedUser(user);
  		    target.addClass('success');
  		    this.updateBtnStatus(user);
  		    
	  	},
	  	setSelectedUser: function (user) {
	  		this.selectedUser = user;
	  	},
	  	getSelectedUser: function () {
	  		return this.selectedUser;
	  	},
	  	updateBtnStatus: function (user) {
			this.$el.find('#nav-btns button.edit,#nav-btns button.delete').each(function (i, item) {
				user ? $(item).removeAttr('disabled') : $(item).attr('disabled');
			});
	  	}
	
	});
	
	return View;
});