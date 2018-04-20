import React, {Component} from 'react';

/* Supporting embedded images is a little complicated, so we have a special component just for the message body itself.
 * Find an image URL if there is one, then split the content into before-image and after-image parts,
 * then construct a more elaborate span including the image.
 * If there was no image, just show the (presumably plain text) content.
 */
class MessageDisplay extends Component {
  render() {
    let content = this.props.content;
    const imageUrl = content.match(/.*\s+(.*\.gif|png|jpg|jpe)/);
    if (imageUrl) {
      content = content.split(imageUrl[1]);
      return (
        <span className='message-content'>{content[0]}
          <img className='message-img' src={imageUrl[1]}/>{content[1]}
        </span>
      );
    } else {
      return (<span className='message-content'>{content}</span>);
    }
  }
}

/* Format an incoming message prefixed with the user name.
 * Use the user ID from the server to pick a unique-ish colour for the name display,
 * and use the special MessageDisplay component which can handle an embedded image if necessary.
 * If the message is a notification, simply display it.
 */
class Message extends Component {
  render() {
    return (
      this.props.message.type === 'incomingMessage' ? 
      (
        <div className='message'>
          <span className={`message-username user-color${this.props.message.userID % 4}`}>{this.props.message.username}</span>
          <MessageDisplay content={this.props.message.content}/>
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
