<template>
  <div class="md:grid">
    <nav>
      <router-link to="/">Match-SETUP</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
html {
  font-family: 'Space Mono';
}
#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
