<template>
    <div class="main-container">
        <div v-if="isMobile && (showIntroChatBot || showUserInfo)" class="sidebar-overlay" v-on:click="closeSidebars"></div>
        <div class="mobile-header" v-if="isMobile">
            <div class="mobile-menu-icon mobile-menu-icon-left" v-on:click="toggleIntroChatBot" v-if="isMobile">☰</div>
            <div class="mobile-menu-icon mobile-menu-icon-right" v-on:click="toggleUserInfo" v-if="isMobile">💡</div>
        </div>
        <div :class="['intro-chatbot', { 'show-sidebar': showIntroChatBot }]">
            <GenAiOption />
        </div>
        <div class="chat-main-content">
            <div class="header-container">
                <div class="model-selection">
                    <label for="model-select" class="model-label">Chọn Model:</label>
                    <select id="model-select" v-model="selectedModel" class="model-dropdown">
                        <option value="Flash">1.0 Flash</option>
                        <option value="Pro">1.0 Pro</option>
                    </select>
                </div>
                <p class="status-text">
                    <span 
                        :class="['status-indicator', { 'is-connected': isConnected, 'is-disconnected': !isConnected }]"
                    ></span>
                    <span 
                        :style="{ color: isConnected ? 'green' : 'red' }"
                    >
                        {{ isConnected ? 'Connected' : 'Disconnected' }}
                    </span>
                </p>
            </div>
            <div class="chat-container">
                <div class="chat-messages" ref="messagesContainer">
                    <ChatBubble 
                        v-for="(message, index) in messages"
                        :key="index"
                        :message="message.text"
                        :isUser="message.sender === 'user'"
                        :timeStamp="message.createdAt"
                        :isTyping="message.sender === 'bot' && message.isTyping"
                        :imageUrl="message.imageUrl"
                    />
                </div>
                <ChatInput 
                    @send-message="handleSendMessage" 
                    :is-generate-response="isGeneratingResponse" 
                />
            </div>
        </div>
        <div :class="['user-info-container', { 'show-sidebar': showUserInfo }]">
            <UserInfo />
        </div>
    </div>
</template>

<script>

