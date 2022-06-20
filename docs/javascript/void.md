# void

之前在看`vue3`源码过程中，碰到某些分支判断`undefined`时，会使用`key !== void 0`的方式进行判断，而不是`key !== undefined`。那么为什么使用`void 0`，而不是`undefined`呢？在回答这个问题前，我们先看下`undefined`与`void`：

## undefined

MDN：[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)

`undefined`是`JavaScript`的基本数据类型之一。它是全局对象`window`的一个属性。自`ECMAscript5`标准以来`undefined`是一个不能被配置，不能被重写的属性。也就是说在全局作用域无法更改`undefined`。

```js
undefined = 'test'
consle.log(undefined) // undefined
```

但在局部作用域下，`undefined`是可以被修改的:

```js
(function print() {
  var undefined = 1
  console.log(undefined, typeof undefined) // 1, 'numbder'
})()
```

在局部作用域中`undefined`被当做成一个变量，可以对其随意修改。

如果一个函数没有返回值，那么它会返回一个`undefined`。

```js
function print(x) {
  console.log(x)
}

const res = print(1)

console.log(res) // undefined
```

## void

MDN：[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)

语法：`void expression`

`void`运算符后面的表达式会被执行，并且`void`总是返回`undefined`。

```js
console.log(void '') // undefined
console.log(void 0) // undefined
console.log(void true) // undefined
console.log(void {}) // undefined
console.log(void function(){}) // undefined


void function (){
  console.log('test') // 打印test
}()

void (1+1) // undefined
void 1+1 // NaN
```

`void`运算符的优先级要高于`+`，所以在`void 1+1`中会先计算`void 1`，返回`undefined`，然后`+1`，`undefined+1=NaN`

`void`运算符的几种用法：

- 立即调用的函数表达式：
```js
// 常规的IIFE
(function test() {
  // ...
})()

// 使用void
void function test() {
  
}()
```
使用`void`后，`function`会被识别为函数表达式而不是函数声明语句
- Javascript URIs：用以下方式，将`a`标签点击无响应。
```html
<a href="javascript: void(0)">
  DEMO
</a>
```
- 在箭头函数中避免泄漏
```js
button.onclick = () => void doSomething();
```
当`doSomething`的返回值发生变化后，不会改变`onclick`的行为。

综上可以看出`void 0 `相比较`undefined`的优势：

1. 不必担心`undefined`被修改。
2. 字符更短，节省字节。
3. 一些压缩工具会将`undefined`转为`void 0`，使用`void 0`会加快压缩速度。
