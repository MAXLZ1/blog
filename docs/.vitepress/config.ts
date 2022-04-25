import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/blog/',
  title: '我的博客',
  lastUpdated: true,
  head: [
    [ 'script', { src: 'https://cdn.jsdelivr.net/npm/medium-zoom@1.0.6/dist/medium-zoom.min.js' } ],
    [ 'script', {}, `window.addEventListener("load", function (event) {
      let observer = new MutationObserver(() => {
        mediumZoom(document.querySelectorAll("img"), {
          background: "rgba(0, 0, 0, 0.5)",
        });
      });
      let options = {
        childList: true,
        subtree: true,
      };
      observer.observe(document.getElementById("app"), options);
    });`
    ]
  ],
  themeConfig: {
    repo: 'MAXLZ1',
    repoLabel: 'My Github',
    editLinks: true,
    docsRepo: 'MAXLZ1/blog',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinkText: "贡献此文档",
    lastUpdated: '上次更新',
    nav: [
      {
        text: 'Vue3',
        items: [
          { text: 'Vue3源码解析', link: '/vue3-analysis/structure'  }
        ]
      },
    ],
    sidebar: [
      {
        text: 'Vue3源码解析',
        children: [
          { text: '源码目录结构', link: '/vue3-analysis/structure' },
          {
            text: 'reactive',
            children: [
              { text: 'reactive', link: '/vue3-analysis/reactive/reactive' },
              { text: 'shallowReactive', link: '/vue3-analysis/reactive/shallowReactive' }
            ]
          },
          {
            text: 'refs',
            children: [
              { text: 'ref',  link: '/vue3-analysis/refs/ref' }
            ]
          },
        ]
      },
    ]
  },
  markdown: {
    lineNumbers: true
  },
})
