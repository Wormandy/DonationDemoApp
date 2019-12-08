<template>
<v-card flat>
  <form @submit.prevent="onSignin">
    <v-row v-if="title">
      <v-col>
        <div class="display-1"> {{ title }}</div>
        <div>{{ subtitle }}</div>
      </v-col>
    </v-row>
    <v-row v-if="error">
      <v-col>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="py-0">
        <v-text-field
          name="email"
          label="Mail"
          id="email"
          v-model="email"
          type="email"
          :disabled="loading"
          :dense="dense"
          required></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-text-field
          name="password"
          label="Password"
          id="password"
          v-model="password"
          type="password"
          :disabled="loading"
          :dense="dense"
          required></v-text-field>
      </v-col>
    </v-row>
    <v-row align="center" class="py-0">
      <v-col cols="6">
        <v-btn type="submit" :disabled="loading" :loading="loading" color="secondary">
          Sign in
            <span slot="loader" class="custom-loader">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </span>
        </v-btn>
      </v-col>
      <v-col cols="6">
        <div class="text-right">
          <router-link :to="{ name: 'ForgotPassword'}">Forgot password?</router-link>
        </div>
      </v-col>
    </v-row>
  </form>
</v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    dense: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      required: false
    },
    subtitle: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      email: '',
      password: '',
      loading: false,
      error: null
    }
  },
  methods: {
    ...mapActions('user', ['signUserIn']),
    async onSignin () {
      this.loading = true
      try {
        await this.signUserIn({ email: this.email, password: this.password })
        this.$emit('loggedIn')
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    onDismissed () {
      this.error = false
    }
  }
}
</script>
