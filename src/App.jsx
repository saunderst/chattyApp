import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
const CHAT_SERVER_PORT = 3001;

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      numUsers: 0,
      currentUser: {name: "Bob"},
      messages: []
    }
  }

  componentDidMount() {
    this.socket = new WebSocket(`ws://localhost:${CHAT_SERVER_PORT}`);
    this.socket.onopen = (event) => {
      console.log('Connected to server');
    }
    this.socket.onmessage = (event) => {
      console.log(event);
      const newMessage = JSON.parse(event.data);
      if (newMessage.type === 'incomingStatus') {
        this.state.numUsers = newMessage.clients;
        this.state.currentUser.id = newMessage.clientID;
      }
      this._addNewMessage (newMessage);
    }
  }

  _addNewMessage = (message) => {
    const allMessages = this.state.messages.concat(message);
    this.setState({messages:allMessages});
  }

  _sendNewMessages = (message) => {
    this.socket.send(JSON.stringify(message));
  }

  _messageUpdate = (event) => {
    if (event.keyCode === 13 || event.which === 13) { // wait for the Enter key before doing anything
      const newMessage = {
        type: 'postMessage',
        username: this.state.currentUser.name,
        content: event.target.value
      };
      this._sendNewMessages (newMessage);
      event.target.value = '';
    }
  }

  _userUpdate = (event) => {
    if (event.keyCode === 13 || event.which === 13) { // wait for the Enter key before doing anything
      const oldName = this.state.currentUser.name;
      const newName = event.target.value;
      this.setState({currentUser:{name: newName}});
      const newMessage = {
        type: 'postNotification',
        username: this.state.currentUser.name,
        content: `${oldName} changed their name to ${newName}`
      };
      this._sendNewMessages (newMessage);
      event.target.value = '';
    }
  }

  render() {
    return (
      <section>
        <nav className='navbar'>
          <a href="/" className="navbar-brand">Chatty</a>
          <span id='user-count'>{this.state.numUsers} users online</span>
        </nav>
        <MessageList messages={this.state.messages}/>
        <ChatBar userName={this.state.currentUser.name} newUser={this._userUpdate} newMsg={this._messageUpdate}/>
      </section>
    );
  }
}
export default App;
