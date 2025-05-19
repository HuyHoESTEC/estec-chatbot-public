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
          <textarea class="input-message" id="chatgpt-input" v-on:keyup.enter="handleEnter" v-model="chatGPTInput" placeholder="" />
          <button v-on:click="sendMessage('ChatGPT', chatGPTInput)" :disabled="!chatGPTInput.trim()">Gửi</button>
        </div>

        <div class="group" v-if="selectedOption === 'Factory'">
          <textarea class="input-message" id="factory-input" v-on:keyup.enter="handleEnter" v-model="factoryInput" placeholder="" />
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

        const sendMessage = (option) => {
          let textToSend = '';
          let inputToClear = null;

          if (option === 'ChatGPT' && chatGPTInput.value.trim()) {
            textToSend = chatGPTInput.value;
            inputToClear = chatGPTInput;
          } else if (option === 'Factory' && factoryInput.value.trim()) {
            textToSend = factoryInput.value;
            inputToClear = factoryInput;
          }

          if (textToSend) {
            emit('send-message', textToSend);
            if (inputToClear) {
              inputToClear.value = '';
            }
          }
        };

        const handleEnter = (event) => {
          if (event.shiftKey) {
            // Nếu Shift + Enter được nhấn, thêm một dòng mới vào textarea
            newMessage.value += '\n';
          } else {
            if (document.activeElement.id === 'chatgpt-input' && chatGPTInput.value.trim()) {
              sendMessage('ChatGPT');
            } else if (document.activeElement.id === 'factory-input' && factoryInput.value.trim()) {
              sendMessage('Factory');
            }
          }
        }

        return {
            chatGPTInput,
            factoryInput,
            selectedOption,
            sendMessage,
            handleEnter
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
  resize: none; /* Cho phép người dùng kéo để thay đổi chiều cao */
  min-height: 40px; /* Chiều cao tối thiểu */
  line-height: 1.5; /* Khoảng cách dòng */
  overflow-y: auto; /* Hiển thị scrollbar khi nội dung vượt quá chiều cao */
  white-space: pre-wrap; /* Giữ nguyên khoảng trắng và xuống dòng */
}

.input-message:hover,
.input-message:focus {
  border: none;
  outline: none;
}
</style>