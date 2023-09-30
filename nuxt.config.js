export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head() {
    let i18nHead = {htmlAttrs: [], meta: [], link: []};
    if (this.$nuxtI18nHead) {
      i18nHead = this.$nuxtI18nHead({addSeoAttributes: true})
    }
    return {
      title: "Matteo Dell'Acqua",
      htmlAttrs: {
        ...i18nHead.htmlAttrs
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
        {"http-equiv": "X-UA-Compatible", content: "IE=edge"},
        ...i18nHead.meta
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
        ...i18nHead.link
      ],
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/fontawesome'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxt/content',
    '@nuxtjs/svg'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    quiet: false
  },

  generate: {
    fallback: true,
    subFolders: false,
    async routes() {
        const paths = [];
        const {$content} = require('@nuxt/content');
        const files = await $content('articles', {deep: true}).fetch();
        for (const file of files) {
          const slug = file.path.replace('/articles', '');
          const splitSlug = slug.split('/');
          paths.push('/' + [splitSlug[1], 'projects', file.slug].join('/'));
        }
        return paths;
    }
  },

  content: {
    markdown: {
        prism: {
            theme: 'prism-themes/themes/prism-material-oceanic.css'
        },
        remarkPlugins: [
            'remark-math'
        ],
        rehypePlugins: [
            ['rehype-mathjax', {
                tex: {
                    tags: 'ams'
                }
            }]
        ]
    }
  },

  loading: '~/components/loader.vue',

  image: {
  },

  i18n: {
    locales: [
      {
        code: 'en-us',
        iso: 'en-US',
        isCatchallLocale: true,
        file: 'en-us.js'
      },
      {
        code: 'it-it',
        iso: 'it-IT',
        file: 'it-it.js'
      }
    ],
    defaultLocale: 'en-us',
    strategy: 'prefix',
    lazy: true,
    langDir: '~/lang/',
    baseUrl:'https://matteoh2o1999.github.io'
    },

    vue: {
        config: {
            ignoredElements: [
                'mjx-container'
            ]
        }
    }
}
