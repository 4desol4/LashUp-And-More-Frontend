export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: { 
      grid: 'autoplace'
    },
   
    'postcss-custom-properties': {
      preserve: true,
      warnings: false
    }
  },
}