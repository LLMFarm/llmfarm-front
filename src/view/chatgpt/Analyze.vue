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

            <template v-if="item.inputType == 'number'">
              <el-input-number v-model="item.dynamic" />
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

    <div class="renderer" style="height: 400px;">
      <visualRender :value="value" :renderOptions="renderOptions" v-if="value" />
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import analyze from "@/services/analyze.js";
import visualRender from "@/components/visual-render/Index.vue";
import sqlRender from "./SqlRender.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

const initSQL = ref(``);
const resultSQL = ref("");

const list = ref([]);
const state = ref({});
let instanceId = 0;

let value = ref(null);
let renderOptions = ref({})

onMounted(async () => {
  console.log("onMounted");
  const questionId = route.query.questionId;
  if (questionId) {
    const { question, result } = await analyze.getQuestion(questionId)

    if (question && question.id) {
      initSQL.value = question.querySQL;
      instanceId = question.databaseId;
      state.value = question;
    }
    render(result, question.reportJson);

    // 自动解析
    analyzeSQL()
  }
})

const render = (result, reportJson) => {
  value.value = result;
  try {
    // const reportType = typeof state.value.reportJson;
    const reportType = typeof reportJson;
    if (reportType == 'string') {
      renderOptions.value = JSON.parse(reportJson)
    } else if (reportType == 'object') {
      renderOptions.value = reportJson
    }
  } catch (error) {

  }
}

const analyzeSQL = async () => {
  const result = await analyze.analyzeSQL(initSQL.value, instanceId);
  const { columns: _, dynamics } = result
  console.log("dynamics", dynamics);
  list.value = dynamics;
}

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
  const res = await analyze.executeSQL(initSQL.value, dynamics, instanceId);
  const { sql, result } = res
  resultSQL.value = sql
  render(result, state.value.reportJson);
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