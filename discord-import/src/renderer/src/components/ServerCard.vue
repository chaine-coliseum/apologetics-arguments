<script setup lang="ts">
defineProps<{ server: { name: string; shortName: string; color: string }; active: boolean }>()
defineEmits<{ select: [] }>()
</script>
<template><button class="server-card" :class="{ active }" :title="server.name" @click="$emit('select')"><span class="server-mark" :style="{ background: server.color }">{{ server.shortName }}</span><i /></button></template>
