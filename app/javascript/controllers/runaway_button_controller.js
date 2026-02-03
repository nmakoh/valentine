import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button"]

  connect() {
    this.attempts = 0
    this.currentX = 0
    this.currentY = 0

    this.buttonTarget.addEventListener("mouseenter", () => {
      this.runAway()
    })
  }

  runAway() {
    this.attempts += 1

    const btn = this.buttonTarget
    const rect = btn.getBoundingClientRect()

    const padding = 20
    const intensity = Math.min(this.attempts * 80, 500)

    const minX = padding
    const minY = padding
    const maxX = window.innerWidth - rect.width - padding
    const maxY = window.innerHeight - rect.height - padding

    let targetX, targetY

    do {
      targetX = minX + Math.random() * (maxX - minX)
      targetY = minY + Math.random() * (maxY - minY)
    } while (
      Math.abs(targetX - rect.left) < intensity &&
      Math.abs(targetY - rect.top) < intensity
    )

    const deltaX = targetX - rect.left
    const deltaY = targetY - rect.top

    btn.style.transition = "transform 0.07s linear"
    btn.style.transform = `translate(${this.currentX + deltaX}px, ${this.currentY + deltaY}px)`

    this.currentX += deltaX
    this.currentY += deltaY
  }

  
}
