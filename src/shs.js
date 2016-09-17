/**
 * Shs JavaScript library v0.1.0
 *
 * Released under the MIT license
 */

 const specialTagMap = {
   li: {
     beginInput: '<ul>',
     endInput: '</ul>'
   }
 };

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

/**
 * 删除值为null和undefined的数组
 * 截取Shs实例中的dom
 */
function settleArray (arr, isObjectToDom) {
  const arred = [];

  for (let value of arr) {
    if (value == null) {
      continue;
    }

    if (isObjectToDom && value instanceof Init) {
      toArray(value).forEach(el => {
        arred.push(el);
      });
      continue;
    }

    arred.push(value);
  }

  return arred;
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

function createElement (HTMLStr) {
  const tmpNode = document.createElement('div');
  const tag = /\w/.exec(HTMLStr)[0];
  const map = specialTagMap[tag];

  HTMLStr = HTMLStr.trim();

  if (isSpecial) {
    HTMLStr = map.beginInput + HTMLStr + map.endInput;
  }

  tmpNode.insertAdjacentHTML('beforeend', HTMLStr);

  let node = tmpNode.lastChild;

  if (isSpecial) {
    node = node.lastChild;
  }

  return node;
}

function queryElement (selector, context) {
  !context && (context = document);

  // 如果是单个选择器
  if (/^[#.]?$/.test(selector)) {

  }

}

/**
 * 构造Shs实例
 * @param selector { String | Array | NodeList | Node | Function | Init } 选择器
 * @param context { Node }
 */
function Init (selector, context) {
  if (getType(selector) === 'string') {
    if (selector.charAt(0) === '<') {
      this.dom = [ createElement(selector) ];
    } else {
      this.dom = context && context instanceof Init
        ? context.find(selector).get()
        : queryElement(selector, context);
    }
  } else if (getType(selector) === 'array') {
    this.dom = settleArray(selector);
  } else if (getType(selector) === 'nodelist') {
    this.dom = toArray(selector);
  } else if (getType(selector) === 'function') {
    return this.ready(selector);
  } else if (selector instanceof Init) {
    return selector;
  } else {
    this.dom = selector
      ? [ selector ]
      : [];
  }

  this.length = this.dom.length;
}

Init.prototype.ready = function () {

};

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
