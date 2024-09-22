import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    'title.string': "Le titre n'est pas une chaîne de caractères.",
    'url.string': "L'url n'est pas une chaîne de caractères.",
    'order.number': "L'ordre n'est pas un nombre.",
    'isActive.boolean': "isActive n'est pas un booléen.",
    'licenseId.number': "L'identifiant de licence n'est pas un nombre.",
    'typeId.number': "L'identifiant de type n'est pas un nombre."
})

const licenseValidator = vine.compile(
    vine.object({
        title: vine.string(),
        top100: vine.boolean(),
        isActive: vine.boolean(),
        categoryId: vine.number()
    })
)

export { licenseValidator }