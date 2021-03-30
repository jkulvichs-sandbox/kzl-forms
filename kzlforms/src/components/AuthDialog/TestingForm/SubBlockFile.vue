<template>
  <v-card-text>
    <v-file-input
      counter
      multiple
      outlined
      dense
      show-size
      truncate-length="40"
      :label="value.label ? value.label : ''"
      @change="input"
    ></v-file-input>
  </v-card-text>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import * as _ from 'lodash'
import { FormBlockDataFile } from './types'

@Component({})
export default class SubBlockFile extends Vue {
  // Block Data
  @Prop({ type: Object, required: true })
  value!: FormBlockDataFile

  // Emit Data Change
  @Emit('input')
  emitInput (value: FormBlockDataFile) {
    return value
  }

  async fileToBase64 (file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
    })
  }

  // Files Selected Reaction
  async input (files: File[]) {
    const clonedVal = _.cloneDeep(this.value)
    clonedVal.files = [] as string[]
    for (let i = 0; i < files.length; i++) {
      clonedVal.files.push(await this.fileToBase64(files[i]))
    }
    this.emitInput(clonedVal)
  }
}
</script>

<style lang="sass" scoped>

</style>
