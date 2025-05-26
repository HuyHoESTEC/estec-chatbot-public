<template>
    <div :class="['chat-bubble', { 'user-message': isUser, 'bot-message': !isUser }]">
    <div class="message-content">
      <span :class="{ 'typing-animation-text': isTyping }">
        <span v-if="isTyping" class="typing-placeholder">Đang xử lý</span>
        <span v-if="isTyping" class="dot">.</span>
        <span v-if="isTyping" class="dot">.</span>
        <span v-if="isTyping" class="dot">.</span>
        <span :class="{ 'fade-in-on-type': isTyping && message.length > 0 }">
           {{ message }}
        </span>
      </span>
      <div v-if="imageUrl && !isTyping" class="message-image-wrapper">
        <img :src="imageUrl" alt="Bot response image" class="message-image" />
      </div>
    </div>
    <div class="message-timestamp">
      {{ formatTime(timeStamp) }}
    </div>
  </div>
</template>

<script>
import { watch } from 'vue';


export default {
    name: 'ChatBubble',
    props: {
        message: {
            type: String,
            required: true
        },
        isUser: {
            type: Boolean,
            default: false
        },
        isTyping: {
          type: Boolean,
          default: false
        },
        timeStamp: {
          type: Date,
          default: () => new Date(),
        },
        imageUrl: {
          type: String,
          default: null
        }
    },
    setup(props) {
      watch(() => props.isTyping, (newVal) => {
        console.log(`ChatBubble [${props.message}]: isTyping changed to`, newVal);
      })

      watch(() => props.message, (newVal) => {
        console.log(`ChatBubble [${props.isUser ? 'User' : 'Bot'}]: message changed to`, newVal);
      });
      
      const formatTime = (date) => {
        if (!date) return '';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      return {
        formatTime
      }
    }
}
</script>

<style>
.chat-bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  margin-bottom: 10px;
  word-wrap: break-word;
  font-size: 0.9em;
  position: relative;
}

.message-content {
  color: black;
  white-space: pre-wrap;
}

.user-message {
  background-color: #dcf8c6; /* Màu xanh lá nhạt cho tin nhắn người dùng */
  align-self: flex-end; /* Căn phải */
  margin-left: auto;
  text-align: left;
}

.bot-message {
  background-color: #e0e0e0; /* Màu xám nhạt cho tin nhắn bot */
  align-self: flex-start; /* Căn trái */
  margin-right: auto;
  text-align: left;
}

.message-timestamp {
  font-size: 0.7em;
  color: #666;
  text-align: right; /* Căn giờ cho tin nhắn người dùng */
  margin-top: 5px;
}

.bot-message .message-timestamp {
  text-align: left; /* Căn giờ cho tin nhắn bot */
}

.typing-animation-text {
  /* Điều chỉnh font-style hoặc color nếu bạn muốn nó trông giống như đang gõ */
  font-style: italic;
  color: #555;
  min-height: 1.2em; /* Để tránh nhảy layout khi message rỗng */
  display: block; /* Đảm bảo placeholder và text ở dòng riêng nếu cần */
}

.typing-placeholder {
  color: #999; /* Màu mờ cho chữ "Đang xử lý" */
  margin-right: 5px; /* Khoảng cách giữa chữ và dấu chấm */
}

.dot {
  opacity: 0;
  animation: ellipsis 1s infinite;
  display: inline-block; /* Quan trọng để dấu chấm không bị tràn */
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes ellipsis {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

/* Tùy chọn: Hiệu ứng fade-in cho text đang gõ */
.fade-in-on-type {
  opacity: 1;
  transition: opacity 0.1s linear; /* Có thể làm cho ký tự xuất hiện mượt hơn */
}

.message-image-wrapper {
    margin-top: 10px; /* Khoảng cách giữa text và ảnh */
    text-align: center; /* Căn giữa ảnh nếu cần */
}

.message-image {
    max-width: 100%; /* Đảm bảo ảnh không tràn bubble */
    height: auto;
    border-radius: 8px; /* Bo góc ảnh */
    display: block; /* Loại bỏ khoảng trống dưới ảnh */
    margin: 0 auto; /* Căn giữa ảnh */
}
</style>