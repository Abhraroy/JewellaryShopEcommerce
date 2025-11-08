export const addToLocalCart = (product: any) => {
    // console.log(product)
    let cartMap = new Map();
    const product_obj = {
      ...product,
      quantity: 1
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

