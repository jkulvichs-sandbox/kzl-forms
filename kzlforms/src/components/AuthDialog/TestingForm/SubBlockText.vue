<template>
  <v-card-text>
    <v-textarea
      v-model="text"
      dense
      hide-details
      :label="value.label ? value.label : ''"
      outlined
      :rows="1"
      auto-grow
    />
  </v-card-text>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import * as _ from 'lodash'
import { FormBlockDataText } from './types'

@Component({})
export default class SubBlockText extends Vue {
  // Block Data
  @Prop({ type: Object, required: true })
  value!: FormBlockDataText

  // Emit Data Change
  @Emit('input')
  emitInput (value: FormBlockDataText) {
    return value
  }

  // Text Field Value
  text = ''

  // Watching for Changes in the Value
  @Watch('value', { deep: true, immediate: true })
  watchValue (value: FormBlockDataText) {
    // Setting up the text value
    this.text = value.text ?? ''
  }

  // Watching for Selection Change
  @Watch('text')
  watchText (text: string) {
    // Copying current data to prevent object mutation (very bad practice in Vue, causes reactivity lost)
    const clonedVal = _.cloneDeep(this.value)
    clonedVal.text = text
    this.emitInput(clonedVal)
  }
}
</script>

<style lang="sass" scoped>

</style>
