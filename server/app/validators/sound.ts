import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    'title.string': "Le titre n'est pas une chaîne de caractères.",
    'url.string': "L'url n'est pas une chaîne de caractères.",
    'order.number': "L'ordre n'est pas un nombre.",
    'isActive.boolean': "isActive n'est pas un booléen.",
    'licenseId.number': "L'identifiant de licence n'est pas un nombre.",
    'typeId.number': "L'identifiant de type n'est pas un nombre."
})

const soundValidator = vine.compile(
    vine.object({
        title: vine.string(),
        url: vine.string(),
        before: vine.number().optional(),
        after: vine.number().optional(),
        order: vine.number(),
        isActive: vine.boolean(),
        licenseId: vine.number(),
        typeId: vine.number()
    })
)

export { soundValidator }