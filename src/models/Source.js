// This is the base class for all sources.
import MessageCenter from '../messageCenter'

export default class Source {
  constructor ({ name, symbol, params }) {
    this.name = name
    this.symbol = symbol
    this.params = params
    this.status = 'stopped'
  }
  // Overrides the two methods below.
  static getParamsInfo () { return '' }
  static getParamsList () { return [] }
  log (log) { return MessageCenter.newLog(this.name, log) }
  start () {
    // Override this, UIM will call this when a source of this platform should start to work.
    // Please do call super.start() after you started!
    return (this.status = 'running')
  }
  stop () {
    // Override this, UIM will call this when this source should stop working and be destroyed.
    // Please do call super.stop() after you stopped!
    return (this.status = 'stopped')
  }
  postMessage (uMsg) {
    // Override this method to post to your platform.
    return this.log(`Posted ${uMsg} to the IM.`)
  }
  messageArrived (uMsg) {
    // Don't touch this, you should call this when a new message arrived at this source.
    uMsg.source = { name: this.name, symbol: this.symbol }
    return MessageCenter.newMessage(uMsg)
  }
  toObject () {
    return {
      name: this.name,
      params: this.params,
      type: this.constructor.name
    }
  }
}
