/** @jsx React.DOM */

var React = require('react');
var ReactTouch = require('react-touch');

var App = require('react-touch/lib/primitives/App');
var RoutedLink = require('react-touch/lib/routing/RoutedLink');
var Header = require('../components/Header');
var LeftNavContainer = require('react-touch/lib/interactions/leftnav/LeftNavContainer');
//var Routes = require('react-router/Routes');
//var Route = require('react-router/Route');

require('./Layout.css');

// Keep in sync with Layout.css
// TODO: deprecate the CSS standard
var SIDEBAR_WIDTH = 192;
var TOPBAR_HEIGHT = 51; // + 1 for the border

var Layout = React.createClass({
  handleNavClick: function() {
    this.refs['leftNavContainer'].closeNav();
  },

  render: function() {
    var button = (
      <div className="Layout-hamburger fa fa-bars" />
    );

    var topContent = (
      <Header className="Layout-topBar">Demo: NyhetsAPI</Header>
    );

    var sideContent = (
      <div className="Layout-nav">
        <RoutedLink href="/home" className="Layout-navLink" onClick={this.handleNavClick}>Hjem</RoutedLink>
        <RoutedLink href="/innenriks" className="Layout-navLink" onClick={this.handleNavClick}>Innenriks</RoutedLink>
        <RoutedLink href="/utenriks" className="Layout-navLink" onClick={this.handleNavClick}>Utenriks</RoutedLink>
        <RoutedLink href="/sport" className="Layout-navLink" onClick={this.handleNavClick}>Sport</RoutedLink>
      </div>
    );

    return this.transferPropsTo(
      <App>
        <LeftNavContainer
          ref="leftNavContainer"
          button={button}
          topContent={topContent}
          sideContent={sideContent}
          topHeight={TOPBAR_HEIGHT}
          sideWidth={SIDEBAR_WIDTH}>
          <div className="Layout-content">
            {this.props.children}
          </div>
        </LeftNavContainer>
      </App>
    );
  }
});

Layout.TOPBAR_HEIGHT = TOPBAR_HEIGHT; // account for border

module.exports = Layout;
