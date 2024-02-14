import path from 'path';
import AdmZip from 'adm-zip';

/**
 * Performs global teardown tasks.
 * This function creates a zip file of the `playwright-report` folder.
 */
async function globalTeardown() {
    const reportPath = path.join(__dirname, `playwright-report`);
    const zip = new AdmZip();
    zip.addLocalFolder(reportPath, `./playwright-report`);
    zip.writeZip(`./playwright-report.zip`);
}

export default globalTeardown;
