<template>
  <div class="nested">
    <div v-for="(value, key) in jsonD" :key="key" class="mb-1">
      <div v-if="typeof value === 'object' && !Array.isArray(value)" class="ms-3 mb-3 subnested">
        <h5 class="mt-3" v-if="key !== '$'">{{ sectionTitle(key) }}</h5>
        <nested-detail :jsonData="value"></nested-detail>
      </div>
      <div v-else>
        <strong>{{ sectionTitle(key) }}: </strong>
        <span v-if="typeof value === 'string'">{{ value}}</span>
        <span v-else-if="typeof value === 'boolean'">{{ value ? 'Si' : 'No' }}</span>
        <span v-else-if="typeof value === 'number'">{{ value }}</span>
        
        <ul v-if="Array.isArray(value)">
          <li v-for="(val) in value" :key="val">
            <ul v-if="typeof val === 'object'">
              <li v-for="(el, i) in value" :key="i">
                <!-- <nested-detail  :jsonData="val"></nested-detail> -->
                
                <span> {{ i }}: {{ el }}</span>
              </li>
            </ul>

            <span v-else> {{ val }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style>
h4, h5, strong {
  text-transform: capitalize;
}
h5 {
  text-decoration: underline;
}
</style>
<script>
  import NestedDetail from '@/frontend/components/Partials/NestedDetail.vue';

  export default {
    components: {
      NestedDetail
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