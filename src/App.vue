<template>
  <v-app>
    <v-container>
      <v-row no-gutters offset-xs="0" offset-md="1" >
        <v-col >
          <main-menu />
          <v-content>
            <router-view ref="view"></router-view>
          </v-content>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import MainMenu from './components/MainMenu'

export default {
  name: 'App',

  components: {
    'main-menu': MainMenu
  },

  data: () => ({
    //
  })
}
</script>

<style>
#app {
  color: #040404;
}
</style>
