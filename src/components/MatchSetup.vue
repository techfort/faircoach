<template>
    <div>
      <div class="flex items-center justify-between">
        <form class="bg-lime-800 rounded px-4 mb-4 border-0 border-lime-300">
          <h2>Match Setup</h2>
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
          <p>{{ game.teamSize }}-aside {{ game.periodLength }}-min halves</p>
          <p>min number of minutes {{ minimumNumberOfMinutes }}</p>
          <p>Max number of players {{ maxNumberOfPlayers }}</p>
        </form> 
      </div>
      <div class="flex items-center justify-between">
        <form class="bg-lime-800 shadow-md rounded px-4 pt-6 pb-8 mb-4 border-0" v-on:submit.prevent>
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
      <div class="flex flex-row items-center justify-between clear-both">
        <div v-if="game.players.size >= game.teamSize"><button @click="startMatch($event)">start match</button></div>
        <div>
          <div v-for="[id, player] in store.players" :key="player.id">
            <span :id="id">{{ player.roles }} {{ player.name }} {{ player.playerNumber + ' ' + player.isPlaying }}
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
