<template>
  <div class="hola-layout-main hola-card-stack">
    <div class="hola-card">
      <h2 class="hola-card-title">Frightened - Bullet Message</h2>
      <a
        v-if="source.status === 'stopped'"
        href="#"
        class="hola-button hola-button-primary"
        @click.prevent="source.start()"
      >Start</a>
      <a
        v-else
        href="#"
        class="hola-button hola-button-primary"
        @click.prevent="source.stop()"
      >Stop</a>
      <h3>Platform Params</h3>
      <p>{{source.constructor.paramsInfo}}</p>
      <div class="hola-infosheet">
        <div v-for="(value, key) in source.params" :key="key" class="hola-infosheet-row">
          <span class="hola-infosheet-key">{{key}}</span>
          <code class="hola-infosheet-value">{{value}}</code>
        </div>
      </div>
    </div>
    <div class="hola-card">
      <h2 class="hola-card-title">Logs</h2>
      <div class="hola-content">
        <pre><code>{{$store.state.logs[source.name]}}</code></pre>
      </div>
    </div>
  </div>
</template>
<script>
import MessageCenter from '@/messageCenter'

export default {
  data () {
    return {
      source: MessageCenter.getSource(this.$route.params.source)
    }
  }
}
</script>
