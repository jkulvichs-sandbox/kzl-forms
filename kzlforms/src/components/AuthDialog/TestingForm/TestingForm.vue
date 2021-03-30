<template>
  <div class="d-flex justify-center">
    <v-card v-if="form" width="800" flat class="my-10">
      <v-card-title>{{ form.title }}</v-card-title>
      <v-card-subtitle v-if="form.text">{{ form.text }}</v-card-subtitle>
      <v-card-text>

        <Block
          v-for="(block, iblock) in form.blocks"
          class="mt-5"
          :key="iblock"
          :value="block"
          @input="data => input(iblock, data)"
        />

        <v-card class="mt-10 d-flex justify-end" flat>
          <v-btn color="primary" @click="emitSubmit">
            <v-icon left>mdi-check</v-icon>
            Завершить
          </v-btn>
        </v-card>

      </v-card-text>
    </v-card>

    <v-card v-else width="800" flat class="my-10" loading>
      <v-card-title>Загрузка формы ...</v-card-title>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Emit, Prop } from 'vue-property-decorator'
import {
  FormBlock,
  FormDescriptor
} from './types'
import Block from './Block.vue'
import axios from 'axios'

@Component({
  components: {
    Block
  }
})
export default class TestingForm extends Vue {
  // Form Scheme JSON URL
  @Prop({ required: true, type: String })
  schemeUrl!: string

  // Form Data
  form: FormDescriptor | null = null

  // Watching and loading form's scheme from url
  @Watch('schemeUrl', { immediate: true })
  async watchSchemeURL (url: string) {
    const resp = await axios.get(url)
    this.form = resp.data
  }

  @Watch('value', { deep: true })
  watchValue (value: FormBlock) {
    console.log(value)
  }

  // Model Mutation Reaction
  input (id: number, data: FormBlock) {
    if (this.form) {
      this.form.blocks[id] = data
    }
  }

  // Prepare data and submit
  @Emit('submit')
  emitSubmit () {
    return this.form
  }
}
</script>

<style lang="sass" scoped>

</style>
