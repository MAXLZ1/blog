import{e as f,r as a,k as b,o as e,c as p,a as s,n as w,u as x,w as n,v as t,g,F as m,h as A,j as k,d as V}from"./app.b1e81aaf.js";const S={width:"400",height:"400",viewBox:"-5 -5 110 110",xmlns:"http://www.w3.org/2000/svg"},U={class:"form"},B={class:"form-item"},j=s("label",null,"stroke:",-1),T={class:"form-item"},O=s("label",null,"stroke-width:",-1),L={class:"form-item"},N=s("label",null,"stroke-opacity:",-1),R={class:"form-item"},z=s("label",null,"stroke-linecap:",-1),P=["label","value"],$={class:"form-item"},I=s("label",null,"stroke-linejoin:",-1),M=["label","value"],W={class:"form-item"},J=s("label",null,"stroke-miterlimit:",-1),G={class:"form-item"},H=s("label",null,"fill:",-1),K={class:"form-item"},Q=s("label",null,"fill-opacity:",-1),X={class:"form-item"},Y=s("label",null,"fill-rule:",-1),Z=["label","value"],ss={name:"SvgStyle"},ls=f({...ss,setup(q){const r=["nonzero","evenodd"],c=["butt","round","square"],_=["miter","round","bevel"],D=a("#e5b12d"),d=a(2),F=a(1),y=a(c[0]),i=a(_[0]),u=a(4),h=a("#08b940"),v=a(1),C=a(r[0]),E=b(()=>({stroke:D.value,strokeWidth:d.value,strokeOpacity:F.value,strokeLinecap:y.value,strokeLinejoin:i.value,strokemiterlimit:u.value,fill:h.value,fillOpacity:v.value,fillRule:C.value}));return(ts,o)=>(e(),p("div",null,[(e(),p("svg",S,[s("polygon",{style:w(x(E)),points:"50,0 21,90 98,35 2,35 79,90"},null,4)])),s("div",U,[s("div",B,[j,n(s("input",{type:"color","onUpdate:modelValue":o[0]||(o[0]=l=>D.value=l)},null,512),[[t,D.value]])]),s("div",T,[O,n(s("input",{type:"number",min:"0","onUpdate:modelValue":o[1]||(o[1]=l=>d.value=l)},null,512),[[t,d.value]])]),s("div",L,[N,n(s("input",{type:"range",min:"0",max:"1",step:"0.1","onUpdate:modelValue":o[2]||(o[2]=l=>F.value=l)},null,512),[[t,F.value]])]),s("div",R,[z,n(s("select",{"onUpdate:modelValue":o[3]||(o[3]=l=>y.value=l)},[(e(),p(m,null,A(c,l=>s("option",{key:l,label:l,value:l},null,8,P)),64))],512),[[g,y.value]])]),s("div",$,[I,n(s("select",{"onUpdate:modelValue":o[4]||(o[4]=l=>i.value=l)},[(e(),p(m,null,A(_,l=>s("option",{key:l,label:l,value:l},null,8,M)),64))],512),[[g,i.value]])]),s("div",W,[J,n(s("input",{type:"number",min:"0","onUpdate:modelValue":o[5]||(o[5]=l=>u.value=l)},null,512),[[t,u.value]])]),s("div",G,[H,n(s("input",{type:"color","onUpdate:modelValue":o[6]||(o[6]=l=>h.value=l)},null,512),[[t,h.value]])]),s("div",K,[Q,n(s("input",{type:"range",min:"0",max:"1",step:"0.1","onUpdate:modelValue":o[7]||(o[7]=l=>v.value=l)},null,512),[[t,v.value]])]),s("div",X,[Y,n(s("select",{"onUpdate:modelValue":o[8]||(o[8]=l=>C.value=l)},[(e(),p(m,null,A(r,l=>s("option",{key:l,label:l,value:l},null,8,Z)),64))],512),[[g,C.value]])])])]))}}),os=V(`<h1 id="\u57FA\u672C\u56FE\u5F62" tabindex="-1">\u57FA\u672C\u56FE\u5F62 <a class="header-anchor" href="#\u57FA\u672C\u56FE\u5F62" aria-hidden="true">#</a></h1><h2 id="\u7EBF\u6BB5" tabindex="-1">\u7EBF\u6BB5 <a class="header-anchor" href="#\u7EBF\u6BB5" aria-hidden="true">#</a></h2><div class="language-html"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">line</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">x1</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">start-x</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">y1</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">start-y</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">x2</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">end-x</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">y2</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">end-y</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"></span></code></pre></div><h2 id="\u77E9\u5F62" tabindex="-1">\u77E9\u5F62 <a class="header-anchor" href="#\u77E9\u5F62" aria-hidden="true">#</a></h2><div class="language-html"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">rect</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">x</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">left-x</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">y</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">top-y</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">width</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">width</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">height</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">height</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"></span></code></pre></div><h2 id="\u5706\u5F62" tabindex="-1">\u5706\u5F62 <a class="header-anchor" href="#\u5706\u5F62" aria-hidden="true">#</a></h2><div class="language-html"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">circle</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">cx</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">center-x</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">cy</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">center-y</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">radius</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"></span></code></pre></div><h2 id="\u692D\u5706" tabindex="-1">\u692D\u5706 <a class="header-anchor" href="#\u692D\u5706" aria-hidden="true">#</a></h2><div class="language-html"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">ellipse</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">cx</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">center-x</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">cy</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">center-y</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">rx</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">x-radius</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">ry</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">y-radius</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"></span></code></pre></div><h2 id="\u5C01\u95ED\u56FE\u5F62" tabindex="-1">\u5C01\u95ED\u56FE\u5F62 <a class="header-anchor" href="#\u5C01\u95ED\u56FE\u5F62" aria-hidden="true">#</a></h2><div class="language-html"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">polyon</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">points</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">points-list</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"></span></code></pre></div><div class="language-html"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">svg</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">width</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">200</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">height</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">200</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">viewBox</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">0 0 200 200</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">xmlns</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">http://www.w3.org/2000/svg</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">polygon</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">points</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">20 0, 90 100, 180 120, 0 200</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">stroke</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">#000</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">fill</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">none</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">/&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">svg</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><div class="demo"><svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><polygon points="20,0 90,100 180,120 0,200" stroke="#000" fill="none"></polygon></svg></div><p><code>points</code>\u4E2D\u7684\u70B9\u7684\u51E0\u79CD\u5206\u5272\u5F62\u5F0F\uFF1A</p><ul><li>\u4F7F\u7528\u7A7A\u683C\u5206\u5272\u591A\u4E2A\u70B9\uFF0C\u9017\u53F7\u5206\u5272\u5355\u4E2A\u70B9\u7684\u6A2A\u7EB5\u5750\u6807\uFF1A<code>20,0 90,100 180,120 0,200</code></li><li>\u4F7F\u7528\u9017\u53F7\u5206\u5272\u591A\u4E2A\u70B9\uFF0C\u7A7A\u683C\u5206\u5272\u5355\u4E2A\u70B9\u7684\u6A2A\u7EB5\u5750\u6807\uFF1A<code>20 0, 90 100, 180 120, 0 200</code></li><li>\u4F7F\u7528\u7A7A\u683C\u5206\u5272\u591A\u4E2A\u70B9\u53CA\u5355\u4E2A\u70B9\u7684\u6A2A\u7EB5\u5750\u6807\uFF1A<code>20 0 90 100 180 120 0 200</code></li><li>\u4F7F\u7528\u9017\u53F7\u5206\u5272\u591A\u4E2A\u70B9\u53CA\u5355\u4E2A\u70B9\u7684\u6A2A\u7EB5\u5750\u6807\uFF1A<code>20,0,90,100,180,120,0,200</code></li></ul><h2 id="\u6298\u7EBF" tabindex="-1">\u6298\u7EBF <a class="header-anchor" href="#\u6298\u7EBF" aria-hidden="true">#</a></h2><div class="language-html"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">polyline</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">points</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">20 0, 90 100, 180 120, 0 200</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"></span></code></pre></div><div class="language-html"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">svg</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">width</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">200</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">height</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">200</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">viewBox</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">0 0 200 200</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">xmlns</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">http://www.w3.org/2000/svg</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">polyline</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">points</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">20 0, 90 100, 180 120, 0 200</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">stroke</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">#000</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">fill</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">none</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">/&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">svg</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><div class="demo"><svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><polyline points="20 0, 90 100, 180 120, 0 200" stroke="#000" fill="none"></polyline></svg></div><h2 id="\u7B14\u753B\u5C5E\u6027\u53CA\u586B\u5145\u5C5E\u6027" tabindex="-1">\u7B14\u753B\u5C5E\u6027\u53CA\u586B\u5145\u5C5E\u6027 <a class="header-anchor" href="#\u7B14\u753B\u5C5E\u6027\u53CA\u586B\u5145\u5C5E\u6027" aria-hidden="true">#</a></h2><p>\u7B14\u753B\u5C5E\u6027\u90FD\u4EE5<code>stroke-</code>\u5F00\u5934\uFF1A</p><table><thead><tr><th>\u5C5E\u6027</th><th>\u503C</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>stroke</td><td>\u4EFB\u4F55\u8868\u793A\u989C\u8272\u7684\u65B9\u5F0F\uFF1A<code>16\u8FDB\u5236</code>\u3001<code>rgb</code>\u3001<code>hsl</code>\u7B49</td><td>\u7B14\u753B\u989C\u8272</td></tr><tr><td>stroke-width</td><td>\u9ED8\u8BA4\u4E3A1</td><td>\u7B14\u753B\u5BBD\u5EA6</td></tr><tr><td>stroke-opacity</td><td>\u6570\u5B57\uFF0C0~1\uFF0C0\u662F\u5B8C\u5168\u900F\u660E\uFF0C1\u662F\u5B8C\u5168\u4E0D\u900F\u660E</td><td>\u7B14\u753B\u900F\u660E\u5EA6</td></tr><tr><td>stroke-linecap</td><td><code>butt</code>\uFF08\u9ED8\u8BA4\uFF09\u3001<code>round</code>\u3001<code>square</code></td><td>\u7EBF\u5934\u5C3E\u7684\u5F62\u72B6</td></tr><tr><td>stroke-linejoin</td><td><code>miter</code>\uFF08\u9ED8\u8BA4\u503C\uFF09\u3001<code>round</code>\u3001<code>bevel</code></td><td>\u56FE\u5F62\u7684\u68F1\u89D2\u5904\u4EA4\u53C9\u7684\u6548\u679C</td></tr><tr><td>stroke-miterlimit</td><td>\u9ED8\u8BA4\u4E3A4</td><td>\u76F8\u4EA4\u5904\u663E\u793A\u7684\u5BBD\u5EA6\u4E0E\u7EBF\u5BBD\u7684\u6700\u5927\u6BD4\u4F8B</td></tr></tbody></table><p>\u586B\u5145\u5C5E\u6027\u90FD\u4EE5<code>fill-</code>\u5F00\u5934\uFF1A</p><table><thead><tr><th>\u5C5E\u6027</th><th>\u503C</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>fill</td><td>\u4EFB\u4F55\u8868\u793A\u989C\u8272\u7684\u65B9\u5F0F\uFF1A<code>16\u8FDB\u5236</code>\u3001<code>rgb</code>\u3001<code>hsl</code>\u7B49</td><td>\u586B\u5145\u989C\u8272</td></tr><tr><td>fill-opacity</td><td>0~1</td><td>\u586B\u5145\u900F\u660E\u5EA6</td></tr><tr><td>fill-rule</td><td><code>nonzero</code>\uFF08\u9ED8\u8BA4\u503C\uFF09\u3001<code>evenodd</code></td><td>\u786E\u5B9A\u4E00\u4E2A\u591A\u8FB9\u5F62\u5185\u90E8\u533A\u57DF\u7684\u7B97\u6CD5\u3002</td></tr></tbody></table><p>\u5BF9\u4E8E\u4EE5\u4E0A\u6837\u5F0F\uFF0C\u53EF\u4EE5\u5728<code>style</code>\u8FDB\u884C\u8BBE\u7F6E\uFF0C\u4E5F\u53EF\u4EE5\u76F4\u63A5\u5728\u6807\u7B7E\u4E0A\u8BBE\u7F6E\u3002</p><p><strong>\u5C5E\u6027\u6D4B\u8BD5</strong></p>`,26),as={class:"demo"},ps=JSON.parse('{"title":"\u57FA\u672C\u56FE\u5F62","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u7EBF\u6BB5","slug":"\u7EBF\u6BB5"},{"level":2,"title":"\u77E9\u5F62","slug":"\u77E9\u5F62"},{"level":2,"title":"\u5706\u5F62","slug":"\u5706\u5F62"},{"level":2,"title":"\u692D\u5706","slug":"\u692D\u5706"},{"level":2,"title":"\u5C01\u95ED\u56FE\u5F62","slug":"\u5C01\u95ED\u56FE\u5F62"},{"level":2,"title":"\u6298\u7EBF","slug":"\u6298\u7EBF"},{"level":2,"title":"\u7B14\u753B\u5C5E\u6027\u53CA\u586B\u5145\u5C5E\u6027","slug":"\u7B14\u753B\u5C5E\u6027\u53CA\u586B\u5145\u5C5E\u6027"}],"relativePath":"html/svg/graphics.md"}'),ns={name:"html/svg/graphics.md"},rs=Object.assign(ns,{setup(q){return(r,c)=>(e(),p("div",null,[os,s("div",as,[k(ls)])]))}});export{ps as __pageData,rs as default};
