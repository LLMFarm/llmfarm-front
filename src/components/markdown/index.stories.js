import Markdown from "./Index.vue"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
export default {
  title: 'Render/Markdown',
  component: Markdown,
  tags: ['autodocs'],
  argTypes: {
    markdown: {
      control: 'text',
    },
  },
};

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { Markdown },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<Markdown v-bind="args" />',
});

// More on writing stories with args: https://storybook.js.org/docs/vue/writing-stories/args
export const World = Template.bind({});
World.args = {
  markdown: `# Hello World -)

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |
`
}

export const Graphviz = Template.bind({});
Graphviz.args = {
  markdown: `\`\`\`graphviz
  digraph g {
      rankdir=LR  // 方向左右
      dot语言->{简介,语法,示例}
      dot语言[shape=box,fontcolor=red]
      简介[color=red]
      语法[color=green]
      示例[color=blue]
      简介->{开源免费,UML绘图,导出svg}
      语法->{"digraph","graph"}
      "digraph"->导向图[label=可以制作带方向的导图]
      "graph"->无向图[label=可以制作不带方向的导图]
  }
  \`\`\``
}

export const Mermaid = Template.bind({})
Mermaid.args = {
  markdown: `\`\`\`mermaid
  graph TD
      A[Christmas] -->|Get money| B(Go shopping)
      B --> C{Let me think}
      C -->|One| D[Laptop]
      C -->|Two| E[iPhone]
      C -->|Three| F[Car]
  \`\`\``,
}

export const SQL = Template.bind({})
SQL.args = {
  markdown: `
请使用以下 SQL 进行查询
\`\`\`sql
SELECT * FROM table_name
where id = 1 and removed = 0;
\`\`\``,
}