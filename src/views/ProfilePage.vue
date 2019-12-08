<template>
  <v-container>
    <v-toolbar flat short dense>
      <v-spacer></v-spacer>
      <v-toolbar-items  style="height:36px; align=center;">
        <v-btn
            outlined
            small
            v-for='item in profileSubMenu'
            :key='item.title'
            :to='{ name: item.link }' class="primary--text px-2 py-0 mx-2">
            {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
    </v-toolbar>
    <router-view></router-view>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      profileSubMenu: [
        { id: '5', title: 'Make a Donation', link: 'Donate' },
        { id: '6', title: 'Edit My Info', link: 'ProfileEdit' },
        { id: '7', title: 'Edit Recurring', link: 'EditRecurring' }
      ]
    }
  }
}
</script>
