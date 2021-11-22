<template>
  <section class="section post_index has-text-left" v-if="!loading">
    <div class="columns">
      <div class="column">
        <router-link tag="h2" class="title" :to="{name: 'News'}">
          <span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].news }}</span>
        </router-link>
      </div>
    </div>
    <div class="columns is-multiline  has-text-left">
      <div class="post_wrapper column is-one-third-desktop is-half-tablet is-one-quarter-widescreen" v-for="post in posts" :key="'post_' + post.id">
        <div class="post">
          <router-link :to="{name: 'Post', params: { id: post.attributes.slug }}">
            <img v-show="post.attributes.image.box.url" :src="post.attributes.image.box.url.replace('development', 'production')" />
          </router-link>
          <h3 class="subtitle">
            <router-link :to="{name: 'Post', params: { id: post.attributes.slug }}">
              {{ post.attributes.title }}
            </router-link>
          </h3>
          <div class="posted_at"> {{ moment(post.attributes.published_at).format("Do MMMM YYYY") }}</div>
          <div class="excerpt" v-html="excerpt_or_text(post)" />
        </div>
      </div>
    </div>
    <div v-if="loadingNext" class="while_waiting">

      <img src="@/assets/images/ajax-loader.gif">
    </div>
  </section>
  <div v-else class="while_waiting">
    <img src="@/assets/images/ajax-loader.gif">
  </div>
</template>
<script>
import truncate from 'truncate-html'
export default {
  data() {
    return {
      scrolledToBottom: true,
      loading: true,
      posts: [],
      page: 1,
      loadingNext: false
    }
  },
  name: 'NewsIndex',
  methods : {
    newsScroll () {
      window.onscroll = () => {
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight) {
        
          if (this.scrolledToBottom) {
            this.scrolledToBottom = false
            this.loadingNext = true
            this.axios.get('/festivals/' + this.$pixelache.slug + '/posts?page[number]=' + parseInt(this.page+1) + '&page[size]=12&locale=' + this.$i18n.locale)
            .then((resp) => {

              if (resp.data.data.length > 0) {
                this.posts.push.apply(this.posts, resp.data.data)
                this.loadingNext = false
                this.loading = false
                this.page++
                this.scrolledToBottom = true
              }
            })
          }
        }
      }

    },

    excerpt_or_text(post) {
      if (post.attributes.excerpt) {
        return post.attributes.excerpt
      } else {
        return truncate(post.attributes.body, 40, {byWords: true, excludes: ['img'] })
      }
    }
  },
  mounted () {
    this.axios.get('/festivals/' + this.$pixelache.slug + '/posts?page[number]=' + this.page + '&page[size]=12&locale=' + this.$i18n.locale)
    .then((resp) => {

      this.posts = resp.data.data
      this.loading = false
    })
    this.newsScroll();



  }
}
</script>