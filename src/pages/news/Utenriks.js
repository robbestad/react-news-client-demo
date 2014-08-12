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
      data: []
    };
  },

  componentDidMount: function() {
    //this.props.source

    $.get('http://nyhetsapiet.robbestad.no/news/utenriks', function(result) {
      var dataFromApi = $.parseJSON(result);
      var length=dataFromApi._embedded.news.length;
      if (this.isMounted()) {
        titles=[];
        ids=[];
        descriptions=[];
        data=[];
        content=[];
        for(i=0;i<dataFromApi._embedded.news.length;i++){
          titles.push(dataFromApi._embedded.news[i].title);
          ids.push(dataFromApi._embedded.news[i].uniqueid);
          descriptions.push(dataFromApi._embedded.news[i].description);
          data.push([dataFromApi._embedded.news[i].title,dataFromApi._embedded.news[i].description]);
          content.push('<p key='+dataFromApi._embedded.news[i].id+'>'+dataFromApi._embedded.news[i].title+'</p>');
        }

        this.setState({
          title: titles,
          description: descriptions,
          data: data,
          id: ids,
          content: content
        });
      }
    }.bind(this));
  },

  render: function() {
    var content = [];

    for (var i = 0; i < this.state.title.length; i++) {
      content.push(<p key={i} className="newsRow"><b>{this.state.title[i]}</b><br/>{this.state.description[i]}</p>);
     // content.push(<p key={i}> {this.state.description[i]}</p>);
    }


    return (
     <SimpleScroller className="ScrollPage" options={{scrollingX: false}}>
        <div className="ScrollPage-content">{content}</div>
      </SimpleScroller>
    );
      
  }


});

module.exports = UtenriksPage;

