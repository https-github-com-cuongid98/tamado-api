import mongoose from "mongoose";
import { CommonStatus, ConversationMemberType, MessagesType } from "$enums";
const Schema = mongoose.Schema;

export default mongoose.model(
  "Messages",
  new Schema({
    conversationId: { type: Number, required: true },
    memberId: { type: Number, required: true },
    body: { type: String, required: false },
    image: { type: String, required: false, default: null },
    status: { type: Number, required: true, default: CommonStatus.ACTIVE },
    messageType: { type: Number, default: MessagesType.TEXT },
    memberType: { type: Number, default: ConversationMemberType.MEMBER },
    createdAt: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed },
  })
);
