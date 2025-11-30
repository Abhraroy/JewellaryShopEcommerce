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

// Backend wishlist functions
export const createWishlist = async (userId: string, supabase: any) => {
    try {
        const { data, error } = await supabase
            .from('wishlist')
            .insert({ user_id: userId })
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error creating wishlist:', error);
        return { success: false, error };
    }
};

export const getUserWishlist = async (userId: string, supabase: any) => {
    try {
        const { data, error } = await supabase
            .from('wishlist')
            .select('wishlist_id')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error getting user wishlist:', error);
        return { success: false, error };
    }
};

export const addToWishlist = async (userId: string, productId: string, supabase: any) => {
    try {
        // First, get or create user's wishlist
        let { data: wishlist } = await supabase
            .from('wishlist')
            .select('wishlist_id')
            .eq('user_id', userId)
            .maybeSingle();

        if (!wishlist) {
            const createResult = await createWishlist(userId, supabase);
            if (!createResult.success) throw createResult.error;
            wishlist = createResult.data;
        }

        // Check if item already exists
        const { data: existingItem } = await supabase
            .from('wishlist_items')
            .select('wishlist_item_id')
            .eq('wishlist_id', wishlist.wishlist_id)
            .eq('product_id', productId)
            .maybeSingle();

        if (existingItem) {
            return { success: true, message: 'Item already in wishlist' };
        }

        // Add item to wishlist
        const { data, error } = await supabase
            .from('wishlist_items')
            .insert({
                wishlist_id: wishlist.wishlist_id,
                product_id: productId
            })
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return { success: false, error };
    }
};

export const removeFromWishlist = async (userId: string, productId: string, supabase: any) => {
    try {
        // Get user's wishlist
        const { data: wishlist } = await supabase
            .from('wishlist')
            .select('wishlist_id')
            .eq('user_id', userId)
            .maybeSingle();

        if (!wishlist) {
            return { success: false, message: 'Wishlist not found' };
        }

        // Remove item from wishlist
        const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('wishlist_id', wishlist.wishlist_id)
            .eq('product_id', productId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return { success: false, error };
    }
};

export const getWishlistItems = async (userId: string, supabase: any) => {
    try {
        // Get user's wishlist
        const { data: wishlist } = await supabase
            .from('wishlist')
            .select('wishlist_id')
            .eq('user_id', userId)
            .maybeSingle();

        if (!wishlist) {
            return { success: true, data: [] };
        }

        // Get wishlist items with product details
        const { data, error } = await supabase
            .from('wishlist_items')
            .select(`
                product_id,
                products (*)
            `)
            .eq('wishlist_id', wishlist.wishlist_id);

        if (error) throw error;

        // Extract products from the joined data
        const products = data?.map((item: any) => item.products) || [];
        return { success: true, data: products };
    } catch (error) {
        console.error('Error getting wishlist items:', error);
        return { success: false, error };
    }
};