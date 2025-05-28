<template>
    <transition name="fade">
        <div v-if="isVisible" class="image-modal-overlay" @click="closeModal">
            <div class="image-modal-content" @click.stop>
                <img :src="imageUrl" alt="Zoomed Image" class="zoomed-image" />
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'ImageModal',
    emits: ['close'],
    props: {
        imageUrl: {
            type: String,
            default: null
        },
        isVisible: {
            type: Boolean,
            default: false
        }
    },
    setup(_, { emit }) {
        const closeModal = () => {
            emit('close');
        }

        return {
            closeModal
        }
    }
}
</script>

<style scoped>
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7); /* Nền mờ */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Đảm bảo nằm trên cùng */
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  background-color: white; /* Có thể thêm nền trắng cho ảnh */
  padding: 10px;
  border-radius: 8px;
}

.zoomed-image {
  max-width: 100%;
  max-height: 80vh; /* Giới hạn chiều cao ảnh trong modal */
  display: block;
  margin: 0 auto;
  border-radius: 4px; /* Giữ bo góc cho ảnh */
}

.close-button {
  position: absolute;
  top: -15px; /* Điều chỉnh vị trí nút đóng */
  right: -15px; /* Điều chỉnh vị trí nút đóng */
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.2s, color 0.2s;
}

.close-button:hover {
  background-color: white;
  color: #000;
}

/* Hiệu ứng chuyển động (Fade transition) */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>