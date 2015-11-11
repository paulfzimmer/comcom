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

  buffer_handler() {
    let self = this

    return through(function (chunk) {
      let test_chunk = (
        self.buffer.length > 0 &&
        chunk !== '\n' &&
        chunk !== '0'
      )

      if (test_chunk) {

        let ind = self.buffer[0].match(self.regexs[1]) || ''
          , returns = '/**\n'

        self.buffer.forEach((comment) => {
          returns += comment.replace(self.regexs[0], ' * ')
        })

        self.buffer.splice(0, self.buffer.length)

        returns = ind +
          returns +
          ind +
          ' */\n' +
          chunk +

        this.queue(returns)
      }
    })
  }
}
