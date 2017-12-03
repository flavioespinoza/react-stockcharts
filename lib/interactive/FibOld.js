"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from 'lodash';
import Chance from 'chance';
const chance = new Chance();
import socketIOClient from 'socket.io-client'

import { isDefined, isNotDefined, noop } from "../utils";
import {
  terminate,
  saveNodeType,
  isHoverForInteractiveType,
} from "./utils";
import EachFibRetracement from "./hoc/EachFibRetracement";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";
function ___timestamp () {
  var timestamp = Date.now()
  return timestamp
}
class FibonacciRetracement extends Component {
  constructor(props) {
    super(props);

    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleDrawRetracement = this.handleDrawRetracement.bind(this);

    this.handleEdge1Drag = this.handleEdge1Drag.bind(this);
    this.handleEdge2Drag = this.handleEdge2Drag.bind(this);

    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragComplete = this.handleDragComplete.bind(this);

    this.terminate = terminate.bind(this);
    this.getSelectionState = isHoverForInteractiveType("retracements")
      .bind(this);

    this.saveNodeType = saveNodeType.bind(this);
    this.nodes = [];

    this.state = {
      response: false,
      endpoint: 'http://127.0.0.1:4001'
      // endpoint: 'https://rbitrage-matrix.herokuapp.com/'
    }

  }
  handleDrawRetracement(xyValue) {
    const { current } = this.state;
    if (isDefined(current) && isDefined(current.x1)) {
      this.mouseMoved = true;
      this.setState({
        current: {
          ...current,
        x2: xyValue[0],
        y2: xyValue[1]
      }
    });
    }
  }
  handleDrag(index, xy) {
    this.setState({
      override: {
        index,
        ...xy
    }
  });
  }

  handleEdge1Drag(echo, newXYValue, origXYValue) {
    const { retracements } = this.props;
    const { index } = echo;

    const dx = origXYValue.x1Value - newXYValue.x1Value;

    this.setState({
      override: {
        index,
        x1: retracements[index].x1 - dx,
        y1: retracements[index].y1,
        x2: retracements[index].x2,
        y2: retracements[index].y2
      }
    });
  }
  handleEdge2Drag(echo, newXYValue, origXYValue) {
    const { retracements } = this.props;
    const { index } = echo;

    const dx = origXYValue.x2Value - newXYValue.x2Value;

    this.setState({
      override: {
        index,
        x1: retracements[index].x1,
        y1: retracements[index].y1,
        x2: retracements[index].x2 - dx,
        y2: retracements[index].y2
      }
    });
  }
  handleDragComplete(moreProps) {
    const { retracements } = this.props;
    const { override } = this.state;
    if (isDefined(override)) {
      const { index, ...rest } = override;

      const newRetracements = retracements.map(
          (each, idx) =>
        (idx === index
          ? { ...each, ...rest, selected: true }
    : each)
    );
      this.setState(
        {
          override: null,
        },
        () => {
        this.props.onComplete(newRetracements, moreProps);
    }
    );
    }
  }
  handleStart(xyValue, moreProps) {
    const { current } = this.state;
    if (isNotDefined(current) || isNotDefined(current.x1)) {
      this.mouseMoved = false;
      this.setState(
        {
          current: {
            x1: xyValue[0],
            y1: xyValue[1],
            x2: null,
            y2: null
          }
        },
        () => {
        this.props.onStart(moreProps);
    }
    );
    }
  }
  handleEnd(xyValue, moreProps, e) {
    const { retracements, appearance, type } = this.props;
    const { current } = this.state;

    if (this.mouseMoved && isDefined(current) && isDefined(current.x1)) {
      const newRetracements = retracements.concat({
          ...current,
        x2: xyValue[0],
        y2: xyValue[1],
        selected: true,
        appearance,
        type,
    });

      this.setState(
        {
          current: null,
        },
        () => {
        this.props.onComplete(newRetracements, moreProps, e);
      this.___execute_order(newRetracements)
    }
    );
    }
  }
  ___execute_order(__orders) {
    let __authorized = false
    let __shared_id = chance.name()
    let __fib_orders = []
    let __selected = _.find(__orders, { selected: true });
    let __dy = __selected.y2 - __selected.y1;
    let __retracements = [100, 61.8, 50, 38.2, 23.6, 0]
    for (let i = 0; i < __retracements.length; i++) {
      let __price = __selected.y2 - (__retracements[i] / 100) * __dy
      __fib_orders.push({
        order_id: chance.guid(),
        shared_id: __shared_id,
        timestamp: ___timestamp(),
        side: 'buy',
        market: 'USDT-BTC',
        price: __price.toFixed(2),
        amount: 0.001,
        type: 'limit'
      })
    }
    console.log('__fib_orders', JSON.stringify(__fib_orders, null, 2));
    let {endpoint} = this.state
    let socket = socketIOClient(endpoint)



    if (__authorized) {


      // socket.emit('Place Fib Orders', __fib_orders)
    }

  }
  componentDidMount () {
    let {endpoint} = this.state
    let socket = socketIOClient(endpoint)
    socket.on('connection', data =>
    console.log('Connected to rBitrage Matrix Server')
  )
  }
  render() {
    const { current, override } = this.state;
    const { retracements } = this.props;

    const {
      appearance,
      type
    } = this.props;
    const {
      currentPositionStroke,
      currentPositionOpacity,
      currentPositionStrokeWidth,
      currentPositionRadius
    } = this.props;

    const { enabled, hoverText } = this.props;
    const overrideIndex = isDefined(override) ? override.index : null;

    const currentRetracement = isDefined(current) && isDefined(current.x2)
      ? <EachFibRetracement
    interactive={false}
    type={type}
    appearance={appearance}
    hoverText={hoverText}
    {...current}
  />
  : null;
    return (
      <g>
      {retracements.map((each, idx) => {
        const eachAppearance = isDefined(each.appearance)
          ? { ...appearance, ...each.appearance }
  : appearance;

    return (
      <EachFibRetracement
    key={idx}
    ref={this.saveNodeType(idx)}
    index={idx}
    type={each.type}
    selected={each.selected}
    hoverText={hoverText}
    {...(idx === overrideIndex ? override : each)}
    appearance={eachAppearance}
    onDrag={this.handleDrag}
    onDragComplete={this.handleDragComplete}
  />
  );
  })}
    {currentRetracement}
  <MouseLocationIndicator
    enabled={enabled}
    snap={false}
    r={currentPositionRadius}
    stroke={currentPositionStroke}
    opacity={currentPositionOpacity}
    strokeWidth={currentPositionStrokeWidth}
    onMouseDown={this.handleStart}
    onClick={this.handleEnd}
    onMouseMove={this.handleDrawRetracement}
  />
  </g>
  );
  }
}

