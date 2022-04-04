<template>
    <div>
      <div>
        <h2>MS</h2>
        <label for="teamSize">Size
          <input type="number" name="teamSize" v-model="game.teamSize" />
        </label>
        <label for="matchlength">
          <input type="number" name="matchlength" v-model="game.periodLength" />
        </label>
        <label for="minimumPlayTime">Min PlayTime %
          <input type="number" range="0,100" name="minimumPlayTime" v-model="game.minimumPlayTime" />
        </label>
        <p>{{ game.teamSize }}-aside {{ game.periodLength }}-min halves</p>
        <p>min number of minutes {{ minimumNumberOfMinutes }}</p>
        <p>Max number of players {{ maxNumberOfPlayers }}</p>
      </div>
      <div>
        <h2>Ps</h2>
        <label for="name">Name
          <input type="text" name="name" v-model="newplayer.name" />
        </label>
        <label for="number">Number
          <input type="text" name="number" v-model="newplayer.number" />
        </label>
        <label for="role">Role
          <input type="text" name="role" v-model="newplayer.role" />
        </label>
        <p><button @click="addPlayer()">add player</button></p>
      </div>
      <div v-if="game.players.size >= game.teamSize"><button @click="startMatch()">start match</button></div>
      <div>
        <div v-for="[id, player] in game.players" :key="player.id">
          <span :id="id">{{ player.roles }} {{ player.name }} {{ player.playerNumber }} </span>
        </div>
      </div> 
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { newPlayer, startGame } from '@/helpers';
import { useMatchStore } from '@/store/match';
import PlayerForm from '@/components/PlayerForm.vue';

export default defineComponent({
  name: 'MatchSetup',
  setup() {
    const store = useMatchStore();
    console.log(store.g);
    return {
      store,
      newplayer: {
        name: '',
        number: 0,
        role: '',
      },
    };
  },
  copmonents: {
    PlayerForm,
  },
  methods: {
    addPlayer() {
      const p = newPlayer(this.newplayer.name, [this.newplayer.role], this.newplayer.number);
      this.store.addPlayer(p);
    },
    startMatch() {
      const g = startGame(this.store.g);
      this.store.setGame(g);
      console.log('starting match...');
      this.$router.push({ path: '/match'})
    },
  },
  computed: {
    game() {
      return this.store.g;
    },
    minimumNumberOfMinutes() {
      const matchLength = this.store.g.periodLength * 2;
      return matchLength / (100 / this.store.g.minimumPlayTime);
    },
    maxNumberOfPlayers() {
      return (this.store.g.periodLength * 2 * this.store.g.teamSize) / this.minimumNumberOfMinutes;
    },
  },
})
</script>
