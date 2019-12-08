import UserApi from '@/api/UserApi'

export const emptyUser = {
  id: null,
  first_name: '',
  last_name: '',
  is_company: false,
  company: '',
  email: '',
  password: '',
  phone1: '',
  street1: '',
  street2: '',
  city: '',
  province: '',
  province_other: '',
  zipcode: '',
  country: '',
  home_location: '',
  guest: '1',
  beanstream_profileid: '',
  subscription: null,
  beanstream_profile: {
    code: null,
    message: '',
    customer_code: '',
    status: '',
    last_transaction: '',
    modified_date: '',
    card: { name: '', number: '', expiry_month: '', expiry_year: '', card_type: '' },
    language: '',
    billing: { name: '', address_line1: '', address_line2: '', city: '', province: '', country: '', postal_code: '', phone_number: '', email_address: '' }
  }
}

export const state = {
  user: initialUserState('user.user'),
  isGuest: false,
  createAccount: false,
  editableFields: {
    first_name: 'First Name',
    last_name: 'Last Name',
    company: 'Company',
    email: 'Email',
    phone1: 'Phone',
    street1: 'Street1',
    street2: 'Street2',
    city: 'City',
    province: 'Province',
    province_other: 'Province other',
    zipcode: 'Postal code',
    country: 'Country',
    home_location: 'Home Location'
  }
}

export const getters = {
  user (state) {
    return state.user
  },
  isUserLogged (state) {
    return state.user && state.user.id > 0
  },
  isNewUser (state) {
    return state.createAccount
  },
  isGuest (state) {
    return state.isGuest
  },
  editableFields (state) {
    return state.editableFields
  },
  forgotPasswordStatus (state) {
    return state.forgotPasswordSent
  },
  userCard (state) {
    return (state.user) ? state.user.beanstream_profile.card : {}
  }
}

export const mutations = {
  setUser (state, payload) {
    state.user = payload
    saveState('user.user', state.user)
  },
  forgotPasswordSent (state) {
    state.forgotPasswordSent = true
  },
  clearForgotPassword (state) {
    state.forgotPasswordSent = false
  },
  setGuest (state, payload) {
    state.isGuest = payload
  },
  setCreateAccount (state, payload) {
    state.createAccount = payload
  },
  updateUser (state, payload) {
    Object.keys(payload).forEach(
      function (prop) {
        state.user[prop] = payload[prop]
      })
  },
  updateBillingProfile (state, payload) {
    Object.keys(payload).forEach(
      function (prop) {
        state.user.beanstream_profile.billing[prop] = payload[prop]
      })
  },
  updateBillingCard (state, payload) {
    Object.keys(payload).forEach(
      function (prop) {
        state.user.beanstream_profile.card[prop] = payload[prop]
      })
  },
  setBillingCard (state, payload) {
    state.user.beanstream_profile.card = Object.assign({}, payload)
  }
}

export const actions = {
  async signUserIn ({ commit }, payload) {
    await UserApi.login(payload)
      .then((user) => {
        commit('setUser', user)
        commit('setGuest', false)
      })
  },
  logout ({ commit }) {
    commit('setUser', emptyUser)
    commit('setCreateAccount', false)
    commit('setGuest', true)
  },
  async sendForgotPassword ({ commit }, payload) {
    return UserApi.forgotPassword(payload)
  },
  updateUser ({ commit }, payload) {
    commit('updateUser', payload)
  },
  updateBilling ({ commit }, payload) {
    commit('updateBillingProfile', payload.profile)
    commit('updateBillingCard', payload.card)
  },
  updateUserBillingProfile ({ commit }, payload) {
    commit('updateBilllingProfile', payload)
  },
  updateUserBillingCard ({ commit }, payload) {
    commit('updateBillingCard', payload)
  },
  createGuest ({ commit }) {
    commit('setUser', emptyUser)
    commit('setGuest', true)
  },
  detachCard (context) {
    context.commit('setBillingCard', {
      number: '',
      name: '',
      expiry_month: '',
      expiry_year: '',
      cvv: ''
    })
    return UserApi.detachCard(context.state.user.id)
  },
  async createUser ({ commit }, payload) {
    await UserApi.register(payload)
      .then((id) => {
        payload.id = id
        commit('updateUser', payload)
        commit('setCreateAccount', true)
        commit('setGuest', false)
      })
  },
  save (context) {
    if (!context.state.isGuest) {
      return UserApi.save(context.state.user)
    }
  }
}

// ===
// Private helpers
// ===
function initialUserState () {
  return getSavedState('user.user') || emptyUser
}

function getSavedState (key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState (key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}
