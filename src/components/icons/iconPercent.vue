<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" :aria-labelledby="iconName" role="presentation">
    <path :fill="iconColor" d="M18.5,3.5L3.5,18.5L5.5,20.5L20.5,5.5M7,4A3,3 0 0,0 4,7A3,3 0 0,0 7,10A3,3 0 0,0 10,7A3,3 0 0,0 7,4M17,14A3,3 0 0,0 14,17A3,3 0 0,0 17,20A3,3 0 0,0 20,17A3,3 0 0,0 17,14Z" />
    <title :id="iconName" lang="en">{{ iconName }} icon</title>
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'percent',
    },
    width: {
      type: [Number, String],
      default: 18,
    },
    height: {
      type: [Number, String],
      default: 18,
    },
    iconColor: {
      type: String,
      default: '#979797',
    },
  },
};
</script>

<style scoped>

</style>
