import { NextRequest,NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";


export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const body = await request.json();
    console.log('body', body)
    const userExists = await supabase.from("users").select("*").eq("phone_number","+"+body.phone).single();
    if (userExists.data) {
        return NextResponse.json({ message:"Successfully Sign in",user:userExists.data }, { status: 200 });
    }
    const db_res = await supabase
    .from("users")
    .insert({
        email: body.email||null,
        first_name: body.first_name||null,
        last_name: body.last_name||null,
        phone_number: body.phone||null,
        password_hash: body.password_hash||null,
        is_active: true,
    })
    console.log('db_response', db_res)
    if (db_res.error) {
        return NextResponse.json({ error: db_res.error.message }, { status: 500 });
    }
    return NextResponse.json({ data: db_res.data });
}