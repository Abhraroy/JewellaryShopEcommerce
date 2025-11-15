// import { NextRequest, NextResponse } from "next/server";
// import {createClient} from "@/app/utils/supabase/server";
// import { createCategory } from "@/app/admin/actions/categories";

// export async function POST(request: Request) {
//     try{
//         console.log("request",request)
//         const supabase = await createClient();
//         const user = await supabase.auth.getUser();
//         console.log("user",user)
//         const body = await request.formData();
//         const res = await createCategory({
//             category_id: body.get('category_id') as string,
//             category_name: body.get('category_name') as string,
//             slug: body.get('slug') as string,
//             description: body.get('description') as string,
//             category_image_url: body.get('category_image_url') as File,
//             is_active: body.get('is_active') as unknown as boolean,
//         });
//         return Response.json(res);
//     }catch(error){
//         return Response.json({ error: error instanceof Error ? error.message : 'Failed to create category' }, { status: 500 });
//     }
// }


