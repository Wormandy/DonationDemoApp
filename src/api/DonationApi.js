export default {
  donationFields: [
    { id: '21', title: 'TITHE', description: '', main: true, value: 0.00 },
    { id: '22', title: 'OFFERINGS', description: '', main: true, value: 0.00 },
    { id: '23', title: 'Heart for the House', description: '2019 Vision Offering', main: false, value: 0.00 },
    { id: '24', title: 'Springs Canada', description: 'Building Fund', main: false, value: 0.00 },
    { id: '25', title: 'Kingdom Builders', description: '', main: false, value: 0.00 },
    { id: '26', title: 'Inner City', description: 'Missions', main: false, value: 0.00 }
  ],

  getDonationFields () {
    return this.donationFields.slice(0)
  },

  makeDonation (donation, user) {
    return new Promise((resolve, reject) => {
      setTimeout(() => { resolve() }, 2000)
    })
  },

  saveRecurring (recurring) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 1000)
    })
  },

  deleteRecurring () {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 1000)
    })
  }
}
