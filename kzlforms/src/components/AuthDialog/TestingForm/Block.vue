<template>
  <v-card>
    <v-card-title v-if="value.title">{{ value.title }}</v-card-title>
    <v-card-subtitle v-if="value.text">{{ value.text }}</v-card-subtitle>
    <v-img v-if="value.image" height="250" contain :src="value.image">
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <iframe
      v-if="value.youtubeID"
      style="width: 100%; height: 400px"
      :src="`https://www.youtube.com/embed/${value.youtubeID}`"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
    <component :is="getComponentNameByBlockType(value.type)" :value="value.data" @input="emitInput"/>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import * as _ from 'lodash'
import { FormBlock, FormBlockData, FormBlockType } from './types'
import SubBlockSelect from './SubBlockSelect.vue'
import SubBlockMultiSelect from './SubBlockMultiSelect.vue'
import SubBlockText from './SubBlockText.vue'
import SubBlockFile from './SubBlockFile.vue'
import SubBlockVoice from './SubBlockVoice.vue'

@Component({
  components: {
    SubBlockSelect,
    SubBlockMultiSelect,
    SubBlockText,
    SubBlockFile,
    SubBlockVoice
  }
})
export default class Block extends Vue {
  // Block Data
  @Prop({ type: Object, required: true })
  value!: FormBlock

  // Emit Data Change
  @Emit('input')
  emitInput (data: FormBlockData) {
    // Copying current data to prevent object mutation (very bad practice in Vue, causes reactivity lost)
    const clonedVal = _.cloneDeep(this.value)
    clonedVal.data = data
    return clonedVal
  }

  // Returns component name by their tag name
  getComponentNameByBlockType (tag: string): string {
    const types = {
      [FormBlockType.Select]: 'SubBlockSelect',
      [FormBlockType.MultiSelect]: 'SubBlockMultiSelect',
      [FormBlockType.Text]: 'SubBlockText',
      [FormBlockType.File]: 'SubBlockFile',
      [FormBlockType.Voice]: 'SubBlockVoice'
    }
    const type = Object.entries(types).find(pair => pair[0] === tag)?.[1]
    return type ?? ''
  }
}
</script>

<style lang="sass" scoped>

</style>
