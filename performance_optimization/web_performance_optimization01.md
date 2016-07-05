###`JIT`与`GC`优化
----------
>
- `untyped`（无类型）。	
	- `JAVASCRIPT`是个无类型的语言，这导致了如`x=y+ｚ`这种表达式可以有很多含义。
		- `y`，`z`是数字，则`+`表示加法。
		- `y`，`z`是字符串，则`+`表示字符串连接。
>	
		而JS引擎内部则使用“`细粒度`”的类型，比如：
		- 32-bit* integer。
		- 64-bit* floating-point。
>       
		这就要求js类型-js引擎类型，需要做“boxed/unboxed（装箱/解箱）”，在处理一次`x=y+z`这种计算，需要经过的步骤如下。
>
		1. 从内存，读取`x=y+z`的操作符。
		1. 从内存，读取`y`，`z`。
		1. 检查y，z类型，确定操作的行为。
		1. `unbox y，z`。
		1. 执行操作符的行为。
		1. `box x`。
		1. 把`x`写入内存。
>
		只有第`5`步骤是真正有效的操作，其他步骤都是为第`5`步骤做准备/收尾，`JAVASCRIPT`的`untyped`特性很好用，但也为此付出了很大的性能代价。
>	
- `JIT`。
	- 先看看`JIT`对`untyped`的优化，在`JIT`下，执行`x=y+z`流程。
		1. 从内存，读取`x=y+z`的操作符。
		1. 从内存，读取 `y`，`z`。
		1. 检查`y`，`z`类型，确定操作的行为。
		1. `unbox y，z`。
		1. 执行 操作符 的行为。
		1. `box x`。
		1. 把`x`写入内存。
>	
		其中`1`，`2`步骤由`CPU`负责，`7`步骤`JIT`把结果保存在寄存器里。但可惜不是所有情况都能使用JIT，当`number+number`，`string+string` 等等可以使用`JIT`，但特殊情况，如：`number+undefined`就不行了，只能走旧解析器。
	- 新引擎还对“对象属性”访问做了优化，解决方案叫`inline caching`，简称：`IC`。简单的说，就是做`cache`。但如果当`list`很大时，这种方案反而影响效率。
>
> - `Type-specializing JIT`
	>`Type-specializing JIT`引擎用来处理`typed`类型（声明类型）变量，但`JAVASCRIPT`都是`untype`类型的。
>
	 - `Type-specializing JIT`的解决方案是：
		- 先通过扫描，监测类型。
		- 通过编译优化（优化对象不仅仅只是“类型”，还包括对JS代码的优化，但核心是类型优化），生成类型变量。
		- 再做后续计算。
	 - `Type-specializing JIT`的执行`x=y+z`流程：
		- 从内存，读取`x=y+z`的操作符。
		- 从内存，读取`y`，`z`。
		- 检查`y`，`z`类型，确定操作的行为。
		- `unbox y，z`。
		- 执行操作符的行为。
		- `box x`。
		- 把`x`写入内存。
>	
		代价是：
>
		- 前置的扫描类型
		- 编译优化。
>
		所以·Type-specializing JIT·的应用是有选择性，选择使用这个引擎的场景包括：
		- 热点代码。
		- 通过启发式算法估算出来的有价值的代码。
>	
		另外，有2点也需要注意：
		- 当变量类型 发生变化时，引擎有2种处理方式：
			- 少量变更，重编译，再执行。
			- 大量变更，交给JIT执行。
		- `数组`，`object properties`，	闭包变量	不在优化范畴之列。

###`AJAX`优化
----------
>
- 缓存`AJAX`：
	- `异步`并不等于`即时`。
- 请求使用`GET`：
	- 当使用`XMLHttpRequest`时，而URL长度不到`2K`，可以使用`GET`请求数据，`GET`相比`POST`更快速。
		- `POST`类型请求要发送两个`TCP`数据包。
			- 先发送文件头。
			- 再发送数据。
		- `GET`类型请求只需要发送一个`TCP`数据包。
			- 取决于你的`cookie`数量。

###`COOKIE`专题
----------
>
- 减少`COOKIE`的大小。
- 使用无`COOKIE`的域。
	- 比如图片`CSS`等静态文件放在静态资源服务器上并配置单独域名，客户端请求静态文件的时候，减少`COOKIE`反复传输时对主域名的影响。
###`DOM`优化
----------
>
- 优化节点修改。
	- 使用`cloneNode`在外部更新节点然后再通过`replace`与原始节点互换。
>
			var orig = document.getElementById('container');
			var clone = orig.cloneNode(true);
			var list = ['foo', 'bar', 'baz'];
			var content;
			for (var i = 0; i < list.length; i++) {
			   content = document.createTextNode(list[i]);
			   clone.appendChild(content);
			}
			orig.parentNode.replaceChild(clone, orig);
> - 优化节点添加
	>多个节点插入操作，即使在外面设置节点的元素和风格再插入，由于多个节点还是会引发多次reflow。
	- 优化的方法是创建`DocumentFragment`，在其中插入节点后再添加到页面。
		- 如`JQuery`中所有的添加节点的操作如`append`，都是最终调用`DocumentFragment`来实现的，
>
				createSafeFragment(document) {
				     var list = nodeNames.split( "|" ),
				         safeFrag = document.createDocumentFragment();
> 
				     if (safeFrag.createElement) {
				         while (list.length) {
				             safeFrag.createElement(
				                 list.pop();
				             );
				         };
				     };
				     return safeFrag;
				};
> - 优化`CSS`样式转换。
	>如果需要动态更改CSS样式，尽量采用触发reflow次数较少的方式。
	- 如以下代码逐条更改元素的几何属性，理论上会触发多次`reflow`。
>
			element.style.fontWeight = 'bold' ;
			element.style.marginLeft= '30px' ;
			element.style.marginRight = '30px' ;
	- 可以通过直接设置元素的`className`直接设置，只会触发一次`reflow`。
>
			element.className = 'selectedAnchor' ;
> - 减少`DOM`元素数量
	- 在`console`中执行命令查看`DOM`元素数量。
>
			`document.getElementsByTagName( '*' ).length`
	- 正常页面的`DOM`元素数量一般不应该超过`1000`。  
	- `DOM`元素过多会使`DOM`元素查询效率，样式表匹配效率降低，是页面性能最主要的瓶颈之一。
> - `DOM`操作优化。
	- `DOM`操作性能问题主要有以下原因。
		- `DOM`元素过多导致元素定位缓慢。
		- 大量的`DOM`接口调用。
			- `JAVASCRIPT`和`DOM`之间的交互需要通过函数`API`接口来完成，造成延时，尤其是在循环语句中。
		- `DOM`操作触发频繁的`reflow(layout)`和`repaint`。
		- `layout`发生在`repaint`之前，所以layout相对来说会造成更多性能损耗。
			- `reflow(layout)`就是计算页面元素的几何信息。
			- `repaint`就是绘制页面元素。
		- 对`DOM`进行操作会导致浏览器执行回流`reflow`。
	- 解决方案。
		- 纯`JAVASCRIPT`执行时间是很短的。
		- 最小化`DOM`访问次数，尽可能在js端执行。
		- 如果需要多次访问某个`DOM`节点，请使用局部变量存储对它的引用。
		- 谨慎处理`HTML`集合（`HTML`集合实时连系底层文档），把集合的长度缓存到一个变量中，并在迭代中使用它，如果需要经常操作集合，建议把它拷贝到一个数组中。
		- 如果可能的话，使用速度更快的API，比如`querySelectorAll`和`firstElementChild`。
		- 要留意重绘和重排。
		- 批量修改样式时，`离线`操作`DOM`树。
		- 使用缓存，并减少访问布局的次数。
		- 动画中使用绝对定位，使用拖放代理。
		- 使用事件委托来减少事件处理器的数量。
