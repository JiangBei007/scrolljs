import Animate from "./animate.js"
function getElement (expr) {
  return (typeof expr === 'string') ? document.querySelector(expr) : expr
}

function getComputedStyle (el, key) {
  var computedStyle = window.getComputedStyle(el)
  return computedStyle[key] || ''
}

function easeOutCubic (pos) {
  return (Math.pow((pos - 1), 3) + 1)
}

function easeInOutCubic (pos) {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 3)
  }
  return 0.5 * (Math.pow((pos - 2), 3) + 2)
}


	class Scroll{
		constructor(container, options){
			  const self = this;
				self.__minScrollDistance = 0;
				self.__maxScrollDistance = 0;
				self.__scrollPosition = 0;
				self.__isAnimating = false;
				self.__isDecelerating = false;
				self.__positions = null;
				self.__initialTouchPosition = 0;
				self.__lastTouchPosition = 0;
				self.__lastTouchMoveTimeStamp = 0;
				self.__isSingleTouch = false;
				self.__isTracking = false;
				self.__isDragging = false;
				self.__enableScrollPosition = false;
				self.__interruptedAnimation = false;
				self.__decelerationVelocity = 0;
				self.__didDecelerationComplete = false;
				self.value = "";
			  self.dpr = 1;
			  options = options || {}
			  self.options = {
			    itemClass: options.itemClass || 'scroller-item',
			    onSelect :options.onSelect||function(){},
			    defaultValue: options.defaultValue||0,
			    data: options.data||[]
			  }
			
			  self.__container = getElement(container)
			  const component = self.__container.querySelector("[data-role=component]")
				const pulldown = self.__container.querySelector("[data-role=pulldown]")
				const view = self.__container.querySelector("[data-role=view]")
				const pullup = self.__container.querySelector("[data-role=pullup]")
				
				
			  self.__callback = function (top) {
			    const distance = -top * self.dpr
			    component.style.webkitTransform = 'translate3d(0, ' + distance + 'px, 0)'
			    component.style.transform = 'translate3d(0, ' + distance + 'px, 0)'
			  }
				const rect = component.getBoundingClientRect()
			  const viewRect = view.getBoundingClientRect()
				const pulldownRect = pulldown.getBoundingClientRect()
			  const pullupRect = pullup.getBoundingClientRect()
				const root = self.__container.getBoundingClientRect()
				self.__setDimensions(root.height,viewRect.height,pulldownRect.height,pullupRect.height)
				self.__scrollPosition = 0;
			  const touchStartHandler = function (e) {
			    if (e.target.tagName.match(/input|textarea|select/i)) {
			      return
			    }
			    e.preventDefault()
			    self.__TouchStart(e, e.timeStamp)
			  }
			
			  const touchMoveHandler = function (e) {
			    self.__TouchMove(e, e.timeStamp)
			  }
			
			  const touchEndHandler = function (e) {
			    self.__TouchEnd(e.timeStamp)
			  }
				const willPreventDefault = true;
			  component.addEventListener('touchstart', touchStartHandler, willPreventDefault)
			  component.addEventListener('touchmove', touchMoveHandler, willPreventDefault)
			  component.addEventListener('touchend', touchEndHandler, willPreventDefault)
				component.addEventListener('mousedown', touchStartHandler, willPreventDefault)
				component.addEventListener('mousemove', touchMoveHandler, willPreventDefault)
				component.addEventListener('mouseup', touchEndHandler, willPreventDefault)
		}
		__setDimensions (rootHeight,viewHeight,pulldownHeight,pullupHeight) {
			const self = this;
		  self.__contentHeight = viewHeight
			
		  self.__minScrollDistance = -pulldownHeight
		  self.__maxScrollDistance = viewHeight - rootHeight + pullupHeight
		}
		__scrollTo (top, animate) {
		  const self = this;
		  animate = (animate === undefined) ? true : animate
		  		
		  if (self.__isDecelerating) {
		    Animate.stop(self.__isDecelerating)
		    self.__isDecelerating = false
		  }
		  top = Math.max(Math.min(self.__maxScrollDistance, top), self.__minScrollDistance)
		  if (top === self.__scrollPosition || !animate) {
		    self.__publish(top)
		    return
		  }
		  self.__publish(top, 250);
		  
		}
		__TouchStart(ev,timeStamp){
			const self = this;
			const touches = ev.touches;
			const target = ev.touches ? ev.touches[0] : ev;
			const isMobile = !!ev.touches;
			
			if (self.__isDecelerating) {
			  Animate.stop(self.__isDecelerating)
			  self.__isDecelerating = false
				self.__interruptedAnimation = true;
			}
			if (self.__isAnimating) {
			  Animate.stop(self.__isAnimating)
			  self.__isAnimating = false
				self.__interruptedAnimation = true
			}
			
			var currentTouchPosition;
			var isSingleTouch = (isMobile && touches.length === 1) || !isMobile;
			if (isSingleTouch) {
			  currentTouchPosition = target.pageY
			} else {
			  currentTouchPosition = Math.abs(target.pageY + touches[1].pageY) / 2
			}
			
			self.__positions = [];
			self.__initialTouchPosition = currentTouchPosition;
			self.__lastTouchPosition = currentTouchPosition;
			self.__lastTouchMoveTimeStamp = timeStamp;
			self.__isSingleTouch = isSingleTouch;
			self.__isTracking = true;
			self.__isDragging = !isSingleTouch;
			self.__enableScrollPosition = !isSingleTouch;
			self.__didDecelerationComplete = false;
		}
		__TouchMove(ev,timeStamp){
			const self = this;
			const touches = ev.touches;
			const target = ev.touches ? ev.touches[0] : ev;
			const isMobile = !!ev.touches;
			if(!self.__isTracking){
				return 
			}
			var currentTouchPosition;
			if (isMobile && touches.length === 2) {
			  currentTouchPosition = Math.abs(target.pageY + touches[1].pageY) / 2
			} else {
			  currentTouchPosition = target.pageY
			}
			const positions = self.__positions;
			
			if(self.__isDragging){
				const moveDistance = currentTouchPosition - self.__lastTouchPosition;
				
				let scrollPosition = this.__scrollPosition;
				
				if(self.__enableScrollPosition){
					scrollPosition -= moveDistance;
					
					const minScrollDistance = self.__minScrollDistance;
					const maxScrollDistance = self.__maxScrollDistance;
					if(scrollPosition < minScrollDistance){
						scrollPosition = minScrollDistance;
					}
					if(scrollPosition > maxScrollDistance){
						scrollPosition = maxScrollDistance;
					}
					
					if (positions.length > 40) {
					  positions.splice(0, 20)
					}
					positions.push(scrollPosition, timeStamp)
					self.__publish(scrollPosition)
					
				}
			}else{
				const minimumTrackingForScroll = 0;
				const minimumTrackingForDrag = 5;
				const distance = Math.abs(currentTouchPosition - self.__initialTouchPosition);
							
				self.__enableScrollPosition = distance >= minimumTrackingForScroll
				positions.push(self.__scrollPosition, timeStamp)
				
				self.__isDragging = self.__enableScrollPosition && (distance >= minimumTrackingForDrag)
				
				
				
			}
			
			
			self.__lastTouchMoveTimeStamp = timeStamp;
			self.__lastTouchPosition = currentTouchPosition;
		}
		__TouchEnd(timeStamp){
			const self = this;
			if (!self.__isTracking) {
			  return
			}
			self.__isTracking = false;
			
			
			
		}
		__startDeceleration (timeStamp) {
			var self = this
			
			
		}
		__stepThroughDeceleration(){
			const self = this;
			
		}
		__publish(top,animationDuration){
			const self = this;
			var wasAnimating = self.__isAnimating
			if(animationDuration){
				
			}else{
				self.__scrollPosition = top
				if (self.__callback) {
				  self.__callback(top)
				}
			}
		}
	}

export default Scroll;