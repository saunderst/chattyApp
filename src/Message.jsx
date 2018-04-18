import React, {Component} from 'react';

class Message extends Component {
  render() {
    return (
      this.props.message.type === 'incomingMessage' ? 
      (
        <div className='message'>
          <span className='message-username'>{this.props.message.username}</span>
          <span className='message-content'>{this.props.message.content}</span>
        </div>
      ) : (
      this.props.message.type === 'incomingNotification' ? 
      (
        <div className='message system'>
          {this.props.message.content}
        </div>
      ) : 
      (<div></div>))
    );
  }
}
export default Message;
