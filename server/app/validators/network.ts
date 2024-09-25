import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    'name.string': "Le nom n'est pas une chaîne de caractères.",
    'link.string': "Le lien n'est pas une chaîne de caractères.",
    'isActive.boolean': "isActive n'est pas un booléen."
})

const networkValidator = vine.compile(
    vine.object({
        name: vine.string(),
        link: vine.string(),
        isActive: vine.boolean()
    })
)

export { networkValidator }