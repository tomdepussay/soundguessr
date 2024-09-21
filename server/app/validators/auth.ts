import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    'email.email': "L'adresse email n'est pas valide.",
    'email.required': "L'adresse email est requise.",
    'password.required': "Le mot de passe est requis.",
    'username.required': 'Le nom d\'utilisateur est requis.',
    'password.minLength': 'Le mot de passe doit contenir au moins 8 caractères.'
})

const login = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string()
    })
)

const register = vine.compile(
    vine.object({
        username: vine.string(),
        email: vine.string().email(),
        password: vine.string().minLength(8)
    })
)

export { login, register }