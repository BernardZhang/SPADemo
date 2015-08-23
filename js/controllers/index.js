define(['text!templates/index.html'], function (template) {
	var View = APP.View.extend({
	    el: $('#index-page'),
	    template: _.template(template),
	    events: {
		    "click .icon":          "open",
		    "click .button.edit":   "openEditDialog",
		    "click .button.delete": "destroy"
	    },
	
	    initialize: function() {
//	    	this.listenTo(this.model, "change", this.render);
	    },
	
	  	render: function() {
	  		this.$el.html(template);
	  	},
	  	
	});
	
	return View;
});