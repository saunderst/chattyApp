import React, {Component} from 'react';

// a couple of input boxes that allow the user to change name and enter messages for broadcast
class ChatBar extends Component {
  render() {
    return (
      <footer className='chatbar'>
        <input className='chatbar-username' onKeyPress={this.props.newUser} placeholder='Your Name (Optional)' />
        <input className='chatbar-message' name='chatbarMessage' onKeyPress={this.props.newMsg} placeholder='Type a message and hit ENTER' />
      </footer>
    );
  }
}
export default ChatBar;
