<template>
  <div>
    <img class="burn_banner" alt="Vue logo" src="@/assets/images/burnbanner.jpg">
    <PostsIndex />
  </div>
</template>

<script>
// @ is an alias to /src
import PostsIndex from '@/components/PostsIndex.vue'

export default {
  name: 'Home',
  components: {
    PostsIndex
  },
  data () {
    return {

    }
  },
  props: {
    festival: {}
  },
  mounted () {
    
  }
}
</script>
