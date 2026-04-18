import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootTsxPath = path.resolve(__dirname, '../src/Root.tsx');

const args = process.argv.slice(2);
const isJsonMode = args.includes('--json');
const isLocalMode = args.includes('--local');

async function main() {
  if (!fs.existsSync(rootTsxPath)) {
    console.error(`Error: Could not find Root.tsx at ${rootTsxPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(rootTsxPath, 'utf8');
  const compRegex = /<Composition[^>]*id=["']([^"']+)["']/g;
  
  const compositions = [];
  let match;
  while ((match = compRegex.exec(content)) !== null) {
    compositions.push(match[1]);
  }

  // Filter for actual motion clips (clip-* or MotionClip*)
  // We exclude Demo-* or simple utility comps.
  const targetClips = compositions.filter(
    (id) => id.startsWith('clip-') || id.startsWith('MotionClip')
  );

  if (targetClips.length === 0) {
    console.warn("Warning: No target clips found matching 'clip-' or 'MotionClip' prefix.");
    if (isJsonMode) {
        console.log(JSON.stringify([]));
    }
    process.exit(0);
  }

  // Generate the render configuration array
  const matrix = targetClips.map((id) => {
    return {
      sceneId: id
    };
  });

  if (isJsonMode) {
    // For GitHub Actions matrix strategy
    console.log(JSON.stringify(matrix));
    process.exit(0);
  }

  if (isLocalMode) {
    console.log(`🎬 Found ${matrix.length} clips to render locally.`);
    
    // Concurrency limit for local machine so we don't crash RAM
    const CONCURRENCY_LIMIT = 2; 
    let activeWorkers = 0;
    let index = 0;
    
    const worker = async () => {
      while (index < matrix.length) {
        const clip = matrix[index++];
        activeWorkers++;
        console.log(`[▶] Starting render: ${clip.sceneId}`);
        
        const outName = `out/${clip.sceneId}.mp4`;
        
        // Base command
        let cmd = `npx remotion render src/index.ts ${clip.sceneId} ${outName}`;
        
        try {
            const { stdout, stderr } = await execAsync(cmd, { cwd: path.resolve(__dirname, '../') });
            console.log(`[✔] Finished render: ${clip.sceneId}`);
        } catch (error) {
            console.error(`[X] Error rendering ${clip.sceneId}:`, error.message);
        }
        
        activeWorkers--;
      }
    };
    
    // Spawn workers up to the concurrency limit
    const pool = [];
    for (let i = 0; i < Math.min(CONCURRENCY_LIMIT, matrix.length); i++) {
        pool.push(worker());
    }
    
    await Promise.all(pool);
    console.log('✅ Local batch rendering complete.');
  } else {
    // If running without flags, just print info
    console.log(`Found ${matrix.length} target clips:`);
    console.table(matrix);
    console.log('\nRun with --local to render all on this machine, or --json for CI/CD environments.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