> - 优化`DOM`交互
	>在`JAVASCRIPT`中，`DOM`操作和交互要消耗大量时间，因为它们往往需要重新渲染整个页面或者某一个部分。
	- 最小化`现场更新`。
		- 当需要访问的`DOM`部分已经已经被渲染为页面中的一部分，那么`DOM`操作和交互的过程就是再进行一次`现场更新`。
		 - `现场更新`是需要针对`现场`（相关显示页面的部分结构）立即进行更新，每一个更改（不管是插入单个字符还是移除整个片段），都有一个性能损耗。
		 - 现场更新进行的越多，代码完成执行所花的时间也越长。
	- 多使用`innerHTML`。
		- 有两种在页面上创建`DOM`节点的方法：
			- 使用诸如`createElement()`和`appendChild()`之类的`DOM`方法。
			- 使用`innerHTML`。
				- 当使用`innerHTML`设置为某个值时，后台会创建一个`HTML`解释器，然后使用内部的`DOM`调用来创建`DOM`结构，而非基于`JAVASCRIPT`的`DOM`调用。由于内部方法是编译好的而非解释执行，故执行的更快。
			>对于小的`DOM`更改，两者效率差不多，但对于大的`DOM`更改，`innerHTML`要比标准的`DOM`方法创建同样的`DOM`结构快得多。
> - 回流`reflow`。
	- 发生场景。
		- 改变窗体大小。 
		- 更改字体。
		- 添加移除stylesheet块。
		- 内容改变哪怕是输入框输入文字。
		- CSS虚类被触发如 :hover。
		- 更改元素的className。
		- 当对DOM节点执行新增或者删除操作或内容更改时。  
		- 动态设置一个style样式时（比如element.style.width="10px"）。  
		- 当获取一个必须经过计算的尺寸值时，比如访问offsetWidth、clientHeight或者其他需要经过计算的CSS值。
	- 解决问题的关键，就是限制通过DOM操作所引发回流的次数。
		- 在对当前DOM进行操作之前，尽可能多的做一些准备工作，保证N次创建，1次写入。  
		- 在对DOM操作之前，把要操作的元素，先从当前DOM结构中删除：  
			- 通过removeChild()或者replaceChild()实现真正意义上的删除。  
			- 设置该元素的display样式为“none”。 	
		- 每次修改元素的style属性都会触发回流操作。
>        
			    element.style.backgroundColor = "blue";
>  
			- 使用更改`className`的方式替换`style.xxx=xxx`的方式。  
			- 使用`style.cssText = '';`一次写入样式。  
			- 避免设置过多的行内样式。  
			- 添加的结构外元素尽量设置它们的位置为`fixed`或`absolute`。  
			- 避免使用表格来布局。  
			- 避免在`CSS`中使用`JavaScript expressions(IE only)`。  
		- 将获取的`DOM`数据缓存起来。这种方法，对获取那些会触发回流操作的属性（比如`offsetWidth`等）尤为重要。  
		- 当对HTMLCollection对象进行操作时，应该将访问的次数尽可能的降至最低，最简单的，你可以将length属性缓存在一个本地变量中，这样就能大幅度的提高循环的效率。

###eval优化
----------
>
- 避免`eval`：
	 - `eval`会在时间方面带来一些效率，但也有很多缺点。
	 	- `eval`会导致代码看起来更脏。
	 	- `eval`会需要消耗大量时间。
	 	- `eval`会逃过大多数压缩工具的压缩。
###`HTML`优化
----------
> 
- 插入`HTML`。
	- `JavaScript`中使用`document.write`生成页面内容会效率较低，可以找一个容器元素，比如指定一个`div`，并使用`innerHTML`来将`HTML`代码插入到页面中。
- 避免空的`src`和`href`。
	- 当`link`标签的`href`属性为空、`script`标签的`src`属性为空的时候，浏览器渲染的时候会把当前页面的`URL`作为它们的属性值，从而把页面的内容加载进来作为它们的值。
- 为文件头指定`Expires`。
	- 使内容具有缓存性，避免了接下来的页面访问中不必要的HTTP请求。
- 重构HTML，把重要内容的优先级提高。
- Post-load（次要加载）不是必须的资源。
- 利用预加载优化资源。
- 合理架构，使DOM结构尽量简单。
- 利用`LocalStorage`合理缓存资源。
- 尽量避免CSS表达式和滤镜。
- 尝试使用defer方式加载Js脚本。
- 新特性：will-change，把即将发生的改变预先告诉浏览器。
- 新特性Beacon，不堵塞队列的异步数据发送。
- 不同之处：网络缓慢，缓存更小，不令人满意的浏览器处理机制。
- 尽量多地缓存文件。
- 使用HTML5 Web Workers来允许多线程工作。
- 为不同的Viewports设置不同大小的Content。
- 正确设置可Tap的目标的大小。
- 使用响应式图片。
- 支持新接口协议（如HTTP2）。
- 未来的缓存离线机制：Service Workers。
- 未来的资源优化Resource Hints(preconnect, preload, 和prerender)。
- 使用Server-sent Events。
- 设置一个Meta Viewport。
###js载入优化
----------
>
- 加快JavaScript装入速度的工具：
	- Lab.js
		- 借助LAB.js（装入和阻止JavaScript），你就可以并行装入JavaScript文件，加快总的装入过程。此外，你还可以为需要装入的脚本设置某个顺序，那样就能确保依赖关系的完整性。此外，开发者声称其网站上的速度提升了2倍。
- 使用适当的CDN：
>
	- 现在许多网页使用内容分发网络（CDN）。它可以改进你的缓存机制，因为每个人都可以使用它。它还能为你节省一些带宽。你很容易使用ping检测或使用Firebug调试那些服务器，以便搞清可以从哪些方面加快数据的速度。选择CDN时，要照顾到你网站那些访客的位置。记得尽可能使用公共存储库。
- 网页末尾装入JavaScript：
>
	- 也可以在头部分放置需要装入的一些JavaScript，但是前提是它以异步方式装入。
- 异步装入跟踪代码：
	>脚本加载与解析会阻塞HTML渲染，可以通过异步加载方式来避免渲染阻塞，步加载的方式很多，比较通用的方法如下。
>
		var _gaq = _gaq || []; 
		    _gaq.push(['_setAccount', 'UA-XXXXXXX-XX']); 
		    _gaq.push(['_trackPageview']); 
	    (function() { 
	        var ga = document.createElement('script'); ga.type = 'text/JavaScript'; ga.async = true; 
	        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; 
	        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); 
	    })();
>
	或者
>
		function loadjs (script_filename){
		     var script = document.createElement( 'script' );
		     script.setAttribute( 'type' , 'text/javascript' );
		     script.setAttribute( 'src' , script_filename);
		     script.setAttribute( 'id' , 'script-id' );
>	 
		     scriptElement = document.getElementById( 'script-id' );
		     if (scriptElement){
		         document.getElementsByTagName( 'head' )[0].removeChild(scriptElement);
		     }
		     document.getElementsByTagName( 'head' )[0].appendChild(script);
		}
		var script = 'scripts/alert.js' ;
		loadjs(script);
>
- 把你的JavaScript打包成PNG文件
	- 将JavaScript/css数据打包成PNG文件。之后进行拆包，只要使用画布API的getImageData()。可以在不缩小数据的情况下，多压缩35%左右。而且是无损压缩，对比较庞大的脚本来说，在图片指向画布、读取像素的过程中，你会觉得有“一段”装入时间。
>
- 设置Cache-Control和Expires头
>
	通过Cache-Control和Expires头可以将脚本文件缓存在客户端或者代理服务器上，可以减少脚本下载的时间。
	>
	Expires格式:
	>
		Expires = "Expires" ":" HTTP-date
		Expires: Thu, 01 Dec 1994 16:00:00 GMT
		Note: if a response includes a Cache-Control field with the max-age directive that directive overrides the
		Expires field.
	>
	Cache-Control格式：
	>
		Cache-Control   = "Cache-Control" ":" 1#cache-directive
		Cache-Control: public
>
	具体的标准定义可以参考http1.1中的定义，简单来说Expires控制过期时间是多久，Cache-Control控制什么地方可以缓存 。
###`with`优化
----------
>
- 尽可能地少用`with`语句，因为它会增加`with`语句以外的数据的访问代价。
- 避免使用`with`
	>
	`with`语句将一个新的可变对象推入作用域链的头部，函数的所有局部变量现在处于第二个作用域链对象中，从而使局部变量的访问代价提高。
