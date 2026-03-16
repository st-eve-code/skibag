import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Language storage key
const LANGUAGE_STORAGE_KEY = "@skibag_language";

// All translations for the app
const translations: Record<string, Record<string, string>> = {
  en: {
    // Language Screen
    select_language: "Select Language",
    language: "Language",
    english: "English",
    french: "French",
    continue: "Continue",
    current_language: "Current Language",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    ok: "OK",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    next: "Next",
    done: "Done",
    search: "Search",
    no_results: "No results found",
    retry: "Retry",
    empty_feedback_title: "Empty Feedback",
    rating_required_title: "Rating Required",
    thank_you_title: "Thank you!",
    copied_referral: "Referral code copied to clipboard",

    // Auth - Login
    welcome_back: "Welcome Back",
    login_subtitle: "Sign in to continue",
    email: "Email",
    password: "Password",
    forgot_password: "Forgot Password?",
    login: "Login",
    or_continue_with: "Or continue with",
    dont_have_account: "Don't have an account?",
    sign_up: "Sign Up",
    show_password: "Show password",
    hide_password: "Hide password",

    // Auth - Signup
    create_account: "Create Account",
    signup_subtitle: "Join the gaming community",
    username: "Username",
    confirm_password: "Confirm",
    referral_code_optional: "Code (optional)",
    signup: "Sign Up",
    already_have_account: "Already have an account?",
    login_here: "Login here",

    // Password Rules
    password_rules: "Password must contain:",
    min_8_chars: "At least 8 characters",
    uppercase: "One uppercase letter",
    lowercase: "One lowercase letter",
    number: "One number",
    special_char: "One special character",

    // Onboarding
    welcome: "Welcome to Skibag",
    get_started: "Get Started",
    skip: "Skip",
    onboarding_welcome_title: "Welcome to Skibag",
    onboarding_welcome_desc:
      "Discover and join millions of players in epic battles and adventures",
    onboarding_battles_title: "Epic Battles",
    onboarding_battles_desc:
      "Fight intense arcade battles and climb the leaderboards",
    onboarding_rewards_title: "Win Rewards",
    onboarding_rewards_desc:
      "Unlock exclusive levels, bonus, skins and achievements",
    onboarding_ready_title: "Ready to play?",
    onboarding_ready_desc:
      "Your gaming journey starts now! It's time for adventure.",

    // Tab Navigation
    home: "Home",
    games: "Games",
    events: "Events",
    wallet: "Wallet",
    profile: "Profile",

    // Home Screen
    featured_tournaments: "Featured Tournaments",
    live_matches: "Live Matches",
    upcoming_events: "Upcoming Events",
    view_all: "View All",
    no_tournaments: "No tournaments available",
    no_live_matches: "No live matches",
    join_now: "Join Now",
    play_now: "Play Now",

    // Games Screen
    all_games: "All Games",
    popular: "Popular",
    new_releases: "New Releases",
    categories: "Categories",
    action: "Action",
    strategy: "Strategy",
    puzzle: "Puzzle",
    racing: "Racing",
    sports: "Sports",
    multiplayer: "Multiplayer",

    // Events Screen
    all_events: "All Events",
    ongoing: "Ongoing",
    upcoming: "Upcoming",
    completed: "Completed",
    event_details: "Event Details",
    register: "Register",
    registered: "Registered",
    participants: "Participants",
    prize_pool: "Prize Pool",
    starts_in: "Starts in",
    ends_in: "Ends in",
    winner: "Winner",
    live_tournaments: "Live Tournaments",
    Events: "Events",
    player_bio: "Extremely confident and skillfull in every game played so far",
    entry: "Entry:",
    wins_label: "Wins",
    loss_label: "Loss",
    draws_label: "Draws",
    match_history_title: "Match History",

    // Wallet Screen
    my_wallet: "My Wallet",
    balance: "Balance",
    points: "Points",
    add_points: "Add Points",
    withdraw: "Withdraw",
    transaction_history: "Transaction History",
    deposit: "Deposit",
    no_transactions: "No transactions yet",
    amount: "Amount",
    select_payment_method: "Select Payment Method",
    credit_card: "Credit Card",
    crypto: "Cryptocurrency",
    processing: "Processing...",
    transaction_success: "Transaction successful!",
    transaction_failed: "Transaction failed",

    // Profile Screen
    edit_profile: "Edit Profile",
    settings: "Settings",
    my_referral_code: "My Referral Code",
    share_code: "Share Code",
    copy_code: "Copy Code",
    copied: "Copied!",
    copied_referral: "Referral code copied to clipboard",
    referral_stats: "Referral Stats",
    total_referrals: "Total Referrals",
    successful_referrals: "Successful Referrals",
    pending_referrals: "Pending Referrals",
    my_tournaments: "My Tournaments",
    achievements: "Achievements",
    statistics: "Statistics",
    win_rate: "Win Rate",
    total_games: "Total Games",
    total_wins: "Total Wins",
    rank: "Rank",
    member_since: "Member Since",
    logout: "Logout",
    confirm_logout: "Are you sure you want to logout?",
    yes: "Yes",
    no: "No",
    change_language: "Change Language",
    notifications: "Notifications",
    privacy_policy: "Privacy Policy",
    terms_of_service: "Terms of Service",
    about: "About",
    version: "Version",
    rewards: "Rewards",
    referral_points: "Referral Points",
    convert_points_to_coins: "Convert Points to Coins",
    play_roulette_game: "Play Roulette Game",
    earn_referral_points:
      "Earn 100 points for each referral • 10 points = 1 coin",
    email_address: "Email address",
    no_email: "No email",
    invite_friends: "Invite Friends",
    total: "Total",
    successful: "Successful",
    pending: "Pending",
    share: "Share",
    share_code_earn_rewards: "Share your code to earn rewards!",
    rate_us: "Rate Us",
    feedback: "Feedback",
    enter_feedback: "Enter your feedback",
    send_feedback: "Send Feedback",
    submitting: "Submitting...",
    account: "Account",
    delete_account: "Delete Account",
    you_have_points: "You have {points} points",
    conversion_info: "10 points = 1 coin",
    enter_points_multiple_10: "Enter points (multiples of 10)",
    you_will_receive: "You will receive: {coins} coins",
    choose_language: "Choose your preferred language",
    empty_feedback: "Please enter your feedback before submitting",
    rating_required: "Please select a star rating before submitting",
    thank_you_feedback: "Thank you! Your feedback has been submitted",
    failed_submit_feedback: "Failed to submit feedback",
    logout_confirm: "Are you sure you want to logout?",
    delete_account_confirm:
      "This will permanently delete your account and all your data. This action cannot be undone.",
    account_deleted: "Your account has been deleted",
    failed_delete_account: "Failed to delete account. Please try again",
    points_conversion_needed: "Points conversion needs to be implemented",
    invalid_amount: "Please enter a valid number of points",
    points_multiples_10: "Points must be in multiples of 10",
    insufficient_points_amount: "You only have {points} points",
    conversion_successful: "Conversion Successful! 🎉",
    converted_points_to_coins:
      "You converted {points} points to {coins} coins!",
    permission_camera: "Camera permission is required to take photos",
    permission_photos: "Photo library permission is required to select photos",
    error_picking_image: "Failed to pick image. Please try again",
    change_photo: "Change Profile Photo",
    take_photo: "Take Photo",
    choose_gallery: "Choose from Gallery",
    delete_account_title: "Delete Account",
    error: "Error",
    success: "Success",
    copied_exclamation: "Copied!",
    empty_feedback_title: "Empty Feedback",
    rating_required_title: "Rating Required",
    thank_you_title: "Thank you!",
    insufficient_points_title: "Insufficient Points",
    invalid_amount_title: "Invalid Amount",
    permission_required_title: "Permission Required",
    profile_updated: "Profile picture updated!",
    profile_updated_locally: "Profile picture updated locally!",
    failed_to_pick_image: "Failed to pick image. Please try again",
    change_profile_photo: "Change Profile Photo",

    // Leaderboard
    leaderboard: "Leaderboard",
    weekly: "Weekly",
    monthly: "Monthly",
    all_time: "All Time",
    rank_label: "Rank",
    points_label: "Points",
    yourself: "Yourself",

    // Match History
    match_history: "Match History",
    no_matches: "No matches yet",
    win: "Win",
    loss: "Loss",
    draw: "Draw",
    date: "Date",
    opponent: "Opponent",
    result: "Result",
    score: "Score",
    tournament_name: "Tournament",

    // Notifications
    no_notifications: "No notifications",
    mark_all_read: "Mark all as read",
    delete_all: "Delete all",

    // Transactions
    transaction_details: "Transaction Details",
    transaction_id: "Transaction ID",
    status: "Status",
    pending_status: "Pending",
    completed_status: "Completed",
    failed_status: "Failed",
    type: "Type",
    date_time: "Date & Time",
    all_transactions: "All Transactions",
    xaf: "XAF",

    // Roulette
    roulette: "Roulette",
    spin: "Spin",
    betting: "Betting",
    bet_amount: "Bet Amount",
    place_bet: "Place Bet",
    winning_number: "Winning Number",
    good_luck: "Good Luck!",
    you_won: "You Won!",
    try_again: "Try Again",

    // Game Details
    game_details: "Game Details",
    description: "Description",
    how_to_play: "How to Play",
    rules: "Rules",
    prizes: "Prizes",
    join_tournament: "Join Tournament",
    start_game: "Start Game",
    practice_mode: "Practice Mode",
    tournament_mode: "Tournament Mode",

    // Tournament
    tournament_details: "Tournament Details",
    tournament_info: "Tournament Info",
    format: "Format",
    schedule: "Schedule",
    prizes_breakdown: "Prizes Breakdown",
    first_place: "1st Place",
    second_place: "2nd Place",
    third_place: "3rd Place",
    register_now: "Register Now",
    unregister: "Unregister",
    spots_left: "spots left",
    full: "Full",
    bracket: "Bracket",
    rounds: "Rounds",
    final: "Final",
    semi_final: "Semi-Final",
    quarter_final: "Quarter-Final",

    // Passkey
    create_passkey: "Create Passkey",
    verify_passkey: "Verify Passkey",
    passkey_instructions: "Follow the instructions to create your passkey",
    passkey_created: "Passkey created successfully!",
    passkey_verified: "Passkey verified!",
    use_passkey: "Use Passkey to Login",
    biometric_prompt: "Use biometric to verify",

    // Privacy & Terms
    privacy_policy_title: "Privacy Policy",
    terms_of_use_title: "Terms of Use",
    i_agree: "I agree to the",
    and: "and",
    accept: "Accept",
    decline: "Decline",

    // Errors
    network_error: "Network error. Please check your connection.",
    server_error: "Server error. Please try again later.",
    invalid_email: "Invalid email address",
    invalid_password: "Invalid password",
    passwords_dont_match: "Passwords don't match",
    passwords_match: "Passwords match",
    username_taken: "Username is already taken",
    email_taken: "Email is already registered",
    invalid_referral: "Invalid referral code",
    self_referral: "You cannot use your own referral code",
    insufficient_points: "Insufficient points",
    minimum_bet: "Minimum bet amount is",
    maximum_bet: "Maximum bet amount is",

    // Success Messages
    account_created: "Account created successfully!",
    profile_updated: "Profile updated successfully!",
    points_added: "Points added successfully!",
    referral_applied: "Referral code applied!",

    // Additional Validation
    username_min_length: "Username must be at least 3 characters",
    password_requirements:
      "Password must be 8+ chars with uppercase, lowercase, number & special character",
    signup_error: "Something went wrong",
    google_signin_error: "Google Sign-In Error",
    apple_signin_error: "Apple Sign-In Error",

    // Profile Rewards
    rewards: "Rewards",
    referral_points: "Referral Points",
    convert_points_to_coins: "Convert Points to Coins",
    play_roulette_game: "Play Roulette Game",
    earn_referral_points:
      "Earn 100 points for each referral • 10 points = 1 coin",

    // Profile General
    email_address: "Email address",
    no_email: "No email",

    // Profile Invite Friends
    invite_friends: "Invite Friends",
    total: "Total",
    successful: "Successful",
    pending: "Pending",
    share: "Share",
    share_code_earn_rewards: "Share your code to earn rewards!",

    // Profile Rate Us
    rate_us: "Rate Us",
    feedback: "Feedback",
    enter_feedback: "Enter your feedback",
    send_feedback: "Send Feedback",
    submitting: "Submitting...",

    // Profile Account
    account: "Account",
    delete_account: "Delete Account",

    // Conversion Modal
    you_have_points: "You have {points} points",
    conversion_info: "10 points = 1 coin",
    enter_points_multiple_10: "Enter points (multiples of 10)",
    you_will_receive: "You will receive: {coins} coins",

    // Language Selection Modal
    choose_language: "Choose your preferred language",

    // Home Screen
    bonus_games: "Bonus Games",
    all_games_desc:
      "We are proud of all our games, you can take a close look at them",
    special_offer: "Special Offer",
    weekend_special: "Weekend Special",
    new_games: "New Games",
    get_100_bonus: "Get 100% bonus on first deposit",
    double_rewards: "Double your rewards this weekend",
    try_latest: "Try our latest additions",
    promo: "PROMO",
    free_spin_available: "Free Spin Available!",
    tap_to_claim: "Tap to claim your daily spin",

    // All Games Screen
    all_games_title: "All Games",
    games_available: "{count} games available",
    category_all: "All",
    category_casino: "Casino",
    category_action: "Action",
    category_football: "Football",
    category_board: "Board",
    category_puzzles: "Puzzles",
    category_arcade: "Arcade",
    category_fighting: "Fighting",
    category_adventure: "Adventure",

    // Game Detail Screen
    game_not_found: "Game not found",
    go_back: "Go Back",
    play_now_btn: "PLAY NOW",
    about_game: "About Game",
    top_players: "Top Players",
    see_all: "See all",
    downloads: "10K+",
    playtime: "Action",
    device: "Mobile",

    // Deposit Modal (new keys)
    deposit_modal_title: "Deposit",
    payment_method: "Payment Method",
    mtn: "MTN",
    orange: "Orange",
    phone_number: "Phone Number",
    enter_amount: "Enter Amount (XAF)",
    deposit_now: "Deposit Now",
    withdraw_now: "Withdraw",
    transfer_now: "Transfer",
    enter_account_id: "Enter account ID",
    view_all_transactions: "View All Transactions",
    tap_see_history: "Tap to see your complete transaction history",
    hello_user: "Hello there, {name}!",

    // Errors / Alerts
    empty_feedback: "Please enter your feedback before submitting",
    rating_required: "Please select a star rating before submitting",
    thank_you_feedback: "Thank you! Your feedback has been submitted",
    failed_submit_feedback: "Failed to submit feedback",
    logout_confirm: "Are you sure you want to logout?",
    delete_account_confirm:
      "This will permanently delete your account and all your data. This action cannot be undone.",
    account_deleted: "Your account has been deleted",
    failed_delete_account: "Failed to delete account. Please try again",
    profile_picture_updated: "Profile picture updated!",
    uploading_picture: "Uploading profile picture...",
    points_conversion_needed: "Points conversion needs to be implemented",
    invalid_amount: "Please enter a valid number of points",
    points_multiples_10: "Points must be in multiples of 10",
    insufficient_points_amount: "You only have {points} points",
    conversion_successful: "Conversion Successful! 🎉",
    converted_points_to_coins:
      "You converted {points} points to {coins} coins!",
    copied_referral: "Referral code copied to clipboard",
    permission_camera: "Camera permission is required to take photos",
    permission_photos: "Photo library permission is required to select photos",
    error_picking_image: "Failed to pick image. Please try again",
    change_photo: "Change Profile Photo",
    take_photo: "Take Photo",
    choose_gallery: "Choose from Gallery",

    // Tournament Screen
    tournament_not_found: "Tournament not found",
    join_live_tournament: "Join the Live Tournament",
    entry_fee: "Entry Fee:",
    connected_players: "Connected Players",
    players_joined: "{count} joined",
    joined: "joined",
    time_left: "Time Left :",
    about_tournament: "About Tournament",
    playing: "Playing",
    waiting: "Waiting",

    // Match History Screen
    match_history_title: "Match History",
    daily_matches: "Daily Matches",
    tournament_match: "Tournament",
    vs: "vs",

    // Leaderboard Screen
    leaderboard_title: "Leaderboard",
    global_players_leaderboard: "Global players leaderboard",
    winners_circle: "WINNER'S CIRCLE",
    gamers_leaderboard: "Gamers Leaderboard",
    you: "(You)",
    wins: "wins",

    // Notifications Screen
    notifications_title: "Notifications",
    clear_all: "Clear all",
    bonus_available: "Bonus Available!",
    new_game_added: "New Game Added",
    maintenance_complete: "Maintenance Complete",
    weekend_special_notif: "Weekend Special",
    account_update: "Account Update",
    claim_now: "Claim now!",
    servers_back: "The servers are back online. Enjoy your games!",
    weekend_promo: "Get double rewards this weekend only",
    verified: "Your account has been verified successfully",
  },
  fr: {
    // Language Screen
    select_language: "Sélectionner la langue",
    language: "Langue",
    english: "Anglais",
    french: "Français",
    continue: "Continuer",
    current_language: "Langue actuelle",

    // Common
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    cancel: "Annuler",
    ok: "OK",
    save: "Enregistrer",
    delete: "Supprimer",
    edit: "Modifier",
    back: "Retour",
    next: "Suivant",
    done: "Terminé",
    search: "Rechercher",
    no_results: "Aucun résultat trouvé",
    retry: "Réessayer",

    // Auth - Login
    welcome_back: "Bon retour",
    login_subtitle: "Connectez-vous pour continuer",
    email: "Email",
    password: "Mot de passe",
    forgot_password: "Mot de passe oublié?",
    login: "Connexion",
    or_continue_with: "Ou continuer avec",
    dont_have_account: "Vous n'avez pas de compte?",
    sign_up: "S'inscrire",
    show_password: "Afficher le mot de passe",
    hide_password: "Masquer le mot de passe",

    // Auth - Signup
    create_account: "Créer un compte",
    signup_subtitle: "Rejoignez la communauté de jeux",
    username: "Nom d'utilisateur",
    confirm_password: "Confirmer",
    referral_code_optional: "Code (optionnel)",
    signup: "S'inscrire",
    already_have_account: "Vous avez déjà un compte?",
    login_here: "Se connecter ici",

    // Password Rules
    password_rules: "Le mot de passe doit contenir:",
    min_8_chars: "Au moins 8 caractères",
    uppercase: "Une lettre majuscule",
    lowercase: "Une lettre minuscule",
    number: "Un chiffre",
    special_char: "Un caractère spécial",

    // Onboarding
    welcome: "Bienvenue sur Skibag",
    get_started: "Commencer",
    skip: "Passer",
    onboarding_welcome_title: "Bienvenue sur Skibag",
    onboarding_welcome_desc:
      "Découvrez et rejoignez des millions de joueurs dans des batailles et des aventures épiques",
    onboarding_battles_title: "Batailles Épiques",
    onboarding_battles_desc:
      "Combattez des batailles d'arcade intenses et grimpez les classements",
    onboarding_rewards_title: "Gagnez des Récompenses",
    onboarding_rewards_desc:
      "Débloquez des niveaux exclusifs, des bonus, des skins et des réalisations",
    onboarding_ready_title: "Prêt à jouer?",
    onboarding_ready_desc:
      "Votre aventure de jeu commence maintenant! C'est temps pour l'aventure.",

    // Tab Navigation
    home: "Accueil",
    games: "Jeux",
    events: "Événements",
    wallet: "Portefeuille",
    profile: "Profil",

    // Home Screen
    featured_tournaments: "Tournois en vedette",
    live_matches: "Matchs en direct",
    upcoming_events: "Événements à venir",
    view_all: "Voir tout",
    no_tournaments: "Aucun tournoi disponible",
    no_live_matches: "Aucun match en direct",
    join_now: "Rejoindre maintenant",
    play_now: "Jouer maintenant",

    // Games Screen
    all_games: "Tous les jeux",
    popular: "Populaire",
    new_releases: "Nouveautés",
    categories: "Catégories",
    action: "Action",
    strategy: "Stratégie",
    puzzle: "Puzzle",
    racing: "Course",
    sports: "Sports",
    multiplayer: "Multijoueur",

    // Events Screen
    all_events: "Tous les événements",
    ongoing: "En cours",
    upcoming: "À venir",
    completed: "Terminé",
    event_details: "Détails de l'événement",
    register: "S'inscrire",
    registered: "Inscrit",
    participants: "Participants",
    prize_pool: "Prix",
    starts_in: "Commence dans",
    ends_in: "Finit dans",
    winner: "Gagnant",
    live_tournaments: "Tournois en direct",
    Events: "événements",
    player_bio:
      "Extrêmement confiant et compétent dans tous les jeux joués jusqu'ici",
    entry: "Entrée:",
    wins_label: "Victoires",
    loss_label: "Défaites",
    draws_label: "Matchs nuls",
    match_history_title: "Historique des matchs",

    // Wallet Screen
    my_wallet: "Mon portefeuille",
    balance: "Solde",
    points: "Points",
    add_points: "Ajouter des points",
    withdraw: "Retirer",
    transaction_history: "Historique des transactions",
    deposit: "Dépôt",
    no_transactions: "Aucune transaction",
    amount: "Montant",
    select_payment_method: "Choisir le mode de paiement",
    credit_card: "Carte de crédit",
    crypto: "Cryptomonnaie",
    processing: "Traitement...",
    transaction_success: "Transaction réussie!",
    transaction_failed: "Transaction échouée",

    // Profile Screen
    edit_profile: "Modifier le profil",
    settings: "Paramètres",
    my_referral_code: "Mon code de parrainage",
    share_code: "Partager le code",
    copy_code: "Copier le code",
    copied: "Copié!",
    referral_stats: "Stats de parrainage",
    total_referrals: "Total des parrainages",
    successful_referrals: "Parrainages réussis",
    pending_referrals: "Parrainages en attente",
    my_tournaments: "Mes tournois",
    achievements: "Réalisations",
    statistics: "Statistiques",
    win_rate: "Taux de victoire",
    total_games: "Total des jeux",
    total_wins: "Total des victoires",
    rank: "Rang",
    member_since: "Membre depuis",
    logout: "Déconnexion",
    confirm_logout: "Êtes-vous sûr de vouloir vous déconnecter?",
    yes: "Oui",
    no: "Non",
    change_language: "Changer de langue",
    notifications: "Notifications",
    privacy_policy: "Politique de confidentialité",
    terms_of_service: "Conditions d'utilisation",
    about: "À propos",
    version: "Version",

    // Leaderboard
    leaderboard: "Classement",
    weekly: "Hebdomadaire",
    monthly: "Mensuel",
    all_time: "Tout le temps",
    rank_label: "Rang",
    points_label: "Points",
    yourself: "Vous-même",

    // Match History
    match_history: "Historique des matchs",
    no_matches: "Aucun match",
    win: "Victoire",
    loss: "Défaite",
    draw: "Match nul",
    date: "Date",
    opponent: "Adversaire",
    result: "Résultat",
    score: "Score",
    tournament_name: "Tournoi",

    // Notifications
    no_notifications: "Aucune notification",
    mark_all_read: "Tout marquer comme lu",
    delete_all: "Tout supprimer",

    // Transactions
    transaction_details: "Détails de la transaction",
    transaction_id: "ID de transaction",
    status: "Statut",
    pending_status: "En attente",
    completed_status: "Terminé",
    failed_status: "Échoué",
    type: "Type",
    date_time: "Date et heure",
    all_transactions: "Toutes les transactions",
    xaf: "XAF",

    // Roulette
    roulette: "Roulette",
    spin: "Tourner",
    betting: "Paris",
    bet_amount: "Montant du pari",
    place_bet: "Placer le pari",
    winning_number: "Numéro gagnant",
    good_luck: "Bonne chance!",
    you_won: "Vous avez gagné!",
    try_again: "Réessayer",

    // Game Details
    game_details: "Détails du jeu",
    description: "Description",
    how_to_play: "Comment jouer",
    rules: "Règles",
    prizes: "Prix",
    join_tournament: "Rejoindre le tournoi",
    start_game: "Commencer le jeu",
    practice_mode: "Mode pratique",
    tournament_mode: "Mode tournoi",

    // Tournament
    tournament_details: "Détails du tournoi",
    tournament_info: "Info tournoi",
    format: "Format",
    schedule: "Calendrier",
    prizes_breakdown: "Répartition des prix",
    first_place: "1ère place",
    second_place: "2ème place",
    third_place: "3ème place",
    register_now: "S'inscrire maintenant",
    unregister: "Se désinscrire",
    spots_left: "places restantes",
    full: "Complet",
    bracket: "Tableau",
    rounds: "Manches",
    final: "Finale",
    semi_final: "Demi-finale",
    quarter_final: "Quart de finale",
    tournament_not_found: "Tournoi non trouvé",
    join_live_tournament: "Rejoindre le tournoi en direct",
    entry_fee: "Frais d'inscription:",
    connected_players: "Joueurs connectés",
    players_joined: "{count} inscrits",
    joined: "inscrits",
    time_left: "Temps restant :",
    about_tournament: "À propos du tournoi",
    playing: "En jeu",
    waiting: "En attente",

    // Passkey
    create_passkey: "Créer un passkey",
    verify_passkey: "Vérifier le passkey",
    passkey_instructions: "Suivez les instructions pour créer votre passkey",
    passkey_created: "Passkey créé avec succès!",
    passkey_verified: "Passkey vérifié!",
    use_passkey: "Utiliser le passkey pour se connecter",
    biometric_prompt: "Utiliser la biométrie pour vérifier",

    // Privacy & Terms
    privacy_policy_title: "Politique de confidentialité",
    terms_of_use_title: "Conditions d'utilisation",
    i_agree: "J'accepte le",
    and: "et",
    accept: "Accepter",
    decline: "Refuser",

    // Errors
    network_error: "Erreur réseau. Vérifiez votre connexion.",
    server_error: "Erreur serveur. Réessayez plus tard.",
    invalid_email: "Adresse email invalide",
    invalid_password: "Mot de passe invalide",
    passwords_dont_match: "Les mots de passe ne correspondent pas",
    passwords_match: "Les mots de passe correspondent",
    username_taken: "Nom d'utilisateur déjà pris",
    email_taken: "Email déjà enregistré",
    invalid_referral: "Code de parrainage invalide",
    self_referral: "Vous ne pouvez pas utiliser votre propre code",
    insufficient_points: "Points insuffisants",
    minimum_bet: "Le pari minimum est",
    maximum_bet: "Le pari maximum est",

    // Success Messages
    account_created: "Compte créé avec succès!",
    profile_updated: "Profil mis à jour!",
    points_added: "Points ajoutés!",
    referral_applied: "Code de parrainage appliqué!",

    // Additional Validation
    username_min_length:
      "Le nom d'utilisateur doit contenir au moins 3 caractères",
    password_requirements:
      "Le mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial",
    signup_error: "Une erreur s'est produite",
    google_signin_error: "Erreur de connexion Google",
    apple_signin_error: "Erreur de connexion Apple",

    // Profile Rewards
    rewards: "Récompenses",
    referral_points: "Points de parrainage",
    convert_points_to_coins: "Convertir les points en pièces",
    play_roulette_game: "Jouer à la roulette",
    earn_referral_points:
      "Gagnez 100 points par parrainage • 10 points = 1 pièce",

    // Profile General
    email_address: "Adresse email",
    no_email: "Pas d'email",

    // Profile Invite Friends
    invite_friends: "Inviter des amis",
    total: "Total",
    successful: "Réussis",
    pending: "En attente",
    share: "Partager",
    share_code_earn_rewards: "Partagez votre code pour gagner des récompenses!",

    // Profile Rate Us
    rate_us: "Nous noter",
    feedback: "Avis",
    enter_feedback: "Entrez votre avis",
    send_feedback: "Envoyer l'avis",
    submitting: "Envoi...",

    // Profile Account
    account: "Compte",
    delete_account: "Supprimer le compte",

    // Conversion Modal
    you_have_points: "Vous avez {points} points",
    conversion_info: "10 points = 1 pièce",
    enter_points_multiple_10: "Entrez les points (multiples de 10)",
    you_will_receive: "Vous recevrez: {coins} pièces",

    // Home Screen
    bonus_games: "Jeux bonus",
    all_games_desc:
      "Nous sommes fiers de tous nos jeux, vous pouvez les découvrir",
    special_offer: "Offre Spéciale",
    weekend_special: "Spécial Week-end",
    new_games: "Nouveaux Jeux",
    get_100_bonus: "Obtenez 100% de bonus sur votre premier dépôt",
    double_rewards: "Doublez vos récompenses ce week-end",
    try_latest: "Essayez nos dernières additions",
    promo: "PROMO",
    free_spin_available: "Tour gratuit disponible!",
    tap_to_claim: "Appuyez pour réclamer votre tour quotidien",

    // All Games Screen
    all_games_title: "Tous les jeux",
    games_available: "{count} jeux disponibles",
    category_all: "Tout",
    category_casino: "Casino",
    category_action: "Action",
    category_football: "Football",
    category_board: "Board",
    category_puzzles: "Puzzles",
    category_arcade: "Arcade",
    category_fighting: "Combat",
    category_adventure: "Aventure",

    // Game Detail Screen
    game_not_found: "Jeu non trouvé",
    go_back: "Retour",
    play_now_btn: "JOUER",
    about_game: "À propos du jeu",
    top_players: "Meilleurs joueurs",
    see_all: "Voir tout",
    downloads: "10K+",
    playtime: "Action",
    device: "Mobile",

    // Deposit Modal (new keys)
    deposit_modal_title: "Dépôt",
    payment_method: "Mode de paiement",
    mtn: "MTN",
    orange: "Orange",
    phone_number: "Numéro de téléphone",
    enter_amount: "Entrer le montant (XAF)",
    deposit_now: "Déposer maintenant",
    withdraw_now: "Retirer",
    transfer_now: "Transférer",
    enter_account_id: "Entrer l'ID du compte",
    view_all_transactions: "Voir toutes les transactions",
    tap_see_history: "Appuyez pour voir votre historique complet",
    hello_user: "Bonjour {name} !",

    // Wallet specific
    quick_actions: "Actions rapides",
    available_balance: "Solde disponible",
    account_id: "ID du compte",
    bonus: "Bonus",
    valid_thru: "Valide jusqu'au",
    recent_transactions: "Transactions récentes",
    history: "Historique",
    transfer: "Transfert",

    // Errors / Alerts
    empty_feedback: "Veuillez entrer votre avis avant de soumettre",
    rating_required: "Veuillez sélectionner une note avant de soumettre",
    thank_you_feedback: "Merci! Votre avis a été soumis",
    failed_submit_feedback: "Échec de l'envoi de l'avis",
    logout_confirm: "Êtes-vous sûr de vouloir vous déconnecter?",
    delete_account_confirm:
      "Cela supprimera définitivement votre compte et toutes vos données. Cette action est irréversible.",
    account_deleted: "Votre compte a été supprimé",
    failed_delete_account:
      "Échec de la suppression du compte. Veuillez réessayer",
    profile_picture_updated: "Photo de profil mise à jour!",
    uploading_picture: "Téléchargement de la photo de profil...",
    points_conversion_needed: "La conversion des points doit être implémentée",
    invalid_amount: "Veuillez entrer un nombre de points valide",
    points_multiples_10: "Les points doivent être des multiples de 10",
    insufficient_points_amount: "Vous n'avez que {points} points",
    conversion_successful: "Conversion réussie! 🎉",
    converted_points_to_coins:
      "Vous avez converti {points} points en {coins} pièces!",
    copied_referral: "Code de parrainage copié dans le presse-papiers",
    permission_camera: "L'accès à la caméra est requis pour prendre des photos",
    permission_photos:
      "L'accès à la bibliothèque de photos est requis pour sélectionner des photos",
    error_picking_image: "Échec de la sélection de l'image. Veuillez réessayer",
    change_photo: "Changer la photo de profil",
    take_photo: "Prendre une photo",
    choose_gallery: "Choisir dans la galerie",
  },
};

// Context type
interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

// Create context with default values
const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
  isLoading: true,
});

// Provider component
export const I18nProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Try to get stored language
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

        if (storedLanguage && translations[storedLanguage]) {
          setLanguageState(storedLanguage);
        } else {
          // Fall back to device language
          const deviceLanguage =
            Localization.getLocales()[0]?.languageCode || "en";
          if (translations[deviceLanguage]) {
            setLanguageState(deviceLanguage);
          }
        }
      } catch (error) {
        console.log("Using default language (AsyncStorage not available)");
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  // Change language and persist
  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      // Try to persist (silently fail in web environments)
      AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang).catch(() => {
        // AsyncStorage not available - language will reset on reload
      });
    }
  };

  // Translation function
  const t = (key: string): string => {
    const langTranslations = translations[language] || translations.en;
    return langTranslations[key] || translations.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use translations
export const useTranslation = (): I18nContextType => {
  return useContext(I18nContext);
};
