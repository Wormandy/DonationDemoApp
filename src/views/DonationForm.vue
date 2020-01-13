<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="8" xs="12">
        <h3 class="display-2 font-weight-light mb-8">Donations</h3>
        <div>
          <p>
            This application is a part of another project and published for the Demo purposes only.<br />
            The sources to this app available for review there: <a href="http://bit.ly/2TmskQu">http://bit.ly/2TmskQu</a>
          </p>
          <p>
            All connections to the Server API are mocked with JS Objects. <br />
            <b>Thus all the users data are alive within browser session only.</b>
          </p>
          <p>
            Hardcoded login: <b>test@test.com</b><br />password: <b>test</b>
          </p>
        </div>
        <v-card class="elevation-0">
          <v-stepper v-model="currentStep">
            <v-card-title class="tooltip py-2">
              <p class="col-12 my-0 pa-0 subtitle-1 font-weight-medium">
                Donations
              </p>
              <p class="body-2 ma-0 pa-0">
                <i class="fa fa-lock"></i> This page is secured with 256-bit
                encryption.
              </p>
            </v-card-title>
            <v-divider />
            <v-card-subtitle class="info py-0">
              <v-stepper-header class="elevation-0 py-5" style="height: auto;">
                  <div class="align-middle title font-weight-light">{{ currentStepObject.title }}</div>
                <v-spacer />
                <template v-for="step in stepsDisplay" justify="right">
                  <v-stepper-step
                    :key="step.step"
                    :complete="currentStep > step.step"
                    :step="step.step"
                    class="pa-0"
                    large
                  >
                  </v-stepper-step>
                </template>
              </v-stepper-header>
            </v-card-subtitle>
            <v-card-text class="info" id="formCard">
              <v-divider />
              <v-row v-if="error.length">
                <v-col>
                  <app-alert @dismissed="onErrorDismissed()" :text="error"></app-alert>
                </v-col>
              </v-row>
              <v-stepper-items>
                <v-stepper-content
                  v-for="step in stepsDisplay"
                  :key="step.step"
                  :step="step.step"
                  class="pa-0"
                >
                  <component
                    v-bind:is="step.component"
                    v-bind="step.properties"
                    @dispatcher="dispatchEvents"
                    :ref="step.ref"
                  />
                </v-stepper-content>
              </v-stepper-items>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="tooltip py-3" justify="end">
              <v-btn
                @click="previousStep"
                color="secondary"
                large
                class="px-10"
                depressed
                outlined
                v-if="currentStepObject.backButton"
              >
                {{ currentStepObject.backButton }}
              </v-btn>
              <v-spacer />
              <v-btn
                @click.stop="nextStep"
                color="secondary"
                large
                class="px-10"
                depressed
                v-if="currentStepObject.nextButton"
                :disabled="buttonLoading"
                :loading="buttonLoading">
                {{ currentStepObject.nextButton }}
                  <span slot="loader" class="custom-loader">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </span>
              </v-btn>
            </v-card-actions>
          </v-stepper>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" xs="12">
        <donation-receipt style="position: fixed; width: 360px;" :donation="donation"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DonationApi from '@/api/DonationApi'
import CategoriesForm from '@/components/donationSteps/CategoriesForm'
import ProfileEditForm from '@/components/user/ProfileEditForm'
import BillingStep from '@/components/donationSteps/BillingStep.vue'
import LoginStep from '@/components/donationSteps/LoginStep'
import ThankYouStep from '@/components/donationSteps/ThankYouStep'
import DonationReceipt from '@/components/DonationReceipt'

