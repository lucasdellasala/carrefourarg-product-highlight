import React, { FC, useMemo, ReactNode } from 'react'
import { IOMessageWithMarkers } from 'vtex.native-types'
import { useCssHandles } from 'vtex.css-handles'

import { useHighlight } from './ProductHighlights'
import { bestPromotion } from './utils/utils'

interface Props {
  message: string
  markers?: string[]
  blockClass?: string
}

interface MessageValues {
  highlightName: ReactNode
}

const CSS_HANDLES = ['productHighlightText'] as const

const ProductHighlightText: FC<Props> = ({ message = '', markers = [] }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const value = useHighlight()
  const values = useMemo(() => {
    const result: MessageValues = {
      highlightName: '',
    }

    if (!value) {
      return result
    }

    const bestValue = bestPromotion(value)
    const valueObject = {
      highlight: {
        name: bestValue?.[1],
        id: 101
      }
    }

    if (valueObject.highlight.name != undefined) {
      result.highlightName = (

        <span
          key="highlightName"
          data-highlight-name={valueObject.highlight.name}
          data-highlight-id={valueObject.highlight.id}
          className={handles.productHighlightText}
        >
          {
            valueObject.highlight.name
          }
        </span>
      )
    } else {
      result.highlightName = (<div></div>)
    }


    return result
  }, [value, handles.productHighlightText])

  if (!value || !message) {
    return null
  }

  return (
    <IOMessageWithMarkers
      handleBase="productHighlightText"
      message={message}
      markers={markers}
      values={values}
    />
  )
}

export default ProductHighlightText