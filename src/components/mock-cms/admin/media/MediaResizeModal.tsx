'use client';

import { useEffect, useState } from 'react';
import { X, Maximize2 } from 'lucide-react';

import { Media } from '@/types/media.type';

import '@/components/layout/admin/media_styles/MediaResizeModal.css';

interface MediaResizeModalProps {
    file: Media;
    onClose: () => void;
    onResize: (width: number, height: number) => void;
}

const PRESETS = [
    { label: '640 × 480', width: 640, height: 480 },
    { label: '800 × 600', width: 800, height: 600 },
    { label: '1024 × 768', width: 1024, height: 768 },
    { label: '1280 × 720', width: 1280, height: 720 },
    { label: '1366 × 768', width: 1366, height: 768 },
    { label: '1600 × 900', width: 1600, height: 900 },
    { label: '1920 × 1080', width: 1920, height: 1080 },
];

export default function MediaResizeModal({ file, onClose, onResize }: MediaResizeModalProps) {
    const [originalWidth, setOriginalWidth] = useState(file.mediaWidth ?? 0);
    const [originalHeight, setOriginalHeight] = useState(file.mediaHeight ?? 0);
    const [selectedSize, setSelectedSize] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        if (file.mediaWidth && file.mediaHeight) {
            setOriginalWidth(file.mediaWidth);
            setOriginalHeight(file.mediaHeight);
            return;
        }

        const image = new Image();

        image.onload = () => {
            setOriginalWidth(image.naturalWidth);
            setOriginalHeight(image.naturalHeight);
        };

        image.src = `/api/v1/media/${file.mediaId}/view`;
    }, [file]);

    const handleResize = () => {
        if (!selectedSize) return;
        onResize(selectedSize.width, selectedSize.height);
    };

    return (
        <div className="media-resize-modal__overlay" onClick={onClose}>
            <div className="media-resize-modal" onClick={(e) => e.stopPropagation()}>
                <div className="media-resize-modal__header">
                    <div>
                        <h2>Resize ảnh</h2>
                        <p>{file.fileName}</p>
                    </div>

                    <button type="button" onClick={onClose} className="media-resize-modal__close">
                        <X size={20} />
                    </button>
                </div>

                <div className="media-resize-modal__content">
                    <div className="media-resize-modal__preview">
                        <img src={`/api/v1/media/${file.mediaId}/view`} alt={file.fileName} />
                    </div>

                    <div className="media-resize-modal__info">
                        <div className="media-resize-modal__current">
                            <span>Kích thước hiện tại</span>
                            <strong>
                                {originalWidth && originalHeight
                                    ? `${originalWidth} × ${originalHeight}px`
                                    : 'Đang tải...'}
                            </strong>
                        </div>

                        <div className="media-resize-modal__options">
                            {PRESETS.map((preset) => {
                                const selected =
                                    selectedSize?.width === preset.width &&
                                    selectedSize?.height === preset.height;

                                return (
                                    <button
                                        key={`${preset.width}x${preset.height}`}
                                        type="button"
                                        className={`media-resize-modal__option ${selected ? 'media-resize-modal__option--active' : ''}`}
                                        onClick={() =>
                                            setSelectedSize({
                                                width: preset.width,
                                                height: preset.height,
                                            })
                                        }
                                    >
                                        <div className="media-resize-modal__option-icon">
                                            <Maximize2 size={18} />
                                        </div>

                                        <div className="media-resize-modal__option-content">
                                            <strong>{preset.label}</strong>
                                            <span>{preset.width} × {preset.height} pixel</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedSize && (
                            <div className="media-resize-modal__result">
                                Kích thước mới:{' '}
                                <strong>
                                    {selectedSize.width} × {selectedSize.height}px
                                </strong>
                            </div>
                        )}
                    </div>
                </div>

                <div className="media-resize-modal__footer">
                    <button type="button" onClick={onClose} className="media-resize-modal__cancel">
                        Hủy
                    </button>

                    <button
                        type="button"
                        onClick={handleResize}
                        disabled={!selectedSize}
                        className="media-resize-modal__submit"
                    >
                        Resize ảnh
                    </button>
                </div>
            </div>
        </div>
    );
}