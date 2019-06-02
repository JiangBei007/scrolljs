const time = Date.now || function() {
	return +new Date()
}

let running = {}
let counter = 1; //总数
let desiredFrames = 60; //期望帧
let millisecondsPerSecond = 1000; //毫秒


export default {

	// A requestAnimationFrame wrapper / polyfill.
	requestAnimationFrame: function(callback) {
		return window.requestAnimationFrame(callback)
	},

	// Stops the given animation.
	stop(id) {
		var cleared = running[id] != null
		if (cleared) {
			running[id] = null
		}
		return cleared
	},
	//给定动画是否仍在运行。
	// Whether the given animation is still running.
	isRunning(id) {
		return running[id] != null
	},

	// Start the animation.
	//步骤回调，验证回调，完成回调，持续时间，EaseIn方法，root
	start(stepCallback, verifyCallback, completedCallback, duration, easingMethod) {
		var _this = this
		var start = time()
		var lastFrame = start
		var percent = 0
		var dropCounter = 0
		var id = counter++
		//这是每隔几毫秒调用的内部步进方法。
		var step = function(virtual) {
			var render = true
			var now = time()

			if (!running[id] || (verifyCallback && !verifyCallback(id))) {
				running[id] = null
				completedCallback && completedCallback( id,false)
				return
			}

			if (duration) {
				//到头或者到尾的时候触发
				percent = (now - start) / duration;
				if (percent > 1) {
					percent = 1
				}
			}
			//执行步骤回调，然后

			var value = easingMethod ? easingMethod(percent) : percent;
			if (stepCallback(value, now, render) === false || percent === 1) {
				running[id] = null
				completedCallback && completedCallback( id,percent === 1 || duration == null)
			} else {
				_this.requestAnimationFrame(step)
			}
		}
		running[id] = true
		_this.requestAnimationFrame(step)
		return id
	}
}
