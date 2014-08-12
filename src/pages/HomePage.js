/** @jsx React.DOM */

var React = require('react');


require('./HomePage.css');



var HomePage = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Demo</h2>
        <h3>Dette er et lite demoprosjekt som viser hvordan du kan presentere et sett med API-data på en mobil
        nettleser med ytelse på nivå med native.</h3>
         
          <p>

          Kildekoden er tilgjengelig på <a href="https://github.com/svenanders/react-news-client-demo" target="_blank">min github-konto</a>.
        </p>
        
      </div>


    );
  }
});

module.exports = HomePage;
