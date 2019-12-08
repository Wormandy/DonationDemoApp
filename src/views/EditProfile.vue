<template>
  <v-container fluid>
    <v-card xs="12" md="8">
      <v-card-title class="d-flex justify-center" cols="12" md="8" outlined>
        Personal Information
      </v-card-title>
      <v-card-text>
        <profile-edit-form
        :user="user"
        withButtons
        @save="onSaveProfile"
        ref="profileForm" />
      </v-card-text>
    </v-card>
    <v-card class="mt-2" cols="12" md="8" outlined>
      <v-card-title class="justify-center">
        Credit Card Information
      </v-card-title>
      <v-card-text class="mt-5">
        <credit-card-form
        :card="userCard"
        :cvv="cvv"
        withButtons
        @save="onSaveCreditCard"
        @delete="onDeleteCreditCard"
        ref="creditCardForm" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ProfileEditForm from '@/components/user/ProfileEditForm'
import CreditCardForm from '@/components/CreditCardForm'

export default {
  data () {
    return {
      cvv: null
    }
  },
  components: {
    'profile-edit-form': ProfileEditForm,
    'credit-card-form': CreditCardForm
  },
  computed: {
    ...mapGetters('user', [
      'user',
      'editableFields',
      'userCard'
    ])
  },
  methods: {
    ...mapActions('user', {
      updateUser: 'updateUser',
      saveUser: 'save',
      updateBillingCard: 'updateUserBillingCard',
      detachCard: 'detachCard'
    }),
    onSaveProfile (user) {
      this.updateUser(user)
      this.saveUser(user)
        .then(() => this.$refs.profileForm.setMessage('Profile has been saved'))
        .catch((error) => this.$refs.profileForm.setError(error))
        .finally(() => this.$refs.profileForm.stopLoading())
    },
    onSaveCreditCard (card) {
      this.updateBillingCard(card)
      this.saveUser()
        .then(() => this.$refs.creditCardForm.setMessage('Credit Card data has been saved'))
        .catch((error) => this.$refs.creditCardForm.setError(error))
        .finally(() => this.$refs.creditCardForm.stopLoading())
    },
    onDeleteCreditCard () {
      this.detachCard()
        .then(() => this.$refs.creditCardForm.setMessage('Card has been removed from your profile'))
        .catch((error) => this.$refs.creditCardForm.setError(error))
        .finally(() => this.$refs.creditCardForm.stopLoading())
    }
  }
}
</script>
