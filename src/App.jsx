import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
const CHAT_SERVER_PORT = 3001;

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
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
      this._addNewMessage (JSON.parse(event.data));
    }
  }

  _addNewMessage = ({id, username, content}) => {
    const allMessages = this.state.messages.concat({id, username, content, type: 'incomingMessage'});
    this.setState({messages:allMessages});
  }

  _sendNewMessages = ({username, content}) => {
    this.socket.send(JSON.stringify({username, content}));
  }

  _messageUpdate = (event) => {
    if (event.keyCode === 13 || event.which === 13) { // keep waiting for the Enter key
      const newMessage = {
        id: this.state.messages.length,
        type: 'incomingMessage',
        username: this.state.currentUser.name,
        content: event.target.value
      };
      this._sendNewMessages (newMessage);
      event.target.value = '';
    }
  }

  _userUpdate = (event) => {
    this.setState({currentUser:{name: event.target.value}});
  }

  render() {
    return (
      <section>
        <nav className='navbar'>
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages={this.state.messages}/>
        <ChatBar userName={this.state.currentUser.name} newUser={this._userUpdate} newMsg={this._messageUpdate}/>
      </section>
    );
  }
}
export default App;
