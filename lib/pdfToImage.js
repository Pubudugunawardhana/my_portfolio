// Browser-only: render the first page of a PDF to a JPEG File, so a PDF
// certificate can be shown on the site like any other image.
let pdfjsPromise;

function loadPdfjs() {
  pdfjsPromise ??= import('pdfjs-dist').then((pdfjs) => {
    // Bundled by Turbopack via the new Worker(new URL(...)) pattern.
    pdfjs.GlobalWorkerOptions.workerPort = new Worker(new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url), {
      type: 'module',
    });
    return pdfjs;
  });
  return pdfjsPromise;
}

export async function pdfFirstPageToJpeg(file, maxWidth = 2000) {
  const pdfjs = await loadPdfjs();
  // In pdfjs v6 only the loading task (not the document) has destroy().
  const task = pdfjs.getDocument({ data: await file.arrayBuffer() });
  try {
    const pdf = await task.promise;
    const page = await pdf.getPage(1);
    const scale = Math.min(3, maxWidth / page.getViewport({ scale: 1 }).width);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({ canvas, viewport }).promise;

    const blob = await new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not convert the PDF'))), 'image/jpeg', 0.9)
    );
    return new File([blob], `${file.name.replace(/\.pdf$/i, '')}.jpg`, { type: 'image/jpeg' });
  } finally {
    await task.destroy();
  }
}
