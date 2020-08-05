import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions'

export const logging: HttpFunction = (req, res) => {
  const mode = req.header('x-mode')
  switch (mode) {
    case 'error':
      res.send(mode)
      console.error(new Error('Error message'))
      break
    case 'warn':
      res.send(mode)
      console.warn('Warning message')
      break
    case 'info':
      res.send(mode)
      console.info('Info message')
      break
    case 'log':
      res.send(mode)
      console.log('Log message')
      break
    case 'trace':
      res.send(mode)
      console.trace('Trace message')
      break
    case 'exception':
      res.send(mode)
      throw new Error('Exception message')
    default:
      res.send(mode)
  }
}
