import prisma from "@/src/lib/prisma"

async function main(){
    const roles = [
        {
            id: 1,
            name: "Administrateur"
        },
        {
            id: 2,
            name: "Modérateur" 
        },
        {
            id: 3,
            name: "Observateur"
        },
        {
            id: 4,
            name: "Utilisateur" 
        }
    ]

    for(const role of roles){
        await prisma.role.upsert({
            where: { id: role.id },
            update: {},
            create: role
        })
    }

    await reloadSequence("role");

    const users = [
        {
            id: 1,
            username: "admin",
            email: "admin@gmail.com",
            password: "$2b$12$CVie7NnR/WIDx/.g07eyK.0f9urFfDJYPIfzN3ct6El4231DX/y6K",
            roleId: 1
        }
    ]

    for(const user of users){
        await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: user
        }) 
    }

    await reloadSequence("user");

    const permissions = [
        {
            id: 1,
            name: "admin",
            description: "Accès administrateur"
        },
        {
            id: 2,
            name: "admin.rights",
            description: "Accès à la gestion des droits"
        },
        {
            id: 3,
            name: "admin.rights.permissions",
            description: "Accès à la gestion des permissions"
        },
        {
            id: 4,
            name: "admin.rights.permissions.name",
            description: "Voir le nom des permissions"
        },
        {
            id: 5,
            name: "admin.rights.permissions.description",
            description: "Voir la description des permissions"
        },
        {
            id: 6,
            name: "admin.rights.permissions.add",
            description: "Ajouter une permission"
        },
        {
            id: 7,
            name: "admin.rights.permissions.edit",
            description: "Modifier une permission"
        },
        {
            id: 8,
            name: "admin.rights.permissions.delete",
            description: "Supprimer une permission"
        },
        {
            id: 9,
            name: "admin.rights.roles",
            description: "Accès à la gestion des rôles"
        },
        {
            id: 10,
            name: "admin.rights.roles.name",
            description: "Voir le noms des rôles"
        },
        {
            id: 11,
            name: "admin.rights.roles.add",
            description: "Ajouter un rôle"
        },
        {
            id: 12,
            name: "admin.rights.roles.edit",
            description: "Modifier un rôle"
        },
        {
            id: 13,
            name: "admin.rights.roles.delete",
            description: "Supprimer un rôle"
        }
    ]

    for(const permission of permissions){
        await prisma.permission.upsert({
            where: { id: permission.id },
            update: {},
            create: permission
        }) 
    }

    await reloadSequence("permission");

    const categories = [
        {
            id: 1,
            name: "Opening"
        },
        {
            id: 2,
            name: "Ending"
        }
    ]

    for(const category of categories){
        await prisma.category.upsert({
            where: { id: category.id },
            update: {},
            create: category
        }) 
    }

    await reloadSequence("category");

    const questions_opening = [
        {
            id: 1,
            question: "De quel anime vient cet opening ?",
            number: 1
        },
        {
            id: 2,
            question: "Quel est le numéro de cet opening ?",
            number: 2 
        },
        {
            id: 3,
            question: "Quel est le titre de cet opening ?",
            number: 3 
        }
    ]

    for(const question of questions_opening){
        await prisma.question_Opening.upsert({
            where: { id: question.id },
            update: {},
            create: question
        })
    }

    await reloadSequence("question_Opening");

    const questions_ending = [
        {
            id: 1,
            question: "De quel anime vient cet ending ?",
            number: 1
        },
        {
            id: 2,
            question: "Quel est le numéro de cet ending?",
            number: 2
        }
    ]

    for(const question of questions_ending){
        await prisma.question_Ending.upsert({
            where: { id: question.id },
            update: {},
            create: question
        }) 
    }

    await reloadSequence("question_Ending");
}

async function reloadSequence(table: string){
    await prisma.$executeRawUnsafe(`
        SELECT setval(pg_get_serial_sequence('${table}', 'id'), (SELECT MAX(id) FROM "${table}"));
    `);
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })