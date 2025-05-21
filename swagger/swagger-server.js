const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = require('../swaggerDef'); // 你的 swaggerDef.js 路径

const options = {
  swaggerDefinition,
  apis: ['./api/**/*.ts'], // 正确指向你的 API 注释文件
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Swagger UI 本地预览已启动: http://localhost:${PORT}/api-docs`);
}); 