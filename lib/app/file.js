import fs from 'fs'
import path from 'path'

export default function file () {
  return fs.readFileSync(path.join.apply(null, arguments), 'utf8').toString()
}
