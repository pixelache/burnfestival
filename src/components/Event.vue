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
        <h2 class="subtitle">{{ place[event.attributes.place_id].attributes.name }}  
          <div v-if="event.attributes.place_id === 189">

            <!-- target="_blank" href="#" class="tag is-primary">{{ $texts[$i18n.locale].listen }}</a>   -->
          <!-- <a v-if="event.attributes.place_id === 189" target="_blank" href="#" class="tag is-primary">{{ $texts[$i18n.locale].listen }}</a>   -->
          </div>
          <span v-else class="is-size-6"> - {{ place[event.attributes.place_id].attributes.address_no_country }}</span>
            <router-link target="_blank" :to="{name: 'Page', params: {id: 'site-map'}}" class="tag is-primary">{{ $texts[$i18n.locale].see_map }}</router-link> 
          </span>
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
    <div v-if="event.relationships.contributors" class="event_contributor columns is-centered">
      <div class="column is-8">
        <h3 class="title"><span v-if="event.relationships.contributors.data.length === 1">{{ $texts[$i18n.locale].contributor }}</span><span v-else>{{ $texts[$i18n.locale].contributors }}</span>: </h3>
        
        <div class="columns is-multiline  has-text-left" v-if="event.relationships.contributors">   
          <div class="post_wrapper column is-half-desktop is-full-tablet" v-for="contributor in event.relationships.contributors.data" :key="'contributor' + contributor.id">
            <div class="post contributor">
              <router-link :to="{name: 'Contributor', params: { categoryId: contributors[contributor.id].attributes.slug, id: contributors[contributor.id].attributes.slug }}">
                <figure class="image is-square">
                  <img  v-if="contributors[contributor.id].attributes.image_box_url" 
                  :src="contributors[contributor.id].attributes.image_box_url.replace('development', 'production')" />
                   <img v-else src="@/assets/images/transparent-1px.png" height="600" />
                </figure>
                  
              </router-link>
              <h3 class="subtitle is-size-4">
                <router-link :to="{name: 'Contributor', params: { id: contributors[contributor.id].attributes.slug }}">
                  {{ contributors[contributor.id].attributes.name }}
                </router-link>
              </h3>
              
              <div class="content" v-html="contributors[contributor.id].attributes.bio" />
              <div class="block">
                <a class="is-size-6" target="_blank" :href="contributors[contributor.id].attributes.website" v-if="contributors[contributor.id].attributes.website">{{ contributors[contributor.id].attributes.website }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns disclaimer is-centered">
      <div class="column is-8">
        <div class="content disclaimer is-size-5" v-html="$texts[$i18n.locale].disclaimer">
        </div>
      </div>
    </div>
    <div v-if="registrationOpen">
      <div class="columns is-centered">
        <div class="column is-8">
          <h2 class="title">{{ $texts[$i18n.locale].register_to_participate }}</h2>
          <p class="content" v-if="event.attributes.max_attendees">
            {{ evaluateRegStatus() }}
          </p>
        </div>
      </div>
      <form v-if="notSubmitted" enctype="multipart/form-data" id="submission" @submit.enter.prevent="validateRegistration">
        <div class="columns is-centered" v-if="errors.length">
          <div class="column  is-8">
            <p class="errors">
              <b>{{ $texts[$i18n.locale].registration_errors }}</b>
              <ul>
                <li v-for="error in errors" :key="error">{{ error }}</li>
              </ul>
            </p>
          </div>
        </div>
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
        <div class="columns is-centered">
          <div class="column  is-8">
            <div class="field is-grouped">
              <div class="control">
                <button v-if="!submitting" :disabled="isFormValid" class="button is-link"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].submit }}</span>
                  <vue-hcaptcha ref="invisibleHcaptcha" size="invisible" :sitekey="hk" @verify="verifiedHcaptcha"></vue-hcaptcha>
                </button>
                <img v-else src="@/assets/images/ajax-loader.gif" />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div v-else>
        <div v-if="successfulRegistration" class="columns is-centered">
          <div class="column is-8">
            {{ $texts[$i18n.locale].successful_registration }}
          </div>
        </div>
        <div v-else>
          There was an error. Please contact office@pixelache.ac.
        </div>
      </div>
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
        contributors: {},
        errors: [],
        locale: this.$i18n.locale,
        loading: true,
        event: {},
         festivalthemes: {},
        successfulRegistration: false,
        place: {},
        notSubmitted: true,
        registrationOpen: false,
        registrationForm: {},
        submitting: false,
        hk: process.env.VUE_APP_HCAPTCHA_SITE_KEY
      }
    },
    name: 'Event',
    components: { VueHcaptcha },
    computed: { 
        isFormValid () {
          let valid = this.registrationForm.name || this.registrationForm.email || this.registrationForm.phone
          if (valid) {
            if (this.event.attributes.question_motivation) {
              valid = this.registrationForm.motivation_statement ? true : false
            }
            if (this.event.attributes.question_creators) {
              valid = this.registrationForm.project_creators ? true : false
            }
            if (this.event.attributes.question_description) {
              valid = this.registrationForm.project_description ? true : false
            }
          }
          return !valid
       }
    },
    methods: {
      evaluateRegStatus () {
        let message = ''
        if (this.event.attributes.hide_registrants) {
          if (this.event.attributes.is_full) {
            message = this.$texts[this.$i18n.locale].event_full
          }
        } else {
          if (this.event.attributes.require_approval) {
            message = this.$texts[this.$i18n.locale].event_requires_approval
          } else {
            if (this.event.attributes.is_full) {
              message = this.$texts[this.$i18n.locale].event_full
            } else {
              message = this.$texts[this.$i18n.locale].places_left  + this.event.attributes.free_places
            }
          }
        }
        return message
      },
      getRange(startAt, endAt) {
        let start_date = moment(startAt).locale(this.locale).format('D')
        let end_date = moment(endAt).locale(this.locale).format('D')
        if (start_date === end_date) {
          return moment(startAt).locale(this.locale).format('LLL') + ' – ' + moment(endAt).locale(this.locale).format('LT')
        } else {
          return moment(startAt).locale(this.locale).format('D') + ' – ' + moment(endAt).locale(this.locale).format('LL')
        }
      },
      verifiedHcaptcha (token) {
        this.submitting = true
        let data =  {"h-captcha-response": token, attendee: this.registrationForm  }
        let registrationUrl = '/events/' + this.$route.params.id +'/attendees'
        this.axios({method: 'post', url: registrationUrl, data: data})
          .then((response) => {
            this.submitting = false
            if (response.status === 204 || response.status === 201) {
              this.notSubmitted = false
              this.successfulRegistration = true
            } else if (response.status === 422) {

               console.log(response)
              this.errors.push(response.data.errors.map((e) => e.title ).join('; '))
            } else {
              this.errors.push(this.$texts[this.$i18n.locale].registration_error)
            }
          }).catch(error => {

            if (error.response.data.errors) {
              this.errors.push(error.response.data.errors.map((e) => e.title ).join('; '))
            }
            this.submitting = false
            this.errors.push(this.$texts[this.$i18n.locale].registration_error)
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
          this.contributors = normalize(resp.data, { camelizeKeys: false }).contributor
          this.festivalthemes = normalize(resp.data, { camelizeKeys: false }).festivaltheme
          this.loading = false
          if (this.event.attributes.registration_required && ( new Date(this.event.attributes.start_at) >=  new Date().getTime())) {
            this.registrationOpen = true
          }
        })


    }
  }
</script>