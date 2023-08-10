import ChatInput from "./input.vue";

export default {
  title: '聊天 / 输入框',
  component: ChatInput,
  argTypes: {},
};

const Template = (args) => ({
  components: { ChatInput },
  setup() {
    return { args };
  },
  template: '<ChatInput v-bind="args" v-model:value="args.value" style="position:absolute; bottom: 40px;" />',
});

export const InputBasic = Template.bind({});
InputBasic.storyName = "基础渲染"
InputBasic.args = {
  value: '',
  options: [
    {
      "type": "category",
      "title": "指令",
      "options": [
        {
          "type": "command",
          "title": "添加机器人",
          "value": "add-bot",
          "pinyin": "tianjiajiqiren"
        }
      ]
    },
    {
      "type": "category",
      "title": "机器人",
      "options": [
        {
          "value": 1,
          "type": "bot",
          "title": "翻译机器人",
          "pinyin": "fanyijiqiren"
        },
        {
          "value": 2,
          "type": "bot",
          "title": "数据查询",
          "pinyin": "shujuchaxun"
        },
        {
          "value": 3,
          "type": "bot",
          "title": "年报数据分析",
          "pinyin": "nianbaoshujufenxi"
        }
      ]
    }
  ]
}

