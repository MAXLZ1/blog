import{_ as n,c as s,o as a,d as e}from"./app.86fdf71c.js";const m='{"title":"\u7EC4\u4EF6\u5185\u5BFC\u822A\u5B88\u536B","description":"","frontmatter":{},"headers":[{"level":2,"title":"onBeforeRouteLeave","slug":"onbeforerouteleave"},{"level":2,"title":"onBeforeRouteUpdate","slug":"onbeforerouteupdate"}],"relativePath":"vue-router/\u7EC4\u4EF6\u5185\u5BFC\u822A\u5B88\u536B.md"}',p={},t=e(`<h1 id="\u7EC4\u4EF6\u5185\u5BFC\u822A\u5B88\u536B" tabindex="-1">\u7EC4\u4EF6\u5185\u5BFC\u822A\u5B88\u536B <a class="header-anchor" href="#\u7EC4\u4EF6\u5185\u5BFC\u822A\u5B88\u536B" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u6DFB\u52A0\u4E00\u4E2A\u7EC4\u4EF6\u5185\u7684\u5BFC\u822A\u5B88\u536B\uFF0C\u5F53\u7EC4\u4EF6\u88AB\u5378\u8F7D\u65F6\uFF0C\u5BFC\u822A\u5B88\u536B\u88AB\u79FB\u9664\u3002<code>composition api</code>\u7684\u5F62\u5F0F\u6709\u4E24\u4E2A<code>onBeforeRouteLeave</code>\u3001<code>onBeforeRouteUpdate</code>\u3002</p><p>\u6587\u4EF6\u4F4D\u7F6E\uFF1A<code>src/navigationGuards.ts</code></p></div><h2 id="onbeforerouteleave" tabindex="-1">onBeforeRouteLeave <a class="header-anchor" href="#onbeforerouteleave" aria-hidden="true">#</a></h2><div class="language-ts line-numbers-mode"><pre><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">onBeforeRouteLeave</span><span class="token punctuation">(</span>leaveGuard<span class="token operator">:</span> NavigationGuard<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u5F00\u53D1\u6A21\u5F0F\u4E0B\u6CA1\u6709\u7EC4\u4EF6\u5B9E\u4F8B\uFF0C\u8FDB\u884C\u63D0\u793A\u5E76return</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>__DEV__ <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token function">getCurrentInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">warn</span><span class="token punctuation">(</span>
      <span class="token string">&#39;getCurrentInstance() returned null. onBeforeRouteLeave() must be called at the top of a setup function&#39;</span>
    <span class="token punctuation">)</span>
    <span class="token keyword">return</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// matchedRouteKey\u662F\u5728RouterView\u4E2D\u8FDB\u884Cprovide\u7684\uFF0C\u8868\u793A\u5F53\u524D\u7EC4\u4EF6\u6240\u5339\u914D\u5230\u5230\u7684\u8DEF\u7531\u8BB0\u5F55\uFF08\u7ECF\u8FC7\u6807\u51C6\u5316\u5904\u7406\u7684\uFF09</span>
  <span class="token keyword">const</span> activeRecord<span class="token operator">:</span> RouteRecordNormalized <span class="token operator">|</span> <span class="token keyword">undefined</span> <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>
    matchedRouteKey<span class="token punctuation">,</span>
    <span class="token comment">// to avoid warning</span>
    <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token keyword">as</span> <span class="token builtin">any</span>
  <span class="token punctuation">)</span><span class="token punctuation">.</span>value

  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>activeRecord<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    __DEV__ <span class="token operator">&amp;&amp;</span>
      <span class="token function">warn</span><span class="token punctuation">(</span>
        <span class="token string">&#39;No active route record was found when calling \`onBeforeRouteLeave()\`. Make sure you call this function inside of a component child of &lt;router-view&gt;. Maybe you called it inside of App.vue?&#39;</span>
      <span class="token punctuation">)</span>
    <span class="token keyword">return</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// \u6CE8\u518C\u94A9\u5B50</span>
  <span class="token function">registerGuard</span><span class="token punctuation">(</span>activeRecord<span class="token punctuation">,</span> <span class="token string">&#39;leaveGuards&#39;</span><span class="token punctuation">,</span> leaveGuard<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><p>\u56E0\u4E3A<code>onBeforeRouteLeave</code>\u662F\u4F5C\u7528\u5728\u7EC4\u4EF6\u4E0A\u7684\uFF0C\u6240\u4EE5<code>onBeforeRouteLeave</code>\u5F00\u5934\u5C31\u9700\u8981\u68C0\u67E5\u5F53\u524D\u662F\u5426\u6709<code>vue</code>\u5B9E\u4F8B\uFF08\u53EA\u5728\u5F00\u53D1\u73AF\u5883\u4E0B\uFF09\uFF0C\u5982\u679C\u6CA1\u6709\u5B9E\u4F8B\u8FDB\u884C\u63D0\u793A\u5E76<code>return</code>\u3002\u7136\u540E\u4F7F\u7528<code>inject</code>\u83B7\u53D6\u4E00\u4E2A<code>matchedRouteKey</code>\uFF0C\u5E76\u8D4B\u7ED9\u4E00\u4E2A<code>activeRecord</code>\uFF0C\u90A3\u4E48\u4E2A<code>activeRecord</code>\u662F\u4E2A\u4EC0\u4E48\u5462\uFF1F</p><p>\u8981\u60F3\u77E5\u9053<code>activeRecord</code>\u662F\u4EC0\u4E48\uFF0C\u6211\u4EEC\u5C31\u9700\u8981\u77E5\u9053<code>matchedRouteKey</code>\u662F\u4EC0\u4E48\u65F6\u5019<code>provide</code>\u7684\u3002\u56E0\u4E3A<code>onBeforeRouteLeave</code>\u5F0F\u4F5C\u7528\u5728\u8DEF\u7531\u7EC4\u4EF6\u4E2D\u7684\uFF0C\u800C\u8DEF\u7531\u7EC4\u4EF6\u4E00\u5B9A\u662F<code>RouterView</code>\u7684\u5B50\u5B59\u7EC4\u4EF6\uFF0C\u6240\u4EE5\u6211\u4EEC\u53EF\u4EE5\u770B\u4E0B<code>RouterView</code>\u3002</p><p>\u5728<code>RouterView</code>\u4E2D\u7684<code>setup</code>\u6709\u8FD9\u4E48\u51E0\u884C\u4EE3\u7801\uFF1A</p><div class="language-ts line-numbers-mode"><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><div class="highlighted">\xA0</div><br><br><br><br></div><pre><code><span class="token function">setup</span><span class="token punctuation">(</span>props<span class="token punctuation">,</span> <span class="token operator">...</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
  <span class="token keyword">const</span> injectedRoute <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>routerViewLocationKey<span class="token punctuation">)</span><span class="token operator">!</span>
  <span class="token keyword">const</span> routeToDisplay <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> props<span class="token punctuation">.</span>route <span class="token operator">||</span> injectedRoute<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
  <span class="token keyword">const</span> depth <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>viewDepthKey<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> matchedRouteRef <span class="token operator">=</span> <span class="token generic-function"><span class="token function">computed</span><span class="token generic class-name"><span class="token operator">&lt;</span>RouteLocationMatched <span class="token operator">|</span> <span class="token keyword">undefined</span><span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>
    <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> routeToDisplay<span class="token punctuation">.</span>value<span class="token punctuation">.</span>matched<span class="token punctuation">[</span>depth<span class="token punctuation">]</span>
  <span class="token punctuation">)</span>

  <span class="token function">provide</span><span class="token punctuation">(</span>viewDepthKey<span class="token punctuation">,</span> depth <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
  <span class="token function">provide</span><span class="token punctuation">(</span>matchedRouteKey<span class="token punctuation">,</span> matchedRouteRef<span class="token punctuation">)</span>
  <span class="token function">provide</span><span class="token punctuation">(</span>routerViewLocationKey<span class="token punctuation">,</span> routeToDisplay<span class="token punctuation">)</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>\u53EF\u4EE5\u770B\u5230\u5C31\u662F\u5728<code>RouterView</code>\u4E2D\u8FDB\u884C\u4E86<code>provide(matchedRouteKey, matchedRouteRef)</code>\u7684\uFF0C\u90A3\u4E48<code>matchedRouteRef</code>\u662F\u4EC0\u4E48\u5462\uFF1F\u9996\u5148<code>matchedRouteRef</code>\u662F\u4E2A\u8BA1\u7B97\u5C5E\u6027\uFF0C\u5B83\u7684\u8FD4\u56DE\u503C\u662F<code>routeToDisplay.value.matched[depth]</code>\u3002\u63A5\u7740\u6211\u4EEC\u770B<code>routeToDisplay</code>\u548C<code>depth</code>\uFF0C\u5148\u770B<code>routeToDisplay</code>\uFF0C<code>routeToDisplay</code>\u4E5F\u662F\u4E2A\u8BA1\u7B97\u5C5E\u6027\uFF0C\u5B83\u7684\u503C\u662F<code>props.route</code>\u6216<code>injectedRoute.value</code>\uFF0C\u56E0\u4E3A<code>props.route</code>\u4F7F\u7528\u6237\u4F20\u9012\u7684\uFF0C\u6240\u4EE5\u8FD9\u91CC\u6211\u4EEC\u53EA\u770B<code>injectedRoute.value</code>\uFF0C<code>injectedRoute</code>\u4E5F\u662F\u901A\u8FC7<code>inject</code>\u83B7\u53D6\u7684\uFF0C\u83B7\u53D6\u7684key\u662F<code>routerViewLocationKey</code>\u3002\u770B\u5230\u8FD9\u4E2A<code>key</code>\u662F\u4E0D\u662F\u6709\u70B9\u719F\u6089\uFF0C\u5728<code>vue-router</code>\u8FDB\u884C<code>install</code>\u4E2D\u5411<code>app</code>\u4E2D\u6CE8\u5165\u4E86\u51E0\u4E2A\u53D8\u91CF\uFF0C\u5176\u4E2D\u5C31\u6709<code>routerViewLocationKey</code>\u3002</p><div class="language-ts line-numbers-mode"><div class="highlight-lines"><br><br><br><br><div class="highlighted">\xA0</div><br><br><br><br></div><pre><code><span class="token function">install</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">//...</span>
  app<span class="token punctuation">.</span><span class="token function">provide</span><span class="token punctuation">(</span>routerKey<span class="token punctuation">,</span> router<span class="token punctuation">)</span>
  app<span class="token punctuation">.</span><span class="token function">provide</span><span class="token punctuation">(</span>routeLocationKey<span class="token punctuation">,</span> <span class="token function">reactive</span><span class="token punctuation">(</span>reactiveRoute<span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token comment">// currentRoute\u8DEF\u7531\u6807\u51C6\u5316\u5BF9\u8C61</span>
  app<span class="token punctuation">.</span><span class="token function">provide</span><span class="token punctuation">(</span>routerViewLocationKey<span class="token punctuation">,</span> currentRoute<span class="token punctuation">)</span>
  <span class="token comment">//...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>\u73B0\u5728\u6211\u4EEC\u77E5\u9053<code>routeToDisplay</code>\u662F\u5F53\u524D\u8DEF\u7531\u7684\u6807\u51C6\u5316\u5BF9\u8C61\u3002\u63A5\u4E0B\u6765\u770B<code>depth</code>\u662F\u4EC0\u4E48\u3002<code>depth</code>\u4E5F\u662F\u901A\u8FC7<code>inject(viewDepthKey)</code>\u7684\u65B9\u5F0F\u83B7\u53D6\u7684\uFF0C\u4F46\u5B83\u6709\u9ED8\u8BA4\u503C\uFF0C\u9ED8\u8BA4\u662F0\u3002\u4F60\u4F1A\u53D1\u73B0\u7D27\u8DDF\u7740\u6709\u4E00\u884C<code>provide(viewDepthKey, depth + 1)</code>\uFF0C<code>RouterView</code>\u53C8\u628A<code>viewDepthKey</code>\u6CE8\u5165\u8FDB\u53BB\u4E86\uFF0C\u4E0D\u8FC7\u8FD9\u6B21\u503C\u52A0\u4E861\u3002\u4E3A\u4EC0\u4E48\u8FD9\u4E48\u505A\u5462\uFF1F</p><p>\u6211\u4EEC\u77E5\u9053<code>RouterView</code>\u662F\u5141\u8BB8\u5D4C\u5957\u7684\uFF0C\u6765\u770B\u4E0B\u9762\u4EE3\u7801\uFF1A</p><div class="language-html line-numbers-mode"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>RouterView</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>RouterView</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>RouterView</span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>RouterView</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>RouterView</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>\u5728\u7B2C\u4E00\u5C42<code>RouterView</code>\u4E2D\uFF0C\u56E0\u4E3A\u627E\u4E0D\u5230\u5BF9\u5E94\u7684<code>viewDepthKey</code>\uFF0C\u6240\u4EE5<code>depth</code>\u662F0\uFF0C\u7136\u540E\u5C06<code>viewDepthKey</code>\u6CE8\u5165\u8FDB\u53BB\uFF0C\u5E76+1\uFF1B\u5728\u7B2C\u4E8C\u5C42\u4E2D\uFF0C\u6211\u4EEC\u53EF\u4EE5\u627E\u5230<code>viewDepthKey</code>\uFF08\u5728\u7B2C\u4E00\u6B21\u4E2D\u6CE8\u5165\uFF09\uFF0C<code>depth</code>\u4E3A1\uFF0C\u7136\u540E\u518D\u5C06<code>viewDepthKey</code>\u6CE8\u5165\uFF0C\u5E76+1\uFF0C\u6B64\u65F6<code>viewDepthKey</code>\u7684\u503C\u4F1A\u8986\u76D6\u7B2C\u4E00\u5C42\u7684\u6CE8\u5165\uFF1B\u5728\u7B2C\u4E09\u5C42\u4E2D\uFF0C\u6211\u4EEC\u4E5F\u53EF\u4EE5\u627E\u5230<code>viewDepthKey</code>\uFF08\u5728\u4E8C\u5C42\u4E2D\u6CE8\u5165\uFF0C\u5E76\u8986\u76D6\u4E86\u7B2C\u4E00\u5C42\u7684\u503C\uFF09\uFF0C\u6B64\u65F6<code>depth</code>\u4E3A2\u3002\u662F\u4E0D\u662F\u53D1\u73B0\u4E86\u4EC0\u4E48\uFF1F<code>depth</code>\u5176\u5B9E\u4EE3\u8868\u5F53\u524D<code>RouterView</code>\u5728\u5D4C\u5957<code>RouterView</code>\u4E2D\u7684\u6DF1\u5EA6\uFF08\u4ECE0\u5F00\u59CB\uFF09\u3002</p><p>\u73B0\u5728\u6211\u4EEC\u77E5\u9053\u4E86<code>routeToDisplay</code>\u548C<code>depth</code>\uFF0C\u73B0\u5728\u6211\u4EEC\u770B<code>routeToDisplay.value.matched[depth]</code>\u3002\u6211\u4EEC\u77E5\u9053<code>routeToDisplay.value.matched</code>\u4E2D\u5B58\u50A8\u7684\u662F\u5F53\u524D\u8DEF\u7531\u6240\u5339\u914D\u5230\u7684\u8DEF\u7531\uFF0C\u5E76\u4E14\u4ED6\u7684\u987A\u5E8F\u662F\u7236\u8DEF\u7531\u5728\u5B50\u8DEF\u7531\u524D\u3002\u90A3\u4E48\u7D22\u5F15\u4E3A<code>depth</code>\u7684\u8DEF\u7531\u6709\u4EC0\u4E48\u7279\u522B\u542B\u4E49\u5462\uFF1F\u6211\u4EEC\u770B\u4E0B\u9762\u4E00\u4E2A\u4F8B\u5B50\uFF1A</p><div class="language-ts line-numbers-mode"><pre><code><span class="token comment">// \u6CE8\u518C\u7684\u8DEF\u7531\u8868</span>
<span class="token keyword">const</span> router <span class="token operator">=</span> <span class="token function">createRouter</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
  routes<span class="token operator">:</span> <span class="token punctuation">{</span>
    path<span class="token operator">:</span> <span class="token string">&#39;/parent&#39;</span><span class="token punctuation">,</span>
    component<span class="token operator">:</span> Parent<span class="token punctuation">,</span>
    name<span class="token operator">:</span> <span class="token string">&#39;Parent&#39;</span><span class="token punctuation">,</span>
    children<span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        path<span class="token operator">:</span> <span class="token string">&#39;child&#39;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&#39;Child&#39;</span><span class="token punctuation">,</span>
        component<span class="token operator">:</span> Child<span class="token punctuation">,</span>
        children<span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            name<span class="token operator">:</span> <span class="token string">&#39;ChildChild&#39;</span><span class="token punctuation">,</span>
            path<span class="token operator">:</span> <span class="token string">&#39;childchild&#39;</span><span class="token punctuation">,</span>
            component<span class="token operator">:</span> ChildChild<span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><div class="language-html line-numbers-mode"><pre><code><span class="token comment">&lt;!-- Parent --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>parent<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>router-view</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>router-view</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token comment">&lt;!-- Child --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>child<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>router-view</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>router-view</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token comment">&lt;!-- ChildChild --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>childchild<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p>\u4F7F\u7528<code>router.resolve({ name: &#39;ChildChild&#39; })</code>\uFF0C\u6253\u5370\u5176\u7ED3\u679C\uFF0C\u89C2\u5BDF<code>matched</code>\u5C5E\u6027\u3002</p><ol><li>\u5728\u7B2C\u4E00\u5C42<code>RouterView</code>\u4E2D\uFF0C<code>depth</code>\u4E3A0\uFF0C<code>matched[0]</code>\u4E3A<code>{path:&#39;/parent&#39;, name: &#39;Parent&#39;, ...}</code>(\u6B64\u5904\u53EA\u5217\u51E0\u4E2A\u5173\u952E\u5C5E\u6027)\uFF0Clevel\u4E3A1</li><li>\u5728\u7B2C\u4E8C\u5C42<code>RouterView</code>\u4E2D\uFF0C<code>depth</code>\u4E3A1\uFF0C<code>matched[1]</code>\u4E3A<code>{path:&#39;/parent/child&#39;, name: &#39;Child&#39;, ...}</code>\uFF0Clevel\u4E3A2</li><li>\u5728\u7B2C\u4E09\u5C42<code>RouterView</code>\u4E2D\uFF0C<code>depth</code>\u4E3A2\uFF0C<code>matched[2]</code>\u4E3A<code>{path:&#39;/parent/child/childchild&#39;, name: &#39;ChildChild&#39;, ...}</code>\uFF0Clevel\u4E3A3</li></ol><p>\u901A\u8FC7\u89C2\u5BDF\uFF0C<code>depth</code>\u7684\u503C\u4E0E\u8DEF\u7531\u7684\u5339\u914D\u987A\u5E8F\u521A\u597D\u4E00\u81F4\u3002<code>matched[depth].name</code>\u6070\u597D\u4E0E\u5F53\u524D<code>resolve</code>\u7684<code>name</code>\u4E00\u81F4\u3002\u4E5F\u5C31\u662F\u8BF4<code>onBeforeRouteLeave</code>\u4E2D\u7684<code>activeRecord</code>\u5F53\u524D\u7EC4\u4EF6\u6240\u5339\u914D\u5230\u7684\u8DEF\u7531\u3002</p><p>\u63A5\u4E0B\u6765\u770B\u4E0B\u94A9\u5B50\u65F6\u5982\u4F55\u6CE8\u518C\u7684\uFF1F\u5728<code>onBeforeRouteLeave</code>\uFF0C\u4F1A\u8C03\u7528\u4E00\u4E2A<code>registerGuard</code>\u51FD\u6570\uFF0C<code>registerGuard</code>\u63A5\u6536\u4E09\u4E2A\u53C2\u6570\uFF1A<code>record</code>\uFF08\u6240\u5728\u7EC4\u4EF6\u6240\u5339\u914D\u5230\u7684\u6807\u51C6\u5316\u8DEF\u7531\uFF09\u3001<code>name</code>\uFF08\u94A9\u5B50\u540D\uFF0C\u53EA\u80FD\u53D6<code>leaveGuards</code>\u3001<code>updateGuards</code>\u4E4B\u4E00\uFF09\u3001<code>guard</code>\uFF08\u5F85\u6DFB\u52A0\u7684\u5BFC\u822A\u5B88\u536B\uFF09</p><div class="language-ts line-numbers-mode"><pre><code><span class="token keyword">function</span> <span class="token function">registerGuard</span><span class="token punctuation">(</span>
  record<span class="token operator">:</span> RouteRecordNormalized<span class="token punctuation">,</span>
  name<span class="token operator">:</span> <span class="token string">&#39;leaveGuards&#39;</span> <span class="token operator">|</span> <span class="token string">&#39;updateGuards&#39;</span><span class="token punctuation">,</span>
  guard<span class="token operator">:</span> NavigationGuard
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u4E00\u4E2A\u5220\u9664\u94A9\u5B50\u7684\u51FD\u6570</span>
  <span class="token keyword">const</span> <span class="token function-variable function">removeFromList</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    record<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>guard<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// \u5378\u8F7D\u540E\u79FB\u9664\u94A9\u5B50</span>
  <span class="token function">onUnmounted</span><span class="token punctuation">(</span>removeFromList<span class="token punctuation">)</span>
  <span class="token comment">// \u88ABkeep-alive\u7F13\u5B58\u7684\u7EC4\u4EF6\u5931\u6D3B\u65F6\u79FB\u9664\u94A9\u5B50</span>
  <span class="token function">onDeactivated</span><span class="token punctuation">(</span>removeFromList<span class="token punctuation">)</span>

  <span class="token comment">// \u88ABkeep-alive\u7F13\u5B58\u7684\u7EC4\u4EF6\u6FC0\u6D3B\u65F6\u6DFB\u52A0\u94A9\u5B50</span>
  <span class="token function">onActivated</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    record<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>guard<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token comment">// \u6DFB\u52A0\u94A9\u5B50\uFF0Crecord[name]\u662F\u4E2Aset\uFF0C\u5728\u8DEF\u7531\u6807\u51C6\u5316\u65F6\u5904\u7406\u7684</span>
  record<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>guard<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><h2 id="onbeforerouteupdate" tabindex="-1">onBeforeRouteUpdate <a class="header-anchor" href="#onbeforerouteupdate" aria-hidden="true">#</a></h2><p><code>onBeforeRouteUpdate</code>\u7684\u5B9E\u73B0\u4E0E<code>onBeforeRouteLeave</code>\u7684\u5B9E\u73B0\u5B8C\u5168\u4E00\u81F4\uFF0C\u53EA\u662F\u8C03\u7528<code>registerGuard</code>\u4F20\u9012\u7684\u53C2\u6570\u4E0D\u4E00\u6837\u3002</p><div class="language-ts line-numbers-mode"><pre><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">onBeforeRouteUpdate</span><span class="token punctuation">(</span>updateGuard<span class="token operator">:</span> NavigationGuard<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>__DEV__ <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token function">getCurrentInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">warn</span><span class="token punctuation">(</span>
      <span class="token string">&#39;getCurrentInstance() returned null. onBeforeRouteUpdate() must be called at the top of a setup function&#39;</span>
    <span class="token punctuation">)</span>
    <span class="token keyword">return</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> activeRecord<span class="token operator">:</span> RouteRecordNormalized <span class="token operator">|</span> <span class="token keyword">undefined</span> <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>
    matchedRouteKey<span class="token punctuation">,</span>
    <span class="token comment">// to avoid warning</span>
    <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token keyword">as</span> <span class="token builtin">any</span>
  <span class="token punctuation">)</span><span class="token punctuation">.</span>value

  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>activeRecord<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    __DEV__ <span class="token operator">&amp;&amp;</span>
      <span class="token function">warn</span><span class="token punctuation">(</span>
        <span class="token string">&#39;No active route record was found when calling \`onBeforeRouteUpdate()\`. Make sure you call this function inside of a component child of &lt;router-view&gt;. Maybe you called it inside of App.vue?&#39;</span>
      <span class="token punctuation">)</span>
    <span class="token keyword">return</span>
  <span class="token punctuation">}</span>

  <span class="token function">registerGuard</span><span class="token punctuation">(</span>activeRecord<span class="token punctuation">,</span> <span class="token string">&#39;updateGuards&#39;</span><span class="token punctuation">,</span> updateGuard<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div>`,25),o=[t];function c(l,u,r,i,d,k){return a(),s("div",null,o)}var g=n(p,[["render",c]]);export{m as __pageData,g as default};
