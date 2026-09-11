'use client';

import { RECRUITMENT_CATEGORY_ID } from '@/config/post-sections';

import PostContentPanel from './components/PostContentPanel';
import PostEditorHeader from './components/PostEditorHeader';
import PostMediaLibraryModal from './components/PostMediaLibraryModal';
import PostSeoPanel from './components/PostSeoPanel';
import PostSidebar from './components/PostSidebar';
import { usePostEditor } from './hooks/usePostEditor';

export default function PostEditor() {
  const editor = usePostEditor();

  const disabled =
    editor.loading ||
    editor.loadingPost ||
    editor.uploadingImage ||
    editor.uploadingContentImage;

  return (
    <div
      className="relative mx-auto max-w-[1400px] p-6 pb-24"
      style={{ color: 'var(--text)' }}
    >
      {/* ================= ERROR ================= */}
      {editor.formError && (
        <div
          role="alert"
          className="mb-4 rounded-xl border p-4 text-sm"
          style={{
            background: 'var(--error-light)',
            color: 'var(--error)',
            borderColor: 'var(--error)',
          }}
        >
          {editor.formError}
        </div>
      )}

      {/* ================= CKEDITOR THEME ================= */}
      <style jsx global>{`
        .sticky-editor-container .ck-editor__top {
          position: sticky !important;
          top: 0 !important;
          z-index: 20 !important;
          background: var(--surface) !important;
        }

        .sticky-editor-container .ck-toolbar {
          background: var(--surface) !important;
          border-color: var(--border) !important;
          border-top-left-radius: 0.75rem !important;
          border-top-right-radius: 0.75rem !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04) !important;
        }

        .sticky-editor-container .ck-editor__main > .ck-editor__editable {
          background: var(--surface) !important;
          color: var(--text) !important;
          border-color: var(--border) !important;
        }

        .sticky-editor-container .ck-content {
          min-height: 450px !important;
          max-height: 600px !important;
          overflow-y: auto !important;
          border-bottom-left-radius: 0.75rem !important;
          border-bottom-right-radius: 0.75rem !important;
        }

        .sticky-editor-container .ck-editor__editable.ck-focused {
          border-color: var(--primary) !important;
        }

        .sticky-editor-container .ck.ck-button {
          color: var(--text-secondary) !important;
        }

        .sticky-editor-container .ck.ck-button:hover,
        .sticky-editor-container .ck.ck-button.ck-on {
          background: var(--hover) !important;
          color: var(--primary) !important;
        }

        .sticky-editor-container .ck.ck-dropdown__panel,
        .sticky-editor-container .ck.ck-list {
          background: var(--surface) !important;
          border-color: var(--border) !important;
        }

        .sticky-editor-container .ck.ck-list__item .ck-button {
          color: var(--text) !important;
        }

        .sticky-editor-container .ck.ck-list__item .ck-button:hover {
          background: var(--hover) !important;
          color: var(--primary) !important;
        }

        .sticky-editor-container .ck.ck-input {
          background: var(--surface) !important;
          color: var(--text) !important;
          border-color: var(--border) !important;
        }

        .sticky-editor-container .ck.ck-input:focus {
          border-color: var(--primary) !important;
        }

        .fullscreen-editor .ck-content {
          max-height: calc(100vh - 420px) !important;
          min-height: 450px !important;
        }
      `}</style>

      {/* ================= HEADER ================= */}
      <PostEditorHeader
        isEditMode={editor.isEditMode}
        id={editor.id}
        disabled={disabled}
        onBack={() => editor.navigate(-1)}
        onSaveDraft={() => void editor.submit('DRAFT')}
        onSubmitReview={() => void editor.submit('PENDING')}
      />

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* ================= LEFT ================= */}
        <div className="space-y-5 xl:col-span-8">
          <PostContentPanel
            formData={editor.formData}
            fullscreen={editor.isFullscreen}
            disabled={disabled}
            uploadingContentImage={editor.uploadingContentImage}
            showSummary={
              editor.formData.categoryId !==
              RECRUITMENT_CATEGORY_ID
            }
            onFullscreenChange={editor.setIsFullscreen}
            onSaveDraft={() =>
              void editor.submit('DRAFT')
            }
            onTitleChange={editor.handleTitleChange}
            onChange={editor.handleChange}
            onContentChange={editor.setContent}
            onPendingChange={
              editor.setUploadingContentImage
            }
          />

          <PostSeoPanel
            formData={editor.formData}
            open={editor.showSeo}
            onToggle={() =>
              editor.setShowSeo(!editor.showSeo)
            }
            onChange={editor.handleChange}
            onCheckbox={editor.handleCheckbox}
          />
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <PostSidebar
          formData={editor.formData}
          categories={editor.categories}
          selectedTags={editor.selectedTags}
          filteredTags={editor.filteredTags}
          availableTagCount={editor.availableTags.length}
          tagSearch={editor.tagSearch}
          showTagDropdown={editor.showTagDropdown}
          featuredImageUrl={editor.featuredImageUrl}
          uploadingImage={editor.uploadingImage}
          onChange={editor.handleChange}
          onTagSearchChange={editor.setTagSearch}
          onTagDropdownChange={
            editor.setShowTagDropdown
          }
          onToggleTag={editor.toggleTag}
          onImageUpload={editor.handleImageUpload}
          onOpenMedia={editor.openMediaLibrary}
          onRemoveFeatured={editor.removeFeaturedImage}
          onRemoveOg={editor.removeOgImage}
        />
      </div>

      {/* ================= MEDIA LIBRARY ================= */}
      <PostMediaLibraryModal
        open={editor.isMediaModalOpen}
        loading={editor.loadingMedia}
        items={editor.mediaItems}
        onClose={editor.closeMediaLibrary}
        onSelect={editor.handleSelectFromLibrary}
      />
    </div>
  );
}