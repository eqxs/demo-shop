<template>
  <el-card header="Cart" :body-style="{ padding: 0 }">
    <client-only>
      <el-table :data="products">
        <el-table-column prop="name" label="Name" />
        <el-table-column v-slot="{ row }" prop="quantity" label="Quantity" :width="200">
          <div>
            <el-input-number
              :value="row.quantity"
              :min="1"
              :max="row.count"
              :step="1"
              step-strictly
              controls-position="right"
              size="mini"
              @change="updateQuantity(row, $event)"
            />
          </div>
          <div class="quantity-error">
            <el-alert v-if="row.isQuantityError" title="Quantity is limited" type="warning" :closable="false" />
          </div>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="Price" :width="200">
          <span class="price">
            <span class="value">{{ formatPrice(row) }} RUB</span>
            <span class="caption">&nbsp;/ pcs.</span>
          </span>
        </el-table-column>
        <el-table-column v-slot="{ row }" :width="100">
          <el-button type="danger" size="mini" @click="removeProduct(row)">remove</el-button>
        </el-table-column>
        <template v-if="products.length > 0" #append>
          <div class="summary">
            <span>Total count:</span>
            <span class="totals">{{ totals }} RUB</span>
          </div>
        </template>
      </el-table>
    </client-only>
  </el-card>
</template>

<script>
// cart table
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      cartProducts: 'cart/products',
      shopProducts: 'shop/products'
    }),

    products() {
      return this.cartProducts.reduce((r, item) => {
        const product = this.shopProducts.find(({ groupId, id }) => groupId === item.groupId && id === item.id)

        if (product)
          r.push({
            ...item,
            count: product.count,
            price: this.usdToRub * product.price,
            isQuantityError: item.quantity > product.count
          })

        return r
      }, [])
    },

    usdToRub() {
      return this.$store.getters.usdToRub
    },

    totals() {
      return this.$format.number(
        this.products.reduce((r, { price, quantity }) => r + price * quantity, 0),
        { digits: 2, noZeroDigits: true }
      )
    }
  },

  methods: {
    formatPrice({ price, quantity }) {
      return this.$format.number(price * quantity, { digits: 2, noZeroDigits: true })
    },

    removeProduct(item) {
      this.$store.dispatch('cart/removeProduct', item)
    },

    updateQuantity(product, quantity) {
      this.$store.dispatch('cart/updateQuantity', { product, quantity })
    }
  }
}
</script>

<style lang="scss" scoped>
.price {
  display: inline-flex;
  align-items: center;

  .value {
    font-weight: bold;
    font-size: 16px;
  }
}

.quantity-error {
  margin-top: 5px;
  display: inline-block;

  .el-alert {
    padding: 5px 0;
  }
}

.summary {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px;

  .totals {
    font-weight: bold;
    font-size: 16px;
    color: orange;
    margin-left: 10px;
  }
}
</style>
