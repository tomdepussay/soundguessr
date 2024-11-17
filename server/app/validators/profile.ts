import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    'name.string': "Le nom n'est pas une chaîne de caractères.",
    "description.string": "La description n'est pas une chaîne de caractères.",
})

const profileValidator = vine.compile(
    vine.object({
        name: vine.string(),
        description: vine.string().optional()
    })
)

export { profileValidator }