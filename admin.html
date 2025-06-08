<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>B-TV - Admin Dashboard</title>
    <link rel="stylesheet" href="admin.css"> <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">

    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics-compat.js"></script> </head>
<body>
    <header>
        <h1>Tableau de Bord Admin B-TV</h1>
        <div class="header-right">
            <span id="adminUserEmail">Non connecté</span>
            <button id="adminLogoutBtn">Se déconnecter</button>
        </div>
    </header>

    <main>
        <section id="adminLoginForm" class="admin-section login-form">
            <h2>Connexion Administrateur</h2>
            <p id="adminError" class="error-message"></p>
            <input type="email" id="adminEmail" placeholder="Email Admin" required>
            <input type="password" id="adminPassword" placeholder="Mot de passe Admin" required>
            <button id="adminLoginBtn">Connexion</button>
        </section>

        <section id="adminDashboard" class="admin-section" style="display: none;">
            <nav class="admin-nav">
                <button data-target="channels-management" class="nav-button active">Chaînes</button>
                <button data-target="videos-management" class="nav-button">Vidéos</button>
                <button data-target="users-management" class="nav-button">Utilisateurs & Abonnements</button>
                <button data-target="ads-management" class="nav-button">Publicités</button>
                <button data-target="settings-management" class="nav-button">Paramètres</button>
            </nav>

            <div id="channels-management" class="admin-content active">
                <h2>Gestion des Chaînes</h2>
                <h3>Ajouter une Chaîne</h3>
                <input type="text" id="addChannelName" placeholder="Nom de la chaîne" required>
                <button id="addChannelBtn">Ajouter Chaîne</button>

                <h3>Modifier/Supprimer une Chaîne</h3>
                <select id="selectChannelForEdit"></select>
                <input type="text" id="editChannelId" placeholder="ID Chaîne" readonly>
                <input type="text" id="editChannelName" placeholder="Nouveau nom de la chaîne">
                <button id="editChannelBtn">Modifier Chaîne</button>
                <button id="deleteChannelBtn">Supprimer Chaîne</button>

                <h3>Liste des Chaînes</h3>
                <ul id="adminChannelList"></ul>
            </div>

            <div id="videos-management" class="admin-content">
                <h2>Gestion des Vidéos</h2>
                <h3>Ajouter une Vidéo</h3>
                <input type="text" id="addVideoTitle" placeholder="Titre de la vidéo" required>
                <input type="text" id="addYoutubeId" placeholder="ID YouTube de la vidéo" required>
                <select id="addVideoChannelId"></select>
                <button id="addVideoBtn">Ajouter Vidéo</button>

                <h3>Modifier/Supprimer une Vidéo</h3>
                <select id="selectVideoForEdit"></select>
                <input type="text" id="editVideoId" placeholder="ID Vidéo" readonly>
                <input type="text" id="editVideoTitle" placeholder="Nouveau titre de la vidéo">
                <input type="text" id="editYoutubeId" placeholder="Nouvel ID YouTube">
                <select id="editVideoChannelId"></select>
                <button id="editVideoBtn">Modifier Vidéo</button>
                <button id="deleteVideoBtn">Supprimer Vidéo</button>

                <h3>Liste des Vidéos</h3>
                <ul id="adminVideoList"></ul>
            </div>

            <div id="users-management" class="admin-content">
                <h2>Gestion des Utilisateurs & Abonnements</h2>
                <h3>Gérer Abonnement Utilisateur</h3>
                <select id="selectUserForSub"></select>
                <input type="text" id="subUid" placeholder="UID Utilisateur" readonly>
                <input type="text" id="subPhoneNumber" placeholder="Numéro de téléphone" readonly>
                <input type="text" id="subToken" placeholder="Token d'abonnement (optionnel)">
                <input type="date" id="subExpiration">
                <button id="addSubscriptionBtn">Ajouter/Mettre à jour Abonnement</button>
                <button id="removeSubscriptionBtn">Supprimer Abonnement</button>

                <h3>Liste des Utilisateurs</h3>
                <ul id="adminUserList"></ul>
            </div>

            <div id="ads-management" class="admin-content">
                <h2>Gestion des Publicités</h2>
                <h3>Ajouter Publicité</h3>
                <input type="text" id="addAdName" placeholder="Nom Publicité" required>
                <select id="addAdType">
                    <option value="text_ad">Publicité Texte</option>
                    <option value="video_ad">Publicité Vidéo</option>
                </select>
                <select id="addAdPlacement">
                    <option value="below_player">Sous le lecteur</option>
                    <option value="sidebar">Barre latérale</option>
                </select>
                <input type="text" id="addAdUrl" placeholder="URL Cible (clic)">
                <input type="text" id="addAdYoutubeId" placeholder="ID YouTube (si vidéo)">
                <input type="text" id="addAdText" placeholder="Texte Publicité (si texte)">
                <button id="addAdBtn">Ajouter Publicité</button>

                <h3>Modifier/Supprimer Publicité</h3>
                <select id="selectAdForEdit"></select>
                <input type="text" id="editAdId" placeholder="ID Publicité" readonly>
                <input type="text" id="editAdName" placeholder="Nouveau Nom Publicité">
                <select id="editAdType">
                    <option value="text_ad">Publicité Texte</option>
                    <option value="video_ad">Publicité Vidéo</option>
                </select>
                <select id="editAdPlacement">
                    <option value="below_player">Sous le lecteur</option>
                    <option value="sidebar">Barre latérale</option>
                </select>
                <input type="text" id="editAdUrl" placeholder="Nouvelle URL Cible">
                <input type="text" id="editAdYoutubeId" placeholder="Nouvel ID YouTube (si vidéo)">
                <input type="text" id="editAdText" placeholder="Nouveau Texte Publicité (si texte)">
                <button id="editAdBtn">Modifier Publicité</button>
                <button id="deleteAdBtn">Supprimer Publicité</button>

                <h3>Liste des Publicités</h3>
                <ul id="adminAdList"></ul>
            </div>

            <div id="settings-management" class="admin-content">
                <h2>Paramètres Généraux</h2>
                <h3>Liens de Contact</h3>
                <input type="url" id="facebookLinkInput" placeholder="Lien Facebook">
                <input type="url" id="whatsappLinkInput" placeholder="Lien WhatsApp">
                <button id="updateContactLinksBtn">Mettre à jour les liens</button>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 B-TV. Tous droits réservés.</p>
    </footer>

    <script src="firebase-config.js"></script>
    <script src="admin.js"></script>
</body>
</html>