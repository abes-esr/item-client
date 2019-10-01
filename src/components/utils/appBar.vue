<template>
  <div>
      <v-app-bar
        absolute
        dark
        scroll-target="#playground-example"
        :color="color"
        :elevate-on-scroll="elevateOnScroll"
        :hide-on-scroll="hideOnScroll"
        :fade-on-scroll="fadeOnScroll"
        :fade-img-on-scroll="fadeImgOnScroll"
        :inverted-scroll="invertedScroll"
        :collapse="collapse"
        :collapse-on-scroll="collapseOnScroll"
        :shrink-on-scroll="shrinkOnScroll"
        :extended="extended"
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>Title</v-toolbar-title>

        <div class="flex-grow-1"></div>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'appBar',
  data: () => ({
    elevateOnScroll: false,
    hideOnScroll: false,
    fadeOnScroll: false,
    fadeImgOnScroll: false,
    invertedScroll: false,
    collapse: false,
    collapseOnScroll: false,
    shrinkOnScroll: false,
    extended: false,
    color: 'accent',
    colors: ['primary', 'accent', 'warning lighten-2', 'teal', 'orange'],
  }),
};
</script>

<style scoped>

</style>
