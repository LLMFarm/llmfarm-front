<template>
  <div class="container">

    <div class="sql-question">
      <h3>ChatGPT 分析 SQL</h3>
      <sql-render :sql="initSQL"></sql-render>
    </div>

    <div class="content">

      <div class="toolbar">
        <el-button size="default" type="primary" @click="analyzeSQL">解析 SQL</el-button>

        <el-button size="default" type="primary" @click="executeSQL">筛选查看结果</el-button>
      </div>

      <div class="filter">
        <div class="filter-item" v-for="dynamic in list" :key="dynamic.column">
          <div class="column-title">{{ dynamic.column }}</div>

          <div class="input" v-for="(item, index) in dynamic.list" :key="index">
            <template v-if="item.inputType == 'text'">
              <el-input v-model="item.dynamic"></el-input>
            </template>

            <template v-if="item.inputType == 'datetime'">
              <el-date-picker v-model="item.dynamic" type="datetime" placeholder="" format="YYYY-MM-DD HH:mm:ss" />
            </template>

            <template v-if="item.inputType == 'radio'">
              <el-radio-group v-model="item.dynamic">
                <el-radio-button :label="option.value" v-for="option in item.options">
                  {{ option.value || '空' }}
                </el-radio-button>
              </el-radio-group>
            </template>

            <template v-if="item.inputType == 'checkbox'">
              <el-checkbox-group v-model="item.dynamic">
                <el-checkbox-button v-for="option in item.options" :key="option.value" :label="option.value">
                  {{ option.value || '空' }}
                </el-checkbox-button>
              </el-checkbox-group>
            </template>
          </div>
        </div>
      </div>

    </div>


    <div class="sql-result">
      <!-- 筛选结果SQL -->
      <h3>筛选结果 SQL</h3>
      <sql-render :sql="resultSQL" v-if="resultSQL"></sql-render>
    </div>

    <div class="renderer">
      <visualRender :value="value" :renderOptions="renderOptions" v-if="value" />
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import analyze from "@/services/analyze.js";
import visualRender from "@/components/visual-render/Index.vue";
import sqlRender from "./SqlRender.vue";
import { ref } from "vue";

const initSQL = ref(`SELECT
  DATE_FORMAT(FROM_UNIXTIME(pay_time / 1000), '%Y-%m') as month,
  sum(price) as total
FROM hex_order
WHERE
  FROM_UNIXTIME(pay_time / 1000) BETWEEN '2022-01-01 00:00:00'
  AND '2022-12-31 23:59:59'
  AND pay_type = '微信支付' AND old_status in ('已接单',"已上门")
GROUP BY month ORDER BY month;`);

const resultSQL = ref("");

const list = ref([
  {
    "column": "pay_time",
    "list": [
      {
        "isDynamic": true,
        "type": "single_quote_string",
        "value": "2022-01-01 00:00:00",
        "uuid": "55ec2842-e9f9-4f6d-84d9-e919c814c5c3",
        "inputType": "datetime",
        "dynamic": new Date("2022-01-01 00:00:00")
      },
      {
        "isDynamic": true,
        "type": "single_quote_string",
        "value": "2022-12-31 23:59:59",
        "uuid": "e5c8640c-1c54-4bdb-baa1-267129cb0119",
        "inputType": "datetime",
        "dynamic": new Date("2022-12-31 23:59:59")
      }
    ]
  },
  {
    "column": "pay_type",
    "operator": "=",
    "list": [
      {
        "isDynamic": true,
        "type": "single_quote_string",
        "value": "微信支付",
        "uuid": "67c2f359-3353-4cfb-ae07-d2d670e935e2",
        "inputType": "radio",
        "dynamic": "微信支付",
        "options": [
          {
            "value": ""
          },
          {
            "value": "支付宝"
          },
          {
            "value": "微信支付"
          },
          {
            "value": "待支付"
          },
          {
            "value": "微信"
          },
          {
            "value": "会员专享订单"
          },
          {
            "value": "余额支付"
          }
        ]
      }
    ]
  },
  {
    "column": "old_status",
    "list": [
      {
        "isDynamic": true,
        "type": "array",
        "inputType": "checkbox",
        "value": `'已接单',"已上门"`,
        "options": [
          { "value": "已接单" },
          { "value": "待接单" },
          { "value": "已上门" },
          { "value": "待师傅确认" },
          { "value": "待平台确认" },
          { "value": "已关闭" },
          { "value": "待付款" }
        ],
        "dynamic": ["已接单", "已上门"],
      }
    ]
  }
]);
list.value = [];

const analyzeSQL = async () => {
  const result = await analyze.analyzeSQL(initSQL.value);
  const { columns: _, dynamics } = result
  console.log("dynamics", dynamics);
  list.value = dynamics;
}

let value = ref(null);
let renderOptions = ref({
  chartType: "line",
  xAxisField: "month",
  yAxisField: "total",
  title: ""
})

const executeSQL = async () => {
  let dynamics = JSON.parse(JSON.stringify(list.value));
  dynamics = dynamics.map(d => {
    d.list = d.list.map(item => {
      if (item.inputType == "datetime" && item.dynamic) {
        item.dynamic = dayjs(item.dynamic).format("YYYY-MM-DD HH:mm:ss");
        // console.log("item.dynamic", item.dynamic);
      }
      return item;
    })
    return d;
  })
  const res = await analyze.executeSQL(initSQL.value, dynamics);
  const { sql, result } = res
  value.value = result;
  resultSQL.value = sql
}
</script>

<style lang="scss" scoped>
.container {
  width: 1440px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: 600px 1fr;
  grid-column-gap: 20px;

  .sidebar {
    display: flex;
    flex-direction: column;
    flex-basis: 500px;
  }

  .content {
    padding: 0 20px;
    width: 100%;
    flex: 1;
  }
}

.toolbar {
  margin-top: 10px;
  padding: 10px 0;
}

.filter {
  padding: 10px 0;

  .filter-item {
    margin-bottom: 10px;
    padding: 5px 0;
    display: flex;
    align-items: center;

    .column-title {
      width: 150px;
      flex-basis: 150px;
    }

    .input {
      min-width: 150px;
      margin-right: 50px;
    }
  }
}
</style>