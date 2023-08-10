// OpenAIChatCompletion Schema 定义
const schema = {
  type: 'SparkCompletion',
  desc: "使用 Spark LLM 完成任务",
  group: 'LLM',
  request: [
    {
      key: 'prompt',
      label: '提示词',
      type: 'string',
      input: true,
    }
  ],
  response: [
    {
      key: 'Output Content',
      type: 'String'
    }
  ],
  ignored: true
}

export default schema;