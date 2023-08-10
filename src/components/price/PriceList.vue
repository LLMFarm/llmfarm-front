<template>
  <div class="price-table">
    <div class="price-row" v-for="(item, index) in priceData" :key="index">
      <div class="price-column">
        <div class="type-div">
          <div class="type-name" v-for="(value, i) in item.ar[0]" :key="i">
            <span class="name">{{ (i == 0) ? item.name : '' }}</span>
          </div>
        </div>
        <div class="ar-item" v-for="(ar, idx) in item.ar" :key="idx">
          <div v-for="(value, i) in ar" :key="i" class="value">{{ value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  priceData: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.price-table {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;


  .price-row {
    display: flex;
    flex-direction: row;
  }

  .price-column {
    display: flex;
    flex-direction: column;
    width: 100%;

    .type-div {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .type-name {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: center;
      }
    }

    .name {
      display: inline-block;
      margin: 30px 0 30px 20px;
      padding-bottom: 6px;
      border-bottom: 2px solid #7b67ee;
      line-height: 50px;
      font-size: 24px;
      color: #7b67ee;
    }

    .ar-item {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;

      .value {
        padding: 5px 10px 5px 10px;
        font-size: 14px;
        /*border: 1px solid #ccc;*/
        margin-right: 5px;
        width: 100%;
        text-align: center;
        text-indent: 18px;
        font-size: 14px;

        font-weight: 500;
      }

      &:hover {
        background-color: #f0f0f0;
        box-shadow: 0 2px 5px rgba(128, 0, 128, 0.2);
      }
    }
  }
}
</style>
