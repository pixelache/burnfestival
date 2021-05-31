<template>
  <section class="section post_index has-text-left" v-if="!loading">
    <div class="columns" v-if="category.attributes">
      <div class="column">
        <h2 class="title">{{ category.attributes.name }}</h2>
      </div>
    </div>
    <div class="columns" v-if="category.attributes.description">
      <div class="column">
         <figure v-if="category.attributes.image_url" class="image category_image ">
              <img
              :src="category.attributes.image_url.replace('devesopment', 'production')" />
        </figure>
        <div class="content category_description" v-html="category.attributes.description" />
      </div>
    </div>
    <div class="columns is-multiline has-text-left">
      <div class="post_wrapper column is-one-third-desktop is-half-tablet is-one-quarter-widescreen"
        v-for="contributor in contributors" :key="'contributor_' + contributor.id">
        <div class="post contributor">
          <router-link :to="{name: 'Contributor', params: { categoryId: category.attributes.slug, id: contributor.attributes.slug }}">
            <figure class="image is-square">
              <img v-if="contributor.attributes.image_box_url"
              :src="contributor.attributes.image_box_url.replace('development', 'production')" />
            </figure>
              
          </router-link>
          <h3 class="subtitle">
            <router-link :to="{name: 'Contributor', params: { id: contributor.attributes.slug }}">
              {{ contributor.attributes.name }}
            </router-link>
          </h3>
          
          <div class="content" v-html="contributor.attributes.bio" />
          <div class="block">
            <a class="is-size-6" target="_blank" :href="contributor.attributes.website" v-if="contributor.attributes.website">{{ contributor.attributes.website }}</a>
          </div>
          <div class="events">
            <ul>
              <li v-for="cr in contributor.relationships.contributor_relations.data" :key="cr.id" v-show="relations[cr.id].attributes.festival_id === $pixelache.slug">
                 >> <router-link :to="{name: 'Event', params: {id: relations[cr.id].attributes.relation_slug }}">
                   {{ relations[cr.id].attributes.relation_name }}
                 </router-link>
              </li>

            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div v-else class="while_waiting">
    <img src="@/assets/images/ajax-loader.gif">
  </div>
</template>
<script>
  import moment  from 'moment'
  import normalize from 'json-api-normalizer'
  export default {
    data() {
      return {
        loading: true,
        contributors: [],
        category: {},
        relations: {}
      }
    },

    methods: {
      getRange(startAt, endAt) {
        let start_date = moment(startAt).locale(this.locale).format('D')
        let end_date = moment(endAt).locale(this.locale).format('D')
        if (start_date === end_date) {
          return moment(startAt).locale(this.locale).format('LLL') + ' – ' + moment(endAt).locale(this.locale).format('LT')
        } else {
          return moment(startAt).locale(this.locale).format('D') + ' – ' + moment(endAt).locale(this.locale).format('LL')
        }
      }
    },
    mounted() {
      this.axios.get('/festivals/' + this.$pixelache.slug + '/festivalthemes/' + this.$route.params.categoryId)
        .then((resp) => {
          this.category = resp.data.data
        })
      this.axios.get('/festivals/' + this.$pixelache.slug + '/festivalthemes/' + this.$route.params.categoryId + '/contributors?locale=' + this.$i18n.locale)
        .then((resp) => {
          this.contributors = resp.data.data
          this.relations = normalize(resp.data, { camelizeKeys: false }).contributor_relation
          this.loading = false
        })


    }
  }
</script>