import { Server, Socket } from 'socket.io';
import { Message, MessageInput } from '../models/Message';
import { Room } from '../models/Room';

interface CustomSocket extends Socket {
  userId: string;
}

export class ChatService {
  private io: Server;
  private rooms: Map<string, Room> = new Map();
  private userStatuses: Map<string, string> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  // Room Management
  async createRoom(data: {
    name: string;
    type: 'public' | 'private';
    createdBy: string;
  }) {
    const room = await Room.create(data);
    this.rooms.set(room.id, room);
    return room;
  }

  async getRooms() {
    return Room.findAll();
  }

  async getRoom(id: string) {
    return Room.findByPk(id);
  }

  async getMessages(roomId: string) {
    return Message.findAll({ where: { roomId } });
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await Room.findByPk(roomId);
    if (room) {
      await room.update({
        members: [...(room.members || []), userId],
      });
      this.io.to(roomId).emit('userJoined', { userId });
    }
  }

  async leaveRoom(roomId: string, userId: string) {
    const room = await Room.findByPk(roomId);
    if (room) {
      await room.update({
        members: (room.members || []).filter(id => id !== userId),
      });
      this.io.to(roomId).emit('userLeft', { userId });
    }
  }

  // Message Handling
  async sendMessage(data: {
    roomId: string;
    content: string;
    senderId: string;
  }) {
    const message = await Message.create(data);
    this.io.to(data.roomId).emit('newMessage', message);
    return message;
  }

  async markMessageAsRead(messageId: string, userId: string) {
    await Message.update({ read: true }, { where: { id: messageId, userId } });
  }

  // User Presence
  updateUserStatus(userId: string, status: string): void {
    this.userStatuses.set(userId, status);
    this.io.emit('user_status_changed', { userId, status });
  }

  // Socket Event Handlers
  handleConnection(socket: CustomSocket): void {
    const userId = socket.userId;

    // Set initial status
    this.updateUserStatus(userId, 'online');

    // Room events
    socket.on('join_room', async (roomId: string) => {
      try {
        await this.joinRoom(roomId, userId);
        socket.join(roomId);
        this.io.to(roomId).emit('room_joined', { roomId, userId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    socket.on('leave_room', async (roomId: string) => {
      try {
        await this.leaveRoom(roomId, userId);
        socket.leave(roomId);
        this.io.to(roomId).emit('room_left', { roomId, userId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to leave room' });
      }
    });

    // Message events
    socket.on('send_message', async (messageData: MessageInput) => {
      try {
        const message = await this.sendMessage(messageData);
        this.io.to(messageData.roomId).emit('new_message', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('message_read', async (messageId: string) => {
      try {
        await this.markMessageAsRead(messageId, userId);
        this.io.emit('message_read', { messageId, userId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to mark message as read' });
      }
    });

    // Presence events
    socket.on('update_status', (status: string) => {
      this.updateUserStatus(userId, status);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      this.updateUserStatus(userId, 'offline');
    });
  }
}
