import{_ as s,c as n,o as a,d as l}from"./app.e652fc7f.js";const i='{"title":"createRouter","description":"","frontmatter":{},"headers":[],"relativePath":"vue-router/createRouter.md"}',o={},p=l(`<h1 id="createrouter" tabindex="-1">createRouter <a class="header-anchor" href="#createrouter" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u521B\u5EFA\u4E00\u4E2A\u53EF\u4EE5\u88AB Vue \u5E94\u7528\u7A0B\u5E8F\u4F7F\u7528\u7684\u8DEF\u7531\u5B9E\u4F8B\u3002</p><p>\u6587\u4EF6\u4F4D\u7F6E\uFF1A<code>src/router.ts</code></p></div><p>\u9996\u5148\u6211\u4EEC\u5148\u770B<code>createRouter</code>\u6240\u63A5\u53D7\u7684\u53C2\u6570\uFF1A\u4E00\u4E2A<code>RouterOptions</code>\u7C7B\u578B\u7684<code>options</code>\u3002</p><div class="language-ts"><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">RouterOptions</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">PathParserOptions</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u7528\u4E8E\u8DEF\u7531\u5B9E\u73B0\u5386\u53F2\u8BB0\u5F55\uFF0C\u53EF\u4F7F\u7528createWebHistory\u3001createWebHashHistory\u3001createMemoryHistory\u8FDB\u884C\u521B\u5EFA</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">history</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">RouterHistory</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u9700\u8981\u6CE8\u518C\u7684\u8DEF\u7531\u8868</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">routes</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">RouteRecordRaw</span><span style="color:#A6ACCD;">[]</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u5728\u9875\u9762\u4E4B\u95F4\u5BFC\u822A\u65F6\u63A7\u5236\u6EDA\u52A8\u7684\u51FD\u6570</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">scrollBehavior</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">RouterScrollBehavior</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u7528\u4E8E\u81EA\u5B9A\u4E49\u5982\u4F55\u89E3\u6790\u67E5\u8BE2</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">parseQuery</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">typeof</span><span style="color:#A6ACCD;"> originalParseQuery</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u7528\u4E8E\u81EA\u5B9A\u4E49\u67E5\u8BE2\u5BF9\u8C61\u5982\u4F55\u8F6C\u4E3A\u5B57\u7B26\u4E32</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">stringifyQuery</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">typeof</span><span style="color:#A6ACCD;"> originalStringifyQuery</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u6FC0\u6D3BRouterLink\u7684\u9ED8\u8BA4\u7C7B</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">linkActiveClass</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u7CBE\u51C6\u6FC0\u6D3BRouterLink\u7684\u9ED8\u8BA4\u7C7B</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">linkExactActiveClass</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u53EF\u4EE5\u770B\u5230<code>RouterOptions</code>\u7EE7\u627F\u4E86<code>PathParserOptions</code>\uFF0C\u90A3\u4E48\u8BF4\u660E<code>PathParserOptions</code>\u8FD8\u6709\u4E9B\u914D\u7F6E\uFF1A</p><div class="language-ts"><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">_PathParserOptions</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u4F7F\u7528\u6B63\u5219\u65F6\u533A\u5206\u5927\u5C0F\u5199\uFF0C\u9ED8\u8BA4false</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">sensitive</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">boolean</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u662F\u5426\u7981\u6B62\u5C3E\u968F\u659C\u6760\uFF0C\u9ED8\u8BA4false</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">strict</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">boolean</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u6B63\u5219\u8868\u8FBE\u5F0F\u524D\u5E94\u8BE5\u52A0^\uFF0C\u9ED8\u8BA4true</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">start</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">boolean</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u6B63\u5219\u8868\u8FBE\u5F0F\u4EE5$\u7ED3\u5C3E\uFF0C\u9ED8\u8BA4\u4E3Atrue</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">end</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">boolean</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">PathParserOptions</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Pick</span><span style="color:#89DDFF;">&lt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">_PathParserOptions</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">end</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">sensitive</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">strict</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>\u770B\u5B8C<code>createRouter</code>\u7684\u53C2\u6570\uFF0C\u6211\u4EEC\u6765\u770B\u4E0B<code>createRouter</code>\u5177\u4F53\u505A\u4E86\u4EC0\u4E48\u3002<code>createRouter</code>\u65B9\u6CD5\u5171885\uFF08\u5305\u542B\u7A7A\u884C\uFF09\u884C\uFF0C\u4E4D\u4E00\u770B\u53EF\u80FD\u4F1A\u89C9\u5F97\u65B9\u6CD5\u5F88\u590D\u6742\uFF0C\u4ED4\u7EC6\u89C2\u5BDF\uFF0C\u5176\u5B9E\u5F88\u5927\u4E00\u90E8\u5206\u4EE3\u7801\u90FD\u662F\u58F0\u660E\u4E00\u4E9B\u51FD\u6570\u3002\u6211\u4EEC\u53EF\u4EE5\u5148\u6682\u65F6\u629B\u5F00\u8FD9\u4E9B\u51FD\u6570\u58F0\u660E\u770B\u5176\u4F59\u90E8\u5206\u3002</p><p>\u9996\u5148\u4F1A\u4F7F\u7528<code>createRouterMatcher</code>\u65B9\u6CD5\u521B\u5EFA\u4E86\u4E00\u4E2A\u8DEF\u7531\u5339\u914D\u5668<code>matcher</code>\uFF0C\u4ECE<code>options</code>\u4E2D\u63D0\u53D6<code>parseQuery</code>\u3001<code>stringifyQuery</code>\u3001<code>history</code>\u5C5E\u6027\uFF0C\u5982\u679C<code>options</code>\u4E2D\u6CA1\u6709<code>history</code>\uFF0C\u629B\u51FA\u9519\u8BEF\u3002</p><div class="language-ts"><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> matcher </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">createRouterMatcher</span><span style="color:#A6ACCD;">(options</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">routes</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> options)</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> parseQuery </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> options</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">parseQuery </span><span style="color:#89DDFF;">||</span><span style="color:#A6ACCD;"> originalParseQuery</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> stringifyQuery </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> options</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">stringifyQuery </span><span style="color:#89DDFF;">||</span><span style="color:#A6ACCD;"> originalStringifyQuery</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> routerHistory </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> options</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">history</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> (__DEV__ </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">!</span><span style="color:#A6ACCD;">routerHistory)</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;font-style:italic;">throw</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Error</span><span style="color:#A6ACCD;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Provide the &quot;history&quot; option when calling &quot;createRouter()&quot;:</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">+</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;"> https://next.router.vuejs.org/api/#history.</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">  )</span></span>
<span class="line"></span></code></pre></div><p>\u7D27\u63A5\u7740\u58F0\u660E\u4E86\u4E00\u4E9B\u5168\u5C40\u5B88\u536B\u76F8\u5173\u7684\u53D8\u91CF\uFF0C\u548C\u4E00\u4E9B\u5173\u4E8E<code>params</code>\u7684\u5904\u7406\u65B9\u6CD5\uFF0C\u5176\u4E2D\u6709\u5173\u5168\u5C40\u5B88\u536B\u7684\u53D8\u91CF\u90FD\u662F\u901A\u8FC7<code>useCallbacks</code>\u521B\u5EFA\u7684\uFF0C<code>params</code>\u76F8\u5173\u65B9\u6CD5\u901A\u8FC7<code>applyToParams</code>\u521B\u5EFA\u3002</p><div class="language-ts"><pre><code><span class="line"><span style="color:#676E95;font-style:italic;">// \u5168\u5C40\u524D\u7F6E\u5B88\u536B\u76F8\u5173\u65B9\u6CD5</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> beforeGuards </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useCallbacks</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">NavigationGuardWithThis</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">undefined</span><span style="color:#89DDFF;">&gt;&gt;</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// \u5168\u5C40\u89E3\u6790\u5B88\u536B\u76F8\u5173\u65B9\u6CD5</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> beforeResolveGuards </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useCallbacks</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">NavigationGuardWithThis</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">undefined</span><span style="color:#89DDFF;">&gt;&gt;</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// \u5168\u5C40\u540E\u7F6E\u94A9\u5B50\u65B9\u6CD5</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> afterGuards </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useCallbacks</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">NavigationHookAfter</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// \u5F53\u524D\u8DEF\u7531\uFF0C\u6D45\u5C42\u54CD\u5E94\u5F0F\u5BF9\u8C61</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> currentRoute </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">shallowRef</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">RouteLocationNormalizedLoaded</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">  START_LOCATION_NORMALIZED</span></span>
<span class="line"><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#C792EA;">let</span><span style="color:#A6ACCD;"> pendingLocation</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">RouteLocation</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> START_LOCATION_NORMALIZED</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// \u5982\u679C\u6D4F\u89C8\u5668\u73AF\u5883\u4E0B\u8BBE\u7F6E\u4E86scrollBehavior\uFF0C\u90A3\u4E48\u9700\u8981\u9632\u6B62\u9875\u9762\u81EA\u52A8\u6062\u590D\u9875\u9762\u4F4D\u7F6E</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// https://developer.mozilla.org/zh-CN/docs/Web/API/History/scrollRestoration</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> (isBrowser </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> options</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">scrollBehavior </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">scrollRestoration</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">in</span><span style="color:#A6ACCD;"> history) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">history</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">scrollRestoration</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">manual</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// \u6807\u51C6\u5316params\uFF0C\u8F6C\u5B57\u7B26\u4E32</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> normalizeParams </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> applyToParams</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">bind</span><span style="color:#A6ACCD;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">null,</span></span>
<span class="line"><span style="color:#A6ACCD;">  paramValue </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">+</span><span style="color:#A6ACCD;"> paramValue</span></span>
<span class="line"><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// \u7F16\u7801param</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> encodeParams </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> applyToParams</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">bind</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">null,</span><span style="color:#A6ACCD;"> encodeParam)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// \u89E3\u7801params</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> decodeParams</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">params</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">RouteParams</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">undefined</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">RouteParams</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span></span>
<span class="line"><span style="color:#A6ACCD;">  applyToParams</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">bind</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">null,</span><span style="color:#A6ACCD;"> decode)</span></span>
<span class="line"></span></code></pre></div><p>\u5173\u4E8E<code>useCallbacks</code>\u7684\u5B9E\u73B0\uFF1A\u5728<code>useCallbacks</code>\u4E2D\u58F0\u660E\u4E00\u4E2A<code>handlers</code>\u6570\u7EC4\u7528\u6765\u4FDD\u5B58\u6240\u6709\u6DFB\u52A0\u7684\u65B9\u6CD5\uFF0C<code>useCallbacks</code>\u7684\u8FD4\u56DE\u503C\u4E2D\u5305\u62EC\u4E09\u4E2A\u65B9\u6CD5\uFF1A<code>add</code>\uFF08\u6DFB\u52A0\u4E00\u4E2A<code>handler</code>\uFF0C\u5E76\u8FD4\u56DE\u4E00\u4E2A\u5220\u9664<code>handler</code>\u7684\u51FD\u6570\uFF09\u3001<code>list</code>\uFF08\u8FD4\u56DE\u6240\u6709<code>handler</code>\uFF09\u3001<code>reset</code>\uFF08\u6E05\u7A7A\u6240\u6709<code>handler</code>\uFF09</p><div class="language-ts"><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useCallbacks</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">T</span><span style="color:#89DDFF;">&gt;()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">let</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">handlers</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">T</span><span style="color:#F07178;">[] </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">add</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">handler</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">T</span><span style="color:#89DDFF;">):</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">void</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">handlers</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">push</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">handler</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">handlers</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">indexOf</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">handler</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">) </span><span style="color:#A6ACCD;">handlers</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">splice</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">i</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">reset</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">handlers</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> []</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">add</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">list</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">handlers</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">reset</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p><code>applyToParams</code>\u7684\u5B9E\u73B0\uFF1A\u63A5\u6536\u4E00\u4E2A\u5904\u7406\u51FD\u6570\u548C<code>params</code>\u5BF9\u8C61\uFF0C\u904D\u5386<code>params</code>\u5BF9\u8C61\uFF0C\u5E76\u5BF9\u6BCF\u4E00\u4E2A\u5C5E\u6027\u503C\u6267\u884C<code>fn</code>\u5E76\u5C06\u7ED3\u679C\u8D4B\u7ED9\u4E00\u4E2A\u65B0\u7684\u5BF9\u8C61\u3002</p><div class="language-ts"><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">applyToParams</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">fn</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">v</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">null</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">undefined</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  params</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">RouteParamsRaw</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">undefined</span></span>
<span class="line"><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">RouteParams</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">newParams</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">RouteParams</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#F07178;"> (</span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">in</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">params</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">params</span><span style="color:#F07178;">[</span><span style="color:#A6ACCD;">key</span><span style="color:#F07178;">]</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">newParams</span><span style="color:#F07178;">[</span><span style="color:#A6ACCD;">key</span><span style="color:#F07178;">] </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Array</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">isArray</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">?</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">map</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">fn</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">fn</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">newParams</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u7136\u540E\u58F0\u660E\u4E86\u5927\u91CF\u7684\u51FD\u6570\uFF0C\u5305\u62EC<code>addRoute</code>\u3001<code>removeRoute</code>\u3001<code>getRoutes</code>\u7B49\uFF0C\u8FD9\u4E9B\u51FD\u6570\u4E5F\u5C31\u662F\u6211\u4EEC\u65E5\u5E38\u4F7F\u7528\u7684<code>addRoute</code>\u3001<code>removeRoute</code>\u7B49\u3002</p><p>\u5728<code>createRouter</code>\u7684\u6700\u540E\u521B\u5EFA\u4E86\u4E00\u4E2A<code>router</code>\u5BF9\u8C61\uFF0C\u5E76\u5C06\u5176\u8FD4\u56DE\uFF0C\u8BE5\u5BF9\u8C61\u51E0\u4E4E\u5305\u542B\u4E86\u58F0\u660E\u7684\u6240\u6709\u51FD\u6570\u3002</p><p><strong>\u603B\u7ED3</strong></p><p><code>createRouter</code>\u51FD\u6570\u4E2D\u58F0\u660E\u4E86\u5F88\u591A\u51FD\u6570\uFF0C\u8FD9\u4E9B\u51FD\u6570\u5C31\u662F\u6211\u4EEC\u65E5\u5E38\u4F7F\u7528\u7684\u4E00\u4E9B\u65B9\u6CD5\uFF0C\u5982<code>addRoute</code>\u3001<code>removeRoute</code>\u7B49\uFF0C\u5728\u51FD\u6570\u7684\u6700\u540E\uFF0C\u58F0\u660E\u4E86\u4E00\u4E2A<code>router</code>\u5BF9\u8C61\uFF0C\u524D\u9762\u6240\u58F0\u660E\u7684\u51FD\u6570\u591A\u6570\u90FD\u4F1A\u88AB\u5305\u542B\u5728\u8FD9\u4E2A\u5BF9\u8C61\u91CC\uFF0C\u6700\u7EC8\u4F1A\u5C06<code>router</code>\u8FD4\u56DE\u3002\u5728<code>router</code>\u4E2D\u6709\u4E2A\u91CD\u8981\u7684<code>install</code>\u65B9\u6CD5\uFF0C\u5728<code>Vue</code>\u4E2D\u4F7F\u7528<code>vue-router</code>\u65F6\uFF0C\u4F1A\u8C03\u7528\u8FD9\u4E2A\u65B9\u6CD5\uFF0C\u5728<code>install</code>\u4E2D\u5176\u4E2D\u6700\u91CD\u8981\u7684\u64CD\u4F5C\u4E4B\u4E00\uFF0C\u5C31\u662F\u5C06<code>router</code>\u548C<code>currentRoute</code>\u6CE8\u5165\u7ED9<code>app</code>\u5B9E\u4F8B\uFF0C\u8FD9\u6837\u6211\u4EEC\u5C31\u53EF\u4EE5\u5728<code>vue</code>\u5B9E\u4F8B\u4E2D\u901A\u8FC7<code>inject</code>\u83B7\u53D6\u8FD9\u4E24\u4E2A\u5BF9\u8C61\uFF08<code>useRouter</code>\u548C<code>useRoute</code>\u7684\u5B9E\u73B0\uFF09\u3002 \u5173\u4E8E<code>install</code>\u7684\u8FC7\u7A0B\u53EF\u53C2\u8003\uFF1A<a href="https://maxlz1.github.io/blog/vue-router/router-install.html" target="_blank" rel="noopener noreferrer">app.use(router)</a></p>`,19),e=[p];function t(c,r,y,F,D,C){return a(),n("div",null,e)}var d=s(o,[["render",t]]);export{i as __pageData,d as default};
