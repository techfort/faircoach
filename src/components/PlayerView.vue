<template>
    <div>
        [{{ player.playerNumber }}] {{ player.name }} {{ displayTime(player) }}
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { playerTime, formatDuration } from '@/helpers';

export default defineComponent({
  props: ['player'],       
  setup() {
    return {
      displayTime(player) {
        const { minutes, seconds } = formatDuration(playerTime(player));
        return `${minutes}:${seconds}`;
      },
    };
  },
});
</script>
