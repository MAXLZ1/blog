import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/blog/',
  title: '我的博客',
  lastUpdated: false,
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
    repo: 'MAXLZ1/blog',
    repoLabel: 'Github',
    editLinks: true,
    docsRepo: 'MAXLZ1/blog',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinkText: "纠正文档",
    lastUpdated: '上次更新',
    algolia: {
      appId: 'M5IBJH6J62',
      apiKey: '4ca33066d2f74526b478fa9d236485f1',
      indexName: 'maxlz1',
    },
    nav: [
      {
        text: '源码解析',
        items: [
          { text: 'Vue3源码解析', link: '/vue3-analysis/structure', activeMatch: '^/$|^/vue3-analysis/' },
          { text: 'vue-router源码解析', link: '/vue-router/preface', activeMatch: '^/$|^/vue-router/' },
          { text: 'pinia源码解析', link: '/pinia' },
        ]
      },
    ],
    sidebar: {
      '/vue3-analysis': [
        {
          text: 'Vue3源码解析',
          children: [
            { text: '源码目录结构', link: '/vue3-analysis/structure' },
            {
              text: 'reactive',
              children: [
                { text: 'reactive', link: '/vue3-analysis/reactive/reactive' },
                { text: 'shallowReactive', link: '/vue3-analysis/reactive/shallowReactive' },
                { text: 'readonly', link: '/vue3-analysis/reactive/readonly' },
                { text: 'shallowReadonly', link: '/vue3-analysis/reactive/shallowReadonly' },
                { text: 'toRaw', link: '/vue3-analysis/reactive/toRaw' },
              ]
            },
            {
              text: 'refs',
              children: [
                { text: 'ref',  link: '/vue3-analysis/refs/ref' },
                { text: 'shallowRef',  link: '/vue3-analysis/refs/shallowRef' },
                { text: 'customRef',  link: '/vue3-analysis/refs/customRef' },
              ]
            },
            {
              text: 'effect',
              children: [
                { text: '依赖收集', link: '/vue3-analysis/effect/依赖收集' },
                { text: '触发依赖', link: '/vue3-analysis/effect/触发依赖' },
              ]
            },
            { text: 'computed', link: '/vue3-analysis/computed' },
            { text: 'scheduler', link: '/vue3-analysis/scheduler/scheduler' },
            {
              text: 'watch',
              children: [
                { text: 'watch', link: '/vue3-analysis/watch/watch' },
              ]
            },
          ]
        }
      ],
      '/vue-router': [
        {
          text: 'vue-router源码解析',
          children: [
            {
              text: '前言',
              link: '/vue-router/preface'
            },
            {
              text: 'app.use(router)',
              link: '/vue-router/router-install'
            },
            {
              text: 'createWebHistory',
              link: '/vue-router/createWebHistory'
            },
            {
              text: 'createWebHashHistory',
              link: '/vue-router/createWebHashHistory'
            },
            {
              text: 'createMemoryHistory',
              link: '/vue-router/createMemoryHistory'
            },
            {
              text: 'routerMatcher',
              link: '/vue-router/routerMatcher'
            },
            {
              text: 'createRouter',
              link: '/vue-router/createRouter',
            },
            {
              text: 'router方法',
              children: [
                {
                  text: 'addRoute',
                  link: '/vue-router/addRoute'
                },
                {
                  text: 'removeRoute',
                  link: '/vue-router/removeRoute'
                },
                {
                  text: 'hasRoute',
                  link: '/vue-router/hasRoute'
                },
              ]
            },
          ],
        }
      ]
    }
  },
  markdown: {
    lineNumbers: true
  },
})
