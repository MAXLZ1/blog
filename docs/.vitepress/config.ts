import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/blog/',
  title: '我的博客',
  lastUpdated: true,
  themeConfig: {
    docsDir: 'docs',
    lastUpdated: '上次更新',
    sidebar: [
      {
        text: 'Vue3源码解析',
        children: [
          { text: '源码目录结构', link: '/vue3-analysis/structure' },
          { text: 'reactive', link: '/vue3-analysis/reactive' },
          { text: 'ref', link: '/vue3-analysis/ref' },
        ]
      },
    ]
  },
  markdown: {
    lineNumbers: true
  },
})
