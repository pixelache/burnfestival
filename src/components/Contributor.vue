<template>
  <section class="section contributor has-text-left" v-if="!loading">
    <div class="columns is-centered" v-if="contributor.attributes">
      <div class="column is-6">
        <h2 class="title">{{ contributor.attributes.name }}</h2>
      </div>
    </div>
    <div class="columns is-centered" >
      <div class="column is-6">
        <figure class="image" v-if="contributor.attributes.image_url">
          <img
            :src="contributor.attributes.image_url.replace('dsevelopment', 'production')" />
        </figure>
        <a class="is-size-6" target="_blank" :href="contributor.attributes.website"
          v-if="contributor.attributes.website">{{ contributor.attributes.website }}</a>
        <div class="content" v-html="contributor.attributes.bio" />
      </div>
    </div>
  </section>
  <div v-else class="while_waiting">
    <img src="@/assets/images/ajax-loader.gif">
  </div>
</template>
<script>
  // import truncate from 'truncate-html'
  export default {
    data() {
      return {
        loading: true,
        contributor: {},
      }
    },

    methods: {
    },
    mounted() {

      this.axios.get('/contributors/' + this.$route.params.id + '?locale=' + this.$i18n.locale)
        .then((resp) => {
          this.contributor = resp.data.data
          this.loading = false
        })


    }
  }
</script>