<template>
  <v-card flat>
    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onSubmit)" v-model="valid" ref="registerForm">
      <v-row v-if="error">
        <v-col>
          <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field-with-validator
          v-model="email"
          rules="required|email"
          label="Email"
          dense
          type="email" vid="email"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-password-with-strength
          dense
          rules="required|min:6"
          label="Password"
          v-model="password" vid="password"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field-with-validator
          v-model="confirmPassword"
          rules="required|confirmed:password"
          dense
          label="Confirm Password"
          :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showConfirmPassword = !showConfirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"/>
        </v-col>
      </v-row>
      <v-row justify="space-around">
        <v-col cols="auto">
          <v-btn @click.prevent="$emit('cancel')" color="secondary">
            Cancel
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn type="submit" :disabled="loading" :loading="loading" color="secondary">
            Submit
            <span slot="loader" class="custom-loader">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    </ValidationObserver>
  </v-card>
</template>

<script>
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation'
import VPasswordWithStrengthMeter from '@/components/inputs/VPasswordWithStrengthMeter'
import { ValidationObserver } from 'vee-validate'
import { mapActions } from 'vuex'

export default {
  components: {
    ValidationObserver,
    'v-text-field-with-validator': VTextFieldWithValidation,
    'v-password-with-strength': VPasswordWithStrengthMeter
  },
  data () {
    return {
      showConfirmPassword: false,
      password: '',
      confirmPassword: '',
      email: '',
      rules: {
        required: value => !!value || 'Required.',
        passwordLength: value => value.length > 6 || 'Min 6 characters',
        passwordMatch: value => (value === this.password) || 'Password not match'
      },
      loading: false,
      error: '',
      valid: true
    }
  },
  methods: {
    ...mapActions('user', ['createUser']),
    async onSubmit () {
      if (!this.$refs.registerForm.validate()) {
        return
      }
      this.loading = true
      try {
        await this.createUser({ email: this.email, password: this.password })
        this.$emit('registered')
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
