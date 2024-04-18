# Les web sockets

## Introduction

Les web sockets sont un protocole de communication bidirectionnelle, qui permet de communiquer entre un client et un serveur. Ils sont utilisés pour les applications qui nécessitent une communication en temps réel, comme les jeux en ligne, les applications de chat, les notifications, etc...

Ils permettent d'établir une connexion persistante entre le client et le serveur, et de transmettre des données dans les deux sens. Contrairement à HTTP, qui est un protocole de communication unidirectionnelle, les web sockets permettent de transmettre des données de manière asynchrone, sans avoir besoin de faire une nouvelle requête à chaque fois.

## Fonctionnement

### Handshake

Le processus de connexion entre le client et le serveur se fait en plusieurs étapes :
1 - Le client envoie une requête HTTP au serveur, contenant un header `Upgrade: websocket` pour indiquer qu'il souhaite établir une connexion websocket.
2 - Le serveur répond avec un code `101 Switching Protocols` pour indiquer que la connexion a été établie.
3 - Une fois la connexion établie, le client et le serveur peuvent échanger des données de manière bidirectionnelle.

### Communication avec socket.io

Pour faciliter la communication en temps réel entre le client et le serveur, on peut utiliser une librairie comme socket.io, qui permet de gérer les web sockets de manière plus simple et plus efficace.

Le client peut seulement envoyer des événements au serveur.  
On dit qu'il émet un événement (emit).

Le serveur peut envoyer des événements au client qui lui a envoyé un événement.  
On dit qu'il émet un événement (emit).

Le serveur peut envoyer des événements à tous les clients connectés.  
On dit qu'il émet un événement à tous les clients (io.emit).

Le serveur peut envoyer des événements à tous les clients connectés, sauf à celui qui lui a envoyé un événement. (socket.broadcast).

Le serveur peut envoyer des événements à un seul client s'il connaît son identifiant.  
On dit qu'il émet un événement à un seul client (io.to(socketId).emit)

## Exemple

Pour illustrer le fonctionnement des web sockets, voici un exemple simple d'une application de chat en temps réel :
https://github.com/ThomasLaforge/chat-example-react-socketio

## Exercice pratique

### Correction
https://github.com/ThomasLaforge/chat-example-react-socketio/tree/guess-number

Créez un jeu en temps réel avec socket.io, où les joueurs peuvent se connecter et jouer ensemble.

Lorsque deux joueurs sont connectés, le serveur doit générer un nombre aléatoire entre 1 et 100, et les joueurs doivent deviner ce nombre en envoyant des propositions au serveur.

Le serveur doit répondre "plus petit" ou "plus grand" en fonction de la proposition du joueur, et "bravo" si le joueur a trouvé le nombre.

La partie se termine lorsque l'un des joueurs a trouvé le nombre, et le serveur doit afficher le temps nécessaire pour trouver le nombre par le gagnant.

## Exercice deux : tic tac toe

### Correction
https://github.com/ThomasLaforge/chat-example-react-socketio/tree/morpion

Créez un jeu de morpion en temps réel avec socket.io, où deux joueurs peuvent se connecter et jouer ensemble.

En bonus, réalisez une version temps réel du jeu de morpion. Chaque joueur ne possède que 3 pions à placer. Une fois un jeton placé, un bouton apparaît sur la page avec un positionnement aléatoire. Lorsque le bouton est cliqué, le joueur peut placer un jeton supplémentaire. S'il a utilisé ses 3 jetons il déplacera le premier jeton placé vers cette nouvelle case libre. Le joueur qui aligne 3 jetons en premier gagne la partie.