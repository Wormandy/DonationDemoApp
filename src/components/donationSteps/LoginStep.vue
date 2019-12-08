<template>
  <v-row v-if="createUser" class="justify-center">
    <v-col cols="12" md="8">
      <register-form
      @cancel="createUser=false"
      @registered="$emit('dispatcher', $event, 'createAccount'); createUser=false"/>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col cols="12" xs="12" md="6">
      <login-form
        dense
        title="Already registered"
        subtitle="Sign in below to continue"
      />
    </v-col>
    <v-col cols="12" xs="12" md="6">
      <v-card flat>
        <v-row>
          <v-col>
            <div class="display-1">First time?</div>
            <p>You can create a free account that will save your billing information for the future transactions, or you can continue as a guest.</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <!-- <v-btn block small color="secondary" depressed @click="$emit('dispatcher', $event, 'createAccount')">Create account</v-btn> -->
            <v-btn block small color="secondary" depressed @click="createUser=true">Create account</v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn  block small color="secondary" depressed @click="$emit('dispatcher', $event, 'createGuest')">Continue as a guest</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import LoginForm from '@/components/user/LoginForm'
import RegisterForm from '@/components/user/RegisterForm'

export default {
  data () {
    return {
      createUser: false
    }
  },
  components: {
    'login-form': LoginForm,
    'register-form': RegisterForm
  }
}
</script>
