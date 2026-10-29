<script setup lang="ts">
defineProps<{ post: { title: string; excerpt: string; author: string; initials: string; color: string; replies: number; updated: string; tags: string[] }; active: boolean }>()
defineEmits<{ select: [] }>()
</script>
<template><button class="post-card" :class="{ active }" @click="$emit('select')"><div class="post-top"><span class="post-avatar" :style="{ background: post.color }">{{ post.initials }}</span><div><strong>{{ post.title }}</strong><p>{{ post.excerpt }}</p></div></div><div class="post-bottom"><span>{{ post.author }} · {{ post.updated }}</span><span class="post-tags"><em v-for="tag in post.tags" :key="tag">{{ tag }}</em></span><span class="reply-count">◌ {{ post.replies }}</span></div></button></template>
