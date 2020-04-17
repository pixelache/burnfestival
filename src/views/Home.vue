<template>
  <div class="home" v-if="!loading">    
    <PostsIndex />
    <section class="section festival_container">
      <div class="social_container">
        <div class="columns">
          <div class="column is-two-thirds-tablet">
            <h2 class="title">{{ moment(festival.attributes.start_at).format("Do ")}} –– {{ moment(festival.attributes.end_at).format("Do MMMM YYYY")}}</h2>
          </div>
          <div class="column is-one-third-tablet">
            <ul class="social">
              <li>
                <a href="https://www.facebook.com/pixelache">
                  <img src="@/assets/images/some_fb.png" />
                </a>
              </li>
              <li>
                <a href="https://www.flickr.com/photos/pixelache/">
                  <img src="@/assets/images/some_flickr.png" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/pixelache">
                  <img src="@/assets/images/some_twitter.png" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/pixelache/">
                  <img src="@/assets/images/some_insta.png" />
                </a>
              </li>                   
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section about_text has-text-left">
      <div class="container">
        <div class="columns">
          <div class="column">
            <div class="content has-text-left" v-html="festival.attributes.overview_text" />
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-else>
    <div class="while_waiting">
      <img src="@/assets/images/ajax-loader.gif">
    </div>
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
      loading: true,
      festival: {}
    }
  },
  mounted () {
    this.axios.get('/festivals/' + this.$pixelache.slug + '?locale=' + this.$i18n.locale)
      .then((resp) => {
        this.festival = resp.data.data
        this.loading = false
      })
  }
}
</script>
