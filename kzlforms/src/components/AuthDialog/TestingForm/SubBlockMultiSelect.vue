<template>
  <v-card-text>
    <v-checkbox
      v-for="(option, ioption) in value.options"
      v-model="selected"
      hide-details
      :key="ioption"
      :label="option.text"
      :value="ioption"
    ></v-checkbox>
  </v-card-text>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import * as _ from 'lodash'
import { FormBlockDataSelect } from './types'

@Component({})
export default class SubBlockMultiSelect extends Vue {
  // Block Data
  @Prop({ type: Object, required: true })
  value!: FormBlockDataSelect

  // Emit Data Change
  @Emit('input')
  emitInput (value: FormBlockDataSelect) {
    return value
  }

  // Check Boxes Selected IDs
  selected = [] as number[]

  // Watching for Changes in the Value
  @Watch('value', { deep: true, immediate: true })
  watchValue (value: FormBlockDataSelect) {
    // Setting up the radio model
    this.selected = value.options
      .map((option, id) => option.checked ? id : -1)
      .filter(id => id >= 0)
    console.log(this.selected)
  }

  // Watching for Selection Change
  @Watch('selected')
  watchSelected (selected: number[]) {
    // Copying current data to prevent object mutation (very bad practice in Vue, causes reactivity lost)
    const clonedVal = _.cloneDeep(this.value)
    // Uncheck all
    clonedVal.options = clonedVal.options.map(option => ({ ...option, checked: false }))
    // Check all selected values
    selected.forEach((id) => {
      clonedVal.options[id].checked = true
    })
    this.emitInput(clonedVal)
  }
}
</script>

<style lang="sass" scoped>

</style>
