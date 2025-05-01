import { API_URL } from '@/config';
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
  status: 'sent' | 'read';
  createdAt: string;
}

interface Room {
  id: string;
  name: string;
  type: 'public' | 'private';
  members: string[];
}

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = "9e533389-ea76-4b3e-ab4c-d1ccc0abffa1";

  useEffect(() => {
    const newSocket = io("http://localhost:3000/api/chat");

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      // Fetch rooms when connected
      fetchRooms();
    });

    newSocket.on('new_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('room_joined', (data: { roomId: string; userId: string }) => {
      console.log(`Joined room: ${data.roomId}`);
      if (data.roomId === currentRoom?.id) {
        fetchMessages(data.roomId);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/chat/rooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      setRooms([]);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/chat/rooms/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (socket && currentRoom && inputMessage.trim() && userId) {
      try {
        const response = await fetch(`http://localhost:3001/api/chat/rooms/${currentRoom.id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            content: inputMessage,
            userId: userId,
          }),
        });
        
        if (response.ok) {
          setInputMessage('');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const joinRoom = async (room: Room) => {
    if (socket && userId) {
      try {
        const response = await fetch(`http://localhost:3001/api/chat/rooms/${room.id}/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ userId }),
        });
        
        if (response.ok) {
          setCurrentRoom(room);
          fetchMessages(room.id);
        }
      } catch (error) {
        console.error('Failed to join room:', error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chat Rooms</h2>
        </div>
        <div className="p-4">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => joinRoom(room)}
              className={`w-full p-2 mb-2 rounded-lg text-left ${
                currentRoom?.id === room.id
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-white shadow">
          <h2 className="text-xl font-semibold">
            {currentRoom ? currentRoom.name : 'Select a room'}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.senderId === userId ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.senderId === userId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {message.content}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 