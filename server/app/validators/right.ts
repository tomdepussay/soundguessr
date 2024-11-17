import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    'name.string': "Le nom n'est pas une chaîne de caractères.",
    "code.string": "Le code n'est pas une chaîne de caractères.",
})

const rightValidator = vine.compile(
    vine.object({
        name: vine.string(),
        code: vine.string()
    })
)

export { rightValidator }