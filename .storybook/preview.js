/** @type { import('@storybook/vue3').Preview } */

import { setup } from '@storybook/vue3';
import AntDesign from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// 引用 element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

setup((app) => {
  app.use(AntDesign);
  app.use(ElementPlus);
})

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
