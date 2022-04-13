<template>
    <div>
      <div>
        <div>
          <label for="teamSize">Team Size<br />
            <input type="number" name="teamSize" v-model="game.teamSize" />
          </label>
        </div>
        <div>
          <label for="matchlength">Game Period in Minutes<br />
            <input type="number" name="matchlength" v-model="game.periodLength" />
          </label>
        </div>
        <div>
          <label for="minimumPlayTime">Min PlayTime %<br />
            <input type="number" range="0,100" name="minimumPlayTime" v-model="game.minimumPlayTime" />
          </label>
        </div>
        <p>{{ game.teamSize }}-aside {{ game.periodLength }}-min halves</p>
        <p>min number of minutes {{ minimumNumberOfMinutes }}</p>
        <p>Max number of players {{ maxNumberOfPlayers }}</p>
      </div>
      <div>
        <h2>Ps</h2>
        <div>
          <label for="name">Name
            <input type="text" name="name" v-model="newplayer.name" />
          </label>
        </div>
        <div>
          <label for="number">Number
            <input type="text" name="number" v-model="newplayer.number" />
          </label>
        </div>
        <div>
          <label for="role">Role
            <input type="text" name="role" v-model="newplayer.role" />
          </label>
        </div>
        <p><button @click="addPlayer()" class="border-0">add player</button></p>
      </div>
      <div v-if="game.players.size >= game.teamSize"><button @click="startMatch()">start match</button></div>
      <div>
        <div v-for="[id, player] in store.players" :key="player.id">
          <span :id="id">{{ player.roles }} {{ player.name }} {{ player.playerNumber }} </span>
        </div>
      </div> 
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { newPlayer } from '@/helpers';
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
