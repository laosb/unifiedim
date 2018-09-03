import { find, filter, remove } from 'lodash'
import * as sourceTypes from '@/sources/'
import store from './store'

const MessageCenter = {
  sources: [],
  init (sources) {
    sources.forEach(sourceObj => {
      const sourceInst = new sourceTypes[sourceObj.type](sourceObj)
      this.sources.push(sourceInst)
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
    return this.
  } 
  newMessage (uMsg) {
    const sourcesToForward = filter(this.sources, source => {
      return source.status === 'running' && source.name !== uMsg.source.name
    })
    console.log(`[MessageCenter] New message arrived from ${uMsg.source.name}, forwarding to`, sourcesToForward)
    sourcesToForward.forEach(source => source.postMessage(uMsg))
    console.log('[MessageCenter] New message posted', uMsg)
  },
  newLog (source, log) {
    store.commit('logSource', { source, log })
    console.log('[MessageCenter] Log by', source, ':', log)
  }
}

window.MessageCenter = MessageCenter

export default MessageCenter
