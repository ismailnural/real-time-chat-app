import { useState, useEffect, useRef } from 'react'
import { toDecrypt, toEncrypt } from '../aes'
import { process } from '../store/action/index'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import './chat.scss'

function Chat({
  username,
  roomname,
  socket,
}: {
  username: string
  roomname: string
  socket: any
}) {
  const [text, setText]: [string, Function] = useState('')
  const [messages, setMessages]: [any[], Function] = useState([])
  const [activeUsers, setActiveUsers]: [any[], Function] = useState([])

  const dispatch = useDispatch()

  const dispatchProcess = (encrypt: boolean, msg: string, cipher: string) => {
    dispatch(process(encrypt, msg, cipher))
  }

  useEffect(() => {
    socket.on('message', (data: any) => {
      // decypt
      const ans = toDecrypt(data.text, data.username, data.oldUsername)
      dispatchProcess(false, ans, data.text)
      let temp: any = messages
      temp.push({
        userId: data.userId,
        username: data.username,
        color: data.color,
        text: ans,
      })
      setMessages([...temp])
    })
    socket.on('userList', (data: any) => {
      setActiveUsers(data.activeUsers)
    })
  }, [socket])

  const sendData = () => {
    if (text !== '') {
      const ans = toEncrypt(text)
      socket.emit('chat', ans)
      setText('')
    }
  }
  const messagesEndRef: any = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  return (
    <div className='chatWrapper'>
      <div className='users'>
        <div className='sectionTitle'>
          <h2>Active Users ({activeUsers.length})</h2>
        </div>
        <div className='userList'>
          {activeUsers.map((user: any, key: number) => (
            <div className='userName' key={key}>
              {user.username}
            </div>
          ))}
        </div>
      </div>

      <div className='chat'>
        <div className='user-name'>
          <h2>
            {username}
            <span style={{ fontSize: '0.7rem' }}>
              <Link to='/'>#{roomname}</Link>
            </span>
          </h2>
        </div>
        <div className='chat-message'>
          {messages.map((i, key) => {
            if (i.userId === -1) {
              return (
                <div className='message mess-info' key={key}>
                  {i.text}
                </div>
              )
            } else if (i.userId === socket.id) {
              return (
                <div className='message mess-right' key={key}>
                  <span>{i.username} (you)</span>
                  <p>{i.text}</p>
                </div>
              )
            } else {
              return (
                <div className='message' key={key}>
                  <span>{i.username}</span>
                  <p style={{ backgroundColor: i.color }}>{i.text}</p>
                </div>
              )
            }
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className='send'>
          <input
            placeholder='Enter your message'
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendData()
              }
            }}
          ></input>
          <button onClick={sendData}>Send</button>
        </div>
      </div>
    </div>
  )
}
export default Chat
