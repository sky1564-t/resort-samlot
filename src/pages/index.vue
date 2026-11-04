<script setup>
import HomePageComponent from '~/components/homepage/HomePageComponent.vue'
import IntroHomePage from '~/components/homepage/IntroHomePage.vue'
import FarmPage from '~/components/homepage/FarmPage.vue'
import SearchWidget from '~/components/homepage/SearchWidget.vue';
import ResortView from '~/components/homepage/ResortView.vue'
</script>

<template>
  <div>
    <HomePageComponent />
    <SearchWidget />
    <IntroHomePage />
    <FarmPage />
    <ResortView />
  </div>
</template>