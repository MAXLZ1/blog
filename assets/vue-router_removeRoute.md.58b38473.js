import{_ as s,c as a,o,d as e}from"./app.e652fc7f.js";var n="/blog/assets/removeRoute.b5dfb474.png";const A='{"title":"removeRoute","description":"","frontmatter":{},"headers":[],"relativePath":"vue-router/removeRoute.md"}',l={},p=e(`<h1 id="removeroute" tabindex="-1">removeRoute <a class="header-anchor" href="#removeroute" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u901A\u8FC7\u540D\u79F0\u5220\u9664\u73B0\u6709\u8DEF\u7531</p></div><p><code>removeRoute</code>\u63A5\u6536\u4E00\u4E2A<code>name</code>\uFF08\u73B0\u6709\u8DEF\u7531\u540D\u79F0\uFF09\u5C5E\u6027\u3002</p><div class="language-ts"><pre><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">removeRoute</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">RouteRecordName</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u6839\u636Ename\u83B7\u53D6\u5BF9\u5E94\u7684routeRecordMatcher</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">recordMatcher</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">matcher</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getRecordMatcher</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">name</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">recordMatcher</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// \u5982\u679C\u5B58\u5728recordMatcher\uFF0C\u8C03\u7528matcher.removeRoute</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">matcher</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">removeRoute</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">recordMatcher</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">else</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">__DEV__</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">warn</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">Cannot remove non-existent route &quot;</span><span style="color:#89DDFF;">\${</span><span style="color:#FFCB6B;">String</span><span style="color:#A6ACCD;">(name)</span><span style="color:#89DDFF;">}</span><span style="color:#C3E88D;">&quot;</span><span style="color:#89DDFF;">\`</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u5BF9\u4E8E<code>matcher.removeRoute</code>\uFF0C\u53C2\u8003<a href="https://maxlz1.github.io/blog/vue-router/routerMatcher.html#removeroute" target="_blank" rel="noopener noreferrer">matcher.removeRoute</a></p><p><code>removeRoute</code>\u6D41\u7A0B\uFF1A</p><p><img src="`+n+'" alt=""></p>',7),t=[p];function r(c,F,y,D,i,d){return o(),a("div",null,t)}var u=s(l,[["render",r]]);export{A as __pageData,u as default};