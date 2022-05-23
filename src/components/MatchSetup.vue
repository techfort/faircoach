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
          <div class="flex flex-row clear-both"><h2>Add Player</h2></div>
          <div class="flex flex-col">
            <label for="name">Name</label>
            <input type="text" name="name" placeholder="player name" v-model="newplayer.name" />
          </div>
          <div class="flex flex-col">
            <label for="number">Number</label>
            <input type="text" name="number" v-model="newplayer.number" />
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
              <span class="font-bold text-yellow-400 text-lg">{{ player.name }}</span> {{ player.playerNumber }}
              playing: <input type="checkbox" v-bind="player" class="border-0 border-lime-200 bg-slate-300" v-model="player.isPlaying" /></span>
          </div>
          <div class="m-4" v-if="game.players.size >= game.teamSize">
            <button @click="startMatch($event)">GO TO MATCH</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { newPlayer } from '@/helpers';
import { useMatchStore } from '@/store/match';
import PlayerForm from '@/components/PlayerForm.vue';

export default defineComponent({
  name: 'MatchSetup',
  setup() {
    const store = useMatchStore();
    const router = useRouter(); 
    console.log(store.g);
    let newplayer = {
      name: '',
      number: 0,
      role: '',
    };
    const addPlayer = () => {
      const p = newPlayer(newplayer.name, [newplayer.role], newplayer.number);
      console.log(store.players);
      if (store.players.size >= store.g.teamSize) {
        p.isPlaying = false;
      }
      store.addPlayer(p);
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
      newplayer,
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
