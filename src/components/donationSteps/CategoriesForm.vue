<template>
  <v-container>
    <donation-element
      v-for="field in mainFields"
      v-bind:key="field.id"
      :field="field"
      :value="field.value"
      />
    <v-divider />
    <v-row>
      <v-col cols="12" xs="12" md="12">
        <donation-element
          v-for="field in secondaryFields"
          v-bind:key="field.id"
          :field="field"
          :value="field.value"
          />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DonationElement from '@/components/inputs/DonationElement'

export default {
  props: {
    donationFields: {
      type: Array,
      required: true
    }
  },
  components: {
    'donation-element': DonationElement
  },
  computed: {
    mainFields () {
      return this.donationFields.filter((item) => item.main)
    },
    secondaryFields () {
      return this.donationFields.filter((item) => !item.main)
    }
  }
}
</script>
