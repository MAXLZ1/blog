import{_ as s,c as n,o as a,d as l}from"./app.e652fc7f.js";const i='{"title":"<router-link\\\\>","description":"","frontmatter":{},"headers":[],"relativePath":"vue-router/router-link.md"}',p={},o=l(`<h1 id="router-link" tabindex="-1">&lt;router-link&gt; <a class="header-anchor" href="#router-link" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u4F7F\u7528<code>router-link</code>\u6765\u521B\u5EFA\u94FE\u63A5\uFF0C\u53EF\u4EE5\u4F7F<code>vue-router</code>\u53EF\u4EE5\u5728\u4E0D\u91CD\u65B0\u52A0\u8F7D\u9875\u9762\u7684\u60C5\u51B5\u4E0B\u66F4\u6539URL\uFF0C\u5904\u7406URL\u7684\u751F\u6210\u53CA\u7F16\u7801\u3002</p><p>\u6E90\u7801\u4F4D\u7F6E\uFF1A<code>src/RouterLink.ts</code></p></div><div class="language-ts"><pre><code><span class="line"><span style="color:#676E95;font-style:italic;">// /*#__PURE__*/ \u7528\u4E8Etree-shaking\uFF0C\u5982\u679C\u672A\u4F7F\u7528\u4E0D\u6253\u5305</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> RouterLinkImpl </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">/*#__PURE__*/</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineComponent</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">RouterLink</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">props</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// \u76EE\u6807\u8DEF\u7531\u7684\u94FE\u63A5</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">to</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">type</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#FFCB6B;">String</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Object</span><span style="color:#A6ACCD;">] </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">PropType</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">RouteLocationRaw</span><span style="color:#89DDFF;">&gt;,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">required</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// \u51B3\u5B9A\u662F\u5426\u8C03\u7528router.push()\u8FD8\u662Frouter.replace()</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">replace</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Boolean</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// \u94FE\u63A5\u88AB\u6FC0\u6D3B\u65F6\uFF0C\u7528\u4E8E\u6E32\u67D3a\u6807\u7B7E\u7684class</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">activeClass</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">String</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// inactiveClass: String,</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// \u94FE\u63A5\u7CBE\u51C6\u6FC0\u6D3B\u65F6\uFF0C\u7528\u4E8E\u6E32\u67D3a\u6807\u7B7E\u7684class</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">exactActiveClass</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">String</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// \u662F\u5426\u4E0D\u5E94\u8BE5\u5C06\u5185\u5BB9\u5305\u88F9\u5728&lt;a/&gt;\u6807\u7B7E\u4E2D</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">custom</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Boolean</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// \u4F20\u9012\u7ED9aria-current\u5C5E\u6027\u7684\u503C\u3002https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">ariaCurrentValue</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">type</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">String</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">PropType</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">RouterLinkProps</span><span style="color:#A6ACCD;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">ariaCurrentValue</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">&gt;,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">default</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">page</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  useLink</span><span style="color:#89DDFF;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">setup</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">props</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> slots </span><span style="color:#89DDFF;">})</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// \u4F7F\u7528useLink\u521B\u5EFArouter-link\u6240\u9700\u7684\u4E00\u4E9B\u5C5E\u6027</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">link</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">reactive</span><span style="color:#F07178;">(</span><span style="color:#82AAFF;">useLink</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">props</span><span style="color:#F07178;">))</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// createRouter\u65F6\u4F20\u5165\u7684options</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">options</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">inject</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">routerKey</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">!</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// class\u5BF9\u8C61</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">elClass</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">computed</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      [</span><span style="color:#82AAFF;">getLinkClass</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">props</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">activeClass</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">options</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">linkActiveClass</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">router-link-active</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">      )]</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">link</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">isActive</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// \u88AB\u6FC0\u6D3B\u65F6\u7684class</span></span>
<span class="line"><span style="color:#F07178;">      [</span><span style="color:#82AAFF;">getLinkClass</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">props</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">exactActiveClass</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">options</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">linkExactActiveClass</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">router-link-exact-active</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">      )]</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">link</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">isExactActive</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// \u88AB\u7CBE\u51C6\u6FC0\u6D3B\u7684class</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// \u9ED8\u8BA4\u63D2\u69FD</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">children</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">slots</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">default</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">slots</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">default</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">link</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// \u5982\u679C\u8BBE\u7F6E\u4E86props.custom\uFF0C\u76F4\u63A5\u663E\u793Achldren\uFF0C\u53CD\u4E4B\u9700\u8981\u4F7F\u7528a\u6807\u7B7E\u5305\u88F9</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">props</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">custom</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">?</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">children</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">h</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">a</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">              </span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">aria-current</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">link</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">isExactActive</span></span>
<span class="line"><span style="color:#F07178;">                </span><span style="color:#89DDFF;">?</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">props</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">ariaCurrentValue</span></span>
<span class="line"><span style="color:#F07178;">                </span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">null,</span></span>
<span class="line"><span style="color:#F07178;">              href</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">link</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">href</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">              onClick</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">link</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">navigate</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">              class</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">elClass</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#A6ACCD;">children</span></span>
<span class="line"><span style="color:#F07178;">          )</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> RouterLink </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> RouterLinkImpl </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">unknown</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">():</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">$props</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">AllowedComponentProps</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#FFCB6B;">ComponentCustomProps</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#FFCB6B;">VNodeProps</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#FFCB6B;">RouterLinkProps</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">$slots</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">default</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">arg</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">UnwrapRef</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">ReturnType</span><span style="color:#89DDFF;">&lt;typeof</span><span style="color:#A6ACCD;"> useLink</span><span style="color:#89DDFF;">&gt;&gt;)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">VNode</span><span style="color:#A6ACCD;">[]</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">useLink</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">typeof</span><span style="color:#A6ACCD;"> useLink</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u53EF\u4EE5\u770B\u51FA<code>router-link</code>\u4E2D\u7684\u903B\u8F91\u5F88\u5927\u4E00\u90E8\u5206\u662F\u9760<code>useLink</code>\u8FDB\u884C\u5B9E\u73B0\u7684\u3002\u5173\u4E8E<code>useLink</code>\u53EF\u53C2\u8003\uFF1A<a href="https://maxlz1.github.io/blog/vue-router/useLink.html" target="_blank" rel="noopener noreferrer">useLink</a></p>`,4),e=[o];function t(c,r,y,F,D,C){return a(),n("div",null,e)}var u=s(p,[["render",t]]);export{i as __pageData,u as default};