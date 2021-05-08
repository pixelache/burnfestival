<template>
  <section class="section" v-if="!loading">
    <div class="opencall_container">
      <div class="columns">
        <div class="column has-text-left">
          <h3 class="title">{{ opencall.attributes.name }}</h3>
        </div>
      </div>
      <div class="columns">
        <div class="column is-two-thirds-tablet is-centered">
          <div class="content opencall has-text-left" v-html="opencall.attributes.description" />
        </div>
      </div>
      <div v-if="active">
        <form v-if="notSubmitted" enctype="multipart/form-data" id="submission" @submit.enter.prevent="validateOpencall">
          <p class="errors" v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in errors" :key="error">{{ error }}</li>
              </ul>
            </p>
          <div class="columns">
            <div class="column  is-two-thirds-tablet">
              <label class="label"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].your_name }}</span> <span class="required"> *</span></label>
              <input type="text" class="input" v-model="opencallResponse.name" />
            </div>
          </div>
          <div class="columns">
            <div class="column is-two-thirds-tablet">
              <label class="label"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].your_email }}</span><span class="required"> *</span></label>
              <input type="text" class="input" v-model="opencallResponse.email" />
            </div>
          </div>
          <div class="columns">
            <div class="column is-two-thirds-tablet">
              <label class="label"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].your_phone }}</span></label>
              <input type="text" class="input" v-model="opencallResponse.phone" />
            </div>
          </div>

          <div class="columns" v-for="(question, index) in opencall.attributes.opencallquestions" :key="question.id">
            <div class="column is-two-thirds-tablet">
              <div class="field">

                <label class="label">
                  {{ index + 1}}. {{ question.question_text }}
                  <span v-if="question.is_required" class="required"> *</span>
                </label>

                <div class="field-body">
                  <textarea v-if="question.question_type === 1" class="textarea" v-model="opencallResponse[question.id]" />
                  <input v-else-if="question.question_type === 2 || question.question_type === 6" class="input" type="text" v-model="opencallResponse[question.id]" />
                  <div v-else-if="question.question_type === 3" class="file" >
                    <input class="file-insput" type="file" :ref="'file_' +question.id" @change="previewFiles($event, question.id)" />
  <!--                   <span class="file-cta">
                      <span class="file-label">
                        Choose a file…
                      </span>
                    </span> -->
                  </div>
                  <input v-else-if="question.question_type === 4" class="input" type="url" v-model="opencallResponse[question.id]" />
                  <div class="select" v-else-if="question.question_type === 5">
                    <select v-model="opencallResponse[question.id]">
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <input v-else class="input" type="text" v-model="opencallResponse[question.id]" />
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-two-thirds-tablet">
              
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button v-if="!submitting" class="button is-link"><span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].submit }}</span>
                <vue-hcaptcha ref="invisibleHcaptcha" size="invisible" :sitekey="hk" @verify="verifiedHcaptcha"></vue-hcaptcha>
              </button>
              <img v-else src="@/assets/images/ajax-loader.gif" />
            </div>
          </div>
        </form>
        <div v-else>
          <div class="columns">
            <div class="column is-two-thirds-tablet">
              <p class="is-size-5" v-html="opencall.attributes.submitted_text"></p>
              <br />
              <router-link tag="button" class="button" to="/">Return to the frontpage</router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="columns">
        <section class="section">
          <p>This open call is currently closed.</p>
        </section>
      </div>
    </div>
  </section>
  <section v-else>
    <div class="while_waiting">
      <img src="@/assets/images/ajax-loader.gif">
    </div>
  </section>
</template>

<script>
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'
export default {
  components: { VueHcaptcha },
  data() {
    return {
      errors: [],
      loading: true,
      active: false,
      tmpFiles: {},
      filePreviews: {},
      submitting: false,
      formData: new FormData(),
      notSubmitted: true,
      opencall: {},
      opencallResponse: {},
      hk: process.env.VUE_APP_HCAPTCHA_SITE_KEY
    }
  },
  name: 'Opencall',
  methods : {
    previewFiles (file, id) {
      let files = this.$refs['file_' + id][0].files
      this.tmpFiles[id] = this.$refs['file_' + id]
      let reader = new FileReader()
      reader.onload = (event) => {
        this.filePreviews[id] = event.target.result
      }
      // console.log(event.target.files)
      reader.readAsDataURL(files[0])
      this.formData.append('opencallsubmission[opencallanswers_attributes][' + id + '][attachment]', files[0])
    },
    verifiedHcaptcha () {
      this.submitting = true
      let opencallsubmissionUrl = '/opencalls/' + this.$route.params.id + '/opencallsubmissions?locale=' + this.$i18n.locale
      this.formData.append('opencallsubmission[name]', this.opencallResponse.name)
      this.formData.append('opencallsubmission[email]', this.opencallResponse.email)
      this.formData.append('opencallsubmission[opencall_id]',this.opencall.id)
      this.formData.append('opencallsubmission[phone]', this.opencallResponse.phone)
      this.opencall.attributes.opencallquestions.forEach((question) => {
        if (this.opencallResponse[question.id]) {
          this.formData.append('opencallsubmission[opencallanswers_attributes][' + question.id + '][opencallquestion_id]', question.id)
          // if (question.question_type !== 4) {
            this.formData.append('opencallsubmission[opencallanswers_attributes][' + question.id + '][answer]', this.opencallResponse[question.id])
          // } 
        }
      })
      // console.log(this.formData)
      this.axios({method: 'post', url: opencallsubmissionUrl, data: this.formData,
                  header: {
                    'Content-Type' : 'multipart/form-data'
                  }                  
      })
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
    validateOpencall () {
      // validate form
      this.errors = []
      this.opencall.attributes.opencallquestions.forEach((question, index) => {
        if (question.is_required) {
          if (!this.opencallResponse[question.id]) {
            this.errors.push('You must complete question #' + parseInt(index + 1))
          }
        }
      })
      if (this.errors.length === 0) {
        this.$refs.invisibleHcaptcha.execute()
      }
    }
  },
  created () {
    this.$parent.$emit('closeMenu', true)
    this.axios.get('/opencalls/' + this.$route.params.id + '?locale=' + this.$i18n.locale)
      .then((resp) => {
        this.opencall = resp.data.data
        this.loading = false
        if (Date.parse(this.opencall.attributes.closing_date) > new Date()) {
          this.active = true
        }
      })


  }
}
</script>