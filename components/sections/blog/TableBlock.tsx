"use client";

import type { TableBlock as TableBlockType } from "@/lib/blogBuilder";

interface TableBlockProps {
  block: TableBlockType;
}

export default function TableBlock({ block }: TableBlockProps) {
  const columns = (block.columns ?? []).filter(
    (c): c is string => c != null && c !== ""
  );
  const rows = (block.rows ?? []).filter(
    (r): r is { cells?: (string | null)[] | null } => r != null && "cells" in r
  );
  if (columns.length === 0) return null;

  return (
    <section className="my-8 md:my-10 overflow-x-auto">
      {block.title && (
        <h3 className="text-lg font-semibold text-[#1F1D1D] mb-4">
          {block.title}
        </h3>
      )}
      <table className="w-full border-collapse min-w-[400px]">
        <thead>
          <tr className="bg-black text-white">
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left font-semibold px-4 py-3 text-sm"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const cells = Array.isArray(row.cells) ? row.cells : [];
            return (
              <tr
                key={rowIndex}
                className={
                  rowIndex % 2 === 0 ? "bg-white" : "bg-gray-100"
                }
              >
                {columns.map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-200 px-4 py-3 text-[#1F1D1D]"
                  >
                    {cells[colIndex] ?? "—"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
