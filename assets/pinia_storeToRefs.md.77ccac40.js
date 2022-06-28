import{_ as s,c as n,o as a,d as l}from"./app.e652fc7f.js";const A='{"title":"storeToRefs","description":"","frontmatter":{},"headers":[],"relativePath":"pinia/storeToRefs.md"}',o={},p=l(`<h1 id="storetorefs" tabindex="-1">storeToRefs <a class="header-anchor" href="#storetorefs" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p><code>storeToRefs</code>\u4E0E<code>toRefs</code>\u7C7B\u4F3C\uFF0C\u4E0D\u8FC7<code>storeToRefs</code>\u4F1A\u5FFD\u7565\u65B9\u6CD5\u53CA\u975E\u54CD\u5E94\u5F0F\u5BF9\u8C61\u3002</p></div><div class="language-ts"><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">storeToRefs</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">SS</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">StoreGeneric</span><span style="color:#89DDFF;">&gt;(</span></span>
<span class="line"><span style="color:#A6ACCD;">  store</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">SS</span></span>
<span class="line"><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ToRefs</span><span style="color:#89DDFF;">&lt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">StoreState</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">SS</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">StoreGetters</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">SS</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">PiniaCustomStateProperties</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">StoreState</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">SS</span><span style="color:#89DDFF;">&gt;&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// See https://github.com/vuejs/pinia/issues/852</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// It&#39;s easier to just use toRefs() even if it includes more stuff</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">isVue2</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// \u5982\u679C\u662Fvue2\u76F4\u63A5\u8FD4\u56DEtoRefs(store)\uFF0C\u5C3D\u7BA1\u5176\u4E2D\u5305\u542B\u5F88\u591Amethods</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">toRefs</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">store</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">else</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// \u975Evue2\u73AF\u5883\uFF0C\u4F1A\u8FC7\u6EE4store\u4E2D\u7684\u975Eref\u6216reactive\u5BF9\u8C61</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// store\u7684\u539F\u59CB\u5BF9\u8C61</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">store</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">toRaw</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">store</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">refs</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">ToRefs</span><span style="color:#89DDFF;">&lt;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#FFCB6B;">StoreState</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">SS</span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#FFCB6B;">StoreGetters</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">SS</span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#FFCB6B;">PiniaCustomStateProperties</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">StoreState</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">SS</span><span style="color:#89DDFF;">&gt;&gt;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#F07178;"> (</span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">in</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">store</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">store</span><span style="color:#F07178;">[</span><span style="color:#A6ACCD;">key</span><span style="color:#F07178;">]</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#82AAFF;">isRef</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">||</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">isReactive</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;">)) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// \u4F7F\u7528toRef\u83B7\u53D6\u4E00\u4E2A\u65B0\u7684ref</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">refs</span><span style="color:#F07178;">[</span><span style="color:#A6ACCD;">key</span><span style="color:#F07178;">] </span><span style="color:#89DDFF;">=</span></span>
<span class="line"><span style="color:#89DDFF;">          </span><span style="color:#676E95;font-style:italic;">// ---</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#82AAFF;">toRef</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">store</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">refs</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,3),e=[p];function t(c,r,F,y,D,i){return a(),n("div",null,e)}var f=s(o,[["render",t]]);export{A as __pageData,f as default};
