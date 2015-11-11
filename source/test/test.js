import fs from 'fs'
import tap from 'tap'
import ComCom from '../index'
import through from 'through'

const test_file = __dirname + '/../../source/test/test.dat'

let comcom = new ComCom()

tap.test('Testing type of chunk piping down', (assert) => {
  assert.comment('Should be of type string')

  let stream = fs.createReadStream(test_file)

  stream.pipe(comcom.format())
    .pipe(through((chunk) => {
      let expected = typeof 'String'
        , actual = typeof chunk

      assert.equal(actual, expected)
    }))
    .on('end', () => {

      comcom.buffer.slice(0, comcom.buffer.length)
      assert.end()
    })
})

tap.test('Testing buffer contents', (assert) => {
  assert.comment('Should push comments into buffer')
    
  let stream = fs.createReadStream(test_file)

  stream.pipe(comcom.format())
    .pipe(comcom.comment())
    .on('end', () => {
      let actual = comcom.buffer
        , expected = [
          '// Test one\n'
        , '//\n'
        , '// @param {String} one\n'
        , '// @param {Function} two\n'
        ]

      assert.deepEqual(actual, expected)
      assert.end()
    })
})
