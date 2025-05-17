<template>
    <div class="option-container">
        <p>ESTEC CHATBOT PUBLIC</p>
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
                    label: "Hôm nay",
                    items: [
                        { title: "Dữ liệu đầu lò ngày 10/03/2025 lúc 12:30:00" },
                        { title: "Dữ liệu đầu lò ngày 14/03/2025 lúc 12:30:00" },
                        { title: "Dữ liệu GA01, GA02, GA03 ngày 10/03/2025 lúc 12:30:00" },
                        { title: "Dữ liệu GA01, GA02, GA03 ngày 13/03/2025 lúc 12:30:00" }
                    ]
                },
                {
                    label: "7 ngày trước đó",
                    items: [
                        { title: "Dữ liệu GA01, GA02, GA03 ngày 11/03/2025 lúc 12:30:00" },
                        { title: "Dữ liệu đầu lò ngày 27/05/2025" },
                        { title: "Dữ liệu đầu lò ngày 26/05/2025" }
                    ]
                },
                {
                    label: "30 ngày trước đó",
                    items: [
                        { title: "Dữ liệu đầu lò ngày 26/05/2025" },
                        { title: "Dữ liệu đầu lò ngày 04/06/2025" },
                        { title: "Dữ liệu đầu lò ngày 17/05/2025" },
                        { title: "Dữ liệu đầu lò ngày 30/05/2025" },
                        { title: "Dữ liệu đầu lò ngày 22/05/2025" }
                    ]
                },
                {
                    label: "60 ngày trước đó",
                    items: [
                        { title: "Dữ liệu GA01, GA02, GA03 ngày 11/03/2025 lúc 12:30:00" },
                        { title: "Dữ liệu đầu lò ngày 08/06/2025" },
                        { title: "Dữ liệu đầu lò ngày 19/05/2025" },
                        { title: "Dữ liệu đầu lò ngày 27/05/2025" },
                        { title: "Dữ liệu đầu lò ngày 02/06/2025" },
                        { title: "Dữ liệu đầu lò ngày 15/05/2025" }
                    ]
                },
                {
                    label: "90 ngày trước đó",
                    items: [
                        { title: "Dữ liệu GA01, GA02, GA03 ngày 11/03/2025 lúc 12:30:00" },
                        { title: "Dữ liệu đầu lò ngày 31/05/2025" },
                        { title: "Dữ liệu đầu lò ngày 24/05/2025" },
                        { title: "Dữ liệu đầu lò ngày 06/06/2025" },
                        { title: "Dữ liệu đầu lò ngày 21/05/2025" },
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
</style>