import NAMES from '~/assets/names.json'

export const UPDATE_PRODUCTS = 'UPDATE_PRODUCTS'

export const state = () => ({
  products: []
})

export const getters = {
  products: (s) => s.products
}

export const mutations = {
  [UPDATE_PRODUCTS](state, value) {
    state.products = value
  }
}

export const actions = {
  async fetch({ state, commit }) {
    const response = await this.$axios.$get('data.json')

    const products = (response?.Value?.Goods ?? []).map(({ C: price, G: groupId, T: id, P: count }) => {
      return {
        id,
        name: NAMES?.[groupId]?.B?.[id]?.N || 'unknown',
        count,
        price,
        groupId,
        groupName: NAMES?.[groupId]?.G || 'unknown'
      }
    })

    commit(UPDATE_PRODUCTS, products)
  }
}
