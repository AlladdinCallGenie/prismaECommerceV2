import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-CommerceV2 API",
      version: "1.0.0",
      description: "API documentation for the e-commerce  V2",
    },
    servers: [
      {
        url: "http://192.168.102.135:3001/",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/*.ts", // JSDoc in src folder
  ],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
