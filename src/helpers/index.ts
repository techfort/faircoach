import { v4 as uuidv4 } from 'uuid';

function clone<Type>(obj: Type) : Type {
  return JSON.parse(JSON.stringify(obj));
}

export type Interval = {
  start: number,
  end: number,
};

export type Player = {
  id: string,
  name: string,
  roles: Array<string>,
  intervals: Array<Interval>,
  isPlaying: boolean,
  playerNumber: number,
  currentInterval: Interval,
  totalPlayerTime: Duration,
};

export type Goal = {
  scorer: Player,
  at: Date,
};

export type Duration = {
  minutes: number,
  seconds: number,
};

export type Game = {
  id: string,
  isOngoing: boolean,
  teamSize: number,
  numberOfPeriods: number,
  periodLength: number,
  matchStart: Date,
  matchEnd: Date,
  goals: Array<Goal>,
  opponentScore: number,
  isHomeGame: boolean,
  players: Map<string, Player>,
  minimumPlayTime: number,
  breaks: Array<Interval>,
  finished: boolean,
};

export const calcDuration = (start: number, end: number) : Duration => {
  const secondsElapsed = Math.trunc((end - start) / 1000);
  const minutes = Math.floor(secondsElapsed / 60) % 60;
  const seconds = (secondsElapsed - (minutes * 60)) % 60;
  return {
    minutes,
    seconds,
  };
};

export const intervalDuration = ({ start, end }: Interval) : Duration => calcDuration(start, end);

export const newPlayer = (name: string, roles: Array<string>, playerNumber: number) : Player => ({
  id: uuidv4(),  
  name,
  roles,
  intervals: [],
  isPlaying: true,
  playerNumber,
  currentInterval: newInterval(),
  totalPlayerTime: { minutes: 0, seconds: 0 },
});

export const newInterval = () : Interval => {
  const start = (new Date()).getTime();
  return {
    start,
    end: start,
  };
};

const updateInterval = (interval : Interval) : Interval => ({ start: interval.start, end: (new Date()).getTime()});

export const updatePlayerInterval = (player: Player) : Player => {
  if (player.isPlaying) {
    player.currentInterval = updateInterval(player.currentInterval);
  }
  return player;
};

export const newGame = (teamSize: number, periodLength: number, isHomeGame: boolean, breakLength: number) : Game => ({
  id: uuidv4(),
  isOngoing: false,
  teamSize,
  periodLength,
  matchStart: new Date(),
  matchEnd: new Date(),
  goals: new Array<Goal>(),
  breaks: new Array<Interval>(),
  opponentScore: 0,
  isHomeGame,
  players: new Map<string, Player>(),
  minimumPlayTime: 50,
  numberOfPeriods: 2,
  finished: false,
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

export type FormattedDuration = {
  minutes: string,
  seconds: string,
};

const zeroPad = (n: number) : string => n < 10 ? `0${n}` : `${n}`;

export const formatDuration = (d: Duration): FormattedDuration => {
  return {
    minutes: zeroPad(d.minutes),
    seconds: zeroPad(d.seconds),
  };
};

export const playerTime = (player: Player) : Duration => calcDuration(0, [...player.intervals, player.currentInterval].reduce((prev, cur) => (prev + (cur.end - cur.start)), 0));

export const stopPlayer = (player: Player) : Player => {
  const p = pausePlayer(player);
  p.isPlaying = false;
  return p;
};

export const pausePlayer = (playerOut: Player) : Player => {
  const p = clone(playerOut);
  const t = (new Date()).getTime();
  p.currentInterval.end = t;
  p.intervals.push(clone(p.currentInterval));
  p.currentInterval = newInterval();
  // p.isPlaying = false;
  return p;
};

export const startGame = (game: Game): Game => { 
  game.isOngoing = true;
  const matchStart = new Date();
  game.matchStart = matchStart;
  for(const entry of game.players.entries()) {
    const p = entry[1];
    if (p.isPlaying) {
      p.currentInterval.start = matchStart.getTime();
      p.currentInterval.end = matchStart.getTime();
    }
  }
  return game;
};

export const pauseGame = (game: Game) : Game => {
  game.isOngoing = false;
  for (const [id, p] of game.players.entries()) {
    if (p.isPlaying) {
      game.players.set(id, pausePlayer(p));
    }
  }
  const t = new Date();
  game.breaks.unshift({ start: t.getTime(), end: t.getTime() });
  return game;
};

export const stopGame = (game: Game) : Game => {
  pauseGame(game);
  game.matchEnd = new Date();
  game.finished = true;
  return game;
};

export const updateGame = (game: Game) : Game => {
  for (const [id, player] of game.players.entries()) {
    const p = updatePlayerInterval(player);
    p.totalPlayerTime = playerTime(p);
    game.players.set(id, p);
  }
  return game;
};

export const resumeGame = (game: Game) : Game => {
  game.isOngoing = true;
  const t = new Date();
  game.breaks[0].end = t.getTime();
  for (const [id, p] of game.players.entries()) {
    game.players.set(id, playPlayer(p));
  }
  return game;
};

export const totalBreaksLength = (game: Game) : number => Math.trunc(game.breaks.reduce((prev, cur) => prev + (cur.end - cur.start), 0) / 1000);

export const homeGoal = (player: Player, game: Game) : Game => {
  const g = game;
  g.goals.push(newGoal(player));
  return g;
};

export const getScore = (game: Game) : string => `${game.goals.length} - ${game.opponentScore}`;