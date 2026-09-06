export default function DataTable({ columns, rows, sortBy, order, onSortChange }) {
  function handleHeaderClick(col) {
    if (!col.sortable || !onSortChange) return;
    const nextOrder = sortBy === col.key && order === 'asc' ? 'desc' : 'asc';
    onSortChange(col.key, nextOrder);
  }

  if (!rows || rows.length === 0) {
    return <div className="empty-state">No records found.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} onClick={() => handleHeaderClick(col)}>
              {col.label}
              {col.sortable && sortBy === col.key && (
                <span className="arrow">{order === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id ?? i}>
            {columns.map((col) => (
              <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
