<template>
  <div class="p-0 m-0">
    <nav class="p-9 flex">
      <router-link to="/">New Match</router-link> 
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

input {
  @apply shadow appearance-none border rounded py-2 focus:outline-none leading-tight text-lg;

  .form-check-input {
    &:checked {
      @apply bg-green-400;
    }
  }
}

button {
  @apply shadow appearance-none border rounded py-2 w-full focus:outline-none leading-tight uppercase border-0 border-lime-800 rounded-md bg-yellow-600 shadow-md px-3 text-lg text-white;
}

.form-check {
  input {
    @apply form-check-input appearance-none w-9 -ml-10 rounded-full h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-400 focus:outline-none cursor-pointer shadow-sm;
  }
  label {
    @apply form-check-label inline-block m-1;
  }
}

</style>
