<template>
  <section class="section schedule" v-if="!loading">
    <nav class=" is-hidden-mobile navbar is-centered" role="navigation" aria-label="calendar navigation">
      <div id="schedule_days" class="navbar-menu">
        <div class="navbar-start">
          <a @click="selectDay(day)" :class="moment(selectedDate).format('YYYY-MM-DD') === moment(day).format('YYYY-MM-DD') ? 'is-active' : ''" class="navbar-item" v-for="day in navCalendar" :key="moment(day).format('YYYY-MM-DD')">  {{ moment(day).locale(locale).format('ddd l').replace(/[\.\/]\d\d\d\d$/, '').replace(/\d\d\d\d\-/, '') }}</a>
        </div>
      </div>
    </nav>
    <div class="columns is-hidden-tablet">
      <div class="column">
        <div class="select">
          <select @change="selectDay($event)">
            <option> {{ $texts[$i18n.locale].choose_day }}</option>
            <option :selected="moment(selectedDate).format('YYYY-MM-DD') === moment(day).format('YYYY-MM-DD') " v-for="day in navCalendar" :value="moment(day).format('YYYY-MM-DD')" :key="moment(day).format('YYYY-MM-DD')">  {{ moment(day).locale(locale).format('ddd l').replace(/[\.\/]\d\d\d\d$/, '').replace(/\d\d\d\d\-/, '') }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="tabs is-hidden-tablet is-toggle is-fullwidth">
      <ul>
        <li v-bind:class="{ 'is-active': tabsel == 'oodi' }" @click="tabsel = 'oodi'">
          <a>Oodi Site-specific</a>
        </li>
        <li v-bind:class="{ 'is-active': tabsel == 'radio' }" @click="tabsel = 'radio'">
          <a>Radio</a>
        </li>
      </ul>
    </div>
    <div class="schedule_container">
      <div class="columns">
        <div class="column is-6 has-text-left"  v-show="!isMobile()  || tabsel == 'oodi'">
          <h3 class="title is-hidden-mobile">Oodi Site-specific</h3>
          <table class="table"  v-if="events.length > 0">
            <tbody>              
              <tr v-for="event in events" :key="event.id + '__' + moment(selectedDate).format('YYYY-MM-DD')">
                <td>
                  <span v-if="isInstallation(event)">
                    {{ $texts[$i18n.locale].durational }}
                  </span>
                  <span v-else>
                    {{moment(event.attributes.start_at).locale(locale).format("LT") }}
                  </span>
                </td>
                <td class="is-hidden-mobile">
                  <figure class="image is-128x128" v-if="event.attributes.image_thumb_url">
                    <img :src="event.attributes.image_thumb_url.replace('development', 'production')" />
                  </figure>
                </td>
                <td>
                  <router-link class="is-size-5" :to="{name: 'Event', params: {id: event.attributes.slug}}"> {{ event.attributes.name }}
                  </router-link>
                  <br />
                  <span class="is-size-7">{{ getRange(event.attributes.start_at, event.attributes.end_at) }}</span>
                  <div v-if="event.relationships.contributors.data.length > 0" class="contributor_events">
                    <span class="is-size-6">{{ $texts[$i18n.locale].contributors }}: 
                      <router-link v-show="contributors[contributorId.id]" v-for="(contributorId, index) in event.relationships.contributors.data" :key="event.id + '_' + contributorId.id" :to="{name: 'Contributor', params: {categoryId: 'site-specific', id: contributors[contributorId.id].attributes.slug }}">
                        {{ contributors[contributorId.id].attributes.name }}<span v-if="index+1 < event.relationships.contributors.data.length">, </span>
                      </router-link>
                    </span>

                  </div>
                  <div v-if="event.relationships.festivalthemes.data" class="tags">
                    <span class="tag is-dark"  v-show="festivalthemes[ft.id].attributes.slug !== 'site-specific'" v-for="ft in event.relationships.festivalthemes.data" :key="ft.id"> {{ festivalthemes[ft.id].attributes.name }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="column is-6" v-if="radio"  v-show="!isMobile() || tabsel == 'radio'">
          <h3 class="title is-hidden-mobile">Radio</h3>
          <div class="content" v-html="radio.attributes.body" />
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
  export default {
    data() {
      return {
        selectedDate: null,
        loading: false,
        tabsel: 'oodi',
        events: [],
        navCalendar: [],
        locale: null,
        radio: null,
        contributors: {},
        festivalthemes: {},
        installationId: null,
        conversationsId: null
      }
    },
    name: 'Schedule',
    methods: {
      isMobile() {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          return true
        } else {
          return false
        }
      },
      isInstallation(event) {
        return event.relationships.festivalthemes.data.map((i) => i.id).includes(this.installationId) ||
         event.relationships.festivalthemes.data.map((i) => i.id).includes(this.conversationsId) 
      },
      selectDay(day) {
        if (day.target) {
          day = day.target.value
        }
        if (day !== this.selectedDate) {
          this.selectedDate = day
          this.getDataByDay(day)
        }
      },
      getDataByDay(day) {
        this.loading = true
        this.axios.get('/festivals/' + this.$pixelache.slug + '/pages/radio-' +  moment(day).format('MM-DD')  + '?locale=' + this.$i18n.locale)
          .then((resp) => {
            this.radio = resp.data.data

          })
        this.axios.get('/festivals/' + this.$pixelache.slug + '/events/?by_date=' + moment(day).format('YYYY-MM-DD') + '&locale=' + this.$i18n.locale)
          .then((resp) => {
            this.events = []
            let allEvents = resp.data.data
            this.contributors = normalize(resp.data, { camelizeKeys: false }).contributor
            this.festivalthemes = normalize(resp.data, { camelizeKeys: false }).festivaltheme
            Object.keys(this.festivalthemes).forEach((ftId) => {
              if (this.festivalthemes[ftId]) {
                if (this.festivalthemes[ftId].attributes.slug === 'installations') {
                  this.installationId = ftId
                } else if (this.festivalthemes[ftId].attributes.slug === 'conversation') {
                  this.conversationsId = ftId
                }
              } else {
                console.log(ftId)
              }
            })
            let installations = []
            allEvents.forEach((e) => {
              if (this.isInstallation(e)) {
                installations.push(e)
              } else { 
                this.events.push(e)
              }
            })
            this.events.push.apply(this.events, installations)
            this.loading = false
          })
      },
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
    beforeMount() {
       if (this.$i18n.locale === 'en') {
        this.locale = 'en-gb'
      } else {
        this.locale = this.$i18n.locale
      }
      const now = new Date()
      let start = moment('2021-06-06')
      const theEnd = moment('2021-06-14')
      if (now <= start || now >= theEnd) {
        this.selectedDate = moment(start).format('YYYY-DD-MM')
      } else {
        this.selectedDate =  moment(now).format('YYYY-DD-MM')
      }
      while(start.isBefore(theEnd, 'day')) {
        this.navCalendar.push(start.toDate())
        start.add(1, 'days')
      }
    },

    mounted () {
      this.$parent.$emit('closeMenu', true)
      this.getDataByDay(this.selectedDate)
    }
  }
</script>