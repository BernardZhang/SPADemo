(function() {
	var APP = window.APP = {
		preView: '',
		currentView: 'index',
		views: {},
		animation: true,
		animationClass: ['move-in', 'move-out'],
		loadView: function (view) {
			require([view], function (View) {
				APP.createView(view, View).render(APP.getParam());
			});
		},
		forward: function (hash, param) {
			var searchStr = '',
			    forwardUrl = '',
			    queryObj = APP.View.prototype.getQuery();
			
			if (param) {
				if (typeof param === 'object') {
					for (var key in param) {
						if (param.hasOwnProperty(key)) {
							searchStr += key + '=' + param[key] + '&';
						}
					}
					searchStr = searchStr ? ('?' + searchStr.substr(0, searchStr.length - 1)) : '';
				}
			}
			
			forwardUrl = location.href = location.protocol + '//' + location.host + location.pathname + searchStr + '#' + hash;
			
			if (history.pushState) {
				history.pushState(param, hash, forwardUrl);	
				
				if (queryObj.toString() != (param || '').toString()) {
					APP.loadView(hash);
				}
			} else {
				location.href = forwardUrl;
			}
		},
		createView: function (vewName, View) {
			this.views[vewName] = this.views[vewName] || new View();
			this.preView = this.currentView; 
			this.currentView = vewName;
			this.switchView(vewName);
			
			return this.views[vewName];
		},
		
		getParam: function () {
			return APP.views[APP.preView] && APP.views[APP.preView].getParam();
		},
		switchView: function (viewName) {
			var hasAnimation = APP.animation && APP.preView !== APP.currentView && APP.views[this.preView];
			
			hasAnimation ? this.views[this.preView].$el.removeClass(this.animationClass[0]).addClass(this.animationClass[1]) : (this.views[this.preView] && this.views[this.preView].$el.hide());
			this.views[this.preView] && this.views[this.preView].trigger('onHide');
			hasAnimation ? this.views[viewName].$el.removeClass(this.animationClass[1]).show().addClass(this.animationClass[0]) : this.views[viewName].$el.show(); 
			this.views[viewName].trigger('onShow');
			this.setActiveTab(viewName);

		},
		setActiveTab: function (viewName) {
			var tabs = $('header .nav > li');
			
			tabs.removeClass('active');
			tabs.find('a[href=#' + viewName + ']').parent().addClass('active');
		}
	};
	
	// 转场动画结束事件
	$(document).delegate('.' + APP.animationClass[1], 'webkitAnimationEnd', function (e) {
		$(e.currentTarget).hide();
	});
	
	// Navigator 切换页面
	$('header .nav-tabs a').on('click', function (e) {
		e.preventDefault();
		location.hash = $(e.currentTarget).attr('href').substr(1);
		APP.loadView($(e.currentTarget).attr('href').substr(1));
	});
	
	var baseUrl = 'js/';
	
	// require config
	require.config({
		paths: {
			index: baseUrl + 'controllers/index',
			list: baseUrl + 'controllers/list',
			edit: baseUrl + 'controllers/edit',
			text: 'js/libs/require.text',
			
			// Model
			User: baseUrl + 'models/User'
		}
	});
	
	// Model 扩展
	APP.Model = Backbone.Model.extend({
		constructor: function () {
			this.baseUrl = 'http://127.0.0.1:3000/';
			Backbone.Model.apply(this, arguments);
		},
		buildUrl: function (path) {
			return this.baseUrl + path;
		},
		sync: function (method, model, options) {
			var oldsuccess = options.success,
		        olderror = options.error,
		        showLoading = typeof options.showLoading === "undefined" ? true : options.showLoading;
		  
		    options.contentType = 'application/json; charset=UTF-8';
		    
		    options.beforeSend = function (obj, code, xhr) {
		        showLoading ? $(".loading").show() : "";
		    };
		    
		    options.success = function (obj, code, xhr) {
		        oldsuccess.apply(this, arguments);
		        $(".loading").hide(); 
		    };
		
		    options.error = function (obj, code, xhr) {
		        olderror.apply(this, arguments); 
		        $(".loading").hide(); 
		    };
		
		    return Backbone.Model.prototype.sync.apply(this, arguments);
		}
	});
	APP.Collection = Backbone.Collection.extend({
		constructor: function () {
			this.baseUrl = 'http://127.0.0.1:3000/';
			Backbone.Collection.apply(this, arguments);
		},
		buildUrl: function (path) {
			return this.baseUrl + path;
		},
		sync: function (method, model, options) {
			var oldsuccess = options.success,
		        olderror = options.error,
		        showLoading = typeof options.showLoading === "undefined" ? true : options.showLoading;
		  
		    options.beforeSend = function (obj, code, xhr) {
		        showLoading ? $(".loading").show() : "";
		    };
		    
		    options.success = function (obj, code, xhr) {
		        oldsuccess.apply(this, arguments);
		        $(".loading").hide(); 
		    };
		
		    options.error = function (obj, code, xhr) {
		        olderror.apply(this, arguments); 
		        $(".loading").hide(); 
		    };
		
		    return Backbone.Model.prototype.sync.apply(this, arguments);
		}
	});
	
	// View 扩展
	APP.View = Backbone.View.extend({
		constructor: function () {
			this.on('onShow');
			this.on('onHide');
			Backbone.View.apply(this, arguments);
		},
		getQuery: function (key) {
			var query = location.search.substring(1),
			    params = [],
			    obj = {},
			    pairs = [];
			
			if (query) {
				params = query.split('&');
				params.forEach(function (item, i) {
					pairs = item.split('=');
					if (pairs.length) {
						obj[pairs[0]] = pairs[1];
					}
				});
				
				return key ? obj[key] : obj;
			}
			
			return '';
		},
		getParam: function () {
			return this.param;
		},
		setParam: function (param) {
			this.param = param;
			return this;
		},
		forward: APP.forward
	});
	
	// 配置路由
	var Router = Backbone.Router.extend({
	
	  routes: {
	    "index": "index",    // #help
	    "list":  "list",  // #search/kiwis
	    "edit": "edit",   // #search/kiwis/p7
	    "": "defaultRoute"
	  },
	  
	  defaultRoute: function () {
	  	location.hash = 'index';
	  	APP.currentView = 'index';
	  },
	  
	  index: function() {
	    console.log('index:', arguments);
	    require(['index'], function (View) {
	    	console.log(arguments);
	    	APP.createView('index', View).render(APP.getParam());
	    });
	  },
	  
	  list: function () {
	  	console.log('list:', arguments);
	  	require(['list'], function (View) {
	    	APP.createView('list', View).render(APP.getParam());
	    });
	  },
	
	  edit: function(query, page) {
	  	console.log('list:', arguments);
	    require(['edit'], function (View) {
	    	APP.createView('edit', View).render(APP.getParam());
	    });
	  }
	
	});	
	
	new Router();
	
	Backbone.history.start();
	
//	$(window).on('hashchange', function (e) {
//		console.log('HASH CHANGE', arguments);
//	});
	
//	$(window).on('popstate', function (e) {
//		console.log('popState', arguments);
//	});
	
//	window.onpopstate = function (e) {
//		alert(e);
//	};
})();
