Chatty App
=====================

A single-page multi-user chat app with a basic server.

## Features

Displays a chat log consisting of user messages and system notifications.

When any connected user sends a chat message, all connected users receive and display the message.

Connecting users are identified as "Anonymous" by default, and have the option of specifying an identifying name and changing it at any time.

When any connected user changes their name, all connected users are notified of the name change.

Header displays the count of currently connected users.

Different users' names are coloured differently on the main display.

## Usage

Clone project and run `npm install` to install dependencies.

`npm start` from the root directory to start the web server.

`npm start` from the `chatty_server` directory to start the chat server.

The web server by default listens at `localhost:3000`.

## Dependencies

### Client
* react
* react-dom

### Server
* express
* ws
* uuid

## Screenshots

!["Screenshot of ChattyApp messages"](https://github.com/saunderst/chattyApp/blob/master/ChattyAppScreenshot.png)
