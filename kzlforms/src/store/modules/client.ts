/**
 * OAuth Implementation
 */

import axios from 'axios'
import localForage from 'localforage'
import { Md5 } from 'ts-md5'
import { UserInfo, Tokens } from './client.types'
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

@Module({
  namespaced: true,
  name: 'Client'
})
export default class Client extends VuexModule {
  // OAuth Authorization Data
  private readonly oauth = {
    portal: 'https://studyspark.kzlproject.xyz/oauth',
    redirectURI: 'https://studyspark.kzlproject.xyz/forms',
    // redirectURI: 'http://localhost:8080',
    clientID: 't5f4RbxMfLnvHOeet2Kuc0pt48gPuNNYERK4I0Zk',
    clientSecret: 'xYta2vRVQam93VE3zmUwU1xoNRyTB0TR8xuHzPtP'
  }

  // Client Access Data to Interact With APIs
  private tokens: Tokens = {
    accessToken: '',
    refreshToken: ''
  }

  // __Returns OAuth Authentication Page URI.__
  // User must be redirected to this address and allow access for this app.
  // After that OAuth will redirect the user to _riderectURI_ and code must be taken from redirection URI _code_ param.
  @Action
  async getOAuthURI () {
    return `${this.oauth.portal}/authorize?client_id=${this.oauth.clientID}&redirect_uri=${this.oauth.redirectURI}&response_type=code`
  }

  // __Tries to Auth By Redirected URI or Code.__
  // Fetches auth code from redirected URI or using _authCode_ as a code in other case.
  // Sends several REST requests to authorize user or throw exception.
  // If auth success then any other API's are available.
  @Mutation
  async auth (authCode: string) {
    const code = (authCode.match(/code=([a-z0-9]+)/i) ?? ['', authCode])[1]

    // get access token by code
    const resp = await axios.post(`${this.oauth.portal}/token`, {
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.oauth.redirectURI
    }, {
      auth: {
        username: this.oauth.clientID,
        password: this.oauth.clientSecret
      }
    })

    // save gain tokens
    this.tokens.accessToken = resp.data.access_token
    this.tokens.refreshToken = resp.data.refresh_token
  }

  // __Tries to Refresh Access Token.__
  // Uses existing _refreshToken_ to update _accessToken_.
  @Mutation
  async refresh () {
    // get access token by refresh token
    const resp = await axios.post(`${this.oauth.portal}/token`, {
      refresh_token: this.tokens.refreshToken,
      grant_type: 'refresh_token'
    }, {
      auth: {
        username: this.oauth.clientID,
        password: this.oauth.clientSecret
      }
    })

    // save gain tokens
    this.tokens.accessToken = resp.data.access_token
    this.tokens.refreshToken = resp.data.refresh_token
  }

  // __Saves Auth Credentials__.
  // So you can use _loadCredentials_ later to restore the user session.
  @Action
  async saveCredentials (key = 'userAuth') {
    await localForage.setItem(key, this.tokens)
  }

  // __Loads Auth Credentials__.
  // So you can save it to use later with _saveCredentials_.
  @Mutation
  async loadCredentials (key = 'userAuth') {
    const auth = await localForage.getItem(key) as Tokens
    if (auth) {
      this.tokens.accessToken = auth.accessToken
      this.tokens.refreshToken = auth.refreshToken
    }
  }

  // __Loads General User Info__
  @Action
  async getUserInfo () {
    // Get General User Info
    const resp = await axios.get(`${this.oauth.portal}/me?access_token=${this.tokens.accessToken}`)
    return resp.data as UserInfo
  }

  // __Loads User Avatar__
  @Action
  async getUserAvatar (email: string, size = 128) {
    const emailHash = Md5.hashStr(email.trim().toLowerCase())
    const resp = await axios.get(`https://www.gravatar.com/avatar/${emailHash}?s=${size}`, {
      responseType: 'blob'
    })
    return URL.createObjectURL(resp.data)
  }
}
