(function () {
	var ScrollList = window.ScrollList = function (options) {
		this.selectedIndex = options.selectedIndex || 0;
		this.disNum = options.disNum || 5;
		this.middleIndex = parseInt(this.disNum / 2) + this.disNum % 2;
		this.data = options.data || [];
		this.root = options.root || document.createElement('div');
		this.appendToEl = options.appendToEl || document.body;
		this.root.setAttribute('class', 'ui-scroll-list-wrapper');
		
//		this.root.addEventListener('click', this._itemClick.bind(this));
		this.root.addEventListener('mousedown', mouseDown.bind(this));
		document.addEventListener('mouseup', mouseUp.bind(this));
		this.onChange = options.onChange;
		
		var top = 0,
		    mouseDown = false,
		    isUp = true,
		    startPos = [];
		    
		function mouseDown(e) {
			console.log('mousedown');
			mouseDown = true;
			top = parseInt(getComputedStyle(this.ulDom).top)
			startPos = [e.pageX, e.pageY];
//			this.root.addEventListener('mousemove', mouseMove.bind(this));
			document.addEventListener('mousemove', mouseMove.bind(this));
		}
		
		function mouseMove(e) {
//			console.log('mouseMove', e);
			if (mouseDown) {
				this.ulDom.style.top = (top + (e.pageY - startPos[1])) + 'px';
				console.log('move: ' + this.ulDom.style.top);
				isUp = e.pageY - startPos[1] > 0 ? false : true;
			}
		}
		
		function mouseUp(e) {
			console.log('mouseup');
			
			if (!mouseDown) {
				return;
			}
			
			// 鼠标的移动范围在5px内当做点击选择处理
			if (e.target.tagName == 'LI' && Math.abs(startPos[0] - e.pageX) <= 5 && Math.abs(startPos[1] - e.pageY) <= 5) {
				this.setSelectedIndex([].indexOf.call(this.ulDom.querySelectorAll('li'), e.target));
			} else {
				var endTop = top + (e.pageY - startPos[1]);
				var ulHeight = parseInt(getComputedStyle(this.ulDom).height);
				var itemHeight = parseInt(getComputedStyle(this.ulDom.querySelector('li')).height);
				var middlePos = this.middleIndex * itemHeight;
				var mod = Math.abs(endTop) % itemHeight; 
				var preSelectedIndex = this.selectedIndex;
				
				console.log('1 ' + endTop);
				
				if (endTop < 0) {
					endTop += isUp ? mod - itemHeight : mod;
					
					if (endTop < middlePos - ulHeight) {
						endTop = middlePos - ulHeight;
					}
					
					this.selectedIndex = Math.abs(endTop) / itemHeight + this.middleIndex; 
				}
				
				if (endTop > 0) {
					endTop += isUp ? -mod : itemHeight - mod;
					
					if (endTop >= middlePos) {
						endTop = middlePos - itemHeight;
					}
					
					this.selectedIndex = this.middleIndex - endTop / itemHeight - 1;
				} else {
					this.selectedIndex = this.middleIndex - 1;
				}
					
				console.log('3 ' + endTop);
				this.ulDom.style.top = endTop + 'px';
			}
			
			if (preSelectedIndex !== this.selectedIndex) {
				this.onChange && this.onChange(this.getSelectedItem());
			}
			
			mouseDown = false;
		}
	};
	
	ScrollList.prototype = {
		setSelectedIndex: function (index) {
			this.selectedIndex = index;
			
			if (this._isCreated) {
				var itemHeight = parseInt(getComputedStyle(this.ulDom.querySelector('li')).height);
				
				this.ulDom.style.top = itemHeight * (this.middleIndex - (this.selectedIndex + 1)) + 'px';
				console.log(this.ulDom.style.top);
			}
			
			return this;
		},
		getSelectedIndex: function () {
			return this.selectedIndex;
		},
		getSelectedItem: function () {
			return this.data[this.selectedIndex];
		},
		render: function () {
			var itemNode = null,
			    data = this.data,
			    ulDom = document.createElement('ul');
			    
		    ulDom.setAttribute('class', 'ui-scroll-list');
			this.ulDom = ulDom;
			
			for (var i = 0, length = this.data.length; i < length; i++) {
				itemNode = document.createElement('li');
				itemNode.setAttribute('data-key', data[i].key);
				itemNode.setAttribute('class', 'ui-scroll-list-item');
				itemNode.appendChild(document.createTextNode(data[i].name));
				ulDom.appendChild(itemNode);
//				itemNode.addEventListener('click', this._itemClick.bind(this));
			}
			this.root.appendChild(ulDom);
			this._isCreated = true;
		},
		show: function (callback) {
			if (this._isCreated) {
				this.root.style.display = 'block';
			} else {
				this.render();
				this.appendToEl.appendChild(this.root);	
				this.root.style.height = parseInt(getComputedStyle(this.ulDom.querySelector('li')).height) * this.disNum + 'px';
			}
			callback && callback();
		},
		hide: function () {
			this.root.style.display = 'none';
		},
		onChange: function (item) {
			console.log('change', item);
		},
		_itemClick: function (e) {
			if (e.target.tagName == 'LI') {
				console.log('click');
				this.setSelectedIndex([].indexOf.call(this.ulDom.querySelectorAll('li'), e.target));
				e.stopImmediatePropagation();
			}
			
//			if (e.currentTarget.tagName == 'LI') {
//				this.setSelectedIndex([].indexOf.call(this.ulDom.querySelectorAll('li'), e.currentTarget));
//				e.stopImmediatePropagation();
//			}
	},
	update: function (data, selectedIndex) {
		this.root.removeChild(this.ulDom);
		this.data = data;
		this.render();
		this.setSelectedIndex(selectedIndex);
	}
	};
})();
