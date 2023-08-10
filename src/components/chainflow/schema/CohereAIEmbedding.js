// CohereAIEmbedding Schema 定义
const schema = {
  type: 'CohereAIEmbedding',
  desc: "将文本转换为向量数据",
  group: "向量化处理",
  request: [
    {
      key: 'text',
      label: '文本内容',
      type: 'string',
      input: true
    }
  ],
  response: [
    {
      key: 'embeddingVector',
      type: 'embeddingVector'
    }
  ],
  ignored: true
}

export default schema;