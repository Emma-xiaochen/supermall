<template>
  <div class="cart">
    <nav-bar>
      <div slot="center">购物车</div>
    </nav-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/nav/NavBar'

  export default {
    name: "Cart",
    components: {
      NavBar
    }
  };
</script>

<style scoped>

</style>