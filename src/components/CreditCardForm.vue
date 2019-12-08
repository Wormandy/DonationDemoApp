<template>
<v-container fluid>
  <ValidationObserver ref="form" v-slot="{ invalid, errors, validate }">
    <v-form @submit.prevent="onSaveCreditCard" v-if="card">
      <v-row v-if="error" justify="space-around">
        <v-col colls="12" md="6">
          <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
        </v-col>
      </v-row>
      <v-row v-if="message" justify="space-around">
        <v-col colls="12" md="6">
          <app-alert @dismissed="onDismissed" :text="message" type="success"></app-alert>
        </v-col>
      </v-row>
      <v-row justify="center" dense>
        <v-col cols="12" md="8">
          <v-text-field-with-validator
            label="Name on Card"
            dense
            v-model="innerCard.name"
            rules="required"
            required></v-text-field-with-validator>
        </v-col>
      </v-row>
      <v-row justify="center" dense>
        <v-col cols="1" md="1">
          <v-icon color="primary" dark x-large>{{ cardType.icon }}</v-icon>
        </v-col>
        <v-col xs="11" md="7">
          <v-text-field-with-validator
            label="Card Number"
            dense
            :rules="cardNumberRules"
            v-mask="cardNumberMask"
            v-model="innerCard.number"></v-text-field-with-validator>
        </v-col>
      </v-row>
      <v-row justify="center" dense vid="month">
        <v-col xs="4" md="2">
          <v-select-with-validator
            label="Month"
            :items="months"
            dense
            v-model="innerCard.expiry_month"
            rules="required|creditCardExpire:@year"
            vid="month"></v-select-with-validator>
        </v-col>
        <v-col xs="4" md="2">
          <v-select-with-validator
            label="year"
            :items="years"
            item-text="full"
            item-value="abbr"
            dense
            v-model="innerCard.expiry_year"
            rules="required"
            vid="year"></v-select-with-validator>
        </v-col>
        <v-col xs="4" md="2" :hidden="cvvHidden">
          <v-text-field-with-validator
            label="CVV"
            dense
            v-model="innerCard.cvv"
            v-mask="cvvMask"
            :rules="(!cvvHidden) ? { required: true, min: 3 } : {}"
            ></v-text-field-with-validator>
        </v-col>
      </v-row>
      <v-row  justify="space-around" dense v-if="withButtons">
        <v-col cols="auto">
          <v-btn
            type="button"
            :disabled="deleteLoading || saveLoading"
            :loading="deleteLoading"
            class="accent info--text"
            @click.stop="deleteConfirmationPopup = true">
              Delete My Card
            <span slot="loader" class="custom-loader">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </span>
          </v-btn>
          <v-dialog
            v-model="deleteConfirmationPopup"
            max-width="500"
          >
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete your card</v-card-title>
              <v-card-text>
                Removing Credit Card from profile will lead to inablity to make recurring donations
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="deleteConfirmationPopup = false"
                >
                  Cancel
                </v-btn>

                <v-btn
                  color="green darken-1"
                  text
                  @click="deleteConfirmationPopup = false; onDeleteCreditCard()"
                >
                  Proceed
                </v-btn>
              </v-card-actions>
            </v-card>
    </v-dialog>
        </v-col>
        <v-col cols="auto">
          <v-btn
            :disabled="saveLoading || deleteLoading"
            :loading="saveLoading"
            class="accent info--text"
            @click.prevent="onSaveCreditCard()">
              Save My Card
            <span slot="loader" class="custom-loader">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </ValidationObserver>
</v-container>
</template>

<script>
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation'
import VSelectWithValidation from '@/components/inputs/VSelectWithValidation'
import { ValidationObserver } from 'vee-validate'
import { mask } from 'vue-the-mask'
import { messagable } from '@/components/alert/alertMixin'

export default {
  name: 'CreditCardForm',
  props:
  {
    card: {
      type: Object
    },
    withButtons: {
      type: Boolean,
      default: false
    }
  },
  mixins: [messagable],
  components: {
    ValidationObserver,
    'v-text-field-with-validator': VTextFieldWithValidation,
    'v-select-with-validator': VSelectWithValidation
  },
  data () {
    return {
      cardTypes: [
        { number: '3', icon: 'fab fa-cc-amex', name: 'American Express', abbr: 'AE' },
        { number: '4', icon: 'fab fa-cc-visa', name: 'Visa', abbr: 'VS' },
        { number: '5', icon: 'fab fa-cc-mastercard', name: 'Master Card', abbr: 'MC' },
        { number: '6', icon: 'fab fa-cc-discover', name: 'Discover', abbr: 'D' }
      ],
      innerCard: {
        name: '',
        number: '',
        expiry_month: '',
        expiry_year: '',
        cvv: null
      },
      cardNumberMask: 'XXXX XXXX XXXX XXXX',
      cardNumberRules: {
        required: true,
        creditCardNumber: true
      },
      cvvHidden: false,
      months: [...Array(12).keys()].map(x => ('0' + (x + 1)).slice(-2)),
      years: [...Array(10).keys()].map(x => ({
        full: '' + (new Date().getFullYear() + x),
        abbr: ('' + (new Date().getFullYear() + x)).slice(-2)
      })),
      deleteLoading: false,
      saveLoading: false,
      deleteConfirmationPopup: false
    }
  },
  directives: {
    mask
  },
  computed: {
    cardType () {
      if (undefined === this.user || undefined === this.user.number) {
        return { icon: 'fas fa-credit-card' }
      }
      return this.cardTypes.find((item) => item.number === this.card.number.charAt(0)) || { icon: 'fas fa-credit-card' }
    },
    cvvMask () {
      return this.cardType.abbr === 'AE' ? '####' : '###'
    }
  },
  watch: {
    card: function () {
      if (this.card.number) {
        this.cvvHidden = true
        this.cardNumberRules.creditCardNumber = false
        this.cardNumberRules.required = false
      }
      this.innerCard = Object.assign({}, this.card)
    },
    innerCard: {
      handler (newVal) {
        const isEqual = this.cardsAreEqual(newVal, this.card)
        this.cvvHidden = isEqual
        this.cardNumberRules.creditCardNumber = !isEqual || !newVal.number
        this.cardNumberRules.required = !isEqual || !newVal.number
      },
      deep: true
    }
  },
  methods: {
    onSaveCreditCard () {
      this.$refs.form.validate()
        .then((result) => {
          if (result) {
            this.saveLoading = true
            this.$emit('save', this.getCreditCard)
          }
        })
    },
    onDeleteCreditCard () {
      this.deleteLoading = true
      this.$emit('delete')
    },
    validate () {
      return this.$refs.form.validate()
    },
    isCardChanged () {
      return !this.cardsAreEqual(this.innerCard, this.card)
    },
    getCreditCard () {
      let card = Object.assign({}, this.innerCard)
      card.number = this.removeSpaces(card.number)
      return card
    },
    cardsAreEqual (card1, card2) {
      return card1.name === card2.name &&
        this.removeSpaces(card1.number) === this.removeSpaces(card2.number) &&
        card1.expiry_month === card2.expiry_month &&
        card1.expiry_year === card2.expiry_year
    },
    removeSpaces (str) {
      return str.replace(/\s/g, '')
    },
    stopLoading () {
      this.deleteLoading = false
      this.saveLoading = false
    }
  },
  mounted () {
    if (this.card.number) {
      this.innerCard = Object.assign({}, this.card)
    }
  }
}
</script>
