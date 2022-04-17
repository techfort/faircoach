<template>
  <div id="matchProgress" class="w-screen p-16 m-4 font-bold">
    <div class="flex bg-lime-800 m-4 items-center justify-content">
      <circle-progress :percent="percentageOfMatch" :show-percent="true" class="text-center" />
      <div>
        <h2>{{ homeTeam }} - {{ awayTeam }}</h2>
        <h2>{{ homeGoals }} - {{ awayGoals }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>Add Goal for Hone</div>
          <div>Add Goal for Away</div>
        </div>
      </div>
    </div>
    {{ state }}
    <button v-if="state == 'NOT_STARTED'" @click="start()">start</button>
    <button v-if="state == 'PLAYING'" @click="pause()">pause</button>
    <button v-if="state == 'PAUSED'" @click="resume()">resume</button>
    <button v-if="state == 'PLAYING'" @click="stop()">stop</button>
    <div>
      <button @click="reset()">reset</button>
    </div>
    <div v-if="debug">
      Breaks
      <div v-for="b in store.g.breaks" :key="b.start">
        {{ b.start }} => {{ b.end }}
      </div>

    </div>
    <div>
      <div v-for="[id, p] in store.g.players" :key="id">
        <player-view :player="p" :game="store.g" />
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
import { defineComponent, onMounted, ref, computed } from 'vue';
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
      debug: false,
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
      homeTeam: computed(() => store.g.isHomeGame ? store.g.myTeamName : store.g.opponentTeamName ),
      awayTeam: computed(() => store.g.isHomeGame ? store.g.opponentTeamName : store.g.myTeamName ),
      homeGoals: computed(() => {
        const teamName = store.g.isHomeGame ? store.g.myTeamName : store.g.opponentTeamName;
        return store.g.goals.filter((goal) => goal.team == teamName).length;
      }),
      awayGoals: computed(() => {
        const teamName = store.g.isHomeGame ? store.g.opponentTeamName : store.g.myTeamName;
        return store.g.goals.filter((goal) => goal.team == teamName).length;
      }),
    };
  },
  components: {
    CircleProgress,
    PlayerView,
  },
})
</script>
