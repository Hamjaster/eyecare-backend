import { Server } from 'socket.io';
import { DecodedToken } from '../middlewares/auth.middleware';

import jwt from "jsonwebtoken";
import User from '../models/User';
import Client from '../models/Client';
import Chat from '../models/Chat';
import Message from '../models/Message';
import { verifyToken } from './jwt';
import { Console } from 'console';

export const initSocket = (httpServer: any) => {
  const io = new Server(httpServer, { // Attach to httpServer, not express
    cors: {
      origin: "*", // Match your frontend origin
      methods: ["GET", "POST"],
      // credentials: true
    }
  });

  // Middleware to authenticate users
  io.use(async (socket, next) => {
    console.log(socket.handshake, 'handshake')
    let token = socket.handshake.auth.token;
    if(!token) return;
  
    const decodedToken = verifyToken(token)
    if(!decodedToken) return;
    let user: any;
    if ((await decodedToken).userType === 'user') {
      user = await User.findById((await decodedToken).id);
    } else {
      user = await Client.findById((await decodedToken).id);
    }
    if (user) {
      socket.data.user = { ...user._doc, userType: (await decodedToken).userType  };
      next();
    } else {
      next(new Error('Authentication error'));
    }
  });

// Updated socket handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.data.user._id}`);

  // Join a chat room
  socket.on('join_chat', async ({  participantId, participantType }) => {
    const currentUser = socket.data.user;
    
    // Create sorted participants array
    const participants = [
      { type: socket.data.user.userType, refId: String(currentUser._id) },
      { type: participantType, refId: participantId }
    ].sort((a, b) => {
      const typeCompare = a.type.localeCompare(b.type);
      return typeCompare !== 0 ? typeCompare : 
        a.refId.toString().localeCompare(b.refId.toString());
    });
    const participantsIds = [participantId, currentUser._id]
    // console.log(participants, 'PARTICIPANTS')
    // Find or create chat
    let chat = await Chat.findOne({
      "participants.refId": { $all: participantsIds },
      "participants": { $size: participantsIds.length } // Ensures exactly these two participants
    }).populate('participants.refId');

    if (!chat) {
      console.log('creating a new chat ')
      chat = await Chat.create({ participants });
    }
    console.log(String(chat._id), 'joining this ROOm')
    // Join room using chat ID
    socket.join(String(chat._id));

    // Fetch messages
    const messages = await Message.find({ chat: chat._id })
      .sort({ createdAt: 1 })
      .populate('sender');

    socket.emit('chat_history', messages);
  });

  // Send message
  socket.on('send_message', async ({ chatId, content }) => {
    const message = await Message.create({
      chat: chatId,
      sender: socket.data.user._id,
      content
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      lastMessageTimestamp: new Date()
    }, {new : true});
    const chats = await Chat.find({
      participants: {
        $elemMatch: {
          type: socket.data.user.userType,
          refId: socket.data.user._id
        }
      }
    })
    .populate('participants.refId lastMessage');
    io.to(chatId.toString()).emit('new_message', message);
    socket.emit('chat_list', chats);
  });

  // Get user's chats
  socket.on('get_chats', async () => {
    console.log('getting user chats', socket.data.user)
    const chats = await Chat.find({
      participants: {
        $elemMatch: {
          type: socket.data.user.userType,
          refId: socket.data.user._id
        }
      }
    })
    .populate('participants.refId');
    console.log(chats, 'chats for this user')
    socket.emit('chat_list', chats);
  });
});

  console.log('Socket.IO initialized');
};
