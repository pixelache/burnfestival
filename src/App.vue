<template>
  <div id="app">
    <nav class="navbar top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">
          <img src="@/assets/images/burn_logo.png" />
        </router-link>
        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="burnNav">
           <span aria-hidden="true"></span>
           <span aria-hidden="true"></span>
           <span aria-hidden="true"></span>
         </a>
      </div>
      <div id="burnNav" class="navbar-menu">
        <div class="navbar-start">
          <div class="navbar-link navbar-item has-dropdown is-hoverable" :class="$route.name == 'Page' && !$route.fullPath.match(/oodi$/) && !$route.fullPath.match(/map$/) ? 'about-active' : ''">
            <router-link class="navbar-item" :to="{name: 'Page', params: {id: 'about'}}">
              <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].about }}</span>
            </router-link>
            <div class="navbar-dropdown">
              <router-link class="navbar-item" :to="{name: 'Page', params: {id: 'curatorial-notes'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].curatorial }}</span>
              </router-link>
              <router-link class="navbar-item" :to="{name: 'Page', params: {id: 'production'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].production }}</span>
              </router-link>
              <router-link class="navbar-item" :to="{name: 'Page', params: {id: 'partners'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].partners }}</span>
              </router-link>
              <router-link class="navbar-item" :to="{name: 'Page', params: {id: 'support'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].support }}</span>
              </router-link>
              <router-link class="navbar-item" :to="{name: 'Page', params: {id: 'practical-info'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].practical_info }}</span>
              </router-link>
              <router-link class="navbar-item" :to="{name: 'Page', params: {id: 'coronavirus'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].coronavirus }}</span>
              </router-link>
            </div>
          </div>


          <router-link class="navbar-item" :to="{name: 'News'}" :class="$router.currentRoute.path.match(/^\/posts/) ? 'is-active' : ''">
            <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].news }}</span>
          </router-link>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link" :class="$router.currentRoute.path.match(/contributors/) ? 'is-active' : ''">
               <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].contributors }}</span>
            </a>
            <div class="navbar-dropdown">
              <router-link class="navbar-item" :to="{name: 'Contributors', params: {categoryId: 'radio'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].radio }}</span>
              </router-link>
              <router-link class="navbar-item" :to="{name: 'Contributors', params: {categoryId: 'workshops'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].workshops }}</span>
              </router-link>
              <router-link class="navbar-item" :to="{name: 'Contributors', params: {categoryId: 'site-specific'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].site_specific }}</span>
              </router-link>  
              <router-link class="navbar-item" :to="{name: 'Contributors', params: {categoryId: 'presentations-performances'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].presentations_and_performances }}</span>
              </router-link>  
              <router-link class="navbar-item" :to="{name: 'Contributors', params: {categoryId: 'installations'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].installations }}</span>
              </router-link>
              <router-link class="navbar-item" :to="{name: 'Contributors', params: {categoryId: 'online'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].online }}</span>
              </router-link>  
            </div>
          </div>
          <router-link class="navbar-item" :to="{name: 'Schedule'}">
            <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].programme }}</span>
          </router-link>
          <div class="navbar-item has-dropdown is-hoverable has-text-centered" :class="$route.fullPath.match(/oodi$/) || $route.fullPath.match(/map$/) ? 'about-active' : ''">
            <a class="navbar-link">
               <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].venue }}</span>
            </a>
            <div class="navbar-dropdown" >
              <router-link class="navbar-item" :to="{name: 'Page', params: {id: 'oodi'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">Oodi</span>
              </router-link>
              <router-link class="navbar-item" :to="{name: 'Page', params: {id: 'site-map'}}">
                <span v-for="l in ['fi', 'en', 'ru', 'sv']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].map }}</span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <a href="#" :class="locale === 'fi' ? 'active' : ''" @click="setLocale('fi')" class="navbar-item">FI</a>
          <a href="#" :class="locale === 'en' ? 'active' : ''"  @click="setLocale('en')" class="navbar-item">EN</a>
          <a href="#" :class="locale === 'ru' ? 'active' : ''" @click="setLocale('ru')" class="navbar-item">РУ</a>
          <a href="#" :class="locale === 'sv' ? 'active' : ''" @click="setLocale('sv')" class="navbar-item">SV</a>
     
        </div>
      </div>
    </nav>
    
    <router-view :key="$route.fullPath + '?locale=' + locale" />
    <footer class="footer" v-if="!loading">    
      <div class="social_container">
        <div class="columns is-mobile">
          <div class="column is-one-third-tablet">
            <a href="https://pixelache.ac/"><img class="footer_logo" src="@/assets/images/footer_logo.png" /></a>
          </div>
          <div class="column footer_title_wrapper is-one-third-mobile has-text-centered">
            <div class="title  has-text-centered">
              <span v-for="l in ['en', 'fi', 'sv', 'ru']" :key="l" v-show="l === $i18n.locale">{{ $texts[l].date_range }}</span>
            <!-- {{ moment(festival.attributes.start_at).format("Do ")}} –– {{ moment(festival.attributes.end_at).format("Do MMMM YYYY")}} -->
            </div>
          </div>
          <div class="column social_wrapper is-one-third-mobile">
            <ul class="social">
              <li>
                <a href="https://www.facebook.com/pixelache">
                  <img src="@/assets/images/some_fb.png" />
                </a>
              </li>
              <li>
                <a href="https://www.flickr.com/photos/pixelache/">
                  <img src="@/assets/images/some_flickr.png" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/pixelache">
                  <img src="@/assets/images/some_twitter.png" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/pixelache/">
                  <img src="@/assets/images/some_insta.png" />
                </a>
              </li>                   
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      festival: {},
      locale: '',
      loading: true
    }
  },
  created () {
    this.setupMenu()
    this.$on('closeMenu', () => {
      this.closeMobileMenu()
    })
  },
  mounted () {
    if (localStorage.locale) {
      this.locale = localStorage.getItem('locale')
    }
    this.axios.get('/festivals/' + this.$pixelache.slug + '?locale=' + this.locale)
      .then((resp) => {
        this.festival = resp.data.data
        this.loading = false
      })
  },
  methods: {
    closeMobileMenu () {
      document.getElementById('burnNav').classList.remove("is-active")
    },
    setupMenu () {
      document.addEventListener('DOMContentLoaded', () => {

        // Get all "navbar-burger" elements
        const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
        const links = document.querySelectorAll('.navbar-item')

        // Check if there are any navbar burgers
        if ($navbarBurgers.length > 0) {

          // Add a click event on each of them
          $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
              // Get the target from the "data-target" attribute
              const target = el.dataset.target
              const $target = document.getElementById(target)
              // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
              el.classList.toggle('is-active')
              $target.classList.toggle('is-active')
            })
          })
          links.forEach(link => {
            link.addEventListener("click", function () {
              $navbarBurgers.forEach( el => {
                el.classList.toggle('is-active')
                const target = el.dataset.target
                const $target = document.getElementById(target)
                el.classList.remove("is-active");
                $target.classList.toggle('is-active')
              })
            })
          })
        }
      })
    },
    setLocale: function (locale) {
      this.locale = locale
      this.$i18n.locale = locale
      localStorage.setItem('locale', locale)
      // window.location.reload(false)
    }
  },
  watch: {
    locale: {
      handler () {
        this.$i18n.locale = this.locale
        this.$emit('locale', this.locale)
        localStorage.setItem('locale', this.locale)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import 'assets/css/burn.scss';
</style>
