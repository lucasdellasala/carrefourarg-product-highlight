import React, { FC, useMemo, ReactNode } from 'react'
import { IOMessageWithMarkers } from 'vtex.native-types'
import { useCssHandles } from 'vtex.css-handles'

import { useHighlight } from './ProductHighlights'

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

    const bestPromotion = () => {
      const discountHighlights = value.highlight[0]?.name
      const teasers = value.highlight[1]?.name
      const clusterHighlights = value.highlight[2]?.name


      const teasersList = teasers?.split("-")
      const discountHighlightsList = discountHighlights?.split("-")
      const clusterHighlightsList = clusterHighlights?.split("-")

      const discountValue = (promotion: Array<string>): number => {
        if (promotion[0] !== "PROMO") {
          return 0
        }
        const percentaje: any = promotion?.[4]
        //@ts-ignore
        const listOfNumbers: any = promotion?.[3]?.toString().split(",")
        const numberOfProducts: number = listOfNumbers?.length

        return numberOfProducts * percentaje
      }

      const discountsList = [
        {
          value: discountValue(teasersList),
          list: teasersList
        },
        {
          value: discountValue(discountHighlightsList),
          list: discountHighlightsList
        },
        {
          value: discountValue(clusterHighlightsList),
          list: clusterHighlightsList
        }
      ]

      const sortedDiscountsList = discountsList.sort((a, b) => b.value - a.value)

      if (sortedDiscountsList[0].value != 0) {
        return sortedDiscountsList[0].list
      } else {
        return null
      }
    }

    const bestValue = bestPromotion()
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