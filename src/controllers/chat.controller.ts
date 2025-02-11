import Chat from "../models/Chat";
import Message from "../models/Message";

export const getChats = async(req : any, res : any) => {
    try {
        const chats = await Chat.find({
          $or: [
            { 'participants.user': req.user.userId },
            { 'participants.client': req.user.userId }
          ]
        }).populate('participants.user participants.client lastMessage');
        res.json(chats);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
}

export const getMessages = async(req : any, res : any) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId });
        res.json(messages);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
}