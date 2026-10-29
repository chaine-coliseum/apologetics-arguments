<script setup lang="ts">
import { computed, ref } from 'vue'
import MessageCard from './components/MessageCard.vue'
import PostCard from './components/PostCard.vue'
import ServerCard from './components/ServerCard.vue'

type Message = { id: string; author: string; initials: string; color: string; time: string; content: string; reactions?: string[] }
type Post = { id: string; title: string; excerpt: string; author: string; initials: string; color: string; replies: number; updated: string; tags: string[]; messages: Message[] }
type Channel = { id: string; name: string; type: 'text' | 'posts'; unread?: number; messages?: Message[]; posts?: Post[] }
type Server = { id: string; name: string; shortName: string; color: string; categories: { name: string; channels: Channel[] }[] }

const message = (id: string, author: string, initials: string, color: string, time: string, content: string, reactions?: string[]): Message => ({ id, author, initials, color, time, content, reactions })

const servers: Server[] = [
  { id: 'spiritus', name: 'Spiritus Dei', shortName: 'SD', color: '#d89068', categories: [
    { name: 'GÉNÉRAL', channels: [
      { id: 'accueil', name: 'accueil', type: 'text', messages: [message('m1', 'Léon', 'L', '#ad7b61', 'Aujourd’hui à 09:42', 'Bienvenue dans l’espace de travail Spiritus Dei. Vous pouvez retrouver ici les échanges récents et les dossiers importés.'), message('m2', 'Marie', 'M', '#5b8fc4', 'Aujourd’hui à 10:06', 'Je viens de classer les nouveaux arguments dans les catégories correspondantes.', ['👍 4', '✨ 2']), message('m3', 'Thomas', 'T', '#8b6fc1', 'Aujourd’hui à 10:18', 'Parfait, je vais relire les discussions sur la critique textuelle cet après-midi.')] },
      { id: 'annonces', name: 'annonces', type: 'text', unread: 2, messages: [message('m4', 'Léon', 'L', '#ad7b61', 'Hier à 17:20', 'La nouvelle importation Discord est disponible. Les posts sont maintenant regroupés par sujet.'), message('m5', 'Claire', 'C', '#3caa91', 'Hier à 17:45', 'Merci pour le travail ! La recherche dans les messages sera ajoutée prochainement.')] }
    ] },
    { name: 'DISCUSSIONS', channels: [
      { id: 'hermeneutique', name: 'herméneutique', type: 'posts', posts: [
        { id: 'p1', title: 'Le problème de la transmission des textes', excerpt: 'Une synthèse des arguments autour des variantes et de la transmission manuscrite.', author: 'Marie', initials: 'M', color: '#5b8fc4', replies: 12, updated: 'il y a 2 h', tags: ['textes', 'histoire'], messages: [message('pm1', 'Marie', 'M', '#5b8fc4', 'Aujourd’hui à 08:51', 'J’aimerais rassembler ici les principales objections concernant la transmission des textes.'), message('pm2', 'Thomas', 'T', '#8b6fc1', 'Aujourd’hui à 09:14', 'La distinction entre variation et corruption me semble importante pour structurer la réponse.', ['👍 3']), message('pm3', 'Léon', 'L', '#ad7b61', 'Aujourd’hui à 09:38', 'Oui, et il faudrait ajouter quelques exemples précis provenant des manuscrits les mieux attestés.')] },
        { id: 'p2', title: 'Jésus dans le judaïsme du premier siècle', excerpt: 'Notes de lecture et pistes de recherche pour situer les sources historiques.', author: 'Thomas', initials: 'T', color: '#8b6fc1', replies: 8, updated: 'hier', tags: ['histoire'], messages: [message('pm4', 'Thomas', 'T', '#8b6fc1', 'Hier à 15:02', 'Voici les premières notes sur le contexte juif du premier siècle.'), message('pm5', 'Claire', 'C', '#3caa91', 'Hier à 16:20', 'Le lien avec les attentes messianiques mériterait un développement séparé.')] }
      ] },
      { id: 'critique-textuelle', name: 'critique-textuelle', type: 'posts', posts: [{ id: 'p3', title: 'Les variantes textuelles importantes', excerpt: 'Inventaire des passages à vérifier et des sources à citer.', author: 'Claire', initials: 'C', color: '#3caa91', replies: 5, updated: 'il y a 4 h', tags: ['sources'], messages: [message('pm6', 'Claire', 'C', '#3caa91', 'Aujourd’hui à 07:48', 'Je commence un inventaire des passages les plus souvent cités dans les débats.')] }] },
      { id: 'questions', name: 'questions', type: 'text', messages: [message('m6', 'Claire', 'C', '#3caa91', 'Lundi à 11:02', 'Quelqu’un a-t-il une bonne référence sur la datation des évangiles ?'), message('m7', 'Marie', 'M', '#5b8fc4', 'Lundi à 11:30', 'Je peux en proposer quelques-unes dans un post dédié.')] }
    ] }
  ] },
  { id: 'bibliotheque', name: 'Bibliothèque', shortName: 'B', color: '#7085d1', categories: [{ name: 'RESSOURCES', channels: [{ id: 'lectures', name: 'lectures', type: 'posts', posts: [] }, { id: 'liens', name: 'liens-utiles', type: 'text', messages: [] }] }] },
  { id: 'archives', name: 'Archives', shortName: 'A', color: '#6ba58e', categories: [{ name: 'IMPORTS', channels: [{ id: 'anciens-posts', name: 'anciens-posts', type: 'posts', posts: [] }] }] }
]

