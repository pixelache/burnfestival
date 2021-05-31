<template>
  <div>
    <img class="burn_banner" alt="Pixleache 2021 Burn" src="@/assets/images/burnbanner.jpg">
    <PostsIndex />
    <center>
      <img class="supporters" alt="Funders and supporters" src="@/assets/images/logos.png">
    </center>
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
