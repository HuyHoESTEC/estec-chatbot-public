<template>
    <div class="chat-input-container">
      <div class="option-toggle">
        <button
          v-on:click="selectedOption = 'ChatGPT'"
          :class="{ active: selectedOption === 'ChatGPT' }"
        >
          ChatGPT
        </button>
        <button
          v-on:click="selectedOption = 'Factory'"
          :class="{ active: selectedOption === 'Factory' }"
        >
          Nhà Máy
        </button>
      </div>
      <div class="option-group-box">
        <div class="group" v-if="selectedOption === 'ChatGPT'">
          <input class="input-message" id="chatgpt-input" type="text" v-on:keyup.enter="sendMessage('ChatGPT', chatGPTInput)" v-model="chatGPTInput" placeholder="">
          <button v-on:click="sendMessage('ChatGPT', chatGPTInput)" :disabled="!chatGPTInput.trim()">Gửi</button>
        </div>

        <div class="group" v-if="selectedOption === 'Factory'">
          <input class="input-message" id="factory-input" type="text" v-on:keyup.enter="sendMessage('Factory', factoryInput)" v-model="factoryInput" placeholder="">
          <button v-on:click="sendMessage('Factory', factoryInput)" :disabled="!factoryInput.trim()">Gửi</button>
        </div>
      </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'ChatInput',
    emits: ['send-message'],
    setup(_, { emit }) {
        const chatGPTInput = ref('');
        const factoryInput = ref('');
        const selectedOption = ref('ChatGPT');

        const sendMessage = (option, text) => {
            if (text.trim()) {
              if (option === 'ChatGPT') {
                emit('send-message', chatGPTInput.value);
                chatGPTInput.value = '';
              } else if (option === 'Factory') {
                emit('send-message', factoryInput.value);
                factoryInput.value = '';
              }
            }
        }

        return {
            chatGPTInput,
            factoryInput,
            selectedOption,
            sendMessage
        }
    }
}
</script>

<style scoped>
.chat-input-container {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #ccc;
  border-radius: 25px;
}

.option-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  padding-left: 20px;
  padding-top: 10px;
}

.option-toggle button {
  padding: 8px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  background-color: white;
}

.option-toggle button.active {
  background-color: #2d2c72;
  color: white;
  border-color: #2d2c72;
  border: none;
  outline: none;
}

.option-group-box {
  display: flex;
  flex-direction: column; /* Xếp các group theo chiều dọc */
  gap: 15px; /* Khoảng cách giữa các group */
  margin-bottom: 15px;
}

.group {
  display: flex;
  gap: 10px; /* Khoảng cách giữa label, input và button trong mỗi group */
  align-items: center; /* Căn chỉnh các phần tử theo chiều dọc */
  padding: 0px 20px;
}

.group label {
  width: 80px; /* Độ rộng cố định cho label */
  text-align: left;
}

.group input[type="text"] {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

.group button {
  padding: 10px 15px;
  border: 1px solid #2d2c72;
  border-radius: 5px;
  background-color: #2d2c72;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.group button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  color: #666;
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