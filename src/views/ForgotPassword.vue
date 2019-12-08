<template>
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card v-if="! forgotPasswordStatus">
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSend">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="email"
                      label="Your email"
                      id="email"
                      v-model="email"
                      type="email"
                      :disabled="loading"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn type="submit" :disabled="loading" :loading="loading">
                      Send
                       <span slot="loader" class="custom-loader">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                       </span>
                    </v-btn>
                    <router-link :to="{ name: 'Login'}">Back to Sign In form</router-link>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
        <v-card v-if="forgotPasswordStatus">
          <div>
            We've sent you an email with instructions how to retrieve your password.
            If you don't receive the email <a @click="clearForgotPassword">Try again</a>
            <v-divider />
            <router-link :to="{ name: 'Login'}">Back to Sign In form</router-link>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      email: '',
      error: null,
      loading: false,
      forgotPasswordStatus: false
    }
  },
  computed: {},
  watch: {
  },
  methods: {
    ...mapActions('user', ['sendForgotPassword']),
    async onSend () {
      try {
        this.forgotPasswordStatus = await this.sendForgotPassword(this.email)
      } catch (error) {
        this.error = error
      }
    },
    onDismissed () {
      this.error = null
    },
    clearForgotPassword () {
      this.forgotPasswordStatus = false
    }
  },
  beforeDestroy () {
    this.clearForgotPassword()
  }
}
</script>