>
		var person = {
		     name: “Nicholas",
		     age: 30
		}
		function displayInfo() {
		     var count = 5;
		     with (person) {
		         alert(name + ' is ' + age);
		         alert( 'count is ' + count);
		     }
		}
###事件优化
----------
> 
- 使用事件代理
>
	- 当存在多个元素需要注册事件时，在每个元素上绑定事件本身就会对性能有一定损耗。 
	- 由于DOM Level2事件模 型中所有事件默认会传播到上层文档对象，可以借助这个机制在上层元素注册一个统一事件对不同子元素进行相应处理。
>
	捕获型事件先发生。两种事件流会触发DOM中的所有对象，从document对象开始，也在document对象结束。
>
		<ul id="parent-list">
			<li id="post-1">Item 1
			<li id="post-2">Item 2
			<li id="post-3">Item 3
			<li id="post-4">Item 4
			<li id="post-5">Item 5
			<li id="post-6">Item 6
		</li></ul>
		// Get the element, add a click listener...
		document.getElementById("parent-list").addEventListener("click",function(e) {
			// e.target is the clicked element!
			// If it was a list item
			if(e.target && e.target.nodeName == "LI") {
				// List item found!  Output the ID!
				console.log("List item ",e.target.id.replace("post-")," was clicked!");
			}
		});
>
###代码优化
----------
> - 优化原则：
	>
	JS与其他语言不同在于它的执行效率很大程度是取决于`JS engine`的效率。除了`引擎实现`的优劣外，`引擎`自己也会为一些特殊的`代码模式`采取一些优化的策略。例如`FF`、`Opera`和`Safari`的`JAVASCRIPT`引擎，都对字符串的拼接运算（`+`）做了特别优化。所以应该根据不同引擎进行不同优化。
	>	 
	而如果做跨浏览器的web编程，则最大的问题是在于IE6（JScript 5.6），因为在不打hotfix的情况下，JScript引擎的垃圾回收的bug，会导致其在真实应用中的performance跟其他浏览器根本不在一个数量级上。因此在这种场合做优化，实际上就是为JScript做优化，所以第一原则就是只需要为IE6（未打补丁的JScript 5.6或更早版本）做优化。

>	 
	 - JS优化总是出现在大规模循环的地方：
>
	 	这倒不是说循环本身有性能问题，而是循环会迅速放大可能存在的性能问题，所以第二原则就是以大规模循环体为最主要优化对象。
>	 
		以下的优化原则，只在大规模循环中才有意义，在循环体之外做此类优化基本上是没有意义的。
>	 
		目前绝大多数JS引擎都是解释执行的，而解释执行的情况下，在所有操作中，函数调用的效率是较低的。此外，过深的prototype继承链或者多级引用也会降低效率。JScript中，10级引用的开销大体是一次空函数调用开销的1/2。这两者的开销都远远大于简单操作（如四则运算）。
>	 
	 - 尽量避免过多的引用层级和不必要的多次方法调用：
>
	 	特别要注意的是，有些情况下看似是属性访问，实际上是方法调用。例如所有DOM的属性，实际上都是方法。在遍历一个NodeList的时候，循环 条件对于nodes.length的访问，看似属性读取，实际上是等价于函数调用的。而且IE DOM的实现上，childNodes.length每次是要通过内部遍历重新计数的。（My god，但是这是真的！因为我测过，childNodes.length的访问时间与childNodes.length的值成正比！）这非常耗费。所以 预先把nodes.length保存到js变量，当然可以提高遍历的性能。
>	 
		同样是函数调用，用户自定义函数的效率又远远低于语言内建函数，因为后者是对引擎本地方法的包装，而引擎通常是c,c++,java写的。进一步，同样的功能，语言内建构造的开销通常又比内建函数调用要效率高，因为前者在JS代码的parse阶段就可以确定和优化。
>	 
	 - 尽量使用语言本身的构造和内建函数：
>
	 	这里有一个例子是高性能的String.format方法。 String.format传统的实现方式是用String.replace(regex, func)，在pattern包含n个占位符（包括重复的）时，自定义函数func就被调用n次。而这个高性能实现中，每次format调用所作的只是一次Array.join然后一次String.replace(regex, string)的操作，两者都是引擎内建方法，而不会有任何自定义函数调用。两次内建方法调用和n次的自定义方法调用，这就是性能上的差别。
>	 
		同样是内建特性，性能上也还是有差别的。例如在JScript中对于arguments的访问性能就很差，几乎赶上一次函数调用了。因此如果一个 可变参数的简单函数成为性能瓶颈的时候，可以将其内部做一些改变，不要访问arguments，而是通过对参数的显式判断来处理，比如：
		>
			function sum() {  
			    var r = 0;  
			    for (var i = 0; i < arguments.length; i++) {  
			        r += arguments[i];  
			    }  
			    return r;  
			}
		>
		这个sum通常调用的时候个数是较少的，我们希望改进它在参数较少时的性能。如果改成：
		>
			function sum() {  
			    switch (arguments.length) {  
			        case 1: return arguments[0];  
			        case 2: return arguments[0] + arguments[1];  
			        case 3: return arguments[0] + arguments[1] + arguments[2];  
			        case 4: return arguments[0] + arguments[1] + arguments[2] + arguments[3];  
			        default:  
			            var r = 0;  
			            for (var i = 0; i < arguments.length; i++) {  
			                r += arguments[i];  
			            }  
			            return r;  
			    }  
			}
		>
		其实并不会有多少提高，但是如果改成：
		>
			function sum(a, b, c, d, e, f, g) {  
			    var r = a ? b ? c ? d ? e ? f ? a + b + c + d + e + f : a + b + c + d + e : a + b + c + d : a + b + c : a + b : a : 0;  
			    if (g === undefined) return r;  
			    for (var i = 6; i < arguments.length; i++) {  
			        r += arguments[i];  
			    }  
			    return r;  
			}
		>
		就会提高很多（至少快1倍）。
> 


###代码压缩
----------
> - 代码压缩工具
>	
	>	精简代码就是将代码中的`空格`和`注释`去除，也有更进一步的会对变量名称`混淆`、`精简`。根据统计精简后文件大小会平均减少`21%`，即使`Gzip`之后文件也会减少`5%`。
	- YUICompressor
	- Dean Edwards Packer
	- JSMin
	- GZip压缩
		- `GZip`缩短在浏览器和服务器之间传送数据的时间，缩短时间后得到标题是`Accept-Encoding`: `gzip`,`deflate`的一个文件。不过这种压缩方法同样也有缺点。
			- 它在服务器端和客户端都要占用处理器资源（以便压缩和解压缩）。
			- 占用磁盘空间。
		- `Gzip`通常可以减少70%网页内容的大小，包括脚本、样式表、图片等任何一个文本类型的响应，包括`XML`和`JSON`。`Gzip`比`deflate`更高效，主流服务器都有相应的压缩支持模块。
		- `Gzip`的工作流程为
			- 客户端在请求`Accept-Encoding`中声明可以支持`Gzip`。
			- 服务器将请求文档压缩，并在`Content-Encoding`中声明该回复为`Gzip`格式。
			- 客户端收到之后按照`Gzip`解压缩。
	- Closure compiler

###作用域链和闭包优化
----------
>
- 作用域。
	- 作用域(`scope`)是`JAVASCRIPT`编程中一个重要的`运行机制`，在`JAVASCRIPT`同步和异步编程以及`JAVASCRIPT`内存管理中起着至关重要的作用。
	- 在`JAVASCRIPT`中，能形成作用域的有如下几点。
		- 函数的调用
		- with语句
			- `with`会创建自已的作用域，因此会增加其中执行代码的作用域的长度。
		- 全局作用域。
>
		以下代码为例：
>
			var foo = function() {
			  var local = {};
			};
			foo();
			console.log(local); //=> undefined
>
			var bar = function() {
			  local = {};
			};
			bar();
			console.log(local); //=> {}
