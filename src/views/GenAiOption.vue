<template>
    <div class="option-container">
        <p>
            <span class="estec-icon">
                <img src="../assets/estec-icon.png" alt="Estec Logo">
            </span>
            ESTEC CHATBOT
        </p>
        <div class="question-list">
            <div class="date-group" v-for="(group, index) in groupdedQuestions" :key="index">
                <div class="group-label">
                    {{ group.label }}
                </div>
                <ul>
                    <li class="question-item" v-for="(item, idx) in group.items" :key="idx" >
                        <span>{{ item.title }}</span>
                        <span v-if="item.unread" class="dot"></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GenAiOption',
    data() {
        return {
            groupdedQuestions: [
                {
                    items: [
                        { title: "Thông tin về GA03, GA01, GA02 NOx ngày 16/05/2025 lúc 22:15:00" },
                        { title: "Xem dữ liệu NOx GA02, GA03, GA01 ngày 12/05/2025 lúc 07:03:00" },
                        { title: "Hãy cho biết GA01, GA03, GA02 NOx ngày 05/05/2025 lúc 15:58:00" },
                        { title: "Dữ liệu từ GA03, GA02, GA01 NOx ngày 28/04/2025 lúc 19:21:00" },
                        { title: "Truy vấn NOx GA02, GA01, GA03 ngày 18/04/2025 lúc 03:47:00" },
                        { title: "Thông số GA01, GA02, GA03 NOx ngày 09/04/2025 lúc 11:32:00" },
                        { title: "Hiển thị NOx GA03, GA01, GA02 ngày 01/04/2025 lúc 16:09:00" },
                        { title: "Giá trị GA02, GA03, GA01 NOx ngày 25/03/2025 lúc 09:55:00" },
                        { title: "Dữ liệu cảm biến NOx GA03, GA02, GA01 ngày 10/03/2025 lúc 12:30:00" },
                        { title: "Thông tin từ NOx GA02, GA01, GA03 ngày 05/03/2025 lúc 20:17:00" },
                        { title: "Báo cáo GA01, GA02, GA03 NOx ngày 28/02/2025 lúc 06:24:00" },
                        { title: "Chi tiết về NOx GA03, GA01, GA02 ngày 19/02/2025 lúc 18:01:00" },
                        { title: "Thống kê NOx GA01, GA03, GA02 ngày 03/02/2025 lúc 23:16:00" },
                        { title: "Dữ liệu đo NOx GA03, GA02, GA01 ngày 26/01/2025 lúc 10:53:00" },
                        { title: "Xem thông tin GA02, GA01, GA03 NOx ngày 17/01/2025 lúc 08:31:00" },
                        { title: "Giá trị đọc NOx GA01, GA02, GA03 ngày 09/01/2025 lúc 17:08:00" },
                        { title: "Dữ liệu thời gian thực NOx GA02, GA03, GA01 ngày 25/12/2024 lúc 21:23:00" },
                        { title: "Xem nhanh dữ liệu GA01, GA02, GA03 NOx ngày 20/12/2024 lúc 09:30:00" },
                        { title: "Thông tin cập nhật NOx GA03, GA02, GA01 ngày 15/12/2024 lúc 18:45:00" },
                        { title: "Liệt kê GA02, GA01, GA03 NOx ngày 10/12/2024 lúc 02:00:00" }
                        ]
                },
            ]
        }
    }
}
</script>

<style scoped>
.option-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: black;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(9px);
}

.estec-icon {
  margin-right: 2px; /* Khoảng cách giữa text và icon */
  align-items: center; /* Căn chỉnh icon theo chiều dọc */
}

.estec-icon img {
  height: 2em; /* Điều chỉnh kích thước icon theo chiều cao của text */
  width: auto; /* Duy trì tỷ lệ khung hình */
  vertical-align: middle; /* Căn chỉnh icon giữa dòng text */
}


.option-container > p {
    font-weight: bold;
    font-size: 20px;
    color: black;
}

.question-list {
  width: 100%;
  color: #d0d3d4;
  font-family: Arial, sans-serif;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 100vh; /* Hoặc một chiều cao cố định phù hợp với layout của bạn */
  overflow-y: auto; /* Cho phép hiển thị thanh cuộn khi nội dung vượt quá max-height */
}

.date-group {
  margin-bottom: 16px;
}

.group-label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #424949;
}

.question-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #566573;
}

.question-item:hover {
  background: #f8f9f9;
}

.question-item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%; /* Adjust width depending on layout */
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #1976d2;
  border-radius: 50%;
}

.question-list::-webkit-scrollbar {
  width: 8px; /* Độ rộng của thanh cuộn */
}

.question-list::-webkit-scrollbar-thumb {
  background-color: #ccc; /* Màu của "ngón tay" thanh cuộn */
  border-radius: 4px;
}

.question-list::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* Màu của "đường ray" thanh cuộn */
}

/* Ẩn thanh cuộn khi không hover (tùy chọn, có thể không hoạt động trên mọi trình duyệt) */
.question-list {
  scrollbar-width: thin; /* Cho Firefox */
  scrollbar-color: #ccc #f1f1f1; /* Cho Firefox */
}

/* Ẩn thanh cuộn mặc định của WebKit (Chrome, Safari) khi không hover */
.question-list:hover::-webkit-scrollbar-thumb {
  opacity: 1; /* Hiển thị khi hover */
}

.question-list::-webkit-scrollbar-thumb {
  opacity: 0; /* Ẩn mặc định */
  transition: opacity 0.3s ease;
}
</style>