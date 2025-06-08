// Aza apetraka eto intsony ny firebase.initializeApp sy ny const db/auth, efa ao anaty firebase-config.js izy ireo.

// ELEMENTS DE L'INTERFACE UTILISATEUR ADMIN
const adminLoginForm = document.getElementById('adminLoginForm');
const adminDashboard = document.getElementById('adminDashboard');
const adminEmailInput = document.getElementById('adminEmail');
const adminPasswordInput = document.getElementById('adminPassword');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const adminError = document.getElementById('adminError');
const adminUserEmail = document.getElementById('adminUserEmail');

const navButtons = document.querySelectorAll('.admin-nav .nav-button');
const adminContents = document.querySelectorAll('.admin-content');

// Canaux
const addChannelNameInput = document.getElementById('addChannelName');
const addChannelBtn = document.getElementById('addChannelBtn');
const selectChannelForEdit = document.getElementById('selectChannelForEdit');
const editChannelId = document.getElementById('editChannelId');
const editChannelName = document.getElementById('editChannelName');
const editChannelBtn = document.getElementById('editChannelBtn');
const deleteChannelBtn = document.getElementById('deleteChannelBtn');
const adminChannelList = document.getElementById('adminChannelList');

// Vidéos
const addVideoTitleInput = document.getElementById('addVideoTitle');
const addYoutubeIdInput = document.getElementById('addYoutubeId');
const addVideoChannelIdSelect = document.getElementById('addVideoChannelId');
const addVideoBtn = document.getElementById('addVideoBtn');
const selectVideoForEdit = document.getElementById('selectVideoForEdit');
const editVideoId = document.getElementById('editVideoId');
const editVideoTitle = document.getElementById('editVideoTitle');
const editYoutubeId = document.getElementById('editYoutubeId');
const editVideoChannelIdSelect = document.getElementById('editVideoChannelId');
const editVideoBtn = document.getElementById('editVideoBtn');
const deleteVideoBtn = document.getElementById('deleteVideoBtn');
const adminVideoList = document.getElementById('adminVideoList');

// Utilisateurs et Abonnements
const selectUserForSub = document.getElementById('selectUserForSub');
const subUid = document.getElementById('subUid');
const subPhoneNumber = document.getElementById('subPhoneNumber');
const subToken = document.getElementById('subToken');
const subExpiration = document.getElementById('subExpiration');
const addSubscriptionBtn = document.getElementById('addSubscriptionBtn');
const removeSubscriptionBtn = document.getElementById('removeSubscriptionBtn');
const adminUserList = document.getElementById('adminUserList');

// Publicités
const addAdName = document.getElementById('addAdName');
const addAdType = document.getElementById('addAdType');
const addAdPlacement = document.getElementById('addAdPlacement');
const addAdUrl = document.getElementById('addAdUrl');
const addAdYoutubeId = document.getElementById('addAdYoutubeId');
const addAdText = document.getElementById('addAdText');
const addAdBtn = document.getElementById('addAdBtn');

const selectAdForEdit = document.getElementById('selectAdForEdit');
const editAdId = document.getElementById('editAdId');
const editAdName = document.getElementById('editAdName');
const editAdType = document.getElementById('editAdType');
const editAdPlacement = document.getElementById('editAdPlacement');
const editAdUrl = document.getElementById('editAdUrl');
const editAdYoutubeId = document.getElementById('editAdYoutubeId');
const editAdText = document.getElementById('editAdText');
const editAdBtn = document.getElementById('editAdBtn');
const deleteAdBtn = document.getElementById('deleteAdBtn');
const adminAdList = document.getElementById('adminAdList');

// Paramètres
const facebookLinkInput = document.getElementById('facebookLinkInput');
const whatsappLinkInput = document.getElementById('whatsappLinkInput');
const updateContactLinksBtn = document.getElementById('updateContactLinksBtn');

