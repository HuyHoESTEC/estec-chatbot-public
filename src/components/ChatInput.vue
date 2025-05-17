<template>
    <div class="chat-input">
        <input class="input-message" type="text" v-on:keyup.enter="sendMessage" v-model="newMessage" placeholder="Hỏi bất cứ điều gì...">
        <button v-on:click="sendMessage" :disabled="!newMessage.trim()">Gửi</button>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'ChatInput',
    emits: ['send-message'],
    setup(_, { emit }) {
        const newMessage = ref('');

        const sendMessage = () => {
            if (newMessage.value.trim()) {
                emit('send-message', newMessage.value);
                newMessage.value = '';
            }
        }

        return {
            newMessage,
            sendMessage
        }
    }
}
</script>

<style scoped>
.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
  border-radius: 25px;
}

.chat-input input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

.chat-input button {
  padding: 8px 15px;
  background-color: #2d2c72;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.chat-input button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.input-message {
  background-color: white;
  color: black;
  border: none;
  outline: none;
  padding: 10px 14px;
  font-size: 16px;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  height: 70px;
}

.input-message:hover,
.input-message:focus {
  border: none;
  outline: none;
}
</style>