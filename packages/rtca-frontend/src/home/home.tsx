import { useState } from 'react'
import { Link } from 'react-router-dom'
import './home.scss'

function HomePage() {
  const [username, setusername] = useState('')
  const [roomname, setroomname] = useState('')

  const joinRoom = () => {
    if (username === '' || roomname === '') {
      alert('User Name and Room Name are must!')
    }
  }

  const predefinedRoomList = [
    'zurna',
    'sohbet',
    'oyun',
    'istanbul',
    'ankara',
    'izmir',
  ]

  return (
    <div className='homePage'>
      <h1>MSN 3.1</h1>
      <input
        placeholder='User Name'
        value={username}
        onChange={(e) => setusername(e.target.value)}
      />
      <input
        placeholder='Room Name'
        value={roomname}
        onChange={(e) => setroomname(e.target.value)}
      />
      <div className='predefinedRooms'>
        {predefinedRoomList.map((roomName) => (
          <span key={roomName} onClick={() => setroomname(roomName)}>
            #{roomName}
          </span>
        ))}
      </div>
      <Link to={`/chat/${roomname}/${username}`}>
        <button onClick={joinRoom}>Join Room</button>
      </Link>
    </div>
  )
}

export default HomePage
