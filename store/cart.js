const ADD_PRODUCT = 'ADD_PRODUCT'
const UPDATE_QUANTITY = 'UPDATE_COUNT'
const REMOVE_PRODUCT = 'REMOVE_PRODUCT'

// store for cart
export const state = () => ({
  products: [],
  version: '0.0.3'
})

export const getters = {
  products: (s, _, store) =>
    s.products.reduce((r, item) => {
      const product = store.shop.products.find(({ groupId, id }) => item.groupId === groupId && item.id === id)

      if (product)
        r.push({
          ...item,
          name: product.name
        })

      return r
    }, [])
}

export const mutations = {
  [ADD_PRODUCT](state, product) {
    const existIndex = state.products.findIndex(({ groupId, id }) => product.groupId === groupId && product.id === id)
    const products = [...state.products]

    if (existIndex === -1) products.push({ ...product, quantity: 1 })
    else products[existIndex] = { ...products[existIndex], quantity: products[existIndex].quantity + 1 }

    state.products = products
  },

  [UPDATE_QUANTITY](state, { product, quantity }) {
    const existIndex = state.products.findIndex(({ groupId, id }) => product.groupId === groupId && product.id === id)
    const products = [...state.products]

    products[existIndex] = { ...products[existIndex], quantity }

    state.products = products
  },

  [REMOVE_PRODUCT](state, product) {
    const existIndex = state.products.findIndex(({ groupId, id }) => product.groupId === groupId && product.id === id)

    const products = [...state.products]
    products.splice(existIndex, 1)

    state.products = products
  }
}

export const actions = {
  async addProduct({ commit }, data) {
    await commit(ADD_PRODUCT, data)
  },

  async updateQuantity({ commit }, data) {
    await commit(UPDATE_QUANTITY, data)
  },

  async removeProduct({ commit }, data) {
    await commit(REMOVE_PRODUCT, data)
  }
}
