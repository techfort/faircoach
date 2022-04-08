<template>
  <div id="matchProgress" class="justify-center w-screen p-16 text-sky-300 font-bold">
    <circle-progress :percent="percentageOfMatch" :show-percent="true" />
    {{ percentageOfMatch }}
    <button v-if="state == 'NOT_STARTED'" @click="start()">start</button>
    <button v-if="state == 'PLAYING'" @click="pause()">pause</button>
    <button v-if="state == 'PAUSED'" @click="resume()">resume</button>
    <button v-if="state == 'PLAYING'" @click="stop()">stop</button>
    <div>
      <button @click="reset()">reset</button>
    </div>
    <div>
      Breaks
      <div v-for="b in store.g.breaks" :key="b.start">
        {{ b.start }} => {{ b.end }}
      </div>

    </div>
    <div>
      <div v-for="[id, p] in store.g.players" :key="id">
        <player-view :player="p" />
        <!-- {{ p.name }} - {{ playerTime(p).minutes }}:{{ playerTime(p).seconds }} -->
      </div>
    </div>
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
import { pauseGame, resumeGame, startGame, playerTime, updateGame, stopGame, totalBreaksLength } from '@/helpers';
import CircleProgress from 'vue3-circle-progress';
import PlayerView from '@/components/PlayerView.vue';

const states = {
  NOT_STARTED: 'NOT_STARTED',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED',
};

export default defineComponent({
  name: 'MatchView',
  // TODO: create state machine for ONGOING | PAUSED | STOPPED states
  
  setup() {
    const store = useMatchStore();
    const percentageOfMatch = ref(1);
    console.log('GAME -> \n', store.g);
    return {
      store,
      percentageOfMatch,
      timer: null,
      state: states.NOT_STARTED,
    };
  },
  components: {
    CircleProgress,
    PlayerView,
  },
  methods: {
    playerTime(p) {
      return playerTime(p);
    },
    start() {
      this.state = states.PLAYING;
      clearInterval(this.timer);
      const game = startGame(this.store.g);
      this.store.setGame(game);
      this.timer = setInterval(this.update, 1000);
    },
    pause() {
      this.state = states.PAUSED;
      clearInterval(this.timer);
      this.store.setGame(pauseGame(this.store.g));
    },
    resume() {
      this.state = states.PLAYING;
      this.store.setGame(resumeGame(this.store.g));
      this.timer = setInterval(this.update, 1000);
    },
    reset() {
      this.state = states.NOT_STARTED;
      this.store.$reset();
    },
    update() {
      this.percentageOfMatch = this.calculatePercentageOfMatchElapsed(this.elapsed());
      this.store.setGame(updateGame(this.store.g));
    },
    elapsed() {
      const tbl = totalBreaksLength(this.store.g);
      return Math.round(((new Date()).getTime() - this.store.g.matchStart.getTime()) / 1000) - tbl;
    },
    calculatePercentageOfMatchElapsed(elapsed) {
      return this.store.g.isOngoing ?
        Math.round((elapsed / (this.store.g.periodLength * 60 * 2)) * 100) :
        this.percentageOfMatch;
    },
    stop() {
      this.state = states.STOPPED;
      stopGame(this.store.g);
      clearInterval(this.timer);
    },
  },
})
</script>
