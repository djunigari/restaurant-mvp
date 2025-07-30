import { User } from "@/types/user"
import { prisma } from "@/utils/prisma"
import "server-only"
import { getUser } from "./dal"

function canSeeUsername(viewer: User) {
  if (viewer.id) return true
  return false
}

// function canSeePhoneNumber(viewer: User) {
//   return viewer.isAdmin
// }

export async function getProfileDTO(slug: string) {
  const user = await prisma.user.findFirst({
    where: { name: slug },
  })

  if (!user) return null

  const currentUser = (await getUser()) as User

  // Or return only what's specific to the query here
  return {
    username: canSeeUsername(currentUser) ? currentUser?.name : null,
    // phonenumber: canSeePhoneNumber(currentUser)
    //   ? user.phonenumber
    //   : null,
  }
}
