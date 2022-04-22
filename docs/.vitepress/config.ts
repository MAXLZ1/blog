import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '我的博客',
  lastUpdated: true,
  themeConfig: {
    docsDir: 'docs',
    lastUpdated: 'Last Updated',
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
  }
})
