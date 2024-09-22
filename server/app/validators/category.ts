import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    'name.string': "Le nom n'est pas une chaîne de caractères.",
    'isActive.boolean': "Le champ 'isActive' n'est pas un booléen."
})

const categoryValidator = vine.compile(
    vine.object({
        name: vine.string(),
        isActive: vine.boolean()
    })
)

export { categoryValidator }