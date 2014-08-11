/** @jsx React.DOM */

var React = require('react');


require('./HomePage.css');



var HomePage = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Nyheter i dag</h2>
        <h3>Dette er et lite demoprosjekt som viser hvordan du kan presentere et sett med API-data på en mobil
        nettleser med REACT. Ytelse burde tale for seg selv.</h3>
        <p>

          Kildekoden er tilgjengelig på <a href="http://github.com/petehunt/react-touch/" target="_blank">min github-konto</a>.
        </p>
      </div>


    );
  }
});

module.exports = HomePage;
