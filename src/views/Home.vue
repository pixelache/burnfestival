<template>
  <div>
    <img class="burn_banner" alt="Pixleache 2021 Burn" src="@/assets/images/burnbanner.jpg">
    <section class="section streams">
   
        <div class="columns">
          <div class="column is-6 has-text-centered">
            <h1 class="title">{{ $texts[$i18n.locale].listen_live }} - Pixelache Radio</h1>
            <audio controls="controls" preload="preload">
              <source src="https://live.openradio.in/radio/8000/256.ogg" type="audio/ogg" />
              <source src="https://live.openradio.in/radio/8000/256.mp3" type="audio/mpeg" />              
            </audio>
            <p>{openradio} - radio is open</p>
          </div>
          <div class="column is-6 has-text-centered">
            <h1 class="title">{{ $texts[$i18n.locale].watch_online }}</h1>
            <div class="twitch">
              <div class="twitch-video has-text-left">
                <VueTwitchPlayer :channel="'pixelache'" width="100%" height="100%" />
              </div>
            </div>
          </div>
        </div>
  
    </section>
    <PostsIndex />
    <center>
      <img class="supporters" alt="Funders and supporters" src="@/assets/images/logos.png">
    </center>
  </div>
</template>

<script>
// @ is an alias to /src
import PostsIndex from '@/components/PostsIndex.vue'
import VueTwitchPlayer from 'vue-twitch-player'

export default {
  name: 'Home',
  components: {
    PostsIndex,
    VueTwitchPlayer
  },
  data () {
    return {

    }
  },
  props: {
    festival: {}
  },
  mounted () {
    
  }
}
</script>