export default {
  name: 'DonationForm',
  components: {
    'donation-receipt': DonationReceipt
  },
  data: function () {
    return {
      currentStep: 1,
      cvv: null,
      guest: false,
      donationFields: [],
      error: '',
      buttonLoading: false
    }
  },
  computed: {
    ...mapGetters('user', [
      'user',
      'editableFields',
      'userCard',
      'isUserLogged',
      'isNewUser',
      'isGuest'
    ]),
    steps () {
      return [
        {
          step: 1,
          component: CategoriesForm,
          properties: { donationFields: this.donationFields },
          backButton: false,
          nextButton: 'Continue',
          onNext: this.onAddDonation,
          ref: 'categoriesForm',
          title: 'Indicate destinations and amounts',
          show: true
        },
        {
          step: 2,
          component: LoginStep,
          properties: { },
          nextButton: 'Back',
          backButton: false,
          onNext: this.saveStep,
          title: 'Already registered or is your first time',
          ref: 'loginForm',
          events: [
            { name: 'createAccount', action: 'createAccount' },
            { name: 'createGuest', action: 'continueAsGuest' }
          ],
          show: !this.isUserLogged
        },
        {
          step: 3,
          component: ProfileEditForm,
          properties: { user: this.user, wide: true, newUser: this.isNewUser || this.isGuest },
          backButton: 'Back',
          nextButton: 'Continue',
          onNext: this.onUpdateProfile,
          ref: 'profileForm',
          title: 'Personal information',
          show: true
        },
        {
          step: 4,
          component: BillingStep,
          properties: { billingProfile: this.user.beanstream_profile },
          backButton: 'Back',
          nextButton: 'Donate',
          onNext: this.onUpdateBilling,
          ref: 'billingForm',
          title: 'Choose a payment method',
          show: true
        },
        {
          step: 5,
          component: ThankYouStep,
          properties: { donation: this.donation, isGuest: this.isGuest },
          backButton: false,
          nextButton: false,
          onNext: this.saveStep,
          ref: 'thankYouStep',
          title: 'Thank you',
          events: [
            { name: 'createRecurring', action: 'createRecurring' },
            { name: 'finish', action: 'finish' }
          ],
          show: true
        }
      ]
    },
    stepsDisplay () {
      var currentSteps = this.steps.filter(el => el.show)
      currentSteps.forEach(function (val, key) { val.step = key + 1 })
      return currentSteps
    },
    currentStepObject () {
      return this.stepsDisplay.find(item => item.step === this.currentStep)
    },
    donation () {
      return this.donationFields.filter(item => item.value > 0)
    },
    donationTotal () {
      return this.donation.reduce((sum, item1) => sum + item1.value, 0) || 0
    }
  },
  methods: {
    ...mapActions('donation', ['createDonation', 'resetDonation', 'makeDonation', 'makeRecurringFromDonation']),
    ...mapActions('user', ['createUser', 'createGuest', 'updateUser', 'updateBilling', 'save']),
    nextStep () {
      this.resetError()
      const vm = this
      this.buttonLoading = true
      this.currentStepObject.onNext()
        .then(function () {
          if (vm.currentStep < vm.steps.length) {
            vm.currentStep++
          }
        })
        .catch(function (error) {
          vm.setError(error)
        })
        .finally(() => {
          vm.buttonLoading = false
        })
    },
    setError (error) {
      this.error = error.message
      this.$vuetify.goTo('#formCard')
    },
    resetError () {
      this.error = ''
    },
    onAddDonation () {
      const vm = this
      return new Promise(function (resolve, reject) {
        if (vm.categoriesFormValid()) {
          vm.createDonation(vm.donation)
          resolve()
        } else {
          reject(new Error('Donation cannot be empty'))
        }
      })
    },
    onUpdateProfile () {
      const vm = this
      return vm.$refs.profileForm[0].validate()
        .then(result => {
          return new Promise((resolve, reject) => {
            if (result) {
              vm.updateUser(vm.$refs.profileForm[0].innerUser)
              resolve()
            } else {
              reject(new Error('Profile data is incorrect'))
            }
          })
        })
    },
    onUpdateBilling () {
      const vm = this
      return vm.$refs.billingForm[0].validate()
        .then(result => {
          return new Promise((resolve, reject) => {
            if (result) {
              vm.updateBilling(vm.$refs.billingForm[0].getBilling())
              this.save()
                .then(result => {
                  return this.makeDonation()
                })
                .then(result => {
                  resolve()
                })
                .catch(error => {
                  reject(error)
                })
            } else {
              reject(new Error('Credit card data is incorrect'))
            }
          })
        })
    },
    categoriesFormValid () {
      return this.donationTotal > 0
    },
    previousStep () {
      this.resetError()
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    dispatchEvents (event, eventName) {
      if (this.currentStepObject.events) {
        const callback = this.currentStepObject.events.find(item => item.name === eventName).action
        if (callback) {
          this[callback]()
        }
      }
    },
    saveStep () {
      return new Promise((resolve, reject) => resolve())
    },
    createAccount () {
      this.createUser()
      this.nextStep()
    },
    continueAsGuest () {
      this.createGuest()
      this.nextStep()
    },
    finish () {
      this.resetDonation()
      this.reset()
    },
    createRecurring () {
      this.makeRecurringFromDonation()
      this.resetDonation()
      this.reset()
      this.$router.push({ name: 'EditRecurring' })
    },
    onErrorDismissed () {
      this.error = ''
    },
    reset () {
      this.currentStep = 1
      this.cvv = null
      this.guest = false
      this.donationFields = DonationApi.getDonationFields().map(item => ({ ...item }))
      this.resetDonation()
    }
  },
  created () {
    this.reset()
  },
  beforeRouteLeave (to, from, next) {
    this.reset()
    next()
  },
  beforeRouteUpdate (to, from, next) {
    this.reset()
    next()
  }
}
</script>
