<template>
  <section class="section post_standalone post" v-if="!loading">
    <div class="container">
      <div class="columns">
        <div class="column has-text-left">
          <h3 class="title">{{ post.attributes.title }}</h3>
        </div>
      </div>
      <div class="columns">
        <div class="column has-text-left">
          <div class="posted_at"> {{ moment(post.attributes.published_at).format('Do MMMM YYYY') }}</div>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <img v-show="post.attributes.image.twelvehundred.url" :src="post.attributes.image.twelvehundred.url.replace('development', 'production')" />
        </div>
      </div>
      <div class="post_content content has-text-left" v-html="post.attributes.body" />
    </div>
    <div class="columns post_browser">
      <div class="column is-one-third">
        <div v-if="post.attributes.previous_post_by_festival">
          <b>Previous post: </b>
          <router-link :to="{name: 'Post', params: { id: post.attributes.previous_post_by_festival.slug }}">{{ post.attributes.previous_post_by_festival.title }}</router-link>
        </div>
      </div>
      <div class="column is-one-third">&nbsp;</div>
      <div class="column is-one-third">
        <div v-if="post.attributes.next_post_by_festival">
          <b>Next post: </b>
          <router-link :to="{name: 'Post', params: { id: post.attributes.next_post_by_festival.slug }}">{{ post.attributes.next_post_by_festival.title }}</router-link>
        </div>
      </div>
    </div>
  </section>
  <div v-else class="while_waiting">
    <img src="@/assets/images/ajax-loader.gif">
  </div>
</template>
<script>

export default {
  data() {
    return {
      loading: true,
      post: {},
    }
  },
  mounted () {
    this.$parent.$emit('closeMenu', true)
    this.axios.get('/festivals/' + this.$pixelache.slug + '/posts/' + this.$route.params.id + '?locale=' + this.$i18n.locale)
      .then((resp) => {
        this.post = resp.data.data
        this.loading = false
      })


  }
}
</script>