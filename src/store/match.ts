import { defineStore } from 'pinia';
import { newGame, Game, Player } from '@/helpers/index';

export const useMatchStore =  defineStore('match', {
  state: () => {
    return { 
      game: newGame(3, 3, true, 1),
    };
  },
  getters: {
    g() : Game {
      return this.game;
    },
    players() : Map<string, Player> {
      return this.game.players;
    },
  },
  actions: {
    setGame(game: Game) {
      this.game = game;
    },
    addPlayer(player: Player) {
      this.game.players.set(player.id, player);
    },
    removePlayer(player: Player) {
      this.game.players.delete(player.id);
    },
  },
});