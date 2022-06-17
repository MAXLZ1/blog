import{_ as n,c as s,o as a,d as e}from"./app.90a49249.js";const m='{"title":"\u526F\u4F5C\u7528\u51FD\u6570\u4E0E\u54CD\u5E94\u5F0F\u6570\u636E","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u526F\u4F5C\u7528\u51FD\u6570","slug":"\u526F\u4F5C\u7528\u51FD\u6570"},{"level":2,"title":"\u54CD\u5E94\u5F0F\u6570\u636E","slug":"\u54CD\u5E94\u5F0F\u6570\u636E"}],"relativePath":"vue3-analysis/reactivity/\u526F\u4F5C\u7528\u51FD\u6570\u4E0E\u54CD\u5E94\u5F0F\u6570\u636E.md"}',o={},p=e(`<h1 id="\u526F\u4F5C\u7528\u51FD\u6570\u4E0E\u54CD\u5E94\u5F0F\u6570\u636E" tabindex="-1">\u526F\u4F5C\u7528\u51FD\u6570\u4E0E\u54CD\u5E94\u5F0F\u6570\u636E <a class="header-anchor" href="#\u526F\u4F5C\u7528\u51FD\u6570\u4E0E\u54CD\u5E94\u5F0F\u6570\u636E" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u5728\u5206\u6790<code>vue3</code>\u54CD\u5E94\u5F0F\u7684\u5B9E\u73B0\u524D\uFF0C\u6211\u4EEC\u9700\u8981\u5148\u641E\u6E05\u4E24\u4E2A\u6982\u5FF5\uFF1A<strong>\u526F\u4F5C\u7528\u51FD\u6570</strong>\u3001<strong>\u54CD\u5E94\u5F0F\u6570\u636E</strong>\u3002</p></div><h2 id="\u526F\u4F5C\u7528\u51FD\u6570" tabindex="-1">\u526F\u4F5C\u7528\u51FD\u6570 <a class="header-anchor" href="#\u526F\u4F5C\u7528\u51FD\u6570" aria-hidden="true">#</a></h2><p><strong>\u526F\u4F5C\u7528\u51FD\u6570</strong>\uFF0C\u987E\u540D\u601D\u4E49\uFF0C\u4F1A\u4EA7\u751F\u526F\u4F5C\u7528\u7684\u51FD\u6570\u88AB\u79F0\u4E3A<strong>\u526F\u4F5C\u7528\u51FD\u6570</strong>\u3002\u90A3\u4E48\u4EC0\u4E48\u662F\u526F\u4F5C\u7528\u5462\uFF1F\u5982\u679C\u51E0\u4E2A\u51FD\u6570\u7684\u8FD0\u884C\uFF0C\u53EF\u80FD\u4F1A\u5F71\u54CD\u5230\u5176\u4ED6\u51FD\u6570\u6216\u53D8\u91CF\uFF0C\u90A3\u4E48\u8FD9\u79CD\u5F71\u54CD\u5C31\u662F\u4E00\u79CD\u526F\u4F5C\u7528\u3002\u6211\u4EEC\u6765\u770B\u4E24\u4E2A\u4F8B\u5B50\uFF1A</p><div class="language-ts line-numbers-mode"><pre><code><span class="token keyword">function</span> <span class="token function">changeText</span><span class="token punctuation">(</span>text<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  document<span class="token punctuation">.</span>body<span class="token punctuation">.</span>innerText <span class="token operator">=</span> text
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">getText</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> document<span class="token punctuation">.</span>body<span class="token punctuation">.</span>innerText
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p><code>changeText</code>\u51FD\u6570\u4F1A\u4FEE\u6539<code>body</code>\u7684\u5185\u5BB9\u3002<code>getText</code>\u4F1A\u8FD4\u56DE<code>body</code>\u7684\u5185\u5BB9\u3002\u5982\u679C\u6211\u4EEC\u4F7F\u7528<code>changeText</code>\u4FEE\u6539\u4E86<code>body</code>\u5185\u5BB9\uFF0C\u90A3\u4E48\u4F1A\u5F71\u54CD\u5230<code>getText</code>\u83B7\u53D6\u5185\u5BB9\uFF0C\u90A3\u4E48\u8FD9\u65F6<code>changeText</code>\u5C31\u662F\u4E2A\u526F\u4F5C\u7528\u51FD\u6570\u3002\u526F\u4F5C\u7528\u51FD\u6570\u4E0D\u4E00\u5B9A\u975E\u8981\u5BF9\u67D0\u4E9B\u51FD\u6570\u4EA7\u751F\u526F\u4F5C\u7528\uFF0C\u5982\u679C\u4E00\u4E2A\u51FD\u6570\u4FEE\u6539\u4E86\u5168\u5C40\u53D8\u91CF\uFF0C\u8FD9\u5176\u5B9E\u4E5F\u662F\u4E2A\u526F\u4F5C\u7528\u51FD\u6570\u3002</p><div class="language-ts line-numbers-mode"><pre><code><span class="token keyword">var</span> flag <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token keyword">function</span> <span class="token function">changeFlag</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  flag <span class="token operator">=</span> <span class="token operator">!</span>flag
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p><code>changeFlag</code>\u51FD\u6570\u4F1A\u66F4\u6539\u4E00\u4E2A\u5168\u5C40\u53D8\u91CF<code>flag</code>\uFF0C\u90A3\u4E48\u8FD9\u4E5F\u662F\u4E00\u79CD\u526F\u4F5C\u7528\uFF0C\u6240\u4EE5<code>changeText</code>\u4E5F\u662F\u4E2A\u526F\u4F5C\u7528\u51FD\u6570\u3002</p><h2 id="\u54CD\u5E94\u5F0F\u6570\u636E" tabindex="-1">\u54CD\u5E94\u5F0F\u6570\u636E <a class="header-anchor" href="#\u54CD\u5E94\u5F0F\u6570\u636E" aria-hidden="true">#</a></h2><div class="language-ts line-numbers-mode"><pre><code><span class="token keyword">let</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span> a<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> b<span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function">sum</span><span class="token punctuation">(</span>a<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> b<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> a <span class="token operator">+</span> b
<span class="token punctuation">}</span>

<span class="token keyword">let</span> c <span class="token operator">=</span> <span class="token function">sum</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>a<span class="token punctuation">,</span> obj<span class="token punctuation">.</span>b<span class="token punctuation">)</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>\u4EE5\u4E0A\u4EE3\u7801<code>c</code>\u7684\u7ED3\u679C\u4E3A2\uFF0C\u8FD9\u5F88\u7B80\u5355\u3002\u5982\u679C\u6211\u4EEC\u5C06<code>obj.a</code>\u53D8\u4E3A2\uFF0C\u90A3\u4E48<code>c</code>\u7684\u7ED3\u679C\u662F\u4E0D\u4F1A\u53D8\u7684\uFF0C\u6211\u4EEC\u5FC5\u987B\u518D\u6B21\u8C03\u7528<code>sum</code>\u51FD\u6570\uFF0C\u624D\u80FD\u5F97\u5230\u6211\u4EEC\u60F3\u8981\u7684\u7ED3\u679C\u3002\u60F3\u8C61\u4E00\u4E0B\uFF0C\u5982\u679C\u6211\u4EEC\u66F4\u6539<code>obj.a</code>\u6216<code>obj.b</code>\uFF0C\u4E0D\u9700\u8981\u6211\u4EEC\u8C03\u7528<code>sum</code>\u51FD\u6570\uFF0C<code>c</code>\u80FD\u540C\u6B65\u66F4\u65B0\u8BE5\u591A\u597D\uFF0C\u5982\u679C\u53EF\u4EE5\u5B9E\u73B0\u8FD9\u79CD\u529F\u80FD\uFF0C\u90A3\u4E48<code>obj</code>\u6211\u4EEC\u5C31\u53EF\u4EE5\u79F0\u4E3A<strong>\u54CD\u5E94\u5F0F\u6570\u636E</strong>\u3002</p>`,11),t=[p];function c(l,r,u,i,d,k){return a(),s("div",null,t)}var _=n(o,[["render",c]]);export{m as __pageData,_ as default};