import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useWebSocket } from '../services/useWebSocket';
import ChatBubble from '../components/ChatBubble.vue';
import ChatInput from '../components/ChatInput.vue';
import GenAiOption from './GenAiOption.vue';
import UserInfo from './UserInfo.vue';
// import mockProductResponse from '../utils/Responses.json';

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
        const sessionID = ref('12321425');
        // const mockImageUrl = 'https://genai-s3-storage.s3.us-east-2.amazonaws.com/plots/19_Bubbleplot_2_Matplotlib-min.png';
        // API url test for PROD environment
        // const apiUrl = 'https://nv2muuac94.execute-api.us-east-2.amazonaws.com/dev/chat'

        // API url test for local environment
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const apiUrl = `${apiBaseUrl}/dev/chat`;
        // const apiImgUrl = import.meta.env.VITE_API_IMG_URL || '';
        
        // Khởi tạo WebSocket service
        const actionAPI = 'sendMessage';
        // const WS_URL = "wss://498kkvw74b.execute-api.us-east-2.amazonaws.com/dev";
        const MODEL_WEBSOCKET_URLS = {
            Flash: 'wss://43vcec7hc4.execute-api.us-east-2.amazonaws.com/lite/',
            Pro: 'wss://498kkvw74b.execute-api.us-east-2.amazonaws.com/dev'
        }
        const selectedModel = ref('Pro'); // Model mặc định khi tải trang
        // Computed property để lấy URL WebSocket dựa trên model đã chọn
        const webSocketUrl = computed(() => {
            return MODEL_WEBSOCKET_URLS[selectedModel.value] || MODEL_WEBSOCKET_URLS['Flash']; // Fallback về Flash nếu không tìm thấy
        });

        const { isConnected, messages: wsMessages, error: webSocketError, sendRequest } = useWebSocket(webSocketUrl);
        console.log('isConnected value:', isConnected);
        console.log('sendRequest value:', sendRequest);

        const isMobile = ref(false);
        const showIntroChatBot = ref(false);
        const showUserInfo = ref(false);

        const userMessage = ref(''); // Input của người dùng

        const typingSpeed = ref(20);
        let typingInterval = null; // Khai báo là let để có thể gán lại
        const isGeneratingResponse = ref(false);
        const generatingTime = ref(null);
        // const inputText = ref('');
        const messagesContainer = ref(null); // Dùng để cuộn xuống dưới

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

        const startTypingEffect = (messageIndex, fullResponseText) => {
            return new Promise(resolve => {
                const messageObject = messages.value[messageIndex];

                if (typingInterval) {
                    clearInterval(typingInterval);
                }

                let charIndex = 0;
                // Đảm bảo tin nhắn bắt đầu rỗng và cờ isTyping là true
                // Cập nhật trực tiếp trên messageObject đã lấy từ mảng reactive
                messageObject.text = ''; // Xóa text hiện tại để bắt đầu gõ
                messageObject.isTyping = true;

                if (!fullResponseText || fullResponseText.length === 0) {
                    messageObject.text = fullResponseText || 'Không có nội dung phản hồi.';
                    messageObject.isTyping = false;
                    isGeneratingResponse.value = false;
                    resolve(); // Giải quyết promise ngay lập tức
                    return;
                }

                typingInterval = setInterval(() => {
                    if (charIndex < fullResponseText.length) {
                        // Cập nhật trực tiếp trên messageObject đã lấy từ mảng reactive
                        messageObject.text += fullResponseText[charIndex];
                        charIndex++;
                        nextTick(() => {
                            scrollToBottom(); // Cuộn xuống khi mỗi ký tự được gõ
                        })
                    } else {
                        clearInterval(typingInterval);
                        // Cập nhật trực tiếp trên messageObject đã lấy từ mảng reactive
                        messageObject.text = fullResponseText;
                        messageObject.isTyping = false;
                        isGeneratingResponse.value = false;
                        scrollToBottom();
                        resolve(); // Giải quyết promise khi hiệu ứng gõ phím kết thúc
                    }
                }, typingSpeed.value);
            });
        };

        const sendMessageToApi = async (inputText) => {
            // Đảm bảo không gửi tin nhắn rỗng và không gửi khi đang có phản hồi
            if (!inputText.trim() || isGeneratingResponse.value) return;

            // 1. Thêm tin nhắn của người dùng
            messages.value.push({ text: inputText, sender: 'user', createdAt: new Date() });
            scrollToBottom();

            // 2. Thêm tin nhắn bot placeholder với hiệu ứng typing BẬT
            const newBotMessage = { text: '', sender: 'bot', createdAt: new Date(), isTyping: true, imageUrl: null };
            messages.value.push(newBotMessage);
            const newBotMessageIndex = messages.value.length - 1;
            scrollToBottom(); // Cuộn xuống để thấy typing indicator

            isGeneratingResponse.value = true;
            generatingTime.value = new Date(); // Lưu thời điểm bắt đầu "đợi"

            // let accumulatedText = ''; // Để tích lũy văn bản stream

            try {
                const bodyData = {
                    action: actionAPI,
                    inputText: inputText,
                    sessionId: sessionID.value
                };
                console.log('Preparing WebSocket request with payload data:', bodyData);
                const apiResponse = await sendRequest(bodyData);

                console.log('Phản hồi cuối cùng từ WebSocket:', apiResponse);
                const responseData = apiResponse;

                // 3. Xử lý dữ liệu phản hồi cuối cùng
                // Đảm bảo responseData.response là một chuỗi không rỗng
                if (responseData && typeof responseData.response === 'string' && responseData.response.trim() !== '') {
                    // const formattedText = formatResponseToVietnamese(responseData.response);
                    // console.log('formattedText (final to display):', formattedText);
                    await startTypingEffect(newBotMessageIndex, responseData.response);
                    
                    // Cập nhật nội dung cuối cùng và TẮT hiệu ứng typing
                    // messages.value[newBotMessageIndex].text = responseData.response;
                    // messages.value[newBotMessageIndex].isTyping = false;
                    isGeneratingResponse.value = false;

                    // 4. Xử lý hình ảnh và hành động
                    const resAction = responseData.action;
                    const imgUrlRes = responseData.imageUrl;

                    if (imgUrlRes) {
                        const fullImageUrl = `${imgUrlRes}`;
                        messages.value[newBotMessageIndex].imageUrl = fullImageUrl;
                        console.log('Đã gán imageUrl:', fullImageUrl);
                    } else {
                        messages.value[newBotMessageIndex].imageUrl = null; // Mặc định không có ảnh
                        console.log('Action không phải "plotdashboard" hoặc imageUrl rỗng. Action:', resAction, 'Image URL:', imgUrlRes);
                    }

                } else {
                    console.warn('Phản hồi WebSocket không có cấu trúc hợp lệ (response):', responseData);
                    messages.value[newBotMessageIndex].text = 'Không nhận được phản hồi hợp lệ từ máy chủ.';
                    messages.value[newBotMessageIndex].isTyping = false; // TẮT HIỆU ỨNG KHI LỖI HOẶC PHẢN HỒI RỖNG
                    isGeneratingResponse.value = false;
                    scrollToBottom();
                }
            } catch (error) {
                console.error('Lỗi khi gửi/nhận qua WebSocket:', error);
                // Giả định isConnected là một ref từ useWebSocket hook của bạn
                if (!isConnected.value) { 
                    messages.value[newBotMessageIndex].text = 'Kết nối đến máy chủ bị ngắt. Vui lòng thử lại hoặc tải lại trang.';
                } else {
                    messages.value[newBotMessageIndex].text = `Có lỗi xảy ra khi giao tiếp qua WebSocket: ${error.message || 'Không xác định'}`;
                }
                messages.value[newBotMessageIndex].isTyping = false; // TẮT HIỆU ỨNG KHI CÓ EXCEPTION
                isGeneratingResponse.value = false;
                scrollToBottom();
            } finally {
                // Đảm bảo isTyping được tắt nếu vì lý do nào đó nó vẫn đang bật
                if (messages.value[newBotMessageIndex].isTyping) {
                    messages.value[newBotMessageIndex].isTyping = false;
                }
                // Đảm bảo cờ isGeneratingResponse.value luôn được tắt cuối cùng
                isGeneratingResponse.value = false;
                scrollToBottom();
                console.log('Kết thúc quá trình gửi tin nhắn. isTyping:', messages.value[newBotMessageIndex].isTyping);
            }
        };

        // Hàm cuộn xuống cuối cùng
        const scrollToBottom = () => {
            nextTick(() => {
                if (messagesContainer.value){
                    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
                }
            });
        };

        const handleSendMessage = (newMessage) => {
            sendMessageToApi(newMessage);
            userMessage.value = '';
        };

        const toggleIntroChatBot = () => {
            showIntroChatBot.value = !showIntroChatBot.value;
            if (showIntroChatBot.value) {
                showUserInfo.value = false;
            }
        }

        const toggleUserInfo = () => {
            showUserInfo.value = !showUserInfo.value;
            if (showUserInfo.value) {
                showIntroChatBot.value = false;
            }
        }
        
        const closeSidebars = () => {
            showUserInfo.value = false;
            showIntroChatBot.value = false;
        }

        const checkMobile = () => {
            isMobile.value = window.innerWidth <= 767;
        }

        onMounted(() => {
            checkMobile();
            window.addEventListener('resize', checkMobile);
        })

        onBeforeUnmount(() => {
            window.removeEventListener('resize', checkMobile);
        })

        onUnmounted(() => {
            clearInterval(typingInterval);
        })

        // Theo dõi message để tự động cuộc xuống khi có tin nhắn mới
        watch(messages, () => {
            scrollToBottom();
        }, { deep: true });

        watch(webSocketError, (newError) => {
            if (newError) {
                console.error("WebSocket Connection Error:", newError.message);
                // Có thể thêm một tin nhắn hệ thống vào chat để báo lỗi cho người dùng
                // messages.value.push({ text: `[Lỗi Kết Nối] ${newError.message}`, sender: 'system', createdAt: new Date() });
            }
        });

        return {
            formatResponseToVietnamese,
            startTypingEffect,
            sendMessageToApi,
            handleSendMessage,
            toggleIntroChatBot,
            toggleUserInfo,
            closeSidebars,
            checkMobile,
            isMobile,
            showIntroChatBot,
            showUserInfo,
            messages,
            sessionID,
            apiUrl,
            typingSpeed,
            isGeneratingResponse,
            generatingTime,
            isConnected,
            actionAPI,
            MODEL_WEBSOCKET_URLS,
            webSocketUrl,
            messagesContainer,
            scrollToBottom,
            selectedModel,
            // inputText
        }
    }
}
</script>

