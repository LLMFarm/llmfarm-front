/**
 * 模板变量抽取
 * @param {*} template 
 * @returns 变量列表
 */
export const extractTemplateVariables = (template) => {
  const regex = /\{([^}]+)\}/g;
  const set = new Set();
  const variables = [];
  let match;

  while ((match = regex.exec(template))) {
    variables.push(match[1].trim());
    set.add(match[1].trim());
  }

  return Array.from(set);
}

export const resolveRequests = (variables) => {
  const requests = [{ key: "template", label: "提示词模板", type: "PromptTemplate", }];
  for (const variable of variables) {
    const request = { key: variable, label: variable, type: "string", input: true }
    requests.push(request)
  }
  return requests;
}

export default {
  extractTemplateVariables
}