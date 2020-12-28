export const UPDATE_USD_TO_RUB = 'UPDATE_USD_TO_RUB'

// conversion rate (USD/RUB)
export const state = () => ({
  usdToRub: 50
})

export const getters = {
  usdToRub: (s) => s.usdToRub
}

export const mutations = {
  [UPDATE_USD_TO_RUB](state, value) {
    state.usdToRub = value < 20 ? 20 : value > 80 ? 80 : value
  }
}

export const actions = {
  updateUsdToRub({ commit }, value) {
    commit(UPDATE_USD_TO_RUB, Math.floor(value))
  }
}