// --- GESTION DE LA CONNEXION ADMIN ---
adminLoginBtn.addEventListener('click', async () => {
    const email = adminEmailInput.value;
    const password = adminPasswordInput.value;

    if (!email || !password) {
        adminError.textContent = "Veuillez entrer l'email et le mot de passe.";
        return;
    }

    adminError.textContent = 'Connexion en cours...';
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        const userDocRef = db.collection('users').doc(user.uid);
        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
            adminError.textContent = '';
            adminLoginForm.style.display = 'none';
            adminDashboard.style.display = 'block';
            adminUserEmail.textContent = user.email;
            alert('Connexion Admin réussie !');
            // Charger les données initiales du dashboard
            loadAdminChannels();
            loadAdminUsers();
            loadAdminAds();
            loadAdminSettings();
        } else {
            await auth.signOut(); // Déconnecter si pas admin
            adminError.textContent = 'Accès refusé. Vous n\'êtes pas administrateur.';
        }

    } catch (error) {
        console.error('Erreur de connexion admin:', error);
        adminError.textContent = `Erreur: ${error.message}`;
    }
});

adminLogoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        alert('Déconnexion Admin réussie !');
        adminLoginForm.style.display = 'block';
        adminDashboard.style.display = 'none';
        adminUserEmail.textContent = 'Non connecté';
        // Réinitialiser les champs et listes du dashboard
        adminChannelList.innerHTML = '';
        adminVideoList.innerHTML = '';
        adminUserList.innerHTML = '';
        adminAdList.innerHTML = '';
        facebookLinkInput.value = '';
        whatsappLinkInput.value = '';
    } catch (error) {
        console.error('Erreur de déconnexion admin:', error);
        alert('Erreur lors de la déconnexion.');
    }
});

// Écouteur de l'état de l'authentification pour gérer l'affichage du dashboard
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userDocRef = db.collection('users').doc(user.uid);
        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
            adminLoginForm.style.display = 'none';
            adminDashboard.style.display = 'block';
            adminUserEmail.textContent = user.email;
            loadAdminChannels();
            loadAdminUsers();
            loadAdminAds();
            loadAdminSettings();
        } else {
            await auth.signOut(); // Déconnecter si le rôle n'est plus admin ou absent
            adminLoginForm.style.display = 'block';
            adminDashboard.style.display = 'none';
            adminUserEmail.textContent = 'Non connecté';
        }
    } else {
        adminLoginForm.style.display = 'block';
        adminDashboard.style.display = 'none';
        adminUserEmail.textContent = 'Non connecté';
    }
});

// --- GESTION DE LA NAVIGATION DU DASHBOARD ---
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        adminContents.forEach(content => {
            if (content.id === target) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
        // Charger les données spécifiques à l'onglet
        if (target === 'channels-management') loadAdminChannels();
        if (target === 'videos-management') loadAdminVideos(addVideoChannelIdSelect.value || selectChannelForEdit.value); // Charger les vidéos de la première chaîne ou celle sélectionnée
        if (target === 'users-management') loadAdminUsers();
        if (target === 'ads-management') loadAdminAds();
        if (target === 'settings-management') loadAdminSettings();
    });
});

// --- GESTION DES CHAÎNES ---
const loadAdminChannels = () => {
    db.collection('channels').onSnapshot((snapshot) => {
        adminChannelList.innerHTML = '';
        selectChannelForEdit.innerHTML = '<option value="">Sélectionner une chaîne</option>';
        addVideoChannelIdSelect.innerHTML = '<option value="">Sélectionner une chaîne</option>';
        editVideoChannelIdSelect.innerHTML = '<option value="">Sélectionner une chaîne</option>';

        if (snapshot.empty) {
            adminChannelList.innerHTML = '<li>Aucune chaîne enregistrée.</li>';
            return;
        }

        snapshot.docs.forEach(doc => {
            const channel = doc.data();
            const li = document.createElement('li');
            li.textContent = `${channel.name} (ID: ${doc.id})`;
            adminChannelList.appendChild(li);

            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = channel.name;
            selectChannelForEdit.appendChild(option);
            
            const optionAddVideo = option.cloneNode(true);
            addVideoChannelIdSelect.appendChild(optionAddVideo);

            const optionEditVideo = option.cloneNode(true);
            editVideoChannelIdSelect.appendChild(optionEditVideo);
        });
    });
};

selectChannelForEdit.addEventListener('change', () => {
    const channelId = selectChannelForEdit.value;
    if (channelId) {
        db.collection('channels').doc(channelId).get().then(doc => {
            if (doc.exists) {
                editChannelId.value = doc.id;
                editChannelName.value = doc.data().name;
            }
        });
    } else {
        editChannelId.value = '';
        editChannelName.value = '';
    }
});

