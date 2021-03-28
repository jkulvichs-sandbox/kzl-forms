<template>
  <v-app>
    <v-main>
      <AuthDialog :show="showAuthDialog" @success="onLoggedIn" :auto="false" debug/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AuthDialog from '@/components/AuthDialog/AuthDialog.vue'
import { UserInfo } from '@/store/modules/client.types'

@Component({
  components: {
    AuthDialog
  }
})
export default class App extends Vue {
  // Show auth dialog and try to log in
  showAuthDialog = true

  // When user logged in
  onLoggedIn (userInfo: UserInfo) {
    // Передавать username в форму теста
    this.showAuthDialog = false
    console.log(userInfo)
  }
}
</script>
