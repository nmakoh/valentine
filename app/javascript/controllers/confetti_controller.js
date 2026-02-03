import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  launch() {
    this.spawn()
  }

  spawn() {
    const emojis = ["🎉", "💖", "✨", "🥰", "💘"]

    for (let i = 0; i < 80; i++) {
      const confetti = document.createElement("div")
      confetti.classList.add("confetti")
      confetti.innerText =
        emojis[Math.floor(Math.random() * emojis.length)]

      confetti.style.left = Math.random() * 100 + "vw"
      confetti.style.animationDuration =
        2 + Math.random() * 2 + "s"

      document.body.appendChild(confetti)

      setTimeout(() => confetti.remove(), 4000)
    }
  }
}
