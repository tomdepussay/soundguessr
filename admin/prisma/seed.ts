import { PrismaClient } from '@prisma/client'
 
 const prisma = new PrismaClient()

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

const users = [
    {
        id: 1,
        username: "admin",
        email: "admin@gmail.com",
        password: "$2b$12$CVie7NnR/WIDx/.g07eyK.0f9urFfDJYPIfzN3ct6El4231DX/y6K",
        roleId: 1
    },
    {
        id: 2,
        username: "tom", 
        email: "tom@gmail.com", 
        password: "$2b$12$CVie7NnR/WIDx/.g07eyK.0f9urFfDJYPIfzN3ct6El4231DX/y6K", 
        roleId: 4
    }
]

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
        name: "admin.rights.permissions.id",
        description: "Voir l'id des permissions"
    },
    {
        id: 5,
        name: "admin.rights.permissions.name",
        description: "Voir le nom des permissions"
    },
    {
        id: 6,
        name: "admin.rights.permissions.description",
        description: "Voir la description des permissions"
    },
    {
        id: 7,
        name: "admin.rights.permissions.roles",
        description: "Voir les rôles des permissions"
    },
    {
        id: 8,
        name: "admin.rights.permissions.add",
        description: "Ajouter une permission"
    },
    {
        id: 9,
        name: "admin.rights.permissions.edit",
        description: "Modifier une permission"
    },
    {
        id: 10,
        name: "admin.rights.permissions.delete",
        description: "Supprimer une permission"
    },
    {
        id: 11,
        name: "admin.rights.roles",
        description: "Accès à la gestion des rôles"
    },
    {
        id: 12,
        name: "admin.rights.roles.id",
        description: "Voir l'id des rôles"
    },
    {
        id: 13,
        name: "admin.rights.roles.name",
        description: "Voir le noms des rôles"
    },
    {
        id: 14,
        name: "admin.rights.roles.permissions",
        description: "Voir les permissions des rôles" 
    },
    {   
        id: 15,
        name: "admin.rights.roles.add",
        description: "Ajouter un rôle"
    },
    {
        id: 16,
        name: "admin.rights.roles.edit",
        description: "Modifier un rôle"
    },
    {
        id: 17,
        name: "admin.rights.roles.delete",
        description: "Supprimer un rôle"
    },
    {
        id: 18,
        name: "admin.rights.roles.assign",
        description: "Assigner un rôle à un rôle" 
    },
    {
        id: 19,
        name: "admin.references.categories",
        description: "Accès à la gestion des catégories"
    },
    {
        id: 20,
        name: "admin.references.categories.id",
        description: "Voir l'id des catégories"
    },
    {
        id: 21,
        name: "admin.references.categories.name",
        description: "Voir le nom des catégories"
    },
    {
        id: 22,
        name: "admin.references.categories.isActive",
        description: "Voir l'état des catégories" 
    },
    {
        id: 23,
        name: "admin.references.categories.add",
        description: "Ajouter une catégorie" 
    },
    {
        id: 24,
        name: "admin.references.categories.edit",
        description: "Modifier une catégorie" 
    },
    {
        id: 25,
        name: "admin.references.categories.delete",
        description: "Supprimer une catégorie" 
    }
]

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

async function main(){

    for(const role of roles){
        await prisma.role.upsert({
            where: { id: role.id },
            update: {},
            create: role
        })
    }
    await reloadSequence("role");
    
    for(const user of users){
        await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: user
        }) 
    }
    await reloadSequence("user");

    for(const permission of permissions){
        await prisma.permission.upsert({
            where: { id: permission.id },
            update: {},
            create: permission
        }) 
    }
    await reloadSequence("permission");

    const permissions_ = await prisma.permission.findMany();

    for(const permission of permissions_){
        await prisma.role.update({
            where: { id: 1 },
            data: {
                permissions: {
                    connect: {
                        id: permission.id
                    }
                }
            }
        })
    }

    for(const category of categories){
        await prisma.category.upsert({
            where: { id: category.id },
            update: {},
            create: category
        }) 
    }
    await reloadSequence("category");

    

    for(const question of questions_opening){
        await prisma.question_Opening.upsert({
            where: { id: question.id },
            update: {},
            create: question
        })
    }
    await reloadSequence("question_Opening");

    

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