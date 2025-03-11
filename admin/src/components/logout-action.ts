'use server'

import { deleteSession } from "@/src/lib/session"

export default async function LogoutAction() {
    await deleteSession()
}