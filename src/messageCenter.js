import { find, filter, remove } from 'lodash'
import * as sourceTypes from '@/sources/'
import * as plugins from '@/plugins/'
import store from './store'

const MessageCenter = {
  sources: [],
  plugins: {},
  init (sources) {
    console.log('[MessageCenter] Initiating sources...')
    sources.forEach(sourceObj => {
      const sourceInst = new sourceTypes[sourceObj.type](sourceObj)
      this.sources.push(sourceInst)
    })

    console.log('[MessageCenter] Initiating plugins...')
    Object.keys(plugins).forEach(pluginName => {
      console.log(`[MessageCenter] Initiating plugin ${pluginName}`)
      plugins[pluginName](MessageCenter)
    })
  },
  getSource (name) { return find(this.sources, ['name', name]) },
  addSource (type, name, symbol, params) {
    return this.sources.push(new sourceTypes[type]({ name, symbol, params }))
  },
  removeSource (name) {
    return remove(this.sources, ['name', name])
  },
  startSource (name) {
    return this.getSource(name).start()
  },
  stopSource (name) {
    return this.getSource(name).stop()
  },
  startAllSources () {
    return filter(this.sources, source => source.status !== 'running')
      .forEach(source => source.start())
  },
  stopAllSources () {
    return filter(this.sources, source => source.status !== 'stopped')
      .forEach(source => source.stop())
  },
  newMessage (uMsg) {
    Object.values(this.plugins).forEach(({ onMessage }) => onMessage(uMsg))
  },
  newLog (source, log) {
    store.commit('logSource', { source, log })
    console.log('[MessageCenter] Log by', source, ':', log)
  }
}

window.MessageCenter = MessageCenter

export default MessageCenter
