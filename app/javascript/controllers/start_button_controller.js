import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content"]

  connect() {
    // Знаходимо елемент контенту
    this.content = this.element.querySelector('.content')
  }

  start() {
    // Показуємо весь контент
    this.content.style.display = 'block'

    // Приховуємо кнопку
    this.element.querySelector('.start-button').style.display = 'none'

    // Запускаємо музику
    const youtubeController = this.application.getControllerForElementAndIdentifier(
      this.element,
      "youtube-music"
    )
    if (youtubeController) youtubeController.play()

    // Запускаємо конфетті
    const confettiController = this.application.getControllerForElementAndIdentifier(
      this.element,
      "confetti"
    )
    if (confettiController) confettiController.launch()

    // Запускаємо серця
    const heartsController = this.application.getControllerForElementAndIdentifier(
      this.element,
      "hearts"
    )
    if (heartsController) heartsController.launch()
  }
}