addChannelBtn.addEventListener('click', async () => {
    const channelName = addChannelNameInput.value.trim();
    if (!channelName) {
        alert('Veuillez entrer le nom de la chaîne.');
        return;
    }
    try {
        await db.collection('channels').add({
            name: channelName,
            createdAt: db.FieldValue.serverTimestamp()
        });
        addChannelNameInput.value = '';
        alert('Chaîne ajoutée avec succès !');
    } catch (e) {
        console.error('Erreur ajout chaîne:', e);
        alert('Erreur lors de l\'ajout de la chaîne.');
    }
});

editChannelBtn.addEventListener('click', async () => {
    const id = editChannelId.value;
    const name = editChannelName.value.trim();
    if (!id || !name) {
        alert('Veuillez sélectionner une chaîne et entrer un nouveau nom.');
        return;
    }
    try {
        await db.collection('channels').doc(id).update({
            name: name
        });
        alert('Chaîne modifiée avec succès !');
    } catch (e) {
        console.error('Erreur modification chaîne:', e);
        alert('Erreur lors de la modification de la chaîne.');
    }
});

deleteChannelBtn.addEventListener('click', async () => {
    const id = deleteChannelId.value = selectChannelForEdit.value; // Utiliser la valeur sélectionnée
    if (!id) {
        alert('Veuillez sélectionner une chaîne à supprimer.');
        return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cette chaîne et toutes ses vidéos?')) {
        try {
            // Supprimer d'abord les vidéos associées
            const videosSnapshot = await db.collection('videos').where('channelId', '==', id).get();
            const batch = db.batch();
            videosSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            // Supprimer la chaîne elle-même
            await db.collection('channels').doc(id).delete();
            alert('Chaîne et vidéos associées supprimées avec succès !');
        } catch (e) {
            console.error('Erreur suppression chaîne:', e);
            alert('Erreur lors de la suppression de la chaîne.');
        }
    }
});

