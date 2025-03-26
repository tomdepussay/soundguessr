import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(){
    const roles = [
        {
            name: "Administrateur"
        },
        {
            name: "Modérateur" 
        },
        {
            name: "Observateur"
        },
        {
            name: "Utilisateur" 
        }
    ]

    for(const role of roles){
        await prisma.role.upsert({
            where: {
                name: role.name
            },
            update: {},
            create: role
        })
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })