import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions'

export const structuredLogging: HttpFunction = (req, res) => {
  const demo = req.header('x-demo')
  const structure = {
    number: 1,
    boolean: true,
    string: 'string',
    array: [1, 2, 3],
    set: new Set([1, 2, 3]), // SetはJSON.stringify()すると{}になるので対比するため入れてみる
  }
  switch (demo) {
    case '1':
      console.info('### console.log(structure) ###')
      console.log(structure)
      res.send(demo)
      break
    case '2':
      console.info(`### console.log('The structure is %o', structure) ###`)
      console.log('The structure is %o', structure)
      res.send(demo)
      break
    case '3':
      console.info(`### JSON.stringify(structure) ###`)
      console.log(JSON.stringify(structure))
      res.send(demo)
      break
    case '4':
      console.info(`### console.log('Logging message', structure) ###`)
      console.log('Logging message', structure)
      res.send(demo)
      break
    case '5':
      console.info(
        `### console.log('Logging message', JSON.stringify(structure)) ###`,
      )
      console.log('Logging message', JSON.stringify(structure))
      res.send(demo)
      break
    default:
      res.send(demo)
  }
}
