<template>
  <v-alert error dismissible @input="onClose" :value="true" :class="alertTypes[type]">
    {{ text }}
  </v-alert>
</template>

<script>
export default {
  props: {
    text: {
      type: String
    },
    type: {
      type: String,
      default: 'error'
    }
  },
  data () {
    return {
      alertTypes: {
        'error': 'error',
        'success': 'teal accent-2',
        'warning': 'amber accent-2'
      }
    }
  },
  methods: {
    onClose () {
      this.$emit('dismissed')
    }
  }
}
</script>
