// ChatOpenAI Schema 定义
const schema = {
  type: 'ChatOpenAI',
  desc: "Wrapper around OpenAI Chat large language models.",
  request: [
    {
      key: 'modelName',
      label: 'Model Name',
      type: 'string',
      control: {
        type: 'select',
        options: [
          { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
          // { value: 'gpt-4', label: 'gpt-4' },
          // { value: 'gpt-4-32k', label: 'gpt-4-32k' }
        ]
      }
    },
    {
      key: 'temperature',
      label: 'Temperature',
      type: 'string',
    },
    {
      key: 'apiKey',
      label: 'OpenAI API Key',
      type: 'string',
    }
  ],
  response: [
    {
      key: 'ChatOpenAI',
      type: 'BaseChatModel'
    }
  ],
  ignored: true
}

export default schema;