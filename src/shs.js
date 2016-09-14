/**
 * Shs JavaScript library v0.1.0
 *
 * Released under the MIT license
 */

 /**
  公共函数
 **/

function toArray (likeArr) {
  const arr = [];

  for (let item of likeArr) {
    arr.push(item);
  }

  return arr;
}

function settleArray (arr) {
  
}

function getType (any) {
  return
    Object
    .prototype
    .toString
    .call(any)
    .slice(8, -1)
    .toLowerCase();
}

function createElement () {

}


/**
 * 构造Shs实例
 * @param selector { String | Array | NodeList | Node | Function | Init } 选择器
 * @param context { Node }
 */
function Init (selector, context) {
  if (getType(selector) === 'string') {
    if (selector.charAt(0) === '<') {

    } else {
      this.dom = context && context instanceof Init
        ? context.find(selector).get()
        : createElement(selector);
    }
  } else if (getType(selector) === 'array') {
    this
  }

}

Init.prototype.addClass = function () {

};

Init.prototype.removeClass = function () {

};

Init.prototype.toggleClass = function () {

};


function Shs (selector, context) {
  return new Init(selector, context);
}

const $ = window.$;

Object.assign(Shs, {
  noConflict() {
    if ($) {
      return this;
    }
  }
});

window.$ = Shs;
