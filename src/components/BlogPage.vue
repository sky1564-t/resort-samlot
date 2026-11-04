<template>
  <div class="relative w-full bg-[#fcfcfc] min-h-screen font-sans pb-24">
  <!-- New Hero Image Section -->
    <div class="relative w-full h-[50vh] min-h-[400px] overflow-hidden mb-24">
      <img 
        src="/picture/2.jpg" 
        alt="ta chamnab" 
        class="absolute inset-0 w-full h-full object-cover hero-image fade"
      />
    </div>
    <!-- Abstract Background Watermark Pattern -->
    <div class="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 800 800" class="w-[150%] md:w-[80%] h-auto rotate-12">
        <path fill="currentColor" d="M399.5,123.3c-66.2-7.8-135.5,16.5-181.7,64.2c-56,57.7-65.5,148-35.3,222.1c29.1,71.7,95.5,126.8,171.1,146.4 c83.9,21.8,177.3,1.3,243.6-53.5c60.3-49.8,87.7-133,70.9-209.6c-17.7-80.4-86.2-143.6-165.7-160.7C468.9,124.9,433.8,127.3,399.5,123.3z M495.2,467.5c-48.4,41.9-122.9,51.8-181.3,21.6c-54.3-28.1-92.4-84.6-96-146.1c-3.2-56.1,25-110.1,70.3-142.1 c46.8-33,110.6-42.5,165.6-21.2c56.8,22.1,102.7,73.5,114.8,133.5C581.4,377.2,546.9,422.7,495.2,467.5z"/>
      </svg>
    </div>

    <!-- Page Header -->
    <div class="relative z-10 pt-24 pb-12 text-center px-4">
      <span class="text-green-700 text-xs font-bold tracking-widest uppercase mb-3 block">Journal</span>
      <h1 class="text-4xl md:text-5xl text-gray-900 font-light tracking-wide uppercase">Stories from Samlot Diamond Resort</h1>
      <div class="w-12 h-px bg-green-500 mx-auto mt-6"></div>
    </div>

    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
      
      <!-- Featured Post -->
      <div class="mb-24 group cursor-pointer">
        <div class="relative w-full h-[50vh] min-h-[400px] rounded-sm overflow-hidden shadow-xl">
          <img :src="featuredPost.image" :alt="featuredPost.title" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-500"></div>
        </div>
        
        <!-- Overlapping Featured Content Box -->
        <div class="relative w-11/12 md:w-3/4 lg:w-1/2 bg-white p-8 md:p-12 mx-auto -mt-20 shadow-2xl z-20 text-center flex flex-col items-center">
          <span class="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">{{ featuredPost.category }} &mdash; {{ featuredPost.date }}</span>
          <h2 class="text-2xl md:text-4xl font-medium text-gray-800 mb-4 group-hover:text-green-700 transition-colors">{{ featuredPost.title }}</h2>
          <p class="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
            {{ featuredPost.excerpt }}
          </p>
          <button class="text-xs font-bold tracking-widest uppercase text-gray-800 border-b border-gray-800 pb-1 hover:text-green-700 hover:border-green-700 transition-colors">
            Read Article
          </button>
        </div>
      </div>

      <!-- Recent Posts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
        
        <article 
          v-for="(post, index) in recentPosts" 
          :key="index"
          class="flex flex-col group cursor-pointer"
        >
          <!-- Thumbnail -->
          <div class="relative h-[250px] md:h-[300px] rounded-sm overflow-hidden mb-6 shadow-md">
            <img :src="post.image" :alt="post.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-green-700 rounded-sm">
              {{ post.category }}
            </div>
          </div>
          
          <!-- Post Details -->
          <div class="flex flex-col flex-grow">
            <span class="text-xs text-gray-400 tracking-wider mb-2">{{ post.date }}</span>
            <h3 class="text-xl font-medium text-gray-800 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
              {{ post.title }}
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3 flex-grow">
              {{ post.excerpt }}
            </p>
            <div class="mt-auto">
              <span class="text-xs font-semibold uppercase tracking-widest text-gray-800 flex items-center gap-2 group-hover:text-green-700 transition-colors">
                Read More 
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </span>
            </div>
          </div>
        </article>

      </div>
      
      <!-- Pagination / Load More -->
      <div class="mt-20 flex justify-center">
        <button class="px-10 py-3 text-xs font-semibold text-gray-800 border border-gray-300 rounded-full hover:bg-gray-900 hover:text-white transition duration-500 uppercase tracking-widest">
          Load More Stories
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "BlogPage",
  data() {
    return {
      featuredPost: {
        title: "A Guide to Foraging in the Ta Chamnab Farm",
        category: "Nature",
        date: "October 12, 2026",
        excerpt: "Step outside the luxury of your villa and into the untamed wilderness. Our resident botanist shares the secrets of the surrounding forest, detailing the edible flora and medicinal plants that have sustained local communities for generations.",
        image: "/picture/2.jpg"
      },
      recentPosts: [
        {
          title: "The Art of Traditional Balinese Massage",
          category: "Wellness",
          date: "September 28, 2026",
          excerpt: "Discover the ancient techniques used at Avani Spa. From deep tissue pressure to gentle stretching, learn how this historic practice restores the body's natural energy flow.",
          image: "/picture/10git remote -v1.jpg"
        },
        {
          title: "Sourcing Local: Ta Chamnab's Culinary Journey",
          category: "Dining",
          date: "September 15, 2026",
          excerpt: "Our head chef takes you behind the scenes, exploring the high-altitude farms and local markets that provide the organic ingredients for our signature dishes.",
          image: "/picture/108.jpg"
        },
        {
          title: "Top 5 Hiking Trails Around Chamnab Resort",
          category: "Adventure",
          date: "August 30, 2026",
          excerpt: "Whether you are a novice walker or an experienced mountaineer, the peaks surrounding the resort offer trails with breathtaking panoramic views and hidden waterfalls.",
          image: "/picture/89.jpg"
        }
      ]
    };
  }
}
</script>