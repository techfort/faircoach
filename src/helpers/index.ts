import { v4 as uuidv4 } from 'uuid';

function clone<Type>(obj: Type) : Type {
  return JSON.parse(JSON.stringify(obj));
}

export type Interval = {
  start: Date,
  end: Date | null,
};

export type Player = {
  id: string,
  name: string,
  roles: Array<string>,
  intervals: Array<Interval>,
  isPlaying: boolean,
  playerNumber: number,
  currentInterval: Interval,
};

export type Goal = {
  scorer: Player,
  at: Date,
};

export type Game = {
  isOngoing: boolean,
  teamSize: number,
  periodLength: number,
  matchStart: Date,
  goals: Array<Goal>,
  opponentScore: number,
  isHomeGame: boolean,
  players: Map<string, Player>,
  minimumPlayTime: number,
  breakLength: number,
};

export const newPlayer = (name: string, roles: Array<string>, playerNumber: number) : Player => ({
  id: uuidv4(),  
  name,
  roles,
  intervals: [],
  isPlaying: false,
  playerNumber,
  currentInterval: newInterval(),
});

export const newInterval = () : Interval => ({
  start: new Date(),
  end: null,
});

export const newGame = (teamSize: number, periodLength: number, isHomeGame: boolean, breakLength: number) : Game => ({
  isOngoing: false,
  teamSize,
  periodLength,
  matchStart: new Date(),
  goals: new Array<Goal>(),
  opponentScore: 0,
  isHomeGame,
  players: new Map<string, Player>(),
  minimumPlayTime: 50,
  breakLength,
});

export const newGoal = (player: Player) : Goal => ({
  at: new Date(),
  scorer: player,
});

export const playPlayer = (player: Player) : Player => {
  const p = clone(player);
  p.currentInterval= newInterval();
  p.isPlaying = true;
  return p;
};

export const stopPlayer = (playerOut: Player) : Player => {
  const p = clone(playerOut);
  const t = new Date();
  p.currentInterval.end = t;
  p.intervals.push(clone(p.currentInterval));
  p.currentInterval = newInterval();
  return p;
};

export const startGame = (game: Game): Game => { 
  const g = game;
  g.isOngoing = true;
  const matchStart = new Date();
  g.matchStart = matchStart;
  for(const entry of Object.entries(g.players)) {
    const p = entry[1];
    if (p.isPlaying) {
      p.currentInterval = newInterval();
    }
  }
  return g;
};

export const pauseGame = (game: Game) : Game => {
  const g = game;
  g.isOngoing = false;
  for (const entry of Object.entries(g.players)) {
    const p = entry[1];
    if (p.isPlaying) {
      const q = stopPlayer(p);
      g.players.set(entry[0], q);
    }
  }
  return g;
};

export const homeGoal = (player: Player, game: Game) : Game => {
  const g = game;
  g.goals.push(newGoal(player));
  return g;
};

export const getScore = (game: Game) : string => `${game.goals.length} - ${game.opponentScore}`;