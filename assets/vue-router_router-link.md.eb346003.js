import{_ as n,c as s,o as a,d as p}from"./app.d2a36d2c.js";const d='{"title":"<router-link\\\\>","description":"","frontmatter":{},"headers":[],"relativePath":"vue-router/router-link.md"}',t={},e=p(`<h1 id="router-link" tabindex="-1">&lt;router-link&gt; <a class="header-anchor" href="#router-link" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u4F7F\u7528<code>router-link</code>\u6765\u521B\u5EFA\u94FE\u63A5\uFF0C\u53EF\u4EE5\u4F7F<code>vue-router</code>\u53EF\u4EE5\u5728\u4E0D\u91CD\u65B0\u52A0\u8F7D\u9875\u9762\u7684\u60C5\u51B5\u4E0B\u66F4\u6539URL\uFF0C\u5904\u7406URL\u7684\u751F\u6210\u53CA\u7F16\u7801\u3002</p><p>\u6E90\u7801\u4F4D\u7F6E\uFF1A<code>src/RouterLink.ts</code></p></div><div class="language-ts line-numbers-mode"><pre><code><span class="token comment">// /*#__PURE__*/ \u7528\u4E8Etree-shaking\uFF0C\u5982\u679C\u672A\u4F7F\u7528\u4E0D\u6253\u5305</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> RouterLinkImpl <span class="token operator">=</span> <span class="token comment">/*#__PURE__*/</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;RouterLink&#39;</span><span class="token punctuation">,</span>
  props<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// \u76EE\u6807\u8DEF\u7531\u7684\u94FE\u63A5</span>
    to<span class="token operator">:</span> <span class="token punctuation">{</span>
      type<span class="token operator">:</span> <span class="token punctuation">[</span>String<span class="token punctuation">,</span> Object<span class="token punctuation">]</span> <span class="token keyword">as</span> PropType<span class="token operator">&lt;</span>RouteLocationRaw<span class="token operator">&gt;</span><span class="token punctuation">,</span>
      required<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// \u51B3\u5B9A\u662F\u5426\u8C03\u7528router.push()\u8FD8\u662Frouter.replace()</span>
    replace<span class="token operator">:</span> Boolean<span class="token punctuation">,</span>
    <span class="token comment">// \u94FE\u63A5\u88AB\u6FC0\u6D3B\u65F6\uFF0C\u7528\u4E8E\u6E32\u67D3a\u6807\u7B7E\u7684class</span>
    <span class="token class-name">activeClass</span><span class="token operator">:</span> String<span class="token punctuation">,</span>
    <span class="token comment">// inactiveClass: String,</span>
    <span class="token comment">// \u94FE\u63A5\u7CBE\u51C6\u6FC0\u6D3B\u65F6\uFF0C\u7528\u4E8E\u6E32\u67D3a\u6807\u7B7E\u7684class</span>
    <span class="token class-name">exactActiveClass</span><span class="token operator">:</span> String<span class="token punctuation">,</span>
    <span class="token comment">// \u662F\u5426\u4E0D\u5E94\u8BE5\u5C06\u5185\u5BB9\u5305\u88F9\u5728&lt;a/&gt;\u6807\u7B7E\u4E2D</span>
    custom<span class="token operator">:</span> Boolean<span class="token punctuation">,</span>
    <span class="token comment">// \u4F20\u9012\u7ED9aria-current\u5C5E\u6027\u7684\u503C\u3002https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current</span>
    ariaCurrentValue<span class="token operator">:</span> <span class="token punctuation">{</span>
      type<span class="token operator">:</span> String <span class="token keyword">as</span> PropType<span class="token operator">&lt;</span>RouterLinkProps<span class="token punctuation">[</span><span class="token string">&#39;ariaCurrentValue&#39;</span><span class="token punctuation">]</span><span class="token operator">&gt;</span><span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token string">&#39;page&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  useLink<span class="token punctuation">,</span>

  <span class="token function">setup</span><span class="token punctuation">(</span>props<span class="token punctuation">,</span> <span class="token punctuation">{</span> slots <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// \u4F7F\u7528useLink\u521B\u5EFArouter-link\u6240\u9700\u7684\u4E00\u4E9B\u5C5E\u6027</span>
    <span class="token keyword">const</span> link <span class="token operator">=</span> <span class="token function">reactive</span><span class="token punctuation">(</span><span class="token function">useLink</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token comment">// createRouter\u65F6\u4F20\u5165\u7684options</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> options <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>routerKey<span class="token punctuation">)</span><span class="token operator">!</span>

    <span class="token comment">// class\u5BF9\u8C61</span>
    <span class="token keyword">const</span> elClass <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token punctuation">[</span><span class="token function">getLinkClass</span><span class="token punctuation">(</span>
        props<span class="token punctuation">.</span>activeClass<span class="token punctuation">,</span>
        options<span class="token punctuation">.</span>linkActiveClass<span class="token punctuation">,</span>
        <span class="token string">&#39;router-link-active&#39;</span>
      <span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token operator">:</span> link<span class="token punctuation">.</span>isActive<span class="token punctuation">,</span> <span class="token comment">// \u88AB\u6FC0\u6D3B\u65F6\u7684class</span>
      <span class="token punctuation">[</span><span class="token function">getLinkClass</span><span class="token punctuation">(</span>
        props<span class="token punctuation">.</span>exactActiveClass<span class="token punctuation">,</span>
        options<span class="token punctuation">.</span>linkExactActiveClass<span class="token punctuation">,</span>
        <span class="token string">&#39;router-link-exact-active&#39;</span>
      <span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token operator">:</span> link<span class="token punctuation">.</span>isExactActive<span class="token punctuation">,</span> <span class="token comment">// \u88AB\u7CBE\u51C6\u6FC0\u6D3B\u7684class</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token comment">// \u9ED8\u8BA4\u63D2\u69FD</span>
      <span class="token keyword">const</span> children <span class="token operator">=</span> slots<span class="token punctuation">.</span>default <span class="token operator">&amp;&amp;</span> slots<span class="token punctuation">.</span><span class="token function">default</span><span class="token punctuation">(</span>link<span class="token punctuation">)</span>
      <span class="token comment">// \u5982\u679C\u8BBE\u7F6E\u4E86props.custom\uFF0C\u76F4\u63A5\u663E\u793Achldren\uFF0C\u53CD\u4E4B\u9700\u8981\u4F7F\u7528a\u6807\u7B7E\u5305\u88F9</span>
      <span class="token keyword">return</span> props<span class="token punctuation">.</span>custom
        <span class="token operator">?</span> children
        <span class="token operator">:</span> <span class="token function">h</span><span class="token punctuation">(</span>
            <span class="token string">&#39;a&#39;</span><span class="token punctuation">,</span>
            <span class="token punctuation">{</span>
              <span class="token string-property property">&#39;aria-current&#39;</span><span class="token operator">:</span> link<span class="token punctuation">.</span>isExactActive
                <span class="token operator">?</span> props<span class="token punctuation">.</span>ariaCurrentValue
                <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
              href<span class="token operator">:</span> link<span class="token punctuation">.</span>href<span class="token punctuation">,</span>
              onClick<span class="token operator">:</span> link<span class="token punctuation">.</span>navigate<span class="token punctuation">,</span>
              <span class="token keyword">class</span><span class="token operator">:</span> elClass<span class="token punctuation">.</span>value<span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            children
          <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> RouterLink <span class="token operator">=</span> RouterLinkImpl <span class="token keyword">as</span> <span class="token builtin">unknown</span> <span class="token keyword">as</span> <span class="token punctuation">{</span>
  <span class="token keyword">new</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    $props<span class="token operator">:</span> AllowedComponentProps <span class="token operator">&amp;</span>
      ComponentCustomProps <span class="token operator">&amp;</span>
      VNodeProps <span class="token operator">&amp;</span>
      RouterLinkProps

    $slots<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function-variable function">default</span><span class="token operator">:</span> <span class="token punctuation">(</span>arg<span class="token operator">:</span> UnwrapRef<span class="token operator">&lt;</span>ReturnType<span class="token operator">&lt;</span><span class="token keyword">typeof</span> useLink<span class="token operator">&gt;&gt;</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  useLink<span class="token operator">:</span> <span class="token keyword">typeof</span> useLink
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br></div></div><p>\u53EF\u4EE5\u770B\u51FA<code>router-link</code>\u4E2D\u7684\u903B\u8F91\u5F88\u5927\u4E00\u90E8\u5206\u662F\u9760<code>useLink</code>\u8FDB\u884C\u5B9E\u73B0\u7684\u3002\u5173\u4E8E<code>useLink</code>\u53EF\u53C2\u8003\uFF1A<a href="https://maxlz1.github.io/blog/vue-router/useLink.html" target="_blank" rel="noopener noreferrer">useLink</a></p>`,4),o=[e];function c(l,r,u,i,k,b){return a(),s("div",null,o)}var _=n(t,[["render",c]]);export{d as __pageData,_ as default};
