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

  discountHighlights[0] == undefined ? discountHighlights = [{ name: "No discount highlight" }] : discountHighlights = discountHighlights
  teasers[0] == undefined ? teasers = [{ name: "No teasers" }] : teasers = teasers
  clusterHighlights[0] == undefined ? clusterHighlights = [{ name: "No cluster highlight", id: "No" }] : clusterHighlights = clusterHighlights

  const highlights = useMemo(() => {
    const promotionInfo = [...discountHighlights, ...teasers, ...clusterHighlights]
    console.log(promotionInfo)

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
