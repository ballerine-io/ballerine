import {
  Font,
  PDFDownloadLink,
  PDFViewer,
  ReportTemplate,
  registerFont,
} from '@ballerine/react-pdf-toolkit';
import { useCallback, useMemo } from 'react';
import './App.css';
import { exampleData } from './example-data';

registerFont(Font);

export default function App() {
  const report = useMemo(() => <ReportTemplate report={exampleData} />, []);

  const handleDownloadFromServer = useCallback(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reports`, {
      method: 'GET',
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }, []);

  return (
    <div className="container">
      <div className="controls">
        <PDFDownloadLink document={report} fileName="report.pdf">
          <button>Generate on client</button>
        </PDFDownloadLink>
        <button onClick={handleDownloadFromServer}>Fetch from server</button>
      </div>
      <div className="pdf">
        <PDFViewer width={'100%'} height={'100%'}>
          {report}
        </PDFViewer>
      </div>
    </div>
  );
}
