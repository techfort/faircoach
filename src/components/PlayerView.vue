<template>
    <div>
        [{{ player.number }}] {{ player.name }} {{ displayTime(player) }}
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { playerTime } from '@/helpers';

export default defineComponent({
  props: ['player'],       
  // setup() {
  // },
  methods: {
    displayTime(player) {
      const { minutes, seconds } = playerTime(player);
      return `${minutes}:${seconds}`;
    }
  },
})
</script>
