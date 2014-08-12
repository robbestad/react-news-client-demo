/** @jsx React.DOM */

var React = require('react');

var SimpleScroller =
  require('../../components/DynamicContentScroller');


require('../ScrollPage.css');

var UtenriksPage = React.createClass({
  getInitialState: function() {
    return {
      title: [''],
      description: [''],
      id: [''],
      url: []
    };
  },

  componentDidMount: function() {
    var hash = window.location.hash.split(/(\/)/);
    var uricomponent=hash[hash.length-1];
    $.get('http://nyhetsapiet.robbestad.no/news/'+uricomponent, function(result) {
      var dataFromApi = $.parseJSON(result);
      var length=dataFromApi._embedded.news.length;
      if (this.isMounted()) {
        titles=[];
        ids=[];
        descriptions=[];
        urls=[];
        for(i=0;i<dataFromApi._embedded.news.length;i++){
          var time=dataFromApi._embedded.news[i].unixtime;
          var desc=dataFromApi._embedded.news[i].description;
          var date = new Date(time*1000);
          // hours part from the timestamp
          var hours = date.getHours();
          // minutes part from the timestamp
          var minutes = date.getMinutes();

          // will display time in 10:30:23 format
          var formattedTime =hours + ':' + minutes;

          titles.push(dataFromApi._embedded.news[i].title);
          ids.push(dataFromApi._embedded.news[i].uniqueid);
          descriptions.push(formattedTime+': '+desc);
          urls.push(dataFromApi._embedded.news[i].link);
        }

        this.setState({
          title: titles,
          description: descriptions,
          id: ids,
          url: urls,
        });
      }
    }.bind(this));
  },

  render: function() {
    var content = [];

    for (var i = 0; i < this.state.title.length; i++) {
      var link = React.DOM.a({href: this.state.url[i]}, this.state.title[i]);
      content.push(<p key={i} className="newsRow"><b>{link}</b><br/>{this.state.description[i]}</p>);
    }


    return (
     <SimpleScroller className="ScrollPage" options={{scrollingX: false}}>
        <div className="ScrollPage-content">{content}</div>
      </SimpleScroller>
    );
      
  }


});

module.exports = UtenriksPage;

