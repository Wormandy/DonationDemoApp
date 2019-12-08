<template>
  <v-toolbar flat short dense>
     <v-toolbar-title>
       <v-btn
        text
        @click.stop="dispatchRoute('Donate')"
        class="primary--text">
        Donations
      </v-btn>
      </v-toolbar-title>
     <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn
          outlined
          v-for='item in menuItems'
          :key='item.title'
          @click.stop="dispatchRoute(item.link)" class="primary--text">
          {{ item.title }}
        </v-btn>
      <v-btn
          outlined
          v-if='isUserLogged'
          @click='onLogout'  class="primary white--text">
          SIGN OUT
        </v-btn>
      <v-btn
          outlined
          v-else
          :to="{ name: 'Login' }" class="primary white--text">
          SIGN IN
        </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'mainMenu',
  computed: {
    ...mapGetters('user', ['user', 'isUserLogged']),
    menuItems () {
      let menuItems = [
        { id: '1', title: 'Donate as Guest', link: 'Donate' }
      ]
      if (this.userIsAuthenticated) {
        menuItems = [
          { id: '1', title: 'Make Donation', link: 'Donate' },
          { id: '3', title: 'View Profile', link: 'ViewProfile' }
        ]
      }
      return menuItems
    },
    userIsAuthenticated () {
      return this.isUserLogged
    }
  },
  methods: {
    ...mapActions('user', ['logout']),
    onLogout () {
      this.logout()
      this.dispatchRoute('Donate')
    },
    dispatchRoute (link) {
      this.$router.push({ name: link, params: { reset: true } })
        .catch(err => {
          if (err) {
            this.$parent.$parent.$refs.view.reset()
          }
        })
    }
  }
}
</script>
