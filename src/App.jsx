import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
const CHAT_SERVER_PORT = 3001;

class App extends Component {

  // initial state with no connections
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      numUsers: 0,
      currentUser: {name: "Anonymous"},
      messages: []
    }
  }

  /* First up: establish a socket and wait for response for the server.
   * Parse each message and use it to update state in preparation for display.
   * If it's a status message, update the current number of active users.
   */
  componentDidMount() {
    this.socket = new WebSocket(`ws://localhost:${CHAT_SERVER_PORT}`);
    this.socket.onopen = (event) => {
      this.socket.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        if (newMessage.type === 'incomingStatus') {
          this.state.numUsers = newMessage.clients;
        }
        this._addNewMessage (newMessage);
      }
    }
  }

  _addNewMessage = (message) => {
    const allMessages = this.state.messages.concat(message);
    this.setState({messages:allMessages});
  }

  _sendNewMessages = (message) => {
    this.socket.send(JSON.stringify(message));
  }

  /* Here's where we look for a new message to be input by the user.
   * Wait for the Enter key, create and send the new message, and clear the field.
   */ 
  _messageUpdate = (event) => {
    if (event.keyCode === 13 || event.which === 13) {
      const newMessage = {
        type: 'postMessage',
        username: this.state.currentUser.name,
        content: event.target.value
      };
      this._sendNewMessages (newMessage);
      event.target.value = '';
    }
  }

  /* Wait for input in the user field, change state to reflect the new user name,
   * then send a notification message to the server.
   */
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

  /* Three parts to our chat interface: nav/title bar with number of active users displayed,
   * the list of messages, and the input bar for user name change and outgoing messages.
   */
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
