<template>
  <div>
    <header class="hola-navbar hola-navbar-transparent hola-navbar-darkbg">
      <div class="hola-container">
        <nav class="hola-navbar-main">
          <a href="#" class="hola-navbar-brand">Unified IM</a>
        </nav>
        <input type="checkbox" class="hola-navbar-toggle" id="navbar-toggle">
        <label for="navbar-toggle" class="hola-navbar-toggle-label"></label>
        <nav class="hola-navbar-sub">
          <a href="#">About</a>
        </nav>
      </div>
    </header>
    <div class="hola-hero hola-hero-dark-bg hola-hero-height-extended">
      <div class="hola-container hola-hero-content">
        <h1>Unified IM</h1>
        <p>Easygoing Unified IM Platform.</p>
        <a href="styleguide/" class="hola-button hola-button-ghost">Add Source</a>
      </div>
    </div>
    <div class="hola-container hola-layout-container hola-layout-container-sidebar-right">
      <router-view></router-view>
      <div class="hola-layout-sidebar">
        <div class="hola-card">
          <ul class="hola-vmenu">
            <li v-for="source in sources" :key="source.name" class="hola-vmenu-item">
              <router-link :to="{ name: 'source', params: { source: source.name } }">{{source.name}}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <footer class="hola-footer">
      <div class="hola-container">
        <p>Copyright 2018 laosb.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import MessageCenter from './messageCenter'

export default {
  data () {
    return {
      sources: MessageCenter.sources
    }
  }
}
</script>
