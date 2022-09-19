import{_ as s,o as e,c as a,d as o}from"./app.a57ef9df.js";const _=JSON.parse('{"title":"getRoutes","description":"","frontmatter":{},"headers":[],"relativePath":"vue-router/getRoutes.md"}'),t={name:"vue-router/getRoutes.md"},n=o(`<h1 id="getroutes" tabindex="-1">getRoutes <a class="header-anchor" href="#getroutes" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u83B7\u53D6\u6807\u51C6\u5316\u540E\u7684\u8DEF\u7531\u5217\u8868</p></div><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">getRoutes</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u904D\u5386matchers\uFF0CrouteMatcher.record\u4E2D\u5B58\u50A8\u7740\u8DEF\u7531\u7684\u6807\u51C6\u5316\u7248\u672C</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">matcher</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getRoutes</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">map</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">routeMatcher</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">routeMatcher</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">record</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u5728\u6DFB\u52A0\u8DEF\u7531\u7684\u8FC7\u7A0B\u4E2D\uFF0C\u4F1A\u5BF9\u8DEF\u7531\u8FDB\u884C\u6807\u51C6\u5316\uFF0C\u5E76\u751F\u6210\u5BF9\u5E94\u7684\u7684<code>matcher</code>\uFF0C\u5C06\u5176\u6DFB\u52A0\u81F3<code>matchers</code>\u4E2D\uFF0C\u6700\u540E\u5C06\u8DEF\u7531\u6807\u51C6\u5316\u7684\u7248\u672C\u4F5C\u4E3A<code>record</code>\u5C5E\u6027\u6DFB\u52A0\u5230<code>matcher</code>\u4E2D\u3002</p>`,4),p=[n];function c(l,r,d,i,y,u){return e(),a("div",null,p)}const D=s(t,[["render",c]]);export{_ as __pageData,D as default};