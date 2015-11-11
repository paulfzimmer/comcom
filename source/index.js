import fs from 'fs'
import through from 'through'

export default class ComCom {

  constructor() {
    this.buffer = []
    this.regexs = [
      /\/(?=\/)\/(?!'|")/g,
      /\s+(?=\/)/g
    ]
  }

  format() {
    return through(function (chunk) {
      chunk.toString()
      .split('\n')
      .forEach((item) => {
        this.queue(item + '\n')
      })
    })
  }

  comment() {
    let self = this

    return through(function (chunk) {
      if (chunk.match(self.regexs[0])) {
        self.buffer.push(chunk)
        this.queue('0')
      }
      else {
        this.queue(chunk)
      }
    })
  }
}