// --- GESTION DES VIDÉOS ---
const loadAdminVideos = (channelId = null) => {
    let query = db.collection('videos').orderBy('createdAt', 'desc');
    if (channelId) {
        query = query.where('channelId', '==', channelId);
    }

    query.onSnapshot(async (snapshot) => {
        adminVideoList.innerHTML = '';
        selectVideoForEdit.innerHTML = '<option value="">Sélectionner une vidéo</option>';

        if (snapshot.empty) {
            adminVideoList.innerHTML = '<li>Aucune vidéo enregistrée.</li>';
            return;
        }

        const channelNames = {}; // Pour stocker les noms des chaînes
        for (const doc of snapshot.docs) {
            const video = doc.data();
            if (video.channelId && !channelNames[video.channelId]) {
                const channelDoc = await db.collection('channels').doc(video.channelId).get();
                if (channelDoc.exists) {
                    channelNames[video.channelId] = channelDoc.data().name;
                } else {
                    channelNames[video.channelId] = 'Chaîne inconnue';
                }
            }
        }

        snapshot.docs.forEach(doc => {
            const video = doc.data();
            const li = document.createElement('li');
            li.textContent = `${video.title} (Chaîne: ${channelNames[video.channelId] || 'Inconnue'}, ID: ${doc.id}, Vues: ${video.views || 0})`;
            adminVideoList.appendChild(li);

            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${video.title} (${channelNames[video.channelId] || 'Inconnue'})`;
            selectVideoForEdit.appendChild(option);
        });
    });
};

addVideoChannelIdSelect.addEventListener('change', () => {
    // Si vous voulez filtrer les vidéos affichées par chaîne sélectionnée dans "Ajouter vidéo"
    // loadAdminVideos(addVideoChannelIdSelect.value); 
});

selectVideoForEdit.addEventListener('change', async () => {
    const videoId = selectVideoForEdit.value;
    if (videoId) {
        const doc = await db.collection('videos').doc(videoId).get();
        if (doc.exists) {
            const video = doc.data();
            editVideoId.value = doc.id;
            editVideoTitle.value = video.title;
            editYoutubeId.value = video.youtubeId;
            editVideoChannelIdSelect.value = video.channelId;
        }
    } else {
        editVideoId.value = '';
        editVideoTitle.value = '';
        editYoutubeId.value = '';
        editVideoChannelIdSelect.value = '';
    }
});

addVideoBtn.addEventListener('click', async () => {
    const videoTitle = addVideoTitleInput.value.trim();
    const youtubeId = addYoutubeIdInput.value.trim();
    const videoChannelId = addVideoChannelIdSelect.value;

    if (!videoTitle || !youtubeId || !videoChannelId) {
        alert('Veuillez remplir tous les champs de la vidéo.');
        return;
    }
    try {
        await db.collection('videos').add({
            title: videoTitle,
            youtubeId: youtubeId,
            channelId: videoChannelId,
            views: 0,
            createdAt: db.FieldValue.serverTimestamp()
        });
        addVideoTitleInput.value = '';
        addYoutubeIdInput.value = '';
        addVideoChannelIdSelect.value = '';
        alert('Vidéo ajoutée avec succès !');
    } catch (e) {
        console.error('Erreur ajout vidéo:', e);
        alert('Erreur lors de l\'ajout de la vidéo.');
    }
});

editVideoBtn.addEventListener('click', async () => {
    const id = editVideoId.value;
    const title = editVideoTitle.value.trim();
    const youtube = editYoutubeId.value.trim();
    const channelId = editVideoChannelIdSelect.value;
    if (!id || !title || !youtube || !channelId) {
        alert('Veuillez sélectionner une vidéo et remplir tous les champs.');
        return;
    }
    try {
        await db.collection('videos').doc(id).update({
            title: title,
            youtubeId: youtube,
            channelId: channelId
        });
        alert('Vidéo modifiée avec succès !');
    } catch (e) {
        console.error('Erreur modification vidéo:', e);
        alert('Erreur lors de la modification de la vidéo.');
    }
});

deleteVideoBtn.addEventListener('click', async () => {
    const id = deleteVideoId.value = selectVideoForEdit.value; // Utiliser la valeur sélectionnée
    if (!id) {
        alert('Veuillez sélectionner une vidéo à supprimer.');
        return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vidéo?')) {
        try {
            await db.collection('videos').doc(id).delete();
            alert('Vidéo supprimée avec succès !');
        } catch (e) {
            console.error('Erreur suppression vidéo:', e);
            alert('Erreur lors de la suppression de la vidéo.');
        }
    }
});

// --- GESTION DES UTILISATEURS ET ABONNEMENTS ---
const loadAdminUsers = () => {
    db.collection('users').onSnapshot((snapshot) => {
        adminUserList.innerHTML = '';
        selectUserForSub.innerHTML = '<option value="">Sélectionner un utilisateur</option>';

        if (snapshot.empty) {
            adminUserList.innerHTML = '<li>Aucun utilisateur enregistré.</li>';
            return;
        }

        snapshot.docs.forEach(doc => {
            const user = doc.data();
            const expirationDate = user.tokenExpiration ? user.tokenExpiration.toDate().toLocaleDateString() : 'N/A';
            const status = user.token && user.tokenExpiration && user.tokenExpiration.toDate() > new Date() ? 'Abonné' : 'Non abonné';
            const li = document.createElement('li');
            li.textContent = `${user.phoneNumber || user.email} (Rôle: ${user.role}, Statut: ${status}, Exp: ${expirationDate}, UID: ${doc.id})`;
            adminUserList.appendChild(li);

            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${user.phoneNumber || user.email} (ID: ${doc.id})`;
            selectUserForSub.appendChild(option);
        });
    });
};

selectUserForSub.addEventListener('change', async () => {
    const userId = selectUserForSub.value;
    if (userId) {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            const user = doc.data();
            subUid.value = doc.id;
            subPhoneNumber.value = user.phoneNumber || user.email || 'N/A';
            subToken.value = user.token || '';
            if (user.tokenExpiration) {
                const expDate = user.tokenExpiration.toDate();
                // Formater la date en YYYY-MM-DD pour l'input type="date"
                subExpiration.value = expDate.toISOString().split('T')[0];
            } else {
                subExpiration.value = '';
            }
        }
    } else {
        subUid.value = '';
        subPhoneNumber.value = '';
        subToken.value = '';
        subExpiration.value = '';
    }
});

