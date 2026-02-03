import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const audio = document.getElementById("bg-music")

    if (!audio) return

    // гарантія запуску після user interaction
    audio.volume = 0.6
    audio.play().catch(() => {})
  }
}
