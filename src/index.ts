import { OpenAPIHono } from '@hono/zod-openapi'
 import apiRoutes from './routes/api'
import { Scalar } from '@scalar/hono-api-reference'

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>()

 
app.route('/api/v1', apiRoutes)

app.doc("/openapi", {
  openapi: "3.1.0",
  info: {
    title: "Zuno API",
    version: "1.0.0",
    description: "Unified API for ERP synchronization across multiple providers",
  },
  servers: [{ url: "https://api.zuno.dev" }],
});

app.get(
  "/",
  Scalar({ url: "/openapi", pageTitle: "Midday API", theme: "saturn" }),
);

export default app
