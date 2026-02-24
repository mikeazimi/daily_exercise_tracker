export function toCSV(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const escape = (val: string | number | null | undefined) => {
    if (val === null || val === undefined) return "";
    const s = String(val);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  return [
    headers.join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ].join("\n");
}
