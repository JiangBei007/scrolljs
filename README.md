
## Routine

```html

<script src="./SmallSwiper.umd.js"></script>

```


## ES6

```javascript
npm install small-swiper --save-dev

import Swiper from "small-swiper"

```


### Usage method

```html
<div id="root">
<div>
	<div style="background: #21374B;"><img src="img/parcel.png"/></div>
	<div style="background: #808080;"><img src="img/webpack.png"/></div>
	<div style="background: #35495E;"><img src="img/vue.png"/></div>
	<div style="background: #0E0E0E;"><img src="img/react.png"/> </div>
</div>
</div>
<div id="btns">
	<button>点击切换到第0个</button>
	<button>点击切换到第1个</button>
	<button>点击切换到第2个</button>
	<button>点击切换到第3个</button>
</div>

```



* 1.horizontal direction

```css
#root{
	height: 500px;
	width: 100%;
	overflow: hidden;
	background: moccasin;
}
#root>div{
	height: 500px;
	width: 100%;
	display: flex; 
}
#root>div>div{
	 flex-shrink:0;
	  height:  500px;
	  width: 100%;
	  line-height: 500px;
	  text-align: center;
	  display: flex;
	  justify-content: center;
}

#root img{
	align-items: center;
	display: block;
	height: 500px;
	max-width:100%;
}
```


```javascript
window.onload = function(){
	const swiper = new Swiper({
		root:document.querySelector("#root"),
		loop:true,
		auto:false,
		delayed:2000,
		effect:"slide",
		direction:"vertical",
		index:0,
		disabledHand:false,
		callBack(index){
			console.log("html",index)
			document.title = "I am"+index+"page"
		}
	})
	const btnList = document.getElementById("btns").getElementsByTagName("button");
	
	[].slice.call(btnList).forEach((dom,i)=>{
		(function (i){
			dom.onclick = function(){
				swiper.moveTo(i)
			}
		})(i)
	})
}

```

* 2.vertical direction

```css
#root{
	height: 500px;
	width: 100%;
	overflow: hidden;
	background: moccasin;
}
#root>div{
	height: 500px;
	width: 100%;
}
#root>div>div{
	  height:  500px;
	  width: 100%;
	  line-height: 500px;
	  text-align: center;
	  display: flex;
	  justify-content: center;
}

#root img{
	align-items: center;
	display: block;
	height: 500px;
	max-width:100%;
}

```


```javascript
window.onload = function(){
	const swiper = new Swiper({
		root:document.querySelector("#root"),
		loop:true,
		auto:false,
		delayed:2000,
		effect:"slide",
		direction:"vertical",
		index:0,
		callBack(index){
			console.log("html",index);
			document.title = "I am"+index+"page"
		}
	})
}

```

* 3.Fade in and fade out

```css
#root{
	height: 500px;
	width: 100%;
	overflow: hidden;
}
#root>div{
	height: 500px;
	width: 100%;
	position: relative;
}
#root>div>div{
	  height:  500px;
	  width: 100%;
	  position: relative;
	  left: 0;
	  top: 0;
}
#root img{
	display: block;
	height: 500px;
	width: 100%;
}

```


```javascript
window.onload = function(){
	const swiper = new Swiper({
		root:document.querySelector("#root"),
		effect:"fade",
		loop:false,
		auto:true,
		direction:"horizontal",
		index:0,
		callBack:function(index){
			console.log("html",index)
		}
	})
}
```

[github地址](https://github.com/atJiangBei/small-swiper)
[具体实现请看关联](https://atjiangbei.github.io/2019/04/04/%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%BB%91%E5%8A%A8%E8%BD%AE%E6%92%AD%E5%9B%BE.html)
[关联](https://atjiangbei.github.io/)