<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  badge: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="panel-section" v-bind="$attrs">
    <header class="panel-head">
      <h3>{{ title }}</h3>
      <span v-if="badge" class="badge">{{ badge }}</span>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.panel-section {
  border: 1px solid rgba(79, 57, 32, 0.1);
  border-radius: 24px;
  background: rgba(255, 251, 245, 0.88);
  padding: 22px;
  box-shadow: 0 16px 40px rgba(100, 73, 34, 0.08);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

h3 {
  margin: 0;
  font-size: 1.1rem;
}

.badge {
  padding: 7px 11px;
  border-radius: 999px;
  background: #efe2ca;
  color: #7e6038;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
