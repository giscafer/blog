# Chrome Dev Tool使用教程


得益于`Google V8`的快速，和对`HTML5`和`CSS3`的支持也算比较完善，`HTML类的富客户端应用`在Chrome上无论是流畅性还是呈现的效果，都是比较出色的，这对于开发者，特别是对于那些喜欢研究前沿技术的前端开发者来说，是很重要的。

对于本文，作为一个Web开发人员，除了上面的原因以外，与我们开发相关的，就是Chrome的开发者工具。而本文，就是要详细说说Chrome的开发者工具，说说我为什么认为它比Firebug要好用。

## 怎样打开Chrome的开发者工具？

你可以直接在页面上点击右键，然后选择审查元素：

![此处输入图片的描述][1]

或者在Chrome的工具中找到：

![此处输入图片的描述][2]

或者，你直接记住这个快捷方式： `Ctrl+Shift+I` (或者`Ctrl+Shift+J`直接打开控制台)，或者直接按`F12`。


下面来分别说下每个Tab的作用。

## Elements标签页

**这个就是查看、编辑页面上的元素，包括HTML和CSS：**

![此处输入图片的描述][3]

左侧就是对页面HTML结构的查看与编辑，你可以直接在某个元素上双击修改元素的属性，或者你点右键选"Edit as Html"直接对元素的HTML进行编辑，或者删除某个元素，所有的修改都会即时在页面上得到呈现。
你还可以对某个元素进行监听，在JS对元素的属性或者HTML进行修改的时候，直接触发断点，跳转到对改元素进行修改的JS代码处：

![此处输入图片的描述][4]

**Elements标签页的右侧可以对元素的CSS进行查看与编辑修改：**

![此处输入图片的描述][5]

你还可以通过这里看到各CSS选择器设置的`CSS`值的覆盖情况。
下面的Metrics可以看到元素占的空间情况（宽、高、Padding、Margin神马的）：

![此处输入图片的描述][6]

注意到上面的`Properties`没有？这个很有用哦，可以让你看到元素具有的方法与属性，比查API手册要方便得多哦（要注意某些方法和属性在IE、FireFox等其他浏览器下面的支持情况哦）。

![此处输入图片的描述][7]


## Resources标签页

`Resources`标签页可以查看到请求的资源情况，包括`CSS`、`JS`、`图片`等的内容，同时还可以查看到存储相关的如`Cookies`、HTML5的`Database`和`LocalStore`等，你可以对存储的内容编辑和删除。
这里的CSS文件有一个好玩的特性，你可以直接修改`CSS`文件，并且修改即时生效哦：

![此处输入图片的描述][8]

## Network标签页

`Network`标签页对于分析网站请求的网络情况、查看某一请求的请求头和响应头还有响应内容很有用，特别是在查看Ajax类请求的时候，非常有帮助。注意是`在你打开Chrome开发者工具后发起的请求`，才会在这里显示的哦。
点击左侧某一个具体去请求URL，可以看到该请求的详细HTTP请求情况：

![此处输入图片的描述][9]

**我们可以在这里看到HTTP请求头、HTTP响应头、HTTP返回的内容等信息，对于开发、调试，都是很有用的。**

## Sources标签页

很明显，这个标签页就是查看JS文件、调试JS代码的，直接看图：

![此处输入图片的描述][10]

还有你可以打开Javascript控制台，做一些其他的查看或者修改,你甚至还可以为某一XHR请求或者某一事件设置断点（**这是前端调式常用，必须熟练的**）：

![此处输入图片的描述][11]

## Timeline标签页

注意这个`Timeline`的标签页**不是**指网络请求的时间响应情况哦（这个在`Network`标签页里查看），这个`Timeline`指的是**JS执行时间、页面元素渲染**时间，对页面或者前端优化的时候，这个是常用tab，详细使用教程可以自行搜索或者看官方介绍文档：

![此处输入图片的描述][12]

点击底部的Record就可以开始录制页面上执行的内容。（这个不熟悉，请参考文末链接）

## Profiles标签页

这个主要是做性能优化的，包括查看CPU执行时间与内存占用：

![此处输入图片的描述][13]


详细使用请自行搜索教程或者看官方文档。

## Audits标签页

这个对于优化前端页面、加速网页加载速度很有用哦（相当与Yslow），点击run按钮，就可以开始分析页面，分析完了就可以看到分析结果了：

![此处输入图片的描述][14]


它甚至可以分析出页面上样式表中有哪些CSS是没有被使用的哦：

![此处输入图片的描述][15]


## Console标签页

就是Javascript控制台了：


![此处输入图片的描述][16]

这个除了查看错误信息、打印调试信息（console.log()）、写一些测试脚本以外，还可以当作Javascript API查看用。 例如我想查看console都有哪些方法和属性，我可以直接在Console中输入"console"或者想查看都有哪些方法：

![此处输入图片的描述][17]

## 移动设备

![此处输入图片的描述][18]

## 结语

Google Chrome除了简洁、快速，现在的Chrome的插件也非常的丰富了。而对于web开发者来说，Chrome对于HTML5、CSS3等一些新标准的支 持也是比较完善的，而且Chrome的开发者工具我个人认为真的非常好用，这就是为什么我向web开发者推荐使用Chrome的原因，另外开发中，需要了解浏览器之间的一些差异性，或者低版本和高版本的差异性，比如IE一般都的是非主流形式，你就必须了解IE。避免开发的过程中出现IE不兼容的情况等。

注1：本文截图的Chrome版本为 `47.0.2526.106`，版本不一样的话可能截图会出现差异。

注2：Chrome开发者工具更详细的说明请参考：http://code.google.com/intl/zh-CN/chrome/devtools/docs/overview.html（需要墙）

注3：本文参考[《Chrome浏览器超强调试工具》文章][19]进行重新截图和修改。


  [1]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/open1.png
  [2]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/open2.png
  [3]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/elements1.png
  [4]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/elements2.png
  [5]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/elements3.png
  [6]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/elements4.png
  [7]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/elements5.png
  [8]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/elements6.png
  [9]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/network1.png
  [10]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/sources1.png
  [11]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/sources2.png
  [12]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/timeline1.png
  [13]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/profile1.png
  [14]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/audit1.png
  [15]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/audit2.png
  [16]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/console1.png
  [17]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/console2.png
  [18]: https://raw.githubusercontent.com/ForestarFED/FED-SPEC/master/img/devtool/phone1.png
  [19]: http://shaozhuqing.com/?p=2085
  