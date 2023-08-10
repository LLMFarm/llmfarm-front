import ChartLine from "./ChartLine.vue";

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: "Echart/ChartLine",
  component: ChartLine,
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
  components: { ChartLine },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<ChartLine v-bind="args" />',
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.storyName = "客户每月增长趋势图";
Primary.args = {
  style: { width: "1200px", height: "400px" },
  title: "从 21年到现在的客户数量增长趋势图",
  xAxis: "month",
  yAxis: "customer_num",
  value: [
    {
        "month": "2021-06",
        "customer_num": 15
    },
    {
        "month": "2021-07",
        "customer_num": 739
    },
    {
        "month": "2021-08",
        "customer_num": 1285
    },
    {
        "month": "2021-09",
        "customer_num": 232
    },
    {
        "month": "2021-10",
        "customer_num": 51
    },
    {
        "month": "2021-11",
        "customer_num": 169
    },
    {
        "month": "2021-12",
        "customer_num": 160
    },
    {
        "month": "2022-01",
        "customer_num": 68
    }
]
};
