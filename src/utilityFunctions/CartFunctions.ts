export const addToLocalCart = (product: any) => {
    console.log(product)
    const product_obj = {
      ...product,
      quantity: 1
    }
    const localCartItems = localStorage.getItem('cartItems')
    let localCartItemsArray = localCartItems ? JSON.parse(localCartItems) : [];
    if(localCartItemsArray.length === 0){
      localCartItemsArray.push(product_obj)
    }
    else{
    localCartItemsArray.forEach((item: any) => {
      console.log('item.id', item.id)
      console.log('product.id', product.id)
      if(item.id === product.id){
        console.log("Item is already in cart increasing quantity")
        item.quantity += 1
        return;
      }
      else{
        console.log("Item is not in cart adding to cart")
        localCartItemsArray.push(product_obj)
      }
      console.log("****************")
    })
    }
    console.log('localCartItemsArray', localCartItemsArray)
    localStorage.setItem("cartItems",JSON.stringify(localCartItemsArray))
    return localCartItemsArray
}

