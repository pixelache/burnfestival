<template>
  <div id="app">
    <nav class="navbar" role="navigation" aria-label="main navigation">
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
          <router-link class="navbar-item" :to="{name: 'Page', params: {id: 'about'}}">
            <span v-show="locale === 'en'">About</span>
            <span v-show="locale === 'fi'">Info</span>
          </router-link>
          <router-link class="navbar-item" :to="{name: 'Blog'}">
            <span v-show="locale === 'en'">Blog</span>
            <span v-show="locale === 'fi'">Uutiset</span>
          </router-link>
          <router-link class="navbar-item" :to="{name: 'Opencall', params: {id: 'burn-festival-open-call'}}">
            <span v-show="locale === 'en'">Open call</span>
            <span v-show="locale === 'fi'">Open call</span>
          </router-link>          
        </div>
        <div class="navbar-end">
          <a href="#" :class="locale === 'en' ? 'active' : ''"  @click="setLocale('en')" class="navbar-item">ENG</a>
          <a href="#" :class="locale === 'fi' ? 'active' : ''" @click="setLocale('fi')" class="navbar-item">FIN</a>
        </div>
      </div>
    </nav>
    <router-view :key="$route.fullPath + '?locale=' + locale" />
    <footer class="footer">
      <img src="@/assets/images/footer_logo.png" />
    </footer>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      locale: ''
    }
  },
  created () {
    document.addEventListener('DOMContentLoaded', () => {

      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach( el => {
          el.addEventListener('click', () => {

            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');

          });
        });
      }

    })
  },
  mounted () {
    if (localStorage.locale) {
      this.locale = localStorage.getItem('locale')
    }
  },
  methods: {
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
