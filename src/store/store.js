import { firebaseAuth, firebaseDB } from 'boot/firebase'
import Vue from 'vue'

let messagesRef

const state = {
  userDetails: {},
  users: {},
  messages: {}
}
const mutations = {
  setuserDetails (state, payload) {
    state.userDetails = payload
  },
  addUser (state, payload) {
    Vue.set(state.users, payload.userID, payload.userDetails)
  },
  updateUser (state, payload) {
    Object.assign(state.users[payload.userID], payload.userDetails)
  },
  addMessage (state, payload) {
    Vue.set(state.messages, payload.messageId, payload.messageDetails)
  },
  clearMessages (state) {
    state.messages = {}
  }
}
const actions = {
  registerUser (a = {}, payload) {
    console.log(payload.name)
    firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password).then(response => {
      console.log(response)
      const userId = firebaseAuth.currentUser.uid
      firebaseDB.ref('users/' + userId).set({
        name: payload.name,
        email: payload.email,
        online: true
      })
    })
      .catch(error => {
        console.log(error.message)
      })
  },
  loginUser (a = {}, payload) {
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password).then(response => {
    })
      .catch(error => {
        console.log(error.message)
      })
  },
  logoutUser () {
    firebaseAuth.signOut()
  },
  handleAuthStateChanged ({ commit, dispatch, state }) {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        const userId = firebaseAuth.currentUser.uid
        firebaseDB.ref('users/' + userId).once('value', snapshot => {
          const userDetails = snapshot.val()
          commit('setuserDetails', {
            name: userDetails.name,
            email: userDetails.email,
            userID: userId
          })
        })
        dispatch('firebaseUpdateUser', {
          userID: userId,
          updates: {
            online: true
          }
        })
        dispatch('firebaseGetUsers')
        this.$router.push('/')
      } else {
        dispatch('firebaseUpdateUser', {
          userID: state.userDetails.userID,
          updates: {
            online: false
          }
        })
        commit('setuserDetails', {})
        this.$router.replace('/auth')
      }
    })
  },
  firebaseUpdateUser (a = {}, payload) {
    firebaseDB.ref('users/' + payload.userID).update(payload.updates)
  },
  firebaseGetUsers ({ commit }) {
    firebaseDB.ref('users').on('child_added', snapshot => {
      const userDetails = snapshot.val()
      const userID = snapshot.key
      commit('addUser', {
        userID,
        userDetails
      })
    })
    firebaseDB.ref('users').on('child_changed', snapshot => {
      const userDetails = snapshot.val()
      const userID = snapshot.key
      commit('updateUser', {
        userID,
        userDetails
      })
    })
  },
  firebaseGetMessages ({ commit, state }, otherUserId) {
    const userId = state.userDetails.userID
    messagesRef = firebaseDB.ref('chats/' + userId + '/' + otherUserId)
    messagesRef.on('child_added', snapshot => {
      const messageDetails = snapshot.val()
      const messageId = snapshot.key
      commit('addMessage', {
        messageId,
        messageDetails
      })
    })
  },
  firebaseStopGettingMessages ({ commit }) {
    if (messagesRef) {
      messagesRef.off('child_added')
      commit('clearMessages')
    }
  },
  firebaseSendMessage (a = {}, payload) {
    firebaseDB.ref('chats/' + state.userDetails.userID + '/' + payload.otherUserId).push(
      payload.message
    )

    payload.message.from = 'them'
    firebaseDB.ref('chats/' + payload.otherUserId + '/' + state.userDetails.userID).push(
      payload.message
    )
  }
}
const getters = {
  users: state => {
    const userFiltered = {}
    Object.keys(state.users).forEach(key => {
      if (key !== state.userDetails.userID) {
        userFiltered[key] = state.users[key]
      }
    })
    return userFiltered
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
