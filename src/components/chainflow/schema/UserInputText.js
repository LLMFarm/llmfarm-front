// UserInputText Schema 定义
const schema = {
  type: 'UserInputText',
  title: "用户输入文本",
  desc: "用户输入内容",
  group: "用户输入",
  request: [],
  response: [
    {
      key: 'text',
      label: '文本内容',
      type: 'string',
    },
  ]
}

export default schema;