<template>
  <div>here is the match</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMatchStore } from '@/store/match';

export default defineComponent({
  name: 'MatchView',
  setup() {
    const store = useMatchStore();
    console.log('GAME -> \n', store.g);
    return {
      store,
    };
  },
})
</script>
