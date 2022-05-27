import { defineStore } from 'pinia';
import { Player } from '@/helpers/index';

export const useHistoryStore =  defineStore('history', {
  state: () => {
    return { 
      playerslist: JSON.parse(localStorage.getItem(`fc1-historicplayers`)||'[]'),
    };
  },
  getters: {
    playersh() : ArrayLike<Player> {
      return this.playerslist;
    },
  },
  actions: {
    addPlayer(player: Player) {
      // see if this player is in the list already 
      if (!this.playerslist.find((x: Player)=>x.name==player.name)) {
        this.playerslist.push(player)
        // see if this player is in localstorage already. add if not
        localStorage.setItem(`fc1-historicplayers`, JSON.stringify(this.playerslist));
      } 
    },
  },
});