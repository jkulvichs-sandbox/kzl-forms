<template>
  <v-card>
    <v-dialog
      :value="show"
      persistent
      max-width="400"
    >
      <v-fade-transition>

        <v-card v-if="isRedirectedPage" dark>
          <v-card-text class="d-flex justify-center align-center">
            <v-icon left size="80" class="mt-5">mdi-shield-check</v-icon>
          </v-card-text>
          <v-card-text class="text-center">
            Авторизация успешна! Сейчас произойдёт перенаправление на страницу приложения.
          </v-card-text>
        </v-card>

        <!-- Auto Auth Is In Progress -->
        <v-card v-else-if="isProgress" loading dark>
          <v-card-title>
            <v-icon left>mdi-shield-key</v-icon>
            Авторизация ...
          </v-card-title>
          <v-card-text>Пробуем авторизовать вас в системе</v-card-text>
        </v-card>

        <!-- Auth Bug -->
        <v-card v-else-if="authBug" dark>
          <v-card-title>
            <v-icon left>mdi-shield-bug</v-icon>
            Проблема авторизации
          </v-card-title>
          <v-card-text>
            Мы не смогли авторизовать вас, хотя портал авторизации ответил положительно.
            Проверьте соединение с интернетом и попробуйте ещё раз.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" depressed block @click="authByOAuth">
              Войти через studyspark
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Manual Auth Required -->
        <v-card v-else-if="!userInfo" dark>
          <v-card-title>
            <v-icon left>mdi-shield-alert</v-icon>
            Авторизация
          </v-card-title>
          <v-card-text>
            Мы не смогли авторизовать вас автоматически, попробуйте вручную.
            Обычно, вам не потребуется ничего вводить, если вы уже зарегистрированы.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" depressed block @click="authByOAuth()">
              Войти через studyspark
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- If User Info Gotten -->
        <v-card v-else dark>
          <v-card-title>
            <v-icon left>mdi-shield-check</v-icon>
            Авторизован
          </v-card-title>
          <v-card-text class="d-flex align-center mt-5">
            <v-img
              class="rounded-circle"
              :src="userImageURL"
              width="128"
              height="128"
              max-width="128"
              max-height="128"
            />
            <div class="pl-5 d-flex align-center">
              <div>
                <h3 class="mb-3">{{ userInfo.display_name }}</h3>
                <div>{{ userInfo.user_email }}</div>
                <div>{{ userInfo.user_registered }}</div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="!auto" class="mt-3" color="primary" depressed block @click="emitSuccess">Продолжить</v-btn>
          </v-card-actions>
        </v-card>

      </v-fade-transition>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import Client from '@/store/modules/client'
import { UserInfo } from '@/store/modules/client.types'

/*
Auth Checking Flow:
1. If the URI has an _code_ param - use it to try to auth
  1.1. If exists - try auth
  1.2. In doesn't exist - try to restore creds and try to auth
2. If auth was success - emmit event
3. Other case - show a log in button with redirection to OAuth portal
 */

@Component({})
export default class AuthDialog extends Vue {
  readonly client = getModule(Client, this.$store);

  // This auto auth process is in progress?
  isProgress = true

  // Logged in user info
  userInfo?: UserInfo = null

  // User image URL
  userImageURL = ''

  // Auth bug info (can't authorize even code given)
  authBug = ''

  // Debug auth method | Dumb auth
  @Prop({ type: Boolean })
  debug!: boolean

  // Emit success immediately after logged in or show "continue" button
  @Prop({ type: Boolean })
  auto!: boolean

  // Show the dialog and try to check auth
  @Prop({ type: Boolean })
  show!: boolean

  // Is this page redirection from OAuth?
  get isRedirectedPage () {
    return /code=([a-z0-9]+)/i.test(window.location.href)
  }

  // Watch for window state and try to log in or show log in welcome button
  @Watch('show', { immediate: true })
  async watchValue (show: boolean) {
    if (show) {
      this.isProgress = true
      // Try to auth by redirection code
      if (await this.authByURICode()) {
        if (this.auto) {
          this.emitSuccess()
        } else {
          this.userImageURL = await this.client.getUserAvatar(this.userInfo.user_email)
        }
        this.isProgress = false
        return
      }
      // Try to auth by stored creds
      if (await this.authByStored()) {
        if (this.auto) {
          this.emitSuccess()
        } else {
          this.userImageURL = await this.client.getUserAvatar(this.userInfo.user_email)
        }
        this.isProgress = false
        return
      }
      this.isProgress = false
    }
  }

  // Emit success when user logged in
  @Emit('success')
  emitSuccess () {
    return this.userInfo
  }

  // Redirect user to auth page
  async authByOAuth () {
    // Flush auth bug info
    this.authBug = ''

    // Open a new window with OAuth
    const authWin = window.open(
      await this.client.getOAuthURI(),
      '_blank',
      `toolbar=no,
       location=no,
       status=no,
       menubar=no,
       scrollbars=yes,
       resizable=yes,
       width=800,
       height=600`
    )

    // If authWin opened by the browser
    if (authWin) {
      // Start checking for code
      let codeCheckCycle = 0
      codeCheckCycle = setInterval(async () => {
        // If authWin at the redirectionURI
        if (/code=([a-z0-9]+)/i.test(authWin?.location.href)) {
          try {
            // Try to use redirectionURI to auth
            await this.client.auth(authWin?.location.href)
            this.userInfo = await this.client.getUserInfo()
            clearInterval(codeCheckCycle)
            if (this.auto) {
              this.emitSuccess()
            } else {
              this.userImageURL = await this.client.getUserAvatar(this.userInfo.user_email)
            }
          } catch (e) {
            if (!this.debug) this.authBug = "can't authorize, but code given"
          }
          // Delay before close
          setTimeout(() => authWin.close(), 1000)
        }
      }, 1000)

      // Stop cycle if window closed
      authWin.addEventListener('close', () => {
        clearInterval(codeCheckCycle)
      })
    }

    // DEBUG MODE
    if (this.debug) {
      console.warn("DON'T FORGOT REMOVE THE AUTH DEBUG MODE")
      this.userImageURL = await this.client.getUserAvatar('jkulvichi@gmail.com')
      this.userInfo = {
        display_name: 'jkulvich',
        user_email: 'jkulvichi@gmail.com',
        user_registered: '2021-03-25 12:42:33',
        ID: 2,
        user_login: 'jkulvich',
        user_nicename: 'jkulvich',
        user_status: '0'
      }
      if (this.auto) this.emitSuccess()
    }
  }

  // Try to auth client by code in URI (if redirected)
  async authByURICode () {
    try {
      await this.client.auth(window.location.href)
      this.userInfo = await this.client.getUserInfo()
      await this.client.saveCredentials()
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  // Try to auth client by stored creds (if saved)
  async authByStored () {
    try {
      await this.client.loadCredentials()
      this.userInfo = await this.client.getUserInfo()
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
