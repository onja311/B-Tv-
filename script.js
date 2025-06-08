// Aza apetraka eto intsony ny firebase.initializeApp sy ny const db/auth, efa ao anaty firebase-config.js izy ireo.

// ELEMENTS DE L'INTERFACE UTILISATEUR
const loginModal = document.getElementById('loginModal');
const closeButton = document.querySelector('.close-button');
const phoneNumberInput = document.getElementById('phoneNumberInput');
const sendCodeBtn = document.getElementById('sendCodeBtn');
const verificationCodeInput = document.getElementById('verificationCodeInput');
const verifyCodeBtn = document.getElementById('verifyCodeBtn');
const authError = document.getElementById('authError');
const authButton = document.getElementById('authButton');
const adminUserEmail = document.getElementById('adminUserEmail');
const recaptchaContainer = document.getElementById('recaptcha-container');

const channelList = document.getElementById('channelList');
const noChannelMessage = document.getElementById('noChannelMessage');
const videoList = document.getElementById('videoList');
const mainVideoPlayerDiv = document.getElementById('mainVideoPlayerDiv');
const videoTitleDisplay = document.getElementById('videoTitleDisplay');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');

const onlineUsersCount = document.getElementById('onlineUsersCount');

const facebookLink = document.getElementById('facebookLink');
const whatsappLink = document.getElementById('whatsappLink');

const adsContainer = document.getElementById('adsContainer');

// VARIABLES GLOBALES
let confirmationResult;
let player;
let userToken = null; // Token d'abonnement de l'utilisateur

// --- FONCTIONS DE GESTION DE L'INTERFACE ---
closeButton.addEventListener('click', () => {
    loginModal.style.display = 'none';
    authError.textContent = '';
    phoneNumberInput.value = '';
    verificationCodeInput.value = '';
    phoneNumberInput.style.display = 'block';
    sendCodeBtn.style.display = 'block';
    recaptchaContainer.style.display = 'block';
    verificationCodeInput.style.display = 'none';
    verifyCodeBtn.style.display = 'none';
    if (appVerifier) {
        appVerifier.clear();
    }
});

window.addEventListener('click', (event) => {
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
        authError.textContent = '';
        phoneNumberInput.value = '';
        verificationCodeInput.value = '';
        phoneNumberInput.style.display = 'block';
        sendCodeBtn.style.display = 'block';
        recaptchaContainer.style.display = 'block';
        verificationCodeInput.style.display = 'none';
        verifyCodeBtn.style.display = 'none';
        if (appVerifier) {
            appVerifier.clear();
        }
    }
});

// --- FONCTIONS DE GESTION DE L'AUTHENTIFICATION PAR TÉLÉPHONE ---
let appVerifier; 

authButton.addEventListener('click', () => {
    if (auth.currentUser) {
        auth.signOut();
        alert('Déconnexion réussie.');
    } else {
        loginModal.style.display = 'block';
        authError.textContent = '';
        if (!appVerifier) {
            appVerifier = new firebase.auth.RecaptchaVerifier(recaptchaContainer, {
                'size': 'invisible', 
                'callback': (response) => {
                    console.log('reCAPTCHA résolu, prêt à envoyer le code.');
                },
                'expired-callback': () => {
                    console.log('reCAPTCHA expiré.');
                    authError.textContent = 'reCAPTCHA expiré. Veuillez réessayer.';
                    appVerifier.clear(); 
                }
            });
            appVerifier.render().then(widgetId => {
                console.log('Recaptcha rendered with widget ID:', widgetId);
            });
        } else {
            appVerifier.clear(); 
            appVerifier.render(); 
        }
    }
});

