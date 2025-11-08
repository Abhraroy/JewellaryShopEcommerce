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


export const createCart = async(AuthUserId:string,supabase:any)=>{
    const {data,error} = await supabase.from("cart").insert({
        user_id:AuthUserId,
    })
    if(error){
        console.log("error",error)
        return {success:false,error:error,message:"Failed to create cart"}
    }
    else{
        console.log("cart created",data)
        return {success:true,data:data,message:"Cart created successfully"}
    }
}


export const getCartData = async(AuthUserId:string,CartId:string,supabase:any)=>{
    const {data,error} = await supabase
    .from("cart_items")
    .select(`
        *,
    cart(*),
    product(*)
    `)
    .eq("user_id",AuthUserId)
    .eq("cart_id",CartId)
    if(error){
        console.log("error",error)
        return {success:false,error:error,message:"Failed to get cart data"}
    }
    else{
        console.log("cart data",data)
        return {success:true,data:data,message:"Cart data fetched successfully"}
    }
    return {success:false,error:error,message:"Failed to get cart data"}
}












export const addToDbCart = async(product:any,AuthUserId:string,CartId:string,supabase:any)=>{
    console.log("Adding to db cart")
    const productExistsInCart = await supabase.from("cart_items").select("*").eq("cart_id",CartId).eq("product_id",product.id).maybeSingle();
    if(productExistsInCart.data){
        const {data,error} = await supabase.from("cart_items").update({
            quantity:productExistsInCart.data.quantity + 1,
        })
        if(error){
            console.log("error",error)
            return {success:false,error:error,message:"Failed to update cart item"}
        }
        else{
            console.log("cart item updated",data)
            return {success:true,data:data,message:"Cart item updated successfully"}
        }
    }
    else{
        console.log("product does not exist in cart")
    }
    const {data,error} = await supabase.from("cart_items").insert({
        cart_id:CartId,
        product_id:product.id,
        quantity:product.quantity,
    })
    if(error){
        console.log("error",error)
        return {success:false,error:error,message:"Failed to add to cart"}
    }
    else{
        console.log("cart item added",data)
        return {success:true,data:data,message:"Cart item added successfully"}
    }
}
