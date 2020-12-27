import Vue from 'vue'

export function humanizeNumber(value, { digits = 0, noZeroDigits = false } = {}) {
  let number = parseFloat(value)

  if (!isFinite(value ?? Infinity)) return value

  number = Number(number).toFixed(digits).toString().split('.')
  number[0] = number[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1,`)

  if (number[1] && noZeroDigits) number[1] = number[1].replace(/0+$/, '') ? number[1] : ''

  return number[1] ? number.join('.') : number[0]
}

const format = {
  number: humanizeNumber
}

Vue.use({
  install(Vue) {
    Vue.prototype.$format = format
  }
})