sendCodeBtn.addEventListener('click', async () => {
    const phoneNumber = phoneNumberInput.value;
    if (!phoneNumber) {
        authError.textContent = "Veuillez entrer un numéro de téléphone.";
        return;
    }
    // Assurez-vous que le numéro de téléphone commence par '+'
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`; 

    authError.textContent = 'Envoi du code...';
    try {
        confirmationResult = await auth.signInWithPhoneNumber(formattedPhoneNumber, appVerifier); 
        authError.textContent = 'Code envoyé! Veuillez le vérifier.';
        phoneNumberInput.style.display = 'none';
        sendCodeBtn.style.display = 'none';
        recaptchaContainer.style.display = 'none'; 
        verificationCodeInput.style.display = 'block';
        verifyCodeBtn.style.display = 'block';
    } catch (error) {
        console.error('Erreur lors de l\'envoi du code:', error);
        authError.textContent = `Erreur: ${error.message}`;
        if (appVerifier) {
            appVerifier.clear(); 
        }
    }
});

verifyCodeBtn.addEventListener('click', async () => {
    const code = verificationCodeInput.value;
    if (!code) {
        authError.textContent = "Veuillez entrer le code de vérification.";
        return;
    }
    authError.textContent = 'Vérification du code...';
    try {
        await confirmationResult.confirm(code);
        loginModal.style.display = 'none';
        authError.textContent = '';
        phoneNumberInput.value = '';
        verificationCodeInput.value = '';
        phoneNumberInput.style.display = 'block';
        sendCodeBtn.style.display = 'block';
        recaptchaContainer.style.display = 'block';
        verificationCodeInput.style.display = 'none';
        verifyCodeBtn.style.display = 'none';
        if (appVerifier) {
            appVerifier.clear();
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du code:', error);
        authError.textContent = `Code invalide ou expiré: ${error.message}`;
    }
});

// Écouteur pour l'état de l'authentification (quand l'utilisateur se connecte/déconnecte)
auth.onAuthStateChanged(async (user) => { 
    if (user) {
        authButton.textContent = 'Se déconnecter';
        if (user.phoneNumber) {
             adminUserEmail.textContent = user.phoneNumber; 
        } else if (user.email) {
             adminUserEmail.textContent = user.email; // Si un admin se connecte sur index.html (peu probable, mais au cas où)
        } else {
             adminUserEmail.textContent = 'Connecté';
        }

        const userDocRef = db.collection('users').doc(user.uid); 
        const userDocSnap = await userDocRef.get(); 
        
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // Vérifier si le token est valide et non expiré
            if (userData.token && userData.tokenExpiration && userData.tokenExpiration.toDate() > new Date()) {
                userToken = userData.token;
                console.log('Token d\'abonnement valide trouvé pour l\'utilisateur.');
                loadChannels(); 
                errorMessage.textContent = ''; 
                videoTitleDisplay.textContent = 'Sélectionnez une chaîne et une vidéo';
                mainVideoPlayerDiv.style.display = 'none'; // Cacher le lecteur jusqu'à la sélection
            } else {
                userToken = null; 
                console.log('Pas de token valide ou expiré.');
                errorMessage.textContent = 'Votre abonnement a expiré ou est invalide. Veuillez contacter l\'administrateur.';
                videoTitleDisplay.textContent = 'Veuillez vous abonner pour accéder aux vidéos.';
                mainVideoPlayerDiv.style.display = 'none';
            }
        } else {
            // Si le document utilisateur n'existe pas encore pour cet UID, vérifier s'il existe par numéro de téléphone
            // et le mettre à jour avec l'UID de Firebase Auth
            const usersRef = db.collection('users'); 
            const q = usersRef.where('phoneNumber', '==', user.phoneNumber).limit(1);
            const querySnapshot = await q.get();

            if (!querySnapshot.empty) {
                const existingUserDoc = querySnapshot.docs[0];
                await existingUserDoc.ref.update({
                    uid: user.uid, 
                    updatedAt: db.FieldValue.serverTimestamp() 
                });
                console.log('User document updated with Firebase Auth UID.');

                // Recharger les données de l'utilisateur après la mise à jour
                const updatedUserDocSnap = await existingUserDoc.ref.get();
                const updatedUserData = updatedUserDocSnap.data();
                if (updatedUserData.token && updatedUserData.tokenExpiration && updatedUserData.tokenExpiration.toDate() > new Date()) {
                    userToken = updatedUserData.token;
                    console.log('Token d\'abonnement valide trouvé pour l\'utilisateur après mise à jour UID.');
                    loadChannels();
                    errorMessage.textContent = '';
                    videoTitleDisplay.textContent = 'Sélectionnez une chaîne et une vidéo';
                    mainVideoPlayerDiv.style.display = 'none';
                } else {
                    userToken = null;
                    errorMessage.textContent = 'Votre abonnement a expiré ou est invalide. Veuillez contacter l\'administrateur.';
                    videoTitleDisplay.textContent = 'Veuillez vous abonner pour accéder aux vidéos.';
                    mainVideoPlayerDiv.style.display = 'none';
                }

            } else {
                // Créer un nouveau document utilisateur si non trouvé
                await db.collection('users').doc(user.uid).set({ 
                    uid: user.uid,
                    phoneNumber: user.phoneNumber,
                    role: 'user', // Par défaut un utilisateur normal
                    createdAt: db.FieldValue.serverTimestamp(), 
                    token: null, // Pas de token par défaut
                    tokenExpiration: null // Pas d'expiration par défaut
                });
                userToken = null;
                errorMessage.textContent = 'Votre compte n\'a pas d\'abonnement valide. Veuillez contacter l\'administrateur.';
                videoTitleDisplay.textContent = 'Veuillez vous abonner pour accéder aux vidéos.';
                mainVideoPlayerDiv.style.display = 'none';
            }
        }
    } else {
        authButton.textContent = 'Se connecter';
        adminUserEmail.textContent = 'Non connecté'; 
        userToken = null; // Réinitialiser le token si déconnecté
        errorMessage.textContent = 'Vous devez vous connecter pour accéder aux vidéos.';
        videoTitleDisplay.textContent = 'Veuillez vous connecter pour accéder aux vidéos.';
        mainVideoPlayerDiv.style.display = 'none';
        channelList.innerHTML = ''; // Vider la liste des chaînes si déconnecté
        noChannelMessage.style.display = 'block'; // Afficher le message d'absence de chaîne
    }
});


// Fonction pour charger et afficher les chaînes
const loadChannels = () => {
    db.collection('channels').onSnapshot((snapshot) => { 
        channelList.innerHTML = ''; // Vider la liste actuelle
        if (snapshot.empty) {
            noChannelMessage.style.display = 'block';
            return;
        }
        noChannelMessage.style.display = 'none'; // Cacher le message s'il y a des chaînes

        snapshot.docs.forEach(doc => {
            const channel = doc.data();
            const li = document.createElement('li');
            li.textContent = channel.name;
            li.dataset.channelId = doc.id; // Stocker l'ID de la chaîne
            li.addEventListener('click', () => {
                // Supprimer la classe 'active' des autres éléments et l'ajouter à celui-ci
                document.querySelectorAll('#channelList li').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
                displayVideosForChannel(doc.id, channel.name);
            });
            channelList.appendChild(li);
        });
    });
};

// Fonction pour afficher les vidéos d'une chaîne sélectionnée
const displayVideosForChannel = (channelId, channelName) => {
    videoList.innerHTML = ''; // Vider la liste des vidéos
    videoTitleDisplay.textContent = `Vidéos de ${channelName}`; // Mettre à jour le titre
    mainVideoPlayerDiv.style.display = 'none'; // Cacher le lecteur principal pour le moment
    loadingMessage.style.display = 'none'; // Cacher le message de chargement

    db.collection('videos').where('channelId', '==', channelId).orderBy('createdAt', 'desc') 
    .onSnapshot((snapshot) => {
        videoList.innerHTML = ''; // Vider à nouveau pour les mises à jour en temps réel
        if (snapshot.empty) {
            videoList.innerHTML = '<p>Aucune vidéo disponible pour cette chaîne pour le moment.</p>';
            return;
        }

        snapshot.docs.forEach(doc => {
            const video = doc.data();
            const videoItem = document.createElement('div');
            videoItem.classList.add('video-item');
            videoItem.innerHTML = `
                <img src="https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg" alt="${video.title}" class="video-thumbnail">
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.views || 0} vues</p>
                </div>
            `;
            videoItem.addEventListener('click', () => {
                playSelectedVideo(doc.id); // Passer l'ID du document vidéo
            });
            videoList.appendChild(videoItem);
        });
    });
};

// Fonction pour lire une vidéo sélectionnée (Utilise YouTube Iframe API)
const playSelectedVideo = async (videoId) => {
    if (!userToken) {
        errorMessage.textContent = 'Veuillez vous abonner pour regarder les vidéos.';
        return;
    }

    loadingMessage.style.display = 'block'; // Afficher le message de chargement
    mainVideoPlayerDiv.style.display = 'none'; // Cacher le lecteur pendant le chargement

    try {
        const videoDocSnap = await db.collection('videos').doc(videoId).get(); 
        if (!videoDocSnap.exists) { 
            throw new Error("Vidéo introuvable.");
        }
        const videoData = videoDocSnap.data();
        const youtubeId = videoData.youtubeId; 

        if (!youtubeId) {
            throw new Error("ID YouTube introuvable pour cette vidéo.");
        }

        // Mettre à jour le nombre de vues
        await db.collection('videos').doc(videoId).update({ 
            views: db.FieldValue.increment(1) 
        });

        // Charger le lecteur YouTube
        if (player) {
            player.loadVideoById(youtubeId);
        } else {
            player = new YT.Player('mainVideoPlayer', {
                height: '390',
                width: '640',
                videoId: youtubeId,
                playerVars: {
                    'playsinline': 1
                },
                events: {
                    'onReady': (event) => {
                        event.target.playVideo();
                    },
                    'onError': (event) => {
                        console.error('Erreur lecteur YouTube:', event.data);
                        errorMessage.textContent = 'Erreur lors de la lecture de la vidéo YouTube.';
                        mainVideoPlayerDiv.style.display = 'none';
                        loadingMessage.style.display = 'none';
                    }
                }
            });
        }
        mainVideoPlayerDiv.style.display = 'block'; // Afficher le lecteur une fois prêt
        loadingMessage.style.display = 'none'; // Cacher le message de chargement

        // Afficher le titre de la vidéo et le nom de la chaîne
        let channelDisplayName = 'Chaîne inconnue';
        if (videoData.channelId) {
            try {
                const channelDoc = await db.collection('channels').doc(videoData.channelId).get(); 
                if (channelDoc.exists) { 
                    channelDisplayName = channelDoc.data().name;
                }
            } catch (e) {
                console.error("Erreur récupération nom chaîne:", e);
            }
        }
        videoTitleDisplay.textContent = `${videoData.title} (de ${channelDisplayName})`; 
        errorMessage.textContent = ''; // Effacer tout message d'erreur précédent

    } catch (error) {
        console.error('Erreur lors de la lecture de la vidéo :', error);
        errorMessage.textContent = 'Impossible de charger la vidéo. ' + error.message;
        loadingMessage.style.display = 'none';
        mainVideoPlayerDiv.style.display = 'none'; 
    }
};

// --- GESTION DU COMPTEUR D'UTILISATEURS EN LIGNE ---
const setupOnlineUsersCount = () => {
    // Créer un ID utilisateur unique pour cette session
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    const userRef = db.collection('onlineUsers').doc(userId);

    // Fonction pour mettre à jour la présence de l'utilisateur
    const updatePresence = async () => {
        try {
            await userRef.set({
                lastSeen: db.FieldValue.serverTimestamp() // Met à jour l'horodatage de la dernière activité
            }, { merge: true }); // 'merge: true' pour ne pas écraser d'autres champs si existants
        } catch (e) {
            console.error("Erreur mise à jour présence:", e);
        }
    };

    // Mettre à jour la présence toutes les 10 secondes
    setInterval(updatePresence, 10000); 
    updatePresence(); // Appel initial

    // Supprimer l'utilisateur de la liste des en ligne lorsque la fenêtre est fermée
    window.addEventListener('beforeunload', async () => {
        try {
            await userRef.delete();
            console.log("Utilisateur déconnecté (présence supprimée).");
        } catch (e) {
            console.warn("Impossible de supprimer la présence à la déconnexion:", e);
        }
    });

    // Écouter les changements dans la collection onlineUsers pour mettre à jour le compteur
    db.collection('onlineUsers').onSnapshot((snapshot) => {
        const now = new Date();
        let count = 0;
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            // Si la dernière activité remonte à moins de 20 secondes, considérer comme en ligne
            if (data.lastSeen && data.lastSeen.toDate() > new Date(now.getTime() - 20 * 1000)) {
                count++;
            }
        });
        onlineUsersCount.textContent = `${count} en ligne`;
    });
};

// --- FONCTIONS DE GESTION DES LIENS DE CONTACT ---
const loadContactLinks = () => {
    db.collection('settings').doc('contact').onSnapshot((docSnap) => {
        if (docSnap.exists) {
            const data = docSnap.data();
            if (data.facebookLink) {
                facebookLink.href = data.facebookLink;
                facebookLink.style.display = 'inline-block';
            } else {
                facebookLink.style.display = 'none';
            }
            if (data.whatsappLink) {
                whatsappLink.href = data.whatsappLink;
                whatsappLink.style.display = 'inline-block';
            } else {
                whatsappLink.style.display = 'none';
            }
        } else {
            console.log("Document de paramètres de contact introuvable.");
            facebookLink.style.display = 'none';
            whatsappLink.style.display = 'none';
        }
    }, (error) => {
        console.error("Erreur lors du chargement des liens de contact:", error);
    });
};

// --- FONCTIONS DE GESTION DES PUBLICITÉS ---
const loadAds = async () => {
    const adsCol = db.collection('advertisements');
    const q = adsCol.orderBy('createdAt', 'desc'); // Charger les publicités les plus récentes en premier

    q.onSnapshot((snapshot) => {
        adsContainer.innerHTML = ''; // Vider le conteneur actuel
        if (snapshot.empty) {
            adsContainer.innerHTML = '<p>Aucune publicité disponible.</p>';
            return;
        }

        snapshot.docs.forEach(doc => {
            const ad = doc.data();
            const adElement = document.createElement('a');
            adElement.href = ad.targetUrl || '#';
            adElement.target = '_blank'; // Ouvrir dans un nouvel onglet
            adElement.classList.add('ad-item');

            if (ad.adType === 'video_ad' && ad.youtubeId) {
                adElement.innerHTML = `
                    <img src="https://img.youtube.com/vi/${ad.youtubeId}/mqdefault.jpg" alt="${ad.name}" class="ad-thumbnail">
                    <p class="ad-title">${ad.name}</p>
                `;
            } else if (ad.adType === 'text_ad' && ad.text) {
                adElement.innerHTML = `
                    <p class="ad-text">${ad.text}</p>
                    <p class="ad-title">${ad.name}</p>
                `;
            } else {
                return; // Ne pas afficher les publicités mal configurées
            }
            adsContainer.appendChild(adElement);
        });
    }, (error) => {
        console.error("Erreur lors du chargement des publicités:", error);
        adsContainer.innerHTML = '<p class="error-message">Erreur de chargement des publicités.</p>';
    });
};

// --- APPEL INITIAL DES FONCTIONS ---
document.addEventListener('DOMContentLoaded', () => {
    setupOnlineUsersCount();
    loadContactLinks();
    loadAds();
});

// YouTube Iframe API ready
function onYouTubeIframeAPIReady() {
    console.log("YouTube Iframe API est prêt.");
    // Aucune action spécifique nécessaire ici, la fonction playSelectedVideo gérera la création du lecteur.
}