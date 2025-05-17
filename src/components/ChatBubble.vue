<template>
    <div class="chat-bubble-container" :class="{ 'user': isUser }">
      <div class="chat-bubble">
        <p>{{ message }}</p>
      </div>
      <span class="timestamp">{{ formattedTime }}</span>
    </div>
</template>

<script>
import { computed } from 'vue';


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
        isTyping: Boolean,
        timeStamp: {
          type: [String, Number, Date],
          default: () => new Date(),
        }
    },
    setup(props) {
      const formattedTime = computed(() => {
        const date = new Date(props.timeStamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      });

      return {
        formattedTime
      }
    }
}
</script>

<style scoped>
.chat-bubble-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  align-items: flex-start; /* Mặc định căn trái */
  width: 100%;
}

.chat-bubble-container.user {
  align-items: flex-end; /* Căn phải cho tin nhắn người dùng */
}

.chat-bubble {
  background-color: #d0d3d4;
  color: #333;
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 8px;
  max-width: 80%;
  word-break: break-word;
  text-align: left;
}

.chat-bubble-container.user .chat-bubble {
  background-color: #dcf8c6;
}

.timestamp {
  font-size: 0.75em;
  color: #888;
  margin-top: 3px;
}

.chat-bubble-container.user .timestamp {
  align-self: flex-end;
}
</style>