import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import {version} from '../package.json'
import { Request, Response, Express } from 'express'
import config from './config/config'

const dirRoute = __dirname + '/routes/*.{ts,js}'
console.log('dirRoute', dirRoute);

const options: swaggerJsDoc.Options = {
    definition:{
        openapi: "3.1.0",
        info: {
          title: "Teaching support API",
          version: "0.1.0",
          description:
            "",
          contact: {
            name: "Datisekai",
            url: "https://datisekai.id.vn",
          },
        },
        servers: [
            {
              url: config.domainUrl
            },
          ],
          components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                in: 'header',
                name: 'Authorization',
                description: 'Bearer token to access these api endpoints',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
    },
    apis:[dirRoute]
}

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app: Express){
    app.use('/docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec,))
    app.get('doc.json', (req:Request, res: Response) => {
        res.setHeader('Content-Type','application/json')
        res.send(swaggerSpec)
    })
}

export default swaggerDocs;