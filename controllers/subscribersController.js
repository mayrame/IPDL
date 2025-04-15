const mongoose = require("mongoose");
const Subscriber = require("../models/subscriber");

// Récupère tous les abonnés
exports.getAllSubscribers = async (req, res) => {
    try {
        res.render("subscribers/index", {
            pageTitle: "Liste des abonnés",
            subscribers: await Subscriber.find({}),
            searchQuery: {}
        });
    } catch (error) {
        console.log(`Erreur : ${error.message}`);
        res.redirect("/");
    }
};

// Affiche le formulaire d'inscription
exports.getSubscriptionPage = (req, res) => {
    res.render("subscribers/new", {
        pageTitle: "Nouvel abonné",
        errors: [], // Toujours initialiser errors
        formData: {} // Initialiser formData
    });
};
// Enregistre un nouvel abonné (avec validation)
exports.saveSubscriber = async (req, res) => {
    const { name, email, zipCode } = req.body;
    const errors = [];
    const formData = { name, email, zipCode };

    // Validation
    if (!name || name.trim().length < 2) {
        errors.push("Le nom doit contenir au moins 2 caractères");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Veuillez entrer un email valide");
    }

    if (!zipCode || !/^\d{5}$/.test(zipCode)) {
        errors.push("Le code postal doit contenir exactement 5 chiffres");
    }

    if (errors.length > 0) {
        return res.render("subscribers/new", {
            pageTitle: "Nouvel abonné",
            errors,
            formData
        });
    }

    // Enregistrement
    try {
        const newSubscriber = new Subscriber({
            name: name.trim(),
            email: email.toLowerCase(),
            zipCode
        });

        await newSubscriber.save();
        res.render("subscribers/thanks", {
            pageTitle: "Merci pour votre inscription"
        });
    } catch (error) {
        if (error.code === 11000) {
            errors.push("Cet email est déjà inscrit");
        } else {
            errors.push("Une erreur est survenue");
            console.error("Erreur MongoDB:", error.message);
        }

        res.render("subscribers/new", {
            pageTitle: "Nouvel abonné",
            errors,
            formData
        });
    }
};

// Affiche les détails d'un abonné
exports.show = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).render("error", {
                pageTitle: "Erreur",
                message: "ID invalide"
            });
        }

        const subscriber = await Subscriber.findById(req.params.id);
        if (!subscriber) {
            return res.status(404).render("error", {
                pageTitle: "Non trouvé",
                message: "Abonné introuvable"
            });
        }

        res.render("subscribers/show", {
            pageTitle: "Détails abonné",
            subscriber
        });
    } catch (error) {
        console.log(`Erreur : ${error.message}`);
        next(error);
    }
};

// Supprime un abonné
exports.deleteSubscriber = async (req, res) => {
    try {
        await Subscriber.findByIdAndDelete(req.params.id);
        res.redirect("/subscribers");
    } catch (error) {
        console.log(`Erreur suppression : ${error.message}`);
        res.redirect("/subscribers");
    }
};

// Affiche le formulaire d'édition
exports.editSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);
        res.render("subscribers/edit", {
            pageTitle: "Modifier abonné",
            subscriber
        });
    } catch (error) {
        console.log(`Erreur : ${error.message}`);
        res.redirect("/subscribers");
    }
};

// Met à jour un abonné
exports.updateSubscriber = async (req, res) => {
    try {
        await Subscriber.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name.trim(),
                email: req.body.email.toLowerCase(),
                zipCode: req.body.zipCode
            },
            { runValidators: true }
        );
        res.redirect(`/subscribers/${req.params.id}`);
    } catch (error) {
        console.log(`Erreur : ${error.message}`);
        res.redirect(`/subscribers/${req.params.id}/edit`);
    }
};

// Recherche d'abonnés
exports.searchSubscribers = async (req, res) => {
    try {
        const query = {};
        if (req.query.name) query.name = { $regex: req.query.name, $options: "i" };
        if (req.query.zipCode) query.zipCode = req.query.zipCode;

        res.render("subscribers/index", {
            pageTitle: "Résultats de recherche",
            subscribers: await Subscriber.find(query),
            searchQuery: req.query
        });
    } catch (error) {
        console.log(`Erreur recherche : ${error.message}`);
        res.redirect("/subscribers");
    }
};