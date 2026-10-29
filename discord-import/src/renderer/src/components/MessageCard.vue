<script setup lang="ts">
defineProps<{ message: { author: string; initials: string; color: string; time: string; content: string; reactions?: string[] } }>()
</script>
<template><article class="message-card"><span class="message-avatar" :style="{ background: message.color }">{{ message.initials }}</span><div class="message-body"><div class="message-author"><strong>{{ message.author }}</strong><small>{{ message.time }}</small></div><p>{{ message.content }}</p><div v-if="message.reactions?.length" class="reactions"><span v-for="reaction in message.reactions" :key="reaction">{{ reaction }}</span></div></div></article></template>
