export const addToLocalWishList = (product: any) => {
    console.log(product)
    console.log("Adding to local wishList")
    let wishListMap = new Map();
    const product_obj = {
      ...product,
    }
    
    const localWishListItems = localStorage.getItem('wishListItems')
    let localWishListItemsArray = localWishListItems ? JSON.parse(localWishListItems) : [];
    // console.log("localCartItemsArray before adding product", localCartItemsArray)
    if(localWishListItemsArray.length === 0){
        wishListMap.set(product_obj.product_id,{products:product_obj,quantity:1})
    }
    else{
        localWishListItemsArray.forEach((item: any) => {
            console.log("item",item)
            wishListMap.set(item.products.product_id, item)
        })
        console.log("wishListMap",wishListMap)
        if(wishListMap.has(product_obj.product_id)){
            console.log("Product already exists in wish list")
            wishListMap.get(product_obj.product_id).quantity += 1
        }
        else{
            console.log("Product does not exist in wish list adding new product")
            wishListMap.set(product_obj.product_id, {products:product_obj,quantity:1})
        }
    }
    const updatedWishList = Array.from(wishListMap.values())
    console.log("updatedWishList",updatedWishList)
    localStorage.setItem("wishListItems",JSON.stringify(updatedWishList))
    return updatedWishList;
}


export const removeFromLocalWishList = (product:any)=>{
    console.log("Removing from local cart")
    let wishListMap = new Map();
    const localWishListItems = localStorage.getItem('wishListItems')
    let localWishListItemsArray = localWishListItems ? JSON.parse(localWishListItems) : [];
    if(localWishListItemsArray.length === 0){
        console.log("No items in wish list")
        return localWishListItemsArray;
    }
    else{
        localWishListItemsArray.forEach((item: any) => {
            wishListMap.set(item.products.product_id, item)
        })
        if(wishListMap.has(product.product_id)){
            wishListMap.delete(product.product_id)
        }
        else{
            console.log("Item not found in wish list")
        }
    }
    localStorage.setItem("wishListItems",JSON.stringify(Array.from(wishListMap.values())))
    return Array.from(wishListMap.values())
}