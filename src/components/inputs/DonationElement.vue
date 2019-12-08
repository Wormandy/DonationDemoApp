<template>
  <v-container fluid>
    <v-row dense justify="start">
      <v-col cols="12" sm="3" class="text-sm-right my-auto">
        <label for class="font-weight-bold">{{ field.title }}
          <p v-if="field.description" class="caption">({{ field.description}})</p>
        </label>
      </v-col>
      <v-col cols="12" sm="5">
        <div>
          <div></div>
          <v-currency-field
            outlined
            dense
            single-line
            hide-details
            :name="'category-' + field.id"
            v-model="field.value"
            placeholder="0.00"
            class="px-2"/>
        </div>
      </v-col>
      <v-col cols="1" xs="1" v-if="deletable">
        <v-icon color="red" @click="$emit('delete', field.id)">fas fa-times</v-icon>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'DonateElement',
  props: {
    field: {
      type: Object,
      required: true
    },
    deletable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      money: {
        decimal: '.',
        thousands: ' ',
        prefix: '$ ',
        suffix: '',
        precision: 2
      }
    }
  },
  computed: {
    value () {
      return this.field.value
    }
  }
}
</script>
