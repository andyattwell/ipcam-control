<template>
  <div class="modal" :class="{'show': show }"  :style="{'display': show ? 'block' :'none'}" tabindex="-1" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body bg-dark text-white">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['title', 'show'],
  emits: ['close'],
  name: "Custom-modal",
  methods: {
    closeModal() {
      this.$emit('close')
    }
  }
}
</script>