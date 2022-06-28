import{_ as s,c as n,o as a,d as l}from"./app.e652fc7f.js";const i='{"title":"readonly","description":"","frontmatter":{},"headers":[],"relativePath":"vue3-analysis/reactive/readonly.md"}',p={},o=l(`<h1 id="readonly" tabindex="-1">readonly <a class="header-anchor" href="#readonly" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u63A5\u6536\u4E00\u4E2A\u5BF9\u8C61\uFF08\u54CD\u5E94\u5F0F\u6216\u7EAF\u5BF9\u8C61\uFF09\u6216<code>ref</code>\u5E76\u8FD4\u56DE\u539F\u59CB\u5BF9\u8C61\u7684\u53EA\u8BFB\u4EE3\u7406\u3002\u4EFB\u4F55\u88AB\u8BBF\u95EE\u7684\u5D4C\u5957 property \u4E5F\u662F\u53EA\u8BFB\u7684\u3002</p></div><div class="language-ts"><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> original </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">reactive</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">count</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> copy </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">readonly</span><span style="color:#A6ACCD;">(original)</span></span>
<span class="line"><span style="color:#A6ACCD;">original</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">count</span><span style="color:#89DDFF;">++</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(original</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">count) </span><span style="color:#676E95;font-style:italic;">// 1 </span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// \u8FDB\u5165readonlyHandlers-set\uFF0C\u53D1\u51FA\u8B66\u544A</span></span>
<span class="line"><span style="color:#A6ACCD;">copy</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">count</span><span style="color:#89DDFF;">++</span></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(copy</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">count) </span><span style="color:#676E95;font-style:italic;">// 1</span></span>
<span class="line"></span></code></pre></div><div class="language-ts"><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">readonly</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">T</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">object</span><span style="color:#89DDFF;">&gt;(</span></span>
<span class="line"><span style="color:#A6ACCD;">  target</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">T</span></span>
<span class="line"><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">DeepReadonly</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">UnwrapNestedRefs</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">T</span><span style="color:#89DDFF;">&gt;&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">createReactiveObject</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">readonlyHandlers</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">readonlyCollectionHandlers</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">readonlyMap</span></span>
<span class="line"><span style="color:#F07178;">  )</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p><code>readonly</code>\u540C\u6837\u4F7F\u7528<code>createReactiveObject</code>\u521B\u5EFA\u4E00\u4E2A\u4EE3\u7406\u5BF9\u8C61\uFF0C\u6D41\u7A0B\u4E0E<code>reactive</code>\u76F8\u540C\u3002\u4E0E<code>reactive</code>\u4E0D\u540C\u7684\u662F<code>createReactiveObject</code>\u4E2D\u4F20\u5165\u7684<code>isReadonly</code>\u4E3A<code>true</code>\uFF0C<code>new proxy</code>\u65F6\u7684<code>handler</code>\u4E5F\u4E0D\u540C\u3002</p><p><code>baseHandlers.ts</code></p><div class="language-ts"><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> readonlyHandlers</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ProxyHandler</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">object</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">get</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> readonlyGet</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">set</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> key</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">__DEV__</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">warn</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">Set operation on key &quot;</span><span style="color:#89DDFF;">\${</span><span style="color:#FFCB6B;">String</span><span style="color:#A6ACCD;">(key)</span><span style="color:#89DDFF;">}</span><span style="color:#C3E88D;">&quot; failed: target is readonly.</span><span style="color:#89DDFF;">\`</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">target</span></span>
<span class="line"><span style="color:#F07178;">      )</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">true</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">deleteProperty</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> key</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">__DEV__</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">warn</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">Delete operation on key &quot;</span><span style="color:#89DDFF;">\${</span><span style="color:#FFCB6B;">String</span><span style="color:#A6ACCD;">(key)</span><span style="color:#89DDFF;">}</span><span style="color:#C3E88D;">&quot; failed: target is readonly.</span><span style="color:#89DDFF;">\`</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">target</span></span>
<span class="line"><span style="color:#F07178;">      )</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">true</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u4ECE<code>readonlyHandlers</code>\u4E2D\u53EF\u4EE5\u770B\u5230\uFF0C<code>set</code>\u548C<code>deleteProperty</code>\u4E2D\u662F\u6CA1\u6709\u989D\u5916\u64CD\u4F5C\u7684\uFF0C\u8FD9\u4E5F\u5C31\u610F\u5473\u7740<code>readonly(target)</code>\u7684\u5C5E\u6027\u662F\u53EA\u8BFB\u7684\uFF0C\u4E0D\u5141\u8BB8\u4FEE\u6539\u548C\u5220\u9664</p><p><code>collectionHandlers.ts</code></p><div class="language-ts"><pre><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">createReadonlyMethod</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">type</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">TriggerOpTypes</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Function</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(this:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">CollectionTypes</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">args</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">unknown</span><span style="color:#F07178;">[]</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">__DEV__</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">args</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">] </span><span style="color:#89DDFF;">?</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">on key &quot;</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">args[</span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">}</span><span style="color:#C3E88D;">&quot; </span><span style="color:#89DDFF;">\`</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">\`\`</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">warn</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">\`\${</span><span style="color:#82AAFF;">capitalize</span><span style="color:#A6ACCD;">(type)</span><span style="color:#89DDFF;">}</span><span style="color:#C3E88D;"> operation </span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">}</span><span style="color:#C3E88D;">failed: target is readonly.</span><span style="color:#89DDFF;">\`</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#82AAFF;">toRaw</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">      )</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">type</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">TriggerOpTypes</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">DELETE</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">?</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">this</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">createInstrumentations</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// ...</span></span>
<span class="line"><span style="color:#F07178;">  </span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">readonlyInstrumentations</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Record</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Function</span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    get</span><span style="color:#89DDFF;">(this:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">MapTypes</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">unknown</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">get</span><span style="color:#F07178;"> size</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">size</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">unknown</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">IterableCollections</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">    has</span><span style="color:#89DDFF;">(this:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">MapTypes</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">unknown</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">has</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">call</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">    add</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">createReadonlyMethod</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">TriggerOpTypes</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">ADD</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    set</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">createReadonlyMethod</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">TriggerOpTypes</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">SET</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    delete</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">createReadonlyMethod</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">TriggerOpTypes</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">DELETE</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    clear</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">createReadonlyMethod</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">TriggerOpTypes</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">CLEAR</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    forEach</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">createForEach</span><span style="color:#F07178;">(</span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// ...</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> readonlyCollectionHandlers</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ProxyHandler</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">CollectionTypes</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">get</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">/*#__PURE__*/</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">createInstrumentationGetter</span><span style="color:#A6ACCD;">(</span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p><code>readonlyCollectionHandlers</code>\u62E6\u622A\u6240\u6709\u53EF\u80FD\u4FEE\u6539\u96C6\u5408\u7684\u65B9\u6CD5\uFF0C\u5305\u62EC<code>add</code>\u3001<code>set</code>\u3001<code>delete</code>\u3001<code>clear</code>\uFF0C\u4F7F\u8FD9\u4E9B\u65B9\u6CD5\u4E0D\u80FD\u591F\u4FEE\u6539\u96C6\u5408\u3002</p><p>\u4F7F\u7528<code>readonly</code>\u58F0\u660E\u7684\u54CD\u5E94\u5F0F\u6570\u636E\uFF0C\u56E0\u4E3A\u6240\u6709\u5C5E\u6027\u90FD\u4E0D\u4F1A\u4FEE\u6539\uFF0C\u6240\u4EE5\u5728<code>get</code>\u3001<code>size</code>\u7B49\u4E00\u4E9B\u67E5\u8BE2\u7684\u65B9\u6CD5\u4E2D\u662F\u4E0D\u4F1A\u8FDB\u884C\u4F9D\u8D56\u7684\u6536\u96C6\u3002</p><div class="language-ts"><pre><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">  target</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">MapTypes</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  key</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">unknown</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  isReadonly </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  isShallow </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">false</span></span>
<span class="line"><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// ...</span></span>
<span class="line"><span style="color:#F07178;">  </span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u975E\u53EA\u8BFB\u65F6\u8FDB\u884C\u4F9D\u8D56\u6536\u96C6</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">!</span><span style="color:#A6ACCD;">isReadonly</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">track</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">rawTarget</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">TrackOpTypes</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">GET</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">rawKey</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">//...</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">size</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">IterableCollections</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> isReadonly </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">target</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">target</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#F07178;">)[</span><span style="color:#A6ACCD;">ReactiveFlags</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">RAW</span><span style="color:#F07178;">]</span></span>
<span class="line"><span style="color:#F07178;">  </span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u975E\u53EA\u8BFB\u65F6\u8FDB\u884C\u4F9D\u8D56\u6536\u96C6</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">!</span><span style="color:#A6ACCD;">isReadonly</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">track</span><span style="color:#F07178;">(</span><span style="color:#82AAFF;">toRaw</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">target</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">TrackOpTypes</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">ITERATE</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ITERATE_KEY</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Reflect</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">size</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">target</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,13),e=[o];function t(c,r,F,y,D,C){return a(),n("div",null,e)}var d=s(p,[["render",t]]);export{i as __pageData,d as default};