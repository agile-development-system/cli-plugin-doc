## Classes

<dl>
<dt><a href="#A">A</a></dt>
<dd><p>aaa</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#sayHello">sayHello([somebody])</a></dt>
<dd></dd>
<dt><a href="#sum">sum(...num)</a></dt>
<dd><p>Returns the sum of all numbers passed to the function.</p>
</dd>
<dt><a href="#doSomethingAsynchronously">doSomethingAsynchronously(cb)</a></dt>
<dd><p>Does something asynchronously and executes the callback on completion.</p>
</dd>
<dt><a href="#fn3">fn3(p0, p1, [p2], [p3], [p4])</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#myFunction">myFunction()</a></dt>
<dd><p>See <a href="MyClass">MyClass</a> and <a href="MyClass#foo">MyClass&#39;s foo property</a>.
Also, check out <a href="http://www.google.com">Google</a> and</p>
</dd>
<dt><a href="#foo">foo()</a></dt>
<dd><p>Both of these will link to the bar function.</p>
</dd>
<dt><a href="#bar">bar()</a></dt>
<dd></dd>
<dt><a href="#method1">method1()</a> ⇒ <code>Number</code></dt>
<dd><p>Solves equations of the form a * x = b</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#requestCallback">requestCallback</a> : <code>function</code></dt>
<dd><p>This callback type is called <code>requestCallback</code>
and is displayed as a global symbol.</p>
</dd>
</dl>

## External

<dl>
<dt><a href="#external_jQuery.fn">jQuery.fn</a></dt>
<dd><p>The jQuery plugin namespace.</p>
</dd>
</dl>

<a name="A"></a>

## A
aaa

**Kind**: global class  
<a name="A.fn"></a>

### A.fn(p0, p1, [p2], [p3], [p4]) ⇒ <code>string</code>
**Kind**: static method of [<code>A</code>](#A)  
**Returns**: <code>string</code> - This is the result  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| p0 | <code>string</code> |  | A string param declared using TS-style |
| p1 | <code>string</code> |  | A string param. |
| [p2] | <code>string</code> |  | An optional param |
| [p3] | <code>string</code> |  | Another optional param. |
| [p4] | <code>string</code> | <code>&quot;test&quot;</code> | An optional param with a default value |

<a name="sayHello"></a>

## sayHello([somebody])
**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [somebody] | <code>string</code> | <code>&quot;John Doe&quot;</code> | Somebody's name. |

<a name="sum"></a>

## sum(...num)
Returns the sum of all numbers passed to the function.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| ...num | <code>number</code> | A positive or negative number. |

<a name="doSomethingAsynchronously"></a>

## doSomethingAsynchronously(cb)
Does something asynchronously and executes the callback on completion.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| cb | [<code>requestCallback</code>](#requestCallback) | The callback that handles the response. |

<a name="fn3"></a>

## fn3(p0, p1, [p2], [p3], [p4]) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - This is the result  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| p0 | <code>string</code> |  | A string param declared using TS-style |
| p1 | <code>string</code> |  | A string param. |
| [p2] | <code>string</code> |  | An optional param |
| [p3] | <code>string</code> |  | Another optional param. |
| [p4] | <code>string</code> | <code>&quot;test&quot;</code> | An optional param with a default value |

<a name="myFunction"></a>

## myFunction()
See [MyClass](MyClass) and [MyClass's foo property](MyClass#foo).
Also, check out [Google](http://www.google.com) and

**Kind**: global function  
<a name="foo"></a>

## foo()
Both of these will link to the bar function.

**Kind**: global function  
**See**

- [bar](#bar)
- bar

<a name="bar"></a>

## bar()
**Kind**: global function  
**See**

- [foo](#foo) for further information.
- [GitHub](http://github.com)

<a name="method1"></a>

## method1() ⇒ <code>Number</code>
Solves equations of the form a * x = b

**Kind**: global function  
**Returns**: <code>Number</code> - Returns the value of x for the equation.  
**Example** *(Example usage of method1.)*  
```js
// returns 2
globalNS.method1(5, 10);
```
<a name="requestCallback"></a>

## requestCallback : <code>function</code>
This callback type is called `requestCallback`
and is displayed as a global symbol.

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| responseCode | <code>number</code> | 
| responseMessage | <code>string</code> | 

<a name="external_jQuery.fn"></a>

## jQuery.fn
The jQuery plugin namespace.

**Kind**: global external  
**See**: [jQuery Plugins](http://learn.jquery.com/plugins/)  
<a name="external_jQuery.fn.starfairy"></a>

### jQuery.fn.starfairy()
A jQuery plugin to make stars fly around your home page.

**Kind**: static method of [<code>jQuery.fn</code>](#external_jQuery.fn)  
