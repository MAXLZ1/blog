import{_ as n,c as s,o as a,d as e}from"./app.2233c548.js";const m='{"title":"void","description":"","frontmatter":{},"headers":[{"level":2,"title":"undefined","slug":"undefined"}],"relativePath":"javascript/void.md"}',p={},o=e(`<h1 id="void" tabindex="-1">void <a class="header-anchor" href="#void" aria-hidden="true">#</a></h1><p>\u4E4B\u524D\u5728\u770B<code>vue3</code>\u6E90\u7801\u8FC7\u7A0B\u4E2D\uFF0C\u78B0\u5230\u67D0\u4E9B\u5206\u652F\u5224\u65AD<code>undefined</code>\u65F6\uFF0C\u4F1A\u4F7F\u7528<code>key !== void 0</code>\u7684\u65B9\u5F0F\u8FDB\u884C\u5224\u65AD\uFF0C\u800C\u4E0D\u662F<code>key !== undefined</code>\u3002\u90A3\u4E48\u4E3A\u4EC0\u4E48\u4F7F\u7528<code>void 0</code>\uFF0C\u800C\u4E0D\u662F<code>undefined</code>\u5462\uFF1F\u5728\u56DE\u7B54\u8FD9\u4E2A\u95EE\u9898\u524D\uFF0C\u6211\u4EEC\u5148\u770B\u4E0B<code>undefined</code>\u4E0E<code>void</code>\uFF1A</p><h2 id="undefined" tabindex="-1">undefined <a class="header-anchor" href="#undefined" aria-hidden="true">#</a></h2><p>MDN\uFF1A<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined" target="_blank" rel="noopener noreferrer">https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined</a></p><p><code>undefined</code>\u662F<code>JavaScript</code>\u7684\u57FA\u672C\u6570\u636E\u7C7B\u578B\u4E4B\u4E00\u3002\u5B83\u662F\u5168\u5C40\u5BF9\u8C61<code>window</code>\u7684\u4E00\u4E2A\u5C5E\u6027\u3002\u81EA<code>ECMAscript5</code>\u6807\u51C6\u4EE5\u6765<code>undefined</code>\u662F\u4E00\u4E2A\u4E0D\u80FD\u88AB\u914D\u7F6E\uFF0C\u4E0D\u80FD\u88AB\u91CD\u5199\u7684\u5C5E\u6027\u3002\u4E5F\u5C31\u662F\u8BF4\u5728\u5168\u5C40\u4F5C\u7528\u57DF\u65E0\u6CD5\u66F4\u6539<code>undefined</code>\u3002</p><div class="language-js line-numbers-mode"><pre><code><span class="token keyword">undefined</span> <span class="token operator">=</span> <span class="token string">&#39;test&#39;</span>
consle<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">undefined</span><span class="token punctuation">)</span> <span class="token comment">// undefined</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u4F46\u5728\u5C40\u90E8\u4F5C\u7528\u57DF\u4E0B\uFF0C<code>undefined</code>\u662F\u53EF\u4EE5\u88AB\u4FEE\u6539\u7684:</p><div class="language-js line-numbers-mode"><pre><code><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token function">print</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> <span class="token keyword">undefined</span> <span class="token operator">=</span> <span class="token number">1</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">undefined</span><span class="token punctuation">,</span> <span class="token keyword">typeof</span> <span class="token keyword">undefined</span><span class="token punctuation">)</span> <span class="token comment">// 1, &#39;numbder&#39;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>\u5728\u5C40\u90E8\u4F5C\u7528\u57DF\u4E2D<code>undefined</code>\u88AB\u5F53\u505A\u6210\u4E00\u4E2A\u53D8\u91CF\uFF0C\u53EF\u4EE5\u5BF9\u5176\u968F\u610F\u4FEE\u6539\u3002</p><p>\u5982\u679C\u4E00\u4E2A\u51FD\u6570\u6CA1\u6709\u8FD4\u56DE\u503C\uFF0C\u90A3\u4E48\u5B83\u4F1A\u8FD4\u56DE\u4E00\u4E2A<code>undefined</code>\u3002</p><div class="language-js line-numbers-mode"><pre><code><span class="token keyword">function</span> <span class="token function">print</span><span class="token punctuation">(</span><span class="token parameter">x</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token function">print</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span> <span class="token comment">// undefined</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h1 id="void-1" tabindex="-1">void <a class="header-anchor" href="#void-1" aria-hidden="true">#</a></h1><p>MDN\uFF1A<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void" target="_blank" rel="noopener noreferrer">https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void</a></p><p>\u8BED\u6CD5\uFF1A<code>void expression</code></p><p><code>void</code>\u8FD0\u7B97\u7B26\u540E\u9762\u7684\u8868\u8FBE\u5F0F\u4F1A\u88AB\u6267\u884C\uFF0C\u5E76\u4E14<code>void</code>\u603B\u662F\u8FD4\u56DE<code>undefined</code>\u3002</p><div class="language-js line-numbers-mode"><pre><code>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">)</span> <span class="token comment">// undefined</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token comment">// undefined</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token comment">// undefined</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token comment">// undefined</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token comment">// undefined</span>


<span class="token keyword">void</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;test&#39;</span><span class="token punctuation">)</span> <span class="token comment">// \u6253\u5370test</span>
<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">void</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token comment">// undefined</span>
<span class="token keyword">void</span> <span class="token number">1</span><span class="token operator">+</span><span class="token number">1</span> <span class="token comment">// NaN</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p><code>void</code>\u8FD0\u7B97\u7B26\u7684\u4F18\u5148\u7EA7\u8981\u9AD8\u4E8E<code>+</code>\uFF0C\u6240\u4EE5\u5728<code>void 1+1</code>\u4E2D\u4F1A\u5148\u8BA1\u7B97<code>void 1</code>\uFF0C\u8FD4\u56DE<code>undefined</code>\uFF0C\u7136\u540E<code>+1</code>\uFF0C<code>undefined+1=NaN</code></p><p><code>void</code>\u8FD0\u7B97\u7B26\u7684\u51E0\u79CD\u7528\u6CD5\uFF1A</p><ul><li>\u7ACB\u5373\u8C03\u7528\u7684\u51FD\u6570\u8868\u8FBE\u5F0F\uFF1A</li></ul><div class="language-js line-numbers-mode"><pre><code><span class="token comment">// \u5E38\u89C4\u7684IIFE</span>
<span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment">// \u4F7F\u7528void</span>
<span class="token keyword">void</span> <span class="token keyword">function</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  
<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>\u4F7F\u7528<code>void</code>\u540E\uFF0C<code>function</code>\u4F1A\u88AB\u8BC6\u522B\u4E3A\u51FD\u6570\u8868\u8FBE\u5F0F\u800C\u4E0D\u662F\u51FD\u6570\u58F0\u660E\u8BED\u53E5</p><ul><li>Javascript URIs\uFF1A\u7528\u4EE5\u4E0B\u65B9\u5F0F\uFF0C\u5C06<code>a</code>\u6807\u7B7E\u70B9\u51FB\u65E0\u54CD\u5E94\u3002</li></ul><div class="language-html line-numbers-mode"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>javascript: void(0)<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  DEMO
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><ul><li>\u5728\u7BAD\u5934\u51FD\u6570\u4E2D\u907F\u514D\u6CC4\u6F0F</li></ul><div class="language-js line-numbers-mode"><pre><code>button<span class="token punctuation">.</span><span class="token function-variable function">onclick</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span> <span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br></div></div><p>\u5F53<code>doSomething</code>\u7684\u8FD4\u56DE\u503C\u53D1\u751F\u53D8\u5316\u540E\uFF0C\u4E0D\u4F1A\u6539\u53D8<code>onclick</code>\u7684\u884C\u4E3A\u3002</p><p>\u7EFC\u4E0A\u53EF\u4EE5\u770B\u51FA<code>void 0 </code>\u76F8\u6BD4\u8F83<code>undefined</code>\u7684\u4F18\u52BF\uFF1A</p><ol><li>\u4E0D\u5FC5\u62C5\u5FC3<code>undefined</code>\u88AB\u4FEE\u6539\u3002</li><li>\u5B57\u7B26\u66F4\u77ED\uFF0C\u8282\u7701\u5B57\u8282\u3002</li><li>\u4E00\u4E9B\u538B\u7F29\u5DE5\u5177\u4F1A\u5C06<code>undefined</code>\u8F6C\u4E3A<code>void 0</code>\uFF0C\u4F7F\u7528<code>void 0</code>\u4F1A\u52A0\u5FEB\u538B\u7F29\u901F\u5EA6\u3002</li></ol>`,28),c=[o];function t(l,i,u,d,r,k){return a(),s("div",null,c)}var v=n(p,[["render",t]]);export{m as __pageData,v as default};
