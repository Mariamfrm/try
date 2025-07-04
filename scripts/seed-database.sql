-- Insertion des données de démonstration

-- Insertion des filières
INSERT INTO filiere (nom_filiere, niveau) VALUES
('Développement Digital', 'Technicien Spécialisé'),
('Développement Web', 'Technicien'),
('Réseaux Informatiques', 'Technicien Spécialisé'),
('Systèmes et Réseaux', 'Technicien'),
('Cybersécurité', 'Technicien Spécialisé'),
('Data Science', 'Technicien Spécialisé'),
('Intelligence Artificielle', 'Technicien Spécialisé'),
('Maintenance Informatique', 'Qualification')
ON CONFLICT DO NOTHING;

-- Insertion des stagiaires
INSERT INTO stagiaire (nom, prenom, civilite, photo, id_filiere) VALUES
('Alaoui', 'Fatima', 'F', 'img1.jpg', 1),
('Bennani', 'Amal', 'F', 'img2.jpg', 1),
('Chaoui', 'Samira', 'F', 'img5.jpg', 2),
('Daoudi', 'Leila', 'F', 'img4.jpg', 2),
('El Fassi', 'Karim', 'M', 'img3.jpg', 3),
('Fathi', 'Sanaa', 'F', 'img6.jpg', 3),
('Ghali', 'Nadia', 'F', 'img7.jpg', 4),
('Hassani', 'Amina', 'F', 'img8.jpg', 4),
('Dupont', 'Marie', 'F', 'img1.jpg', 1),
('Martin', 'Pierre', 'M', 'img3.jpg', 2),
('Bernard', 'Sophie', 'F', 'img2.jpg', 1),
('Dubois', 'Jean', 'M', 'img3.jpg', 3),
('Moreau', 'Emma', 'F', 'img4.jpg', 5)
ON CONFLICT DO NOTHING;

-- Insertion des utilisateurs (mot de passe '123' en MD5: 202cb962ac59075b964b07152d234b70)
INSERT INTO utilisateur (login, email, pwd, role, etat, avatar) VALUES
('admin', 'admin@example.com', '202cb962ac59075b964b07152d234b70', 'ADMIN', true, 'img3.jpg'),
('visiteur', 'visiteur@example.com', '202cb962ac59075b964b07152d234b70', 'VISITEUR', true, 'img6.jpg'),
('marie.dupont', 'marie.dupont@example.com', '202cb962ac59075b964b07152d234b70', 'VISITEUR', true, 'img2.jpg'),
('jean.martin', 'jean.martin@example.com', '202cb962ac59075b964b07152d234b70', 'VISITEUR', false, 'img3.jpg'),
('sophie.bernard', 'sophie.bernard@example.com', '202cb962ac59075b964b07152d234b70', 'ADMIN', true, 'img4.jpg')
ON CONFLICT (login) DO NOTHING;
