<template>
  <div>
    <products />
    <el-divider />
    <cart />
    <el-divider />

    <el-button v-if="!timer" type="success" @click="initTimer">INIT TIMER</el-button>
    <el-button v-else type="danger" @click="stopTimer">STOP TIMER</el-button>
  </div>
</template>

<script>
const DEFAULT_TIMEOUT = 15 * 1000

export default {
  data: () => ({
    timer: null
  }),

  async fetch({ store }) {
    // initial fetch products
    await store.dispatch('shop/fetch')
  },

  beforeDestroy() {
    this.stopTimer()
  },

  methods: {
    initTimer() {
      this.timer = setTimeout(() => {
        this.$prompt('Please input usd/rub convertion rate (20 - 80)', 'USD/RUB', {
          confirmButtonText: 'OK',
          showClose: false,
          closeOnPressEscape: false,
          closeOnClickModal: false,
          showCancelButton: false,
          inputValidator: (value) => Math.floor(value) >= 20 && Math.floor(value <= 80),
          inputErrorMessage: 'Invalid rate'
        })
          .then(async ({ value }) => {
            await Promise.all([this.$store.dispatch('shop/fetch'), this.$store.dispatch('updateUsdToRub', value)])
            this.initTimer()
          })
          .catch(this.stopTimer)
      }, DEFAULT_TIMEOUT)
    },

    stopTimer() {
      this.timer && clearTimeout(this.timer)
      this.timer = null
    }
  }
}
</script>
