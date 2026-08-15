import { ref, onUnmounted } from 'vue'
import { stockUrlPre } from '@/util/Constant'

export function useStockWebSocket() {
  const ws = ref<WebSocket | null>(null)
  const connected = ref(false)
  let heartbeatTimer: number | null = null

  function connect(seasonId: number, onMessage: (data: any) => void) {
    if (ws.value) ws.value.close()
    // 从 HTTP base URL 提取 host（含端口），避免硬编码 localhost，从而支持其他 IP 访问
    const host = stockUrlPre.replace(/^https?:\/\//, '').replace(/\/$/, '')
    const wsUrl = `ws://${host}/ws/stock/${seasonId}`
    ws.value = new WebSocket(wsUrl)
    ws.value.onopen = () => {
      connected.value = true
      startHeartbeat()
    }
    ws.value.onclose = () => {connected.value = false}
    ws.value.onerror = () => {connected.value = false}
    ws.value.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'pong') return
        onMessage(msg)
      } catch (e) {
        console.error('WebSocket message parse error', e)
      }
    }
  }

  function startHeartbeat() {
    if (heartbeatTimer) clearInterval(heartbeatTimer)
    heartbeatTimer = window.setInterval(() => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify({ type: 'ping' }))}}, 30000)}

  function disconnect() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }

    if (ws.value) {
      ws.value.close()
      ws.value = null}
    connected.value = false
  }

  onUnmounted(() => {
    disconnect()
  })

  return { ws, connected, connect, disconnect }}
