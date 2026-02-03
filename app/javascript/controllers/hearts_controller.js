import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  launch() {
    this.spawnHearts()
  }

  spawnHearts() {
    setInterval(() => {
      const heart = document.createElement("div")
      heart.classList.add("heart")
      heart.innerText = "💖"

      heart.style.left = Math.random() * 100 + "vw"
      heart.style.animationDuration = 3 + Math.random() * 3 + "s"

      document.body.appendChild(heart)

      setTimeout(() => heart.remove(), 6000)
    }, 300)
  }
}
