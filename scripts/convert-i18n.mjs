/**
 * i18n/pages 파일들을 ES 모듈에서 전역 변수 패턴으로 변환
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(__dirname, '..', 'i18n', 'pages');

async function convertFiles() {
    const folders = await readdir(pagesDir, { withFileTypes: true });

    for (const folder of folders) {
        if (!folder.isDirectory()) continue;

        const folderPath = join(pagesDir, folder.name);
        const files = await readdir(folderPath);

        for (const file of files) {
            if (!file.endsWith('.js')) continue;

            const filePath = join(folderPath, file);
            let content = await readFile(filePath, 'utf8');

            // 이미 변환되었는지 확인
            if (content.includes('window.I18N_PAGE_')) {
                console.log(`Already converted: ${folder.name}/${file}`);
                continue;
            }

            // pageName과 lang 추출
            const pageName = folder.name.toUpperCase().replace(/-/g, '_');
            const lang = basename(file, '.js').toUpperCase();
            const varName = `I18N_PAGE_${pageName}_${lang}`;

            // export default { -> window.VARNAME = {
            content = content.replace(/export\s+default\s+\{/, `window.${varName} = {`);

            await writeFile(filePath, content, 'utf8');
            console.log(`Converted: ${folder.name}/${file} -> ${varName}`);
        }
    }

    console.log('Done!');
}

convertFiles().catch(console.error);
