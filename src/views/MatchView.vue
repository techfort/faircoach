<template>
  <div id="matchProgress" class="text-center w-screen p-16 text-sky-300 font-bold">
    <circle-progress :percent="percentageOfMatch" :show-percent="true" class="justify-center" />
    {{ state }}
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
import { defineComponent, onMounted, ref } from 'vue';
import { useMatchStore } from '@/store/match';
import { playerTime, pauseGame, resumeGame, startGame, updateGame, stopGame, totalBreaksLength } from '@/helpers';
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
    let percentageOfMatch = ref(0);
    console.log('GAME -> \n', store.g);
    let state = ref(states.NOT_STARTED);
    let timer;
    const start = () => {
      state.value = states.PLAYING;
      clearInterval(timer);
      startGame(store.g);
      console.log('starting....');
      timer = setInterval(update, 1000);
    };
    const pause = () => {
      state.value = states.PAUSED;
      clearInterval(timer);
      pauseGame(store.g);
    };
    const resume = () => {
      state.value = states.PLAYING;
      resumeGame(store.g);
      timer = setInterval(update, 1000);
    };
    const reset = () => {
      state.value = states.NOT_STARTED;
      store.$reset();
    };
    const update = () => {
      percentageOfMatch.value = calculatePercentageOfMatchElapsed(elapsed());
      updateGame(store.g);
    };
    const elapsed = () => {
      const tbl = totalBreaksLength(store.g);
      return Math.round(((new Date()).getTime() - store.g.matchStart.getTime()) / 1000) - tbl;
    };
    const calculatePercentageOfMatchElapsed = (elapsed) => {
      return store.g.isOngoing ?
        Math.round((elapsed / (store.g.periodLength * 60 * 2)) * 100) :
        percentageOfMatch;
    };
    const stop = () => {
      state.value = states.STOPPED;
      stopGame(store.g);
      clearInterval(timer);
    };
    onMounted(() => { console.log(store.g); }); 
    return {
      store,
      percentageOfMatch,
      timer,
      state,
      start,
      pause,
      reset,
      resume,
      update,
      elapsed,
      calculatePercentageOfMatchElapsed,
      stop,
      playerTime: (p) => playerTime(p),
      players: ref(() => store.g.players),
    };
  },
  components: {
    CircleProgress,
    PlayerView,
  },
})
</script>
