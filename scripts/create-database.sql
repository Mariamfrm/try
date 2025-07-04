-- Création des tables pour Supabase
-- Table filiere
CREATE TABLE IF NOT EXISTS filiere (
  id SERIAL PRIMARY KEY,
  nom_filiere VARCHAR(50) NOT NULL,
  niveau VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table stagiaire
CREATE TABLE IF NOT EXISTS stagiaire (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  civilite VARCHAR(1) NOT NULL CHECK (civilite IN ('M', 'F')),
  photo VARCHAR(100),
  id_filiere INTEGER NOT NULL REFERENCES filiere(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table utilisateur
CREATE TABLE IF NOT EXISTS utilisateur (
  id SERIAL PRIMARY KEY,
  login VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  pwd VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'VISITEUR' CHECK (role IN ('ADMIN', 'VISITEUR')),
  etat BOOLEAN NOT NULL DEFAULT true,
  avatar VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_stagiaire_filiere ON stagiaire(id_filiere);
CREATE INDEX IF NOT EXISTS idx_utilisateur_login ON utilisateur(login);
CREATE INDEX IF NOT EXISTS idx_utilisateur_role ON utilisateur(role);
