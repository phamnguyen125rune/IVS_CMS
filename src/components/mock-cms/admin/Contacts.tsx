'use client';

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  Reply,
  Search,
  Send,
  Trash2,
  X,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import { FormDetailService } from '@/services/contact.service';

import type {
  FormDetail,
  FormDetailPaginationResponse,
  SingleFormDetailResponse,
} from '@/types/contact.type';

/* =========================================================
   STATUS CONFIG
========================================================= */

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
    icon: typeof AlertCircle;
  }
> = {
  new: {
    label: 'Mới',
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    icon: AlertCircle,
  },

  read: {
    label: 'Đã xem',
    className:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    icon: Eye,
  },

  replied: {
    label: 'Đã phản hồi',
    className:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    icon: CheckCircle,
  },
};

/* =========================================================
   HELPERS
========================================================= */

function getStatus(contact: FormDetail) {
  return contact.status?.toLowerCase() || 'new';
}

function formatDate(value?: string) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Contacts() {
  /* =======================================================
     LIST STATE
  ======================================================== */

  const [contactList, setContactList] = useState<FormDetail[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     FILTER
  ======================================================== */

  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState('ALL');

  const [page, setPage] = useState(1);

  const [pageSize] = useState(10);

  const [totalElements, setTotalElements] = useState(0);

  /* =======================================================
     MODALS
  ======================================================== */

  const [viewContact, setViewContact] = useState<FormDetail | null>(
    null
  );

  const [replyContact, setReplyContact] = useState<FormDetail | null>(
    null
  );

  const [deleteContact, setDeleteContact] =
    useState<FormDetail | null>(null);

  const [detailLoading, setDetailLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [replyMessage, setReplyMessage] = useState('');

  /* =======================================================
     FETCH LIST
  ======================================================== */

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response =
        await FormDetailService.getFormDetails(
          page,
          pageSize,
          statusFilter,
          search
        );

      /*
       * Backend response:
       *
       * {
       *   statusCode: 200,
       *   error: null,
       *   message: "...",
       *   data: {
       *     meta: {
       *       page: 1,
       *       pageSize: 10,
       *       pages: 1,
       *       total: 2
       *     },
       *     result: [...]
       *   }
       * }
       */

      const data = response.data;

      const contacts = data?.result ?? [];

      setContactList(contacts);

      setTotalElements(data?.meta?.total ?? contacts.length);
    } catch (err: unknown) {
      console.error(
        'Lỗi khi tải danh sách form:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Không thể tải danh sách biểu mẫu.'
      );

      setContactList([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    statusFilter,
    search,
  ]);

  /* =======================================================
     LOAD
  ======================================================== */

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  /* =======================================================
     SEARCH
  ======================================================== */

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setPage(1);
  };

  /* =======================================================
     STATUS FILTER
  ======================================================== */

  const handleStatusFilter = (
    status: string
  ) => {
    setStatusFilter(status);
    setPage(1);
  };

  /* =======================================================
     VIEW DETAIL
  ======================================================== */

  const handleView = async (
    contact: FormDetail
  ) => {
    const id = contact.formId;

    if (!id) {
      return;
    }

    setViewContact(contact);
    setDetailLoading(true);

    try {
      const response =
        await FormDetailService.getFormDetailById(
          id
        );

      /*
       * Backend:
       *
       * {
       *   statusCode: 200,
       *   message: "...",
       *   data: FormDetail
       * }
       */

      const detail =
        response.data;

      if (detail) {
        setViewContact(detail);
      }

      /*
       * NEW -> READ
       *
       * Backend đang sử dụng status lowercase.
       */
      if (
        contact.status?.toLowerCase() ===
        'new'
      ) {
        await FormDetailService.updateFormDetailStatus(
          id,
          'read'
        );

        /*
         * Reload danh sách để cập nhật badge.
         */
        await fetchContacts();
      }
    } catch (err) {
      console.error(
        'Lỗi khi lấy chi tiết form:',
        err
      );
    } finally {
      setDetailLoading(false);
    }
  };

  /* =======================================================
     REPLY
  ======================================================== */

  const handleOpenReply = (
    contact: FormDetail
  ) => {
    setReplyContact(contact);
    setReplyMessage('');
  };

  const handleSendReply = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!replyContact) {
      return;
    }

    const id = replyContact.formId;

    if (!id || !replyMessage.trim()) {
      return;
    }

    setActionLoading(true);

    try {
      await FormDetailService.replyFormDetail(
        id,
        replyMessage.trim()
      );

      setReplyContact(null);
      setReplyMessage('');

      await fetchContacts();
    } catch (err: unknown) {
      console.error(
        'Lỗi khi phản hồi form:',
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : 'Gửi phản hồi thất bại.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================== */

  const handleDelete = async () => {
    if (!deleteContact) {
      return;
    }

    const id = deleteContact.formId;

    if (!id) {
      return;
    }

    setActionLoading(true);

    try {
      await FormDetailService.deleteFormDetail(
        id
      );

      setDeleteContact(null);

      /*
       * Reload dữ liệu sau khi xóa.
       */
      await fetchContacts();
    } catch (err: unknown) {
      console.error(
        'Lỗi khi xóa form:',
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : 'Xóa biểu mẫu thất bại.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =======================================================
     NEW COUNT
  ======================================================== */

  const newCount =
    contactList.filter(
      (contact) =>
        contact.status?.toLowerCase() ===
        'new'
    ).length;

  /* =======================================================
     PAGINATION
  ======================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalElements / pageSize
    )
  );

  /* =======================================================
     RENDER
  ======================================================== */

  return (
    <div
      className="relative p-6"
      style={{
        color: 'var(--text)',
      }}
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="
              font-display text-xl
              font-bold
            "
            style={{
              color: 'var(--text)',
            }}
          >
            Quản lý Biểu mẫu
          </h1>

          <p
            className="mt-0.5 text-sm"
            style={{
              color:
                'var(--text-secondary)',
            }}
          >
            {newCount} biểu mẫu mới
            chờ xử lý
          </p>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================== */}

      {error && (
        <div
          className="
            mb-5 flex items-center gap-2
            rounded-xl border px-4 py-3
            text-sm
          "
          style={{
            background:
              'var(--error-light)',
            borderColor:
              'var(--error)',
            color:
              'var(--error)',
          }}
        >
          <AlertCircle size={16} />

          <span>{error}</span>

          <button
            type="button"
            onClick={fetchContacts}
            className="
              ml-auto rounded-lg
              px-3 py-1.5 text-xs
              font-semibold
            "
            style={{
              background:
                'var(--surface)',
              color: 'var(--text)',
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* =================================================
          FILTERS
      ================================================== */}

      <div
        className="
          mb-5 flex flex-wrap gap-3
          rounded-xl border p-4
        "
        style={{
          background:
            'var(--surface)',
          borderColor:
            'var(--border)',
        }}
      >
        <div
          className="
            relative min-w-48 flex-1
          "
        >
          <Search
            size={15}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
            "
            style={{
              color:
                'var(--text-muted)',
            }}
          />

          <input
            value={search}
            onChange={(e) =>
              handleSearchChange(
                e.target.value
              )
            }
            placeholder="Tìm theo tên, email..."
            className="
              w-full rounded-lg
              border py-2 pl-9 pr-3
              text-sm outline-none
              focus:border-[var(--primary)]
            "
            style={{
              background:
                'var(--surface)',
              color:
                'var(--text)',
              borderColor:
                'var(--border)',
            }}
          />
        </div>

        <div className="flex gap-1">
          {[
            {
              value: 'ALL',
              label: 'Tất cả',
            },
            {
              value: 'new',
              label: 'Mới',
            },
            {
              value: 'read',
              label: 'Đã xem',
            },
            {
              value: 'replied',
              label: 'Đã phản hồi',
            },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                handleStatusFilter(
                  item.value
                )
              }
              className="
                rounded-lg px-3 py-2
                text-xs font-medium
                transition-colors
              "
              style={
                statusFilter ===
                item.value
                  ? {
                      background:
                        'var(--primary)',
                      color:
                        'var(--primary-foreground)',
                    }
                  : {
                      color:
                        'var(--text-secondary)',
                    }
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================== */}

      <div
        className="
          overflow-hidden rounded-xl
          border
        "
        style={{
          background:
            'var(--surface)',
          borderColor:
            'var(--border)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b"
                style={{
                  background:
                    'var(--surface-secondary)',
                  borderColor:
                    'var(--border)',
                }}
              >
                <th
                  className="
                    px-5 py-3 text-left
                    text-xs font-semibold
                    uppercase tracking-wide
                  "
                  style={{
                    color:
                      'var(--text-muted)',
                  }}
                >
                  Người liên hệ
                </th>

                <th
                  className="
                    px-5 py-3 text-left
                    text-xs font-semibold
                    uppercase tracking-wide
                  "
                  style={{
                    color:
                      'var(--text-muted)',
                  }}
                >
                  Mã biểu mẫu
                </th>

                <th
                  className="
                    px-5 py-3 text-left
                    text-xs font-semibold
                    uppercase tracking-wide
                  "
                  style={{
                    color:
                      'var(--text-muted)',
                  }}
                >
                  Trạng thái
                </th>

                <th
                  className="
                    px-5 py-3 text-left
                    text-xs font-semibold
                    uppercase tracking-wide
                  "
                  style={{
                    color:
                      'var(--text-muted)',
                  }}
                >
                  Thời gian
                </th>

                <th
                  className="
                    px-5 py-3 text-right
                    text-xs font-semibold
                    uppercase tracking-wide
                  "
                  style={{
                    color:
                      'var(--text-muted)',
                  }}
                >
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {/* =================================================
                  LOADING
              ================================================== */}

              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-14"
                  >
                    <div
                      className="
                        flex flex-col
                        items-center
                        justify-center
                        gap-3
                      "
                      style={{
                        color:
                          'var(--text-muted)',
                      }}
                    >
                      <Loader2
                        size={24}
                        className="animate-spin"
                      />

                      <span className="text-sm">
                        Đang tải danh sách
                        biểu mẫu...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : contactList.length > 0 ? (
                contactList.map(
                  (contact) => {
                    const status =
                      getStatus(contact);

                    const config =
                      statusConfig[
                        status
                      ] ??
                      statusConfig.new;

                    const StatusIcon =
                      config.icon;

                    return (
                      <tr
                        key={contact.formId}
                        className="
                          border-t
                          transition-colors
                        "
                        style={{
                          borderColor:
                            'var(--border)',
                        }}
                      >
                        {/* CONTACT */}

                        <td className="px-5 py-3.5">
                          <div
                            className="
                              font-medium
                            "
                            style={{
                              color:
                                'var(--text)',
                            }}
                          >
                            {contact.fullName ||
                              'Không có tên'}
                          </div>

                          <div
                            className="text-xs"
                            style={{
                              color:
                                'var(--text-muted)',
                            }}
                          >
                            {contact.email ||
                              '—'}

                            {' · '}

                            {contact.company ||
                              '—'}
                          </div>

                          <div
                            className="mt-0.5 text-xs"
                            style={{
                              color:
                                'var(--text-muted)',
                            }}
                          >
                            {contact.phoneNumber ||
                              '—'}
                          </div>
                        </td>

                        {/* FORM CODE */}

                        <td className="px-5 py-3.5">
                          <div
                            className="
                              max-w-xs truncate
                              font-medium
                            "
                            title={
                              contact.formCode
                            }
                            style={{
                              color:
                                'var(--text-secondary)',
                            }}
                          >
                            {contact.formCode ||
                              '—'}
                          </div>

                          <div
                            className="
                              mt-1 max-w-xs
                              truncate text-xs
                            "
                            title={
                              contact.message
                            }
                            style={{
                              color:
                                'var(--text-muted)',
                            }}
                          >
                            {contact.message ||
                              '—'}
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-3.5">
                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              whitespace-nowrap
                              rounded-full
                              px-2.5 py-1
                              text-xs
                              font-medium
                              ${config.className}
                            `}
                          >
                            <StatusIcon
                              size={12}
                            />

                            {config.label}
                          </span>
                        </td>

                        {/* DATE */}

                        <td className="px-5 py-3.5">
                          <div
                            className="
                              flex items-center
                              gap-1.5
                              whitespace-nowrap
                              text-xs
                            "
                            style={{
                              color:
                                'var(--text-muted)',
                            }}
                          >
                            <Clock size={11} />

                            {formatDate(
                              contact.createdAt
                            )}
                          </div>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-3.5">
                          <div
                            className="
                              flex items-center
                              justify-end gap-1
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  contact
                                )
                              }
                              className="
                                rounded-lg p-1.5
                                transition-colors
                                hover:bg-[var(--hover)]
                              "
                              style={{
                                color:
                                  'var(--text-muted)',
                              }}
                              title="Xem chi tiết"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleOpenReply(
                                  contact
                                )
                              }
                              className="
                                rounded-lg p-1.5
                                transition-colors
                                hover:bg-[var(--hover)]
                              "
                              style={{
                                color:
                                  'var(--text-muted)',
                              }}
                              title="Phản hồi"
                            >
                              <Reply
                                size={14}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteContact(
                                  contact
                                )
                              }
                              className="
                                rounded-lg p-1.5
                                transition-colors
                                hover:bg-[var(--hover)]
                              "
                              style={{
                                color:
                                  'var(--text-muted)',
                              }}
                              title="Xóa biểu mẫu"
                            >
                              <Trash2
                                size={14}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="
                      px-5 py-12
                      text-center
                    "
                  >
                    <div
                      style={{
                        color:
                          'var(--text-muted)',
                      }}
                    >
                      Không tìm thấy biểu
                      mẫu nào.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================== */}

        {!loading &&
          contactList.length > 0 && (
            <div
              className="
                flex items-center
                justify-between
                border-t px-5 py-3
              "
              style={{
                borderColor:
                  'var(--border)',
                background:
                  'var(--surface-secondary)',
              }}
            >
              <span
                className="text-xs"
                style={{
                  color:
                    'var(--text-muted)',
                }}
              >
                Trang {page} / {totalPages}
                {' · '}
                {totalElements} biểu mẫu
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage(
                      (prev) =>
                        Math.max(
                          1,
                          prev - 1
                        )
                    )
                  }
                  className="
                    rounded-lg border
                    px-3 py-1.5
                    text-xs
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                  style={{
                    borderColor:
                      'var(--border)',
                    color:
                      'var(--text-secondary)',
                  }}
                >
                  Trước
                </button>

                <button
                  type="button"
                  disabled={
                    page >= totalPages
                  }
                  onClick={() =>
                    setPage(
                      (prev) =>
                        Math.min(
                          totalPages,
                          prev + 1
                        )
                    )
                  }
                  className="
                    rounded-lg border
                    px-3 py-1.5
                    text-xs
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                  style={{
                    borderColor:
                      'var(--border)',
                    color:
                      'var(--text-secondary)',
                  }}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
      </div>

      {/* =================================================
          VIEW DETAIL MODAL
      ================================================== */}

      {viewContact && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center
            justify-center
            bg-black/40 p-4
            backdrop-blur-sm
          "
          onClick={() =>
            setViewContact(null)
          }
        >
          <div
            className="
              w-full max-w-xl
              overflow-hidden
              rounded-2xl
              shadow-2xl
            "
            style={{
              background:
                'var(--surface)',
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* HEADER */}

            <div
              className="
                flex items-center
                justify-between
                border-b px-6 py-4
              "
              style={{
                borderColor:
                  'var(--border)',
              }}
            >
              <div>
                <h3
                  className="
                    font-display text-lg
                    font-bold
                  "
                  style={{
                    color:
                      'var(--text)',
                  }}
                >
                  Chi tiết biểu mẫu
                </h3>

                <p
                  className="mt-0.5 text-xs"
                  style={{
                    color:
                      'var(--text-muted)',
                  }}
                >
                  {viewContact.formCode}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewContact(null)
                }
                className="rounded-lg p-1.5"
                style={{
                  color:
                    'var(--text-muted)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}

            <div className="space-y-5 p-6">
              {detailLoading ? (
                <div
                  className="
                    flex items-center
                    justify-center
                    py-10
                  "
                >
                  <Loader2
                    size={24}
                    className="animate-spin"
                    style={{
                      color:
                        'var(--primary)',
                    }}
                  />
                </div>
              ) : (
                <>
                  <div
                    className="
                      grid grid-cols-1
                      gap-4 rounded-xl
                      border p-4
                      sm:grid-cols-2
                    "
                    style={{
                      background:
                        'var(--surface-secondary)',
                      borderColor:
                        'var(--border)',
                    }}
                  >
                    <DetailField
                      label="Họ tên"
                      value={
                        viewContact.fullName ||
                        '—'
                      }
                    />

                    <DetailField
                      label="Email"
                      value={
                        viewContact.email ||
                        '—'
                      }
                    />

                    <DetailField
                      label="Số điện thoại"
                      value={
                        viewContact.phoneNumber ||
                        '—'
                      }
                    />

                    <DetailField
                      label="Công ty"
                      value={
                        viewContact.company ||
                        '—'
                      }
                    />

                    <DetailField
                      label="Mã biểu mẫu"
                      value={
                        viewContact.formCode ||
                        '—'
                      }
                    />

                    <DetailField
                      label="Thời gian gửi"
                      value={formatDate(
                        viewContact.createdAt
                      )}
                    />
                  </div>

                  <div>
                    <span
                      className="
                        mb-1 block text-xs
                        font-medium
                      "
                      style={{
                        color:
                          'var(--text-muted)',
                      }}
                    >
                      Nội dung
                    </span>

                    <div
                      className="
                        whitespace-pre-wrap
                        rounded-xl border
                        p-4 text-sm
                        leading-relaxed
                      "
                      style={{
                        background:
                          'var(--surface)',
                        color:
                          'var(--text-secondary)',
                        borderColor:
                          'var(--border)',
                      }}
                    >
                      {viewContact.message ||
                        '—'}
                    </div>
                  </div>

                  {viewContact.replyMessage && (
                    <div>
                      <span
                        className="
                          mb-1 block text-xs
                          font-medium
                        "
                        style={{
                          color:
                            'var(--text-muted)',
                        }}
                      >
                        Nội dung phản hồi
                      </span>

                      <div
                        className="
                          whitespace-pre-wrap
                          rounded-xl border
                          p-4 text-sm
                          leading-relaxed
                        "
                        style={{
                          background:
                            'var(--success-light)',
                          color:
                            'var(--text-secondary)',
                          borderColor:
                            'var(--border)',
                        }}
                      >
                        {
                          viewContact.replyMessage
                        }
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* FOOTER */}

            <div
              className="
                flex items-center
                justify-end gap-3
                border-t px-6 py-4
              "
              style={{
                background:
                  'var(--surface-secondary)',
                borderColor:
                  'var(--border)',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setViewContact(null)
                }
                className="
                  rounded-xl border
                  px-4 py-2 text-sm
                "
                style={{
                  borderColor:
                    'var(--border)',
                  color:
                    'var(--text-secondary)',
                }}
              >
                Đóng
              </button>

              <button
                type="button"
                onClick={() => {
                  handleOpenReply(
                    viewContact
                  );
                  setViewContact(null);
                }}
                className="
                  flex items-center
                  gap-1.5 rounded-xl
                  px-4 py-2
                  text-sm font-semibold
                "
                style={{
                  background:
                    'var(--primary)',
                  color:
                    'var(--primary-foreground)',
                }}
              >
                <Reply size={14} />

                Phản hồi ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          REPLY MODAL
      ================================================== */}

      {replyContact && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center
            justify-center
            bg-black/40 p-4
            backdrop-blur-sm
          "
          onClick={() =>
            !actionLoading &&
            setReplyContact(null)
          }
        >
          <form
            onSubmit={handleSendReply}
            className="
              w-full max-w-xl
              overflow-hidden
              rounded-2xl
              shadow-2xl
            "
            style={{
              background:
                'var(--surface)',
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              className="
                flex items-center
                justify-between
                border-b px-6 py-4
              "
              style={{
                background:
                  'var(--success-light)',
                borderColor:
                  'var(--border)',
              }}
            >
              <div>
                <h3
                  className="
                    flex items-center
                    gap-2 font-display
                    text-lg font-bold
                  "
                  style={{
                    color:
                      'var(--text)',
                  }}
                >
                  <Reply
                    size={18}
                    style={{
                      color:
                        'var(--success)',
                    }}
                  />

                  Phản hồi biểu mẫu
                </h3>

                <p
                  className="
                    mt-0.5 text-xs
                  "
                  style={{
                    color:
                      'var(--text-secondary)',
                  }}
                >
                  Gửi email tới:{' '}
                  {replyContact.email ||
                    '—'}
                </p>
              </div>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  setReplyContact(null)
                }
                className="rounded-lg p-1.5"
                style={{
                  color:
                    'var(--text-muted)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <span
                  className="
                    mb-1 block text-xs
                    font-medium
                  "
                  style={{
                    color:
                      'var(--text-muted)',
                  }}
                >
                  Đang trả lời cho
                  biểu mẫu:
                </span>

                <div
                  className="
                    rounded-lg border
                    p-3
                  "
                  style={{
                    background:
                      'var(--surface-secondary)',
                    color:
                      'var(--text)',
                    borderColor:
                      'var(--border)',
                  }}
                >
                  <p className="text-sm font-semibold">
                    {replyContact.formCode ||
                      '—'}
                  </p>

                  <p
                    className="
                      mt-1 text-xs
                      line-clamp-2
                    "
                    style={{
                      color:
                        'var(--text-secondary)',
                    }}
                  >
                    {replyContact.message ||
                      '—'}
                  </p>
                </div>
              </div>

              <div>
                <label
                  className="
                    mb-1.5 block text-xs
                    font-medium
                  "
                  style={{
                    color:
                      'var(--text-muted)',
                  }}
                >
                  Nội dung email
                  phản hồi{' '}
                  <span
                    style={{
                      color:
                        'var(--error)',
                    }}
                  >
                    *
                  </span>
                </label>

                <textarea
                  required
                  rows={6}
                  value={replyMessage}
                  onChange={(e) =>
                    setReplyMessage(
                      e.target.value
                    )
                  }
                  disabled={
                    actionLoading
                  }
                  placeholder={`Chào ${replyContact.fullName || 'bạn'},\n\nCảm ơn bạn đã liên hệ...`}
                  className="
                    w-full resize-none
                    rounded-xl border
                    px-4 py-3 text-sm
                    outline-none
                    focus:border-[var(--primary)]
                  "
                  style={{
                    background:
                      'var(--surface)',
                    color:
                      'var(--text)',
                    borderColor:
                      'var(--border)',
                  }}
                />
              </div>
            </div>

            <div
              className="
                flex items-center
                justify-end gap-3
                border-t px-6 py-4
              "
              style={{
                borderColor:
                  'var(--border)',
              }}
            >
              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  setReplyContact(null)
                }
                className="
                  rounded-xl border
                  px-4 py-2.5
                  text-sm font-medium
                "
                style={{
                  borderColor:
                    'var(--border)',
                  color:
                    'var(--text-secondary)',
                }}
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={
                  actionLoading ||
                  !replyMessage.trim()
                }
                className="
                  flex items-center
                  gap-1.5 rounded-xl
                  px-5 py-2.5
                  text-sm font-semibold
                  disabled:opacity-50
                "
                style={{
                  background:
                    'var(--success)',
                  color:
                    'var(--primary-foreground)',
                }}
              >
                {actionLoading ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Send size={14} />
                )}

                {actionLoading
                  ? 'Đang gửi...'
                  : 'Gửi phản hồi'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================
          DELETE MODAL
      ================================================== */}

      {deleteContact && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center
            justify-center
            bg-black/40 p-4
            backdrop-blur-sm
          "
          onClick={() =>
            !actionLoading &&
            setDeleteContact(null)
          }
        >
          <div
            className="
              w-full max-w-sm
              rounded-2xl p-6
              text-center shadow-2xl
            "
            style={{
              background:
                'var(--surface)',
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              className="
                mx-auto mb-4
                flex h-12 w-12
                items-center justify-center
                rounded-full
              "
              style={{
                background:
                  'var(--error-light)',
                color:
                  'var(--error)',
              }}
            >
              <Trash2 size={24} />
            </div>

            <h3
              className="
                mb-2 font-display
                text-lg font-bold
              "
              style={{
                color:
                  'var(--text)',
              }}
            >
              Xóa biểu mẫu?
            </h3>

            <p
              className="
                mb-6 text-sm
                leading-relaxed
              "
              style={{
                color:
                  'var(--text-secondary)',
              }}
            >
              Bạn có chắc chắn muốn
              xóa biểu mẫu từ{' '}

              <span
                className="font-semibold"
                style={{
                  color:
                    'var(--text)',
                }}
              >
                {deleteContact.fullName ||
                  'người dùng này'}
              </span>

              {' '}không?
              <br />

              Thao tác này{' '}

              <strong
                style={{
                  color:
                    'var(--error)',
                }}
              >
                không thể hoàn tác
              </strong>
              .
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  setDeleteContact(null)
                }
                className="
                  w-full rounded-xl
                  border px-5 py-2.5
                  text-sm font-medium
                "
                style={{
                  borderColor:
                    'var(--border)',
                  color:
                    'var(--text-secondary)',
                }}
              >
                Hủy
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDelete}
                className="
                  flex w-full
                  items-center
                  justify-center
                  gap-2 rounded-xl
                  px-5 py-2.5
                  text-sm font-semibold
                  disabled:opacity-50
                "
                style={{
                  background:
                    'var(--error)',
                  color:
                    'var(--primary-foreground)',
                }}
              >
                {actionLoading && (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                )}

                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DETAIL FIELD
========================================================= */

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <span
        className="
          mb-1 block text-xs
          font-medium
        "
        style={{
          color:
            'var(--text-muted)',
        }}
      >
        {label}
      </span>

      <p
        className="font-medium"
        style={{
          color:
            'var(--text)',
        }}
      >
        {value}
      </p>
    </div>
  );
}