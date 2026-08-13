/** Build a SpreadsheetML .xls file Excel can open. */
function escapeXml(value: string | number | boolean | null | undefined) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function downloadExcelSheet(options: {
  filename: string;
  sheetName?: string;
  rows: Array<Array<string | number | boolean | null | undefined>>;
}) {
  const sheetName = escapeXml(options.sheetName || 'Sheet1');
  const tableRows = options.rows
    .map(row => {
      const cells = row
        .map(cell => {
          const text = escapeXml(cell);
          const isNumber =
            typeof cell === 'number' && Number.isFinite(cell);
          return `<Cell><Data ss:Type="${isNumber ? 'Number' : 'String'}">${
            isNumber ? cell : text
          }</Data></Cell>`;
        })
        .join('');
      return `<Row>${cells}</Row>`;
    })
    .join('');

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="${sheetName}">
  <Table>${tableRows}</Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = options.filename.endsWith('.xls')
    ? options.filename
    : `${options.filename}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
