<template>
  <q-page class="flex q-pa-md">
    <q-list
      class="full-width"
      seperator>
       <q-item
          v-for="(user, key) in users"
          :key="key"
          :to="'/chat/' + key"
          class="q-my-sm"
          clickable
          v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ user.name.charAt(0) }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ user.name }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-badge :color="user.online ? 'light-green-S' : 'grey-4'">
              {{ user.online ? 'Online' : 'Offline '}}
            </q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('store', ['users'])
  }
}
</script>

<style>

</style>
