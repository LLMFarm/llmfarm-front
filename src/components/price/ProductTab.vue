<template>
  <div class="membership-tabs">
    <div v-for="(item, index) in productData" :key="index" class="membership-tab" @mouseover="activeIndex = index"
      :class="{ active: activeIndex === index }">
      <div class="product-title">
        <h3>{{ item.name }}</h3>
        <h3 v-if="item.price === '0'">¥{{ item.price }}</h3>
        <h3 v-else>¥{{ item.price }} / {{ item.dataType }}</h3>
      </div>
      <p>{{ item.intro }}</p>
      <div class="btn-div"><router-link to="/login"><button class="btn">{{ item.subsribe }}</button></router-link></div>
    </div>
  </div>
</template>

<script setup>
//  import { ref } from 'vue';
const props = defineProps({
  productData: {
    type: Array,
    default: () => []
  }
})

//const activeIndex = ref(0);
</script>

<style lang="scss" scoped>
.membership-tabs {
  display: flex;
  justify-content: space-between;

  .btn-div {
    width: 80%;

    .btn {
      margin-top: 12px;
      box-sizing: border-box;
      border: 2px solid #eaebf0;
      border-radius: 12px;
      width: 100%;
      background-color: #fff;
      cursor: pointer;
      line-height: 46px;
      text-align: center;
      font-weight: 700;
      font-size: 16px;
      color: #7b67ee;
      transition: all .2s ease;
    }
  }

  .membership-tab {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    min-width: 400px;
    padding: 20px;
    margin: 10px 10px;
    background-color: #f8f8f8;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 0 15px rgba(128, 0, 128, 0.2);
      background-color: #7b67ee;
      color: #fff;
    }

    &.active {
      box-shadow: 0 0 15px rgba(128, 0, 128, 0.2);
      background-color: #ffffff;
    }

    p {
      font-size: 16px;
      margin-bottom: 0;
    }

    .product-title {
      display: flex;
      justify-content: space-between;
      white-space: nowrap;

      h3 {
      margin-top: 0;
      font-size: 22px;
      }

    }
  }
}
</style>
