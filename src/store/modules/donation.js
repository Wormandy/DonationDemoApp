import DonationApi from '@/api/DonationApi'
// import moment from 'moment'

export const state = {
  donation: {},
  recurring: {
    categories: [],
    period: '',
    startDate: null
  }
}

export const getters = {
  donation (state) {
    return state.donation
  },

  recurring (state) {
    return state.recurring
  }
}

export const mutations = {
  setDonation (state, payload) {
    state.donation = payload
  },
  setRecurring (state, payload) {
    state.recurring.categories = payload.categories.map(el => { return { ...el } })
    state.recurring.period = payload.period
    state.recurring.startDate = payload.startDate
  },
  setRecurringCategories (state, payload) {
    state.recurring.categories = payload.map(el => { return { ...el } })
  },
  resetRecurring (state) {
    state.recurring.categories = []
    state.recurring.period = ''
    state.recurring.startDate = null
  }
}

export const actions = {
  createDonation ({ commit }, payload) {
    commit('setDonation', payload.map(item => ({ ...item })))
  },
  createRecurring ({ commit }, payload) {
    commit('setRecurringCategories', payload)
  },
  resetDonation ({ commit }) {
    commit('setDonation', {})
  },
  makeDonation ({ state }, user) {
    return DonationApi.makeDonation(state.donation, user)
  },
  makeRecurringFromDonation (context) {
    context.commit('setRecurring', context.getters.donation)
  },
  saveRecurring ({ commit }, payload) {
    commit('setRecurring', payload)
    return DonationApi.saveRecurring(payload)
  },
  deleteRecurring ({ commit }) {
    commit('resetRecurring')
    return DonationApi.deleteRecurring()
  }
}
