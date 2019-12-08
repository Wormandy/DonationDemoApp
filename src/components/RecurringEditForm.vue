<template>
<v-container fluid>
  <v-form v-model="valid">
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

    <donation-element
      v-for="field in chosenFields"
      v-bind:key="field.id"
      :field="field"
      :value="field.value"
      deletable
      @delete="removeDonation(field.id)"/>
    <v-row dense
      justify="center"
      :hidden="showAddForm"
      v-if="!adding">
        <v-col md="4" xs="4">
        <v-btn
          text
          color="primary"
          @click="adding = !adding">
          Add another category for donation
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      dense
      class="px-4"
      justify="start"
      :hidden="showAddForm"
      v-else>
      <v-col sm="3" xs="3" justify="end" class="ps-12">
        <v-select
          v-model="newCategory"
          :items="freeFields"
          item-value="id"
          item-text="title"
          reverse
          placeholder="Choose category"
        />
      </v-col>
      <v-col sm="5" xs="5" class="ms-2">
        <v-currency-field
          label="Amount"
          v-model="newAmount"
        />
      </v-col>
      <v-col sm="1" xs="1">
        <v-icon @click.native="addCategory" color="primary" v-if="addValid">fas fa-plus</v-icon>
        <v-icon color="gray" v-else>fas fa-plus</v-icon>
      </v-col>
    </v-row>
    <v-divider inset class="mt-5 mb-7" />
    <v-row justify="center" dense>
      <v-col xs="12" md="4">
        <v-select
          label="Period of recurring paymnets"
          :items="periods"
          item-value="type"
          item-text="title"
          v-model="innerRecurring.period"
        >
        </v-select>
      </v-col>
    </v-row>
    <v-row justify="center" dense>
      <v-col xs="12" md="4">
        <v-menu
          v-model="showCalendar"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              readonly
              label="Starting from"
              :value="formatedStartDate"
              v-on="on"
              append-outer-icon="far fa-calendar-alt"
              @click:append-outer="showCalendar = !showCalendar"
            >
            </v-text-field>
            </template>
          <v-date-picker
            v-model="innerRecurring.startDate"
            no-title
            @input="showCalendar = false; dateHasChanged = true"
            :min="minCalendar"></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row  justify="space-around" dense class="mt-5">
      <v-col xs="4" md="2">
        <v-btn
          type="button"
          @click.prevent="onDelete()"
          :disabled="saveLoading || deleteLoading"
          :loading="deleteLoading"
          class="accent info--text">
            Delete Recurring
          <span slot="loader" class="custom-loader">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </span>
        </v-btn>
      </v-col>
      <v-col xs="4" md="2">
        <v-btn
          type="submit"
          @click.prevent="onSave()"
          :disabled="saveLoading || deleteLoading"
          :loading="saveLoading"
          class="accent info--text">
            Save My Recurring
          <span slot="loader" class="custom-loader">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </span>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</v-container>
</template>

<script>
import DonationElement from '@/components/inputs/DonationElement'
import moment from 'moment'
import DonationApi from '@/api/DonationApi'
import { messagable } from '@/components/alert/alertMixin'

export default {
  name: 'editRecurringForm',
  components: {
    'donation-element': DonationElement
  },
  props: {
    recurring: {
      type: Object,
      required: true
    }
  },
  mixins: [messagable],
  data () {
    return {
      valid: true,
      newAmount: 0.00,
      newCategory: null,
      periods: [
        { type: '1week', title: 'Once a week', number: 1, period: 'weeks' },
        { type: '2weeks', title: 'Every 2 weeks', number: 2, period: 'weeks' },
        { type: '1month', title: 'Every month', number: 1, period: 'months' }
      ],
      showCalendar: false,
      deleteLoading: false,
      saveLoading: false,
      error: '',
      message: '',
      adding: false,
      donationFields: null,
      innerRecurring: null,
      dateHasChanged: false,
      minCalendar: moment().add(1, 'days').toISOString()
    }
  },
  computed: {
    chosenFields () {
      let ar = this.donationFields.filter(
        (item) => this.innerRecurring.categories.find((r) => r.id === item.id)
      )
      ar.forEach(
        function (item) {
          item.value = this.innerRecurring.categories.find((r) => r.id === item.id).value
        }, this
      )
      return ar
    },
    freeFields () {
      return this.donationFields.filter(
        (item) => undefined === this.innerRecurring.categories.find(
          (r) => r.id === item.id
        )
      )
    },
    addValid () {
      return this.newCategory > 0 && this.newAmount > 0
    },
    showAddForm () {
      return !(this.freeFields.length > 0)
    },
    formatedStartDate () {
      return this.innerRecurring.startDate ? moment(this.innerRecurring.startDate).format('ddd MMM Do, YYYY') : ''
    }
  },
  methods: {
    addCategory (event) {
      let category = { ...this.donationFields.find((item) => item.id === this.newCategory) }
      category.value = this.newAmount
      this.innerRecurring.categories.push(category)
      this.newAmount = 0
      this.newCategory = null
      this.adding = false
    },
    removeDonation (val) {
      this.innerRecurring.categories.splice(this.innerRecurring.categories.findIndex((el) => el.id === val), 1)
    },
    onDelete () {
      this.deleteLoading = true
      this.$emit('onDelete')
    },
    onSave () {
      this.saveLoading = true
      this.$emit('onSave', this.innerRecurring)
    },
    stopLoading () {
      this.deleteLoading = false
      this.saveLoading = false
    },
    updateInnerData () {
      this.innerRecurring = {
        categories: this.recurring.categories.map((item) => { return { ...item } }),
        startDate: this.recurring.startDate,
        period: this.recurring.period
      }
    }
  },
  watch: {
    'innerRecurring.period': function (val, oldVal) {
      console.log(this.recurring.startDate)
      if (val && !this.dateHasChanged && !this.recurring.startDate) {
        let period = this.periods.find((item) => item.type === val)
        this.innerRecurring.startDate = moment().add(period.number, period.period).format('YYYY-MM-DD')
      }
    }
  },
  created () {
    this.donationFields = DonationApi.getDonationFields().map(item => ({ ...item }))
    this.updateInnerData()
  }
}
</script>

<style scoped>

</style>
