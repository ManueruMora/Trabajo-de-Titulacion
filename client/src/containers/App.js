import React, { Component } from 'react';
import Conversation from '../services/conversation';
import ParkCard from '../components/ParkCard';
import AnimalsCard from '../components/AnimalsCard';
import PlantsCard from '../components/PlantsCard';
import WeatherCard from '../components/WeatherCard';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      conversationHistory: []
    };
  }

  componentDidMount() {
    this.sendMessage('')
  }

  render() {
    return (
      <div className="app">
        <header><img style={{maxWidth: '90px'}} src="https://pngimage.net/wp-content/uploads/2018/05/chatbot-png-2.png"></img> Chatbot IA</header>
        <section ref="main">
          { this.state.conversationHistory.map((h,i) => this.renderExchange(h, i)) }
        </section>
        <footer>
        { this.renderInputView()}
        </footer>
      </div>
    );
  }

  renderExchange(exchange, key) {
    return !!exchange.output.cardType
      ? this.renderCard(exchange, key)
      : this.renderText(exchange, key);
  }

  renderCard(exchange, key) {
    switch(exchange.output.cardType) {
      case 'park':
        return (
          <div key={key} className="exchange">
            { exchange.input.text ? <div className="user-msg">{exchange.input.text}</div> : null }
            <div className="watson-msg"><ParkCard park={exchange.output.park}/></div>
          </div>);
      case 'animals':
        return (
          <div key={key} className="exchange">
            { exchange.input.text ? <div className="user-msg">{exchange.input.text}</div> : null }
            <div className="watson-msg"><AnimalsCard park={exchange.output.park}/></div>
          </div>);
      case 'plants':
        return (
          <div key={key} className="exchange">
            { exchange.input.text ? <div className="user-msg">{exchange.input.text}</div> : null }
            <div className="watson-msg"><PlantsCard park={exchange.output.park}/></div>
          </div>);
      case 'weather':
        return (
          <div key={key} className="exchange">
            { exchange.input.text ? <div className="user-msg">{exchange.input.text}</div> : null }
            <div className="watson-msg"><WeatherCard weather={exchange.output.weather}/></div>
          </div>);    
      default:
        this.renderText(exchange,key);
    }
  }

  renderText(exchange, key) {
    return (
      <div key={key} className="exchange">        
        { exchange.input.text ? <div className="user-msg">{exchange.input.text}</div> : null }
        { exchange.output.text ? <img className="img-bot" src="https://pngimage.net/wp-content/uploads/2018/05/chatbot-png-2.png"></img> : null} 
        {/* { exchange.output.text.map((t, i) => <div key={i} className="watson-msg" >{t}</div>) } */}
        { exchange.output.text.map((t, i) => <div key={i} className="watson-msg" dangerouslySetInnerHTML={{__html: t}}></div>) }
      </div>);
  }

  renderInputView() {
    return  <div className="input-group mb-3">
              <input type="text" id="ipt-question" autoComplete="off" className="form-control" placeholder='Escriba su pregunta' aria-label="Recipient's username" aria-describedby="basic-addon2" onKeyUp={e => this.onInputKeyUp(e)}/>
              <div className="input-group-append">
                <button style={{width:'100%', height:'38px'}} className="btn btn-info" type="button" onClick={e=>this.onButtonClick()}><i className="material-icons">send</i></button>
              </div>
            </div>;
  }

  onInputKeyUp(e) {    
    switch (e.which) {
      case 0x0d:
        this.sendMessage(e.target.value);
        e.target.value = '';
        break;
      default:
        break;
    }
  }

  onButtonClick(){
    var pregunta=document.getElementById("ipt-question");    
    this.sendMessage(pregunta.value);
    pregunta.value='';
    
  }

  sendMessage(text) {
    Conversation.message({
      text
    }).then(r => {
      this.state.conversationHistory.push(r);
      this.setState({
        conversationHistory: this.state.conversationHistory
      })
    });
  }

  componentDidUpdate() {
    const scrollTo = (element, to, duration) => {
      if (duration <= 0) return;
      const difference = to - element.scrollTop;
      const perTick = difference / duration * 10;

      setTimeout(function () {
        element.scrollTop += perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
      }, 10);
    };
    const node = this.refs.main;
    scrollTo(node, node.scrollHeight, 300);
  }
}

export default App;
