<template>
  <section class="section post_index has-text-left" v-if="!loading">
    <div class="columns" v-if="category.attributes">
      <div class="column">
        <h2 class="title">{{ category.attributes.name }}</h2>
      </div>
    </div>
    <div class="columns" v-if="category.attributes.description">
      <div class="column">
        <div class="content" v-html="category.attributes.description" />
      </div>
    </div>
    <div class="columns is-multiline has-text-left">
      <div class="post_wrapper column is-one-third-desktop is-half-tablet is-one-quarter-widescreen"
        v-for="contributor in contributors" :key="'contributor_' + contributor.id">
        <div class="post">
          <router-link :to="{name: 'Contributor', params: { categoryId: category.attributes.slug, id: contributor.attributes.slug }}">
            <img v-if="contributor.attributes.image_url"
              :src="contributor.attributes.image_url.replace('dsevelopment', 'production')" />
          </router-link>
          <h3 class="subtitle">
            <router-link :to="{name: 'Contributor', params: { id: contributor.attributes.slug }}">
              {{ contributor.attributes.name }}
            </router-link>
          </h3>
          <a class="is-size-6" target="_blank" :href="contributor.attributes.website" v-if="contributor.attributes.website">{{ contributor.attributes.website }}</a>
          <div class="content" v-html="contributor.attributes.bio" />
        </div>
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
        contributors: [],
        category: {}
      }
    },

    methods: {
    },
    mounted() {
      this.axios.get('/festivals/' + this.$pixelache.slug + '/festivalthemes/' + this.$route.params.categoryId)
        .then((resp) => {
          this.category = resp.data.data
        })
      this.axios.get('/festivals/' + this.$pixelache.slug + '/festivalthemes/' + this.$route.params.categoryId + '/contributors?locale=' + this.$i18n.locale)
        .then((resp) => {
          this.contributors = resp.data.data
          this.loading = false
        })


    }
  }
</script>