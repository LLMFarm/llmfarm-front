## 文件夹名

src/view/page-render
src/components/page-render

## 文件名

### vue

大驼峰: Page.vue PageRender.vue

### css

page-render.css

### js 

page-render.js

## 代码

### vue script 中引用组件 
import PageRender from 'path/to/PageRender.vue

### vue template 中渲染组件

<template>
  <page-render />
  <PageRender />
</template>

### fn 定义

```js
const pageRender = (id, renderOptions) => {

}
```

### css style 定义

```css
.page-render {
  display: flex;
}
.container {

}
```