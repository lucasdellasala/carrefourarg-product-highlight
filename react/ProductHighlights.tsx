import React, { FC, useContext, ReactNode, useMemo } from 'react'
import { useProduct, ProductTypes } from 'vtex.product-context'

import { getSeller } from './modules/seller'
interface ProductHighlightsProps {
  children: NonNullable<ReactNode>
}

const ProductHighlights: FC<ProductHighlightsProps> = ({
  children,
}) => {
  const { product, selectedItem } = useProduct() ?? {}
  const selectedSku = selectedItem ?? product?.items?.[0]
  const seller: ProductTypes.Seller | null = selectedSku
    ? getSeller(selectedSku)
    : null

  let discountHighlights = seller?.commertialOffer?.discountHighlights ?? []
  let teasers = seller?.commertialOffer?.teasers ?? []
  let clusterHighlights = product?.clusterHighlights ?? []

  const bestPromoByType = (promotion: any) => {
    if (promotion != undefined) {
      if (promotion.length > 1) {
        let bestPromo;
        for (let i = 0; i < promotion.length; i++) {
          const promo = promotion[i].name

          const splitedPromo = promo.split("-")
          const discount = discountValue(splitedPromo)
          const lastDiscount = discountValue(bestPromo)
          if (discount >= lastDiscount) {
            bestPromo = promotion[i]
          }
        }

        return [{ name: bestPromo.name, id: "1" }]
      } else if (promotion.length == 1) {
        return promotion
      } else {
        return [{ name: "No promo", id: "No" }]
      }
    } else {
      return [{ name: "No promo", id: "No" }]
    }
  }

  const discountValue = (promotion: any): number => {
    if (promotion == undefined) {
      return 0
    }
    if (promotion[0] !== "PROMO") {
      return 0
    }
    const percentaje: any = promotion?.[4]
    const listOfNumbers: any = promotion?.[3]?.toString().split(",")
    const numberOfProducts: number = listOfNumbers?.length

    return numberOfProducts * percentaje

  }

  discountHighlights = bestPromoByType(discountHighlights)
  teasers = bestPromoByType(teasers)
  clusterHighlights = bestPromoByType(clusterHighlights)
  //discountHighlights[0] == undefined ? discountHighlights = [{ name: "No discount highlight" }] : discountHighlights = [{ name: bestPromoByType(discountHighlights) }]
  //teasers[0] == undefined ? teasers = [{ name: "No teasers" }] : teasers = [{ name: bestPromoByType(teasers) }]
  //clusterHighlights[0] == undefined ? clusterHighlights = [{ name: "No cluster highlight", id: "No" }] : clusterHighlights = [{ name: bestPromoByType(clusterHighlights), id: "1" }]


  const highlights = useMemo(() => {
    const promotionInfo = [...discountHighlights, ...teasers, ...clusterHighlights]
    return promotionInfo
  }, [discountHighlights, teasers, clusterHighlights])

  if (!product) {
    return null
  }

  return (
    <>
      <ProductHighlightContextProvider
        highlight={highlights}
      >
        {children}
      </ProductHighlightContextProvider>
    </>
  )
}

interface Highlight {
  id?: string
  name: string
}

const ProductHighlightContext = React.createContext<
  ProductHighlightContextProviderProps | undefined
>(undefined)

interface ProductHighlightContextProviderProps {
  highlight: Highlight[]
}

const ProductHighlightContextProvider: FC<ProductHighlightContextProviderProps> = ({
  highlight,
  children,
}) => {
  const contextValue = useMemo(
    () => ({
      highlight,
    }),
    [highlight]
  )

  return (
    <ProductHighlightContext.Provider value={contextValue}>
      {children}
    </ProductHighlightContext.Provider>
  )
}

export const useHighlight = () => {
  const group = useContext(ProductHighlightContext)

  return group
}

export default ProductHighlights