<style scoped>
.main-container {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;
    /* justify-content: space-between; */
    overflow-y: hidden;
    overflow-x: hidden;
    position: relative;
}

.chat-main-content {
    flex-grow: 1; /* Chiếm hết không gian còn lại trên desktop */
    display: flex;
    flex-direction: column;
    position: relative; /* Để chat-container có thể chiếm hết không gian */
}

.chat-container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  /* height: 100vh; */
  /* width: 60%; */
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
  overflow: hidden; /* Ẩn thanh cuộn mặc định */
  position: relative;
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

.intro-chatbot,
.user-info-container {
    flex: 0 0 250px;
    width: 20%;
    height: 100vh;
    overflow-y: auto;
    transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out;
}

/* Tùy chỉnh giao diện thanh cuộn (nếu muốn) */
.chat-messages::-webkit-scrollbar {
  width: 8px; /* Độ rộng thanh cuộn */
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: #ccc; /* Màu "ngón tay" thanh cuộn */
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* Màu "đường ray" thanh cuộn */
}

/* Mobile Header (hidden by default, shown on mobile) */
.mobile-header {
    display: none; /* Hidden by default */
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    color: white;
    height: 60px; /* Chiều cao cố định cho header mobile */
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    position: fixed; /* Giữ cố định trên cùng */
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100; /* Đảm bảo nằm trên chat-container */
}

