'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { MOCK_LOGS } from './constants/settings.constants';

export default function SystemLogs() {
  const [logSearch, setLogSearch] = useState('');

  const filteredLogs = useMemo(() => {
    const keyword = logSearch.toLowerCase();

    return MOCK_LOGS.filter(
      (log) =>
        log.account.toLowerCase().includes(keyword) || log.action.toLowerCase().includes(keyword)
    );
  }, [logSearch]);

  return (
    <div
      className="
        flex flex-col
        overflow-hidden rounded-xl border
      "
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header */}
      <div
        className="
          space-y-4 border-b p-5
        "
        style={{
          borderColor: 'var(--border)',
        }}
      >
        <h2
          className="
            font-display font-semibold
          "
          style={{
            color: 'var(--text)',
          }}
        >
          Nhật ký hệ thống
        </h2>

        <div className="relative">
          <Search
            size={16}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
            "
            style={{
              color: 'var(--text-muted)',
            }}
          />

          <input
            type="text"
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            placeholder="
              Tìm theo tài khoản hoặc thao tác...
            "
            className="
              w-full rounded-xl border
              py-2 pl-9 pr-3 text-sm
              outline-none
              focus:border-[var(--primary)]
            "
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr
              className="border-b"
              style={{
                background: 'var(--surface-secondary)',
                borderColor: 'var(--border)',
              }}
            >
              <th className={thClass}>Thời gian</th>

              <th className={thClass}>Tài khoản</th>

              <th className={thClass}>Thao tác</th>

              <th className={thClass}>Đối tượng</th>

              <th className={thClass}>IP</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b transition-colors"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                <td className={tdMuted}>{log.time}</td>

                <td
                  className="
                    px-5 py-3.5 font-medium
                  "
                  style={{
                    color: 'var(--text)',
                  }}
                >
                  {log.account}
                </td>

                <td className={tdText}>{log.action}</td>

                <td className={tdText}>{log.target}</td>

                <td
                  className="
                    px-5 py-3.5 font-mono
                    text-xs
                  "
                  style={{
                    color: 'var(--text-muted)',
                  }}
                >
                  {log.ip}
                </td>
              </tr>
            ))}

            {filteredLogs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center"
                  style={{
                    color: 'var(--text-muted)',
                  }}
                >
                  Không tìm thấy nhật ký.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thClass = `
  px-5 py-3
  font-semibold
`;

const tdMuted = `
  px-5 py-3.5
`;

const tdText = `
  px-5 py-3.5
`;
