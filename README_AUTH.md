# Configuration de l'Authentification Google

Si vous rencontrez des erreurs "401 Unauthorized" lors de la connexion avec Google, voici les points critiques à vérifier.

## 1. Cohérence des Hostnames (Cookies)

Le navigateur gère les cookies de session de manière stricte. Pour que les cookies soient partagés entre le frontend et le backend :

- **Frontend (Vite) :** Doit être accédé via `http://localhost:5173` ou `http://127.0.0.1:5173`.
- **Backend (FastAPI) :** Doit être configuré sur le **même hostname**.

Si vous utilisez `http://localhost:5173` pour le front, assurez-vous que `VITE_API_URL` dans votre fichier `.env` est bien `http://localhost:8000` (et non `127.0.0.1`).

> **Important :** Pour Chrome, `localhost` et `127.0.0.1` sont considérés comme des domaines différents. Si le back met un cookie sur `127.0.0.1`, le front sur `localhost` ne l'enverra pas.

## 2. Configuration Google Cloud Console

D'après votre capture d'écran, vos URIs sont :
- **Origines JavaScript autorisées :** `http://localhost:5173`
- **URIs de redirection autorisés :** `http://localhost:8000/auth/google/callback`

Assurez-vous que ces valeurs correspondent exactement à ce que vous utilisez dans votre navigateur.

## 3. Configuration CORS au Backend

Le backend doit autoriser les requêtes provenant de votre origine frontend ET permettre l'envoi de credentials.
Exemple FastAPI :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Doit correspondre EXACTEMENT
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 4. Vérification du Flux

1. L'utilisateur clique sur "Continuer avec Google".
2. Redirection vers le Backend (`/auth/google/login`).
3. Redirection vers Google.
4. Google redirige vers le Backend (`/auth/google/callback`).
5. Le Backend traite le code, crée une session (cookie), et redirige vers le Frontend (`/auth/callback`).
6. Le composant `AuthCallback.tsx` du Frontend appelle `/auth/me`.
7. Si le cookie est présent et valide, le Backend retourne l'utilisateur (200 OK).
8. Le Frontend redirige vers `/dashboard`.