.header-title {
    font-size: 1.2em;
    font-weight: bold;
}

.mobile-menu-icon {
    font-size: 24px;
    cursor: pointer;
    line-height: 1; /* Để icon căn giữa theo chiều dọc */
}

/* Overlay khi sidebar mở trên mobile */
.sidebar-overlay {
    display: none; /* Hidden by default */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999; /* Below sidebars, above main content */
    transition: opacity 0.3s ease-in-out;
}

/* --- Responsive for Tablets (e.g., max-width 1024px) --- */
@media (max-width: 1024px) {
    .intro-chatbot,
    .user-info-container {
        flex: 0 0 200px; /* Slightly smaller sidebars */
        padding: 15px;
    }
}

/* --- Responsive for Mobile (e.g., max-width 767px) --- */
@media (max-width: 767px) {
    .main-container {
        flex-direction: column; /* Stack vertically on mobile */
        height: 100vh;
        width: 100vw;
    }

    /* Show mobile header */
    .mobile-header {
        display: flex; /* Display as flex on mobile */
        background-color: #85c1e9;
    }

    /* Sidebar trái */
    .intro-chatbot {
        position: fixed;
        top: 0;
        left: 0;
        width: 70%; /* Chiếm 70% màn hình mobile */
        height: 100%;
        transform: translateX(-100%); /* Ẩn sidebar trái */
        z-index: 1000; /* Hiển thị trên content */
        box-shadow: 2px 0 5px rgba(0,0,0,0.2);
        padding: 20px;
        background-color: #f0f2f5;
        overflow-y: auto;
    }

    /* Sidebar phải */
    .user-info-container {
        position: fixed;
        top: 0;
        right: 0;
        width: 70%; /* Chiếm 70% màn hình mobile */
        height: 100%;
        transform: translateX(100%); /* Ẩn sidebar phải */
        z-index: 1000;
        box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        padding: 20px;
        background-color: #f0f2f5;
        overflow-y: auto;
    }

    /* Show sidebar when 'show-sidebar' class is active */
    .intro-chatbot.show-sidebar {
        transform: translateX(0); /* Hiển thị sidebar trái */
    }

    .user-info-container.show-sidebar {
        transform: translateX(0); /* Hiển thị sidebar phải */
    }

    /* Show overlay when any sidebar is open */
    .sidebar-overlay {
        display: block; /* Hiển thị overlay */
    }

    /* Chat main content on mobile */
    .chat-main-content {
        flex-grow: 1; /* Chiếm hết phần còn lại của màn hình */
        width: 100%;
        height: calc(100vh - 60px); /* Lùi xuống bằng chiều cao của header */
        margin-top: 60px; /* Thụt xuống bằng chiều cao của header */
        border-left: none;
        border-right: none;
    }

    .chat-container {
        width: 100%;
        height: 100%; /* Chiếm đầy đủ chat-main-content */
    }

    .chat-messages {
        padding: 10px;
    }
}

.header-container {
  display: flex; /* Kích hoạt Flexbox */
  justify-content: space-between; /* Đẩy các phần tử ra hai đầu */
  align-items: center; /* Căn giữa theo chiều dọc */
  padding: 5px 5px; /* Thêm padding nếu cần */
}

.status-text {
  color: black; /* Màu chữ "Status:" */
  display: flex; /* Để căn chỉnh chấm và chữ trên cùng một hàng */
  align-items: center; /* Căn giữa theo chiều dọc */
  gap: 8px; /* Khoảng cách giữa "Status:", chấm, và chữ trạng thái */
}

.status-indicator {
  display: inline-block;
  width: 12px; /* Kích thước chấm tròn */
  height: 12px; /* Kích thước chấm tròn */
  border-radius: 50%; /* Tạo hình tròn */
  /* Các màu mặc định hoặc fallback */
  background-color: gray; 
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển màu mượt mà */
}

.status-indicator.is-connected {
  background-color: green;
}

.status-indicator.is-disconnected {
  background-color: red;
}

.model-selection {
  display: flex;
  align-items: center;
  gap: 10px;
  color: black;
}

.model-label {
  font-weight: bold;
}

.model-dropdown {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  font-size: 0.95rem; /* Điều chỉnh kích thước font */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.model-dropdown:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}
</style>