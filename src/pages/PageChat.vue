<template>
  <q-page
    ref="pagechat"
    class="flex column">
    <q-banner
      v-if="!otherUserDetails.online"
      class="bg-grey-4 text-center">
      {{ otherUserDetails.name}} is offline.
    </q-banner>
    <div
      :class="{ 'invisible' : !showMessage }"
      class="q-pa-md column col justify-end">
        <q-chat-message
        v-for="(message, key) in messages"
        :key="key"
        :name="message.from == 'me' ? userDetails.name : otherUserDetails.name"
        :text="[message.text]"
        :sent="message.from === 'me' ? true : false"
       />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form
          @keypress.enter="sendMessage"
          class="full-width">
          <q-input
            ref="newMessage"
            v-model="newMessage"
            bg-color="white"
            class="full-width"
            outlined
            rounded
            label="Message"
            dense>
            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                type="submit"
                color="white"
                icon="send" />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import mixinOtherUserDetails from 'src/mixins/mixin-other-user-details'
export default {
  mixins: [mixinOtherUserDetails],
  data () {
    return {
      newMessage: '',
      showMessage: false
    }
  },
  computed: {
    ...mapState('store', ['messages', 'userDetails']),
    otherUserDetails () {
      return this.$store.state.store.users[this.$route.params.otherUserId]
    }
  },
  methods: {
    ...mapActions('store', ['firebaseGetMessages', 'firebaseStopGettingMessages', 'firebaseSendMessage']),
    sendMessage () {
      this.firebaseSendMessage({
        message: {
          text: this.newMessage,
          from: 'me'
        },
        otherUserId: this.$route.params.otherUserId
      })
      this.clearMessage()
    },
    clearMessage () {
      this.newMessage = ''
      this.$refs.newMessage.focus()
    },
    scrollToBottom () {
      console.log('scroll')
      const pagechat = this.$refs.pagechat.$el
      setTimeout(() => {
        window.scrollTo(0, pagechat.scrollHeight)
      }, 20)
    }
  },
  watch: {
    messages: function (val) {
      if (Object.keys(val).length) {
        this.scrollToBottom()
        setTimeout(() => {
          this.showMessage = true
        }, 200)
      }
    }
  },
  mounted () {
    this.firebaseGetMessages(this.$route.params.otherUserId)
  },
  destroyed () {
    this.firebaseStopGettingMessages()
  }
}
</script>

<style lang="stylus">

</style>
