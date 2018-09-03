import Source from '@/models/Source'
import UMsg from '@/models/UMsg'

import Socket from 'websocket-as-promised'

export default class CoolQHTTP extends Source {
  static getParamsInfo () {
    return 'Use coolq-http-api, with WebSocket mode.'
  }
  static getParamsList () {
    return ['wsBaseUrl', 'accessToken', 'group']
  }
  async _ensureSocketOpen (socket, name) {
    if (socket.isClosed) {
      this.log(`${name || 'Some'} socket was closed, reopening for sending.`)
      await socket.open()
    }
  }
  async start () {
    const wsapOpts = {
      packMessage: data => JSON.stringify(data),
      unpackMessage: data => JSON.parse(data),
      attachRequestId: (data, requestId) => Object.assign({echo: requestId}, data),
      extractRequestId: data => data && data.echo
    }
    this._apiSocket = new Socket(`${this.params.wsBaseUrl}/api?access_token=${this.params.accessToken}`, wsapOpts)
    this._eventSocket = new Socket(`${this.params.wsBaseUrl}/event?access_token=${this.params.accessToken}`, wsapOpts)

    await Promise.all([this._apiSocket.open(), this._eventSocket.open()])
    this.log('Successfully connected to CoolQ HTTP API via WebSocket.')
    super.start()

    this._eventSocket.onUnpackedMessage.addListener(async payload => {
      if (payload.message_type === 'group' &&
          payload.group_id.toString() === this.params.group) {
        await this._ensureSocketOpen(this._apiSocket, 'API')
        const userInfoPayload = await this._apiSocket.sendRequest({
          action: 'get_group_member_info',
          params: {
            group_id: this.params.group,
            user_id: payload.user_id
          }
        })
        const { data: userInfo } = userInfoPayload
        if (userInfoPayload.status !== 'ok') userInfo.card = payload.user_id
        if (!userInfo.card) userInfo.card = userInfo.nickname
        const uMsg = new UMsg({
          source: this,
          sender: {
            id: payload.user_id,
            displayName: userInfo.card
          },
          content: {
            text: payload.raw_message
          }
        })
        this.log('Received message: ' + uMsg)
        this.messageArrived(uMsg)
      }
    })

    this._eventSocketKeeper = window.setInterval(() => this._ensureSocketOpen(this._eventSocket, 'Event'), 3000)
  }
  async postMessage (uMsg) {
    await this._ensureSocketOpen(this._apiSocket, 'API')
    const payload = await this._apiSocket.sendRequest({
      action: 'send_group_msg',
      params: {
        group_id: this.params.group,
        message: uMsg.getFormattedText(),
        auto_escape: true
      }
    })
    if (payload.status === 'ok') return this.log(`Successfully sent message ${uMsg}.`)
    this.log(`Failed to send message ${uMsg}. retcode = ${payload.retcode}.`)
    throw new Error('Failed to send message.')
  }
  async stop () {
    window.clearInterval(this._eventSocketKeeper)
    await Promise.all([this._apiSocket.close(), this._eventSocket.close()])
    return super.stop()
  }
}
