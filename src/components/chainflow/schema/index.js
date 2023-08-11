const modules = import.meta.globEager('./*.(js)')
const schema = {}

const VITE_IGNORE_LLM = import.meta.env.VITE_IGNORE_LLM;
let ignoredLLM = new Set();
if (VITE_IGNORE_LLM == "true") {
  ignoredLLM = new Set(["ChatAquila", "ChatWenXin", "StableDiffusion", "ChatChineseAlpaca"])
}

// console.log('modules', modules);
for (const path in modules) {
  const module = modules[path].default
  // console.log('module', module)
  if (module.ignored || ignoredLLM.has(module.type)) {
    continue;
  }
  const key = module.type;
  schema[key] = module;
}

export default schema;