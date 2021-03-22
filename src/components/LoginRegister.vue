<template>
    <q-form @submit="submitForm">
        <q-input
          v-if="tab === 'register'"
          outlined
          class="q-mb-md"
          v-model="formData.name"
          label="Name" />
        <q-input
          outlined
          class="q-mb-md"
          type="email"
          v-model="formData.email"
          label="Email" />
        <q-input
          outlined
          class="q-mb-md"
          type="password"
          v-model="formData.password"
          label="Password" />
        <div class="row">
            <q-space />
            <q-btn
          color="primary"
          type="submit"
          :label="tab" />
          <span class="material-icons"></span>
        </div>
    </q-form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: ['tab'],
  data () {
    return {
      formData: {
        name: '',
        email: 'anvesh@test.com',
        password: '12345678'
      }
    }
  },
  methods: {
    ...mapActions('store', ['registerUser', 'loginUser']),
    submitForm () {
      if (this.tab === 'login') {
        this.loginUser(this.formData)
      } else {
        this.registerUser(this.formData)
      }
    }
  }
}

</script>
