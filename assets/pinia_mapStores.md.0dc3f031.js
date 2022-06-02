import{_ as n,c as s,o as a,d as p}from"./app.69cbc3a8.js";const d='{"title":"mapStores","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F7F\u7528","slug":"\u4F7F\u7528"},{"level":2,"title":"\u6E90\u7801\u5206\u6790","slug":"\u6E90\u7801\u5206\u6790"}],"relativePath":"pinia/mapStores.md"}',t={},e=p(`<h1 id="mapstores" tabindex="-1">mapStores <a class="header-anchor" href="#mapstores" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u4F7F\u7528<code>mapStore</code>\u83B7\u53D6\u5B8C\u6574\u7684<code>store</code>\u3002</p></div><h2 id="\u4F7F\u7528" tabindex="-1">\u4F7F\u7528 <a class="header-anchor" href="#\u4F7F\u7528" aria-hidden="true">#</a></h2><div class="language-ts line-numbers-mode"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> mapStores <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;pinia&#39;</span>

<span class="token keyword">const</span> useUserStore <span class="token operator">=</span> <span class="token function">defineStore</span><span class="token punctuation">(</span><span class="token string">&#39;user&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> useCartStore <span class="token operator">=</span> <span class="token function">defineStore</span><span class="token punctuation">(</span><span class="token string">&#39;cart&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  computed<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span><span class="token function">mapStores</span><span class="token punctuation">(</span>useCartStore<span class="token punctuation">,</span> useUserStore<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>

  methods<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token keyword">async</span> <span class="token function">buyStuff</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>userStore<span class="token punctuation">.</span><span class="token function">isAuthenticated</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>cartStore<span class="token punctuation">.</span><span class="token function">buy</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h2 id="\u6E90\u7801\u5206\u6790" tabindex="-1">\u6E90\u7801\u5206\u6790 <a class="header-anchor" href="#\u6E90\u7801\u5206\u6790" aria-hidden="true">#</a></h2><p><code>mapStores</code>\u53EF\u63A5\u6536\u591A\u4E2A<code>useStore</code>\u51FD\u6570\u3002</p><div class="language-ts line-numbers-mode"><pre><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token generic-function"><span class="token function">mapStores</span><span class="token generic class-name"><span class="token operator">&lt;</span>Stores <span class="token keyword">extends</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>
  <span class="token operator">...</span>stores<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token operator">...</span>Stores<span class="token punctuation">]</span>
<span class="token punctuation">)</span><span class="token operator">:</span> _Spread<span class="token operator">&lt;</span>Stores<span class="token operator">&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u5982\u679C\u63A5\u6536\u7684\u662F\u4E2A\u6570\u7EC4\u53C2\u6570\uFF0C\u8FDB\u884C\u63D0\u793A</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>__DEV__ <span class="token operator">&amp;&amp;</span> <span class="token builtin">Array</span><span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>stores<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span>
      <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">[\u{1F34D}]: Directly pass all stores to &quot;mapStores()&quot; without putting them in an array:\\n</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">+</span>
        <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Replace\\n</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">+</span>
        <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">\\tmapStores([useAuthStore, useCartStore])\\n</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">+</span>
        <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">with\\n</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">+</span>
        <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">\\tmapStores(useAuthStore, useCartStore)\\n</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">+</span>
        <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">This will fail in production if not fixed.</span><span class="token template-punctuation string">\`</span></span>
    <span class="token punctuation">)</span>
    <span class="token comment">// \u5F00\u53D1\u73AF\u5883\u4E0Bstores\u53D6\u7B2C\u4E00\u4E2A\u503C</span>
    stores <span class="token operator">=</span> stores<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// \u8FD4\u56DE\u4E00\u4E2A\u5BF9\u8C61</span>
  <span class="token keyword">return</span> stores<span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span>reduced<span class="token punctuation">,</span> useStore<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token comment">// reduced\u7684key\u503C\uFF1AuseStore.$id + mapStoreSuffix(\u9ED8\u8BA4Store\uFF0C\u53EF\u4F7F\u7528setMapStoreSuffix\u8FDB\u884C\u4FEE\u6539)</span>
    reduced<span class="token punctuation">[</span>useStore<span class="token punctuation">.</span>$id <span class="token operator">+</span> mapStoreSuffix<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>
      <span class="token keyword">this</span><span class="token operator">:</span> ComponentPublicInstance
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// \u4F7F\u7528useStore\u83B7\u53D6store\uFF0C\u5728\u7EC4\u4EF6\u4E2D\u53EF\u901A\u8FC7this.$pinia\u83B7\u53D6pinia</span>
      <span class="token keyword">return</span> <span class="token function">useStore</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>$pinia<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> reduced
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token keyword">as</span> _Spread<span class="token operator">&lt;</span>Stores<span class="token operator">&gt;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br></div></div><p>\u9996\u5148<code>mapStores</code>\u4F1A\u5BF9\u53C2\u6570\u8FDB\u884C\u6821\u9A8C\uFF0C\u5982\u679C\u4F20\u5165\u7684\u7B2C\u4E00\u4E2A\u53C2\u6570\u4E3A\u6570\u7EC4\uFF0C\u90A3\u4E48\u5728\u5F00\u53D1\u73AF\u5883\u4E0B\u4F1A\u8FDB\u884C\u63D0\u793A\uFF0C\u5E76\u5C06\u6570\u7EC4\u4E2D\u7684\u7B2C\u4E00\u4E2A\u503C\u8D4B\u7ED9<code>stores</code>\uFF0C\u4EE5\u4FDD\u8BC1\u5F00\u53D1\u73AF\u5883\u4E0B\u80FD\u591F\u8FD0\u884C\u3002\u7136\u540E\u8FD4\u56DE\u4E00\u4E2A\u5BF9\u8C61\uFF0C\u8BE5\u5BF9\u8C61\u901A\u8FC7<code>stores.reduce</code>\u751F\u6210\uFF0C\u5BF9\u8C61\u7684<code>key</code>\u503C\u662F\u7531<code>useStore.$id + mapStoreSuffix</code>\u7EC4\u6210\uFF0C\u5BF9\u5E94\u7684<code>value</code>\u9002\u5408\u51FD\u6570\uFF0C\u5728\u51FD\u6570\u4E2D\u4F1A\u8C03\u7528<code>useStore(this.$pinia)</code>\uFF0C\u8FD4\u56DE\u5176\u7ED3\u679C\u3002</p>`,8),o=[e];function c(l,r,u,i,k,m){return a(),s("div",null,o)}var S=n(t,[["render",c]]);export{d as __pageData,S as default};
