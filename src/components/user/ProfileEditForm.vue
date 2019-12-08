<template>
<v-container fluid>
<ValidationObserver v-slot="{ handleSubmit, valid, invalid, errors, validate }" ref="form">
  <v-form>
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
      <v-col cols="12" :md="width">
        <v-text-field-with-validator
          label="First Name"
          dense
          v-model="innerUser.first_name"
          rules="required"
          ></v-text-field-with-validator>
      </v-col>
      <v-col cols="12" :md="width">
        <v-text-field-with-validator
          label="Last Name"
          dense
          v-model="innerUser.last_name"
          rules="required"></v-text-field-with-validator>
      </v-col>
      <v-col v-if="newUser">
        <v-dialog v-model="dialog" width="600" persistent>
          <template v-slot:activator="{ on }">
            <v-checkbox v-model="innerUser.is_company" label="Give as a company" @change="if (innerUser.is_company) { dialog = true }"  dense hide-details/>
          </template>
          <v-card>
            <v-card-title primary-title>Company Giving - Please Note</v-card-title>
            <v-divider />
            <v-card-text>
              <p class="pt-5">By entering a company name here you are making a declaration that the donation is being made by a company. Once the donation has been made, this selection cannot be changed. We recommend that you speak to your accountant before making a donation from a company to ensure that this is the best tax treatment for you. We have found that making donations from Unincorporated businesses can cause issues with CRA and suggest that if your business is Unincorporated, you make your donation as an individual. Again, we recommend that you check with your accountant before proceeding.</p>
              <p>When giving under a company name the first and last names entered will be used for contact purposes only.</p>
              <p>Once this donor profile is created to give as a company, this selection cannot be undone.</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false;">
                I understand
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="12" :md="width">
        <v-text-field
          label="Company"
          dense
          v-model="innerUser.company"
          :filled="companyEditable"
          :disabled="!companyEditable"></v-text-field>
      </v-col>
      <v-col cols="12" :md="width">
        <v-text-field-with-validator
          label="Email"
          dense
          v-model="innerUser.email"
          type="email"
          :filled="innerUser.id > 0"
          rules="required|email"
          :disabled="innerUser.id > 0"></v-text-field-with-validator>
      </v-col>
      <v-col cols="12" :md="width">
        <v-text-field-with-validator
          label="Phone"
          dense
          v-mask="countrParam.phoneMask"
          rules="required|min:7"
          v-model="innerUser.phone1"></v-text-field-with-validator>
      </v-col>
      <v-col cols="12" :md="width">
        <v-text-field-with-validator
          label="Street 1"
          dense
          rules="required"
          v-model="innerUser.street1"></v-text-field-with-validator>
      </v-col>
      <v-col cols="12" :md="width">
        <v-text-field
          label="Street 2"
          dense
          v-model="innerUser.street2"></v-text-field>
      </v-col>
      <v-col cols="12" :md="width">
        <v-text-field-with-validator
          label="City"
          dense
          rules="required"
          v-model="innerUser.city"></v-text-field-with-validator>
      </v-col>
      <v-col
        cols="12" :md="width"
        :hidden="!statesByCountry">
        <v-autocomplete-with-validator
          :label="countrParam.stateLabel"
          dense
          :items="statesByCountry"
          item-text="name"
          item-value="abbr"
          v-model="innerUser.province">
        </v-autocomplete-with-validator>
      </v-col>
      <v-col
        cols="12" :md="width"
        :hidden="statesByCountry">
        <v-text-field
          label="Province other"
          dense
          v-model="innerUser.province_other"></v-text-field>
        </v-col>
      <v-col cols="12" :md="width">
        <v-text-field-with-validator
          label="Postal code"
          dense
          v-mask="countrParam.zipMask"
          rules="required"
          v-model="innerUser.zipcode"></v-text-field-with-validator>
      </v-col>
      <v-col cols="12" :md="width">
        <v-autocomplete-with-validator
          :items="countriesList"
          label="Country"
          dense
          rules="required"
          v-model="innerUser.country">
        </v-autocomplete-with-validator>
      </v-col>
      <v-col cols="12" :md="width">
        <v-select-with-validator
          :items="homeLocations"
          label="Home Location"
          dense
          rules="required"
          v-model="innerUser.home_location">
        </v-select-with-validator>
      </v-col>
      <v-col
        xs="12" :md="width"
        class="d-flex justify-end align-end"
        v-if="withButtons">
        <v-btn
          :disabled="!valid"
          :loading="loading"
          class="accent info--text"
          @click.prevent="onSave">
            Save My Info
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
import { countriesList, statesList, homeLocations } from '@/api/Countries'
import { mask } from 'vue-the-mask'
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation'
import VSelectWithValidation from '@/components/inputs/VSelectWithValidation'
import VAutocompleteWithValidation from '@/components/inputs/VAutocompleteWithValidation'
import { ValidationObserver } from 'vee-validate'
import { messagable } from '@/components/alert/alertMixin'

export default {
  name: 'profileEditForm',
  props: {
    user: {
      type: Object
    },
    newUser: {
      type: Boolean,
      default: false
    },
    wide: {
      type: Boolean,
      default: false
    },
    withButtons: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ValidationObserver,
    'v-text-field-with-validator': VTextFieldWithValidation,
    'v-select-with-validator': VSelectWithValidation,
    'v-autocomplete-with-validator': VAutocompleteWithValidation
  },
  mixins: [messagable],
  data () {
    return {
      countriesList,
      statesList,
      homeLocations,
      valid: true,
      loading: false,
      dialog: false,
      innerUser: null,
      countryParams: [
        { country: 'United States', stateLabel: 'State', zipMask: '#####', phoneMask: '+1 (###) ###-####' },
        { country: 'Canada', stateLabel: 'Province', zipMask: 'S#S #S#', phoneMask: '+1 (###) ###-####' },
        { country: 'default', stateLabel: 'Region', zipMask: 'XXXXXXXXXXXXX', phoneMask: 'XXXXXXXXXXXXXX' }
      ]
    }
  },
  directives: {
    mask
  },
  computed: {
    statesByCountry () {
      return this.statesList[this.innerUser.country]
    },
    countrParam () {
      return this.countryParams.find((item) => item.country === this.innerUser.country) ||
        this.countryParams.find((item) => item.country === 'default')
    },
    width () {
      return this.wide ? '12' : '6'
    },
    companyEditable () {
      return (this.newUser && this.innerUser.is_company)
    }
  },
  watch: {
    'innerUser.is_company': function (newValue, oldValue) {
      if (!newValue) {
        this.innerUser.company = ''
      }
    }
  },
  methods: {
    validate () {
      return this.$refs.form.validate()
    },
    onSave () {
      this.$refs.form.validate()
        .then((result) => {
          this.loading = true
          if (result) {
            this.$emit('save', this.innerUser)
          }
        })
    },
    stopLoading () {
      this.loading = false
    }
  },
  created () {
    this.innerUser = {
      id: this.user.id,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      email: this.user.email,
      is_company: this.user.is_company,
      company: this.user.company,
      phone1: this.user.phone1,
      street1: this.user.street1,
      street2: this.user.street2,
      city: this.user.city,
      province: this.user.province,
      province_other: this.user.province_other,
      zipcode: this.user.zipcode,
      country: this.user.country,
      home_location: this.user.home_location
    }
  }
}
</script>
