export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: { 
      grid: 'autoplace'
    },
   
    ...(process.env.NODE_ENV === 'production' ? {
      'postcss-custom-properties': {
        preserve: true,
        warnings: false
      },
  
      '@fullhuman/postcss-purgecss': {
        content: [
          './src/**/*.{js,jsx,ts,tsx}',
          './index.html'
        ],
        safelist: [
          /^dark:/,
          /^light:/,
          /^text-(white|gray|charcoal|black)/,
          /^bg-(white|gray|charcoal|black)/,
          /^border-(white|gray|charcoal|black)/,
          'dark',
          'light'
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
      }
    } : {
      'postcss-custom-properties': {
        preserve: true,
        warnings: false
      }
    })
  },
}