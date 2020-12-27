<template>
  <el-container class="default-layout">
    <el-main>
      <Nuxt />
    </el-main>
  </el-container>
</template>

<script>
export default {
  data: () => ({})
}
</script>

<style lang="scss" scoped>
.default-layout {
  @include main-layout();
}
</style>
