<template>
  <section class="section event has-text-left" v-if="!loading">
    <div class="columns is-centered" v-if="event.attributes">
      <div class="column is-8">
        <h2 class="title">{{ event.attributes.name }}</h2>
      </div>
    </div>
    <div class="columns is-centered metadata">
      <div class="column is-8">
        <h2 class="subtitle">{{ getRange(event.attributes.start_at, event.attributes.end_at) }}</h2>
      </div>
    </div>
    <div class="columns is-centered metadata">
      <div class="column is-8">
        <h2 class="subtitle">{{ place[event.attributes.place_id].attributes.name }} - <span class="is-size-6">{{ place[event.attributes.place_id].attributes.address_no_country }}</span>
          <a :href="'https://www.openstreetmap.org/#map=17/' + place[event.attributes.place_id].attributes.latitude + '/' + place[event.attributes.place_id].attributes.longitude" target="_blank" class="tag is-primary">{{ $texts[$i18n.locale].see_map }}</a> 
        </h2>
      </div>
    </div>
    <div class="columns is-centered" >
      <div class="column is-8">
        <figure class="image" v-if="event.attributes.image_url">
          <img
            :src="event.attributes.image_url.replace('development', 'production')" />
        </figure>
        <a class="is-size-6" target="_blank" :href="event.attributes.website"
          v-if="event.attributes.website">{{ event.attributes.website }}</a>
        <div class="content" v-html="event.attributes.description" />
      </div>
    </div>
    <div v-if="registrationOpen">
      <div class="columns is-centered">
        <div class="column is-8">
          <h2 class="title">{{ $texts[$i18n.locale].register_to_participate }}</h2>
        </div>
      </div>
      <form enctype="multipart/form-data" id="submission" @submit.enter.prevent="validateRegistration">
        <p class="errors" v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </p>
        <div class="columns is-centered">
          <div class="column  is-8">
            <label class="label"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].your_name }}</span> <span class="required"> *</span></label>
            <input type="text" class="input" v-model="registrationForm.name" />
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column  is-8">
            <label class="label"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].your_email }}</span> <span class="required"> *</span></label>
            <input type="text" class="input" v-model="registrationForm.email" />
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column  is-8">
            <label class="label"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].your_phone }}</span> <span class="required"> *</span></label>
            <input type="text" class="input" v-model="registrationForm.phone" />
          </div>
        </div>                
        <div class="columns is-centered" v-if="event.attributes.question_motivation">
          <div class="column  is-8">
            <label class="label"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{event.attributes.question_motivation }}</span> <span class="required"> *</span></label>
            <textarea  class="textarea" v-model="registrationForm.motivation_statement" />
          </div>
        </div>
        <div class="columns is-centered" v-if="event.attributes.question_creators">
          <div class="column  is-8">
            <label class="label"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ event.attributes.question_creators }}</span> <span class="required"> *</span></label>
            <textarea class="textarea" v-model="registrationForm.project_creators" />
          </div>
        </div>
        <div class="columns is-centered" v-if="event.attributes.question_description">
          <div class="column  is-8">
            <label class="label"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ event.attributes.question_description }}</span> <span class="required"> *</span></label>
            <textarea class="textarea" v-model="registrationForm.project_description" />
          </div>
        </div>        
        <div class="columns is-centered" v-if="event.attributes.question_description">
          <div class="column  is-8">
            <div class="field is-grouped">
              <div class="control">
                <button v-if="!submitting" class="button is-link"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].submit }}</span>
                  <vue-hcaptcha ref="invisibleHcaptcha" size="invisible" :sitekey="hk" @verify="verifiedHcaptcha"></vue-hcaptcha>
                </button>
                <img v-else src="@/assets/images/ajax-loader.gif" />
              </div>
            </div>
          </div>
        </div>
      </form>
          <!-- <div v-if="event.attributes.max_attendees">
            <div v-if="event.attributes.hide_registrants">
              <p>{{ $texts[$i18n.locale].limited_places }}</p>
              <div v-show="event.attributes.is_full">
                <p>{{ $texts[$i18n.locale].event_full }}</p>
              </div>
            <div v-else>
              <div v-if="event.attributes.require_approval">
                <p>{{ $texts[$i18n.locale].event_requires_approval }}</p>
              </div>
              <div v-else>
                <div v-if="event.attributes.is_full">
                  <p>{{ $texts[$i18n.locale].event_full }}</p>
                </div>
                <div v-else>
                </div>
              </div>
            </div> -->
      <div class="columns disclaimer is-centered">
        <div class="column is-8">
          <div class="content disclaimer is-size-5" v-html="$texts[$i18n.locale].disclaimer">
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
  import VueHcaptcha from '@hcaptcha/vue-hcaptcha'
  export default {
    data() {
      return {
        errors: [],
        locale: this.$i18n.locale,
        loading: true,
        event: {},
        place: {},
        registrationOpen: false,
        registrationForm: {},
        submitting: false,
        hk: process.env.VUE_APP_HCAPTCHA_SITE_KEY
      }
    },
    name: 'Event',
    components: { VueHcaptcha },
    methods: {
      getRange(startAt, endAt) {
        let start_date = moment(startAt).locale(this.locale).format('D')
        let end_date = moment(endAt).locale(this.locale).format('D')
        if (start_date === end_date) {
          return moment(startAt).locale(this.locale).format('LLL') + ' – ' + moment(endAt).locale(this.locale).format('LT')
        } else {
          return moment(startAt).locale(this.locale).format('D') + ' – ' + moment(endAt).locale(this.locale).format('LL')
        }
      },
      verifiedHcaptcha () {
        this.submitting = true
        let registrationUrl = ''
        this.axios({method: 'post', url: registrationUrl, data: this.registrationForm })
          .then((response) => {
            this.submitting = false
            if (response.status === 204 || response.status === 201) {
              this.notSubmitted = false
            } else {
              this.errors.push('There was an error submitting your application. Please try again or contact office@pixelache.ac if you are still having problems.')
            }
          }).catch(() => {
            this.submitting = false
            this.errors.push('There was an error submitting your application. Please try again or contact office@pixelache.ac if you are still having problems.')
          })
      },
      validateRegistration () {
        // validate form
        this.errors = []
        // this.opencall.attributes.opencallquestions.forEach((question, index) => {
        //   if (question.is_required) {
        //     if (!this.opencallResponse[question.id]) {
        //       this.errors.push('You must complete question #' + parseInt(index + 1))
        //     }
        //   }
        // })
        // if (this.errors.length === 0) {
        this.$refs.invisibleHcaptcha.execute()
        // }
      }
    },
    created () {
      if (this.$i18n.locale === 'en') {
        this.locale = 'en-gb'
      }

    },
    mounted() {

      this.axios.get('/festivals/' + this.$pixelache.slug + '/events/' + this.$route.params.id + '?locale=' + this.$i18n.locale)
        .then((resp) => {
          this.event = resp.data.data
          this.place = normalize(resp.data, { camelizeKeys: false }).place
          this.loading = false
          if (this.event.attributes.registration_required && ( new Date(this.event.attributes.start_at) >=  new Date().getTime())) {
            this.registrationOpen = true
          }
        })


    }
  }
</script>