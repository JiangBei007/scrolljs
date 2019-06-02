import Animate from "./animate.js"
function getElement (expr) {
  return (typeof expr === 'string') ? document.querySelector(expr) : expr
}

function getComputedStyle (el, key) {
  var computedStyle = window.getComputedStyle(el)
  return computedStyle[key] || ''
}

// Easing Equations (c) 2003 Robert Penner, all rights reserved.
// Open source under the BSD License.
function easeOutCubic (pos) {
  return (Math.pow((pos - 1), 3) + 1)
}

function easeInOutCubic (pos) {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 3)
  }
  return 0.5 * (Math.pow((pos - 2), 3) + 2)
}

const TEMPLATE = `
<div class="scroller-component" data-role="component">
  <div class="scroller-mask" data-role="mask"></div>
  <div class="scroller-indicator" data-role="indicator"></div>
  <div class="scroller-content" data-role="content"></div>
</div>
`
	class Scroll{
		constructor(container, options){
			  const _this = this
			  _this.dpr = 1;
			  options = options || {}
			  _this.options = {
			    itemClass: options.itemClass || 'scroller-item',
			    onSelect :options.onSelect||function(){},
			    defaultValue: options.defaultValue||0,
			    data: options.data||[]
			  }
			
			  _this.__container = getElement(container)
			
			  var tempContainer = document.createElement('div')
			  tempContainer.innerHTML = options.template || TEMPLATE
			
			  var component = _this.__component = tempContainer.querySelector('[data-role=component]')
			  var content = _this.__content = component.querySelector('[data-role=content]')
			  var indicator = component.querySelector('[data-role=indicator]')
			
			  var data = _this.options.data
			  var html = ''
			    data.forEach(function (row) {
			      html += '<div class="' + _this.options.itemClass + '" data-value=' + JSON.stringify({value: encodeURI(row.value)}) + '>' + row.name + '</div>'
			    })
			  content.innerHTML = html
			
			  _this.__container.appendChild(component)
			
			  _this.__itemHeight = 34
			
			  _this.__callback = options.callback || function (top) {
			    const distance = -top * _this.dpr
			    content.style.webkitTransform = 'translate3d(0, ' + distance + 'px, 0)'
			    content.style.transform = 'translate3d(0, ' + distance + 'px, 0)'
			  }
			
			  var rect = component.getBoundingClientRect()
			
			  _this.__clientTop = (rect.top + component.clientTop) || 0
			
			  _this.__setDimensions(component.clientHeight, content.offsetHeight)
			
			  if (component.clientHeight === 0) {
			    _this.__setDimensions(238, 204)
			  }
			  _this.select(_this.options.defaultValue, false)
			
			  const touchStartHandler = function (e) {
			    if (e.target.tagName.match(/input|textarea|select/i)) {
			      return
			    }
			    e.preventDefault()
			    _this.__doTouchStart(e, e.timeStamp)
			  }
			
			  const touchMoveHandler = function (e) {
			    _this.__doTouchMove(e, e.timeStamp)
			  }
			
			  const touchEndHandler = function (e) {
			    _this.__doTouchEnd(e.timeStamp)
			  }
			  component.addEventListener('touchstart', touchStartHandler)
			
			  component.addEventListener('touchmove', touchMoveHandler)
			
			  component.addEventListener('touchend', touchEndHandler)
		}
	}
