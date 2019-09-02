<template>
  <button @click="click" :value="transmit" @eventName="updateparent">CLICK</button>
</template>

<script>
export default {
  name: 'child',
  props: {
    transmit: { type: String, default: '5' },
  },
  data() {
    return {
    };
  },
  methods: {
    click() {
      this.$emit('eventName', 'rubis');
    },
  },
};
</script>
