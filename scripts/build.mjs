import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
fs.rmSync(path.join(root,'dist'),{recursive:true,force:true});
fs.cpSync(path.join(root,'src'),path.join(root,'dist'),{recursive:true});
console.log('Built browser-only Tâche 1 practice site.');
