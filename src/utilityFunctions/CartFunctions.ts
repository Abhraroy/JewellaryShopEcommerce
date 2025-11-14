export const addToLocalCart = (product: any) => {
    console.log(product)
    console.log("Adding to local cart")
    let cartMap = new Map();
    const product_obj = {
      ...product,
    }
    
    const localCartItems = localStorage.getItem('cartItems')
    let localCartItemsArray = localCartItems ? JSON.parse(localCartItems) : [];
    // console.log("localCartItemsArray before adding product", localCartItemsArray)
    if(localCartItemsArray.length === 0){
        cartMap.set(product_obj.product_id,{products:product_obj,quantity:1})
    }
    else{
        localCartItemsArray.forEach((item: any) => {
            console.log("item",item)
            cartMap.set(item.products.product_id, item)
        })
        console.log("cartMap",cartMap)
        if(cartMap.has(product_obj.product_id)){
            console.log("Product already exists in cart")
            cartMap.get(product_obj.product_id).quantity += 1
        }
        else{
            console.log("Product does not exist in cart adding new product")
            cartMap.set(product_obj.product_id, {products:product_obj,quantity:1})
        }
    }
    const updatedCart = Array.from(cartMap.values())
    console.log("updatedCart",updatedCart)
    localStorage.setItem("cartItems",JSON.stringify(updatedCart))
    return updatedCart;
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


export const getCartData = async(CartId:string,supabase:any)=>{
    const {data,error} = await supabase
    .from("cart_items")
    .select(`
        *,
    cart(*),
    products(*)
    `)
    .eq("cart_id",CartId)
    if(error){
        console.log("error",error)
        return {success:false,data:null,message:error.message}
    }
    else{
        console.log("cart data",data)
        return {success:true,data:data,message:"Cart data fetched successfully"}
    }
}












export const addToDbCart = async(product:any,CartId:string,supabase:any)=>{
    console.log("Adding to db cart")
    console.log("product",product.product_id)
    console.log("supabase",supabase)
    const productExistsInCart = await supabase.from("cart_items").select("*").eq("cart_id",CartId).eq("product_id",product.product_id)
    console.log("Existence of product in cart",productExistsInCart)
    if(productExistsInCart.data.length > 0){
        console.log("product exists in cart")
        console.log("quantity before updating",productExistsInCart.data[0].quantity)
        const {data,error} = await supabase.from("cart_items").update({
            quantity:productExistsInCart.data[0].quantity + 1,
        }).eq("cart_id",CartId).eq("product_id",product.product_id)
        if(error){
            console.log("error",error)
            return {success:false,error:error,message:"Failed to update cart item"}
        }
        else{
            console.log("cart item updated",data)
            const updatedCartItems = await getCartData(CartId,supabase)
            if(updatedCartItems.success){
                console.log("updatedCartItems from function ",updatedCartItems.data)
                return updatedCartItems.data;
            }
            else{
                // console.log("error",updatedCartItems.error)
                // return {success:false,error:updatedCartItems.error,message:"Failed to get cart data"}
            }
        }
    }
    else{
        console.log("product does not exist in cart")
        console.log("product",product)
        console.log("cartID",CartId)
        const {data,error} = await supabase.from("cart_items").insert({
            cart_id:CartId,
            product_id:product.product_id,
            quantity:1,
        })
        if(error){
            console.log("error",error)
            return {success:false,error:error,message:"Failed to add to cart"}
        }
        else{
            console.log("cart item added",data)
            const updatedCartItems = await getCartData(CartId,supabase)
            if(updatedCartItems.success){
                console.log("updatedCartItems from function ",updatedCartItems.data)
                return updatedCartItems.data;
            }
            else{
                // console.log("error",updatedCartItems.error)
                // return {success:false,error:updatedCartItems.error,message:"Failed to get cart data"}
            }
        }
    }
    
}


export const removeFromDbCart = async(product:any,CartId:string,supabase:any)=>{
    console.log("Removing from db cart")
    console.log("product",product.product_id)
    const {data,error} = await supabase.from("cart_items").delete().eq("cart_id",CartId).eq("product_id",product.product_id)
    if(error){
        console.log("error",error)
        return {success:false,error:error,message:"Failed to remove from cart"}
    }
    else{
        console.log("cart item removed",data)
        const updatedCartItems = await getCartData(CartId,supabase)
        if(updatedCartItems.success){
            console.log("updatedCartItems from function ",updatedCartItems.data)
            return updatedCartItems.data;
        }
        else{
            // console.log("error",updatedCartItems.error)
            // return {success:false,error:updatedCartItems.error,message:"Failed to get cart data"}
        }
    }
}

export const decreaseQuantityFromDbCart = async(product:any,CartId:string,supabase:any)=>{
    console.log("Decreasing quantity from db cart")
    console.log("product",product.product_id)
    const {data,error} = await supabase.from("cart_items").update({
        quantity:product.quantity - 1,
    }).eq("cart_id",CartId).eq("product_id",product.product_id)
    console.log("data",data)
    if(error){
        console.log("error",error)
        return {success:false,error:error,message:"Failed to decrease quantity from cart"}
    }
    else{
        console.log("cart item quantity decreased",data)
        const updatedCartItems = await getCartData(CartId,supabase)
        if(updatedCartItems.success){
            console.log("updatedCartItems from function ",updatedCartItems.data)
            return updatedCartItems.data;
        }
        else{
            // console.log("error",updatedCartItems.error)
            // return {success:false,error:updatedCartItems.error,message:"Failed to get cart data"}
        }
    }
}