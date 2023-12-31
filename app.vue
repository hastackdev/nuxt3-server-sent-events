<template>
  <div>
    <pre>{{ data }}</pre>
    <button @click="onTriggerSSE">Trigger SSE</button>
  </div>
</template>

<script setup lang="ts">
const eventSource = ref<EventSource>();
const data = ref({
  connected: {},
  update: {},
  trigger: [] as any[]
});

const init = () => {
  eventSource.value = new EventSource('/api/sse');

  eventSource.value.addEventListener('connected', ({ data: _data }) => {
    data.value.connected = JSON.parse(_data);
  });

  eventSource.value.addEventListener('update', ({ data: _data }) => {
    data.value.update = JSON.parse(_data);
  });

  eventSource.value.addEventListener('trigger', ({ data: _data }) => {
    data.value.trigger.push(JSON.parse(_data));
  });
};

const onTriggerSSE = async () => {
  await $fetch('/api/sse', {
    method: 'POST',
    body: {
      message: 'Hi There'
    }
  });
};

onMounted(init);

onBeforeUnmount(() => {
  eventSource.value?.close();
});
</script>
