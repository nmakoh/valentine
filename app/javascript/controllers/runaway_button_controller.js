import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button"]

  connect() {
    this.attempts = 0
    this.currentX = 0
    this.currentY = 0

    // desktop hover
    this._mouseEnterHandler = () => { this.runAway() }
    this.buttonTarget.addEventListener("mouseenter", this._mouseEnterHandler)

    // support pointer events (covers pen, touch-capable pointer devices)
    this._pointerEnterHandler = () => { this.runAway() }
    this.buttonTarget.addEventListener("pointerenter", this._pointerEnterHandler)

    // mobile: when user touches/taps the button, make it run away before the click
    // don't call preventDefault here (can interfere with touch handling). Instead
    // record a timestamp of the last automatic move and suppress clicks that happen
    // immediately after.
    this.lastMovedAt = 0

    this._touchHandler = (e) => {
      // run away on touchstart
      this.runAway()
      this.lastMovedAt = Date.now()
    }

    this.buttonTarget.addEventListener("touchstart", this._touchHandler)

    // suppress clicks that happen immediately after the automatic move
    this._clickHandler = (e) => {
      if (Date.now() - this.lastMovedAt < 400) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return false
      }
      return true
    }

    this.buttonTarget.addEventListener("click", this._clickHandler, true)

    // pointermove proximity trigger (helps when user taps very close to the button)
    this._pointerMoveHandler = (e) => {
      // use clientX/clientY for mouse/pointer, touches for touch
      const clientX = e.clientX != null ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX)
      const clientY = e.clientY != null ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY)
      if (clientX == null || clientY == null) return

      const rect = this.buttonTarget.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = clientX - cx
      const dy = clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      // if pointer comes within 90px, trigger runAway
      if (dist < 90) {
        this.runAway()
        this.lastMovedAt = Date.now()
      }
    }

    window.addEventListener("pointermove", this._pointerMoveHandler)
  }

  disconnect() {
    // clean up listeners
  try { this.buttonTarget.removeEventListener("pointerenter", this._pointerEnterHandler) } catch (e) {}
  try { this.buttonTarget.removeEventListener("mouseenter", this._mouseEnterHandler) } catch (e) {}
    try { this.buttonTarget.removeEventListener("touchstart", this._touchHandler) } catch (e) {}
    try { this.buttonTarget.removeEventListener("click", this._clickHandler, true) } catch (e) {}
    try { window.removeEventListener("pointermove", this._pointerMoveHandler) } catch (e) {}
    // remove any placeholder left in the DOM
    try {
      if (this._placeholder && this._placeholder.parentNode) this._placeholder.parentNode.removeChild(this._placeholder)
    } catch (e) {}
  }

  runAway() {
    // throttle very-frequent moves
    if (this.lastMovedAt && (Date.now() - this.lastMovedAt) < 60) return
    this.attempts += 1

    const btn = this.buttonTarget
    const rect = btn.getBoundingClientRect()

    const padding = 12
    const intensity = Math.min(this.attempts * 60, 300)

    // constrain movement inside the closest .card container if available
    const containerEl = btn.closest('.card') || this.element || document.body
    const containerRect = containerEl.getBoundingClientRect()

    // ensure the container is a positioning context
    try {
      const cStyle = window.getComputedStyle(containerEl)
      if (cStyle.position === 'static' || !cStyle.position) containerEl.style.position = 'relative'
    } catch (e) {}

    // coordinates relative to container
    const minX = padding
    const minY = padding
    const maxX = Math.max(minX, containerRect.width - rect.width - padding)
    const maxY = Math.max(minY, containerRect.height - rect.height - padding)

    let targetX, targetY
    let tries = 0
    do {
      targetX = minX + Math.random() * (maxX - minX)
      targetY = minY + Math.random() * (maxY - minY)
      tries += 1
      if (tries > 12) break
    } while (
      Math.abs((targetX + containerRect.left) - rect.left) < intensity &&
      Math.abs((targetY + containerRect.top) - rect.top) < intensity
    )

    // final clamp
    targetX = Math.min(Math.max(targetX, minX), maxX)
    targetY = Math.min(Math.max(targetY, minY), maxY)

    // compute current position relative to container
    const startLeft = rect.left - containerRect.left
    const startTop = rect.top - containerRect.top

    // insert a placeholder in the flow so other elements (like the Yes button)
    // don't shift into the No button's spot when it becomes absolute
    if (!this._placeholder) {
      try {
        const computedBtnStyle = window.getComputedStyle(btn)
        this._placeholder = document.createElement('div')
        this._placeholder.className = 'no-placeholder'
        this._placeholder.style.width = `${rect.width}px`
        this._placeholder.style.height = `${rect.height}px`
        this._placeholder.style.display = computedBtnStyle.display === 'inline' ? 'inline-block' : computedBtnStyle.display
        this._placeholder.style.margin = computedBtnStyle.margin
        this._placeholder.style.verticalAlign = computedBtnStyle.verticalAlign || 'middle'
        btn.parentNode.insertBefore(this._placeholder, btn)
      } catch (e) {
        // ignore placeholder failures
      }
    }

    // switch to absolute positioning inside the container
    btn.style.position = 'absolute'
    btn.style.zIndex = '999'
    btn.style.transform = 'none'
    btn.style.left = `${Math.min(Math.max(startLeft, minX), maxX)}px`
    btn.style.top = `${Math.min(Math.max(startTop, minY), maxY)}px`

    // animate to target inside the container
    btn.style.transition = 'left 0.12s ease-out, top 0.12s ease-out'
    btn.style.left = `${targetX}px`
    btn.style.top = `${targetY}px`

    requestAnimationFrame(() => {
      const finalRect = btn.getBoundingClientRect()
      const relLeft = finalRect.left - containerRect.left
      const relTop = finalRect.top - containerRect.top
      let needFix = false
      let fixedLeft = relLeft
      let fixedTop = relTop
      if (relLeft < minX) { fixedLeft = minX; needFix = true }
      if (relTop < minY) { fixedTop = minY; needFix = true }
      if (relLeft > maxX) { fixedLeft = maxX; needFix = true }
      if (relTop > maxY) { fixedTop = maxY; needFix = true }
      if (needFix) {
        btn.style.left = `${fixedLeft}px`
        btn.style.top = `${fixedTop}px`
      }
      this.lastMovedAt = Date.now()
    })
  }

  
}
