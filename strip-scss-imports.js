const fs = require('fs');
const path = require('path');

// Recursively process files in the "dist" directory
function processDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      processDir(filepath);
    } else if (stat.isFile() && (filepath.endsWith('.js') || filepath.endsWith('.d.ts'))) {
      let content = fs.readFileSync(filepath, 'utf8');
      // Remove any import statement that references a .scss file.
      content = content.replace(
        /import\s+(['"])(.+)\.scss\1;?\s*/g,
        (match, quote, path) => `import ${quote}${path}.css${quote};\n`
      );
      
      fs.writeFileSync(filepath, content, 'utf8');
    }
  });
}

processDir(path.join(__dirname, 'dist'));
console.log('SCSS import statements removed from distributed JS files.');
