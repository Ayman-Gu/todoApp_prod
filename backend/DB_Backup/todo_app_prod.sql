-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306:3306
-- Généré le : ven. 06 juin 2025 à 20:52
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `todo_app_prod`
--

-- --------------------------------------------------------

--
-- Structure de la table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(255) NOT NULL,
  `id_task` int(255) NOT NULL,
  `creation_date` datetime DEFAULT NULL,
  `validation_date` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tasks`
--

INSERT INTO `tasks` (`id`, `id_task`, `creation_date`, `validation_date`, `description`, `completed`, `title`) VALUES
(35, 35, '2025-06-06 12:31:02', '2025-06-06 12:31:30', '2\n', 1, 'test 455'),
(36, 36, '2025-06-06 12:50:38', '2025-06-06 13:17:29', 'dsd', 1, 'heydd'),
(37, 37, '2025-06-06 14:48:38', '2025-06-06 14:49:23', 'new task desc', 1, 'test');

--
-- Déclencheurs `tasks`
--
DELIMITER $$
CREATE TRIGGER `before_insert_add_hour` BEFORE INSERT ON `tasks` FOR EACH ROW BEGIN
  SET NEW.creation_date = DATE_ADD(NEW.creation_date, INTERVAL 1 HOUR);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `set_idTask_ON_Insert` BEFORE INSERT ON `tasks` FOR EACH ROW BEGIN
    DECLARE next_id INT;
    SELECT AUTO_INCREMENT INTO next_id FROM information_schema.tables WHERE table_name = 'tasks' AND table_schema = DATABASE();
    SET NEW.id_task = next_id;
END
$$
DELIMITER ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_task` (`id_task`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
