#use basejs now!
>use it in cmd way.reference the link i send you last time.

>when you develop your production ,you should use basejs.debug.js.otherwise,please use basejs.js instead.

please test in your server side,any questions,contact me.

###version 0.0.3

>fix bugs
>
+ when you write the 'require' in your annotation,scripts also will be loaded.
+ An error occurred when parameters are not written completely.

>imporve debug.js
>
+ debug become easier

>new features
>
+ a useful function  -- config,you can load scrips which are not conform to the specification by use the parameters 'relay',and load modules by using 'modules'.at last,specify a callback function.here is an example.

```javascript  
basejs.config({      
	relay : "./samples/jquery-1.8.2.min.js",
	modules : "./samples/enter",
	callback : function(enter) {
		$("#title").html(enter.name).css({"animation":"testAnimate 2s infinite"});
	}
});
```



