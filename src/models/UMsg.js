export default class UMsg {
  constructor ({ source, sender, content }) {
    this.source = {
      name: source.name,
      symbol: source.symbol
    }
    this.sender = {
      displayName: sender.displayName,
      info: sender.info
    }
    if (!content.text || (typeof content.text) !== 'string') throw new Error('content must have a text version as a string.')
    this.content = content
  }
  getText () { return this.content.text }
  getSenderDisplay () { return this.sender.displayName }
  getFormattedText () { return `[${this.source.symbol} - ${this.getSenderDisplay()}] ${this.getText()}` }
  toObject () {
    return {
      source: this.source,
      sender: this.sender,
      content: this.content
    }
  }
  toString () {
    return `[UMsg (Source: "${this.source.name}") ${this.sender.displayName}: ${this.content.text}]`
  }
}

window.UMsg = UMsg
