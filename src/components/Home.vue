<template>
  <div>
    <img class="burn_banner" alt="Pixleache 2021 Burn" src="@/assets/images/burnbanner.jpg">
    <!-- <section class="section streams">
   
        <div class="columns ">
          <div class="column is-6 has-text-left">
            <div class="radio_wrapper">
              <h1 class="title">{{ $texts[$i18n.locale].listen_live }} - Pixelache Radio</h1>
              <RadioPlayer />
              <div v-if="activeDate">
                <h3 class="subtitle">{{ $texts[$i18n.locale].radio_for }}: {{ moment(activeDate).locale(locale).format('LL' )}}</h3>
                <div class="radio_schedule content" v-html="todaysRadio" />
                <router-link :to="{name: 'Schedule'}" class="is-size-5"> {{ $texts[$i18n.locale].full_radio_schedule }}</router-link>
              </div>
            </div>
          </div>
          <div class="column is-6 has-text-left">
            <h1 class="title">{{ $texts[$i18n.locale].watch_online }}</h1>
            <div class="twitch">
              <div class="twitch-video has-text-left">
                <VueTwitchPlayer :channel="'pixelache'" width="100%" height="100%" />
                <div class="block" v-if="currentlyStreaming">
                  <p>
                    &nbsp;
                  </p>
                  <p>
                    {{ $texts[$i18n.locale].currently_streaming }}:
                    <router-link :to="{name: 'Event', params: {id: currentlyStreaming.attributes.slug }}">{{ currentlyStreaming.attributes.name }}
                    </router-link> - {{ getRange(currentlyStreaming.attributes.start_at, currentlyStreaming.attributes.end_at) }}
                    </p>
                </div>
                <div v-else class="block">
                  <p>
                    &nbsp;
                  </p>
                  <p>
                    {{ $texts[$i18n.locale].nothing_live }}
                  </p>
                </div>
                <div v-if="nextStream">
                  {{ $texts[$i18n.locale].streaming_next }}:
                  <router-link :to="{name: 'Event', params: {id: nextStream.attributes.slug }}">{{ nextStream.attributes.name }}
                  </router-link> - {{ getRange(nextStream.attributes.start_at, nextStream.attributes.end_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
  
    </section> -->
    <PostsIndex />

  </div>
</template>

<script>
// @ is an alias to /src
import moment from 'moment-timezone'
import PostsIndex from '@/components/PostsIndex.vue'
// import VueTwitchPlayer from 'vue-twitch-player'
import truncate from 'truncate-html'
// import RadioPlayer from '@/components/RadioPlayer'
export default {
  name: 'Home',
  components: {
    PostsIndex,
    // VueTwitchPlayer,
    // RadioPlayer
  },
  data () {
    return {
      activeDate: null,
      todaysRadio: null,
      currentlyStreaming: null,
      nextStream: null,
      streamingEvents: []
    }
  },
  props: {
    festival: {}
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
      }
  },
  beforeMount () {
     if (this.$i18n.locale === 'en') {
      this.locale = 'en-gb'
    } else {
      this.locale = this.$i18n.locale
    }
    const now = new Date()
    let start = moment('2021-06-06')
    const theEnd = moment('2021-06-14')

    if (now <= start) {
      this.activeDate = moment(start)
    } else if (now >= theEnd) {
      this.activeDate = null
    } else {
      this.activeDate =  moment(now)
    }
    if (this.activeDate) {
      this.axios.get('/festivals/' + this.$pixelache.slug + '/events/?streaming=true&locale=' + this.$i18n.locale)
        .then((resp) => {
            this.streamingEvents = resp.data.data
            this.streamingEvents.forEach((event) => {
             
              if (event.attributes.start_at < moment(now).toISOString()) {
                if (event.attributes.end_at > moment(now).toISOString()) {
                  this.currentlyStreaming = event
                }
              } else if (event.attributes.start_at > moment(now).toISOString()) {
                if (this.nextStream) {
                  if (event.attributes.start_at < this.nextStream.attributes.start_at) {
                    this.nextStream = event
                  }
                } else {
                  this.nextStream = event
                }
              } else {
                 console.log('checking ' + event.attributes.name)
                 console.log(event.attributes.start_at)
                 console.log(moment(now).toISOString())
              }
            })
        })
      this.axios.get('/festivals/' + this.$pixelache.slug + '/pages/radio-' + this.activeDate.format('MM-DD')  + '?locale=' + this.$i18n.locale)
        .then((resp) => {
          this.todaysRadio = truncate(resp.data.data.attributes.body, 200, {byWords: true })
        })
    }
  },
  mounted () {
    
  }
}
</script>
