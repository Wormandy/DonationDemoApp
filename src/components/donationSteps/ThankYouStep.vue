<template>
  <v-card tense class="mt-10">
    <h3 class="display-1">Thank you for your donation!</h3>
    <div>Make another donation or return to the homepage</div>
    <donation-receipt class="mt-10" style="width:360px" :donation="donation" title="Donation number: 1234"/>
    <v-card class="mt-10" style="width:360px; background-color: rgb(233, 244, 244)" v-if="!isGuest">
      <v-card-text>
        <h2>Do you want to make this a recurring donation?</h2>
        <v-row class="mt-3" justify="space-around">
          <v-col cols="auto">
            <v-btn @click="$emit('dispatcher', $event, 'createRecurring')">Yes</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn @click="$emit('dispatcher', $event, 'finish')">No</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-row tense class="mt-5" v-else justify="end">
      <v-col cols="3">
        <v-btn class="accent info--text" x-large @click="$emit('dispatcher', $event, 'finish')">
          finish
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import DonationReceipt from '@/components/DonationReceipt'

export default {
  props: {
    donation: {
      type: Array,
      required: true
    },
    isGuest: {
      type: Boolean,
      default: true
    }
  },
  components: {
    'donation-receipt': DonationReceipt
  },
  computed: {
    donationTotal () {
      return this.donation.reduce((sum, item1) => sum + item1.value, 0) || 0
    }
  }
}
</script>
