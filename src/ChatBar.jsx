import React, {Component} from 'react';

class ChatBar extends Component {
  render() {
    return (
      <footer className='chatbar'>
        <input className='chatbar-username' defaultValue={this.props.userName} onChange={this.props.newUser} placeholder='Your Name (Optional)' />
        <input className='chatbar-message' name='chatbarMessage' onKeyPress={this.props.newMsg} placeholder='Type a message and hit ENTER' />
      </footer>
    );
  }
}
export default ChatBar;
