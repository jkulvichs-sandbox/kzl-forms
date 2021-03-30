<template>
  <v-card-text>
    <v-radio-group v-model="radio">
      <v-radio
        v-for="(option, ioption) in value.options"
        :key="ioption"
        :label="option.text"
        :value="ioption"
      ></v-radio>
    </v-radio-group>
  </v-card-text>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import * as _ from 'lodash'
import { FormBlockDataSelect } from './types'

@Component({})
export default class SubBlockSelect extends Vue {
  // Block Data
  @Prop({ type: Object, required: true })
  value!: FormBlockDataSelect

  // Emit Data Change
  @Emit('input')
  emitInput (value: FormBlockDataSelect) {
    return value
  }

  // Radio Button Selected ID
  radio = -1

  // Watching for Changes in the Value
  @Watch('value', { deep: true, immediate: true })
  watchValue (value: FormBlockDataSelect) {
    // Setting up the radio model
    this.radio = value.options.findIndex(option => option.checked)
  }

  // Watching for Selection Change
  @Watch('radio')
  watchRadio (radio: number) {
    // Copying current data to prevent object mutation (very bad practice in Vue, causes reactivity lost)
    const clonedVal = _.cloneDeep(this.value)
    // Uncheck all
    clonedVal.options = clonedVal.options.map(option => ({ ...option, checked: false }))
    if (radio in this.value.options) {
      // Check specified box
      clonedVal.options[radio].checked = true
    }
    this.emitInput(clonedVal)
  }
}
</script>

<style lang="sass" scoped>

</style>
