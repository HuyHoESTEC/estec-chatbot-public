<template>
    <div class="main-container">
        <div class="intro-chatbot">
            <GenAiOption />
        </div>
        <div class="chat-container">
            <div class="chat-messages">
                <ChatBubble 
                    v-for="(message, index) in messages"
                    :key="index"
                    :message="message.text"
                    :isUser="message.sender === 'user'"
                    :timeStamp="message.createdAt"
                />
                <ChatBubble
                    v-if="isGeneratingResponse"
                    message="Đang xử lý..."
                    :isUser="false"
                    isTyping="true"
                    :timeStamp="generatingTime"
                />
                <ChatBubble 
                    v-if="displayedBotMessage"
                    :message="displayedBotMessage"
                    :isUser="false"
                    isTyping="true"
                    :timeStamp="botMessageCreatedAt"
                />
            </div>
            <ChatInput @send-message="handleSendMessage" />
        </div>
        <div class="user-info-container">
            <UserInfo />
        </div>
    </div>
    
</template>

<script>
import { onUnmounted, ref } from 'vue';
import ChatBubble from '../components/ChatBubble.vue';
import ChatInput from '../components/ChatInput.vue';
import GenAiOption from './GenAiOption.vue';
import UserInfo from './UserInfo.vue';

export default {
    name: 'ChatView',
    components: {
        ChatBubble,
        ChatInput,
        GenAiOption,
        UserInfo
    },
    setup() {
        const messages = ref([
            {
                text: 'Xin chào, tôi là trợ lý ESTEC chatbot ',
                sender: 'bot',
                createdAt: new Date()
            },
            {
                text: 'Tôi có thể giúp gì cho bạn ?',
                sender: 'bot',
                createdAt: new Date(Date.now() - 60000)
            }
        ]);
        const sessionID = ref('12321425')
        // API url test for PROD environment
        // const apiUrl = 'https://nv2muuac94.execute-api.us-east-2.amazonaws.com/dev/chat'

        // API url test for local environment
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const apiUrl = `${apiBaseUrl}/dev/chat`;
        
        const formattedApiResponse = ref('');

        const displayedBotMessage = ref('');
        const typingSpeed = ref(50);
        let typingInterval = null;
        const isGeneratingResponse = ref(false);
        const generatingTime = ref(null);

        const botMessageCreatedAt = ref(null);

        const formatResponseToVietnamese  = (response) => {
            try {
                const decodedResponse = decodeURIComponent(escape(response));
                const prefixToRemove = "Phản hồi:";
                if (decodedResponse.startsWith(prefixToRemove)) {
                    return decodedResponse.substring(prefixToRemove.length).trim();
                } else {
                    return decodedResponse
                }
            } catch (error) {
                console.error("Lỗi khi định dạng response:", error);
                return "Có lỗi xảy ra khi xử lý dữ liệu.";
            }
        }

        const startTypingEffect = () => {
            botMessageCreatedAt.value = new Date();
            let charIndex = 0;
            displayedBotMessage.value = '';
            typingInterval = setInterval(() => {
                if (charIndex < formattedApiResponse.value.length) {
                    displayedBotMessage.value += formattedApiResponse.value[charIndex];
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    messages.value.push({ text: formattedApiResponse, sender: 'bot', createdAt: new Date() });
                    displayedBotMessage.value = '';
                    isGeneratingResponse.value = false; // Ẩn đoạn chat giả khi có response thật
                }
            }, typingSpeed.value);
        };

        const sendMessageToApi = async (inputText) => {
            isGeneratingResponse.value = true; // Hiển thị đoạn chat giả khi gửi request
            generatingTime.value = new Date(); // Lưu thời điểm bắt đầu "đợi"
            try {
                const bodyData = {
                    inputText: inputText,
                    sessionId: sessionID.value
                };
                const apiResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyData)
                });
                console.log('apiResponse:', apiResponse);

                if (!apiResponse.ok) {
                    const error = await apiResponse.json();
                    console.error('Lỗi gọi API:', error);
                    messages.value.push({ text: 'Đã có lỗi xảy ra khi giao tiếp với máy chủ.', sender: 'bot', createdAt: new Date() });
                    isGeneratingResponse.value = false; // Ẩn đoạn chat giả khi có lỗi
                    return;
                }

                const responseData = await apiResponse.json();
                console.log('Phản hồi từ API:', responseData);
                
                // Gọi hàm format ngay sau khi nhận được responseData
                // formattedApiResponse.value = formatResponseToVietnamese(responseData.response)
                // console.log('formattedApiResponse:', formattedApiResponse.value);

                // Xử lý dữ liệu phản hồi và thêm tin nhắn từ bot vào messages
                if (responseData && responseData.response) {
                    formattedApiResponse.value = formatResponseToVietnamese(responseData.response);
                    displayedBotMessage.value = '';
                    isGeneratingResponse.value = false; // Ẩn đoạn chat giả khi không có response hợp lệ
                    startTypingEffect();
                    // messages.value.push({ text: formattedApiResponse, sender: 'bot' });
                } else {
                    messages.value.push({ text: 'Không nhận được phản hồi hợp lệ từ máy chủ', sender: 'bot', createdAt: new Date() })
                    isGeneratingResponse.value = false; // Ẩn đoạn chat giả khi không có response hợp lệ
                }
            } catch (error) {
                console.error('Lỗi gọi API:', error);
                messages.value.push({ text: 'Không thể kết nối đến máy chủ.', sender: 'bot', createdAt: new Date() });
                isGeneratingResponse.value = false; // Ẩn đoạn chat giả khi không có response hợp lệ
            }
        }

        const handleSendMessage = (newMessage) => {
            messages.value.push({ text: newMessage, sender: 'user', createdAt: new Date() });
            // setTimeout(() => {
            //     messages.value.push({ text: `Bạn vừa nói: "${newMessage}"` })
            // }, 1000);
            sendMessageToApi(newMessage);
        }

        onUnmounted(() => {
            clearInterval(typingInterval);
        })

        return {
            messages,
            handleSendMessage,
            sendMessageToApi,
            formatResponseToVietnamese,
            formattedApiResponse,
            displayedBotMessage,
            startTypingEffect,
            isGeneratingResponse
        }
    }
}
</script>

<style>
.main-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    /* justify-content: space-between; */
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 60%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
}

.chat-messages {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column; /* Sắp xếp tin nhắn theo chiều dọc */
  align-items: flex-start; /* Căn chỉnh các tin nhắn từ bên trái */
}

.chat-messages > .chat-bubble.user {
  align-self: flex-end;
}

.intro-chatbot {
    width: 20%;
    height: 100vh;
}

.user-info-container {
    width: 20%;
    height: 100vh;
}
</style>