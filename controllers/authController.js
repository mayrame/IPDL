const User = require("../models/user");
const passport = require("passport");

module.exports = {
  // Affiche le formulaire de connexion
  login: (req, res) => {
    res.render("auth/login");
  },

  // Gère l'authentification des utilisateurs
  authenticate: passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Votre email ou mot de passe est incorrect.",
    successRedirect: "/",
    successFlash: "Vous êtes maintenant connecté!"
  }),

  // Déconnecte l'utilisateur
  logout: (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash("success", "Vous avez été déconnecté avec succès!");
      res.locals.redirect = "/";
      next();
    });
  },

  // Affiche le formulaire d'inscription
  signup: (req, res) => {
    res.render("auth/signup");
  },

  // Crée un nouvel utilisateur et l'authentifie
  register: (req, res, next) => {
    if (req.skip) return next();

    let newUser = new User({
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      zipCode: req.body.zipCode
    });

    User.register(newUser, req.body.password, (error, user) => {
        if (error) {
          console.error("Registration error details:", error); // Log l'erreur complète
          req.flash("error", `Échec de la création du compte: ${error.message}`);
          res.locals.redirect = "/signup";
          return next();
        }
        req.flash("success", `Bienvenue ${user.fullName} !`);
        res.locals.redirect = "/";
        next();
      });
    },
  // Middleware pour vérifier si l'utilisateur est connecté
  ensureLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash("error", "Vous devez être connecté pour accéder à cette page.");
      res.redirect("/login");
    }
  }
};
