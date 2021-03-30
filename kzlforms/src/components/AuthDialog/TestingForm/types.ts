// Form Block TYpe
export enum FormBlockType {
  Select = 'select',
  MultiSelect = 'multi',
  Text = 'text',
  File = 'file',
  Voice = 'voice',
}

// Part of data for components which has selection from one or many
export type FormSelectOption = {
  text: string
  checked?: boolean
}

// FormBlock Data Select
export type FormBlockDataSelect = {
  options: FormSelectOption[]
}

// FormBlock Data Text
export type FormBlockDataText = {
  label?: string
  text?: string
}

// FormBlock Data File
export type FormBlockDataFile = {
  label?: string
  files?: string[]
}

// Voice Data
export type FormBlockVoice = {
  blob: Blob
  duration: number
  type: string
}

// FormBlock Data Audio
export type FormBlockDataVoice = {
  // Base64 wav data
  data?: string
}

// Form Block Data Possible Types
export type FormBlockData = FormBlockDataSelect | FormBlockDataText | FormBlockDataFile | FormBlockDataVoice

// Form Block Common Data
export type FormBlock = {
  type: FormBlockType
  title?: string
  text?: string
  image?: string
  youtubeID?: string
  data: FormBlockData
}

// Form Data Description
export type FormDescriptor = {
  title: string
  text?: string
  blocks: FormBlock[]
}
