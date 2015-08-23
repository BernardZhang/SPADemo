define([], function (){
	var User = APP.Model.extend({
		constructor: function () {
			this.baseUrl = 'http://127.0.0.1:3000/';
			Backbone.Model.apply(this, arguments);
		},
		defaults: {
		    name:  '',
		    password: '',
		    role: 1,
		    roleDes: ''
		},
		delete: function (successCb, errorCb, oCxt) {
			oCxt = oCxt || this;
			successCb = successCb.bind(oCxt) || this.successHandler;
			errorCb = errorCb.bind(oCxt) || this.errorHandler;
			
			this.destroy({
				url: this.buildUrl('deleteUser?id=' + this.get('id')),
				method: 'post',
				success: successCb,
				error: errorCb
			});
		},
		
		save: function (successCb, errorCb, oCxt) {
			oCxt = oCxt || this;
			successCb = successCb.bind(oCxt) || this.successHandler;
			errorCb = errorCb.bind(oCxt) || this.errorHandler;
			
			APP.Model.prototype.save.call(this, this.toJSON(), {
				url: this.buildUrl(this.isNew() ? 'addUser' : 'updateUser'),
				method: 'post',
				success: successCb,
				error: errorCb
			});
		},
		
		successHandler: function () {
			console.log('default success callback', arguments);
		},
		
		errorHandler: function () {
			console.error('default error callback', arguments);
		}
	});
	
	return User;
});