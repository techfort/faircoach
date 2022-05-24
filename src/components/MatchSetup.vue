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
            <div class="form-check form-switch">
              <input class="form-check-input appearance-none w-9 -ml-10 rounded-full h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-400 focus:outline-none cursor-pointer shadow-sm" 
              type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="game.isHomeGame">
              <label class="form-check-label inline-block m-1" for="flexSwitchCheckDefault">Home&nbsp;game</label>
            </div>
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
          <div v-for="[id, player] in store.players" :key="player.id">
            <span :id="id">{{ player.roles[0] }}
              <span
                class="rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center cursor-pointer active:bg-gray-300 transition duration-300 ease w-max">
                <img class="rounded-full w-11 h-11 max-w-none" alt="A"
                  src="https://mdbootstrap.com/img/Photos/Avatars/avatar-6.jpg" />
                <span class="flex items-center px-3 py-2 whitespace-nowrap">
                  {{ player.name }} - {{ player.playerNumber }}
                </span>
                <div class="form-check form-switch">
                  <input class="form-check-input appearance-none w-9 -ml-10 rounded-full h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-400 focus:outline-none cursor-pointer shadow-sm" 
                  type="checkbox" role="switch" id="flexSwitchCheckDefault" v-bind="player" v-model="player.isPlaying">
                  <label class="form-check-label inline-block m-1" for="flexSwitchCheckDefault">playing:</label>
                </div>
                <!-- remove played - not implemented yet  -->
                <!-- <button class="bg-transparent hover focus:outline-none">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times"
                    class="w-3 mr-4" role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 352 512">
                    <path fill="currentColor"
                      d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z">
                    </path>
                  </svg>
                </button> -->
              </span>
            </span>
          </div>
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
import PlayerForm from '@/components/PlayerForm.vue';

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
      store,
      history,
      newplayer,
      prefillPlayer,
      game: computed(() => store.g),
      minimumNumberOfMinutes,
      maxNumberOfPlayers,
      addPlayer,
      startMatch,
    };
  },
  copmonents: {
    PlayerForm,
  },
})
</script>