>
			/**这里我们定义了foo()函数和bar()函数，他们的意图都是为了定义一个名为local的变量。在foo()函数中，我们使用var语句来声明定义了一个local变量，而因为函数体内部会形成一个作用域，所以这个变量便被定义到该作用域中。而且foo()函数体内并没有做任何作用域延伸的处理，所以在该函数执行完毕后，这个local变量也随之被销毁。而在外层作用域中则无法访问到该变量。而在bar()函数内，local变量并没有使用var语句进行声明，取而代之的是直接把local作为全局变量来定义。故外层作用域可以访问到这个变量。**/
>
			local = {};
			// 这里的定义等效于
			global.local = {};
- 作用域链
	- 在`JAVASCRIPT`编程中，会遇到多层函数嵌套的场景，这就是典型的作用域链的表示。
>
			function foo() {
			  var val = 'hello';
			  function bar() {
			    function baz() {
			      global.val = 'world;'
			    };
			    baz();
			    console.log(val); //=> hello
			  };
			  bar();
			};
			foo();
>
			/**在`JAVASCRIPT`中，变量标识符的查找是从当前作用域开始向外查找，直到全局作用域为止。所以`JAVASCRIPT`代码中对变量的访问只能向外进行，而不能逆而行之。baz()函数的执行在全局作用域中定义了一个全局变量val。而在bar()函数中，对val这一标识符进行访问时，按照从内到外的查找原则：在bar函数的作用域中没有找到，便到上一层，即foo()函数的作用域中查找。然而，使大家产生疑惑的关键就在这里：本次标识符访问在foo()函数的作用域中找到了符合的变量，便不会继续向外查找，故在baz()函数中定义的全局变量val并没有在本次变量访问中产生影响。**/
- 减少作用域链上的查找次数
	- `JAVASCRIPT`代码在执行的时候，如果需要访问一个变量或者一个函数的时候，它需要遍历当前执行环境的作用域链，而遍历是从这个作用域链的前端一级一级的向后遍历，直到全局执行环境。
>
		    /**效率低**/
			for(var i = 0; i < 10000; i++){
		        var but1 = document.getElementById("but1");
		    }
			/**效率高**/
			/**避免全局查找**/
		    var doc = document;
		    for(var i = 0; i < 10000; i++){
		        var but1 = doc.getElementById("but1");
		    }
			/**上面代码中，第二种情况是先把全局对象的变量放到函数里面先保存下来，然后直接访问这个变量，而第一种情况是每次都遍历作用域链，直到全局环境，我们看到第二种情况实际上只遍历了一次，而第一种情况却是每次都遍历了，而且这种差别在多级作用域链和多个全局变量的情况下还会表现的非常明显。在作用域链查找的次数是`O(n)`。通过创建一个指向`document`的局部变量，就可以通过限制一次全局查找来改进这个函数的性能。**/
> - 闭包
	- `JAVASCRIPT`中的标识符查找遵循从内到外的原则。
>
			function foo() {
			  var local = 'Hello';
			  return function() {
			    return local;
			  };
			}
			var bar = foo();
			console.log(bar()); //=> Hello
>
			/**这里所展示的让外层作用域访问内层作用域的技术便是闭包(Closure)。得益于高阶函数的应用，使foo()函数的作用域得到`延伸`。foo()函数返回了一个匿名函数，该函数存在于foo()函数的作用域内，所以可以访问到foo()函数作用域内的local变量，并保存其引用。而因这个函数直接返回了local变量，所以在外层作用域中便可直接执行bar()函数以获得local变量。**/
	- 闭包是`JAVASCRIPT`的高级特性，因为把带有​​内部变量引用的函数带出了函数外部，所以该作用域内的变量在函数执行完毕后的并不一定会被销毁，直到内部变量的引用被全部解除。所以闭包的应用很容易造成内存无法释放的情况。
	- 良好的闭包管理。
		- 循环事件绑定、私有属性、含参回调等一定要使用闭包时，并谨慎对待其中的细节。
			- 循环绑定事件，我们假设一个场景：有六个按钮，分别对应六种事件，当用户点击按钮时，在指定的地方输出相应的事件。
>
					var btns = document.querySelectorAll('.btn'); // 6 elements
					var output = document.querySelector('#output');
					var events = [1, 2, 3, 4, 5, 6];
					// Case 1
					for (var i = 0; i < btns.length; i++) {
					  btns[i].onclick = function(evt) {
					    output.innerText += 'Clicked ' + events[i];
					  };
					}
					/**这里第一个解决方案显然是典型的循环绑定事件错误，这里不细说，详细可以参照我给一个网友的回答；而第二和第三个方案的区别就在于闭包传入的参数。**/
					// Case 2
					for (var i = 0; i < btns.length; i++) {
					  btns[i].onclick = (function(index) {
					    return function(evt) {
					      output.innerText += 'Clicked ' + events[index];
					    };
					  })(i);
					}
					/**第二个方案传入的参数是当前循环下标，而后者是直接传入相应的事件对象。事实上，后者更适合在大量数据应用的时候，因为在JavaScript的函数式编程中，函数调用时传入的参数是基本类型对象，那么在函数体内得到的形参会是一个复制值，这样这个值就被当作一个局部变量定义在函数体的作用域内，在完成事件绑定之后就可以对events变量进行手工解除引用，以减轻外层作用域中的内存占用了。而且当某个元素被删除时，相应的事件监听函数、事件对象、闭包函数也随之被销毁回收。**/
					// Case 3
					for (var i = 0; i < btns.length; i++) {
					  btns[i].onclick = (function(event) {
					    return function(evt) {
					      output.innerText += 'Clicked ' + event;
					    };
					  })(events[i]);
					}
> - 避开闭包陷阱
	- 闭包是个强大的工具，但同时也是性能问题的主要诱因之一。不合理的使用闭包会导致内存泄漏。
	- 闭包的性能不如使用内部方法，更不如重用外部方法。
		- 由于`IE 9`浏览器的`DOM`节点作为`COM`对象来实现，`COM`的`内存管理`是通过引用计数的方式，引用计数有个难题就是循环引用，一旦`DOM`引用了闭包(例如`event handler`)，闭包的上层元素又引用了这个`DOM`，就会造成循环引用从而导致内存泄漏。
> - 善用函数
	- 使用一个匿名函数在代码的最外层进行包裹。
>
		;(function() {
		  // 主业务代码
		})();
>
	有的甚至更高级一点：
>
		;(function(win, doc, $, undefined) {
		  // 主业务代码
		})(window, document, jQuery);
>
	甚至连如RequireJS, SeaJS, OzJS 等前端模块化加载解决方案，都是采用类似的形式：
>
		/**RequireJS**/
		define(['jquery'], function($) {
		  // 主业务代码
		});
		/**SeaJS**/
		define('m​​odule', ['dep', 'underscore'], function($, _) {
		  // 主业务代码
		});
>
	被定义在全局作用域的对象，可能是会一直存活到进程退出的，如果是一个很大的对象，那就麻烦了。比如有的人喜欢在JavaScript中做模版渲染：
>
		<?php
		  $db = mysqli_connect(server, user, password, 'myapp');
		  $topics = mysqli_query($db, "SELECT * FROM topics;");
		?>
		<!doctype html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <title>你是猴子请来的逗比么？</title>
		</head>
		<body>
		  <ul id="topics"></ul>
		  <script type="text/tmpl" id="topic-tmpl">
		    <li class="topic">
		      <h1><%=title%></h1>
		      <p><%=content%></p>
		    </li>
		  </script>
		  <script type="text/javascript">
		    var data = <?php echo json_encode($topics); ?>;
		    var topicTmpl = document.querySelector('#topic-tmpl').innerHTML;
		    var render = function(tmlp, view) {
		      var complied = tmlp
		        .replace(/\n/g, '\\n')
		        .replace(/<%=([\s\S]+?)%>/g, function(match, code) {
		          return '" + escape(' + code + ') + "';
		        });
>
		      complied = [
		        'var res = "";',
		        'with (view || {}) {',
		          'res = "' + complied + '";',
		        '}',
		        'return res;'
		      ].join('\n');
>
		      var fn = new Function('view', complied);
		      return fn(view);
		    };
>
		    var topics = document.querySelector('#topics');
		    function init()
		      data.forEach(function(topic) {
		        topics.innerHTML += render(topicTmpl, topic);
		      });
		    }
		    init();
		  </script>
		</body>
		</html>
