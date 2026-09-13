import SwaggerUI from 'swagger-ui-dist/swagger-ui-es-bundle.js';
import 'swagger-ui-dist/swagger-ui.css';
import './styles.css';

SwaggerUI({
  dom_id: '#swagger-ui',
  url: './specs/oss-funder-current-v1.yaml',
  deepLinking: true,
  docExpansion: 'list',
  defaultModelsExpandDepth: 1,
  displayRequestDuration: true,
  filter: true,
  persistAuthorization: false,
  tryItOutEnabled: false,
});
