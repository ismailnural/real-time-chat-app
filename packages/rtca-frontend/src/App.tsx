import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import io, { Socket } from 'socket.io-client'
import Chat from './chat/chat'
import Home from './home/home'

import './App.scss'

const socket: Socket = io(
  process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000/'
)

const ChatComponent = (props: any) => {
  const username = props.match.params.username
  const roomname = props.match.params.roomname

  if (username !== '' && roomname !== '') {
    const color = `hsl(${Math.random() * 360}, 100%, 12%)`
    socket.emit('joinRoom', { username, roomname, color })
  }

  return <Chat username={username} roomname={roomname} socket={socket} />
}

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/chat/:roomname/:username' component={ChatComponent} />
          <Redirect to={{ pathname: '/' }} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
