<template>
  <div class="base-form">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item
        v-for="item in formItems"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || `请输入${item.label}`"
          :disabled="item.disabled"
        />
        <el-input
          v-else-if="item.type === 'password'"
          v-model="formData[item.prop]"
          type="password"
          :placeholder="item.placeholder || `请输入${item.label}`"
        />
        <el-select
          v-else-if="item.type === 'select'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || `请选择${item.label}`"
        >
          <el-option
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-input
          v-else-if="item.type === 'textarea'"
          v-model="formData[item.prop]"
          type="textarea"
          :rows="4"
          :placeholder="item.placeholder || `请输入${item.label}`"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormItem } from '@/types/components'

const props = defineProps<{
  formData: Record<string, any>
  formItems: FormItem[]
  rules?: Record<string, any>
}>()

const formRef = ref()
defineExpose({ formRef })
</script>
