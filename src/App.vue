<template>
  <div class="p-0 m-0">
    <nav class="p-9 flex">
      <router-link to="/">Match-SETUP</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,700;1,400&display=swap');
html {
  font-family: 'Fira Sans';
}
#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  background: linear-gradient(
    to bottom,
    #5d9634,
    #5d9634 50%,
    #538c2b 50%,
    #538c2b
  );
  background-size: 100% 100px;
}
</style>
