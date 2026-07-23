import { ref, onUnmounted } from 'vue'

export function useStockWebSocket() {
  const ws = ref<WebSocket | null>(null)
  const connected = ref(false)
  let heartbeatTimer: number | null = null

  function connect(seasonId: number, onMessage: (data: any) => void) {
    if (ws.value) ws.value.close()
    const wsUrl = `ws://localhost:8889/ws/stock/${seasonId}`
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
