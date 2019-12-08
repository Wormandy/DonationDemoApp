<template>
  <v-card v-bind="$attrs">
    <v-card-title class="accent white--text">{{ title }}</v-card-title>
    <v-card-subtitle class="info"></v-card-subtitle>
    <v-card-text>
      <template v-if="donation.length">
        <v-card
          class="d-flex justify-space-between pb-3"
          v-for="category in donation"
          v-bind:key="category.id"
          flat
          tile
        >
          <v-card flat tile>{{ category.title }}:</v-card>
          <v-card flat tile
            >CAD<sup>$</sup> {{ category.value | currency("") }}</v-card
          >
        </v-card>
      </template>
      <template v-else>
          <v-card flat tile class="d-flex justify-space-between pb-3">
            Your Envelope is Empty
          </v-card>
      </template>
    </v-card-text>
    <v-divider />
    <v-card
      class="d-flex tooltip justify-space-between align-baseline pa-4"
      flat
      tile
    >
      <v-card class="tooltip"
        flat
        tile
      >
        <div class="font-weight-bold">
          Summary Total CAD<sup>$</sup>:
        </div>
      </v-card>
      <v-card class="tooltip" flat tile
        ><div class="font-weight-thin display-1">
          {{ donationTotal | currency("") }}
        </div></v-card>
    </v-card>
  </v-card>
</template>

<script>
export default {
  props: {
    donation: {
      type: Array,
      required: true
    },
    title: {
      type: String
    }
  },
  computed: {
    donationTotal () {
      return this.donation.reduce((sum, item1) => sum + item1.value, 0) || 0
    }
  }
}
</script>
