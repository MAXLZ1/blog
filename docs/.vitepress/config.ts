import { defineConfigWithTheme } from 'vitepress'
import baseConfig from 'vitepress-theme/config'
import type { Config as ThemeConfig } from 'vitepress-theme'

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,
  base: '/blog/',
  title: '我的博客',
  lastUpdated: false,
  lang: 'z',
  themeConfig: {
    // repo: 'MAXLZ1/blog',
    // repoLabel: 'Github',
    // editLinks: true,
    // docsRepo: 'MAXLZ1/blog',
    // docsDir: 'docs',
    // docsBranch: 'main',
    // editLinkText: "纠正文档",
    // lastUpdated: '上次更新',
    algolia: {
      appId: 'M5IBJH6J62',
      apiKey: '4ca33066d2f74526b478fa9d236485f1',
      indexName: 'maxlz1',
    },
    nav: [
      {
        text: 'JavaScript',
        link: '/javascript/void',
        activeMatch: '^/$|^/javascript/',
      },
      {
        text: '源码解析',
        items: [
          { text: 'Vue3源码解析', link: '/vue3-analysis/structure', activeMatch: '^/$|^/vue3-analysis/' },
          { text: 'vue-router源码解析', link: '/vue-router/preface', activeMatch: '^/$|^/vue-router/' },
          { text: 'pinia源码解析', link: '/pinia/preface', activeMatch: '^/$|^/pinia/' },
        ]
      },
    ],
    sidebar: {
      '/vue3-analysis/': getVueSidebar(),
      '/vue-router/': getVueRouterSidebar(),
      '/pinia/': getPiniaSidebar(),
      '/javascript/': getJavaScriptSidebar(),
    },
  },
  markdown: {
    lineNumbers: false
  },
})

function getVueSidebar() {
  return [
    {
      text: '源码目录结构',
      items: [
        {
          text: '源码目录结构',
          link: '/vue3-analysis/structure'
        }
      ]
    },
    {
      text: '响应系统',
      items: [
        {
          text: '副作用函数与响应式数据',
          link: '/vue3-analysis/reactivity/副作用函数与响应式数据'
        },
        {
          text: 'vue3的响应系统分析',
          link: '/vue3-analysis/reactivity/vue3的响应系统分析'
        },
        {
          text: 'effectScope',
          link: '/vue3-analysis/reactivity/effectScope'
        },
        {
          text: 'computed',
          link: '/vue3-analysis/reactivity/computed'
        },
        {
          text: 'watch',
          link: '/vue3-analysis/reactivity/watch'
        },
        {
          text: 'scheduler',
          link: '/vue3-analysis/reactivity/scheduler'
        },
        {
          text: 'reactive(Object)',
          link: '/vue3-analysis/reactivity/reactive-object'
        },
        {
          text: 'reactive(Collection)',
          link: '/vue3-analysis/reactivity/reactive-collection'
        },
        {
          text: 'ref',
          link: '/vue3-analysis/reactivity/ref'
        },
        {
          text: '响应式API：工具函数',
          link: '/vue3-analysis/reactivity/utils'
        },
        // { text: 'toRaw', link: '/vue3-analysis/reactive/toRaw' },
      ]
    },

    // {
    //   text: 'effect',
    //   items: [
    //     { text: '依赖收集', link: '/vue3-analysis/effect/依赖收集' },
    //     { text: '触发依赖', link: '/vue3-analysis/effect/触发依赖' },
    //   ]
    // },
    // { text: 'scheduler', link: '/vue3-analysis/scheduler/scheduler' },
    // {
    //   text: 'watch',
    //   items: [
    //     { text: 'watch', link: '/vue3-analysis/watch/watch' },
    //   ]
    // },
  ]
}

function getVueRouterSidebar() {
  return [
    {
      text: '前言',
      items: [
        {
          text: '前言',
          link: '/vue-router/preface'
        }
      ]
    },
    {
      text: 'Install',
      items: [
        {
          text: 'Install',
          link: '/vue-router/router-install'
        },
      ]
    },
    {
      text: 'History',
      items: [
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
      ]
    },
    {
      text: 'routerMatcher',
      items: [
        {
          text: 'routerMatcher',
          link: '/vue-router/routerMatcher'
        },
      ]
    },
    {
      text: 'createRouter',
      items: [
        {
          text: 'createRouter',
          link: '/vue-router/createRouter',
        },
      ]
    },
    {
      text: 'router方法',
      items: [
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
        {
          text: 'getRoutes',
          link: '/vue-router/getRoutes'
        },
        {
          text: 'resolve',
          link: '/vue-router/resolve'
        },
        {
          text: 'push',
          link: '/vue-router/push'
        },
        {
          text: 'replace',
          link: '/vue-router/replace'
        },
        {
          text: 'go',
          link: '/vue-router/go'
        },
        {
          text: 'back、forward',
          link: '/vue-router/back、forward'
        },
        {
          text: '全局导航守卫',
          link: '/vue-router/全局导航守卫'
        },
        {
          text: 'isReady',
          link: '/vue-router/isReady'
        },
      ]
    },
    {
      text: 'Composition API',
      items: [
        {
          text: '组件内导航守卫',
          link: '/vue-router/组件内导航守卫'
        },
        {
          text: 'useRoute、useRouter',
          link: '/vue-router/useRoute、useRouter'
        },
        {
          text: 'useLink',
          link: '/vue-router/useLink'
        },
      ]
    },
    {
      text: '路由组件',
      items: [
        {
          text: 'router-link',
          link: '/vue-router/router-link',
        },
        {
          text: 'router-view',
          link: '/vue-router/router-view',
        },
      ],
    },
    {
      text: '总结',
      items: [
        {
          text: '总结',
          link: '/vue-router/总结'
        }
      ]
    }
  ]
}

function getPiniaSidebar() {
  return [
    {
      text: '前言',
      items: [
        {
          text: '前言',
          link: '/pinia/preface'
        },
      ]
    },
    {
      text: 'createPinia',
      items: [
        {
          text: 'createPinia',
          link: '/pinia/createPinia'
        },
      ]
    },
    {
      text: 'defineStore',
      items: [
        {
          text: 'defineStore',
          link: '/pinia/defineStore'
        },
      ]
    },
    {
      text: 'storeToRefs',
      items: [
        {
          text: 'storeToRefs',
          link: '/pinia/storeToRefs'
        },
      ]
    },
    {
      text: 'api without setup()',
      link: '/pinia/mapHelper',
      items: [
        {
          text: 'mapStores',
          link: '/pinia/mapStores',
        },
        {
          text: 'mapState、mapGetters',
          link: '/pinia/mapState、mapGetters',
        },
        {
          text: 'mapActions',
          link: '/pinia/mapActions',
        },
        {
          text: 'mapWritableState',
          link: '/pinia/mapWritableState',
        },
      ]
    },
  ]
}

function getJavaScriptSidebar() {
  return [
    {
      text: 'JavasSript',
      items: [
        {
          text: 'void',
          link: '/javascript/void'
        },
      ]
    }
  ]
}
