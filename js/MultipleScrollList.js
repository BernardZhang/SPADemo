(function () {
	var MultipleScrollList = window.MultipleScrollList = function (options) {
		this.data = options.data || [];
		this.selectedIndexes = options.selectedIndexes || [];
		this.disNum = options.disNum || 3;
		this.root = options.root || document.createElement('div');
		this.root.setAttribute('class', 'ui-mul-scrolllist');
		this.appendToEl = options.appendToEl || document.body;
		this.scrollList = [];
		this.onChange = options.onChange;
	};
	
	MultipleScrollList.prototype = {
		render: function () {
			var that = this,
			    scrollRoot = null;
			
			for (var i = 0, len = this.data.length; i < len; i++) {
				
				this.scrollList[i] = new ScrollList({
					disNum: that.disNum,
					data: that.data[i],
					selectedIndex: that.selectedIndexes[i],
					root: document.createElement('div'),
					onChange: (function (i) {
						return function (item) {
							that.onChange(i, item);
						};
					})(i)
				});
				this.scrollList[i].render();
				this.root.appendChild(this.scrollList[i].root);
			}
		},
		show: function (callback) {
			if (this._isCreated) {
				this.root.style.display = 'block';
			} else {
				this.render();
				this.appendToEl.appendChild(this.root);	
				var scrollListHeight = parseInt(getComputedStyle(this.scrollList[0].ulDom.querySelector('li')).height) * this.disNum + 'px';
				this.scrollList.forEach(function (item, index) {
					item.root.style.height = scrollListHeight;
				});
			}
			callback && callback();
		},
		hide: function () {
			this.root.style.display = 'none';
		},
		onChange: function (i, item) {
			console.log('change', i, item);
		},
		updateScrollListByIndex: function (index, data, selectedIndex) {
			this.scrollList[index].update(data, selectedIndex);
		}
	};
})();
