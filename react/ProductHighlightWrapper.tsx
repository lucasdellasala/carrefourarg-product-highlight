import React, { FC, ReactNode } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { useHighlight } from './ProductHighlights'

import { bestPromotion } from './utils/utils'

interface Props {
  blockClass?: string
  children: ReactNode
}

const CSS_HANDLES = ['productHighlightWrapper'] as const

const ProductHighlightWrapper: FC<Props> = ({ children }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const value = useHighlight()

  if (!value) {
    return null
  }

  const bestValue = bestPromotion(value)
  const valueObject = {
    highlight: {
      name: bestValue?.[1],
      id: 101
    }
  }

  return (
    <div
      data-highlight-name={valueObject?.highlight?.name}
      data-highlight-id={valueObject?.highlight?.id}
      className={handles.productHighlightWrapper}
    >
      {children}
    </div>
  )
}

export default ProductHighlightWrapper