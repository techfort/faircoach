<template>
    <div class="flex flex-col items-start">
      <div class="p-2">
        [{{ player.playerNumber }}] {{ player.name }} {{ displayTime(player) }} [{{ percentage(player, game)}}]
      </div>
      <div class="m-2 w-48 bg-gray-200 rounded-full">
        <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-full"
        :style="'width: ' + percentage(player, game) +'%'">{{ percentage(player, game) }}%</div>
      </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { playerTime, formatDuration } from '@/helpers';

export default defineComponent({
  props: ['player', 'game'],       
  setup() {
    return {
      percentage(player, game) {
        const { minutes, seconds } = playerTime(player);
        return Math.trunc(100 * (minutes * 60 + seconds)/(game.periodLength * 60 * 2));
      },
      displayTime(player) {
        const { minutes, seconds } = formatDuration(playerTime(player));
        return `${minutes}:${seconds}`;
      },
    };
  },
});
</script>
