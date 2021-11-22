<template>
  <section class="section search_results" v-if="!searching">
    <div class="container" v-if="noHits">
      <div class="columns">
        <div class="column">
          <h1 class="title">{{ $texts[$i18n.locale].no_results_title }}</h1>
          <p>{{ $texts[$i18n.locale].no_results_text }}</p>
        </div>
      </div>
    </div>
    <div class="container"  v-else>
      <div class="columns">
        <div class="column">
          <h1 class="title">{{ $texts[$i18n.locale].search_results }} <em>{{ searchTerm }}</em></h1>          
        </div>
      </div>
      <div v-if="results[0].events.data.length > 0">
        <div class="columns">
          <div class="column">
            <h2 class="subtitle is-size-3">{{ $texts[$i18n.locale].events }}:</h2>
          </div>
        </div>
        <div class="columns is-multiline  has-text-left">
          <div class="post_wrapper column is-one-third-desktop is-half-tablet is-one-quarter-widescreen" v-for="event in results[0].events.data" :key="'event' + event.id">
            <div class="event">
              <router-link :to="{name: 'Event', params: { id: event.attributes.slug }}">
                <figure class="image is-square" >
                  <img v-if="event.attributes.image_box_url" :src="event.attributes.image_box_url.replace('development', 'production')" />
                  <img v-else src="@/assets/images/transparent-1px.png" height="400" />
                </figure>
              </router-link>
              <h3 class="subtitle">
                <router-link :to="{name: 'Event', params: { id: event.attributes.slug }}">
                  {{ event.attributes.name }}
                </router-link>
              </h3>
              <div class="posted_at">{{ getRange(event.attributes.start_at, event.attributes.end_at) }}</div>
              <div v-if="event.relationships.festivalthemes.data" class="tags">
                <span class="tag is-dark"  v-show="festivalthemes[ft.id].attributes.slug !== 'site-specific'" v-for="ft in event.relationships.festivalthemes.data" :key="ft.id"> {{ festivalthemes[ft.id].attributes.name }}</span>
                <span class="tag is-primary" v-show="event.attributes.registration_required && !event.attributes.is_full">{{ $texts[$i18n.locale].registration_required }}</span>
                    <span class="tag is-primary full" v-show="event.attributes.registration_required && event.attributes.is_full">{{ $texts[$i18n.locale].registration_required_full }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="results[1].contributors.data.length > 0">
        <div class="columns">
          <div class="column">
            <h2 class="subtitle is-size-3">{{ $texts[$i18n.locale].contributors }}:</h2>
          </div>
        </div>
        <div class="columns is-multiline has-text-left">
          <div class="post_wrapper column is-one-third-desktop is-half-tablet is-one-quarter-widescreen"
            v-for="contributor in results[1].contributors.data" :key="'contributor_' + contributor.id">
            <div class="post contributor">
              <router-link :to="{name: 'Contributor', params: {  categoryId: categories[contributor.relationships.festivalthemes.data[0].id].attributes.slug, id: contributor.attributes.slug }}">
                <figure class="image is-square">
                  <img  v-if="contributor.attributes.image_box_url" 
                  :src="contributor.attributes.image_box_url.replace('development', 'production')" />
                    <img v-else src="@/assets/images/transparent-1px.png" height="400" />
                </figure>
                  
              </router-link>
              <h3 class="subtitle">
                <router-link :to="{name: 'Contributor', params: { categoryId: categories[contributor.relationships.festivalthemes.data[0].id].attributes.slug, id: contributor.attributes.slug }}">
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
      </div>
      
      <div v-if="results[2].news.data.length > 0">
        <div class="columns">
          <div class="column">
            <h2 class="subtitle is-size-3">{{ $texts[$i18n.locale].news }}:</h2>
          </div>
        </div>
        <div class="columns is-multiline  has-text-left">
          <div class="post_wrapper column is-one-third-desktop is-half-tablet is-one-quarter-widescreen" v-for="post in results[2].news.data" :key="'post_' + post.id">
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
      </div>
    </div>

  </section>
  <div v-else class="while_waiting">
      <img src="@/assets/images/ajax-loader.gif">
    </div>
</template>
<script>
import moment from 'moment-timezone'
import normalize from 'json-api-normalizer'
import truncate from 'truncate-html'
export default {
  data() {
    return {
      festivalthemes: {},
      searching: true,
      results: {},
      locale: null,
      noHits: true,
      searchTerm: null,
      relations: {},
      categories: {}
    }
  },
  name:'SearchResults',
  created () {

    if (this.$i18n.locale === 'en') {
      this.locale = 'en-gb'
    }
    this.searchTerm = this.$route.params.term
  },
  methods : {
    getRange(startAt, endAt) {
      let start_date = moment(startAt).locale(this.locale).format('D')
      let end_date = moment(endAt).locale(this.locale).format('D')
      if (start_date === end_date) {
        return moment(startAt).locale(this.locale).tz('Europe/Helsinki').format('LLL') + ' – ' + moment(endAt).locale(this.locale).tz('Europe/Helsinki').format('LT')
      } else {
        return moment(startAt).locale(this.locale).tz('Europe/Helsinki').format('D') + ' – ' + moment(endAt).locale(this.locale).tz('Europe/Helsinki').format('LL')
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
    this.$parent.$emit('closeMenu', true)
    this.axios.get('/festivals/' + this.$pixelache.slug + '/festivalthemes/')
      .then((resp) => {
        this.categories = normalize(resp.data).festivaltheme
      })
    this.axios.post('/festivals/' + this.$pixelache.slug + '/search?searchterm=' + this.$route.params.term + '&locale=' + this.$i18n.locale)
      .then((resp) => {
        this.results = resp.data

        if (this.results[0].events.data.length > 0) {
          this.festivalthemes = normalize(this.results[0].events, { camelizeKeys: false }).festivaltheme
          this.noHits = false
        }
        if (this.results[1].contributors.data.length > 0) {
          this.noHits = false
          this.relations = normalize(this.results[1].contributors, { camelizeKeys: false }).contributor_relation
        } 
        if (this.results[2].news.data.length > 0) {
          this.noHits = false
        }
        if (this.noHits == false) {
          this.$parent.$emit('clearSearch', true)
          this.$parent.$emit('closeMenu', true)
        }
        this.searching = false
      })


  }

}
</script>