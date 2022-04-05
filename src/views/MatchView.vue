<template>
  <div id="matchProgress">
    <circle-progress :percent="percentageOfMatch" />
    {{ percentageOfMatch }}
    <button @click="start()">start</button>
    <button @click="stop()">stop</button>
  </div>
</template>

<style scoped>
#matchProgress {
  text-align: center;
}
</style>

<script> 
import "vue3-circle-progress/dist/circle-progress.css";
import { defineComponent, ref } from 'vue';
import { useMatchStore } from '@/store/match';
import { pauseGame, startGame } from '@/helpers';
import CircleProgress from 'vue3-circle-progress';

export default defineComponent({
  name: 'MatchView',
  setup() {
    const store = useMatchStore();
    const percentageOfMatch = ref(1);
    console.log('GAME -> \n', store.g);
    return {
      store,
      percentageOfMatch,
      timer: null,
    };
  },
  components: {
    CircleProgress,
  },
  methods: {
    start() {
      clearInterval(this.timer);
      this.store.setGame(startGame(this.store.g));
      this.timer = setInterval(() => {
        let pom = this.update(this.elapsed());
        console.log(this.percentageOfMatch, this.percentageOfMatch);
        this.percentageOfMatch = pom;
      }, 1000);
    },
    elapsed() {
      return Math.round(((new Date()).getTime() - this.store.g.matchStart.getTime()) / 1000)
    },
    update(elapsed) {
      if (this.store.g.isOngoing) {
        console.log('calculating elapsed time', this.percentageOfMatch);
        return Math.round((elapsed / (this.store.g.periodLength * 60 * 2)) * 100);
      }
      return this.percentageOfMatch;
    },
    stop() {
      pauseGame(this.store.g);
      clearInterval(this.timer);
    },
  },
})
</script>
