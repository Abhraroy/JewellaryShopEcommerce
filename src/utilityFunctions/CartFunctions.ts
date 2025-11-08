export const addToLocalCart = (product: any) => {
    // console.log(product)
    console.log("Adding to local cart")
    let cartMap = new Map();
    const product_obj = {
      ...product,
      quantity: product.quantity ?? 1
    }
    const localCartItems = localStorage.getItem('cartItems')
    let localCartItemsArray = localCartItems ? JSON.parse(localCartItems) : [];
    // console.log("localCartItemsArray before adding product", localCartItemsArray)
    if(localCartItemsArray.length === 0){
        cartMap.set(product_obj.id, product_obj)
    }
    else{
        localCartItemsArray.forEach((item: any) => {
            cartMap.set(item.id, item)
        })
        if(cartMap.has(product_obj.id)){
            cartMap.get(product_obj.id).quantity += 1
        }
        else{
            cartMap.set(product_obj.id, product_obj)
        }
    }
    localStorage.setItem("cartItems",JSON.stringify(Array.from(cartMap.values())))
    return Array.from(cartMap.values())
}


export const removeFromLocalCart = (product:any)=>{
    console.log("Removing from local cart")
    let cartMap = new Map();
    const localCartItems = localStorage.getItem('cartItems')
    let localCartItemsArray = localCartItems ? JSON.parse(localCartItems) : [];
    if(localCartItemsArray.length === 0){
        console.log("No items in cart")
        return localCartItemsArray;
    }
    else{
        localCartItemsArray.forEach((item: any) => {
            cartMap.set(item.id, item)
        })
        if(cartMap.has(product.id)){
            cartMap.delete(product.id)
        }
        else{
            console.log("Item not found in cart")
        }
    }
    localStorage.setItem("cartItems",JSON.stringify(Array.from(cartMap.values())))
    return Array.from(cartMap.values())
}

export const decreaseQuantityFromLocalCart = (product:any)=>{
    console.log("Decreasing quantity from local cart")
    let cartMap = new Map();
    const localCartItems = localStorage.getItem('cartItems')
    let localCartItemsArray = localCartItems ? JSON.parse(localCartItems) : [];
    if(localCartItemsArray.length === 0){
        console.log("No items in cart")
        return localCartItemsArray;
    }
    else{
        localCartItemsArray.forEach((item: any) => {
            cartMap.set(item.id, item)
        })
        if(cartMap.has(product.id)){
            cartMap.get(product.id).quantity -= 1
        }
        else{
            console.log("Item not found in cart")
            return localCartItemsArray;
        }
    }
    localStorage.setItem("cartItems",JSON.stringify(Array.from(cartMap.values())))
    return Array.from(cartMap.values())
}

