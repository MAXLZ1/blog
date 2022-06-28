import{_ as s,c as n,o as a,d as l}from"./app.e652fc7f.js";const A='{"title":"mapStores","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F7F\u7528","slug":"\u4F7F\u7528"},{"level":2,"title":"\u6E90\u7801\u5206\u6790","slug":"\u6E90\u7801\u5206\u6790"}],"relativePath":"pinia/mapStores.md"}',p={},o=l(`<h1 id="mapstores" tabindex="-1">mapStores <a class="header-anchor" href="#mapstores" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u4F7F\u7528<code>mapStore</code>\u83B7\u53D6\u5B8C\u6574\u7684<code>store</code>\u3002</p></div><h2 id="\u4F7F\u7528" tabindex="-1">\u4F7F\u7528 <a class="header-anchor" href="#\u4F7F\u7528" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">mapStores</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">pinia</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> useUserStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineStore</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">user</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// ...</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> useCartStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineStore</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">cart</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// ...</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">computed</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">...</span><span style="color:#82AAFF;">mapStores</span><span style="color:#A6ACCD;">(useCartStore</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> useUserStore)</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">methods</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">async</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">buyStuff</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">isAuthenticated</span><span style="color:#F07178;">()) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">cartStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">buy</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="\u6E90\u7801\u5206\u6790" tabindex="-1">\u6E90\u7801\u5206\u6790 <a class="header-anchor" href="#\u6E90\u7801\u5206\u6790" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">mapStores</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Stores</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">&gt;(</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">stores</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">...</span><span style="color:#FFCB6B;">Stores</span><span style="color:#A6ACCD;">]</span></span>
<span class="line"><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">_Spread</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Stores</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u5982\u679C\u63A5\u6536\u7684\u662F\u4E2A\u6570\u7EC4\u53C2\u6570\uFF0C\u8FDB\u884C\u63D0\u793A</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">__DEV__</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Array</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">isArray</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">stores</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">])) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">warn</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">[\u{1F34D}]: Directly pass all stores to &quot;mapStores()&quot; without putting them in an array:</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">\`</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">Replace</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">\`</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">\`</span><span style="color:#A6ACCD;">\\t</span><span style="color:#C3E88D;">mapStores([useAuthStore, useCartStore])</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">\`</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">with</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">\`</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">\`</span><span style="color:#A6ACCD;">\\t</span><span style="color:#C3E88D;">mapStores(useAuthStore, useCartStore)</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">\`</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">This will fail in production if not fixed.</span><span style="color:#89DDFF;">\`</span></span>
<span class="line"><span style="color:#F07178;">    )</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// \u5F00\u53D1\u73AF\u5883\u4E0Bstores\u53D6\u7B2C\u4E00\u4E2A\u503C</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">stores</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">stores</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">]</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u8FD4\u56DE\u4E00\u4E2A\u5BF9\u8C61</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">stores</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">reduce</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">reduced</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">useStore</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// reduced\u7684key\u503C\uFF1AuseStore.$id + mapStoreSuffix(\u9ED8\u8BA4Store\uFF0C\u53EF\u4F7F\u7528setMapStoreSuffix\u8FDB\u884C\u4FEE\u6539)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">reduced</span><span style="color:#F07178;">[</span><span style="color:#A6ACCD;">useStore</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">$id</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">mapStoreSuffix</span><span style="color:#F07178;">] </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">this:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">ComponentPublicInstance</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// \u4F7F\u7528useStore\u83B7\u53D6store\uFF0C\u5728\u7EC4\u4EF6\u4E2D\u53EF\u901A\u8FC7this.$pinia\u83B7\u53D6pinia</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">useStore</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">$pinia</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">reduced</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">_Spread</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Stores</span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p><code>mapStores</code>\u53EF\u63A5\u6536\u591A\u4E2A<code>useStore</code>\u51FD\u6570\u3002</p><p><code>mapStores</code>\u4F1A\u5BF9\u53C2\u6570\u8FDB\u884C\u6821\u9A8C\uFF0C\u5982\u679C\u4F20\u5165\u7684\u7B2C\u4E00\u4E2A\u53C2\u6570\u4E3A\u6570\u7EC4\uFF0C\u90A3\u4E48\u5728\u5F00\u53D1\u73AF\u5883\u4E0B\u4F1A\u8FDB\u884C\u63D0\u793A\uFF0C\u5E76\u5C06\u6570\u7EC4\u4E2D\u7684\u7B2C\u4E00\u4E2A\u503C\u8D4B\u7ED9<code>stores</code>\uFF0C\u4EE5\u4FDD\u8BC1\u5F00\u53D1\u73AF\u5883\u4E0B\u80FD\u591F\u8FD0\u884C\u3002\u7136\u540E\u8FD4\u56DE\u4E00\u4E2A\u5BF9\u8C61\uFF0C\u8BE5\u5BF9\u8C61\u901A\u8FC7<code>stores.reduce</code>\u751F\u6210\uFF0C\u5BF9\u8C61\u7684<code>key</code>\u503C\u662F\u7531<code>useStore.$id + mapStoreSuffix</code>\u7EC4\u6210\uFF0C\u5BF9\u5E94\u7684<code>value</code>\u662F\u4E2A\u51FD\u6570\uFF0C\u5728\u51FD\u6570\u4E2D\u4F1A\u8C03\u7528<code>useStore(this.$pinia)</code>\uFF0C\u8FD4\u56DE\u5176\u7ED3\u679C\u3002</p>`,8),e=[o];function t(c,r,F,y,D,i){return a(),n("div",null,e)}var d=s(p,[["render",t]]);export{A as __pageData,d as default};
