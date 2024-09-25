import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    'question.string': "La question n'est pas une chaîne de caractères.",
    'target.string': "La cible n'est pas une chaîne de caractères.",
    'order.number': "L'ordre n'est pas un nombre.",
    'isActive.boolean': "IsActive n'est pas un booléen",
    'typeId.number': "TypeId n'est pas un nombre."
})

const questionValidator = vine.compile(
    vine.object({
        question: vine.string(),
        target: vine.string(),
        order: vine.number(),
        isActive: vine.boolean(),
        typeId: vine.number()
    })
)

export { questionValidator }