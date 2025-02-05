import plugin from 'tailwindcss/plugin'

export default plugin(({ matchUtilities, theme }) => {
  matchUtilities(
    {
      'text-shadow': (value) => ({
        textShadow: value,
      }),
    },
    { values: theme('textShadow') }
  )
})
