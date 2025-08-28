const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../shared/api');
const indexPath = path.join(configPath, 'index.ts');
const openApiPath = path.join(configPath, 'core/OpenAPI.ts');

if (fs.existsSync(indexPath)) {
  console.log('OpenAPI types generated successfully!');
  console.log('Types available in: shared/api/');
  
  const stats = fs.readdirSync(configPath);
  console.log('Generated files:', stats.join(', '));

  // Update the base URL in OpenAPI.ts
  if (fs.existsSync(openApiPath)) {
    let openApiContent = fs.readFileSync(openApiPath, 'utf8');
    
    openApiContent = openApiContent.replace(
      "BASE: '',",
      "BASE: 'http://localhost:8080',"
    );
    
    fs.writeFileSync(openApiPath, openApiContent);
    console.log('Updated OpenAPI base URL to http://localhost:8080');
  } else {
    console.log('Warning: OpenAPI.ts not found, base URL not updated');
  }
} else {
  console.log('OpenAPI generation failed - no output files found');
  process.exit(1);
}