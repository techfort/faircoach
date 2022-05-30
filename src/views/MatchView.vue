<template>
  <div id="matchProgress" class="p-4 m-4 font-bold">
    <div class="flex flex-col items-start">
      {{ state }}
      <div v-if="state == 'NOT_STARTED'">Click below to start the match timer</div>
      <div v-if="state == 'PLAYING'">Game running</div>
      <div v-if="state == 'PAUSED'">Game paused - hit resume to restart</div>
      <div v-if="state == 'STOPPED'">Game stopped</div>
      <div class="flex flex-row">
        <button class="icon" v-if="state == 'NOT_STARTED' || state == 'NOT_STARTED'" @click="start()">
          <font-awesome-icon :icon="['fas', 'play']" />
          <label>play</label>
        </button>
        <template v-if="state == 'PLAYING'">
          <button class="icon" @click="pause()">
            <font-awesome-icon :icon="['fas', 'pause']" />
            <label>pause</label>
          </button>
          <button class="icon" @click="stop()">
            <font-awesome-icon :icon="['fas', 'stop']" />
            <label>stop</label>
          </button>
          <button class="icon" @click="reset()">
            <font-awesome-icon :icon="['fas', 'xmark']" />
            <label>cancel</label>
          </button>         
        </template>
        <button class="icon" v-if="state == 'PAUSED'" @click="resume()">
          <font-awesome-icon :icon="['fas', 'play']" />
          <label>resume</label>
        </button>
      </div>
    </div>
    <div class="flex bg-lime-800 m-2 p-2 items-center justify-content">
      <circle-progress :percent="percentageOfMatch" :show-percent="true" class="text-center p-4" />
      <div class="text-center p-4">
        <div v-if="state == 'PLAYING'">playing: {{ timeElapsed }}</div>
        <h2>{{ homeTeam }} - {{ awayTeam }}</h2>
        <h2>{{ homeGoals }} - {{ awayGoals }}</h2>
        <template v-if="state == 'PLAYING'">
          <div class="grid grid-cols-2 gap-4" v-if="!goalScoreMode">
            <button @click="() => goalScored()">Score Goal</button>
          </div>
          <div class="grid grid-cols-2 gap-4" v-if="goalScoreMode">
            <button @click="() => goalScored(homeTeam)">{{ homeTeam }} Scored!</button>
            <button @click="() => goalScored(awayTeam)">{{ awayTeam }} Scored!</button>
          </div>
        </template>
      </div>
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
import { defineComponent, onMounted, ref, computed, reactive } from 'vue';
import { useMatchStore } from '@/store/match';
import { playerTime, pauseGame, resumeGame, startGame, updateGame, stopGame, totalBreaksLength, scoreGoal } from '@/helpers';
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
    let timeElapsed = ref('');
    console.log('GAME -> \n', store.g);
    let state = ref(states.NOT_STARTED);
    let timer;
    let goalScoreMode = reactive(false);
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
    const stop = () => {
      state.value = states.STOPPED;
      stopGame(store.g);
      clearInterval(timer);
    };
    const reset = () => {
      state.value = states.NOT_STARTED;
      store.$reset();
    };
    const update = () => {
      percentageOfMatch.value = calculatePercentageOfMatchElapsed(elapsed());
      timeElapsed.value = toHHMMSS(elapsed());
      updateGame(store.g);
    };
    const elapsed = () => {
      const tbl = totalBreaksLength(store.g);
      return Math.round(((new Date()).getTime() - store.g.matchStart.getTime()) / 1000) - tbl;
    };
    const toHHMMSS = (numSecs) => {
      let secNum = parseInt(numSecs, 10);
      let hours = Math.floor(secNum / 3600).toString().padStart(2, '0');
      let minutes = Math.floor((secNum - (hours * 3600)) / 60).toString().padStart(2, '0');
      let seconds = (secNum - (hours * 3600) - (minutes * 60)).toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
    const calculatePercentageOfMatchElapsed = (elapsed) => {
      return store.g.isOngoing ?
        Math.round((elapsed / (store.g.periodLength * 60 * 2)) * 100) :
        percentageOfMatch;
    };
    const calculateTimeOfMatchElapsed = (elapsed) => {
      return store.g.isOngoing ?
        elapsed:
        timeElapsed;
    };
    const goalScored = (team) => {
      if (!team) {
        goalScoreMode = true;
        return;
      }
      scoreGoal(1, 1, team, store.g);
      goalScoreMode = false;
    }
    onMounted(() => { console.log(store.g); }); 
    return {
      debug: false,
      store,
      percentageOfMatch,
      timeElapsed,
      timer,
      state,
      start,
      pause,
      reset,
      resume,
      update,
      elapsed,
      calculatePercentageOfMatchElapsed,
      calculateTimeOfMatchElapsed,
      stop,
      goalScored,
      goalScoreMode,
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
