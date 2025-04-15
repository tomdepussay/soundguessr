import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/src/lib/session';  // Assurez-vous que le chemin est correct

export default async function middleware(req: NextRequest){
  console.log("MIDDLEWARE");
  // Récupérer le token de l'utilisateur depuis les en-têtes de la requête ou les cookies
  const token = req.cookies.get('token') || req.headers.get('Authorization')?.split(' ')[1];

  // Si aucun token n'est trouvé, on retourne une réponse d'accès interdit (401)
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Vérification du token avec la fonction verifySession
  const session = await verifyToken(String(token));

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  console.log("AUTHORIZED", session);

  // Si le token est valide, continuer avec la requête (appeler la suite du pipeline)
  return NextResponse.next();
}