addSubscriptionBtn.addEventListener('click', async () => {
    const uid = subUid.value.trim();
    const token = subToken.value.trim();
    const expiration = subExpiration.value; // Format YYYY-MM-DD

    if (!uid || !expiration) {
        alert('Veuillez sélectionner un utilisateur et entrer une date d\'expiration.');
        return;
    }

    try {
        const expirationDate = new Date(expiration);
        // Utiliser Timestamp.fromDate pour stocker correctement la date dans Firestore
        const userRef = db.collection('users').doc(uid);
        await userRef.update({
            token: token || null, // Si vide, stocke null
            tokenExpiration: firebase.firestore.Timestamp.fromDate(expirationDate),
            updatedAt: db.FieldValue.serverTimestamp()
        });
        alert('Abonnement mis à jour avec succès !');
    } catch (e) {
        console.error('Erreur mise à jour abonnement:', e);
        alert('Erreur lors de la mise à jour de l\'abonnement.');
    }
});

removeSubscriptionBtn.addEventListener('click', async () => {
    const uid = subUid.value.trim();
    if (!uid) {
        alert('Veuillez sélectionner un utilisateur.');
        return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer l\'abonnement de cet utilisateur?')) {
        try {
            const userRef = db.collection('users').doc(uid);
            await userRef.update({
                token: null,
                tokenExpiration: null,
                updatedAt: db.FieldValue.serverTimestamp()
            });
            alert('Abonnement supprimé avec succès !');
            // Réinitialiser les champs après suppression
            subUid.value = '';
            subPhoneNumber.value = '';
            subToken.value = '';
            subExpiration.value = '';
        } catch (e) {
            console.error('Erreur suppression abonnement:', e);
            alert('Erreur lors de la suppression de l\'abonnement.');
        }
    }
});

