import{_ as n,c as s,o as a,d as e}from"./app.d2a36d2c.js";var t="/blog/assets/removeRoute.b5dfb474.png";const b='{"title":"removeRoute","description":"","frontmatter":{},"headers":[],"relativePath":"vue-router/removeRoute.md"}',o={},p=e(`<h1 id="removeroute" tabindex="-1">removeRoute <a class="header-anchor" href="#removeroute" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u901A\u8FC7\u540D\u79F0\u5220\u9664\u73B0\u6709\u8DEF\u7531</p></div><p><code>removeRoute</code>\u63A5\u6536\u4E00\u4E2A<code>name</code>\uFF08\u73B0\u6709\u8DEF\u7531\u540D\u79F0\uFF09\u5C5E\u6027\u3002</p><div class="language-ts line-numbers-mode"><pre><code><span class="token keyword">function</span> <span class="token function">removeRoute</span><span class="token punctuation">(</span>name<span class="token operator">:</span> RouteRecordName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u6839\u636Ename\u83B7\u53D6\u5BF9\u5E94\u7684routeRecordMatcher</span>
  <span class="token keyword">const</span> recordMatcher <span class="token operator">=</span> matcher<span class="token punctuation">.</span><span class="token function">getRecordMatcher</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>recordMatcher<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// \u5982\u679C\u5B58\u5728recordMatcher\uFF0C\u8C03\u7528matcher.removeRoute</span>
    matcher<span class="token punctuation">.</span><span class="token function">removeRoute</span><span class="token punctuation">(</span>recordMatcher<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>__DEV__<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">warn</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Cannot remove non-existent route &quot;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token function">String</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&quot;</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>\u5BF9\u4E8E<code>matcher.removeRoute</code>\uFF0C\u53C2\u8003<a href="https://maxlz1.github.io/blog/vue-router/routerMatcher.html#removeroute" target="_blank" rel="noopener noreferrer">matcher.removeRoute</a></p><p><code>removeRoute</code>\u6D41\u7A0B\uFF1A</p><p><img src="`+t+'" alt=""></p>',7),c=[p];function r(u,l,i,m,k,d){return a(),s("div",null,c)}var v=n(o,[["render",r]]);export{b as __pageData,v as default};