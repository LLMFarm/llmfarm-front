// OpenAIChatCompletion Schema 定义
const schema = {
  type: 'ChatCompletion',
  title: 'ChatGPT 服务',
  desc: "Call OpenAI LLM",
  group: 'LLM',
  request: [
    {
      key: 'modelName',
      label: 'Model Name',
      type: 'string',
      control: {
        type: 'select',
        options: [
          { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
          { value: "gpt-3.5-turbo-16k", label: "gpt-3.5-turbo-16k" },
          // { value: 'gpt-4', label: 'gpt-4' },
          // { value: 'gpt-4-32k', label: 'gpt-4-32k' }
        ]
      },
      default: "gpt-3.5-turbo",
    },
    {
      key: 'temperature',
      label: 'Temperature',
      type: 'string',
    },
    {
      key: 'prompt',
      label: '提示词',
      type: 'string',
      input: true,
    }
  ],
  response: [
    {
      key: 'ChatOpenAI',
      type: 'BaseChatModel'
    }
  ]
}

export default schema;