// --- GESTION DES PUBLICITÉS ---
const loadAdminAds = () => {
    db.collection('advertisements').onSnapshot((snapshot) => {
        adminAdList.innerHTML = '';
        selectAdForEdit.innerHTML = '<option value="">Sélectionner une publicité</option>';

        if (snapshot.empty) {
            adminAdList.innerHTML = '<li>Aucune publicité enregistrée.</li>';
            return;
        }

        snapshot.docs.forEach(doc => {
            const ad = doc.data();
            const typeDisplay = ad.adType === 'video_ad' ? 'Vidéo' : 'Texte';
            const li = document.createElement('li');
            li.textContent = `${ad.name} (Type: ${typeDisplay}, ID: ${doc.id})`;
            adminAdList.appendChild(li);

            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${ad.name} (${typeDisplay})`;
            selectAdForEdit.appendChild(option);
        });
    });
};

selectAdForEdit.addEventListener('change', async () => {
    const adId = selectAdForEdit.value;
    if (adId) {
        const doc = await db.collection('advertisements').doc(adId).get();
        if (doc.exists) {
            const ad = doc.data();
            editAdId.value = doc.id;
            editAdName.value = ad.name;
            editAdType.value = ad.adType;
            editAdPlacement.value = ad.adPlacement;
            editAdUrl.value = ad.targetUrl || '';
            editAdYoutubeId.value = ad.youtubeId || '';
            editAdText.value = ad.text || '';
        }
    } else {
        editAdId.value = '';
        editAdName.value = '';
        editAdType.value = 'text_ad';
        editAdPlacement.value = 'below_player';
        editAdUrl.value = '';
        editAdYoutubeId.value = '';
        editAdText.value = '';
    }
});

addAdBtn.addEventListener('click', async () => {
    const name = addAdName.value.trim();
    const adType = addAdType.value;
    const adPlacement = addAdPlacement.value;
    const targetUrl = addAdUrl.value.trim();
    const youtubeId = addAdYoutubeId.value.trim();
    const text = addAdText.value.trim();

    if (!name || !targetUrl) {
        alert('Veuillez remplir le nom et l\'URL cible de la publicité.');
        return;
    }
    if (adType === 'video_ad' && !youtubeId) {
        alert('Veuillez entrer l\'ID YouTube pour une publicité vidéo.');
        return;
    }
    if (adType === 'text_ad' && !text) {
        alert('Veuillez entrer le texte pour une publicité texte.');
        return;
    }

    try {
        await db.collection('advertisements').add({
            name: name,
            adType: adType,
            adPlacement: adPlacement,
            targetUrl: targetUrl,
            youtubeId: adType === 'video_ad' ? youtubeId : null,
            text: adType === 'text_ad' ? text : null,
            createdAt: db.FieldValue.serverTimestamp()
        });
        alert('Publicité ajoutée avec succès !');
        addAdName.value = '';
        addAdUrl.value = '';
        addAdYoutubeId.value = '';
        addAdText.value = '';
        addAdType.value = 'text_ad';
        addAdPlacement.value = 'below_player';
    } catch (e) {
        console.error('Erreur ajout publicité:', e);
        alert('Erreur lors de l\'ajout de la publicité.');
    }
});

editAdBtn.addEventListener('click', async () => {
    const id = editAdId.value;
    const name = editAdName.value.trim();
    const adType = editAdType.value;
    const adPlacement = editAdPlacement.value;
    const targetUrl = editAdUrl.value.trim();
    const youtubeId = editAdYoutubeId.value.trim();
    const text = editAdText.value.trim();

    if (!id || !name || !targetUrl) {
        alert('Veuillez sélectionner une publicité et remplir les champs requis.');
        return;
    }
    if (adType === 'video_ad' && !youtubeId) {
        alert('Veuillez entrer l\'ID YouTube pour une publicité vidéo.');
        return;
    }
    if (adType === 'text_ad' && !text) {
        alert('Veuillez entrer le texte pour une publicité texte.');
        return;
    }

    try {
        await db.collection('advertisements').doc(id).update({
            name: name,
            adType: adType,
            adPlacement: adPlacement,
            targetUrl: targetUrl,
            youtubeId: adType === 'video_ad' ? youtubeId : null,
            text: adType === 'text_ad' ? text : null
        });
        alert('Publicité modifiée avec succès !');
    } catch (e) {
        console.error('Erreur modification publicité:', e);
        alert('Erreur lors de la modification de la publicité.');
    }
});

deleteAdBtn.addEventListener('click', async () => {
    const id = deleteAdId.value = selectAdForEdit.value;
    if (!id) {
        alert('Veuillez sélectionner une publicité à supprimer.');
        return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité?')) {
        try {
            await db.collection('advertisements').doc(id).delete();
            alert('Publicité supprimée avec succès !');
        } catch (e) {
            console.error('Erreur suppression publicité:', e);
            alert('Erreur lors de la suppression de la publicité.');
        }
    }
});

// --- GESTION DES PARAMÈTRES ---
const loadAdminSettings = () => {
    db.collection('settings').doc('contact').onSnapshot((docSnap) => {
        if (docSnap.exists) {
            const data = docSnap.data();
            facebookLinkInput.value = data.facebookLink || '';
            whatsappLinkInput.value = data.whatsappLink || '';
        } else {
            console.log("Document de paramètres de contact introuvable.");
            facebookLinkInput.value = '';
            whatsappLinkInput.value = '';
        }
    }, (error) => {
        console.error("Erreur lors du chargement des paramètres:", error);
    });
};

updateContactLinksBtn.addEventListener('click', async () => {
    const facebookLink = facebookLinkInput.value.trim();
    const whatsappLink = whatsappLinkInput.value.trim();

    try {
        await db.collection('settings').doc('contact').set({
            facebookLink: facebookLink,
            whatsappLink: whatsappLink
        }, { merge: true }); // Utilisez merge: true pour ne pas écraser d'autres champs potentiels
        alert('Liens de contact mis à jour avec succès !');
    } catch (e) {
        console.error('Erreur mise à jour des liens de contact:', e);
        alert('Erreur lors de la mise à jour des liens de contact.');
    }
});

// --- INITIALISATION AU CHARGEMENT DE LA PAGE ---
document.addEventListener('DOMContentLoaded', () => {
    // La fonction onAuthStateChanged gérera l'affichage du dashboard
    // Pas besoin d'appeler les fonctions de chargement des données ici
    // car elles sont appelées dans onAuthStateChanged.
});