const selectedServerId = ref('spiritus')
const selectedChannelId = ref('accueil')
const selectedPostId = ref<string | null>(null)
const selectedServer = computed(() => servers.find((server) => server.id === selectedServerId.value) ?? servers[0])
const channels = computed(() => selectedServer.value.categories.flatMap((category) => category.channels))
const selectedChannel = computed(() => channels.value.find((channel) => channel.id === selectedChannelId.value) ?? channels.value[0])
const selectedPost = computed(() => selectedChannel.value?.posts?.find((post) => post.id === selectedPostId.value) ?? null)
const selectServer = (server: Server): void => { selectedServerId.value = server.id; selectedChannelId.value = server.categories[0]?.channels[0]?.id ?? ''; selectedPostId.value = null }
const selectChannel = (channel: Channel): void => { selectedChannelId.value = channel.id; selectedPostId.value = null }
</script>

<template>
  <main class="discord-shell">
    <aside class="server-rail"><div class="rail-brand">A</div><div class="server-list"><ServerCard v-for="server in servers" :key="server.id" :server="server" :active="server.id === selectedServerId" @select="selectServer(server)" /></div><button class="rail-add">+</button><div class="rail-user"><span class="avatar avatar-user">L</span><span class="online-dot" /></div></aside>
    <aside class="channel-sidebar">
      <header class="server-header"><div><strong>{{ selectedServer.name }}</strong><small>Communauté privée</small></div><span>⌄</span></header>
      <div class="channel-scroll"><section v-for="category in selectedServer.categories" :key="category.name" class="channel-category"><div class="category-title"><span>⌄</span>{{ category.name }}<button>+</button></div><button v-for="channel in category.channels" :key="channel.id" class="channel-item" :class="{ active: channel.id === selectedChannelId }" @click="selectChannel(channel)"><span class="channel-icon">{{ channel.type === 'posts' ? '▤' : '#' }}</span><span>{{ channel.name }}</span><b v-if="channel.unread">{{ channel.unread }}</b></button></section></div>
      <footer class="user-panel"><span class="avatar avatar-user">L</span><div><strong>Léon</strong><small>En ligne</small></div><button>⚙</button></footer>
    </aside>
    <section class="content-panel" :class="{ 'has-detail': selectedPost }">
      <header class="content-header"><div class="channel-title"><span class="hash">{{ selectedChannel.type === 'posts' ? '▤' : '#' }}</span><strong>{{ selectedChannel.name }}</strong><span class="separator">|</span><span>{{ selectedChannel.type === 'posts' ? 'Posts et discussions' : 'Salon de discussion' }}</span></div><div class="header-actions"><span>⌕</span><span>ⓘ</span><span>⋯</span></div></header>
      <div v-if="selectedChannel.type === 'posts'" class="content-scroll posts-view"><div class="view-intro"><div class="intro-icon">▤</div><h1>Bienvenue dans #{{ selectedChannel.name }}</h1><p>Les sujets de discussion de {{ selectedServer.name }} sont regroupés ici.</p></div><PostCard v-for="post in selectedChannel.posts" :key="post.id" :post="post" :active="post.id === selectedPostId" @select="selectedPostId = post.id" /><div v-if="!selectedChannel.posts?.length" class="empty-state">Aucun post dans ce salon.</div></div>
      <div v-else class="content-scroll messages-view"><div class="view-intro"><div class="intro-icon">#</div><h1>Bienvenue dans #{{ selectedChannel.name }}</h1><p>C’est le début de ce salon.</p></div><MessageCard v-for="message in selectedChannel.messages" :key="message.id" :message="message" /><div v-if="!selectedChannel.messages?.length" class="empty-state">Aucun message dans ce salon.</div></div>
      <div class="composer"><span>{{ selectedChannel.type === 'posts' ? 'Créer un nouveau post' : `Écrire dans #${selectedChannel.name}` }}</span><div><button>＋</button><button>☺</button><button>➤</button></div></div>
    </section>
    <aside v-if="selectedPost" class="detail-panel"><header class="detail-header"><div><small>DISCUSSION</small><strong>{{ selectedPost.title }}</strong></div><button @click="selectedPostId = null">×</button></header><div class="detail-scroll"><div class="detail-meta"><span class="tag" v-for="tag in selectedPost.tags" :key="tag">{{ tag }}</span><span>{{ selectedPost.replies }} réponses</span></div><MessageCard v-for="message in selectedPost.messages" :key="message.id" :message="message" /></div><div class="composer detail-composer"><span>Répondre au post</span><button>➤</button></div></aside>
  </main>
</template>
