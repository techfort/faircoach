<template>
    <div class="flex">
      <div class="flex items-center justify-between">
        <form class="bg-lime-800 rounded px-4 mb-4 border-0 border-lime-300" @submit.prevent>
          <h2>Match Setup</h2>
          <div>
            <label for="myTeamName">My Team</label>
            <input type="text" name="myTeamName"
              class="shadow appearance-none border rounded py-2 w-full focus:outline-none leading-tight"
              v-model="game.myTeamName" />
            Home Game: <input type="checkbox" name="isHomeGame" v-model="game.isHomeGame" />
          </div>

          <div>
            <label for="opponentTeamName">Opponent Team Name</label>
            <input type="text" name="opponentTeamName"
              class="shadow appearance-none border rounded py-2 w-full focus:outline-none leading-tight"
              v-model="game.opponentTeamName" />
          </div>

          <div>
            <label for="teamSize">Team Size</label>
            <input type="number" name="teamSize"
              class="shadow appearance-none border rounded py-2 w-full focus:outline-none leading-tight"
              v-model="game.teamSize" />
          </div>
          <div>
            <label for="matchlength">Game Period in Minutes
            </label>
              <input type="number" name="matchlength"
              class="shadow appearance-none border rounded py-2 w-full focus:outline-none leading-tight"
              v-model="game.periodLength" />
          </div>
          <div>
            <label for="minimumPlayTime">Min PlayTime % per Player</label>
            <input type="number" range="0,100"
              class="shadow appearance-none border rounded py-2 w-full focus:outline-none leading-tight"
              name="minimumPlayTime" v-model="game.minimumPlayTime" />
          </div>
          <div>
          <h3>Summary</h3>
            <p>{{ game.myTeamName }} vs. {{ game.opponentTeamName }}</p>
            <p>{{ game.teamSize }}-aside {{ game.periodLength }}-min halves</p>
            <p>min number of minutes {{ minimumNumberOfMinutes }}</p>
            <p>Max number of players {{ maxNumberOfPlayers }}</p>
          </div>
        </form> 
      </div>
      <div class="flex items-center justify-between">
        <form class="bg-lime-800 shadow-md rounded px-4 pt-6 pb-8 mb-4 border-0" @submit.prevent>
          <div class="flex flex-row clear-both"><h2>Add Player</h2></div>
          <div>
            <label for="name">Name</label>
            <input
              type="text"
              name="name"
              class="shadow appearance-none border rounded py-2 w-full focus:outline-none leading-tight"
              v-model="newplayer.name" />
          </div>
          <div>
            <label for="number">Number</label>
            <input
              type="text"
              name="number"
              class="shadow appearance-none border rounded py-2 w-full focus:outline-none leading-tight"
              v-model="newplayer.number" />
          </div>
          <div>
            <label for="role">Role
              <input type="text" name="role"
              class="shadow appearance-none border rounded py-2 w-full focus:outline-none leading-tight"
              v-model="newplayer.role" />
            </label>
          </div>
          <p><button @click="addPlayer()" class="border-0">add player</button></p>
        </form>
      </div>
      <div class="flex flex-row items-center justify-between clear-both m-1">
        <div>
          <div v-if="game.players.size >= game.teamSize">
            <button @click="startMatch($event)"
              class="border-0 border-lime-800 rounded-md bg-yellow-600 shadow-md px-3 text-shao text-lg text-white">GO TO MATCH</button>
          </div>
          <h2>Line Up</h2>
          <div v-for="[id, player] in store.players" :key="player.id">
            <span :id="id">{{ player.roles[0] }}
              <span class="font-bold text-yellow-400 text-lg">{{ player.name }}</span> {{ player.playerNumber }}
              playing: <input type="checkbox" v-bind="player" class="border-0 border-lime-200 bg-slate-300" v-model="player.isPlaying" /></span>
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
