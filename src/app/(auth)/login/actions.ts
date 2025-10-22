'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/app/utils/supabase/server'

const supabase = await createClient()


export async function signInWithEmail(formData: FormData) {
    const email = formData.get('email') as string
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
        emailRedirectTo: 'http://localhost:3000/auth/confirm',
      },
    })
    console.log('data', data)
    console.log('error', error)
  }