const _prototypeConfig_ = {
  value: null,
  __prevValue: null,
  __isSingleTouch: false,
  __isTracking: false,
  __didDecelerationComplete: false,
  __isGesturing: false,
  __isDragging: false,
  __isDecelerating: false,//动画名
  __isAnimating: false,//动画名
  __clientTop: 0,
  __clientHeight: 0,
  __contentHeight: 0,
  __itemHeight: 0,
  __scrollTop: 0,
  __minScrollTop: 0,
  __maxScrollTop: 0,
  __scheduledTop: 0,
  __lastTouchTop: null,
  __lastTouchMove: null,
  __positions: null,
  __minDecelerationScrollTop: null,
  __maxDecelerationScrollTop: null,
  __decelerationVelocityY: null,

  __setDimensions (clientHeight, contentHeight) {
	const _this = this;
    _this.__clientHeight = clientHeight
    _this.__contentHeight = contentHeight
	
    var totalItemCount = _this.options.data.length
    var clientItemCount = Math.round(_this.__clientHeight / _this.__itemHeight)

    _this.__minScrollTop = -_this.__itemHeight * (clientItemCount / 2)
    _this.__maxScrollTop = _this.__minScrollTop + totalItemCount * _this.__itemHeight - 0.1
  },
  selectByIndex (index, animate) {
  	const _this = this;
    if (index < 0 || index > _this.__content.childElementCount - 1) {
      return
    }
    _this.__scrollTop = _this.__minScrollTop + index * _this.__itemHeight
    _this.scrollTo(_this.__scrollTop, animate)

    _this.__selectItem(_this.__content.children[index])
  },

  select (value, animate) {
  	const _this = this;
    var children = _this.__content.children
    for (var i = 0, len = children.length; i < len; i++) {
      if (decodeURI(JSON.parse(children[i].dataset.value).value) === value) {
        _this.selectByIndex(i, animate)
        return
      }
    }
    _this.selectByIndex(0, animate)
  },
  getValue () {
  	const _this = this;
    return _this.value
  },
    scrollTo (top, animate) {
    	const _this = this;
    animate = (animate === undefined) ? true : animate

    if (_this.__isDecelerating) {
    	//此时有运动的话，停止这个运动
      Animate.stop(_this.__isDecelerating)
      _this.__isDecelerating = false
    }

    top = Math.round((top / _this.__itemHeight).toFixed(5)) * _this.__itemHeight
		console.log(top)
    top = Math.max(Math.min(_this.__maxScrollTop, top), _this.__minScrollTop)
    if (top === _this.__scrollTop || !animate) {
    	//当传入的top值等于当前的scrollTop,
    	
      _this.__publish(top)
      //选中求得停止后的那个值
      _this.__scrollingComplete()
      return
    }
    _this.__publish(top, 250);
    //传入第二个值证明到头或者到尾了
  },
  destroy () {
  	const _this = this;
    _this.__component.parentNode && _this.__component.parentNode.removeChild(_this.__component)
  },
  __selectItem (selectedItem) {
  	const _this = this;
    var selectedItemClass = _this.options.itemClass + '-selected'
    var lastSelectedElem = _this.__content.querySelector('.' + selectedItemClass)
    if (lastSelectedElem) {
      lastSelectedElem.classList.remove(selectedItemClass)
    }
    selectedItem.classList.add(selectedItemClass)

    if (_this.value !== null) {
      _this.__prevValue = _this.value
    }

    _this.value = decodeURI(JSON.parse(selectedItem.dataset.value).value)
  },
  __scrollingComplete () {
    const _this = this;
    var index = Math.round((_this.__scrollTop - _this.__minScrollTop - _this.__itemHeight / 2) / _this.__itemHeight)
    _this.__selectItem(_this.__content.children[index])
    if (_this.__prevValue !== null && _this.__prevValue !== _this.value) {
      _this.options.onSelect(_this.value)
    }
  },
    __doTouchStart (ev, timeStamp) {
    	const _this = this;
    const touches = ev.touches
    const target = ev.touches ? ev.touches[0] : ev
    const isMobile = !!ev.touches

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf()
    }

    _this.__interruptedAnimation = true
			//减速__isDecelerating
    if (_this.__isDecelerating) {
    	//此时有运动的话，停止这个运动
      Animate.stop(_this.__isDecelerating)
      _this.__isDecelerating = false
      _this.__interruptedAnimation = true
    }
    //__isAnimating，是动画//初始为false
    if (_this.__isAnimating) {
      Animate.stop(_this.__isAnimating)
      _this.__isAnimating = false
      _this.__interruptedAnimation = true
    }

    // Use center point when dealing with two fingers
    var currentTouchTop
    var isSingleTouch = (isMobile && touches.length === 1) || !isMobile
    if (isSingleTouch) {
      currentTouchTop = target.pageY
    } else {
      currentTouchTop = Math.abs(target.pageY + touches[1].pageY) / 2
    }

    _this.__initialTouchTop = currentTouchTop
    _this.__lastTouchTop = currentTouchTop
    _this.__lastTouchMove = timeStamp
    _this.__enableScrollY = !isSingleTouch;//暂时只会为false
    _this.__isTracking = true
    _this.__didDecelerationComplete = false
    _this.__isDragging = !isSingleTouch;//暂时只会为false
    _this.__isSingleTouch = isSingleTouch;//在这里设置为true
    _this.__positions = []
  },
  __doTouchMove (ev, timeStamp, scale) {
  	const _this = this;
    const touches = ev.touches
    const target = ev.touches ? ev.touches[0] : ev
    const isMobile = !!ev.touches

    if (!_this.__isTracking) {
      return
    }

    var currentTouchTop

    // Compute move based around of center of fingers
    //基于手指中心的计算移动
    if (isMobile && touches.length === 2) {
    	//此种情况是判断有两个手指
      currentTouchTop = Math.abs(target.pageY + touches[1].pageY) / 2
    } else {
      currentTouchTop = target.pageY
    }

    var positions = _this.__positions

    // Are we already is dragging mode?
    if (_this.__isDragging) {
    	//当前的moveY减去上一个moveY
      var moveY = currentTouchTop - _this.__lastTouchTop
      var scrollTop = _this.__scrollTop
			
      if (_this.__enableScrollY) {
        scrollTop -= moveY

        var minScrollTop = _this.__minScrollTop
        var maxScrollTop = _this.__maxScrollTop
        if (scrollTop > maxScrollTop || scrollTop < minScrollTop) {
          // Slow down on the edges
          if (scrollTop > maxScrollTop) {
            scrollTop = maxScrollTop
          } else {
            scrollTop = minScrollTop
          }
        }
      }

      // Keep list from growing infinitely (holding min 10, max 20 measure points)
      if (positions.length > 40) {
        positions.splice(0, 20)
      }

      // Track scroll movement for decleration
      
      positions.push(scrollTop, timeStamp)
      _this.__publish(scrollTop)

      // Otherwise figure out whether we are switching into dragging mode now.
    } else {
    	
      var minimumTrackingForScroll = 0
      var minimumTrackingForDrag = 5
      var distanceY = Math.abs(currentTouchTop - _this.__initialTouchTop)
			//moveY-startY
			//移动距离大于时候_this.__enableScrollY设置为true
      _this.__enableScrollY = distanceY >= minimumTrackingForScroll
      positions.push(_this.__scrollTop, timeStamp)

      _this.__isDragging = _this.__enableScrollY && (distanceY >= minimumTrackingForDrag)

      if (_this.__isDragging) {
        _this.__interruptedAnimation = false
      }
    }
		//console.log(positions)
    // Update last touch positions and time stamp for next event
    _this.__lastTouchTop = currentTouchTop
    _this.__lastTouchMove = timeStamp
  },
    __doTouchEnd (timeStamp) {
  	//触摸运动停止
		const _this = this;
    // Ignore event when tracking is not enabled (no touchstart event on element)
    // _this is required as _this listener ('touchmove') sits on the document and not on the element it_this.
    //在未启用跟踪时忽略事件（元素上没有触摸启动事件）
		//这是必需的，因为这个侦听器（“touch.”）位于文档上，而不是位于元素it_this上。
    if (!_this.__isTracking) {
      return
    }

    // Not touching anymore (when two finger hit the screen there are two touch end events)
    //不再触摸（当两个手指击中屏幕时，有两个触摸结束事件）
    _this.__isTracking = false

    // Be sure to reset the dragging flag now. Here we also detect whether
    // the finger has moved fast enough to switch into a deceleration animation.
    //现在一定要重置拖动标志。这里我们也检测是否
		//手指移动得足够快，可以切换到减速动画。
    if (_this.__isDragging) {
      // Reset dragging flag
      _this.__isDragging = false

      // Start deceleration
      // Verify that the last move detected was in some relevant time frame
      //验证检测到的最后一个移动是否在某个相关的时间帧中
      //_this.__isSingleTouch这个值在start结束的时候设置为true;
      //timeStamp - _this.__lastTouchMove <= 100，这个判断的意思是end的时间戳和move函数里的最后一个时间戳非常相近
      if (_this.__isSingleTouch && (timeStamp - _this.__lastTouchMove) <= 100) {
        // Then figure out what the scroll position was about 100ms ago
        //然后算出大约100毫秒前的滚动位置
        var positions = _this.__positions
        var endPos = positions.length - 1
        var startPos = endPos
        // Move pointer to position measured 100ms ago
        for (var i = endPos; i > 0 && positions[i] > (_this.__lastTouchMove - 100); i -= 2) {
        	//倒着遍历move运动里放入的时间戳的数组，倒着比，最后一个大于之前第一个的（时间戳-100）的，就把这个i值赋给startPos
        	//证明从这个点开始快滑的
          startPos = i
        }
			
        // If start and stop position is identical in a 100ms timeframe,
        //如果在100MS时间帧中开始和停止位置是相同的
        // we cannot compute any useful deceleration.
        //我们不能计算任何有用的减速。
        //startPos !== endPos这个东西按我的理解，在正常情况下不会相等的
        if (startPos !== endPos) {
          // Compute relative movement between these two points
          var timeOffset = positions[endPos] - positions[startPos];
          //以上，算出move函数里最后一个时间戳减去从那个点开始快滑的时间戳
          var movedTop = _this.__scrollTop - positions[startPos - 1]
					//把这个值设置为 scrollTop减去从那个点开始快滑的scrollTop值
          // Based on 50ms compute the movement to apply for each render step
          //基于50ms计算每个渲染步骤应用的动作
          _this.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60)
					//把这个设置为  快速移动的那一点距离
          // How much velocity is required to start the deceleration
          var minVelocityToStartDeceleration = 4
          // Verify that we have enough velocity to start deceleration
          if (Math.abs(_this.__decelerationVelocityY) > minVelocityToStartDeceleration) {
            _this.__startDeceleration(timeStamp)
          }
        }
      }
    }

    if (!_this.__isDecelerating) {
    	//若这个动画不存在
      _this.scrollTo(_this.__scrollTop)
    }

    // Fully cleanup list
    _this.__positions.length = 0
  },
    __publish (top, animationDuration) {
    const _this = this
		//记住我们是否有动画，然后我们试图基于动画的当前“驱动”来继续
    // Remember whether we had an animation, then we try to continue based on the current "drive" of the animation
    var wasAnimating = _this.__isAnimating
    if (wasAnimating) {
    	//如果有动画,就停止这个动画
      Animate.stop(wasAnimating)
      _this.__isAnimating = false
    }

    if (animationDuration) {
    	//这个函数会在滑到头或者到尾才会执行
    	//只有慢滑的时候这个函数才会执行
      // Keep scheduled positions for scrollBy functionality
      //为滚动功能保留预定位置
      _this.__scheduledTop = top

      var oldTop = _this.__scrollTop
      var diffTop = top - oldTop

      var step = function (percent, now, render) {
        _this.__scrollTop = oldTop + (diffTop * percent)
        
        // Push values out
        if (_this.__callback) {
          _this.__callback(_this.__scrollTop)
        }
      }

      var verify = function (id) {
        return _this.__isAnimating === id
      }

      var completed = function (renderedFramesPerSecond, animationId, wasFinished) {
        if (animationId === _this.__isAnimating) {
          _this.__isAnimating = false
        }
        if (_this.__didDecelerationComplete || wasFinished) {
          _this.__scrollingComplete()
        }
      }

      //当继续基于以前的动画时，我们选择轻松出动画而不是轻松出动画
      // When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
      _this.__isAnimating = Animate.start(step, verify, completed, animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic)
    } else {
      _this.__scheduledTop = _this.__scrollTop = top
      // Push values out
      if (_this.__callback) {
        _this.__callback(top)
      }
    }
  },
    __startDeceleration (timeStamp) {
  	//启动减速
    var _this = this

    _this.__minDecelerationScrollTop = _this.__minScrollTop
    _this.__maxDecelerationScrollTop = _this.__maxScrollTop

    // Wrap class method
    var step = function (percent, now, render) {
      _this.__stepThroughDeceleration(render)
    }

    // How much velocity is required to keep the deceleration running
    var minVelocityToKeepDecelerating = 0.5

    // Detect whether it's still worth to continue animating steps
    // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
    var verify = function () {
      var shouldContinue = Math.abs(_this.__decelerationVelocityY) >= minVelocityToKeepDecelerating;
      if (!shouldContinue) {
        _this.__didDecelerationComplete = true
      }
      return shouldContinue
    }

    var completed = function (renderedFramesPerSecond, animationId, wasFinished) {
      _this.__isDecelerating = false
      if (_this.__scrollTop <= _this.__minScrollTop || _this.__scrollTop >= _this.__maxScrollTop) {
        _this.scrollTo(_this.__scrollTop)
        return
      }
      if (_this.__didDecelerationComplete) {
        _this.__scrollingComplete()
      }
    }

    // Start animation and switch on flag
    //开始动画并赋值给这个，赋值的意义在于，某个时刻中止此动画
    _this.__isDecelerating = Animate.start(step, verify, completed)
  },
    __stepThroughDeceleration (render) {
  	//步进减速
  	const _this = this;
    var scrollTop = _this.__scrollTop + _this.__decelerationVelocityY
    var scrollTopFixed = Math.max(Math.min(_this.__maxDecelerationScrollTop, scrollTop), _this.__minDecelerationScrollTop)
    if (scrollTopFixed !== scrollTop) {
      scrollTop = scrollTopFixed
      _this.__decelerationVelocityY = 0
    }
		//__decelerationVelocityY减速速度
    if (Math.abs(_this.__decelerationVelocityY) <= 1) {
      if (Math.abs(scrollTop % _this.__itemHeight) < 1) {
        _this.__decelerationVelocityY = 0
      }
    } else {
      _this.__decelerationVelocityY *= 0.95
    }

    _this.__publish(scrollTop)
  }
}
for (var key in _prototypeConfig_) {
  Scroll.prototype[key] = _prototypeConfig_[key]
}


export default Scroll;