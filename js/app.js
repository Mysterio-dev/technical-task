(() => {
    var __webpack_modules__ = {
        158: function(module, exports, __webpack_require__) {
            var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;
            (function(global, factory) {
                if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = "function" === typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module) : __WEBPACK_AMD_DEFINE_FACTORY__, 
                void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
            })("undefined" != typeof window && window, (function() {
                "use strict";
                function EvEmitter() {}
                var proto = EvEmitter.prototype;
                proto.on = function(eventName, listener) {
                    if (!eventName || !listener) return;
                    var events = this._events = this._events || {};
                    var listeners = events[eventName] = events[eventName] || [];
                    if (-1 == listeners.indexOf(listener)) listeners.push(listener);
                    return this;
                };
                proto.once = function(eventName, listener) {
                    if (!eventName || !listener) return;
                    this.on(eventName, listener);
                    var onceEvents = this._onceEvents = this._onceEvents || {};
                    var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
                    onceListeners[listener] = true;
                    return this;
                };
                proto.off = function(eventName, listener) {
                    var listeners = this._events && this._events[eventName];
                    if (!listeners || !listeners.length) return;
                    var index = listeners.indexOf(listener);
                    if (-1 != index) listeners.splice(index, 1);
                    return this;
                };
                proto.emitEvent = function(eventName, args) {
                    var listeners = this._events && this._events[eventName];
                    if (!listeners || !listeners.length) return;
                    listeners = listeners.slice(0);
                    args = args || [];
                    var onceListeners = this._onceEvents && this._onceEvents[eventName];
                    for (var i = 0; i < listeners.length; i++) {
                        var listener = listeners[i];
                        var isOnce = onceListeners && onceListeners[listener];
                        if (isOnce) {
                            this.off(eventName, listener);
                            delete onceListeners[listener];
                        }
                        listener.apply(this, args);
                    }
                    return this;
                };
                proto.allOff = function() {
                    delete this._events;
                    delete this._onceEvents;
                };
                return EvEmitter;
            }));
        },
        692: (module, exports, __webpack_require__) => {
            var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
            /*!
 * Huebee v2.1.1
 * 1-click color picker
 * MIT license
 * https://huebee.buzz
 * Copyright 2020 Metafizzy
 */            (function(window, factory) {
                if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(158), __webpack_require__(704) ], 
                __WEBPACK_AMD_DEFINE_RESULT__ = function(EvEmitter, Unipointer) {
                    return factory(window, EvEmitter, Unipointer);
                }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
            })(window, (function factory(window, EvEmitter, Unipointer) {
                function Huebee(anchor, options) {
                    anchor = getQueryElement(anchor);
                    if (!anchor) throw new Error("Bad element for Huebee: " + anchor);
                    this.anchor = anchor;
                    this.options = {};
                    this.option(Huebee.defaults);
                    this.option(options);
                    this.create();
                }
                Huebee.defaults = {
                    hues: 12,
                    hue0: 0,
                    shades: 5,
                    saturations: 3,
                    notation: "shortHex",
                    setText: true,
                    setBGColor: true
                };
                var proto = Huebee.prototype = Object.create(EvEmitter.prototype);
                proto.option = function(options) {
                    this.options = extend(this.options, options);
                };
                var GUID = 0;
                var instances = {};
                proto.create = function() {
                    var guid = this.guid = ++GUID;
                    this.anchor.huebeeGUID = guid;
                    instances[guid] = this;
                    this.setBGElems = this.getSetElems(this.options.setBGColor);
                    this.setTextElems = this.getSetElems(this.options.setText);
                    this.outsideCloseIt = this.outsideClose.bind(this);
                    this.onDocKeydown = this.docKeydown.bind(this);
                    this.closeIt = this.close.bind(this);
                    this.openIt = this.open.bind(this);
                    this.onElemTransitionend = this.elemTransitionend.bind(this);
                    this.isInputAnchor = "INPUT" == this.anchor.nodeName;
                    if (!this.options.staticOpen) {
                        this.anchor.addEventListener("click", this.openIt);
                        this.anchor.addEventListener("focus", this.openIt);
                    }
                    if (this.isInputAnchor) this.anchor.addEventListener("input", this.inputInput.bind(this));
                    var element = this.element = document.createElement("div");
                    element.className = "huebee ";
                    element.className += this.options.staticOpen ? "is-static-open " : "is-hidden ";
                    element.className += this.options.className || "";
                    var container = this.container = document.createElement("div");
                    container.className = "huebee__container";
                    function onContainerPointerStart(event) {
                        if (event.target == container) event.preventDefault();
                    }
                    container.addEventListener("mousedown", onContainerPointerStart);
                    container.addEventListener("touchstart", onContainerPointerStart);
                    this.createCanvas();
                    this.cursor = document.createElement("div");
                    this.cursor.className = "huebee__cursor is-hidden";
                    container.appendChild(this.cursor);
                    this.createCloseButton();
                    element.appendChild(container);
                    if (!this.options.staticOpen) {
                        var parentStyle = getComputedStyle(this.anchor.parentNode);
                        if ("relative" != parentStyle.position && "absolute" != parentStyle.position) this.anchor.parentNode.style.position = "relative";
                    }
                    var customLength = this.getCustomLength();
                    this.satY = customLength ? Math.ceil(customLength / this.options.hues) + 1 : 0;
                    this.updateColors();
                    this.setAnchorColor();
                    if (this.options.staticOpen) this.open();
                };
                proto.getSetElems = function(option) {
                    if (true === option) return [ this.anchor ]; else if ("string" == typeof option) return document.querySelectorAll(option);
                };
                proto.getCustomLength = function() {
                    var customColors = this.options.customColors;
                    return customColors && customColors.length || 0;
                };
                proto.createCanvas = function() {
                    var canvas = this.canvas = document.createElement("canvas");
                    canvas.className = "huebee__canvas";
                    this.ctx = canvas.getContext("2d");
                    var canvasPointer = this.canvasPointer = new Unipointer;
                    canvasPointer._bindStartEvent(canvas);
                    canvasPointer.on("pointerDown", this.canvasPointerDown.bind(this));
                    canvasPointer.on("pointerMove", this.canvasPointerMove.bind(this));
                    this.container.appendChild(canvas);
                };
                var svgURI = "http://www.w3.org/2000/svg";
                proto.createCloseButton = function() {
                    if (this.options.staticOpen) return;
                    var svg = document.createElementNS(svgURI, "svg");
                    svg.setAttribute("class", "huebee__close-button");
                    svg.setAttribute("viewBox", "0 0 24 24");
                    svg.setAttribute("width", "24");
                    svg.setAttribute("height", "24");
                    var path = document.createElementNS(svgURI, "path");
                    path.setAttribute("d", "M 7,7 L 17,17 M 17,7 L 7,17");
                    path.setAttribute("class", "huebee__close-button__x");
                    svg.appendChild(path);
                    svg.addEventListener("click", this.closeIt);
                    this.container.appendChild(svg);
                };
                proto.updateColors = function() {
                    this.swatches = {};
                    this.colorGrid = {};
                    this.updateColorModer();
                    var shades = this.options.shades;
                    var sats = this.options.saturations;
                    var hues = this.options.hues;
                    if (this.getCustomLength()) {
                        var customI = 0;
                        this.options.customColors.forEach(function(color) {
                            var x = customI % hues;
                            var y = Math.floor(customI / hues);
                            var swatch = getSwatch(color);
                            if (swatch) {
                                this.addSwatch(swatch, x, y);
                                customI++;
                            }
                        }.bind(this));
                    }
                    var i;
                    for (i = 0; i < sats; i++) {
                        var sat = 1 - i / sats;
                        var yOffset = shades * i + this.satY;
                        this.updateSaturationGrid(i, sat, yOffset);
                    }
                    var grayCount = this.getGrayCount();
                    for (i = 0; i < grayCount; i++) {
                        var lum = 1 - i / (shades + 1);
                        var color = this.colorModer(0, 0, lum);
                        var swatch = getSwatch(color);
                        this.addSwatch(swatch, hues + 1, i);
                    }
                };
                proto.getGrayCount = function() {
                    return this.options.shades ? this.options.shades + 2 : 0;
                };
                proto.updateSaturationGrid = function(i, sat, yOffset) {
                    var shades = this.options.shades;
                    var hues = this.options.hues;
                    var hue0 = this.options.hue0;
                    for (var row = 0; row < shades; row++) for (var col = 0; col < hues; col++) {
                        var hue = Math.round(360 * col / hues + hue0) % 360;
                        var lum = 1 - (row + 1) / (shades + 1);
                        var color = this.colorModer(hue, sat, lum);
                        var swatch = getSwatch(color);
                        var gridY = row + yOffset;
                        this.addSwatch(swatch, col, gridY);
                    }
                };
                proto.addSwatch = function(swatch, gridX, gridY) {
                    this.swatches[gridX + "," + gridY] = swatch;
                    this.colorGrid[swatch.color.toUpperCase()] = {
                        x: gridX,
                        y: gridY
                    };
                };
                var colorModers = {
                    hsl: function(h, s, l) {
                        s = Math.round(100 * s);
                        l = Math.round(100 * l);
                        return "hsl(" + h + ", " + s + "%, " + l + "%)";
                    },
                    hex: hsl2hex,
                    shortHex: function(h, s, l) {
                        var hex = hsl2hex(h, s, l);
                        return roundHex(hex);
                    }
                };
                proto.updateColorModer = function() {
                    this.colorModer = colorModers[this.options.notation] || colorModers.shortHex;
                };
                proto.renderColors = function() {
                    var gridSize = 2 * this.gridSize;
                    for (var position in this.swatches) {
                        var swatch = this.swatches[position];
                        var duple = position.split(",");
                        var gridX = duple[0];
                        var gridY = duple[1];
                        this.ctx.fillStyle = swatch.color;
                        this.ctx.fillRect(gridX * gridSize, gridY * gridSize, gridSize, gridSize);
                    }
                };
                proto.setAnchorColor = function() {
                    if (this.isInputAnchor) this.setColor(this.anchor.value);
                };
                var docElem = document.documentElement;
                proto.open = function() {
                    if (this.isOpen) return;
                    var anchor = this.anchor;
                    var elem = this.element;
                    if (!this.options.staticOpen) {
                        elem.style.left = anchor.offsetLeft + "px";
                        elem.style.top = anchor.offsetTop + anchor.offsetHeight + "px";
                    }
                    this.bindOpenEvents(true);
                    elem.removeEventListener("transitionend", this.onElemTransitionend);
                    anchor.parentNode.insertBefore(elem, anchor.nextSibling);
                    var duration = getComputedStyle(elem).transitionDuration;
                    this.hasTransition = duration && "none" != duration && parseFloat(duration);
                    this.isOpen = true;
                    this.updateSizes();
                    this.renderColors();
                    this.setAnchorColor();
                    elem.offsetHeight;
                    elem.classList.remove("is-hidden");
                };
                proto.bindOpenEvents = function(isAdd) {
                    if (this.options.staticOpen) return;
                    var method = (isAdd ? "add" : "remove") + "EventListener";
                    docElem[method]("mousedown", this.outsideCloseIt);
                    docElem[method]("touchstart", this.outsideCloseIt);
                    document[method]("focusin", this.outsideCloseIt);
                    document[method]("keydown", this.onDocKeydown);
                    this.anchor[method]("blur", this.closeIt);
                };
                proto.updateSizes = function() {
                    var hues = this.options.hues;
                    var shades = this.options.shades;
                    var sats = this.options.saturations;
                    var grayCount = this.getGrayCount();
                    var customLength = this.getCustomLength();
                    this.cursorBorder = parseInt(getComputedStyle(this.cursor).borderTopWidth, 10);
                    this.gridSize = Math.round(this.cursor.offsetWidth - 2 * this.cursorBorder);
                    this.canvasOffset = {
                        x: this.canvas.offsetLeft,
                        y: this.canvas.offsetTop
                    };
                    var cols, rows;
                    if (customLength && !grayCount) {
                        cols = Math.min(customLength, hues);
                        rows = Math.ceil(customLength / hues);
                    } else {
                        cols = hues + 2;
                        rows = Math.max(shades * sats + this.satY, grayCount);
                    }
                    var width = this.canvas.width = cols * this.gridSize * 2;
                    this.canvas.height = rows * this.gridSize * 2;
                    this.canvas.style.width = width / 2 + "px";
                };
                proto.outsideClose = function(event) {
                    var isAnchor = this.anchor.contains(event.target);
                    var isElement = this.element.contains(event.target);
                    if (!isAnchor && !isElement) this.close();
                };
                var closeKeydowns = {
                    13: true,
                    27: true
                };
                proto.docKeydown = function(event) {
                    if (closeKeydowns[event.keyCode]) this.close();
                };
                var supportsTransitions = "string" == typeof docElem.style.transform;
                proto.close = function() {
                    if (!this.isOpen) return;
                    if (supportsTransitions && this.hasTransition) this.element.addEventListener("transitionend", this.onElemTransitionend); else this.remove();
                    this.element.classList.add("is-hidden");
                    this.bindOpenEvents(false);
                    this.isOpen = false;
                };
                proto.remove = function() {
                    var parent = this.element.parentNode;
                    if (parent.contains(this.element)) parent.removeChild(this.element);
                };
                proto.elemTransitionend = function(event) {
                    if (event.target != this.element) return;
                    this.element.removeEventListener("transitionend", this.onElemTransitionend);
                    this.remove();
                };
                proto.inputInput = function() {
                    this.setColor(this.anchor.value);
                };
                proto.canvasPointerDown = function(event, pointer) {
                    event.preventDefault();
                    this.updateOffset();
                    this.canvasPointerChange(pointer);
                };
                proto.updateOffset = function() {
                    var boundingRect = this.canvas.getBoundingClientRect();
                    this.offset = {
                        x: boundingRect.left + window.pageXOffset,
                        y: boundingRect.top + window.pageYOffset
                    };
                };
                proto.canvasPointerMove = function(event, pointer) {
                    this.canvasPointerChange(pointer);
                };
                proto.canvasPointerChange = function(pointer) {
                    var x = Math.round(pointer.pageX - this.offset.x);
                    var y = Math.round(pointer.pageY - this.offset.y);
                    var gridSize = this.gridSize;
                    var sx = Math.floor(x / gridSize);
                    var sy = Math.floor(y / gridSize);
                    var swatch = this.swatches[sx + "," + sy];
                    this.setSwatch(swatch);
                };
                proto.setColor = function(color) {
                    var swatch = getSwatch(color);
                    this.setSwatch(swatch);
                };
                proto.setSwatch = function(swatch) {
                    var color = swatch && swatch.color;
                    if (!swatch) return;
                    var wasSameColor = color == this.color;
                    this.color = color;
                    this.hue = swatch.hue;
                    this.sat = swatch.sat;
                    this.lum = swatch.lum;
                    var lightness = this.lum - .15 * Math.cos((this.hue + 70) / 180 * Math.PI);
                    this.isLight = lightness > .5;
                    var gridPosition = this.colorGrid[color.toUpperCase()];
                    this.updateCursor(gridPosition);
                    this.setTexts();
                    this.setBackgrounds();
                    if (!wasSameColor) this.emitEvent("change", [ color, swatch.hue, swatch.sat, swatch.lum ]);
                };
                proto.setTexts = function() {
                    if (!this.setTextElems) return;
                    for (var i = 0; i < this.setTextElems.length; i++) {
                        var elem = this.setTextElems[i];
                        var property = "INPUT" == elem.nodeName ? "value" : "textContent";
                        elem[property] = this.color;
                    }
                };
                proto.setBackgrounds = function() {
                    if (!this.setBGElems) return;
                    var textColor = this.isLight ? "#222" : "white";
                    for (var i = 0; i < this.setBGElems.length; i++) {
                        var elem = this.setBGElems[i];
                        elem.style.backgroundColor = this.color;
                        elem.style.color = textColor;
                    }
                };
                proto.updateCursor = function(position) {
                    if (!this.isOpen) return;
                    var classMethod = position ? "remove" : "add";
                    this.cursor.classList[classMethod]("is-hidden");
                    if (!position) return;
                    var gridSize = this.gridSize;
                    var offset = this.canvasOffset;
                    var border = this.cursorBorder;
                    this.cursor.style.left = position.x * gridSize + offset.x - border + "px";
                    this.cursor.style.top = position.y * gridSize + offset.y - border + "px";
                };
                var console = window.console;
                function htmlInit() {
                    var elems = document.querySelectorAll("[data-huebee]");
                    for (var i = 0; i < elems.length; i++) {
                        var elem = elems[i];
                        var attr = elem.getAttribute("data-huebee");
                        var options;
                        try {
                            options = attr && JSON.parse(attr);
                        } catch (error) {
                            if (console) console.error("Error parsing data-huebee on " + elem.className + ": " + error);
                            continue;
                        }
                        new Huebee(elem, options);
                    }
                }
                var readyState = document.readyState;
                if ("complete" == readyState || "interactive" == readyState) htmlInit(); else document.addEventListener("DOMContentLoaded", htmlInit);
                Huebee.data = function(elem) {
                    elem = getQueryElement(elem);
                    var id = elem && elem.huebeeGUID;
                    return id && instances[id];
                };
                var proxyCtx;
                function getSwatch(color) {
                    if (!proxyCtx) {
                        var proxyCanvas = document.createElement("canvas");
                        proxyCanvas.width = proxyCanvas.height = 1;
                        proxyCtx = proxyCanvas.getContext("2d");
                    }
                    proxyCtx.clearRect(0, 0, 1, 1);
                    proxyCtx.fillStyle = "#010203";
                    proxyCtx.fillStyle = color;
                    proxyCtx.fillRect(0, 0, 1, 1);
                    var data = proxyCtx.getImageData(0, 0, 1, 1).data;
                    data = [ data[0], data[1], data[2], data[3] ];
                    if ("1,2,3,255" == data.join(",")) return;
                    var hsl = rgb2hsl.apply(this, data);
                    return {
                        color: color.trim(),
                        hue: hsl[0],
                        sat: hsl[1],
                        lum: hsl[2]
                    };
                }
                function extend(a, b) {
                    for (var prop in b) a[prop] = b[prop];
                    return a;
                }
                function getQueryElement(elem) {
                    if ("string" == typeof elem) elem = document.querySelector(elem);
                    return elem;
                }
                function hsl2hex(h, s, l) {
                    var rgb = hsl2rgb(h, s, l);
                    return rgb2hex(rgb);
                }
                function hsl2rgb(h, s, l) {
                    var C = (1 - Math.abs(2 * l - 1)) * s;
                    var hp = h / 60;
                    var X = C * (1 - Math.abs(hp % 2 - 1));
                    var rgb, m;
                    switch (Math.floor(hp)) {
                      case 0:
                        rgb = [ C, X, 0 ];
                        break;

                      case 1:
                        rgb = [ X, C, 0 ];
                        break;

                      case 2:
                        rgb = [ 0, C, X ];
                        break;

                      case 3:
                        rgb = [ 0, X, C ];
                        break;

                      case 4:
                        rgb = [ X, 0, C ];
                        break;

                      case 5:
                        rgb = [ C, 0, X ];
                        break;

                      default:
                        rgb = [ 0, 0, 0 ];
                    }
                    m = l - C / 2;
                    rgb = rgb.map((function(v) {
                        return v + m;
                    }));
                    return rgb;
                }
                function rgb2hsl(r, g, b) {
                    r /= 255;
                    g /= 255;
                    b /= 255;
                    var M = Math.max(r, g, b);
                    var m = Math.min(r, g, b);
                    var C = M - m;
                    var L = .5 * (M + m);
                    var S = 0 === C ? 0 : C / (1 - Math.abs(2 * L - 1));
                    var h;
                    if (0 === C) h = 0; else if (M === r) h = (g - b) / C % 6; else if (M === g) h = (b - r) / C + 2; else if (M === b) h = (r - g) / C + 4;
                    var H = 60 * h;
                    return [ H, parseFloat(S), parseFloat(L) ];
                }
                function rgb2hex(rgb) {
                    var hex = rgb.map((function(value) {
                        value = Math.round(255 * value);
                        var hexNum = value.toString(16).toUpperCase();
                        hexNum = hexNum.length < 2 ? "0" + hexNum : hexNum;
                        return hexNum;
                    }));
                    return "#" + hex.join("");
                }
                function roundHex(hex) {
                    return "#" + hex[1] + hex[3] + hex[5];
                }
                return Huebee;
            }));
        },
        704: (module, exports, __webpack_require__) => {
            var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
            /*!
 * Unipointer v2.4.0
 * base class for doing one thing with pointer event
 * MIT license
 */            (function(window, factory) {
                if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(158) ], __WEBPACK_AMD_DEFINE_RESULT__ = function(EvEmitter) {
                    return factory(window, EvEmitter);
                }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
            })(window, (function factory(window, EvEmitter) {
                "use strict";
                function noop() {}
                function Unipointer() {}
                var proto = Unipointer.prototype = Object.create(EvEmitter.prototype);
                proto.bindStartEvent = function(elem) {
                    this._bindStartEvent(elem, true);
                };
                proto.unbindStartEvent = function(elem) {
                    this._bindStartEvent(elem, false);
                };
                proto._bindStartEvent = function(elem, isAdd) {
                    isAdd = void 0 === isAdd ? true : isAdd;
                    var bindMethod = isAdd ? "addEventListener" : "removeEventListener";
                    var startEvent = "mousedown";
                    if ("ontouchstart" in window) startEvent = "touchstart"; else if (window.PointerEvent) startEvent = "pointerdown";
                    elem[bindMethod](startEvent, this);
                };
                proto.handleEvent = function(event) {
                    var method = "on" + event.type;
                    if (this[method]) this[method](event);
                };
                proto.getTouch = function(touches) {
                    for (var i = 0; i < touches.length; i++) {
                        var touch = touches[i];
                        if (touch.identifier == this.pointerIdentifier) return touch;
                    }
                };
                proto.onmousedown = function(event) {
                    var button = event.button;
                    if (button && 0 !== button && 1 !== button) return;
                    this._pointerDown(event, event);
                };
                proto.ontouchstart = function(event) {
                    this._pointerDown(event, event.changedTouches[0]);
                };
                proto.onpointerdown = function(event) {
                    this._pointerDown(event, event);
                };
                proto._pointerDown = function(event, pointer) {
                    if (event.button || this.isPointerDown) return;
                    this.isPointerDown = true;
                    this.pointerIdentifier = void 0 !== pointer.pointerId ? pointer.pointerId : pointer.identifier;
                    this.pointerDown(event, pointer);
                };
                proto.pointerDown = function(event, pointer) {
                    this._bindPostStartEvents(event);
                    this.emitEvent("pointerDown", [ event, pointer ]);
                };
                var postStartEvents = {
                    mousedown: [ "mousemove", "mouseup" ],
                    touchstart: [ "touchmove", "touchend", "touchcancel" ],
                    pointerdown: [ "pointermove", "pointerup", "pointercancel" ]
                };
                proto._bindPostStartEvents = function(event) {
                    if (!event) return;
                    var events = postStartEvents[event.type];
                    events.forEach((function(eventName) {
                        window.addEventListener(eventName, this);
                    }), this);
                    this._boundPointerEvents = events;
                };
                proto._unbindPostStartEvents = function() {
                    if (!this._boundPointerEvents) return;
                    this._boundPointerEvents.forEach((function(eventName) {
                        window.removeEventListener(eventName, this);
                    }), this);
                    delete this._boundPointerEvents;
                };
                proto.onmousemove = function(event) {
                    this._pointerMove(event, event);
                };
                proto.onpointermove = function(event) {
                    if (event.pointerId == this.pointerIdentifier) this._pointerMove(event, event);
                };
                proto.ontouchmove = function(event) {
                    var touch = this.getTouch(event.changedTouches);
                    if (touch) this._pointerMove(event, touch);
                };
                proto._pointerMove = function(event, pointer) {
                    this.pointerMove(event, pointer);
                };
                proto.pointerMove = function(event, pointer) {
                    this.emitEvent("pointerMove", [ event, pointer ]);
                };
                proto.onmouseup = function(event) {
                    this._pointerUp(event, event);
                };
                proto.onpointerup = function(event) {
                    if (event.pointerId == this.pointerIdentifier) this._pointerUp(event, event);
                };
                proto.ontouchend = function(event) {
                    var touch = this.getTouch(event.changedTouches);
                    if (touch) this._pointerUp(event, touch);
                };
                proto._pointerUp = function(event, pointer) {
                    this._pointerDone();
                    this.pointerUp(event, pointer);
                };
                proto.pointerUp = function(event, pointer) {
                    this.emitEvent("pointerUp", [ event, pointer ]);
                };
                proto._pointerDone = function() {
                    this._pointerReset();
                    this._unbindPostStartEvents();
                    this.pointerDone();
                };
                proto._pointerReset = function() {
                    this.isPointerDown = false;
                    delete this.pointerIdentifier;
                };
                proto.pointerDone = noop;
                proto.onpointercancel = function(event) {
                    if (event.pointerId == this.pointerIdentifier) this._pointerCancel(event, event);
                };
                proto.ontouchcancel = function(event) {
                    var touch = this.getTouch(event.changedTouches);
                    if (touch) this._pointerCancel(event, touch);
                };
                proto._pointerCancel = function(event, pointer) {
                    this._pointerDone();
                    this.pointerCancel(event, pointer);
                };
                proto.pointerCancel = function(event, pointer) {
                    this.emitEvent("pointerCancel", [ event, pointer ]);
                };
                Unipointer.getPointerPoint = function(pointer) {
                    return {
                        x: pointer.pageX,
                        y: pointer.pageY
                    };
                };
                return Unipointer;
            }));
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        "use strict";
        function isWebp() {
            function testWebP(callback) {
                let webP = new Image;
                webP.onload = webP.onerror = function() {
                    callback(2 == webP.height);
                };
                webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
            }
            testWebP((function(support) {
                let className = true === support ? "webp" : "no-webp";
                document.documentElement.classList.add(className);
            }));
        }
        let addWindowScrollEvent = false;
        setTimeout((() => {
            if (addWindowScrollEvent) {
                let windowScroll = new Event("windowScroll");
                window.addEventListener("scroll", (function(e) {
                    document.dispatchEvent(windowScroll);
                }));
            }
        }), 0);
        /**!
 * Sortable 1.15.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
        function ownKeys(object, enumerableOnly) {
            var keys = Object.keys(object);
            if (Object.getOwnPropertySymbols) {
                var symbols = Object.getOwnPropertySymbols(object);
                if (enumerableOnly) symbols = symbols.filter((function(sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                }));
                keys.push.apply(keys, symbols);
            }
            return keys;
        }
        function _objectSpread2(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = null != arguments[i] ? arguments[i] : {};
                if (i % 2) ownKeys(Object(source), true).forEach((function(key) {
                    _defineProperty(target, key, source[key]);
                })); else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); else ownKeys(Object(source)).forEach((function(key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                }));
            }
            return target;
        }
        function _typeof(obj) {
            "@babel/helpers - typeof";
            if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) _typeof = function(obj) {
                return typeof obj;
            }; else _typeof = function(obj) {
                return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            return _typeof(obj);
        }
        function _defineProperty(obj, key, value) {
            if (key in obj) Object.defineProperty(obj, key, {
                value,
                enumerable: true,
                configurable: true,
                writable: true
            }); else obj[key] = value;
            return obj;
        }
        function _extends() {
            _extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
                }
                return target;
            };
            return _extends.apply(this, arguments);
        }
        function _objectWithoutPropertiesLoose(source, excluded) {
            if (null == source) return {};
            var target = {};
            var sourceKeys = Object.keys(source);
            var key, i;
            for (i = 0; i < sourceKeys.length; i++) {
                key = sourceKeys[i];
                if (excluded.indexOf(key) >= 0) continue;
                target[key] = source[key];
            }
            return target;
        }
        function _objectWithoutProperties(source, excluded) {
            if (null == source) return {};
            var target = _objectWithoutPropertiesLoose(source, excluded);
            var key, i;
            if (Object.getOwnPropertySymbols) {
                var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
                for (i = 0; i < sourceSymbolKeys.length; i++) {
                    key = sourceSymbolKeys[i];
                    if (excluded.indexOf(key) >= 0) continue;
                    if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
                    target[key] = source[key];
                }
            }
            return target;
        }
        var version = "1.15.0";
        function userAgent(pattern) {
            if ("undefined" !== typeof window && window.navigator) return !!navigator.userAgent.match(pattern);
        }
        var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
        var Edge = userAgent(/Edge/i);
        var FireFox = userAgent(/firefox/i);
        var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
        var IOS = userAgent(/iP(ad|od|hone)/i);
        var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
        var captureMode = {
            capture: false,
            passive: false
        };
        function on(el, event, fn) {
            el.addEventListener(event, fn, !IE11OrLess && captureMode);
        }
        function off(el, event, fn) {
            el.removeEventListener(event, fn, !IE11OrLess && captureMode);
        }
        function matches(el, selector) {
            if (!selector) return;
            ">" === selector[0] && (selector = selector.substring(1));
            if (el) try {
                if (el.matches) return el.matches(selector); else if (el.msMatchesSelector) return el.msMatchesSelector(selector); else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            } catch (_) {
                return false;
            }
            return false;
        }
        function getParentOrHost(el) {
            return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
        }
        function closest(el, selector, ctx, includeCTX) {
            if (el) {
                ctx = ctx || document;
                do {
                    if (null != selector && (">" === selector[0] ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) return el;
                    if (el === ctx) break;
                } while (el = getParentOrHost(el));
            }
            return null;
        }
        var R_SPACE = /\s+/g;
        function toggleClass(el, name, state) {
            if (el && name) if (el.classList) el.classList[state ? "add" : "remove"](name); else {
                var className = (" " + el.className + " ").replace(R_SPACE, " ").replace(" " + name + " ", " ");
                el.className = (className + (state ? " " + name : "")).replace(R_SPACE, " ");
            }
        }
        function css(el, prop, val) {
            var style = el && el.style;
            if (style) if (void 0 === val) {
                if (document.defaultView && document.defaultView.getComputedStyle) val = document.defaultView.getComputedStyle(el, ""); else if (el.currentStyle) val = el.currentStyle;
                return void 0 === prop ? val : val[prop];
            } else {
                if (!(prop in style) && -1 === prop.indexOf("webkit")) prop = "-webkit-" + prop;
                style[prop] = val + ("string" === typeof val ? "" : "px");
            }
        }
        function matrix(el, selfOnly) {
            var appliedTransforms = "";
            if ("string" === typeof el) appliedTransforms = el; else do {
                var transform = css(el, "transform");
                if (transform && "none" !== transform) appliedTransforms = transform + " " + appliedTransforms;
            } while (!selfOnly && (el = el.parentNode));
            var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
            return matrixFn && new matrixFn(appliedTransforms);
        }
        function find(ctx, tagName, iterator) {
            if (ctx) {
                var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
                if (iterator) for (;i < n; i++) iterator(list[i], i);
                return list;
            }
            return [];
        }
        function getWindowScrollingElement() {
            var scrollingElement = document.scrollingElement;
            if (scrollingElement) return scrollingElement; else return document.documentElement;
        }
        function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
            if (!el.getBoundingClientRect && el !== window) return;
            var elRect, top, left, bottom, right, height, width;
            if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
                elRect = el.getBoundingClientRect();
                top = elRect.top;
                left = elRect.left;
                bottom = elRect.bottom;
                right = elRect.right;
                height = elRect.height;
                width = elRect.width;
            } else {
                top = 0;
                left = 0;
                bottom = window.innerHeight;
                right = window.innerWidth;
                height = window.innerHeight;
                width = window.innerWidth;
            }
            if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
                container = container || el.parentNode;
                if (!IE11OrLess) do {
                    if (container && container.getBoundingClientRect && ("none" !== css(container, "transform") || relativeToNonStaticParent && "static" !== css(container, "position"))) {
                        var containerRect = container.getBoundingClientRect();
                        top -= containerRect.top + parseInt(css(container, "border-top-width"));
                        left -= containerRect.left + parseInt(css(container, "border-left-width"));
                        bottom = top + elRect.height;
                        right = left + elRect.width;
                        break;
                    }
                } while (container = container.parentNode);
            }
            if (undoScale && el !== window) {
                var elMatrix = matrix(container || el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d;
                if (elMatrix) {
                    top /= scaleY;
                    left /= scaleX;
                    width /= scaleX;
                    height /= scaleY;
                    bottom = top + height;
                    right = left + width;
                }
            }
            return {
                top,
                left,
                bottom,
                right,
                width,
                height
            };
        }
        function isScrolledPast(el, elSide, parentSide) {
            var parent = getParentAutoScrollElement(el, true), elSideVal = getRect(el)[elSide];
            while (parent) {
                var parentSideVal = getRect(parent)[parentSide], visible = void 0;
                if ("top" === parentSide || "left" === parentSide) visible = elSideVal >= parentSideVal; else visible = elSideVal <= parentSideVal;
                if (!visible) return parent;
                if (parent === getWindowScrollingElement()) break;
                parent = getParentAutoScrollElement(parent, false);
            }
            return false;
        }
        function getChild(el, childNum, options, includeDragEl) {
            var currentChild = 0, i = 0, children = el.children;
            while (i < children.length) {
                if ("none" !== children[i].style.display && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
                    if (currentChild === childNum) return children[i];
                    currentChild++;
                }
                i++;
            }
            return null;
        }
        function lastChild(el, selector) {
            var last = el.lastElementChild;
            while (last && (last === Sortable.ghost || "none" === css(last, "display") || selector && !matches(last, selector))) last = last.previousElementSibling;
            return last || null;
        }
        function index(el, selector) {
            var index = 0;
            if (!el || !el.parentNode) return -1;
            while (el = el.previousElementSibling) if ("TEMPLATE" !== el.nodeName.toUpperCase() && el !== Sortable.clone && (!selector || matches(el, selector))) index++;
            return index;
        }
        function getRelativeScrollOffset(el) {
            var offsetLeft = 0, offsetTop = 0, winScroller = getWindowScrollingElement();
            if (el) do {
                var elMatrix = matrix(el), scaleX = elMatrix.a, scaleY = elMatrix.d;
                offsetLeft += el.scrollLeft * scaleX;
                offsetTop += el.scrollTop * scaleY;
            } while (el !== winScroller && (el = el.parentNode));
            return [ offsetLeft, offsetTop ];
        }
        function indexOfObject(arr, obj) {
            for (var i in arr) {
                if (!arr.hasOwnProperty(i)) continue;
                for (var key in obj) if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
            }
            return -1;
        }
        function getParentAutoScrollElement(el, includeSelf) {
            if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
            var elem = el;
            var gotSelf = false;
            do {
                if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
                    var elemCSS = css(elem);
                    if (elem.clientWidth < elem.scrollWidth && ("auto" == elemCSS.overflowX || "scroll" == elemCSS.overflowX) || elem.clientHeight < elem.scrollHeight && ("auto" == elemCSS.overflowY || "scroll" == elemCSS.overflowY)) {
                        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
                        if (gotSelf || includeSelf) return elem;
                        gotSelf = true;
                    }
                }
            } while (elem = elem.parentNode);
            return getWindowScrollingElement();
        }
        function extend(dst, src) {
            if (dst && src) for (var key in src) if (src.hasOwnProperty(key)) dst[key] = src[key];
            return dst;
        }
        function isRectEqual(rect1, rect2) {
            return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
        }
        var _throttleTimeout;
        function throttle(callback, ms) {
            return function() {
                if (!_throttleTimeout) {
                    var args = arguments, _this = this;
                    if (1 === args.length) callback.call(_this, args[0]); else callback.apply(_this, args);
                    _throttleTimeout = setTimeout((function() {
                        _throttleTimeout = void 0;
                    }), ms);
                }
            };
        }
        function cancelThrottle() {
            clearTimeout(_throttleTimeout);
            _throttleTimeout = void 0;
        }
        function scrollBy(el, x, y) {
            el.scrollLeft += x;
            el.scrollTop += y;
        }
        function clone(el) {
            var Polymer = window.Polymer;
            var $ = window.jQuery || window.Zepto;
            if (Polymer && Polymer.dom) return Polymer.dom(el).cloneNode(true); else if ($) return $(el).clone(true)[0]; else return el.cloneNode(true);
        }
        var expando = "Sortable" + (new Date).getTime();
        function AnimationStateManager() {
            var animationCallbackId, animationStates = [];
            return {
                captureAnimationState: function captureAnimationState() {
                    animationStates = [];
                    if (!this.options.animation) return;
                    var children = [].slice.call(this.el.children);
                    children.forEach((function(child) {
                        if ("none" === css(child, "display") || child === Sortable.ghost) return;
                        animationStates.push({
                            target: child,
                            rect: getRect(child)
                        });
                        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);
                        if (child.thisAnimationDuration) {
                            var childMatrix = matrix(child, true);
                            if (childMatrix) {
                                fromRect.top -= childMatrix.f;
                                fromRect.left -= childMatrix.e;
                            }
                        }
                        child.fromRect = fromRect;
                    }));
                },
                addAnimationState: function addAnimationState(state) {
                    animationStates.push(state);
                },
                removeAnimationState: function removeAnimationState(target) {
                    animationStates.splice(indexOfObject(animationStates, {
                        target
                    }), 1);
                },
                animateAll: function animateAll(callback) {
                    var _this = this;
                    if (!this.options.animation) {
                        clearTimeout(animationCallbackId);
                        if ("function" === typeof callback) callback();
                        return;
                    }
                    var animating = false, animationTime = 0;
                    animationStates.forEach((function(state) {
                        var time = 0, target = state.target, fromRect = target.fromRect, toRect = getRect(target), prevFromRect = target.prevFromRect, prevToRect = target.prevToRect, animatingRect = state.rect, targetMatrix = matrix(target, true);
                        if (targetMatrix) {
                            toRect.top -= targetMatrix.f;
                            toRect.left -= targetMatrix.e;
                        }
                        target.toRect = toRect;
                        if (target.thisAnimationDuration) if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
                        if (!isRectEqual(toRect, fromRect)) {
                            target.prevFromRect = fromRect;
                            target.prevToRect = toRect;
                            if (!time) time = _this.options.animation;
                            _this.animate(target, animatingRect, toRect, time);
                        }
                        if (time) {
                            animating = true;
                            animationTime = Math.max(animationTime, time);
                            clearTimeout(target.animationResetTimer);
                            target.animationResetTimer = setTimeout((function() {
                                target.animationTime = 0;
                                target.prevFromRect = null;
                                target.fromRect = null;
                                target.prevToRect = null;
                                target.thisAnimationDuration = null;
                            }), time);
                            target.thisAnimationDuration = time;
                        }
                    }));
                    clearTimeout(animationCallbackId);
                    if (!animating) {
                        if ("function" === typeof callback) callback();
                    } else animationCallbackId = setTimeout((function() {
                        if ("function" === typeof callback) callback();
                    }), animationTime);
                    animationStates = [];
                },
                animate: function animate(target, currentRect, toRect, duration) {
                    if (duration) {
                        css(target, "transition", "");
                        css(target, "transform", "");
                        var elMatrix = matrix(this.el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d, translateX = (currentRect.left - toRect.left) / (scaleX || 1), translateY = (currentRect.top - toRect.top) / (scaleY || 1);
                        target.animatingX = !!translateX;
                        target.animatingY = !!translateY;
                        css(target, "transform", "translate3d(" + translateX + "px," + translateY + "px,0)");
                        this.forRepaintDummy = repaint(target);
                        css(target, "transition", "transform " + duration + "ms" + (this.options.easing ? " " + this.options.easing : ""));
                        css(target, "transform", "translate3d(0,0,0)");
                        "number" === typeof target.animated && clearTimeout(target.animated);
                        target.animated = setTimeout((function() {
                            css(target, "transition", "");
                            css(target, "transform", "");
                            target.animated = false;
                            target.animatingX = false;
                            target.animatingY = false;
                        }), duration);
                    }
                }
            };
        }
        function repaint(target) {
            return target.offsetWidth;
        }
        function calculateRealTime(animatingRect, fromRect, toRect, options) {
            return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
        }
        var plugins = [];
        var defaults = {
            initializeByDefault: true
        };
        var PluginManager = {
            mount: function mount(plugin) {
                for (var option in defaults) if (defaults.hasOwnProperty(option) && !(option in plugin)) plugin[option] = defaults[option];
                plugins.forEach((function(p) {
                    if (p.pluginName === plugin.pluginName) throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
                }));
                plugins.push(plugin);
            },
            pluginEvent: function pluginEvent(eventName, sortable, evt) {
                var _this = this;
                this.eventCanceled = false;
                evt.cancel = function() {
                    _this.eventCanceled = true;
                };
                var eventNameGlobal = eventName + "Global";
                plugins.forEach((function(plugin) {
                    if (!sortable[plugin.pluginName]) return;
                    if (sortable[plugin.pluginName][eventNameGlobal]) sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
                        sortable
                    }, evt));
                    if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) sortable[plugin.pluginName][eventName](_objectSpread2({
                        sortable
                    }, evt));
                }));
            },
            initializePlugins: function initializePlugins(sortable, el, defaults, options) {
                plugins.forEach((function(plugin) {
                    var pluginName = plugin.pluginName;
                    if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
                    var initialized = new plugin(sortable, el, sortable.options);
                    initialized.sortable = sortable;
                    initialized.options = sortable.options;
                    sortable[pluginName] = initialized;
                    _extends(defaults, initialized.defaults);
                }));
                for (var option in sortable.options) {
                    if (!sortable.options.hasOwnProperty(option)) continue;
                    var modified = this.modifyOption(sortable, option, sortable.options[option]);
                    if ("undefined" !== typeof modified) sortable.options[option] = modified;
                }
            },
            getEventProperties: function getEventProperties(name, sortable) {
                var eventProperties = {};
                plugins.forEach((function(plugin) {
                    if ("function" !== typeof plugin.eventProperties) return;
                    _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
                }));
                return eventProperties;
            },
            modifyOption: function modifyOption(sortable, name, value) {
                var modifiedValue;
                plugins.forEach((function(plugin) {
                    if (!sortable[plugin.pluginName]) return;
                    if (plugin.optionListeners && "function" === typeof plugin.optionListeners[name]) modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
                }));
                return modifiedValue;
            }
        };
        function dispatchEvent(_ref) {
            var sortable = _ref.sortable, rootEl = _ref.rootEl, name = _ref.name, targetEl = _ref.targetEl, cloneEl = _ref.cloneEl, toEl = _ref.toEl, fromEl = _ref.fromEl, oldIndex = _ref.oldIndex, newIndex = _ref.newIndex, oldDraggableIndex = _ref.oldDraggableIndex, newDraggableIndex = _ref.newDraggableIndex, originalEvent = _ref.originalEvent, putSortable = _ref.putSortable, extraEventProperties = _ref.extraEventProperties;
            sortable = sortable || rootEl && rootEl[expando];
            if (!sortable) return;
            var evt, options = sortable.options, onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
            if (window.CustomEvent && !IE11OrLess && !Edge) evt = new CustomEvent(name, {
                bubbles: true,
                cancelable: true
            }); else {
                evt = document.createEvent("Event");
                evt.initEvent(name, true, true);
            }
            evt.to = toEl || rootEl;
            evt.from = fromEl || rootEl;
            evt.item = targetEl || rootEl;
            evt.clone = cloneEl;
            evt.oldIndex = oldIndex;
            evt.newIndex = newIndex;
            evt.oldDraggableIndex = oldDraggableIndex;
            evt.newDraggableIndex = newDraggableIndex;
            evt.originalEvent = originalEvent;
            evt.pullMode = putSortable ? putSortable.lastPutMode : void 0;
            var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
            for (var option in allEventProperties) evt[option] = allEventProperties[option];
            if (rootEl) rootEl.dispatchEvent(evt);
            if (options[onName]) options[onName].call(sortable, evt);
        }
        var _excluded = [ "evt" ];
        var pluginEvent = function pluginEvent(eventName, sortable) {
            var _ref = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, originalEvent = _ref.evt, data = _objectWithoutProperties(_ref, _excluded);
            PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
                dragEl,
                parentEl,
                ghostEl,
                rootEl,
                nextEl,
                lastDownEl,
                cloneEl,
                cloneHidden,
                dragStarted: moved,
                putSortable,
                activeSortable: Sortable.active,
                originalEvent,
                oldIndex,
                oldDraggableIndex,
                newIndex,
                newDraggableIndex,
                hideGhostForTarget: _hideGhostForTarget,
                unhideGhostForTarget: _unhideGhostForTarget,
                cloneNowHidden: function cloneNowHidden() {
                    cloneHidden = true;
                },
                cloneNowShown: function cloneNowShown() {
                    cloneHidden = false;
                },
                dispatchSortableEvent: function dispatchSortableEvent(name) {
                    _dispatchEvent({
                        sortable,
                        name,
                        originalEvent
                    });
                }
            }, data));
        };
        function _dispatchEvent(info) {
            dispatchEvent(_objectSpread2({
                putSortable,
                cloneEl,
                targetEl: dragEl,
                rootEl,
                oldIndex,
                oldDraggableIndex,
                newIndex,
                newDraggableIndex
            }, info));
        }
        var dragEl, parentEl, ghostEl, rootEl, nextEl, lastDownEl, cloneEl, cloneHidden, oldIndex, newIndex, oldDraggableIndex, newDraggableIndex, activeGroup, putSortable, tapEvt, touchEvt, lastDx, lastDy, tapDistanceLeft, tapDistanceTop, moved, lastTarget, lastDirection, targetMoveDistance, ghostRelativeParent, awaitingDragStarted = false, ignoreNextClick = false, sortables = [], pastFirstInvertThresh = false, isCircumstantialInvert = false, ghostRelativeParentInitialScroll = [], _silent = false, savedInputChecked = [];
        var documentExists = "undefined" !== typeof document, PositionGhostAbsolutely = IOS, CSSFloatProperty = Edge || IE11OrLess ? "cssFloat" : "float", supportDraggable = documentExists && !ChromeForAndroid && !IOS && "draggable" in document.createElement("div"), supportCssPointerEvents = function() {
            if (!documentExists) return;
            if (IE11OrLess) return false;
            var el = document.createElement("x");
            el.style.cssText = "pointer-events:auto";
            return "auto" === el.style.pointerEvents;
        }(), _detectDirection = function _detectDirection(el, options) {
            var elCSS = css(el), elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth), child1 = getChild(el, 0, options), child2 = getChild(el, 1, options), firstChildCSS = child1 && css(child1), secondChildCSS = child2 && css(child2), firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width, secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
            if ("flex" === elCSS.display) return "column" === elCSS.flexDirection || "column-reverse" === elCSS.flexDirection ? "vertical" : "horizontal";
            if ("grid" === elCSS.display) return elCSS.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
            if (child1 && firstChildCSS["float"] && "none" !== firstChildCSS["float"]) {
                var touchingSideChild2 = "left" === firstChildCSS["float"] ? "left" : "right";
                return child2 && ("both" === secondChildCSS.clear || secondChildCSS.clear === touchingSideChild2) ? "vertical" : "horizontal";
            }
            return child1 && ("block" === firstChildCSS.display || "flex" === firstChildCSS.display || "table" === firstChildCSS.display || "grid" === firstChildCSS.display || firstChildWidth >= elWidth && "none" === elCSS[CSSFloatProperty] || child2 && "none" === elCSS[CSSFloatProperty] && firstChildWidth + secondChildWidth > elWidth) ? "vertical" : "horizontal";
        }, _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
            var dragElS1Opp = vertical ? dragRect.left : dragRect.top, dragElS2Opp = vertical ? dragRect.right : dragRect.bottom, dragElOppLength = vertical ? dragRect.width : dragRect.height, targetS1Opp = vertical ? targetRect.left : targetRect.top, targetS2Opp = vertical ? targetRect.right : targetRect.bottom, targetOppLength = vertical ? targetRect.width : targetRect.height;
            return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
        }, _detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
            var ret;
            sortables.some((function(sortable) {
                var threshold = sortable[expando].options.emptyInsertThreshold;
                if (!threshold || lastChild(sortable)) return;
                var rect = getRect(sortable), insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold, insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
                if (insideHorizontally && insideVertically) return ret = sortable;
            }));
            return ret;
        }, _prepareGroup = function _prepareGroup(options) {
            function toFn(value, pull) {
                return function(to, from, dragEl, evt) {
                    var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
                    if (null == value && (pull || sameGroup)) return true; else if (null == value || false === value) return false; else if (pull && "clone" === value) return value; else if ("function" === typeof value) return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt); else {
                        var otherGroup = (pull ? to : from).options.group.name;
                        return true === value || "string" === typeof value && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
                    }
                };
            }
            var group = {};
            var originalGroup = options.group;
            if (!originalGroup || "object" != _typeof(originalGroup)) originalGroup = {
                name: originalGroup
            };
            group.name = originalGroup.name;
            group.checkPull = toFn(originalGroup.pull, true);
            group.checkPut = toFn(originalGroup.put);
            group.revertClone = originalGroup.revertClone;
            options.group = group;
        }, _hideGhostForTarget = function _hideGhostForTarget() {
            if (!supportCssPointerEvents && ghostEl) css(ghostEl, "display", "none");
        }, _unhideGhostForTarget = function _unhideGhostForTarget() {
            if (!supportCssPointerEvents && ghostEl) css(ghostEl, "display", "");
        };
        if (documentExists && !ChromeForAndroid) document.addEventListener("click", (function(evt) {
            if (ignoreNextClick) {
                evt.preventDefault();
                evt.stopPropagation && evt.stopPropagation();
                evt.stopImmediatePropagation && evt.stopImmediatePropagation();
                ignoreNextClick = false;
                return false;
            }
        }), true);
        var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
            if (dragEl) {
                evt = evt.touches ? evt.touches[0] : evt;
                var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
                if (nearest) {
                    var event = {};
                    for (var i in evt) if (evt.hasOwnProperty(i)) event[i] = evt[i];
                    event.target = event.rootEl = nearest;
                    event.preventDefault = void 0;
                    event.stopPropagation = void 0;
                    nearest[expando]._onDragOver(event);
                }
            }
        };
        var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
            if (dragEl) dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
        };
        function Sortable(el, options) {
            if (!(el && el.nodeType && 1 === el.nodeType)) throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
            this.el = el;
            this.options = options = _extends({}, options);
            el[expando] = this;
            var defaults = {
                group: null,
                sort: true,
                disabled: false,
                store: null,
                handle: null,
                draggable: /^[uo]l$/i.test(el.nodeName) ? ">li" : ">*",
                swapThreshold: 1,
                invertSwap: false,
                invertedSwapThreshold: null,
                removeCloneOnHide: true,
                direction: function direction() {
                    return _detectDirection(el, this.options);
                },
                ghostClass: "sortable-ghost",
                chosenClass: "sortable-chosen",
                dragClass: "sortable-drag",
                ignore: "a, img",
                filter: null,
                preventOnFilter: true,
                animation: 0,
                easing: null,
                setData: function setData(dataTransfer, dragEl) {
                    dataTransfer.setData("Text", dragEl.textContent);
                },
                dropBubble: false,
                dragoverBubble: false,
                dataIdAttr: "data-id",
                delay: 0,
                delayOnTouchOnly: false,
                touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
                forceFallback: false,
                fallbackClass: "sortable-fallback",
                fallbackOnBody: false,
                fallbackTolerance: 0,
                fallbackOffset: {
                    x: 0,
                    y: 0
                },
                supportPointer: false !== Sortable.supportPointer && "PointerEvent" in window && !Safari,
                emptyInsertThreshold: 5
            };
            PluginManager.initializePlugins(this, el, defaults);
            for (var name in defaults) !(name in options) && (options[name] = defaults[name]);
            _prepareGroup(options);
            for (var fn in this) if ("_" === fn.charAt(0) && "function" === typeof this[fn]) this[fn] = this[fn].bind(this);
            this.nativeDraggable = options.forceFallback ? false : supportDraggable;
            if (this.nativeDraggable) this.options.touchStartThreshold = 1;
            if (options.supportPointer) on(el, "pointerdown", this._onTapStart); else {
                on(el, "mousedown", this._onTapStart);
                on(el, "touchstart", this._onTapStart);
            }
            if (this.nativeDraggable) {
                on(el, "dragover", this);
                on(el, "dragenter", this);
            }
            sortables.push(this.el);
            options.store && options.store.get && this.sort(options.store.get(this) || []);
            _extends(this, AnimationStateManager());
        }
        Sortable.prototype = {
            constructor: Sortable,
            _isOutsideThisEl: function _isOutsideThisEl(target) {
                if (!this.el.contains(target) && target !== this.el) lastTarget = null;
            },
            _getDirection: function _getDirection(evt, target) {
                return "function" === typeof this.options.direction ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
            },
            _onTapStart: function _onTapStart(evt) {
                if (!evt.cancelable) return;
                var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0] || evt.pointerType && "touch" === evt.pointerType && evt, target = (touch || evt).target, originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target, filter = options.filter;
                _saveInputCheckedState(el);
                if (dragEl) return;
                if (/mousedown|pointerdown/.test(type) && 0 !== evt.button || options.disabled) return;
                if (originalTarget.isContentEditable) return;
                if (!this.nativeDraggable && Safari && target && "SELECT" === target.tagName.toUpperCase()) return;
                target = closest(target, options.draggable, el, false);
                if (target && target.animated) return;
                if (lastDownEl === target) return;
                oldIndex = index(target);
                oldDraggableIndex = index(target, options.draggable);
                if ("function" === typeof filter) {
                    if (filter.call(this, evt, target, this)) {
                        _dispatchEvent({
                            sortable: _this,
                            rootEl: originalTarget,
                            name: "filter",
                            targetEl: target,
                            toEl: el,
                            fromEl: el
                        });
                        pluginEvent("filter", _this, {
                            evt
                        });
                        preventOnFilter && evt.cancelable && evt.preventDefault();
                        return;
                    }
                } else if (filter) {
                    filter = filter.split(",").some((function(criteria) {
                        criteria = closest(originalTarget, criteria.trim(), el, false);
                        if (criteria) {
                            _dispatchEvent({
                                sortable: _this,
                                rootEl: criteria,
                                name: "filter",
                                targetEl: target,
                                fromEl: el,
                                toEl: el
                            });
                            pluginEvent("filter", _this, {
                                evt
                            });
                            return true;
                        }
                    }));
                    if (filter) {
                        preventOnFilter && evt.cancelable && evt.preventDefault();
                        return;
                    }
                }
                if (options.handle && !closest(originalTarget, options.handle, el, false)) return;
                this._prepareDragStart(evt, touch, target);
            },
            _prepareDragStart: function _prepareDragStart(evt, touch, target) {
                var dragStartFn, _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument;
                if (target && !dragEl && target.parentNode === el) {
                    var dragRect = getRect(target);
                    rootEl = el;
                    dragEl = target;
                    parentEl = dragEl.parentNode;
                    nextEl = dragEl.nextSibling;
                    lastDownEl = target;
                    activeGroup = options.group;
                    Sortable.dragged = dragEl;
                    tapEvt = {
                        target: dragEl,
                        clientX: (touch || evt).clientX,
                        clientY: (touch || evt).clientY
                    };
                    tapDistanceLeft = tapEvt.clientX - dragRect.left;
                    tapDistanceTop = tapEvt.clientY - dragRect.top;
                    this._lastX = (touch || evt).clientX;
                    this._lastY = (touch || evt).clientY;
                    dragEl.style["will-change"] = "all";
                    dragStartFn = function dragStartFn() {
                        pluginEvent("delayEnded", _this, {
                            evt
                        });
                        if (Sortable.eventCanceled) {
                            _this._onDrop();
                            return;
                        }
                        _this._disableDelayedDragEvents();
                        if (!FireFox && _this.nativeDraggable) dragEl.draggable = true;
                        _this._triggerDragStart(evt, touch);
                        _dispatchEvent({
                            sortable: _this,
                            name: "choose",
                            originalEvent: evt
                        });
                        toggleClass(dragEl, options.chosenClass, true);
                    };
                    options.ignore.split(",").forEach((function(criteria) {
                        find(dragEl, criteria.trim(), _disableDraggable);
                    }));
                    on(ownerDocument, "dragover", nearestEmptyInsertDetectEvent);
                    on(ownerDocument, "mousemove", nearestEmptyInsertDetectEvent);
                    on(ownerDocument, "touchmove", nearestEmptyInsertDetectEvent);
                    on(ownerDocument, "mouseup", _this._onDrop);
                    on(ownerDocument, "touchend", _this._onDrop);
                    on(ownerDocument, "touchcancel", _this._onDrop);
                    if (FireFox && this.nativeDraggable) {
                        this.options.touchStartThreshold = 4;
                        dragEl.draggable = true;
                    }
                    pluginEvent("delayStart", this, {
                        evt
                    });
                    if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
                        if (Sortable.eventCanceled) {
                            this._onDrop();
                            return;
                        }
                        on(ownerDocument, "mouseup", _this._disableDelayedDrag);
                        on(ownerDocument, "touchend", _this._disableDelayedDrag);
                        on(ownerDocument, "touchcancel", _this._disableDelayedDrag);
                        on(ownerDocument, "mousemove", _this._delayedDragTouchMoveHandler);
                        on(ownerDocument, "touchmove", _this._delayedDragTouchMoveHandler);
                        options.supportPointer && on(ownerDocument, "pointermove", _this._delayedDragTouchMoveHandler);
                        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
                    } else dragStartFn();
                }
            },
            _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(e) {
                var touch = e.touches ? e.touches[0] : e;
                if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) this._disableDelayedDrag();
            },
            _disableDelayedDrag: function _disableDelayedDrag() {
                dragEl && _disableDraggable(dragEl);
                clearTimeout(this._dragStartTimer);
                this._disableDelayedDragEvents();
            },
            _disableDelayedDragEvents: function _disableDelayedDragEvents() {
                var ownerDocument = this.el.ownerDocument;
                off(ownerDocument, "mouseup", this._disableDelayedDrag);
                off(ownerDocument, "touchend", this._disableDelayedDrag);
                off(ownerDocument, "touchcancel", this._disableDelayedDrag);
                off(ownerDocument, "mousemove", this._delayedDragTouchMoveHandler);
                off(ownerDocument, "touchmove", this._delayedDragTouchMoveHandler);
                off(ownerDocument, "pointermove", this._delayedDragTouchMoveHandler);
            },
            _triggerDragStart: function _triggerDragStart(evt, touch) {
                touch = touch || "touch" == evt.pointerType && evt;
                if (!this.nativeDraggable || touch) if (this.options.supportPointer) on(document, "pointermove", this._onTouchMove); else if (touch) on(document, "touchmove", this._onTouchMove); else on(document, "mousemove", this._onTouchMove); else {
                    on(dragEl, "dragend", this);
                    on(rootEl, "dragstart", this._onDragStart);
                }
                try {
                    if (document.selection) _nextTick((function() {
                        document.selection.empty();
                    })); else window.getSelection().removeAllRanges();
                } catch (err) {}
            },
            _dragStarted: function _dragStarted(fallback, evt) {
                awaitingDragStarted = false;
                if (rootEl && dragEl) {
                    pluginEvent("dragStarted", this, {
                        evt
                    });
                    if (this.nativeDraggable) on(document, "dragover", _checkOutsideTargetEl);
                    var options = this.options;
                    !fallback && toggleClass(dragEl, options.dragClass, false);
                    toggleClass(dragEl, options.ghostClass, true);
                    Sortable.active = this;
                    fallback && this._appendGhost();
                    _dispatchEvent({
                        sortable: this,
                        name: "start",
                        originalEvent: evt
                    });
                } else this._nulling();
            },
            _emulateDragOver: function _emulateDragOver() {
                if (touchEvt) {
                    this._lastX = touchEvt.clientX;
                    this._lastY = touchEvt.clientY;
                    _hideGhostForTarget();
                    var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
                    var parent = target;
                    while (target && target.shadowRoot) {
                        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
                        if (target === parent) break;
                        parent = target;
                    }
                    dragEl.parentNode[expando]._isOutsideThisEl(target);
                    if (parent) do {
                        if (parent[expando]) {
                            var inserted = void 0;
                            inserted = parent[expando]._onDragOver({
                                clientX: touchEvt.clientX,
                                clientY: touchEvt.clientY,
                                target,
                                rootEl: parent
                            });
                            if (inserted && !this.options.dragoverBubble) break;
                        }
                        target = parent;
                    } while (parent = parent.parentNode);
                    _unhideGhostForTarget();
                }
            },
            _onTouchMove: function _onTouchMove(evt) {
                if (tapEvt) {
                    var options = this.options, fallbackTolerance = options.fallbackTolerance, fallbackOffset = options.fallbackOffset, touch = evt.touches ? evt.touches[0] : evt, ghostMatrix = ghostEl && matrix(ghostEl, true), scaleX = ghostEl && ghostMatrix && ghostMatrix.a, scaleY = ghostEl && ghostMatrix && ghostMatrix.d, relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent), dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1), dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);
                    if (!Sortable.active && !awaitingDragStarted) {
                        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) return;
                        this._onDragStart(evt, true);
                    }
                    if (ghostEl) {
                        if (ghostMatrix) {
                            ghostMatrix.e += dx - (lastDx || 0);
                            ghostMatrix.f += dy - (lastDy || 0);
                        } else ghostMatrix = {
                            a: 1,
                            b: 0,
                            c: 0,
                            d: 1,
                            e: dx,
                            f: dy
                        };
                        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
                        css(ghostEl, "webkitTransform", cssMatrix);
                        css(ghostEl, "mozTransform", cssMatrix);
                        css(ghostEl, "msTransform", cssMatrix);
                        css(ghostEl, "transform", cssMatrix);
                        lastDx = dx;
                        lastDy = dy;
                        touchEvt = touch;
                    }
                    evt.cancelable && evt.preventDefault();
                }
            },
            _appendGhost: function _appendGhost() {
                if (!ghostEl) {
                    var container = this.options.fallbackOnBody ? document.body : rootEl, rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container), options = this.options;
                    if (PositionGhostAbsolutely) {
                        ghostRelativeParent = container;
                        while ("static" === css(ghostRelativeParent, "position") && "none" === css(ghostRelativeParent, "transform") && ghostRelativeParent !== document) ghostRelativeParent = ghostRelativeParent.parentNode;
                        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
                            if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
                            rect.top += ghostRelativeParent.scrollTop;
                            rect.left += ghostRelativeParent.scrollLeft;
                        } else ghostRelativeParent = getWindowScrollingElement();
                        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
                    }
                    ghostEl = dragEl.cloneNode(true);
                    toggleClass(ghostEl, options.ghostClass, false);
                    toggleClass(ghostEl, options.fallbackClass, true);
                    toggleClass(ghostEl, options.dragClass, true);
                    css(ghostEl, "transition", "");
                    css(ghostEl, "transform", "");
                    css(ghostEl, "box-sizing", "border-box");
                    css(ghostEl, "margin", 0);
                    css(ghostEl, "top", rect.top);
                    css(ghostEl, "left", rect.left);
                    css(ghostEl, "width", rect.width);
                    css(ghostEl, "height", rect.height);
                    css(ghostEl, "opacity", "0.8");
                    css(ghostEl, "position", PositionGhostAbsolutely ? "absolute" : "fixed");
                    css(ghostEl, "zIndex", "100000");
                    css(ghostEl, "pointerEvents", "none");
                    Sortable.ghost = ghostEl;
                    container.appendChild(ghostEl);
                    css(ghostEl, "transform-origin", tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + "% " + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + "%");
                }
            },
            _onDragStart: function _onDragStart(evt, fallback) {
                var _this = this;
                var dataTransfer = evt.dataTransfer;
                var options = _this.options;
                pluginEvent("dragStart", this, {
                    evt
                });
                if (Sortable.eventCanceled) {
                    this._onDrop();
                    return;
                }
                pluginEvent("setupClone", this);
                if (!Sortable.eventCanceled) {
                    cloneEl = clone(dragEl);
                    cloneEl.removeAttribute("id");
                    cloneEl.draggable = false;
                    cloneEl.style["will-change"] = "";
                    this._hideClone();
                    toggleClass(cloneEl, this.options.chosenClass, false);
                    Sortable.clone = cloneEl;
                }
                _this.cloneId = _nextTick((function() {
                    pluginEvent("clone", _this);
                    if (Sortable.eventCanceled) return;
                    if (!_this.options.removeCloneOnHide) rootEl.insertBefore(cloneEl, dragEl);
                    _this._hideClone();
                    _dispatchEvent({
                        sortable: _this,
                        name: "clone"
                    });
                }));
                !fallback && toggleClass(dragEl, options.dragClass, true);
                if (fallback) {
                    ignoreNextClick = true;
                    _this._loopId = setInterval(_this._emulateDragOver, 50);
                } else {
                    off(document, "mouseup", _this._onDrop);
                    off(document, "touchend", _this._onDrop);
                    off(document, "touchcancel", _this._onDrop);
                    if (dataTransfer) {
                        dataTransfer.effectAllowed = "move";
                        options.setData && options.setData.call(_this, dataTransfer, dragEl);
                    }
                    on(document, "drop", _this);
                    css(dragEl, "transform", "translateZ(0)");
                }
                awaitingDragStarted = true;
                _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
                on(document, "selectstart", _this);
                moved = true;
                if (Safari) css(document.body, "user-select", "none");
            },
            _onDragOver: function _onDragOver(evt) {
                var dragRect, targetRect, revert, vertical, el = this.el, target = evt.target, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = activeGroup === group, canSort = options.sort, fromSortable = putSortable || activeSortable, _this = this, completedFired = false;
                if (_silent) return;
                function dragOverEvent(name, extra) {
                    pluginEvent(name, _this, _objectSpread2({
                        evt,
                        isOwner,
                        axis: vertical ? "vertical" : "horizontal",
                        revert,
                        dragRect,
                        targetRect,
                        canSort,
                        fromSortable,
                        target,
                        completed,
                        onMove: function onMove(target, after) {
                            return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
                        },
                        changed
                    }, extra));
                }
                function capture() {
                    dragOverEvent("dragOverAnimationCapture");
                    _this.captureAnimationState();
                    if (_this !== fromSortable) fromSortable.captureAnimationState();
                }
                function completed(insertion) {
                    dragOverEvent("dragOverCompleted", {
                        insertion
                    });
                    if (insertion) {
                        if (isOwner) activeSortable._hideClone(); else activeSortable._showClone(_this);
                        if (_this !== fromSortable) {
                            toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
                            toggleClass(dragEl, options.ghostClass, true);
                        }
                        if (putSortable !== _this && _this !== Sortable.active) putSortable = _this; else if (_this === Sortable.active && putSortable) putSortable = null;
                        if (fromSortable === _this) _this._ignoreWhileAnimating = target;
                        _this.animateAll((function() {
                            dragOverEvent("dragOverAnimationComplete");
                            _this._ignoreWhileAnimating = null;
                        }));
                        if (_this !== fromSortable) {
                            fromSortable.animateAll();
                            fromSortable._ignoreWhileAnimating = null;
                        }
                    }
                    if (target === dragEl && !dragEl.animated || target === el && !target.animated) lastTarget = null;
                    if (!options.dragoverBubble && !evt.rootEl && target !== document) {
                        dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
                        !insertion && nearestEmptyInsertDetectEvent(evt);
                    }
                    !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
                    return completedFired = true;
                }
                function changed() {
                    newIndex = index(dragEl);
                    newDraggableIndex = index(dragEl, options.draggable);
                    _dispatchEvent({
                        sortable: _this,
                        name: "change",
                        toEl: el,
                        newIndex,
                        newDraggableIndex,
                        originalEvent: evt
                    });
                }
                if (void 0 !== evt.preventDefault) evt.cancelable && evt.preventDefault();
                target = closest(target, options.draggable, el, true);
                dragOverEvent("dragOver");
                if (Sortable.eventCanceled) return completedFired;
                if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) return completed(false);
                ignoreNextClick = false;
                if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
                    vertical = "vertical" === this._getDirection(evt, target);
                    dragRect = getRect(dragEl);
                    dragOverEvent("dragOverValid");
                    if (Sortable.eventCanceled) return completedFired;
                    if (revert) {
                        parentEl = rootEl;
                        capture();
                        this._hideClone();
                        dragOverEvent("revert");
                        if (!Sortable.eventCanceled) if (nextEl) rootEl.insertBefore(dragEl, nextEl); else rootEl.appendChild(dragEl);
                        return completed(true);
                    }
                    var elLastChild = lastChild(el, options.draggable);
                    if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
                        if (elLastChild === dragEl) return completed(false);
                        if (elLastChild && el === evt.target) target = elLastChild;
                        if (target) targetRect = getRect(target);
                        if (false !== _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target)) {
                            capture();
                            if (elLastChild && elLastChild.nextSibling) el.insertBefore(dragEl, elLastChild.nextSibling); else el.appendChild(dragEl);
                            parentEl = el;
                            changed();
                            return completed(true);
                        }
                    } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
                        var firstChild = getChild(el, 0, options, true);
                        if (firstChild === dragEl) return completed(false);
                        target = firstChild;
                        targetRect = getRect(target);
                        if (false !== _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false)) {
                            capture();
                            el.insertBefore(dragEl, firstChild);
                            parentEl = el;
                            changed();
                            return completed(true);
                        }
                    } else if (target.parentNode === el) {
                        targetRect = getRect(target);
                        var targetBeforeFirstSwap, direction = 0, differentLevel = dragEl.parentNode !== el, differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical), side1 = vertical ? "top" : "left", scrolledPastTop = isScrolledPast(target, "top", "top") || isScrolledPast(dragEl, "top", "top"), scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
                        if (lastTarget !== target) {
                            targetBeforeFirstSwap = targetRect[side1];
                            pastFirstInvertThresh = false;
                            isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
                        }
                        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, null == options.invertedSwapThreshold ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
                        var sibling;
                        if (0 !== direction) {
                            var dragIndex = index(dragEl);
                            do {
                                dragIndex -= direction;
                                sibling = parentEl.children[dragIndex];
                            } while (sibling && ("none" === css(sibling, "display") || sibling === ghostEl));
                        }
                        if (0 === direction || sibling === target) return completed(false);
                        lastTarget = target;
                        lastDirection = direction;
                        var nextSibling = target.nextElementSibling, after = false;
                        after = 1 === direction;
                        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
                        if (false !== moveVector) {
                            if (1 === moveVector || -1 === moveVector) after = 1 === moveVector;
                            _silent = true;
                            setTimeout(_unsilent, 30);
                            capture();
                            if (after && !nextSibling) el.appendChild(dragEl); else target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
                            if (scrolledPastTop) scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
                            parentEl = dragEl.parentNode;
                            if (void 0 !== targetBeforeFirstSwap && !isCircumstantialInvert) targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
                            changed();
                            return completed(true);
                        }
                    }
                    if (el.contains(dragEl)) return completed(false);
                }
                return false;
            },
            _ignoreWhileAnimating: null,
            _offMoveEvents: function _offMoveEvents() {
                off(document, "mousemove", this._onTouchMove);
                off(document, "touchmove", this._onTouchMove);
                off(document, "pointermove", this._onTouchMove);
                off(document, "dragover", nearestEmptyInsertDetectEvent);
                off(document, "mousemove", nearestEmptyInsertDetectEvent);
                off(document, "touchmove", nearestEmptyInsertDetectEvent);
            },
            _offUpEvents: function _offUpEvents() {
                var ownerDocument = this.el.ownerDocument;
                off(ownerDocument, "mouseup", this._onDrop);
                off(ownerDocument, "touchend", this._onDrop);
                off(ownerDocument, "pointerup", this._onDrop);
                off(ownerDocument, "touchcancel", this._onDrop);
                off(document, "selectstart", this);
            },
            _onDrop: function _onDrop(evt) {
                var el = this.el, options = this.options;
                newIndex = index(dragEl);
                newDraggableIndex = index(dragEl, options.draggable);
                pluginEvent("drop", this, {
                    evt
                });
                parentEl = dragEl && dragEl.parentNode;
                newIndex = index(dragEl);
                newDraggableIndex = index(dragEl, options.draggable);
                if (Sortable.eventCanceled) {
                    this._nulling();
                    return;
                }
                awaitingDragStarted = false;
                isCircumstantialInvert = false;
                pastFirstInvertThresh = false;
                clearInterval(this._loopId);
                clearTimeout(this._dragStartTimer);
                _cancelNextTick(this.cloneId);
                _cancelNextTick(this._dragStartId);
                if (this.nativeDraggable) {
                    off(document, "drop", this);
                    off(el, "dragstart", this._onDragStart);
                }
                this._offMoveEvents();
                this._offUpEvents();
                if (Safari) css(document.body, "user-select", "");
                css(dragEl, "transform", "");
                if (evt) {
                    if (moved) {
                        evt.cancelable && evt.preventDefault();
                        !options.dropBubble && evt.stopPropagation();
                    }
                    ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
                    if (rootEl === parentEl || putSortable && "clone" !== putSortable.lastPutMode) cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
                    if (dragEl) {
                        if (this.nativeDraggable) off(dragEl, "dragend", this);
                        _disableDraggable(dragEl);
                        dragEl.style["will-change"] = "";
                        if (moved && !awaitingDragStarted) toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
                        toggleClass(dragEl, this.options.chosenClass, false);
                        _dispatchEvent({
                            sortable: this,
                            name: "unchoose",
                            toEl: parentEl,
                            newIndex: null,
                            newDraggableIndex: null,
                            originalEvent: evt
                        });
                        if (rootEl !== parentEl) {
                            if (newIndex >= 0) {
                                _dispatchEvent({
                                    rootEl: parentEl,
                                    name: "add",
                                    toEl: parentEl,
                                    fromEl: rootEl,
                                    originalEvent: evt
                                });
                                _dispatchEvent({
                                    sortable: this,
                                    name: "remove",
                                    toEl: parentEl,
                                    originalEvent: evt
                                });
                                _dispatchEvent({
                                    rootEl: parentEl,
                                    name: "sort",
                                    toEl: parentEl,
                                    fromEl: rootEl,
                                    originalEvent: evt
                                });
                                _dispatchEvent({
                                    sortable: this,
                                    name: "sort",
                                    toEl: parentEl,
                                    originalEvent: evt
                                });
                            }
                            putSortable && putSortable.save();
                        } else if (newIndex !== oldIndex) if (newIndex >= 0) {
                            _dispatchEvent({
                                sortable: this,
                                name: "update",
                                toEl: parentEl,
                                originalEvent: evt
                            });
                            _dispatchEvent({
                                sortable: this,
                                name: "sort",
                                toEl: parentEl,
                                originalEvent: evt
                            });
                        }
                        if (Sortable.active) {
                            if (null == newIndex || -1 === newIndex) {
                                newIndex = oldIndex;
                                newDraggableIndex = oldDraggableIndex;
                            }
                            _dispatchEvent({
                                sortable: this,
                                name: "end",
                                toEl: parentEl,
                                originalEvent: evt
                            });
                            this.save();
                        }
                    }
                }
                this._nulling();
            },
            _nulling: function _nulling() {
                pluginEvent("nulling", this);
                rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
                savedInputChecked.forEach((function(el) {
                    el.checked = true;
                }));
                savedInputChecked.length = lastDx = lastDy = 0;
            },
            handleEvent: function handleEvent(evt) {
                switch (evt.type) {
                  case "drop":
                  case "dragend":
                    this._onDrop(evt);
                    break;

                  case "dragenter":
                  case "dragover":
                    if (dragEl) {
                        this._onDragOver(evt);
                        _globalDragOver(evt);
                    }
                    break;

                  case "selectstart":
                    evt.preventDefault();
                    break;
                }
            },
            toArray: function toArray() {
                var el, order = [], children = this.el.children, i = 0, n = children.length, options = this.options;
                for (;i < n; i++) {
                    el = children[i];
                    if (closest(el, options.draggable, this.el, false)) order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
                }
                return order;
            },
            sort: function sort(order, useAnimation) {
                var items = {}, rootEl = this.el;
                this.toArray().forEach((function(id, i) {
                    var el = rootEl.children[i];
                    if (closest(el, this.options.draggable, rootEl, false)) items[id] = el;
                }), this);
                useAnimation && this.captureAnimationState();
                order.forEach((function(id) {
                    if (items[id]) {
                        rootEl.removeChild(items[id]);
                        rootEl.appendChild(items[id]);
                    }
                }));
                useAnimation && this.animateAll();
            },
            save: function save() {
                var store = this.options.store;
                store && store.set && store.set(this);
            },
            closest: function closest$1(el, selector) {
                return closest(el, selector || this.options.draggable, this.el, false);
            },
            option: function option(name, value) {
                var options = this.options;
                if (void 0 === value) return options[name]; else {
                    var modifiedValue = PluginManager.modifyOption(this, name, value);
                    if ("undefined" !== typeof modifiedValue) options[name] = modifiedValue; else options[name] = value;
                    if ("group" === name) _prepareGroup(options);
                }
            },
            destroy: function destroy() {
                pluginEvent("destroy", this);
                var el = this.el;
                el[expando] = null;
                off(el, "mousedown", this._onTapStart);
                off(el, "touchstart", this._onTapStart);
                off(el, "pointerdown", this._onTapStart);
                if (this.nativeDraggable) {
                    off(el, "dragover", this);
                    off(el, "dragenter", this);
                }
                Array.prototype.forEach.call(el.querySelectorAll("[draggable]"), (function(el) {
                    el.removeAttribute("draggable");
                }));
                this._onDrop();
                this._disableDelayedDragEvents();
                sortables.splice(sortables.indexOf(this.el), 1);
                this.el = el = null;
            },
            _hideClone: function _hideClone() {
                if (!cloneHidden) {
                    pluginEvent("hideClone", this);
                    if (Sortable.eventCanceled) return;
                    css(cloneEl, "display", "none");
                    if (this.options.removeCloneOnHide && cloneEl.parentNode) cloneEl.parentNode.removeChild(cloneEl);
                    cloneHidden = true;
                }
            },
            _showClone: function _showClone(putSortable) {
                if ("clone" !== putSortable.lastPutMode) {
                    this._hideClone();
                    return;
                }
                if (cloneHidden) {
                    pluginEvent("showClone", this);
                    if (Sortable.eventCanceled) return;
                    if (dragEl.parentNode == rootEl && !this.options.group.revertClone) rootEl.insertBefore(cloneEl, dragEl); else if (nextEl) rootEl.insertBefore(cloneEl, nextEl); else rootEl.appendChild(cloneEl);
                    if (this.options.group.revertClone) this.animate(dragEl, cloneEl);
                    css(cloneEl, "display", "");
                    cloneHidden = false;
                }
            }
        };
        function _globalDragOver(evt) {
            if (evt.dataTransfer) evt.dataTransfer.dropEffect = "move";
            evt.cancelable && evt.preventDefault();
        }
        function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
            var evt, retVal, sortable = fromEl[expando], onMoveFn = sortable.options.onMove;
            if (window.CustomEvent && !IE11OrLess && !Edge) evt = new CustomEvent("move", {
                bubbles: true,
                cancelable: true
            }); else {
                evt = document.createEvent("Event");
                evt.initEvent("move", true, true);
            }
            evt.to = toEl;
            evt.from = fromEl;
            evt.dragged = dragEl;
            evt.draggedRect = dragRect;
            evt.related = targetEl || toEl;
            evt.relatedRect = targetRect || getRect(toEl);
            evt.willInsertAfter = willInsertAfter;
            evt.originalEvent = originalEvent;
            fromEl.dispatchEvent(evt);
            if (onMoveFn) retVal = onMoveFn.call(sortable, evt, originalEvent);
            return retVal;
        }
        function _disableDraggable(el) {
            el.draggable = false;
        }
        function _unsilent() {
            _silent = false;
        }
        function _ghostIsFirst(evt, vertical, sortable) {
            var rect = getRect(getChild(sortable.el, 0, sortable.options, true));
            var spacer = 10;
            return vertical ? evt.clientX < rect.left - spacer || evt.clientY < rect.top && evt.clientX < rect.right : evt.clientY < rect.top - spacer || evt.clientY < rect.bottom && evt.clientX < rect.left;
        }
        function _ghostIsLast(evt, vertical, sortable) {
            var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
            var spacer = 10;
            return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
        }
        function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
            var mouseOnAxis = vertical ? evt.clientY : evt.clientX, targetLength = vertical ? targetRect.height : targetRect.width, targetS1 = vertical ? targetRect.top : targetRect.left, targetS2 = vertical ? targetRect.bottom : targetRect.right, invert = false;
            if (!invertSwap) if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
                if (!pastFirstInvertThresh && (1 === lastDirection ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) pastFirstInvertThresh = true;
                if (!pastFirstInvertThresh) {
                    if (1 === lastDirection ? mouseOnAxis < targetS1 + targetMoveDistance : mouseOnAxis > targetS2 - targetMoveDistance) return -lastDirection;
                } else invert = true;
            } else if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) return _getInsertDirection(target);
            invert = invert || invertSwap;
            if (invert) if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
            return 0;
        }
        function _getInsertDirection(target) {
            if (index(dragEl) < index(target)) return 1; else return -1;
        }
        function _generateId(el) {
            var str = el.tagName + el.className + el.src + el.href + el.textContent, i = str.length, sum = 0;
            while (i--) sum += str.charCodeAt(i);
            return sum.toString(36);
        }
        function _saveInputCheckedState(root) {
            savedInputChecked.length = 0;
            var inputs = root.getElementsByTagName("input");
            var idx = inputs.length;
            while (idx--) {
                var el = inputs[idx];
                el.checked && savedInputChecked.push(el);
            }
        }
        function _nextTick(fn) {
            return setTimeout(fn, 0);
        }
        function _cancelNextTick(id) {
            return clearTimeout(id);
        }
        if (documentExists) on(document, "touchmove", (function(evt) {
            if ((Sortable.active || awaitingDragStarted) && evt.cancelable) evt.preventDefault();
        }));
        Sortable.utils = {
            on,
            off,
            css,
            find,
            is: function is(el, selector) {
                return !!closest(el, selector, el, false);
            },
            extend,
            throttle,
            closest,
            toggleClass,
            clone,
            index,
            nextTick: _nextTick,
            cancelNextTick: _cancelNextTick,
            detectDirection: _detectDirection,
            getChild
        };
        Sortable.get = function(element) {
            return element[expando];
        };
        Sortable.mount = function() {
            for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) plugins[_key] = arguments[_key];
            if (plugins[0].constructor === Array) plugins = plugins[0];
            plugins.forEach((function(plugin) {
                if (!plugin.prototype || !plugin.prototype.constructor) throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
                if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
                PluginManager.mount(plugin);
            }));
        };
        Sortable.create = function(el, options) {
            return new Sortable(el, options);
        };
        Sortable.version = version;
        var scrollEl, scrollRootEl, lastAutoScrollX, lastAutoScrollY, touchEvt$1, pointerElemChangedInterval, autoScrolls = [], scrolling = false;
        function AutoScrollPlugin() {
            function AutoScroll() {
                this.defaults = {
                    scroll: true,
                    forceAutoScrollFallback: false,
                    scrollSensitivity: 30,
                    scrollSpeed: 10,
                    bubbleScroll: true
                };
                for (var fn in this) if ("_" === fn.charAt(0) && "function" === typeof this[fn]) this[fn] = this[fn].bind(this);
            }
            AutoScroll.prototype = {
                dragStarted: function dragStarted(_ref) {
                    var originalEvent = _ref.originalEvent;
                    if (this.sortable.nativeDraggable) on(document, "dragover", this._handleAutoScroll); else if (this.options.supportPointer) on(document, "pointermove", this._handleFallbackAutoScroll); else if (originalEvent.touches) on(document, "touchmove", this._handleFallbackAutoScroll); else on(document, "mousemove", this._handleFallbackAutoScroll);
                },
                dragOverCompleted: function dragOverCompleted(_ref2) {
                    var originalEvent = _ref2.originalEvent;
                    if (!this.options.dragOverBubble && !originalEvent.rootEl) this._handleAutoScroll(originalEvent);
                },
                drop: function drop() {
                    if (this.sortable.nativeDraggable) off(document, "dragover", this._handleAutoScroll); else {
                        off(document, "pointermove", this._handleFallbackAutoScroll);
                        off(document, "touchmove", this._handleFallbackAutoScroll);
                        off(document, "mousemove", this._handleFallbackAutoScroll);
                    }
                    clearPointerElemChangedInterval();
                    clearAutoScrolls();
                    cancelThrottle();
                },
                nulling: function nulling() {
                    touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
                    autoScrolls.length = 0;
                },
                _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
                    this._handleAutoScroll(evt, true);
                },
                _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
                    var _this = this;
                    var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, elem = document.elementFromPoint(x, y);
                    touchEvt$1 = evt;
                    if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
                        autoScroll(evt, this.options, elem, fallback);
                        var ogElemScroller = getParentAutoScrollElement(elem, true);
                        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
                            pointerElemChangedInterval && clearPointerElemChangedInterval();
                            pointerElemChangedInterval = setInterval((function() {
                                var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
                                if (newElem !== ogElemScroller) {
                                    ogElemScroller = newElem;
                                    clearAutoScrolls();
                                }
                                autoScroll(evt, _this.options, newElem, fallback);
                            }), 10);
                            lastAutoScrollX = x;
                            lastAutoScrollY = y;
                        }
                    } else {
                        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
                            clearAutoScrolls();
                            return;
                        }
                        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
                    }
                }
            };
            return _extends(AutoScroll, {
                pluginName: "scroll",
                initializeByDefault: true
            });
        }
        function clearAutoScrolls() {
            autoScrolls.forEach((function(autoScroll) {
                clearInterval(autoScroll.pid);
            }));
            autoScrolls = [];
        }
        function clearPointerElemChangedInterval() {
            clearInterval(pointerElemChangedInterval);
        }
        var autoScroll = throttle((function(evt, options, rootEl, isFallback) {
            if (!options.scroll) return;
            var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, sens = options.scrollSensitivity, speed = options.scrollSpeed, winScroller = getWindowScrollingElement();
            var scrollCustomFn, scrollThisInstance = false;
            if (scrollRootEl !== rootEl) {
                scrollRootEl = rootEl;
                clearAutoScrolls();
                scrollEl = options.scroll;
                scrollCustomFn = options.scrollFn;
                if (true === scrollEl) scrollEl = getParentAutoScrollElement(rootEl, true);
            }
            var layersOut = 0;
            var currentParent = scrollEl;
            do {
                var el = currentParent, rect = getRect(el), top = rect.top, bottom = rect.bottom, left = rect.left, right = rect.right, width = rect.width, height = rect.height, canScrollX = void 0, canScrollY = void 0, scrollWidth = el.scrollWidth, scrollHeight = el.scrollHeight, elCSS = css(el), scrollPosX = el.scrollLeft, scrollPosY = el.scrollTop;
                if (el === winScroller) {
                    canScrollX = width < scrollWidth && ("auto" === elCSS.overflowX || "scroll" === elCSS.overflowX || "visible" === elCSS.overflowX);
                    canScrollY = height < scrollHeight && ("auto" === elCSS.overflowY || "scroll" === elCSS.overflowY || "visible" === elCSS.overflowY);
                } else {
                    canScrollX = width < scrollWidth && ("auto" === elCSS.overflowX || "scroll" === elCSS.overflowX);
                    canScrollY = height < scrollHeight && ("auto" === elCSS.overflowY || "scroll" === elCSS.overflowY);
                }
                var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
                var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
                if (!autoScrolls[layersOut]) for (var i = 0; i <= layersOut; i++) if (!autoScrolls[i]) autoScrolls[i] = {};
                if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
                    autoScrolls[layersOut].el = el;
                    autoScrolls[layersOut].vx = vx;
                    autoScrolls[layersOut].vy = vy;
                    clearInterval(autoScrolls[layersOut].pid);
                    if (0 != vx || 0 != vy) {
                        scrollThisInstance = true;
                        autoScrolls[layersOut].pid = setInterval(function() {
                            if (isFallback && 0 === this.layer) Sortable.active._onTouchMove(touchEvt$1);
                            var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
                            var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
                            if ("function" === typeof scrollCustomFn) if ("continue" !== scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el)) return;
                            scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
                        }.bind({
                            layer: layersOut
                        }), 24);
                    }
                }
                layersOut++;
            } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
            scrolling = scrollThisInstance;
        }), 30);
        var drop = function drop(_ref) {
            var originalEvent = _ref.originalEvent, putSortable = _ref.putSortable, dragEl = _ref.dragEl, activeSortable = _ref.activeSortable, dispatchSortableEvent = _ref.dispatchSortableEvent, hideGhostForTarget = _ref.hideGhostForTarget, unhideGhostForTarget = _ref.unhideGhostForTarget;
            if (!originalEvent) return;
            var toSortable = putSortable || activeSortable;
            hideGhostForTarget();
            var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
            var target = document.elementFromPoint(touch.clientX, touch.clientY);
            unhideGhostForTarget();
            if (toSortable && !toSortable.el.contains(target)) {
                dispatchSortableEvent("spill");
                this.onSpill({
                    dragEl,
                    putSortable
                });
            }
        };
        function Revert() {}
        Revert.prototype = {
            startIndex: null,
            dragStart: function dragStart(_ref2) {
                var oldDraggableIndex = _ref2.oldDraggableIndex;
                this.startIndex = oldDraggableIndex;
            },
            onSpill: function onSpill(_ref3) {
                var dragEl = _ref3.dragEl, putSortable = _ref3.putSortable;
                this.sortable.captureAnimationState();
                if (putSortable) putSortable.captureAnimationState();
                var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
                if (nextSibling) this.sortable.el.insertBefore(dragEl, nextSibling); else this.sortable.el.appendChild(dragEl);
                this.sortable.animateAll();
                if (putSortable) putSortable.animateAll();
            },
            drop
        };
        _extends(Revert, {
            pluginName: "revertOnSpill"
        });
        function Remove() {}
        Remove.prototype = {
            onSpill: function onSpill(_ref4) {
                var dragEl = _ref4.dragEl, putSortable = _ref4.putSortable;
                var parentSortable = putSortable || this.sortable;
                parentSortable.captureAnimationState();
                dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
                parentSortable.animateAll();
            },
            drop
        };
        _extends(Remove, {
            pluginName: "removeOnSpill"
        });
        Sortable.mount(new AutoScrollPlugin);
        Sortable.mount(Remove, Revert);
        const sortable_esm = Sortable;
        __webpack_require__(692);
        let el = document.getElementById("items");
        sortable_esm.create(el, {
            animation: 150,
            ghostClass: "_highlight",
            handle: ".handle",
            swapThreshold: 1
        });
        window["FLS"] = true;
        isWebp();
    })();
})();