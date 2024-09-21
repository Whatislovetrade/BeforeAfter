'use strict'

function getTemplate(state) {
    return `
        <div class="slider__before" style='width: ${state.width}px; background-image: url(${state.before})'>
            <div class="slider__resize" data-type='resize'></div>
        </div>
        <div class="slider__after" style='background-image: url(${state.after})'></div>
    `
}

class Slider {
    constructor(selector, state) {
        this.$slider = document.getElementById(selector)
        this.state = {
            ...state,
            width: state.width || 512
        }
        this.maxWidth = this.$slider.clientWidth
        this.#render(this.state)
        this.#listen()
    }

    #render(state) {
        this.$slider.innerHTML = getTemplate(state)
    }

    #update(props) {
        this.state = {
            ...this.state,
            ...props
        }
        this.#render(this.state)
    }

    #listen() {
        this.mouseDownHandler = this.mouseDownHandler.bind(this)
        this.mouseUpHandler = this.mouseUpHandler.bind(this)
        this.moveHandler = this.moveHandler.bind(this)

        this.$slider.addEventListener('mousedown', this.mouseDownHandler)
        document.addEventListener('mouseup', this.mouseUpHandler) 
    }

    mouseDownHandler(event) {
        if (event.target.dataset.type === 'resize') {
            this.currentClientX = event.clientX
            document.addEventListener('mousemove', this.moveHandler) 
        }
    }

    mouseUpHandler() {
        document.removeEventListener('mousemove', this.moveHandler) 
    }

    moveHandler(event) {
        let newClientX = this.currentClientX - event.clientX
        let newWidth = this.state.width - newClientX

        // Ограничение ширины слайдера
        if (newWidth < 0) newWidth = 0
        if (newWidth > this.maxWidth) newWidth = this.maxWidth

        this.#update({ width: newWidth })
        this.currentClientX = event.clientX
    }
}

const slider = new Slider('slider', {
    before: './assets/before.jpg',
    after: './assets/after.jpg',
    width: 300 
})
