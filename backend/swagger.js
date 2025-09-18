const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadYamlDocs() {
  const docsDir = path.join(__dirname, 'docs');
  const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.yaml'));
  let openapi = null;
  let paths = {};
  let components = {};
  let servers = [];
  let info = {};
  files.forEach(file => {
    const doc = yaml.load(fs.readFileSync(path.join(docsDir, file), 'utf8'));
    if (doc.openapi) openapi = doc.openapi;
    if (doc.info) info = doc.info;
    if (doc.servers) servers = doc.servers;
    if (doc.paths) paths = { ...paths, ...doc.paths };
    if (doc.components) components = { ...components, ...doc.components };
  });
  return {
    openapi: openapi || '3.0.0',
    info,
    servers,
    paths,
    components
  };
}

const swaggerSpec = loadYamlDocs();

module.exports = { swaggerUi, swaggerSpec };
