<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <login-form />
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginForm from '@/components/user/LoginForm'

export default {
  data () {
    return {
      email: '',
      password: '',
      loading: false,
      error: null
    }
  },
  components: {
    'login-form': LoginForm
  },
  computed: {
    ...mapGetters('user', ['user', 'isUserLogged'])
  },
  created: function () {
    this.getOutIfLoggedIn(this.user)
  },
  watch: {
    user: function (value) {
      this.getOutIfLoggedIn(value)
    }
  },
  methods: {
    getOutIfLoggedIn (user) {
      if (this.isUserLogged) {
        this.$router.push({ name: 'ViewProfile' })
      }
    }
  }
}
</script>
