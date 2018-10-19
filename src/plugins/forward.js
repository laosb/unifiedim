import { filter } from 'lodash'

export default function register (messageCenter) {
  messageCenter.plugins.forward = {
    onMessage (uMsg) {
      const sourcesToForward = filter(messageCenter.sources, source => {
        return source.status === 'running' && source.name !== uMsg.source.name
      })
      console.log(`[MessageCenter] New message arrived from ${uMsg.source.name}, forwarding to`, sourcesToForward)
      sourcesToForward.forEach(source => source.postMessage(uMsg))
      console.log('[MessageCenter] New message posted', uMsg)
    }
  }
}
