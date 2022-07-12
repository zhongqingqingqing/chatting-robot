// 通用代码

/**
 * 查找单一元素
 */
function $(selector) {
  return document.querySelector(selector);
}

/**
 * 查找全部元素
 */
function $$(selector) {
  return document.querySelectorAll(selector);
}

/**
 * 创建元素
 */
function $$$(selector) {
  return document.createElement(selector);
}
