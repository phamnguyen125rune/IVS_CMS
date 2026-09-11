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
    <div className="p-6 max-w-[1400px] mx-auto pb-24 relative">
      {editor.formError && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {editor.formError}
        </div>
      )}

      <style jsx global>{`
        .sticky-editor-container .ck-editor__top {
          position: sticky !important;
          top: 0 !important;
          z-index: 20 !important;
          background: #ffffff !important;
        }
        .sticky-editor-container .ck-toolbar {
          border-top-left-radius: 0.75rem !important;
          border-top-right-radius: 0.75rem !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04) !important;
        }
        .sticky-editor-container .ck-content {
          min-height: 450px !important;
          max-height: 600px !important;
          overflow-y: auto !important;
          border-bottom-left-radius: 0.75rem !important;
          border-bottom-right-radius: 0.75rem !important;
        }
        .fullscreen-editor .ck-content {
          max-height: calc(100vh - 420px) !important;
          min-height: 450px !important;
        }
      `}</style>

      <PostEditorHeader
        isEditMode={editor.isEditMode}
        id={editor.id}
        disabled={disabled}
        onBack={() => editor.navigate(-1)}
        onSaveDraft={() => void editor.submit('DRAFT')}
        onSubmitReview={() => void editor.submit('PENDING')}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-5">
          <PostContentPanel
            formData={editor.formData}
            fullscreen={editor.isFullscreen}
            disabled={disabled}
            uploadingContentImage={editor.uploadingContentImage}
            showSummary={editor.formData.categoryId !== RECRUITMENT_CATEGORY_ID}
            onFullscreenChange={editor.setIsFullscreen}
            onSaveDraft={() => void editor.submit('DRAFT')}
            onTitleChange={editor.handleTitleChange}
            onChange={editor.handleChange}
            onContentChange={editor.setContent}
            onPendingChange={editor.setUploadingContentImage}
          />

          <PostSeoPanel
            formData={editor.formData}
            open={editor.showSeo}
            onToggle={() => editor.setShowSeo(!editor.showSeo)}
            onChange={editor.handleChange}
            onCheckbox={editor.handleCheckbox}
          />
        </div>

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
          onTagDropdownChange={editor.setShowTagDropdown}
          onToggleTag={editor.toggleTag}
          onImageUpload={editor.handleImageUpload}
          onOpenMedia={editor.openMediaLibrary}
          onRemoveFeatured={editor.removeFeaturedImage}
          onRemoveOg={editor.removeOgImage}
        />
      </div>

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
