import Source from '@/models/Source'
import UMsg from '@/models/UMsg'

import '@/3rd/NIM_Web_SDK'
// I don't know why it won't work with ES6 modules.
// Netease sucks.

export default class NeteaseIM extends Source {
  static getParamsInfo () {
    return 'As per Netease IM Web SDK\'s doc. Omitting appKey will make it for Bullet Message.'
  }
  static getParamsList () {
    return ['appKey', 'account', 'token', 'group']
  }
  start () {
    if (!this.params.appKey) {
      this.params.appKey = 'fef5a045d42e55b17455ce99544955df'
      this._isBullet = true
    }

    const onMsg = msg => {
      if (msg.target !== this.params.group) return
      const content = { text: '[暂不支持的消息类型]' }
      if (msg.type === 'text') content.text = msg.text
      if (this._isBullet && (msg.type === 'audio') && msg.custom) content.text = JSON.parse(msg.custom).ta
      const uMsg = new UMsg({
        source: this,
        sender: {
          id: msg.from,
          displayName: msg.fromNick,
          info: { clientType: msg.fromClientType, clientId: msg.fromDeviceId }
        },
        content
      })
      this.log('Received message: ' + uMsg)
      this.messageArrived(uMsg)
    }

    this._nim = window.SDK.NIM.getInstance({
      appKey: this.params.appKey,
      account: this.params.account,
      token: this.params.token,
      onconnect: () => {
        this.log(`Sucessfully connected to ${this._isBullet ? 'Bullet Message' : 'NIM'}.`)
        super.start()
      },
      ondisconnect: error => this.log(`Disconnected from server. Reason: ${JSON.stringify(error)}.`),
      onerror: error => this.log(`Error. Reason: ${JSON.stringify(error)}.`),
      onwillreconnect: ({ retryCount, duration }) => this.log(`Temporary disconnected from server, retried ${retryCount} times and will retry again in ${duration}.`),
      onmsg: onMsg
    })
  }
  postMessage (uMsg) {
    return new Promise((resolve, reject) => {
      this._nim.sendText({
        scene: 'team',
        to: this.params.group,
        text: uMsg.getFormattedText(),
        done: err => {
          if (err) {
            this.log(`Failed to send message ${uMsg}. Reason: ${JSON.stringify(err)}.`)
            reject(new Error('Failed to send message'))
          } else {
            this.log(`Sucessfully sent message ${uMsg}.`)
            resolve()
          }
        }
      })
    })
  }
  stop () {
    this._nim.destroy({
      done: () => {
        this.log(`Sucessfully stopped.`)
        super.stop()
      }
    })
  }
}
