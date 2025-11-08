import { ComponentPropsWithoutRef, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import type { ImageProps } from 'next/image'
import styles from './image.module.scss'

type CustomImageProps = Omit<ComponentPropsWithoutRef<'img'>, 'width' | 'height'> &
  Pick<
    ImageProps,
    'priority' | 'quality' | 'placeholder' | 'blurDataURL' | 'unoptimized' | 'objectFit' | 'objectPosition' | 'sizes' | 'loading'
  > & {
    src: string
    width?: number
    height?: number
    alt?: string
    caption?: string
    layout?: 'intrinsic' | 'fixed' | 'responsive'
  }

const CustomImage = ({
  src,
  width,
  height,
  alt = '',
  title,
  caption,
  layout = 'intrinsic',
  ...imgProps
}: CustomImageProps): JSX.Element => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const {
    className,
    loading,
    sizes,
    quality,
    priority,
    placeholder,
    blurDataURL,
    unoptimized,
    objectFit,
    objectPosition,
    ...fallbackProps
  } = imgProps

  const hasDimensions = useMemo(() => typeof width === 'number' && typeof height === 'number', [height, width])
  const baseClassName = useMemo(() => {
    return [className, styles.imgTag].filter(Boolean).join(' ') || undefined
  }, [className])
  const previewClassName = useMemo(() => {
    return [className, styles.previewImgTag].filter(Boolean).join(' ') || undefined
  }, [className])
  const nextImageExtraProps = useMemo(() => {
    const extras: Partial<ImageProps> = {}

    if (loading) {
      extras.loading = loading
    }

    if (sizes) {
      extras.sizes = sizes
    }

    if (typeof quality === 'number') {
      extras.quality = quality
    }

    if (typeof priority === 'boolean') {
      extras.priority = priority
    }

    if (placeholder === 'blur' || placeholder === 'empty') {
      extras.placeholder = placeholder
    }

    if (typeof blurDataURL === 'string') {
      extras.blurDataURL = blurDataURL
    }

    if (typeof unoptimized === 'boolean') {
      extras.unoptimized = unoptimized
    }

    if (objectFit) {
      extras.objectFit = objectFit
    }

    if (objectPosition) {
      extras.objectPosition = objectPosition
    }

    return extras
  }, [blurDataURL, loading, objectFit, objectPosition, placeholder, priority, quality, sizes, unoptimized])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !isPreviewOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPreviewOpen(false)
      }
    }

    const { body } = document
    const originalOverflow = body.style.overflow

    body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMounted, isPreviewOpen])

  const handleOpenPreview = () => {
    if (!isMounted) {
      return
    }
    setIsPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
  }

  const previewLabel = title || caption || alt || '图片预览'

  const renderImage = (isPreview = false) => {
    if (hasDimensions) {
      return (
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          layout={isPreview ? 'responsive' : layout}
          className={isPreview ? previewClassName : baseClassName}
          {...nextImageExtraProps}
        />
      )
    }

    return (
      <img
        src={src}
        alt={alt}
        title={title}
        className={isPreview ? previewClassName : baseClassName}
        loading={loading ?? 'lazy'}
        sizes={sizes}
        {...fallbackProps}
      />
    )
  }

  return (
    <figure className={styles.wrapper}>
      <div>
        <button
          type="button"
          className={styles.trigger}
          onClick={handleOpenPreview}
          aria-label={`查看 ${previewLabel} 大图`}
          aria-haspopup="dialog"
        >
          {renderImage()}
        </button>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </div>
      {isMounted &&
        isPreviewOpen &&
        createPortal(
          <div className={styles.overlay} aria-modal="true" onClick={handleClosePreview}>
            <div className={styles.overlayContent} onClick={event => event.stopPropagation()}>
              <button type="button" className={styles.close} onClick={handleClosePreview} aria-label="关闭图片预览">
                &times;
              </button>
              <div className={styles.previewImage}>{renderImage(true)}</div>
              {caption && <figcaption className={styles.previewCaption}>{caption}</figcaption>}
            </div>
          </div>,
          document.body,
        )}
    </figure>
  )
}

export default CustomImage
