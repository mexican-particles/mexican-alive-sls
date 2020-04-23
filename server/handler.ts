import * as http from 'http'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context
} from 'aws-lambda'
import awsServerlessExpress from 'aws-serverless-express'
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import express, { Express, Response, Request } from 'express'
import load, { DotenvConfigOutput } from 'dotenv'
import { Configuration } from '@nuxt/types'

const dotenv: DotenvConfigOutput = load.config()

/**
 * @param event
 * @param context
 */
export const lambda: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const { Nuxt } = require('nuxt-start')
  const app: Express = express()

  // Import and Set Nuxt.js options
  const config: Configuration = require('../nuxt.config.js')

  // In the Nuxt programmatic API
  // We need to explicitly set the dev to false.
  const nuxt = new Nuxt(Object.assign(config, { dev: false }))

  // wait for nuxt to be ready.
  await nuxt.ready()

  if (dotenv!.parsed!.ENVIRONMENT === 'local') {
    app.use((req: Request, res: Response): void => {
      setTimeout((): void => {
        req.url = `/${dotenv!.parsed!.ENVIRONMENT}/${req.url}`.replace(
          '//',
          '/'
        )
        nuxt.render(req, res)
      }, 0)
    })
  }

  app.use(nuxt.render)
  app.use(awsServerlessExpressMiddleware.eventContext())

  const server: http.Server = awsServerlessExpress.createServer(
    app,
    () => null,
    ['*/*']
  )

  return await awsServerlessExpress.proxy(server, event, context, 'PROMISE')
    .promise
}
