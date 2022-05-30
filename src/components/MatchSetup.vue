<template>
    <div class="flex flex-col md:flex-row justify-around items-center md:items-start">
      <div class="flex items-center justify-between">
        <form class="bg-lime-800 rounded px-4 mb-4 border-0 border-lime-300 w-max md:w-full" @submit.prevent>
          <h2>Match Setup</h2>
          <div class="flex flex-col md:items-end w-full md:flex-row">
            <div class="flex flex-col">
              <label for="myTeamName">My Team</label>
              <input type="text" name="myTeamName" placeholder="My Team" v-model="game.myTeamName" />
            </div>
            <div class="m-2 mx-6 text-center">vs</div>
            <div class="flex flex-col">
              <label for="opponentTeamName">Opponent Team</label>
              <input type="text" name="opponentTeamName" placeholder="Opponent Team" v-model="game.opponentTeamName" />
            </div>
          </div>
          <div class="flex my-3">
            <toggle-switch label="Home Game" :switchValue="game.isHomeGame" @update:switchValue="updateHomeGame" />
          </div>

          <div class="flex flex-col md:items-end md:flex-row">
            <div class="flex flex-col md:w-2/3">
              <label for="teamSize">Team Size</label>
              <input class="w-3/4" type="number" name="teamSize" v-model="game.teamSize" />
            </div>
            <div class="flex flex-col md:w-2/3">
              <label for="matchlength">Game Period</label>
              <input class="w-3/4" type="number" name="matchlength" v-model="game.periodLength" />
            </div>
            <div class="flex flex-col md:w-2/3">
              <label for="minimumPlayTime">Min PlayTime (% per Player)</label>
              <input class="w-3/4" type="number" range="0,100" name="minimumPlayTime" v-model="game.minimumPlayTime" />
            </div>
          </div>

          <div>
          <h3>Summary</h3>
            <p>{{ game.myTeamName }} vs. {{ game.opponentTeamName }}</p>
            <p>{{ game.teamSize }}-aside {{ game.periodLength }}-min halves</p>
            <p>Min number of minutes: {{ minimumNumberOfMinutes }}</p>
            <p>Max number of players: {{ maxNumberOfPlayers }}</p>
          </div>
        </form> 
      </div>
      <div class="flex items-center justify-between">
        <form class="bg-lime-800 shadow-md rounded px-4 mb-4 border-0" @submit.prevent>
          <div class="flex flex-row"><h2>Add Player</h2></div>
          <div v-if="history.playersh.length" class="py-2 -mt-2">
            <div>past players</div>
            <a href='#' class="text-green-200 m-1" @click="prefillPlayer(player)" v-for="player in history.playersh" :key="player.id">
              {{ player.name }}
            </a>
          </div>
          <div class="flex flex-col">
            <label for="name">Name</label>
            <input type="text" name="name" placeholder="player name" v-model="newplayer.name" required />
          </div>
          <div class="flex flex-col">
            <label for="playerNumber">Number</label>
            <input type="text" name="playerNumber" v-model="newplayer.playerNumber"  />
          </div>
          <div class="flex flex-col">
            <label for="role">Role</label>
            <input type="text" name="role" placeholder="role (optional)" v-model="newplayer.role" />
          </div>
          <div class="m-4">
            <button @click="addPlayer()">add player</button>
          </div>
        </form>
      </div>
      <div class="flex flex-row items-center justify-between clear-both">
        <div class="bg-lime-800 shadow-md rounded px-4 mb-4 border-0">
          <h2>Line Up</h2>
          <line-up :players="store.players" />
          <div class="m-4" v-if="game.players.size >= game.teamSize">
            <button @click="startMatch($event)">GO TO MATCH</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { defineComponent, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { newPlayer } from '@/helpers';
import { useMatchStore } from '@/store/match';
import { useHistoryStore } from '@/store/history';
import ToggleSwitch from '@/components/fragments/ToggleSwitch.vue';
import LineUp from './chunks/LineUp.vue';

export default defineComponent({
  name: 'MatchSetup',
  setup() {
    const store = useMatchStore();
    const history = useHistoryStore();
    const router = useRouter(); 
    let newplayer = reactive({
      name: 'kjkj',
      playerNumber: 0,
      role: '',
      showValidation: false,
    });

    const updateHomeGame = (x) => {
      store.setGame({ ...store.g, isHomeGame: x })
    }
    const prefillPlayer = (p) => {
      console.log(p.playerNumber)
      newplayer.name = p.name
      newplayer.playerNumber = p.playerNumber
      newplayer.role = newplayer.role || p.role
    }
    const addPlayer = () => {
      if (!newplayer.name.trim()) 
      {
        return false
      }
      const p = newPlayer(newplayer.name, [newplayer.role], newplayer.playerNumber);
      if (store.players.size >= store.g.teamSize) {
        p.isPlaying = false;
      }
      store.addPlayer(p);
      history.addPlayer(p)
    };
    const startMatch = (event) => {
      event.preventDefault();
      router.push({ path: '/match'})
    };
    const minimumNumberOfMinutes = computed(() => {
      const matchLength = store.g.periodLength * 2;
      return matchLength / (100 / store.g.minimumPlayTime);
    });
    const maxNumberOfPlayers = computed(() => {
      return (store.g.periodLength * 2 * store.g.teamSize) / minimumNumberOfMinutes.value;
    });
    return {
      // stores
      store,
      history,
      // vars
      game: computed(() => store.g),
      minimumNumberOfMinutes,
      maxNumberOfPlayers,
      newplayer,
      // functions
      updateHomeGame,
      prefillPlayer,
      addPlayer,
      startMatch,
    };
  },
  components: {
    ToggleSwitch,
    LineUp,
  },
})
</script>
