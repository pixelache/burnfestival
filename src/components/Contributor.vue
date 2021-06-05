<template>
  <section class="section post_standalone has-text-left" v-if="!loading">
    <div class="columns is-centered" v-if="contributor.attributes">
      <div class="column is-6">
        <h2 class="title">{{ contributor.attributes.name }}</h2>
      </div>
    </div>
    <div class="columns contributor is-centered" >
      <div class="column is-6">
        <figure class="image" v-if="contributor.attributes.image_url">
          <img
            :src="contributor.attributes.image_url.replace('development', 'production')" />
        </figure>
        
        <div class="content" v-html="contributor.attributes.bio" />        
        <a class="is-size-6" target="_blank" :href="contributor.attributes.website"
          v-if="contributor.attributes.website">{{ contributor.attributes.website }}</a>
      </div>
    </div>
    <div v-if="events.length > 0" class="columns contributor_events is-centered">
      <div class="column is-6">
        <h4 class="title">{{ $texts[$i18n.locale].events }}: </h4>
        <div class="columns"> 
          <div class="column is-6" v-for="event in events" :key="event.id">
            <figure class="image is-4x3" v-if="event.attributes.relation_image">
              <img
                :src="event.attributes.relation_image.replace('development', 'production')" />
            </figure>
            <div class="content">
              <h4 class="subtitle">
                <router-link :to="{name: 'Event', params: {id: event.attributes.relation_slug }}">
                  {{ event.attributes.relation_name }}
                </router-link>
              </h4>
              <div class="metadata">
                {{ getRange(event.attributes.relation_start, event.attributes.relation_end) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="contributor.relationships.attachments.data.length > 0" class="columns contributor_events is-centered">
      <div class="column is-6">
        <h4 class="title">{{ $texts[$i18n.locale].archive }}: </h4>
        <div class="columns" v-for="attachment in contributor.relationships.attachments.data" :key="attachment.id + '_atc'"> 
          <div class="column is-6" v-if="attachments[attachment.id].attributes.attachment_festival_slug === $pixelache.slug">
            <aplayer v-if="attachments[attachment.id].attributes.attachedfile_content_type =~ /^audio/" :music="{
              title: attachments[attachment.id].attributes.attachment_event_name,
              artist: contributor.attributes.name,
              src: attachments[attachment.id].attributes.attachedfile_url
              }" />
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
  import moment from 'moment'
  import normalize from 'json-api-normalizer'
  import Aplayer from 'vue-aplayer'

  export default {
    data() {
      return {
        loading: true,
        events: [],
        contributor: {},
        attachments: {},
        locale: this.$i18n.locale,
      }
    },
    components: {
        Aplayer
    },
    name: 'Contributor',
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
    created () {
      if (this.$i18n.locale === 'en') {
        this.locale = 'en-gb'
      }
    }, 

    mounted() {

      this.axios.get('/contributors/' + this.$route.params.id + '?locale=' + this.$i18n.locale)
        .then((resp) => {
          this.contributor = resp.data.data
          this.attachments = normalize(resp.data, { camelizeKeys: false }).attachment
          let allRelations = normalize(resp.data, { camelizeKeys: false }).contributor_relation
          Object.keys(allRelations).forEach((relKey) => {
            if (allRelations[relKey].attributes.festival_id === this.$pixelache.slug ) {
              this.events.push(allRelations[relKey])
            }
          })
          this.loading = false
        })


    }
  }
</script>