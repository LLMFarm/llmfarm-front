// PromptTemplate Schema 定义
const schema = {
  type: 'PromptTemplate',
  title: "提示词模板",
  desc: "提示词模板配置",
  group: "提示词模板",
  request: [
    {
      key: 'template',
      label: '提示词模板',
      type: 'PromptTemplate',
      default: `Question: {question}
=========
{context}
=========
Answer in Markdown in chinese:`,
    },
    {
      key: 'question',
      label: '输入文本',
      type: 'string',
      input: true,
    },
    {
      key: 'context',
      label: '上下文内容',
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