>
	在从数据库中获取到的数据的量是非常大的话，前端完成模板渲染以后，data变量便被闲置在一边。可因为这个变量是被定义在全局作用域中的，所以`JAVASCRIPT`引擎不会将其回收销毁。如此该变量就会一直存在于老生代堆内存中，直到页面被关闭。可是如果我们作出一些很简单的修改，在逻辑代码外包装一层函数，这样效果就大不同了。当UI渲染完成之后，代码对data的引用也就随之解除，而在最外层函数执行完毕时，`JAVASCRIPT`引擎就开始对其中的对象进行检查，data也就可以随之被回收。

###内存专题
----------
> 
- `JAVASCRIPT`的内存回收机制
	- 以Google的`V8`引擎为例，在`V8`引擎中所有的`JAVASCRIPT`对象都是通过`堆`来进行内存分配的。当我们在代码中`声明变量`并`赋值`时，`V8`引擎就会在`堆内存`中分配一部分给这个`变量`。如果已申请的`内存`不足以存储这个`变量`时，`V8`引擎就会继续申请`内存`，直到`堆`的大小达到了`V8`引擎的内存上限为止（默认情况下，`V8`引擎的`堆内存`的大小上限在`64位系统`中为`1464MB`，在`32位系统`中则为`732MB`）。
	- 另外，`V8`引擎对`堆内存`中的`JAVASCRIPT`对象进行`分代管理`。
		- 新生代。
			- 新生代即存活周期较短的`JAVASCRIPT`对象，如临时变量、字符串等
		- 老生代。
			- 老生代则为经过多次垃圾回收仍然存活，存活周期较长的对象，如主控制器、服务器对象等。
- 垃圾回收算法。
	- 垃圾回收算法一直是编程语言的研发中是否重要的​​一环，而`V8`引擎所使用的垃圾回收算法主要有以下几种。
		- `Scavange`算法：通过复制的方式进行内存空间管理，主要用于新生代的内存空间；
		- `Mark-Sweep`算法和`Mark-Compact`算法：通过标记来对堆内存进行整理和回收，主要用于老生代对象的检查和回收。
- 对象进行回收。
	- `引用`。
		- 当函数执行完毕时，在函数内部所声明的对象`不一定`就会被销毁。
		- 引用(`Reference`)是`JAVASCRIPT`编程中十分重要的一个机制。
			- 是指`代码对对象的访问`这一抽象关系，它与`C/C++`的指针有点相似，但并非同物。引用同时也是`JAVASCRIPT`引擎在进行`垃圾回收`中最关键的一个机制。
>
					var val = 'hello world';
					function foo() {
					  return function() {
					    return val;
					  };
					}
					global.bar = foo();
>
			- 当代码执行完毕时，对象`val`和`bar()`并没有被回收释放，`JAVASCRIPT`代码中，每个`变量`作为单独一行而不做任何操作，`JAVASCRIPT`引擎都会认为这是对`对象`的访问行为，存在了对`对象的引用`。为了保证`垃圾回收`的行为不影响程序逻辑的运行，`JAVASCRIPT`引擎不会把正在使用的`对象`进行回收。所以判断`对象`是否正在使用中的标准，就是是否仍然存在对该`对象`的`引用`。
			- `JAVASCRIPT`的`引用`是可以进行`转移`的，那么就有可能出现某些引用被带到了全局作用域，但事实上在业务逻辑里已经不需要对其进行访问了，这个时候就应该被回收，但是`JAVASCRIPT`引擎仍会认为程序仍然需要它。
- `IE`下闭包引起跨页面内存泄露。
- `JAVASCRIPT`的内存泄露处理
	- 给`DOM`对象添加的属性是一个对象的引用。
>
			var MyObject = {};
			document.getElementByIdx_x('myDiv').myProp = MyObject;
>
		解决方法：在window.onunload事件中写上: 
>
			document.getElementByIdx_x('myDiv').myProp = null;
>
	- DOM对象与JS对象相互引用。
>
			function Encapsulator(element) {
			   this.elementReference = element;
			   element.myProp = this;
			}
			new Encapsulator(document.getElementByIdx_x('myDiv'));
>
		解决方法：在onunload事件中写上: 
>
			document.getElementByIdx_x('myDiv').myProp = null;
>
	- 给DOM对象用attachEvent绑定事件。
>
			function doClick() {}
			element.attachEvent("onclick", doClick);
>
		解决方法：在onunload事件中写上: 
>
			element.detachEvent('onclick', doClick);
>
	- 从外到内执行appendChild。这时即使调用removeChild也无法释放。
>
			var parentDiv =   document.createElement_x("div");
			var childDiv = document.createElement_x("div");
			document.body.appendChild(parentDiv);
			parentDiv.appendChild(childDiv);
>
		解决方法：从内到外执行appendChild:
>
			var parentDiv =   document.createElement_x("div");
			var childDiv = document.createElement_x("div");
			parentDiv.appendChild(childDiv);
			document.body.appendChild(parentDiv);
>	 
	- 反复重写同一个属性会造成内存大量占用(但关闭IE后内存会被释放)。
>
			for(i = 0; i < 5000; i++) {
			   hostElement.text = "asdfasdfasdf";
			}
>
		这种方式相当于定义了5000个属性，解决方法：无。
- `内存`不是`缓存`。
	- 不要轻易将`内存`当作`缓存`使用。
	- 如果是很重要的资源，请不要直接放在`内存`中，或者制定`过期机制`，自动销毁`过期缓存`。
- `CollectGarbage`。
	- `CollectGarbage`是`IE`的一个特有属性,用于释放内存的使用方法,将该变量或引用对象设置为`null`或`delete`然后在进行释放动作，在做`CollectGarbage`前,要必需清楚的两个必备条件:（引用）。
		- 一个对象在其生存的上下文环境之外，即会失效。
		- 一个全局的对象在没有被执用(引用)的情况下，即会失效
###动画优化
----------
> - 动画效果在缺少硬件加速支持的情况下反应缓慢，例如手机客户端。
>
	- 特效应该只在确实能改善用户体验时才使用，而不应用于炫耀或者弥补功能与可用性上的缺陷。
	- 至少要给用户一个选择可以禁用动画效果。
	- 设置动画元素为absolute或fixed。
		- `position: static`或`position: relative`元素应用动画效果会造成频繁的`reflow`。
		- `position: absolute`或`position: fixed`的元素应用动画效果只需要`repaint`。
	- 使用一个`timer`完成多个元素动画。
		- `setInterval`和`setTimeout`是两个常用的实现动画的接口，用以间隔更新元素的风格与布局。。
	- 动画效果的帧率最优化的情况是使用一个`timer`完成多个对象的动画效果，其原因在于多个`timer`的调用本身就会损耗一定性能。
>
			setInterval(function() {
			  animateFirst('');
			}, 10);
			setInterval(function() {
			  animateSecond('');
			}, 10);
>
		使用同一个`timer`。
>
			setInterval(function() {
			  animateFirst('');
			  animateSecond('');
			}, 10);
- 以脚本为基础的动画，由浏览器控制动画的更新频率。
###原型优化
----------
>
- 通过原型优化方法定义。
	- 如果一个方法类型将被频繁构造，通过方法原型从外面定义附加方法，从而避免方法的重复定义。
	- 可以通过外部原型的构造方式初始化值类型的变量定义。（这里强调值类型的原因是，引用类型如果在原型中定义，一个实例对引用类型的更改会影响到其他实例。）
		- 这条规则中涉及到`JAVASCRIPT`中原型的概念，构造函数都有一个`prototype`属性，指向另一个对象。这个对象的所有属性和方法，都会被构造函数的实例继承。可以把那些不变的属性和方法，直接定义在`prototype`对象上。
			- 可以通过对象实例访问保存在原型中的值。
			- 不能通过对象实例重写原型中的值。
			- 在实例中添加一个与实例原型同名属性，那该属性就会屏蔽原型中的属性。
			- 通过delete操作符可以删除实例中的属性。
