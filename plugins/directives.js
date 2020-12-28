import Vue from 'vue'

// directive for highlight price change
Vue.directive('price-changed', {
  componentUpdated(el, { value, oldValue }) {
    if (oldValue === value) return

    if (typeof oldValue === 'number' && typeof value === 'number') {
      el.classList.remove('green', 'red')

      if (value < oldValue) {
        el.classList.add('price-changed', 'green')
      } else el.classList.add('price-changed', 'red')
    }
  }
})
