import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context
} from 'aws-lambda'
import awsServerlessExpress from 'aws-serverless-express'
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import express from 'express'

/**
 * @param event
 * @param context
 */
export const lambda: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const { Nuxt } = require('nuxt-start')
  const app = express()

  // Import and Set Nuxt.js options
  const config = require('../nuxt.config.js')

  // In the Nuxt programmatic API
  // We need to explicitly set the dev to false.
  const nuxt = new Nuxt(Object.assign(config, { dev: false }))

  // wait for nuxt to be ready.
  await nuxt.ready()

  app.use(nuxt.render)
  app.use(awsServerlessExpressMiddleware.eventContext())

  const server = awsServerlessExpress.createServer(app, () => null, ['*/*'])

  return await awsServerlessExpress.proxy(server, event, context, 'PROMISE')
    .promise
}
