var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import ReactDOM from "react-dom";

import { isDefined } from "../utils";

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}

export default function fitWidth(WrappedComponent) {
	var withRef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	var minWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

	var ResponsiveComponent = function (_Component) {
		_inherits(ResponsiveComponent, _Component);

		function ResponsiveComponent(props) {
			_classCallCheck(this, ResponsiveComponent);

			var _this = _possibleConstructorReturn(this, (ResponsiveComponent.__proto__ || Object.getPrototypeOf(ResponsiveComponent)).call(this, props));

			_this.handleWindowResize = _this.handleWindowResize.bind(_this);
			_this.getWrappedInstance = _this.getWrappedInstance.bind(_this);
			_this.saveNode = _this.saveNode.bind(_this);
			_this.setTestCanvas = _this.setTestCanvas.bind(_this);
			_this.state = {};
			return _this;
		}

		_createClass(ResponsiveComponent, [{
			key: "saveNode",
			value: function saveNode(node) {
				this.node = node;
			}
		}, {
			key: "setTestCanvas",
			value: function setTestCanvas(node) {
				this.testCanvas = node;
			}
		}, {
			key: "getRatio",
			value: function getRatio() {
				if (isDefined(this.testCanvas)) {
					var context = this.testCanvas.getContext("2d");

					var devicePixelRatio = window.devicePixelRatio || 1;
					var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;

					var ratio = devicePixelRatio / backingStoreRatio;
					// console.log("ratio = ", ratio);
					return ratio;
				}
				return 1;
			}
		}, {
			key: "componentDidMount",
			value: function componentDidMount() {
				window.addEventListener("resize", this.handleWindowResize);
				var el = this.node;
				var w = el.parentNode.clientWidth;

				/* eslint-disable react/no-did-mount-set-state */
				this.setState({
					width: Math.max(w, minWidth),
					ratio: this.getRatio()
				});
				/* eslint-enable react/no-did-mount-set-state */
			}
		}, {
			key: "componentWillUnmount",
			value: function componentWillUnmount() {
				window.removeEventListener("resize", this.handleWindowResize);
			}
		}, {
			key: "handleWindowResize",
			value: function handleWindowResize() {
				var el = ReactDOM.findDOMNode(this.node); // eslint-disable-line react/no-find-dom-node
				var w = el.parentNode.clientWidth;

				if (w > minWidth) {
					this.setState({
						width: w
					});
				}
			}
		}, {
			key: "getWrappedInstance",
			value: function getWrappedInstance() {
				return this.node;
			}
		}, {
			key: "render",
			value: function render() {
				var ref = withRef ? { ref: this.saveNode } : {};

				if (this.state.width) {
					return React.createElement(WrappedComponent, _extends({ width: this.state.width, ratio: this.state.ratio }, this.props, ref));
				} else {
					return React.createElement(
						"div",
						ref,
						React.createElement("canvas", { ref: this.setTestCanvas })
					);
				}
			}
		}]);

		return ResponsiveComponent;
	}(Component);

	ResponsiveComponent.displayName = "fitWidth(" + getDisplayName(WrappedComponent) + ")";

	return ResponsiveComponent;
}
//# sourceMappingURL=fitWidth.js.map