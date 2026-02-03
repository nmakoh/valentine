import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  launch() {
    const stickers = ["🐒", "💖", "🥰", "🐻", "💘", "✨", "🧸"]

    for (let i = 0; i < 40; i++) {
      const el = document.createElement("div")
      el.innerText = stickers[Math.floor(Math.random() * stickers.length)]
      el.style.position = "fixed"
      el.style.left = Math.random() * 100 + "vw"
      el.style.top = Math.random() * 100 + "vh"
      el.style.fontSize = 20 + Math.random() * 30 + "px"
      el.style.opacity = "0.85"
      el.style.pointerEvents = "none"

      document.body.appendChild(el)
    }
  }
}
