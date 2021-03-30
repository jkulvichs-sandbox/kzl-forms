<template>
  <v-app>
    <v-main>
      <AuthDialog :show="!isUserLoggedIn" @success="onLoggedIn" :auto="false" :debug="debugAuth"/>

      <template v-if="isUserLoggedIn">
        <template v-if="submitted">
          <div class="d-flex justify-center">
            <v-card width="800" flat class="my-10">
              <v-card-title>Ответы сохранены!</v-card-title>
              <v-card-subtitle>Ваши ответы успешно сохранены</v-card-subtitle>
            </v-card>
          </div>
        </template>

        <template v-else-if="submitError">
          <div class="d-flex justify-center">
            <v-card width="800" flat class="my-10">
              <v-card-title>Ошибка сохранения формы</v-card-title>
              <v-card-subtitle>Попробуйте вернуться обновить форму</v-card-subtitle>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submitError = false">
                  Обновить
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </template>

        <template v-else-if="!schemeURL">
          <div class="d-flex justify-center">
            <v-card width="800" flat class="my-10">
              <v-card-title>Не удалось получить схему формы</v-card-title>
              <v-card-subtitle>{{ schemeURL || 'Пустое значение параметра scheme' }}</v-card-subtitle>
            </v-card>
          </div>
        </template>

        <template v-else>
          <v-scroll-y-transition>
            <TestingForm v-if="isUserLoggedIn" @submit="submit" :scheme-url="schemeURL"/>
          </v-scroll-y-transition>
        </template>
      </template>

    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AuthDialog from '@/components/AuthDialog/AuthDialog.vue'
import { UserInfo } from '@/store/modules/client.types'
import TestingForm from '@/components/AuthDialog/TestingForm/TestingForm.vue'
import { FormDescriptor } from '@/components/AuthDialog/TestingForm/types'
import axios from 'axios'

@Component({
  components: {
    AuthDialog,
    TestingForm
  }
})
export default class App extends Vue {
  // Is User Logged In
  isUserLoggedIn = false

  // Logged In User Info
  userInfo: UserInfo | null = null

  // If form submitted
  submitted = false

  // If submitting error happened
  submitError = false

  // When user logged in
  onLoggedIn (userInfo: UserInfo) {
    // Передавать username в форму теста
    this.isUserLoggedIn = true
    this.userInfo = userInfo
  }

  // Form Submitting
  async submit (form: FormDescriptor) {
    try {
      console.log('SUBMIT', this.userInfo?.user_login, form)
      await axios.post(`save.php?user=${this.userInfo?.user_login}`, form)
      this.submitted = true
    } catch {
      this.submitError = true
    }
  }

  // Returns Scheme URL from query param
  get schemeURL () {
    const matches = window.location.search.match(/scheme=([^&]+)/i)
    if (matches && matches.length >= 2) {
      return matches[1]
    }
    return ''
  }

  // Returns debug auth status from query param
  get debugAuth () {
    return /debug_auth/i.test(window.location.search)
  }
}
</script>
