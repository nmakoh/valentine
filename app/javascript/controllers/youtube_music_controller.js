import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api"
    document.body.appendChild(tag)

    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player('youtube-player', {
        videoId: 'ipfWd7QV9O8',
        playerVars: {
          autoplay: 0, // стартує тільки після кнопки
          loop: 1,
          playlist: 'ipfWd7QV9O8',
          controls: 0,
          modestbranding: 1,
          mute: 0
        }
      })
    }
  }

  play() {
    if (this.player && this.player.playVideo) {
      this.player.playVideo()
    } else {
      setTimeout(() => this.play(), 500)
    }
  }
}
