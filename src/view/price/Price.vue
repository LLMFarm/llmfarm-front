<template>
  <div id="app">
    <div class="container">
      <div class="top">
        <div class="price-title">{{ systemName }}</div>
        <div class="price-desc">Subscribe now!Build your own llmfarm</div>
      </div>
      <div class="pricing-cards-container">
        <img class="price-left-people" src="@/assets/price/left_people.png" alt="left_people" />
        <img class="price-right-people" src="@/assets/price/right_people.png" alt="right_people" />
        <div class="product">
          <ProductTab class="product-list" :productData="productData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TabItem from "@/components/price/PlatFormTab.vue";
import PriceList from "@/components/price/PriceList.vue";
import ProductTab from "@/components/price/ProductTab.vue";
/*定义方案选项卡数组*/

import { useLoginStore } from "@/store/modules/user.js";

import { storeToRefs } from "pinia";

const loginStore = useLoginStore();
const { systemName } = storeToRefs(loginStore);

const tabTest = ref("按月");

// const platformData = [
//   {
//     name: "公有云",
//     intro: "通过互联网可以便捷访问产品，数据存储到 friai.com",
//   },
//   {
//     name: "私有化",
//     intro: "将产品部署到您自有的公有云、私有云或IDC机房",
//   },
// ];

/*定义产品数组*/
const productData = [
  {
    name: "Free",
    intro: "免费尝鲜",
    price: "0",
    dataType: "",
    subsribe: "Start a free trial",
  },
  {
    name: "月度会员",
    intro: "适用于业务快速发展的团队或组织",
    price: "88",
    dataType: "月",
    subsribe: "Buy now",
  },
  {
    name: "年度会员",
    intro: "适用于有复杂业务流程的团队或组织",
    price: "1000",
    dataType: "年",
    subsribe: "Buy now",
  },
];

const tabs = ["按月", "按年"];
const active = ref(0);
function selectActive(item) {
  /*active.value = item;*/
  tabTest.value = item;
  console.log("item", item);
  console.log("tabTest", tabTest.value);
}

/*定义价格数组*/
const priceData = [
  {
    name: "用量",
    ar: [
      ["成员数量", "1-10", "1-100", "定制"],
      ["文件节点数量", "1-10", "1-100", "定制"],
      ["单维格表行数", "1-10", "1-100", "定制"],
    ],
  },
  {
    name: "功能",
    ar: [
      ["星标", "1-10", "1-100", "定制"],
      ["相册视图", "1-10", "1-100", "定制"],
      ["看板视图", "1-10", "1-100", "定制"],
      ["甘特视图", "单空间站 10 个", "单空间站 50 个", "定制"],
      ["小程序", "不限，基础 + 自建", "不限，基础 + 自建", "不限，基础 + 自建 + 定制"],
    ],
  },
  {
    name: "管理和安全",
    ar: [
      ["星标", "1-10", "1-100", "定制"],
      ["相册视图", "1-10", "1-100", "定制"],
      ["看板视图", "1-10", "1-100", "定制"],
      ["甘特视图", "单空间站 10 个", "单空间站 50 个", "定制"],
      ["小程序", "不限，基础 + 自建", "不限，基础 + 自建", "不限，基础 + 自建 + 定制"],
    ],
  },
];

const activeIndex = ref(0);
</script>

<style lang="scss" scoped>
.container {
  //width: 1440px;
  display: grid;

  /*grid-template-columns: 600px 1fr;
  grid-column-gap: 20px;*/
}

.top {
  width: 100%;
  height: auto;
  background-image: url("@/assets/price/background.png");
}

/* Hexdo会员价目表大title样式*/
.price-title {
  padding: 94px 0 17px;
  line-height: 67px;
  text-align: center;
  font-weight: 600;
  font-size: 48px;
  color: #2f3956;
}

/*简介或价格优惠信息*/
.price-desc {
  padding-top: 20px;
  padding-bottom: 33px;
  line-height: 25px;
  font-weight: 500;
  font-size: 18px;
  color: #2f3956;
  text-align: center;
}

/* 定义app样式*/
#app {
  //display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.product-switch {
  /*公有云私有云选项卡外块*/
  display: flex;
  justify-content: center;
}

.pricing-cards-container {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin: 16px;

  .price-left-people {
    position: absolute;
    left: 0;
    top: -131px;
    width: auto;
    height: 216px;
  }

  .price-right-people {
    position: absolute;
    right: 0;
    top: -216px;
    width: auto;
    height: 216px;
  }
}

.product {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background: #fff;
  //padding: 0px;

  .product-list {
    min-width: 80%;
    flex-wrap: wrap;
    //padding: 0px;
  }
}

.select-div {
  display: flex;
  align-items: center;

  .select {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 187px;
    height: 69px;
    border-radius: 35px;
    background-color: #f9faff;
  }

  .select-item {
    text-align: center;
    width: 85px;
    line-height: 46px;
    font-size: 18px;
    cursor: pointer;
  }

  /*年月选项卡-选中效果*/
  .select-active {
    color: #fff;
    background-color: #7b67ee;
    border-radius: 23px;
  }

  /*年月选项卡-未选中效果*/
  .un-active {
    color: #111111;
    border-radius: 23px;
  }
}

.select-content {
  .hide {
    display: none;
  }

  .select-content-item {
    padding: 20px;
    border: 1px solid #ccc;
    margin-top: 10px;
  }
}

.product-tab {
  display: flex;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  background-color: #fff;
  border-radius: 15px;
  max-width: 600px;
}
</style>
