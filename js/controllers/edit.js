define(['User', 'text!templates/search.html'], function (User, template) {
	var View = APP.View.extend({
	    el: $('#search-page'),
	    template:_.template(template),
	    events: {
		    'click .add': 'addAction',
		    'click #selectCity': 'selectCityAction'
	    },
	
	    initialize: function() {
//	    	this.listenTo(this.model, "change", this.render);
	    },
	
	  	render: function(param) {
	  		var user = null;
	  		if (this.getQuery('action') == 'edit' && param) {
	  			user = param;
	  		} else {
	  			user = new User();
	  		}
	  		this.user = user;
//	  		console.log(user.toJSON());
	  		this.$el.html(this.template(user.toJSON()));
//	  		new ScrollList({
//	  			disNum: 3,
//	  			data: [
//	  				{key: 1, name:'Shanghai'},{key: 2, name:'SZ'},{key: 3, name:'GD'},{key: 4, name:'XM'},{key: 5, name:'HB'},
//	  				{key: 1, name:'Shanghai'},{key: 2, name:'SZ'},{key: 3, name:'GD'},{key: 4, name:'XM'},{key: 5, name:'HB'}
//	  			]
//	  		}).show();
	  		
	  		
	  	},
	  	
		addAction: function (e) {
			e.preventDefault();
			this.user.set('name', this.$el.find('#inputEmail3').val());
			this.user.set('password', this.$el.find('#inputPassword3').val());
			this.user.set('role', this.$el.find('#roleSelect').val());
			
			this.user.save(function (res) {
				console.log('save user sucess!!', res);
			}, function (error) {
				console.error('save user error', error);
			}, this);
		},
		selectCityAction: function (e) {
			var provinces = [
					{key: 1, name: '湖北', cities: [{key: 1, name: '武汉', counties: [{key: 1, name: '武汉'}]}]},
					{key: 2, name: '湖南', cities: [{key: 1, name: '长沙', counties: []}]},
					{key: 3, name: '山东'},
					{key: 4, name: '上海'},
					{key: 5, name: '北京'},
					{key: 6, name: 6},
					{key: 7, name: 7},
					{key: 8, name: 8},
					{key: 9, name: 9}
				],
			    cities = [
			    	{key: 1, name: '湖北', couties: []},
					{key: 2, name: '湖南'},
					{key: 3, name: '山东'},
					{key: 4, name: '上海'},
					{key: 5, name: '北京'},
					{key: 6, name: 6},
					{key: 7, name: 7},
					{key: 8, name: 8},
					{key: 9, name: 9}
			    ],
			    counties = [
			    	{key: 1, name: '湖北'},
					{key: 2, name: '湖南'},
					{key: 3, name: '山东'},
					{key: 4, name: '上海'},
					{key: 5, name: '北京'},
					{key: 6, name: 6},
					{key: 7, name: 7},
					{key: 8, name: 8},
					{key: 9, name: 9}
			    ],
			    data = [provinces, cities, counties];
			    
		
			new MultipleScrollList({
	  			disNum: 5,
	  			selectedIndexes: [1, 1, 1],
	  			data: data,
	  			onChange: function (index, item) {
	  				console.log('haha:)', index, item);
	  				switch (index) {
  					case 0: // 更新城市及县
  						this.updateScrollListByIndex(1, item.cities, 0);
  						this.updateScrollListByIndex(2, item.cities[0].counties, 0);
	  					break;
  					case 1: // 更新县
  						this.updateScrollListByIndex(2, item.counties, 0);
	  					break;
  					case 2: // do nothing
	  					break;
  					default:
	  					break;
	  				}
	  			}
	  		}).show();
		}
	
	});
	
	return View;
});