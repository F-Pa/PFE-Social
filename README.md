# Pour faire fonctionner l'application :

npm install dans le backend et dans l'application

Créer un dossier uploads dans le backend

Créer un .env dans le backend avec :
  - DB_UTIL_PASS= le mot de passe de votre bdd Neo4j
  - JWTSECRET = une clé secrète de votre choix
  - DATABASE_ACCESS = l'accès pour votre bdd MongoDB
  - PATHH = __dirname + /uploads/
 
Créer un .env dans l'application avec :
  - REACT_APP_JWTSECRET = la même clé secrète que dans le backend
  
Une fois ces étapes passées, vous pouvez lancer le backend et l'application séparémment aevc nmp start.
