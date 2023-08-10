import ChartBar from "./ChartBar.vue";

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: "Echart/ChartBar",
  component: ChartBar,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    value: {
      name: "数据",
    },
    xAxis: {
      name: "X轴字段",
    },
    yAxis: {
      name: "Y轴字段",
    },
    title: {
      name: "图表标题",
    },
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { ChartBar },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<ChartBar v-bind="args" />',
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.storyName = "客户数据省份统计";
Primary.args = {
  style: { width: "800px", height: "1000px" },
  title: "近3年的客户省份分布统计数据",
  xAxis: "province",
  yAxis: "count",
  sortType: "desc",
  value: [
    {
      province: "山西省",
      count: 77,
    },
    {
      province: "山东省",
      count: 218,
    },
    {
      province: "河北省",
      count: 111,
    },
    {
      province: "广东省",
      count: 188,
    },
    {
      province: "天津市",
      count: 27,
    },
    {
      province: "福建省",
      count: 102,
    },
    {
      province: "江苏省",
      count: 253,
    },
    {
      province: "辽宁省",
      count: 40,
    },
    {
      province: "浙江省",
      count: 212,
    },
    {
      province: "云南省",
      count: 63,
    },
    {
      province: "",
      count: 276,
    },
    {
      province: "四川省",
      count: 118,
    },
    {
      province: "新疆维吾尔自治区",
      count: 16,
    },
    {
      province: "北京市",
      count: 75,
    },
    {
      province: "江西省",
      count: 46,
    },
    {
      province: "湖北省",
      count: 99,
    },
    {
      province: "河南省",
      count: 145,
    },
    {
      province: "贵州省",
      count: 30,
    },
    {
      province: "安徽省",
      count: 97,
    },
    {
      province: "陕西省",
      count: 77,
    },
    {
      province: "内蒙古自治区",
      count: 24,
    },
    {
      province: "湖南省",
      count: 115,
    },
    {
      province: "广西壮族自治区",
      count: 64,
    },
    {
      province: "甘肃省",
      count: 18,
    },
    {
      province: "重庆市",
      count: 46,
    },
    {
      province: "上海市",
      count: 91,
    },
    {
      province: "海南省",
      count: 42,
    },
    {
      province: "西藏自治区",
      count: 1,
    },
    {
      province: "宁夏回族自治区",
      count: 11,
    },
    {
      province: "吉林省",
      count: 11,
    },
    {
      province: "黑龙江省",
      count: 16,
    },
    {
      province: "青海省",
      count: 9,
    },
    {
      province: "广西壮族自治区",
      count: 1,
    },
  ],
};
