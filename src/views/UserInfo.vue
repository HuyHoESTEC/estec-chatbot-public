<template>
    <div class="info-container">
        <p>ESTEC COMPANY - {{ formattedDateTime }}</p>
    </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue';

export default {
    name: 'UserInformation',
    setup() {
        const formattedDateTime = ref('');
        let intervalId = null;

        const updateDateTime = () => {
            const now = new Date();
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            };
            formattedDateTime.value = new Intl.DateTimeFormat(undefined, options).format(now);
        };

        onMounted(() => {
            updateDateTime();
            intervalId = setInterval(updateDateTime, 1000);
        });

        onUnmounted(() => {
            clearInterval(intervalId);
        });

        return {
            formattedDateTime
        }
    }
}
</script>

<style>
.info-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    color: black;
}

.info-container > p {
    font-weight: bold;
    font-size: 20px;
    color: black;
}
</style>