// onClick={this.handleClick}

FibonacciRetracement.propTypes = {
  enabled: PropTypes.bool.isRequired,
  width: PropTypes.number,

  onStart: PropTypes.func,
  onComplete: PropTypes.func,
  onSelect: PropTypes.func,

  type: PropTypes.oneOf([
    "EXTEND", // extends from -Infinity to +Infinity
    "RAY", // extends to +/-Infinity in one direction
    "BOUND" // extends between the set bounds
  ]).isRequired,
  hoverText: PropTypes.object.isRequired,

  currentPositionStroke: PropTypes.string,
  currentPositionStrokeWidth: PropTypes.number,
  currentPositionOpacity: PropTypes.number,
  currentPositionRadius: PropTypes.number,

  retracements: PropTypes.array.isRequired,

  appearance: PropTypes.shape({
    stroke: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    strokeOpacity: PropTypes.number.isRequired,
    fontFamily: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    fontFill: PropTypes.string.isRequired,
    edgeStroke: PropTypes.string.isRequired,
    edgeFill: PropTypes.string.isRequired,
    nsEdgeFill: PropTypes.string.isRequired,
    edgeStrokeWidth: PropTypes.number.isRequired,
    r: PropTypes.number.isRequired,
  }).isRequired
};

FibonacciRetracement.defaultProps = {
  enabled: true,
  type: "RAY",
  retracements: [],

  onStart: noop,
  onComplete: noop,
  onSelect: noop,

  hoverText: {
    ...HoverTextNearMouse.defaultProps,
  enable: true,
  bgHeight: 18,
  bgWidth: 120,
  text: "Click to select object"
},
  currentPositionStroke: "#ff5735",
  currentPositionOpacity: 0.25,
  currentPositionStrokeWidth: 3,
  currentPositionRadius: 24,

  appearance: {
  stroke: "#000000",
    strokeWidth: 0.25,
    strokeOpacity: 0.25,
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    fontSize: 10,
    fontFill: "#000000",
    edgeStroke: "#000000",
    edgeFill: "#6495ed",
    nsEdgeFill: "#000000",
    edgeStrokeWidth: 0.25,
    r: 4,
}
};

export default FibonacciRetracement;
