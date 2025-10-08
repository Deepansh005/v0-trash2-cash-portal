export function exportToCSV<T extends Record<string, any>>(rows: T[], filename: string) {
  if (!rows.length) {
    download("data:text/csv;charset=utf-8,", filename)
    return
  }
  const headers = Object.keys(rows[0])
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => formatCSVCell(r[h])).join(","))].join("\n")
  const uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
  download(uri, filename)
}

function download(uri: string, filename: string) {
  const link = document.createElement("a")
  link.setAttribute("href", uri)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function formatCSVCell(value: unknown): string {
  if (value == null) return ""
  const str = String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}
