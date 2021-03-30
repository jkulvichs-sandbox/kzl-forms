<template>
  <v-card-text>
    <VueRecord class="recorder" @result="input">

      <v-btn depressed rounded color="primary" dark>
        <v-icon>mdi-microphone</v-icon>
      </v-btn>
      <span class="ml-5">
        <span v-if="voice">Записано {{ Math.trunc(voice.duration / 1000) }} сек</span>
        <span v-else>Начать запись</span>
      </span>

      <template slot="isInitiating">

        <v-btn outlined rounded color="#757575">
          <v-icon>mdi-microphone</v-icon>
        </v-btn>
        <span class="ml-5">
          Разрешить доступ к микрофону
        </span>

      </template>
      <template slot="isRecording">

        <v-btn depressed rounded color="#E53935" dark>
          <v-icon class="blinking">mdi-microphone</v-icon>
        </v-btn>
        <span class="ml-5">
          Идёт запись ...
        </span>

      </template>
      <template slot="isCreating">

        <v-btn outlined rounded color="#757575" loading></v-btn>
        <span class="ml-5">
          Запись обрабатывается ...
        </span>

      </template>
    </VueRecord>
  </v-card-text>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import * as _ from 'lodash'
import { FormBlockDataVoice, FormBlockVoice } from './types'
import VueRecord from '@loquiry/vue-record-audio'

@Component({
  components: {
    VueRecord
  }
})
export default class SubBlockVoice extends Vue {
  // Block Data
  @Prop({ type: Object, required: true })
  value!: FormBlockDataVoice

  // Recorder Voice Data
  voice: FormBlockVoice | null = null

  // Emit Data Change
  @Emit('input')
  emitInput (value: FormBlockDataVoice) {
    return value
  }

  // Files Selected Reaction
  input (voice: FormBlockVoice) {
    this.voice = voice
    const clonedVal = _.cloneDeep(this.value)

    const reader = new FileReader()
    reader.onload = () => {
      clonedVal.data = reader.result as string
      this.emitInput(clonedVal)
    }
    reader.readAsDataURL(voice.blob)
  }
}
</script>

<style lang="sass" scoped>
.recorder
  border: none
  outline: none

  &.active
    border: none

.blinking
  animation: blinking-anim 1s linear infinite

@keyframes blinking-anim
  0%
    opacity: 1
  50%
    opacity: .5
  100%
    opacity: 1
</style>
