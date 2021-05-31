<template>
  <div id="app">
<router-view></router-view>
  </div>
</template>

<script>
import Note from './components/Note.vue'
import Login from './view/Login'

export default {
  components: {
    Note,
    Login
  }
}
</script>

<style>

</style>
