<template>
  <section class="section" v-if="!loading">
    <div class="container">
      <div class="columns">
        <div class="column has-text-centered">
          <h3 class="title">{{ page.attributes.name }}</h3>
        </div>
      </div>
      <div class="columns">
        <img v-if="page.attributes.photos.length > 0"  :src="page.attributes.photos[0].twelvehundred.url.replace('development', 'production')" />
        <div class="page_content" v-html="page.attributes.body" />
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
      page: {},
    }
  },
  mounted () {
    this.axios.get('/festivals/' + this.$pixelache.slug + '/pages/' + this.$route.params.id + '?locale=' + this.$i18n.locale)
      .then((resp) => {
        this.page = resp.data.data
        this.loading = false
      })


  }
}
</script>