###变量专题
----------
> - 全局变量
	- 当一个变量被定义在全局作用域中，默认情况下`JAVASCRIPT`引擎就不会将其回收销毁。如此该变量就会一直存在于老生代堆内存中，直到页面被关闭。
	- `全局变量`缺点。
		- 使变量不易被回收。
	 	- 多人协作时容易产生混淆。
		- 在作用域链中容易被干扰。
	- 可以通过包装函数来处理`全局变量`。
> - 局部变量。
	- 尽量选用局部变量而不是全局变量。
	- 局部变量的访问速度要比全局变量的访问速度更快，因为全局变量其实是`window`对象的成员，而局部变量是放在函数的栈里的。
> - 手工解除变量引用
	- 在业务代码中，一个变量已经确定不再需要了，那么就可以手工解除变量引用，以使其被回收。
>
			var data = { /* some big data */ };
			// ...
			data = null;
> - 变量查找优化。
	- 变量声明带上`var`，如果声明变量忘记了`var`，那么`JAVASCRIPT`引擎将会遍历整个作用域查找这个变量，结果不管找到与否，都会造成性能损耗。
		- 如果在上级作用域找到了这个变量，上级作用域变量的内容将被无声的改写，导致莫名奇妙的错误发生。
		- 如果在上级作用域没有找到该变量，这个变量将自动被声明为全局变量，然而却都找不到这个全局变量的定义。
	- 慎用全局变量。
		- 全局变量需要搜索更长的作用域链。		
		- 全局变量的生命周期比局部变量长，不利于内存释放。	
		- 过多的全局变量容易造成混淆，增大产生bug的可能性。
	>
	- 具有相同作用域变量通过一个var声明。
>
			jQuery.extend = jQuery.fn.extend = function () {
				var options, 
					name, 
					src, 
					copy, 
					copyIsArray, 
					clone,target = arguments[0] || {},
					i = 1,
					length = arguments.length,
					deep = false ;
			}
	- 缓存重复使用的全局变量。
		- 全局变量要比局部变量需要搜索的作用域长		
		- 重复调用的方法也可以通过局部缓存来提速		
		- 该项优化在IE上体现比较明显
>
				var docElem = window.document.documentElement,
					selector_hasDuplicate,
					matches = docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector ||docElem.msMatchesSelector,
					selector_sortOrder = function ( a, b ) {
						// Flag for duplicate removal
						if ( a === b ) {
						     selector_hasDuplicate = true ;
						     return 0;
						}
					}
> - 善用回调。
	- 除了使用闭包进行内部变量访问，我们还可以使用现在十分流行的回调函数来进行业务处理。
>
			function getData(callback) {
			  var data = 'some big data';
>	
			  callback(null, data);
			}
>
			getData(function(err, data) {
			  console.log(data);
			});
	- 回调函数是一种后续传递风格(`Continuation Passing Style`, `CPS`)的技术，这种风格的程序编写将函数的业务重点从返回值转移到回调函数中去。而且其相比闭包的好处也有很多。
		- 如果传入的参数是基础类型（如字符串、数值），回调函数中传入的形参就会是复制值，业务代码使用完毕以后，更容易被回收。
		- 通过回调，我们除了可以完成同步的请求外，还可以用在异步编程中，这也就是现在非常流行的一种编写风格。
		- 回调函数自身通常也是临时的匿名函数，一旦请求函数执行完毕，回调函数自身的引用就会被解除，自身也得到回收。
>
###同域跨域
----------
> - 避免跳转
	- 同域：注意避免反斜杠 “/” 的跳转；
	- 跨域：使用Alias或者mod_rewirte建立CNAME（保存域名与域名之间关系的DNS记录）
###字符串专题
----------
> 
- 对字符串进行循环操作。
	- 替换、查找等操作，使用正则表达式。
		- 因为`JAVASCRIPT`的循环速度较慢，而正则表达式的操作是用`C`写成的`API`，性能比较好。
