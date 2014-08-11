/** @jsx React.DOM */

var React = require('react');

var ZyngaScroller = require('react-touch/lib/environment/ZyngaScroller');
var AnimatableContainer = require('react-touch/lib/primitives/AnimatableContainer');
var TouchableArea = require('react-touch/lib/primitives/TouchableArea');

var ANIMATABLE_CONTAINER_STYLE = {
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0
};

/**
SimpleScroller component from react-touch, with event for detecting content resizes with overflow/underflow events.
See these articles: 
http://www.backalleycoder.com/2013/03/14/oft-overlooked-overflow-and-underflow-events/
http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
**/

var DynamicContentScroller = React.createClass({

  addFlowListener: function(element, type, fn) {
    var flow = type == 'over';
    element.addEventListener('OverflowEvent' in window ? 'overflowchanged' : type + 'flow', function(e){
      if (e.type == (type + 'flow') ||
      ((e.orient == 0 && e.horizontalOverflow == flow) ||
      (e.orient == 1 && e.verticalOverflow == flow) ||
      (e.orient == 2 && e.horizontalOverflow == flow && e.verticalOverflow == flow))) {
        e.flow = type;
        return fn.call(this, e);
      }
    }, false);
  },
  fireEvent: function(element, type, data, options) {
    var options = options || {},
      event = document.createEvent('Event');
    event.initEvent(type, 'bubbles' in options ? options.bubbles : true, 'cancelable' in options ? options.cancelable : true);
    for (var z in data) event[z] = data[z];
    element.dispatchEvent(event);
  },
  addResizeListener: function(element, fn){
    var resize = 'onresize' in element;
    if (!resize && !element._resizeSensor) {
      var sensor = element._resizeSensor = this.refs.sensor.getDOMNode();
        
      var x = 0, y = 0,
        first = sensor.firstElementChild.firstChild,
        last = sensor.lastElementChild.firstChild,
        matchFlow = (function(event){
          var change = false,
            width = element.offsetWidth;
          if (x != width) {
            first.style.width = width - 1 + 'px'; 
            last.style.width = width + 1 + 'px';
            change = true;
            x = width;
          }
          var height = element.offsetHeight;
          if (y != height) {
            first.style.height = height - 1 + 'px';
            last.style.height = height + 1 + 'px';  
            change = true;
            y = height;
          }
          if (change && event.currentTarget != element) this.fireEvent(element, 'resize');
        }).bind(this);
      
      if (getComputedStyle(element).position == 'static'){
        element.style.position = 'relative';
        element._resizeSensor._resetPosition = true;
      }
      this.addFlowListener(sensor, 'over', matchFlow);
      this.addFlowListener(sensor, 'under', matchFlow);
      this.addFlowListener(sensor.firstElementChild, 'over', matchFlow);
      this.addFlowListener(sensor.lastElementChild, 'under', matchFlow);
      matchFlow({});
    }
    var events = element._flowEvents || (element._flowEvents = []);
    if (events.indexOf(fn) == -1) events.push(fn);
    if (!resize) element.addEventListener('resize', fn, false);
    element.onresize = function(e){
      events.forEach(function(fn){
        fn.call(element, e);
      });
    };
  },
  removeResizeListener: function(element, fn){
    var index = element._flowEvents.indexOf(fn);
    if (index > -1) element._flowEvents.splice(index, 1);
    if (!element._flowEvents.length) {
      var sensor = element._resizeSensor;
      if (sensor) {
        if (sensor._resetPosition) element.style.position = 'static';
      }
      if ('onresize' in element) element.onresize = null;
      delete element._flowEvents;
    }
    element.removeEventListener('resize', fn);
  },
  handleContentResize: function(e) {
    if(this.configured) {
      // re-calculate the dimensions of the Scroller
      this.configured = false;
      this.configure();
    }
  },

  getInitialState: function() {
    return {left: 0, top: 0};
  },

  componentWillMount: function() {
    this.scroller = new Scroller(this.handleScroll, this.props.options);
    this.configured = false;
  },
  componentWillUnmount: function() {
    // remove event listeners
    var node = this.refs.content.getDOMNode();
    this.removeResizeListener(node, this.handleContentResize);
  },

  componentDidMount: function() {
    // attach event listeners
    var node = this.refs.content.getDOMNode();
    this.addResizeListener(node, this.handleContentResize);
    this.configure();
  },

  componentDidUpdate: function() {
    this.configure();
  },

  configure: function() {
    if (this.configured) {
      return;
    }
    this.configured = true;
    var node = this.refs.content.getDOMNode();
    this.scroller.setDimensions(
      this.getDOMNode().clientWidth,
      this.getDOMNode().clientHeight,
      node.clientWidth,
      node.clientHeight
    );
  },

  handleScroll: function(left, top) {
    this.setState({
      left: left,
      top: top
    });
  },

  render: function() {
    return this.transferPropsTo(
      <TouchableArea scroller={this.scroller} style={{overflow: 'hidden'}}>
        <AnimatableContainer translate={{x: -1 * this.state.left, y: -1 * this.state.top}}
          style={ANIMATABLE_CONTAINER_STYLE}>
          <div ref="content">{this.props.children}
            <div ref="sensor" className="resize-sensor">
              <div className="resize-overflow"><div></div></div>
              <div className="resize-underflow"><div></div></div>
            </div>
          </div>
        </AnimatableContainer>
      </TouchableArea>
    );
  }
});

module.exports = DynamicContentScroller;