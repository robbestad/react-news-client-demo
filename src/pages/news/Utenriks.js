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
          titles.push(dataFromApi._embedded.news[i].title);
          ids.push(dataFromApi._embedded.news[i].uniqueid);
          descriptions.push(dataFromApi._embedded.news[i].description);
          urls.push(dataFromApi._embedded.news[i].url);
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
      content.push(<p key={i} className="newsRow"><b><a href="{this.state.url[i]}">{this.state.title[i]}</a></b><br/>{this.state.description[i]}</p>);
    }


    return (
     <SimpleScroller className="ScrollPage" options={{scrollingX: false}}>
        <div className="ScrollPage-content">{content}</div>
      </SimpleScroller>
    );
      
  }


});

module.exports = UtenriksPage;

