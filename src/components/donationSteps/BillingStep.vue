<template>
<v-container>
  <v-row>
    <v-col>
      <credit-card-form :card="innerBilling.card" :cvv="cvv" ref="creditCardForm"/>
    </v-col>
  </v-row>
  <v-divider />
  <v-row>
    <v-col>
      <!-- <profile-edit-form :user="billingProfile" wide /> -->
    </v-col>
  </v-row>
</v-container>
</template>

<script>
// import ProfileEditForm from '@/components/user/ProfileEditForm'
import CreditCardForm from '@/components/CreditCardForm'

export default {
  props: {
    billingProfile: {
      type: Object
    },
    cvv: null
  },
  data () {
    return {
      innerBilling: {
        profile: {},
        card: {}
      }
    }
  },
  components: {
    // 'profile-edit-form': ProfileEditForm,
    'credit-card-form': CreditCardForm
  },
  methods: {
    validate () {
      return this.$refs.creditCardForm.validate()
    },
    getBilling () {
      console.log(this.$refs.creditCardForm.isCardChanged())
      if (this.$refs.creditCardForm.isCardChanged()) {
        this.innerBilling.card = this.$refs.creditCardForm.getCreditCard()
        console.log(this.innerBilling.card)
      }
      return this.innerBilling
    }
  },
  mounted () {
    this.innerBilling.profile = Object.assign({}, this.billingProfile.profile)
    this.innerBilling.card = Object.assign({}, this.billingProfile.card)
  }
}
</script>
