<template>
  <el-card>
    <el-row :gutter="20" type="flex" class="products-list">
      <el-col v-for="group in productsByGroup" :key="group.groupId" :span="12" class="group">
        <el-collapse :value="group.groupId">
          <el-collapse-item :title="group.groupName" :name="group.groupId">
            <el-table :data="group.items" size="mini" :show-header="false">
              <el-table-column v-slot="{ row }" prop="name" label="Name">
                {{ row.name }} ({{ countLabel(row.count) }})
              </el-table-column>
              <el-table-column v-slot="{ row }" prop="price" label="Price" :width="150" align="center">
                <span v-price-changed="row.rubPrice" class="price-wrapper">
                  <span class="price">{{ formatPrice(row.rubPrice) }} RUB</span>
                </span>
              </el-table-column>
              <el-table-column v-slot="{ row }" label="Actions" :width="100">
                <el-button type="primary" size="mini" :disabled="row.count <= 0" @click="addToCart(row)">add</el-button>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
// products table
export default {
  computed: {
    productsByGroup() {
      const products = this.$store.getters['shop/products']
      const cartProducts = this.$store.getters['cart/products']

      return products.reduce((r, product) => {
        const group = r.find((group) => group.groupId === product.groupId)

        product = {
          ...product,
          count: (() => {
            const existInCartProduct = cartProducts.find(
              ({ groupId, id }) => groupId === product.groupId && id === product.id
            )
            return existInCartProduct ? product.count - existInCartProduct.quantity : product.count
          })(),
          rubPrice: product.price * this.usdToRub
        }

        if (group) group.items.push(product)
        else {
          r.push({
            groupId: product.groupId,
            groupName: product.groupName,
            items: [product]
          })
        }

        return r
      }, [])
    },

    usdToRub() {
      return this.$store.getters.usdToRub
    }
  },

  methods: {
    formatPrice(value) {
      return value > 0 ? this.$format.number(value, { digits: 2, noZeroDigits: true }) : '-/-'
    },

    countLabel(value) {
      return value < 0 ? 0 : value
    },

    addToCart({ groupId, id }) {
      this.$store.dispatch('cart/addProduct', { groupId, id, quantity: 1 })
    }
  }
}
</script>

<style lang="scss" scoped>
.products-list {
  flex-wrap: wrap;
}

.price-wrapper {
  font-weight: bold;
  font-size: 16px;
  position: relative;

  .price {
    position: relative;
    z-index: 1;
  }

  &::before {
    content: '';
    pointer-events: none;
    position: absolute;
    top: -6px;
    left: -10px;
    right: -10px;
    bottom: -6px;
    opacity: 0.2;
    z-index: 0;
    display: none;
    border-radius: 5px;
  }

  &.price-changed::before {
    display: block;
  }

  &.price-changed.red::before {
    background: red;
  }

  &.price-changed.green::before {
    background: green;
  }
}

/deep/ .el-collapse-item__content {
  padding-bottom: 0;
}

.el-collapse,
/deep/ .el-collapse-item__header,
/deep/ .el-collapse-item__wrap {
  border: none;
}

/deep/ .el-table--border::after,
/deep/ .el-table--group::after,
.el-table::before {
  display: none;
}
</style>
