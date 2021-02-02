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

export const bestPromotion = (value: any) => {
    const discountHighlights = value.highlight[0].name
    const teasers = value.highlight[1].name
    const clusterHighlights = value.highlight[2].name

    const teasersList = teasers.split("-") ?? ""
    const discountHighlightsList = discountHighlights.split("-") ?? ""
    const clusterHighlightsList = clusterHighlights.split("-") ?? ""

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

    if (discountsList[0].value == discountsList[1].value && discountsList[0].value == discountsList[2].value) {
        return discountsList[0].list
    }

    const sortedDiscountsList = discountsList.sort((a, b) => b.value - a.value)

    if (sortedDiscountsList[0].value != 0) {
        return sortedDiscountsList[0].list
    } else {
        return null
    }
}

export const bestPromoByType = (promotion: any) => {
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

