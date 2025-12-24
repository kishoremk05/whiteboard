import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
    en: {
        translation: {
            common: {
                loading: 'Loading...',
                save: 'Save',
                cancel: 'Cancel',
                delete: 'Delete',
                edit: 'Edit',
                create: 'Create',
                search: 'Search',
                settings: 'Settings',
            },
            dashboard: {
                title: 'My Boards',
                newBoard: 'New Board',
                templates: 'Templates',
                allBoards: 'All Boards',
                favorites: 'Favorites',
                trash: 'Trash',
                team: 'Team',
                emptyState: 'No boards yet',
                emptyStateDescription: 'Create your first whiteboard to get started',
            },
            board: {
                untitled: 'Untitled Board',
                share: 'Share',
                export: 'Export',
                delete: 'Delete',
                duplicate: 'Duplicate',
                rename: 'Rename',
            },
            settings: {
                profile: 'Profile',
                appearance: 'Appearance',
                notifications: 'Notifications',
                language: 'Language & Region',
                security: 'Security',
                subscription: 'Subscription',
                theme: {
                    light: 'Light',
                    dark: 'Dark',
                    system: 'System',
                },
            },
        },
    },
    es: {
        translation: {
            common: {
                loading: 'Cargando...',
                save: 'Guardar',
                cancel: 'Cancelar',
                delete: 'Eliminar',
                edit: 'Editar',
                create: 'Crear',
                search: 'Buscar',
                settings: 'Configuración',
            },
            dashboard: {
                title: 'Mis Tableros',
                newBoard: 'Nuevo Tablero',
                templates: 'Plantillas',
                allBoards: 'Todos los Tableros',
                favorites: 'Favoritos',
                trash: 'Papelera',
                team: 'Equipo',
                emptyState: 'Aún no hay tableros',
                emptyStateDescription: 'Crea tu primer pizarra para comenzar',
            },
            board: {
                untitled: 'Tablero Sin Título',
                share: 'Compartir',
                export: 'Exportar',
                delete: 'Eliminar',
                duplicate: 'Duplicar',
                rename: 'Renombrar',
            },
            settings: {
                profile: 'Perfil',
                appearance: 'Apariencia',
                notifications: 'Notificaciones',
                language: 'Idioma y Región',
                security: 'Seguridad',
                subscription: 'Suscripción',
                theme: {
                    light: 'Claro',
                    dark: 'Oscuro',
                    system: 'Sistema',
                },
            },
        },
    },
    fr: {
        translation: {
            common: {
                loading: 'Chargement...',
                save: 'Enregistrer',
                cancel: 'Annuler',
                delete: 'Supprimer',
                edit: 'Modifier',
                create: 'Créer',
                search: 'Rechercher',
                settings: 'Paramètres',
            },
            dashboard: {
                title: 'Mes Tableaux',
                newBoard: 'Nouveau Tableau',
                templates: 'Modèles',
                allBoards: 'Tous les Tableaux',
                favorites: 'Favoris',
                trash: 'Corbeille',
                team: 'Équipe',
                emptyState: 'Aucun tableau pour le moment',
                emptyStateDescription: 'Créez votre premier tableau pour commencer',
            },
            board: {
                untitled: 'Tableau Sans Titre',
                share: 'Partager',
                export: 'Exporter',
                delete: 'Supprimer',
                duplicate: 'Dupliquer',
                rename: 'Renommer',
            },
            settings: {
                profile: 'Profil',
                appearance: 'Apparence',
                notifications: 'Notifications',
                language: 'Langue et Région',
                security: 'Sécurité',
                subscription: 'Abonnement',
                theme: {
                    light: 'Clair',
                    dark: 'Sombre',
                    system: 'Système',
                },
            },
        },
    },
    de: {
        translation: {
            common: {
                loading: 'Wird geladen...',
                save: 'Speichern',
                cancel: 'Abbrechen',
                delete: 'Löschen',
                edit: 'Bearbeiten',
                create: 'Erstellen',
                search: 'Suchen',
                settings: 'Einstellungen',
            },
            dashboard: {
                title: 'Meine Boards',
                newBoard: 'Neues Board',
                templates: 'Vorlagen',
                allBoards: 'Alle Boards',
                favorites: 'Favoriten',
                trash: 'Papierkorb',
                team: 'Team',
                emptyState: 'Noch keine Boards',
                emptyStateDescription: 'Erstellen Sie Ihr erstes Whiteboard',
            },
            board: {
                untitled: 'Unbenanntes Board',
                share: 'Teilen',
                export: 'Exportieren',
                delete: 'Löschen',
                duplicate: 'Duplizieren',
                rename: 'Umbenennen',
            },
            settings: {
                profile: 'Profil',
                appearance: 'Aussehen',
                notifications: 'Benachrichtigungen',
                language: 'Sprache & Region',
                security: 'Sicherheit',
                subscription: 'Abonnement',
                theme: {
                    light: 'Hell',
                    dark: 'Dunkel',
                    system: 'System',
                },
            },
        },
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes
        },
    });

export default i18n;
