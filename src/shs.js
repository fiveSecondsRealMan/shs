/**
 * Shs JavaScript library v0.1.0
 *
 * Released under the MIT license
 */

 const nativeKeys = Object.keys;

 const specialTagMap = {
   li: {
     beginInput: '<ul>',
     endInput: '</ul>'
   }
 };

 const cssNumberNames = [
   'z-index',
   'opacity',
   'zoom',
   'line-height',
   'font-weight'
 ];

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

function inArray (arr, value) {
  return arr.indexOf(value) >= 0;
}

function upperToCamel (str) {
  return str.replace(/[A-Z]/g, match =>
    '-' + match.toLowerCase();
  )
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

function blankSplit (str) {
  return str.trim().split(' ');
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

/**
  ------ selector query ------
**/
function queryElement (selector, context) {
  !context && (context = document);

  // 如果是单个选择器
  if (/^[#.]?[\w-*]+$/.test(selector)) {
    const firstChar = selector.charAt(0);
    const remainStr = selector.slice(1);

    if (firstChar === '#') {
      // id 选择器
      return settleArray([context.getElementById(remainStr)]);
    } else if (firstChar === '.') {
      // class 选择器
      return toArray(context.getElementByClassName(remainStr));
    } else if (selector === 'body') {
      // body
      return [ document.body ];
    }

    // 标签选择器
    return toArray(document.getElementsByTagName(selector));
  }

  // 后代选择器，多个选择器等复杂选择器
  return toArray(document.querySelectorAll(selector));
}

/**
  ------ dom className ------
**/
function operationClass (self, method, className, isToggle) {
  if (className == null) {
    if (method === 'add') {
      return self;
    }

    return self.removeAttr('class');
  }

  const classNameType = getType(className);
  let classNames;

  return self.each(function () {
    if (classNameType === 'function') {
      const callbackValue = className.call(this, this.className);

      if (!callbackValue) {
        return;
      }

      classNames = blankSplit(callbackValue);
    }
    else if (classNameType === 'string') {
      classNames = blankSplit(className)
    }

    for (let name of classNames) {
      if (name) {
        isToggle == null
          ? this.classList[method](name)
          : this.classList.toggle(name, isToggle);
      }
    }
  });
}

/**
  ------ dom event ------
**/
function operationEventListener (self, method, eventName, handler) {
  if (eventName == null) {
    return self;
  }

  return self.each(function () {
    if (method === 'add') {
      addEventListener(this, eventName, handler);
    } else if (method === 'remove') {
      removeEventListener(this, eventName, handler);
    }
  });
}

function addEventListener (el, eventName, addHandler) {
  const eventNames = blankSplit(eventName);

  if (!getEvents(el)) {
    el.eventListeners = {};
  }

  eventNames.forEach(evtName => {
    (etEvents(el)[evtName] || (getEvents(el)[evtName] = [])).push(addHandler);
    el.addEventListener(evtName, addHandler, false);
  });
}

function clearEventHandler (handlers, removeHandler) {
  return handlers.filter(handler => {
    return removeHandler && handler !== removeHandler;
  });
}

function removeEventListener (el, eventName, removeHandler) {
  const addedHandlers = getEvents(el) && getEvents(el)[eventName];

  if (!addedHandlers) {
    return;
  }

  getEvents(el)[eventName] = clearEventHandler(addedHandlers, removeHandler);

  for (let addedHandler of addedHandlers) {
    if (removeHandler && removeHandler !== addedHandler) {
      continue;
    }

    el.removeEventListener(eventName, addedHandler, false);
  }
}

function getEvents (el) {
  return el.eventsListeners;
}

/**
  ------ dom css ------
**/
function cssImplicitAccessor (el) {
  return document
    .defaultView
    .getComputedStyle(el, null)
    .getPropertyValue;
}

function operationCss (cssName, cssValue) {
  if (inArray(cssNumberNames, cssName)) {
    return cssValue;
  }

  if (!/\D/.test(cssValue)) {
    return cssValue + 'px';
  }

  return cssValue;
}

function addCss (el, cssText) {
  if (getType(cssText) === 'object') {
    cssText = JSON.stringify(cssText);
  }

  cssText = cssText
    .replace(/[{}'"]/g, '')
    .replace(/,/g, ';');

  el.style.cssText += cssText;
}

/**
  ------ dom position ------
**/
const domPositionMethod = {
  beforebegin(el, beAddedEl) {
    const parentEl = el.parentNode;
    parentEl.insertBefore(beAddedEl, el);
  },
  afterend(el, beAddedEl) {
    const parentEl = el.parentNode;
    parentEl.insertBefore(beAddedEl, el.nextSibling);
  },
  beforeend(el, beAddedEl) {
    el.insertBefore(beAddedEl);
  },
  afterbegin(el, beAddedEl) {
    el.insertBefore(beAddedEl, el.firstChild);
  }
};

function operationDomPosition (self, method, els) {
  els.forEach((el, index) => {
    const type = getType(el);

    if (type === 'string') {
      self.each(function () {
        this.insertAdjacentHTML(method, el);
      });
    } else if (type === 'function') {
      self.each(function () {
        const funcValue = el.call(this, this.innerHTML);
        this.insertAdjacentHTML(method, funcValue);
      });
    } else {

      if (el.nodeType === 1) {
        throw new Error('参数不能是Node类型');
        return;
      }

      if (el instanceof Init) {
        const operationingEls = el.get();
        let progenys, operationingEl, fragment;

        self.each(function () {
          for (operationingEl of operationingEls) {
            fragment = document.createDocumentFragment();
            progenys = queryElement('*', operationingEl);

            progenys.forEach(progeny =>
              fragment.appendChild(progeny);
            );
          }

          domPositionMethod[method](this, fragment);
        });
      }
    }
  });
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

Init.prototype.each = function (callback) {
  const dom = this.dom;

  dom.forEach((node, index) => {
    callback.call(node, index, node);
  });

  return this;
};

Init.prototype.get = function (index) {
  if (index == null) {
    return this.dom;
  }

  return index < 0
    ? this.dom[this.length + index]
    : this.dom[index];
};

Init.prototype.on = function (eventName, handler) {
  return operationEventListener(this, 'add', eventName, handler);
};

Init.prototype.off = function () {
  return operationEventListener(this, 'remove', eventName, handler);
};

Init.prototype.attr = function (attrName, attrValue) {
  const attrValueType = getType(attrValue);
  const attrNameType = getType(attrName);
  const isFunc = attrValueType === 'function';

  if (attrValueType === 'string' || isFunc) {
    return this.each(function () {
      if (this.nodeType !== 1) {
        return;
      }

      this.setAttribute(
        name,
        isFunc ? attrValue.apply(this, this.getAttribute(attrName)) : attrValue
      );
    });
  }

  if (attrNameType === 'object') {
    return this.each(function () {
      nativeKeys(attrName).forEach(attr => {
        this.setAttribute(attr, attrName[attr]);
      });
    });
  }

  const node = this.get(0);

  if (!node || node.nodeType !== 1) {
    return void 0;
  }

  return node.getAttribute(attrName) || '';
};

Init.prototype.removeAttr = function (attrName) {
  if (attrName) {
    const attrs = blankSplit(attrName);

    return this.each(function () {
      for (let attr of attrs) {
        this.removeAttribute(attr);
      }
    });
  }

  return this;
};

Init.prototype.ready = function (handler) {
  this.dom = [ document ];
  this.length = 1;

  return this.on('DOMContentLoaded', handler);
};

Init.prototype.addClass = function (className) {
  return operationClass(this, 'add', className);
};

Init.prototype.removeClass = function (className) {
  return operationClass(this, 'remove', className);
};

Init.prototype.toggleClass = function (className, isToggle) {
  return operationClass(this, 'toggle', className, isToggle);
};

Init.prototype.hasClass = function (className) {
  return this.dom.some(el =>
    el.classList.contains(className)
  );
};

Init.prototype.css = function (cssName, cssValue) {
  const cssValueType = getType(cssValue);
  const cssNameType = getType(cssName);
  let isFunc = cssValueType === 'function';
  let disposedCssName;

  if (cssValue) {
    disposedCssName = upperToCamel(cssName);

    return this.each(function () {
      isFunc && (cssValue = cssValue.call(this, cssImplicitAccessor(this)(disposedCssName)));

      if (this.nodeType !== 1) {
        return;
      }

      this.style[ disposedCssName ] = operationCss(disposedCssName, cssValue);
    });
  }

  if (cssNameType === 'object') {
    return this.each(function () {
      const disposedValue = {};

      nativeKeys(cssName).forEach(name => {
        disposedCssName = upperToCamel(name);
        cssValue = cssName[name];
        isFunc = getType(cssValue) === 'function';
        isFunc && (cssValue = cssImplicitAccessor(this)(disposedCssName));

        disposedValue[disposedCssName] = cssValue;
      });

      addCss(this, disposedValue);
    });
  }

  const node = this.get(0);

  if (!node || node.nodeType !== 1) {
    return void 0;
  }

  return cssImplicitAccessor(node)(upperToCamel(name)) || '';
};

Init.prototype.before = function (...els) {
  operationDomPosition(self, 'beforebegin', els);
  return this;
};

Init.prototype.after = function (...els) {
  operationDomPosition(self, 'afterend', els);
  return this;
};

Init.prototype.append = function (...els) {
  operationDomPosition(self, 'beforeend', els);
  return this;
};

Init.prototype.prepend = function (...els) {
  operationDomPosition(self, 'afterbegin', els);
  return this;
};

Init.prototype.appendTo = function (target) {
  operationDomPosition($(target), 'beforeend', this);
  return this;
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
