<template>
  <div class="flex flex-col min-h-screen w-full max-w-full bg-[#fcfcfc] overflow-x-hidden">
    <nav 
      class="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out"
      :class="showNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'"
    >
       <NavBarComponent />
    </nav>

    <main class="flex-1 w-full max-w-full ">
      <slot/> 
    </main>

     <FooterComponent />
  </div>
</template>  

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showNav = ref(true);
const lastY = ref(0);

const handleNavbarVisibility = () => {
  const y = window.scrollY;
  const threshold = 15; 
  const diff = Math.abs(y - lastY.value);

  if (y < 100) {
    showNav.value = true;
  } else if (diff > threshold) {
    showNav.value = y < lastY.value;
  }
  lastY.value = y;
};

onMounted(() => {
  window.addEventListener('scroll', handleNavbarVisibility, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleNavbarVisibility);
});
</script>

<style>
/* Keep only global resets that cannot be applied directly to a wrapper div */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
</style>