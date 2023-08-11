import pinyin from "pinyin";
// console.log("pinyin", pinyin);

const convertToPinYin = (word) => {
  const result = pinyin.pinyin(word, { style: 'normal', heteronym: true, });
  const py = result.map(item => item[0]).join('');
  return py;
}

const options = [
  {
    'type': 'category', 'title': '指令',
    'options': [
      { type: "command", title: "添加机器人", value: 'add-bot', pinyin: 'tianjiajiqiren' }
    ]
  },
  {
    'type': 'category',
    'title': '机器人',
    'options': [{
      id: 1,
      type: 'bot',
      title: '翻译机器人',
      pinyin: convertToPinYin('翻译机器人')
    }, {
      id: 2,
      type: 'bot',
      title: '数据查询',
      pinyin: convertToPinYin('数据查询')
    }, {
      id: 3,
      type: 'bot',
      title: '年报数据分析',
      pinyin: convertToPinYin('年报数据分析')
    }]
  }
]

console.log('options', JSON.stringify(options, null, 2));