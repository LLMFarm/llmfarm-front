export const importUmd = (url, _vue) => {
  // 将 window 下的 define 方法暂存起来
  const defineTemp = window.define;
  let result;
  // 自定义 define 方法
  window.define = (depends, func) => {
    result = func(_vue); // vue 依赖注入 
  }
  window.define.amd = true; // 伪装成 amd 的 define。
  return new Promise(function (resolve, reject) {
    const el = document.createElement('script'); // 创建 script 元素
    el.src = url;
    el.async = false; // 保持时序
    const loadCallback = function () { // 加载完成之后处理
      el.removeEventListener('load', loadCallback);
      window.define = defineTemp;
      resolve(result);
    };
    const errorCallback = function (evt) { // 加载失败之后处理
      el.removeEventListener('error', errorCallback);
      window.define = defineTemp;
      var error = evt.error || new Error("Load javascript failed. src=" + url);
      reject(error);
    };
    el.addEventListener('load', loadCallback); // 绑定事件
    el.addEventListener('error', errorCallback); // 绑定事件
    document.body.appendChild(el); // 插入元素
  });
}

export const loadStyle = link => {
  const style = document.createElement('link');
  style.href = link;
  style.rel = 'stylesheet';
  style.type = 'text/css';
  document.getElementsByTagName('head').item(0).appendChild(style);
}

/**
 * 动态加载组件
 * schemas [{ umd: '', css: '' } ... ]
 * dep: vue
 * app: 执行 app.use(module)
 */
export const loadComponentDynamic = async (schemas, dep, app) => {
  const tasks = [];
  const installed = await resolveInstalledSchemas();

  for (const { umd, css } of schemas.concat(installed)) {
    if (!umd) {
      continue
    }
    const module = await loadComponent(umd, dep);
    if (module) {
      // console.log('app.use', module);
      app.use(module);
      loadStyle(css);
    }
  }
}

const resolveInstalledSchemas = async () => {
  const env = import.meta.env;
  const schemas = [{
    umd: `${env.VITE_COMPONENT_HOST}/iview/lowcode.iview.umd.js`,
    css: `${env.VITE_COMPONENT_HOST}/iview/style.css`,
  }]
  // return schemas;
  return [];
}

/**
 * 动态加载组件
 * schemas [{ umd: '', css: '' } ... ]
 * dep: vue
 * app: 执行 app.use(module)
 */
export const loadAllComponentDynamic = async (schemas, dep, app) => {
  const tasks = [];
  for (const { umd, css } of schemas) {
    const loadTask = loadComponent(umd, dep);
    tasks.push(loadTask);
  }

  Promise.all(tasks).then(modules => {
    // console.log("modules", modules);
    return modules;
  })
}

export const loadComponent = async (url, vue) => {
  // console.log('url', url);
  return importUmd(url, vue).then(module => {
    return module;
  }).catch(err => {
    console.log("error", err)
    return null;
  })
}