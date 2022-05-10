import{_ as n,c as s,o as a,d as p}from"./app.e58bac94.js";const d='{"title":"app.use(router)","description":"","frontmatter":{},"headers":[],"relativePath":"vue-router/router-install.md"}',t={},e=p(`<h1 id="app-use-router" tabindex="-1">app.use(router) <a class="header-anchor" href="#app-use-router" aria-hidden="true">#</a></h1><blockquote><p>\u6587\u4EF6\u4F4D\u7F6E\uFF1A<code>src/router.ts</code></p></blockquote><p>\u5728<code>vue-router 4.x</code>\u4E2D\uFF0C\u4F7F\u7528<code>createRouter</code>\u521B\u5EFA\u4E00\u4E2A\u8DEF\u7531\u5B9E\u4F8B\uFF0C\u5E76\u8C03\u7528<code>app.use(router)</code>\u4F7F\u6574\u4E2A\u5E94\u7528\u652F\u6301\u8DEF\u7531\u3002</p><div class="language-ts line-numbers-mode"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createRouter<span class="token punctuation">,</span> createWebHashHistory <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-router&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createApp <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>

<span class="token keyword">const</span> Home <span class="token operator">=</span> <span class="token punctuation">{</span> template<span class="token operator">:</span> <span class="token string">&#39;&lt;div&gt;Home&lt;/div&gt;&#39;</span> <span class="token punctuation">}</span>
<span class="token keyword">const</span> About <span class="token operator">=</span> <span class="token punctuation">{</span> template<span class="token operator">:</span> <span class="token string">&#39;&lt;div&gt;About&lt;/div&gt;&#39;</span> <span class="token punctuation">}</span>

<span class="token keyword">const</span> routes <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span> path<span class="token operator">:</span> <span class="token string">&#39;/&#39;</span><span class="token punctuation">,</span> component<span class="token operator">:</span> Home <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> path<span class="token operator">:</span> <span class="token string">&#39;/about&#39;</span><span class="token punctuation">,</span> component<span class="token operator">:</span> About <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>

<span class="token keyword">const</span> router <span class="token operator">=</span> <span class="token function">createRouter</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  history<span class="token operator">:</span> <span class="token function">createWebHashHistory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  routes<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">createApp</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>router<span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">mount</span><span class="token punctuation">(</span><span class="token string">&#39;#app&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>\u5F53\u8C03\u7528<code>app.use</code>\u65F6\uFF0C\u4F1A\u8C03\u7528<code>router</code>\u5B9E\u4F8B\u4E2D\u7684<code>install</code>\u7684\u65B9\u6CD5\uFF0C\u5E76\u5C06<code>app</code>\u4F5C\u4E3A\u53C2\u6570\u4F20\u5165\u3002\u8BA9\u6211\u4EEC\u770B\u770B<code>router.install</code>\u505A\u4E86\u4E9B\u4EC0\u4E48\uFF1F</p><div class="language-ts line-numbers-mode"><pre><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createRouter</span><span class="token punctuation">(</span>options<span class="token operator">:</span> RouterOptions<span class="token punctuation">)</span><span class="token operator">:</span> Router <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
  <span class="token keyword">const</span> router<span class="token operator">:</span> Router <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
    <span class="token function">install</span><span class="token punctuation">(</span>app<span class="token operator">:</span> App<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> router <span class="token operator">=</span> <span class="token keyword">this</span>
      <span class="token comment">// \u6CE8\u518CRouterLink\u4E0ERouterView\u7EC4\u4EF6</span>
      app<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;RouterLink&#39;</span><span class="token punctuation">,</span> RouterLink<span class="token punctuation">)</span>
      app<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;RouterView&#39;</span><span class="token punctuation">,</span> RouterView<span class="token punctuation">)</span>

      <span class="token comment">// \u6CE8\u518C\u5168\u5C40\u5C5E\u6027\uFF0C$router\u4E3A\u5F53\u524Drouter\u5B9E\u4F8B</span>
      app<span class="token punctuation">.</span>config<span class="token punctuation">.</span>globalProperties<span class="token punctuation">.</span>$router <span class="token operator">=</span> router
      <span class="token comment">// \u6CE8\u518C$route\u5C5E\u6027\uFF0C\u5F53\u524D\u8DEF\u7531\u4FE1\u606F</span>
      Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>app<span class="token punctuation">.</span>config<span class="token punctuation">.</span>globalProperties<span class="token punctuation">,</span> <span class="token string">&#39;$route&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
        enumerable<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token function-variable function">get</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">unref</span><span class="token punctuation">(</span>currentRoute<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

      <span class="token comment">// \u53EA\u5728\u6D4F\u89C8\u5668\u73AF\u5883\u4E0B\u521D\u59CB\u5316\u5BFC\u822A\uFF0C\u5728\u670D\u52A1\u5668\u4E0A\u4F1A\u521B\u5EFA\u989D\u5916\u7684\u4E0D\u5FC5\u8981\u7684\u5BFC\u822A\u5E76\u53EF\u80FD\u5BFC\u81F4\u95EE\u9898</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>
        isBrowser <span class="token operator">&amp;&amp;</span>
        <span class="token comment">// \u7528\u4E8E\u521D\u59CB\u5316\u5BA2\u6237\u7AEF\uFF0C\u907F\u514D\u8DEF\u7531\u88AB\u5E94\u7528\u591A\u4E2A\u5E94\u7528</span>
        <span class="token operator">!</span>started <span class="token operator">&amp;&amp;</span>
        currentRoute<span class="token punctuation">.</span>value <span class="token operator">===</span> <span class="token constant">START_LOCATION_NORMALIZED</span>
      <span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// \u521D\u59CB\u5316\u540E\uFF0Cstarted\u8BBE\u7F6E\u4E3Atrue</span>
        started <span class="token operator">=</span> <span class="token boolean">true</span>
        <span class="token comment">// \u7B2C\u4E00\u6B21\u8DF3\u8F6C \u8DF3\u8F6C\u5230\u6D4F\u89C8\u5668url\u4E2D\u5BF9\u5E94\u7684\u8DEF\u7531</span>
        <span class="token function">push</span><span class="token punctuation">(</span>routerHistory<span class="token punctuation">.</span>location<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span>err <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>__DEV__<span class="token punctuation">)</span> <span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&#39;Unexpected error when starting the router:&#39;</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// currentRoute\u8F6C\u4E3A\u54CD\u5E94\u5F0F\u5BF9\u8C61\uFF0C\u4EE5\u65B9\u4FBF\u6216\u8BB8\u5BF9\u5176\u8FDB\u884C\u53D8\u5316\u8FFD\u8E2A</span>
      <span class="token keyword">const</span> reactiveRoute <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token keyword">as</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>k <span class="token keyword">in</span> <span class="token keyword">keyof</span> RouteLocationNormalizedLoaded<span class="token punctuation">]</span><span class="token operator">:</span> ComputedRef<span class="token operator">&lt;</span>
          RouteLocationNormalizedLoaded<span class="token punctuation">[</span>k<span class="token punctuation">]</span>
          <span class="token operator">&gt;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> key <span class="token keyword">in</span> <span class="token constant">START_LOCATION_NORMALIZED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// @ts-expect-error: the key matches</span>
        reactiveRoute<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> currentRoute<span class="token punctuation">.</span>value<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// \u5411vue\u5B9E\u4F8B\u4E2D\u6CE8\u5165\u76F8\u5173provider\uFF0C\u5728\u7EC4\u4EF6\u4E2D\u53EF\u4F7F\u7528inject\u8FDB\u884C\u63A5\u6536\uFF1AuseRoute\u4E0EuseRouter\u5C31\u662F\u4F7F\u7528inject\u5B9E\u73B0\u7684</span>
      <span class="token comment">// \u6CE8\u610F\u8FD9\u91CC\u7684key\u90FD\u662FSymbol\u7C7B\u578B</span>
      app<span class="token punctuation">.</span><span class="token function">provide</span><span class="token punctuation">(</span>routerKey<span class="token punctuation">,</span> router<span class="token punctuation">)</span>
      app<span class="token punctuation">.</span><span class="token function">provide</span><span class="token punctuation">(</span>routeLocationKey<span class="token punctuation">,</span> <span class="token function">reactive</span><span class="token punctuation">(</span>reactiveRoute<span class="token punctuation">)</span><span class="token punctuation">)</span>
      app<span class="token punctuation">.</span><span class="token function">provide</span><span class="token punctuation">(</span>routerViewLocationKey<span class="token punctuation">,</span> currentRoute<span class="token punctuation">)</span>

      <span class="token comment">// \u91CD\u5199vue\u5B9E\u4F8B\u7684\u5378\u8F7D\u65B9\u6CD5\uFF0C\u4EE5\u4FBF\u91CD\u7F6E\u4E00\u4E9B\u5C5E\u6027\u5E76\u89E3\u9664\u4E00\u4E9B\u76D1\u542C</span>
      <span class="token keyword">const</span> unmountApp <span class="token operator">=</span> app<span class="token punctuation">.</span>unmount
      <span class="token comment">// \u8BB0\u5F55vue\u5B9E\u4F8B\uFF0CinstalledApps\u662F\u4E00\u4E2ASet\u96C6\u5408</span>
      installedApps<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span>
      app<span class="token punctuation">.</span><span class="token function-variable function">unmount</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// \u5F53app\u88AB\u5378\u8F7D\u65F6\uFF0C\u4ECE\u96C6\u5408\u4E2D\u5220\u9664</span>
        installedApps<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span>
        <span class="token comment">// \u5982\u679C\u6CA1\u6709\u4EFB\u4F55vue\u5B9E\u4F8B\u4E86\uFF0C\u4EE3\u8868router\u4E0D\u4F1A\u88AB\u4F7F\u7528\u4E86\uFF0C\u90A3\u4E48\u91CD\u7F6E\u4E00\u4E9B\u5C5E\u6027\u548C\u89E3\u7ED1\u76D1\u542C</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>installedApps<span class="token punctuation">.</span>size <span class="token operator">&lt;</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// invalidate the current navigation</span>
          pendingLocation <span class="token operator">=</span> <span class="token constant">START_LOCATION_NORMALIZED</span>
          removeHistoryListener <span class="token operator">&amp;&amp;</span> <span class="token function">removeHistoryListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
          removeHistoryListener <span class="token operator">=</span> <span class="token keyword">null</span>
          currentRoute<span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token constant">START_LOCATION_NORMALIZED</span>
          started <span class="token operator">=</span> <span class="token boolean">false</span>
          ready <span class="token operator">=</span> <span class="token boolean">false</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// \u6700\u540E\u6267\u884C\u5378\u8F7D\u65B9\u6CD5</span>
        <span class="token function">unmountApp</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>__DEV__ <span class="token operator">||</span> __FEATURE_PROD_DEVTOOLS__<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> isBrowser<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">addDevtools</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> router<span class="token punctuation">,</span> matcher<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
  
  <span class="token keyword">return</span> router
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br></div></div><p>\u53EF\u4EE5\u770B\u5230\u5728<code>install</code>\u65B9\u6CD5\u4E2D\uFF0C\u9996\u5148\u4F1A\u6CE8\u518C<code>RouterLink</code>\u3001<code>RouterView</code>\u4E24\u4E2A\u7EC4\u4EF6\uFF0C\u7136\u540E\u8BBE\u7F6E\u4E86\u4E24\u4E2A\u5168\u5C40\u7684\u5C5E\u6027<code>$router</code>\uFF08\u8DEF\u7531\u5B9E\u4F8B\uFF09\u3001<code>$route</code>\uFF08\u5F53\u524D\u7684\u8DEF\u7531\u4FE1\u606F\uFF09\uFF0C\u7D27\u63A5\u7740\u8FDB\u884C\u7B2C\u4E00\u6B21\u8DF3\u8F6C\u3002\u7D27\u63A5\u7740\u53C8\u5411<code>app</code>\u4E2D\u6CE8\u5165\u4E86\u4E09\u4E2A\u5C5E\u6027\uFF1A<code>routerKey</code>\u3001<code>routeLocationKey</code>\u3001<code>routerViewLocationKey</code>\uFF0C\u5206\u522B\u8868\u793A\u8DEF\u7531\u5B9E\u4F8B\u3001\u6DF1\u5EA6\u54CD\u5E94\u5F0F\u7684\u5F53\u524D\u8DEF\u7531\u4FE1\u606F\u5BF9\u8C61\u3001\u6D45\u5C42\u54CD\u5E94\u5F0F\u7684\u5F53\u524D\u8DEF\u7531\u4FE1\u606F\u5BF9\u8C61\uFF0C\u6CE8\u610F\u8FD9\u91CC\u7684<code>key</code>\u503C\u5B9E\u9645\u662F<code>Symbol</code>\u7C7B\u578B\uFF0C\u8FD9\u91CC\u5217\u4E3E\u7684<code>key</code>\u53EA\u662F\u53D8\u91CF\u7684\u540D\u79F0\u3002\u7136\u540E\u5BF9<code>app.unmount</code>vue\u5B9E\u4F8B\u7684\u5378\u8F7D\u65B9\u6CD5\u8FDB\u884C\u4E86\u62E6\u622A\uFF0C\u62E6\u622A\u7684\u4E3B\u8981\u76EE\u7684\u662F\u5728\u8DEF\u7531\u5B9E\u4F8B\u4E0D\u88AB\u4F7F\u7528\u65F6\uFF0C\u5C06\u4E00\u4E9B\u5C5E\u6027\u91CD\u7F6E\u5E76\u89E3\u7ED1\u4E00\u4E9B\u76D1\u542C\u4E8B\u4EF6\u3002\u6700\u540E\u5C06\u8DEF\u7531\u5B9E\u4F8B\u8FD4\u56DE\u3002</p><p><strong>\u603B\u7684\u6765\u8BF4\uFF0C<code>install</code>\u51FD\u6570\u505A\u4E86\u4EE5\u4E0B\u51E0\u4EF6\u4E8B\uFF1A</strong></p><ol><li>\u6CE8\u518C<code>RouterLink</code>\u3001<code>RouterView</code>\u7EC4\u4EF6</li><li>\u8BBE\u7F6E\u5168\u5C40\u5C5E\u6027<code>$router</code>\u3001<code>$route</code></li><li>\u6839\u636E\u5730\u5740\u680F\u8FDB\u884C\u9996\u6B21\u7684\u8DEF\u7531\u8DF3\u8F6C</li><li>\u5411<code>app</code>\u4E2D\u6CE8\u5165\u4E00\u4E9B\u8DEF\u7531\u76F8\u5173\u4FE1\u606F\uFF0C\u5982\u8DEF\u7531\u5B9E\u4F8B\u3001\u54CD\u5E94\u5F0F\u7684\u5F53\u524D\u8DEF\u7531\u4FE1\u606F\u5BF9\u8C61</li><li>\u62E6\u622A<code>app.unmount</code>\u65B9\u6CD5\uFF0C\u5728\u5378\u8F7D\u4E4B\u524D\u91CD\u7F6E\u4E00\u4E9B\u5C5E\u6027\u3001\u5220\u9664\u4E00\u4E9B\u76D1\u542C\u51FD\u6570</li><li>\u6700\u540E\u8FD4\u56DE<code>router</code>\u5B9E\u4F8B</li></ol>`,9),o=[e];function c(u,l,r,i,k,b){return a(),s("div",null,o)}var y=n(t,[["render",c]]);export{d as __pageData,y as default};