- 字符串的拼接。
	- 字符串的拼接在我们开发中会经常遇到，所以我把其放在首位，我们往往习惯的直接用`+=`的方式来拼接字符串，其实这种拼接的方式效率非常的低，我们可以用一种巧妙的方法来实现字符串的拼接，那就是利用数组的`join`方法，具体请看我整理的：[Web前端开发规范文档](http://kang.cool/modules/web_develop_standard/index.html "Web前端开发规范文档")中的`javaScript书写规范`倒数第三条目。
	- 不过也有另一种说法，通常认为需要用`Array.join`的方式，但是由于`SpiderMonkey`等引擎对字符串的“`+`”运算做了优化，结果使用`Array.join`的效率反而不如直接用“`+`”，但是如果考虑`IE6`，则其他浏览器上的这种效率的差别根本不值一提。具体怎么取舍，诸君自定。
###对象专题
----------
>
- 减少不必要的对象创建：
	- 创建对象本身对性能影响并不大，但由于`JAVASCRIPT`的垃圾回收调度算法，导致随着对象个数的增加，性能会开始严重下降（复杂度`O(n^2)`）。
		- 如常见的字符串拼接问题，单纯的多次创建字符串对象其实根本不是降低性能的主要原因，而是是在对象创建期间的无谓的垃圾回收的开销。而`Array.join`的方式，不会创建中间字符串对象，因此就减少了垃圾回收的开销。
	- 复杂的`JAVASCRIPT`对象，其创建时时间和空间的开销都很大，应该尽量考虑采用缓存。
	- 尽量作用`JSON`格式来创建对象，而不是`var obj=new Object()`方法。前者是直接复制，而后者需要调用构造器。
- 对象查找
	- 避免对象的嵌套查询，因为`JAVASCRIPT`的解释性，`a.b.c.d.e`嵌套对象，需要进行`4`次查询，嵌套的对象成员会明显影响性能。
	- 如果出现嵌套对象，可以利用局部变量，把它放入一个临时的地方进行查询。
- 对象属性
	- 访问对象属性消耗性能过程（`JAVASCRIPT`对象存储）。
		- 先从本地变量表找到`对象`。
		- 然后遍历`属性`。
		- 如果在`当前对象`的`属性列表`里没找到。
		- 继续从`prototype`向上查找。
		- 且不能直接索引，只能遍历。
>
				function f(obj) { 
					return obj.a + 1; 
				}

###常规优化
----------
>
- 传递方法取代方法字符串
>
	一些方法例如`setTimeout()`、`setInterval()`，接受`字符串`或者`方法实例`作为参数。直接传递方法对象作为参数来避免对字符串的二次解析。
	- 传递方法
>
			setTimeout(test, 1);
>
	- 传递方法字符串
>
			setTimeout('test()', 1);
> - 使用原始操作代替方法调用
>
	方法调用一般封装了原始操作，在性能要求高的逻辑中，可以使用原始操作代替方法调用来提高性能。
	- 原始操作
>
			var min = a<b?a:b;
	- 方法实例
>
			var min = Math.min(a, b);
> - 定时器
>
	如果针对的是不断运行的代码，不应该使用`setTimeout`，而应该是用`setInterval`。`setTimeout`每次要重新设置一个定时器。
> - 避免双重解释
>
	当`JAVASCRIPT`代码想解析`JAVASCRIPT`代码时就会存在双重解释惩罚，双重解释一般在使用`eval`函数、`new Function`构造函数和`setTimeout`传一个字符串时等情况下会遇到，如。
>
		eval("alert('hello world');");
		var sayHi = new Function("alert('hello world');");
		setTimeout("alert('hello world');", 100);
>    
     上述`alert('hello world');`语句包含在字符串中，即在JS代码运行的同时必须新启运一个解析器来解析新的代码，而实例化一个新的解析器有很大的性能损耗。
		我们看看下面的例子：
>
		var sum, num1 = 1, num2 = 2;
		/**效率低**/
	    for(var i = 0; i < 10000; i++){
	        var func = new Function("sum+=num1;num1+=num2;num2++;");
	        func();
			//eval("sum+=num1;num1+=num2;num2++;");
	    }
		/**效率高**/
	    for(var i = 0; i < 10000; i++){
	        sum+=num1;
	        num1+=num2;
	        num2++;
	    }
>
	第一种情况我们是使用了new Function来进行双重解释，而第二种是避免了双重解释。
>
> - 原生方法更快
	- 只要有可能，使用原生方法而不是自已用JS重写。原生方法是用诸如C/C++之类的编译型语言写出来的，要比JS的快多了。
> - 最小化语句数
>
	JS代码中的语句数量也会影响所执行的操作的速度，完成多个操作的单个语句要比完成单个操作的多个语句块快。故要找出可以组合在一起的语句，以减来整体的执行时间。这里列举几种模式
>
	- 多个变量声明
>
			/**不提倡**/
			var i = 1;
			var j = "hello";
			var arr = [1,2,3];
			var now = new Date();
			/**提倡**/
			var i = 1,
			    j = "hello",
			    arr = [1,2,3],
			    now = new Date();
>
	- 插入迭代值
>
			/**不提倡**/
			var name = values[i];
			i++;
			/**提倡**/
			var name = values[i++];
>
	- 使用数组和对象字面量，避免使用构造函数Array(),Object()
>
			/**不提倡**/
			var a = new Array();
			a[0] = 1;
			a[1] = "hello";
			a[2] = 45;
			var o = new Obejct();
			o.name = "bill";
			o.age = 13;
			/**提倡**/
			var a = [1, "hello", 45];
			var o = {
			    name : "bill",
			    age : 13
			};
>
> - 避免使用属性访问方法
	- JavaScript不需要属性访问方法，因为所有的属性都是外部可见的。
	- 添加属性访问方法只是增加了一层重定向 ，对于访问控制没有意义。
>
		使用属性访问方法示例
>
			function Car() {
			   this .m_tireSize = 17;
			   this .m_maxSpeed = 250;
			   this .GetTireSize = Car_get_tireSize;
			   this .SetTireSize = Car_put_tireSize;
			}
>
			function Car_get_tireSize() {
			   return this .m_tireSize;
			}
>
			function Car_put_tireSize(value) {
			   this .m_tireSize = value;
			}
			var ooCar = new Car();
			var iTireSize = ooCar.GetTireSize();
			ooCar.SetTireSize(iTireSize + 1);
>
		直接访问属性示例
>
			function Car() {
			   this .m_tireSize = 17;
			   this .m_maxSpeed = 250;
			}
			var perfCar = new Car();
			var iTireSize = perfCar.m_tireSize;
			perfCar.m_tireSize = iTireSize + 1;
>
> - 减少使用元素位置操作
>
	- 一般浏览器都会使用增量reflow的方式将需要reflow的操作积累到一定程度然后再一起触发，但是如果脚本中要获取以下属性，那么积累的reflow将会马上执行，已得到准确的位置信息。
>
			offsetLeft
			offsetTop
			offsetHeight
			offsetWidth
			scrollTop/Left/Width/Height
			clientTop/Left/Width/Height
			getComputedStyle()


###循环专题
----------
> 
- 循环是一种常用的流程控制。
	- `JAVASCRIPT`提供了三种循环。
		- `for(;;)`。
			- 推荐使用for循环，如果循环变量递增或递减，不要单独对循环变量赋值，而应该使用嵌套的`++`或`–-`运算符。
			- 代码的可读性对于for循环的优化。
			- 用`-=1`。
			- 从大到小的方式循环（这样缺点是降低代码的可读性）。
>
					/**效率低**/   
				    var divs = document.getElementsByTagName("div");    
				    for(var i = 0; i < divs.length; i++){   
				        ...  
				    }    
					/**效率高，适用于获取DOM集合，如果纯数组则两种情况区别不到**/  
				    var divs = document.getElementsByTagName("div");   
				    for(var i = 0, len = divs.length; i < len; i++){   
				        ... 
				    }
					/**在`IE6.0`下，`for(;;)`循环在执行中，第一种情况会每次都计算一下长度，而第二种情况却是在开始的时候计算长度，并把其保存到一个变量中，所以其执行效率要高点，所以在我们使用`for(;;)`循环的时候，特别是需要计算长度的情况，我们应该开始将其保存到一个变量中。**/
		- `while()`。
			- `for(;;)`、`while()`循环的性能基本持平。
		- `for(in)`。
			- 在这三种循环中`for(in)`内部实现是构造一个所有元素的列表，包括`array`继承的属性，然后再开始循环，并且需要查询hasOwnProperty。所以`for(in)`相对`for(;;)`循环性能要慢。
> - 选择正确的方法
	- 避免不必要的属性查找。
		- 访问`变量`或`数组`是`O(1)`操作。
		- 访问`对象`上的`属性`是一个`O(n)`操作。
>
		对象上的任何属性查找都要比访问变量或数组花费更长时间，因为必须在原型链中对拥有该名称的属性进行一次搜索，即属性查找越多，执行时间越长。所以针对需要多次用到对象属性，应将其存储在局部变量。
>
	- 优化循环。
		- 减值迭代。
			- 大多数循环使用一个从0开始，增加到某个特定值的迭代器。在很多情况下，从最大值开始，在循环中不断减值的迭代器更加有效。
		- 简化终止条件。
			- 由于每次循环过程都会计算终止条件，故必须保证它尽可能快，即避免属性查找或其它O(n)的操作。
		- 简化循环体。
			- 循环体是执行最多的，故要确保其被最大限度地优化。确保没有某些可以被很容易移出循环的密集计算。
		- 使用后测试循环。
			- 最常用的for和while循环都是前测试循环，而如do-while循环可以避免最初终止条件的计算，因些计算更快。
		>
					for(var i = 0; i < values.length; i++) {
					    process(values[i]);
					}
		>
		优化1：简化终止条件
		>
			for(var i = 0, len = values.length; i < len; i++) {
			    process(values[i]);
			}
		>
		优化2：使用后测试循环（注意：使用后测试循环需要确保要处理的值至少有一个）
		>
			var i values.length - 1;
			if(i > -1) {
			    do {
			        process(values[i]);
			    }while(--i >= 0);
			}
	- 展开循环。
		- 当循环的次数确定时，消除循环并使用多次函数调用往往更快。
		- 当循环的次数不确定时，可以使用Duff装置来优化。
			- Duff装置的基本概念是通过计算迭代的次数是否为8的倍数将一个循环展开为一系列语句。
		>
			// Jeff Greenberg for JS implementation of Duff's Device
			// 假设：values.length > 0
			function process(v) {
			    alert(v);
			}
			var values = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
			var iterations = Math.ceil(values.length / 8);
			var startAt = values.length % 8;
			var i = 0; 
			do {
			    switch(startAt) {
			        case 0 : process(values[i++]);
			        case 7 : process(values[i++]);
			        case 6 : process(values[i++]);
			        case 5 : process(values[i++]);
			        case 4 : process(values[i++]);
			        case 3 : process(values[i++]);
			        case 2 : process(values[i++]);
			        case 1 : process(values[i++]);
			    }
			    startAt = 0;
			}while(--iterations > 0);
		>
		如上展开循环可以提升大数据集的处理速度。接下来给出更快的Duff装置技术，将do-while循环分成2个单独的循环。（注：这种方法几乎比原始的Duff装置实现快上40%。）
		> 
			// Speed Up Your Site(New Riders, 2003)
			function process(v) {
			    alert(v);
			}	 
			var values = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
			var iterations = Math.floor(values.length / 8);
			var leftover = values.length % 8;
			var i = 0; 
			if(leftover > 0) {
			    do {
			        process(values[i++]);
			    }while(--leftover > 0);
			}	 
			do {
			    process(values[i++]);
			    process(values[i++]);
			    process(values[i++]);
			    process(values[i++]);
			    process(values[i++]);
			    process(values[i++]);
			    process(values[i++]);
			    process(values[i++]);
			}while(--iterations > 0);
		>
		针对大数据集使用展开循环可以节省很多时间，但对于小数据集，额外的开销则可能得不偿失。
- 避免在循环中使用`try-catch`。
	- `try-catch-finally`语句在catch语句被执行的过程中会动态构造变量插入到当前域中，对性能有一定影响。  
	- 如果需要异常处理机制，可以将其放在循环外层使用。
		- 循环中使用try-catch
>
				for ( var i = 0; i < 200; i++) {
				  try {} catch (e) {}
				}
>
		- 循环外使用try-catch
>
				try {
				  for ( var i = 0; i < 200; i++) {}
				} catch (e) {}
>
> - 避免遍历大量元素：
	- 避免对全局`DOM`元素进行遍历，如果`parent`已知可以指定`parent`在特定范围查询。
>
			var elements = document.getElementsByTagName( '*' );
			for (i = 0; i < elements.length; i++) {
			   if (elements[i].hasAttribute( 'selected' )) {}
			}
>
		如果已知元素存在于一个较小的范围内，
>
			var elements = document.getElementById( 'canvas' ).getElementsByTagName ( '*' );
			for (i = 0; i < elements.length; i++) {
			   if (elements[i].hasAttribute( 'selected' )) {}
			}
###性能测试工具
----------
> - js性能优化和内存泄露问题及检测分析工具
>
	 - 性能优化ajax工具`diviefirebug`
	 - [web性能分析工具YSlow]
		- `performance`性能评估打分，右击箭头可看到改进建议。 
		- `stats`缓存状态分析，传输内容分析。 
		- `components`所有加载内容分析，可以查看传输速度，找出页面访问慢的瓶颈。 
		- `tools`可以查看js和css，并打印页面评估报告。
	 - 内存泄露检测工具`sIEve`
		- `sIEve`是基于`IE`的内存泄露检测工具，需要下载运行，可以查看dom孤立节点和内存泄露及内存使用情况。			
			1. 列出当前页面内所有dom节点的基本信息(html id style 等) 			
			1. 页面内所有dom节点的高级信息 (内存占用,数量,节点的引用) 		
			1. 可以查找出页面中的孤立节点 		
			1. 可以查找出页面中的循环引用		
			1. 可以查找出页面中产生内存泄露的节点
	 - 内存泄露提示工具`leak monitor`
		- `leak monitor`在安装后，当离开一个页面时，比如关闭窗口，如果页面有内存泄露，会弹出一个文本框进行即时提示。
	 - 代码压缩工具
		- YUI压缩工具
		- Dean Edwards Packer
		- JSMin
	- `Blink/Webkit`浏览器
		- 在`Blink/Webkit`浏览器中（`Chrome`, `Safari`, `Opera`），我们可以借助其中的`Developer Tools`的`Profiles`工具来对我们的程序进行内存检查。
>
				Developer Tools - Profiles
- `Node.js`中的内存检查
	- 在`Node.js`中，我们可以使用`node-heapdump`和`node-memwatch`模块进​​行内存检查。
>
			var heapdump = require('heapdump');
			var fs = require('fs');
			var path = require('path');
			fs.writeFileSync(path.join(__dirname, 'app.pid'), process.pid);
>
		在业务代码中引入`node-heapdump`之后，我们需要在某个运行时期，向`Node.js`进程发送`SIGUSR2`信号，让`node-heapdump`抓拍一份堆内存的快照。
>
			$ kill -USR2 (cat app.pid)
>
		这样在文件目录下会有一个以`heapdump-<sec>.<usec>.heapsnapshot`格式命名的快照文件，我们可以使用浏览器的`Developer Tools`中的`Profiles`工具将其打开，并进行检查。
- 分析浏览器提供的Waterfall图片来思考优化入口。
- 新的测试手段（Navigation, Resource, 和User timing。
- 
[web性能分析工具YSlow]:http://developer.yahoo.com/yslow/ "Google"
###数组专题
----------
> 
- 当需要使用数组时，可使用`JSON`格式的语法
	- 即直接使用如下语法定义数组：`[parrm,param,param...]`,而不是采用`new Array(parrm,param,param...)`这种语法。使用`JSON`格式的语法是引擎直接解释。而后者则需要调用`Array`的构造器。
- 如果需要遍历数组，应该先缓存数组长度，将数组长度放入局部变量中，避免多次查询数组长度。
	- 根据字符串、数组的长度进行循环，而通常这个长度是不变的，比如每次查询`a.length`，就要额外进行一个操作，而预先把`var len=a.length`，则每次循环就少了一次查询。

###服务端优化
----------
> 
- 避免404。
	- 更改404错误响应页面可以改进用户体验，但是同样也会浪费服务器资源。
	- 指向外部`JAVASCRIPT`的链接出现问题并返回404代码。
		- 这种加载会破坏并行加载。
		- 其次浏览器会把试图在返回的404响应内容中找到可能有用的部分当作JavaScript代码来执行。
- 删除重复的`JAVASCRIPT`和`CSS`。
	- 重复调用脚本缺点。
		- 增加额外的HTTP请求。
		- 多次运算也会浪费时间。在IE和Firefox中不管脚本是否可缓存，它们都存在重复运算`JAVASCRIPT`的问题。
- `ETags`配置`Entity`标签。
	- `ETags`用来判断浏览器缓存里的元素是否和原来服务器上的一致。
		- 与`last-modified date`相比更灵活。
			>如某个文件在1秒内修改了10次，`ETags`可以综合`Inode`(文件的索引节点`inode`数)，`MTime`(修改时间)和`Size`来精准的进行判断，避开`UNIX`记录`MTime`只能精确到秒的问题。服务器集群使用，可取后两个参数。使用`ETags`减少`Web`应用带宽和负载
- 权衡DNS查找次数
	- 减少主机名可以节省响应时间。但同时也会减少页面中并行下载的数量。
		- `IE`浏览器在同一时刻只能从同一域名下载两个文件。当在一个页面显示多张图片时，`IE`用户的图片下载速度就会受到影响。
- 通过Keep-alive机制减少TCP连接。
- 通过CDN减少延时。
- 平行处理请求（参考BigPipe）。
- 通过合并文件或者Image Sprites减少HTTP请求。
- 减少重定向（ HTTP 301和40x/50x）。
###类型转换专题
----------
> 
- 把数字转换成字符串。
	- 应用`""+1`，效率是最高。
		- 性能上来说：`""+字符串`>`String()`>`.toString()`>`new String()`。
			- `String()`属于内部函数，所以速度很快。
			- `.toString()`要查询原型中的函数，所以速度略慢。
			- `new String()`最慢。
- 浮点数转换成整型。
	- 错误使用使用`parseInt()`。
		- `parseInt()`是用于将`字符串`转换成`数字`，而不是`浮点数`和`整型`之间的转换。
	- 应该使用`Math.floor()`或者`Math.round()`。
		- `Math`是内部对象，所以`Math.floor()`其实并没有多少查询方法和调用的时间，速度是最快的。

###运算符专题
----------
> 
- 使用运算符时，尽量使用`+＝`，`－＝`、`*＝`、`\=`等运算符号，而不是直接进行赋值运算。
- `位运算`。
	- 当进行数学运算时`位运算`较快，`位运算`操作要比任何`布尔运算`或`算数运算`快，如`取模`，`逻辑与`和`逻辑或`也可以考虑用`位运算`来替换。
###逻辑判断优化
----------
> 
- `switch`语句。
	- 若有一系列复杂的`if-else`语句，可以转换成单个`switch`语句则可以得到更快的代码，还可以通过将`case`语句按照最可能的到最不可能的顺序进行组织，来进一步优化。
	>
###重绘专题
----------
> 
- 减少页面的`重绘`。
	- 减少页面`重绘`虽然本质不是`JAVASCRIPT`优化，但`重绘`往往是由`JAVASCRIPT`引起的，而`重绘`的情况直接影响页面性能。
>
			var str = "<div>这是一个测试字符串</div>";
			/**效率低**/
		    var obj = document.getElementsByTagName("body");
		    for(var i = 0; i < 100; i++){
		        obj.innerHTML += str + i;
		    }
			/**效率高**/
		    var obj = document.getElementsByTagName("body");
		    var arr = [];
		    for(var i = 0; i < 100; i++){
		        arr[i] = str + i;
		    }
		    obj.innerHTML = arr.join("");
>
	一般影响页面重绘的不仅仅是innerHTML，如果改变元素的样式，位置等情况都会触发页面重绘，所以在平时一定要注意这点。
- 使用HTML5和CSS3的一些新特性。
- 避免在HTML里面缩放图片。
- 避免使用插件。
- 确保使用正确的字体大小。
- 决定当前页面是不是能被访问。


收集于:[kahn1990/web_performance_optimization](https://github.com/kahn1990/web_performance_optimization)
