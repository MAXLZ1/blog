import{e as i,r as c,o as p,c as t,a as s,w as r,v as u,b as g,t as d,g as x,F as y,h as E,k as q,u as C,j as A,d as h}from"./app.c4bbe33e.js";const v="/blog/assets/font.330ef538.png",w={width:"400",height:"100",viewBox:"0 0 400 100",xmlns:"http://www.w3.org/2000/svg"},m=["textLength","lengthAdjust"],_=s("label",null,"textLength:",-1),f=s("label",null,"lengthAdjust:",-1),b=["label","value"],k={name:"TextLength"},B=i({...k,setup(F){const a=["spacing","spacingAndGlyphs"],n=c(80),e=c(a[0]);return(D,o)=>(p(),t(y,null,[(p(),t("svg",w,[s("text",{x:"50",y:"20",textLength:n.value,lengthAdjust:e.value},"Hello world!",8,m)])),s("div",null,[_,r(s("input",{type:"range",min:"60",max:"140","onUpdate:modelValue":o[0]||(o[0]=l=>n.value=l)},null,512),[[u,n.value]]),g(d(n.value),1)]),s("div",null,[f,r(s("select",{"onUpdate:modelValue":o[1]||(o[1]=l=>e.value=l)},[(p(),t(y,null,E(a,l=>s("option",{key:l,label:l,value:l},null,8,b)),64))],512),[[x,e.value]])])],64))}}),L={width:"400",height:"200",viewBox:"0 0 400 200",xmlns:"http://www.w3.org/2000/svg"},M=s("defs",null,[s("path",{id:"bezierPath",d:"M40 100 Q150 40 200 100 T 380 100",style:{stroke:"gray",fill:"none"}})],-1),T=s("use",{"xlink:href":"#bezierPath"},null,-1),S={style:{"font-size":"24px"}},O=["startOffset"],P=s("label",null,"startOffset:",-1),z={name:"TextPath"},j=i({...z,setup(F){const a=c(0),n=q(()=>a.value+"%");return(e,D)=>(p(),t(y,null,[(p(),t("svg",L,[M,T,s("text",S,[s("textPath",{"xlink:href":"#bezierPath",startOffset:C(n)}," \u6C5F\u5C71\u4EE3\u6709\u624D\u4EBA\u51FA\uFF0C\u5404\u9886\u98CE\u9A9A\u6570\u767E\u5E74\u3002 ",8,O)])])),s("div",null,[P,r(s("input",{type:"range",min:"0",max:"100",step:"1","onUpdate:modelValue":D[0]||(D[0]=o=>a.value=o)},null,512),[[u,a.value]]),g(d(C(n)),1)])],64))}});const V=h("",34),I={class:"demo"},H=h("",7),$={class:"demo"},U=JSON.parse('{"title":"\u6587\u672C","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5B57\u4F53\u4E2D\u7684\u4E00\u4E9B\u6982\u5FF5","slug":"\u5B57\u4F53\u4E2D\u7684\u4E00\u4E9B\u6982\u5FF5","link":"#\u5B57\u4F53\u4E2D\u7684\u4E00\u4E9B\u6982\u5FF5","children":[]},{"level":2,"title":"<text>","slug":"text","link":"#text","children":[{"level":3,"title":"\u6587\u672C\u6837\u5F0F","slug":"\u6587\u672C\u6837\u5F0F","link":"#\u6587\u672C\u6837\u5F0F","children":[]},{"level":3,"title":"\u6587\u672C\u5BF9\u9F50","slug":"\u6587\u672C\u5BF9\u9F50","link":"#\u6587\u672C\u5BF9\u9F50","children":[]}]},{"level":2,"title":"<tspan>","slug":"tspan","link":"#tspan","children":[]},{"level":2,"title":"\u8BBE\u7F6E\u6587\u672C\u957F\u5EA6","slug":"\u8BBE\u7F6E\u6587\u672C\u957F\u5EA6","link":"#\u8BBE\u7F6E\u6587\u672C\u957F\u5EA6","children":[]},{"level":2,"title":"<switch>","slug":"switch","link":"#switch","children":[]},{"level":2,"title":"\u6587\u672C\u8DEF\u5F84","slug":"\u6587\u672C\u8DEF\u5F84","link":"#\u6587\u672C\u8DEF\u5F84","children":[]}],"relativePath":"html/svg/text.md"}'),G={name:"html/svg/text.md"},Q=Object.assign(G,{setup(F){return(a,n)=>(p(),t("div",null,[V,s("div",I,[A(B)]),H,s("div",$,[A(j)])]))}});export{U as __pageData,Q as default};
