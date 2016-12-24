
# JavaScript判断IE各版本最完美解决方案
---

jQuery在1.9版本之前，提供了一个浏览器对象检测的属性$.browser，使用率极高。但是在1.9版本发布之后，大家钟爱的这个属性被jQuery无情的抛弃了。大家开始着手寻找$.browser的替代方案。于是各种利用IE bug的检测方法被搜了出来：

```javascript
// shortest from a Russian
var ie = !-[1,]

// Option from Dean Edwards:
var ie = /*@cc_on!@*/false

// Use the commented line:
var ie//@cc_on=1

// Variation (shorter variable):
var ie = '\v'=='v'

// Option to Gareth Hayes (former record-holder):
var ie = !+"\v1"
```
还有一些读取navigator.userAgent的方式，在苹果看来这些写法都不够友好，也不容易记忆，在搜索和挑选之后，终于找到了一个容易理解且友好方便的写法！

解决方案

IE知道自身毛病很多，于是提供的一套官方的HTML hack方式：
```javascript
<!--[if IE]>
// 全部IE版本可见
<![endif]-->
<!--[if IE 6]>
// IE6可见
<![endif]-->
```
依次等等。
这样的写法在其它浏览器里，完全就是一坨注释而直接遭到无视，但在IE里却不会。IE会分析里面的提到的版本号，并根据版本号确定要不要解析里面的DOM元素和文本内容。等一下！DOM元素？那岂不是可以使用js来获取里面的DOM元素？反正谁看到了，谁就是IE！于是，国外大神就有了下面的写法：
```javascript
var isIE = function(){
    var b = document.createElement('b')
    b.innerHTML = '<!--[if IE]><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
}
```
这也太巧妙了！首先生成了一个b元素，设置它的innerHTML为一坨只有IE才认识的注释，注释里只有一个空的标签，然后读取里面的出现的元素i的个数是不是等于1，是不是等于1，是不是等于1。。。。
在大苹果看来，这样的写法比其它任何一种都要好。至于为什么生成一个b元素并且里面写一个i元素而不是div或者strong，更多是考虑到前者字节量更小。
检测各个IE版本的方法也就顺理成章了：
```javascript
var isIE6 = function(){
    var b = document.createElement('b')
    b.innerHTML = '<!--[if IE 6]><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
}
// var isIE7
// ...
```
更进一步

在苹果看来，还可以进一步将版本号提取成参数，就能生成一个通用的检测IE版本的函数了：
```javascript
var isIE = function(ver){
    var b = document.createElement('b')
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
}
if(isIE(6)){
    // IE 6
}
// ...
if(isIE(9)){
    // IE 9
}
```
这样想检测哪个版本都毫无压力。但是，如果只想检测是不是IE，而不关心浏览器版本，那只需要在调用函数的时候，不传递参数即可。
```javascript
var ie  = isIE()
```
最后依次贴下在各大浏览器里测试代码的截图。
```javascript
alert('ie6:' + isIE(6) + '\n' + 'ie7:' + isIE(7) + '\n' + 'ie8:' + isIE(8) + '\n' + 'ie9:' + isIE(9) + '\n' + 'ie:' + isIE())
```
![](https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/other_tech/ie-identity1.png)
![](https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/other_tech/ie-identity2.png)



PS：此方法仅适合IE9及以下版本浏览器，IE10+以后不支持[if IE]检查。


collect from [jquery-plugins](https://github.com/nioteam/jquery-plugins/issues/12)

