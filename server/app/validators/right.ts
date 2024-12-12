import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    'name.string': "Le nom n'est pas une chaîne de caractères.",
    "code.string": "Le code n'est pas une chaîne de caractères.",
    "roles.array": "Les rôles ne sont pas un tableau de nombres."
})

const rightValidator = vine.compile(
    vine.object({
        name: vine.string(),
        code: vine.string(),
        roles: vine.array(vine.number())
    })
)

export { rightValidator }