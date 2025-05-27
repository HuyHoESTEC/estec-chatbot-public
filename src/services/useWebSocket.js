import { ref, onMounted, onUnmounted } from "vue";

const socket = ref(null);
const isConnected = ref(false);
const messages = ref([]);
const error = ref(null);

// Map để lưu trữ các Promise đang chờ phản hồi
const pendingRequests = new Map();
let requestIdCounter = 0; // Bộ đếm cho requestId

export function useWebSocket(url) {
    const connect = () => {
        if (socket.value && socket.value.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected.');
            return;
        }
        socket.value = new WebSocket(url);

        socket.value.onopen = () => {
            isConnected.value = true;
            console.log('WebSocket connected!');
            error.value = null; // Clear any previous errors
        };

        socket.value.onmessage = (event) => {
            console.log('Message received:', event.data);
            console.log('Type of event.data:', typeof event.data);
            try {
                const message = JSON.parse(event.data);
                messages.value.push(message); // Lưu tất cả tin nhắn nhận được
                console.log('(message.requestId:', messages);
                
                // Xử lý phản hồi cho các request đang chờ
                if (message.requestId && pendingRequests.has(message.requestId)) {
                    const { resolve, reject, onStream } = pendingRequests.get(message.requestId);
                    const responseError = message.error;
                    const responseText = message.response;
                    const responseAction = message.action;
                    const responseStatus = message.statusCode;
                    const responseImage = message.url;
                    
                    if (responseAction === 'chatMessageStream' && onStream) {
                        onStream(responseText);
                    } else if (responseAction === 'sendMessage') {
                        pendingRequests.delete(message.requestId); // Xóa request khỏi danh sách

                        if (responseStatus === 200) {
                            const finalRes = {
                                response: responseText,
                                action: responseAction,
                                imageUrl: responseImage,
                            }
                            resolve(finalRes);
                        } else {
                            reject(responseError || new Error('Unknown WebSocket error'));
                        }
                    }
                }
            } catch (e) {
                console.error('Failed to parse message:', e);
            }
        };

        socket.value.onclose = (event) => {
            isConnected.value = false;
            console.log('WebSocket disconnected', event);
            // Xóa tất cả các request đang chờ khi kết nối đóng
            pendingRequests.forEach(({ reject }) => reject(new Error('WebSocket disconnected')));
            pendingRequests.clear();
            if (!event.wasClean) {
                error.value = new Error('WebSocket connection closed unexpectedly.');
            }
        };

        socket.value.onerror = (err) => {
            error.value = err;
            console.error('WebSocket error:', err);
        };
    };

    const disconnect = () => {
        if (socket.value) {
            socket.value.close();
        }
    };

    /**
     * Gửi yêu cầu qua WebSocket và trả về một Promise để chờ phản hồi
    //  * @param {string} type - Loại hành động yêu cầu
     * @param {Object} data - Dữ liệu payload cho yêu cầu
     * @param {Function} [onStream] - Callback để xử lý từng chunk dữ liệu trong streaming
     * @returns {Promise<any} Promise sẽ resolve với dữ liệu phản hồi hơặc reject nếu có lỗi
     */
    const sendRequest = (data, onStream = null) => {
        return new Promise((resolve, reject) => {
            if (!isConnected.value || !socket.value || socket.value.readyState !== WebSocket.OPEN) {
                return reject(new Error('WebSocket is not connected.'));
            }

            const currentRequestId = `req-${Date.now()}-${requestIdCounter++}`;
            pendingRequests.set(currentRequestId, { resolve, reject, onStream }); // Lưu Promise đang chờ
            
            const message = {
                requestId: currentRequestId, // Vẫn cần requestId để khớp phản hồi
                action: data.action,
                inputText: data.inputText,
                sessionId: data.sessionId
            };
            socket.value.send(JSON.stringify(message));
        });
    };

    // Tự động kết nối khi component được mounted và ngắt kết nối khi unmounted
    onMounted(connect);
    onUnmounted(disconnect);

    return {
        socket,
        isConnected,
        messages,
        error,
        connect,
        disconnect,
        sendRequest,
    };
}