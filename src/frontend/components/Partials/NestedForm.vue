<template>
  <div>
    <form>
      <div v-for="(value, key) in jsonD" :key="key" class="mt-3">
        <div v-if="typeof value === 'object' && !Array.isArray(value)">
          <div class="">
            <h4 class="" v-if="key !== '$'">{{ sectionTitle(key) }}</h4>
            <nested-form :jsonData="value" :parent="parent ? parent + ' - ' + key : key"></nested-form>
          </div>
        </div>
        <div v-else>
          <div class="form-group row p-2 border">
            <label :for="key" class="fs-6" :class="typeof value === 'boolean' ? 'col-7' : 'col-4'">{{ key }}:</label>
            <div :class="typeof value === 'boolean' ? 'col-5' : 'col-8'">
              <input
                v-if="typeof value === 'string'"
                type="text"
                class="form-control form-control-sm fs-6"
                :id="key"
                v-model="jsonD[key]"
                disabled
              />
              <input
                v-else-if="typeof value === 'boolean'"
                type="checkbox"
                class="form-check-input"
                :id="key"
                v-model="jsonD[key]"
                disabled
              />
              <input
                v-else-if="typeof value === 'number'"
                type="number"
                class="form-control form-control-sm fs-6"
                :id="key"
                v-model="jsonD[key]"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<style>
h4 {
  text-transform: capitalize;
}
</style>
<script>
  import NestedForm from './NestedForm.vue';

  export default {
    components: {
      NestedForm
    },
    props: ['jsonData', 'parent'],
    data() {
      return {
        jsonD: {}
      }
    },
    mounted() {
      this.jsonD = this.jsonData
    },
    watch: {
      jsonData(val) {
        this.jsonD = val
      }
    },
    methods: {
      sectionTitle(key) {
        return key.replace(/([a-z])([A-Z])/g, '$1 $2');
      }
    }
  };
</script>