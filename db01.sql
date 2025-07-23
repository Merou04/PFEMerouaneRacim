-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2025 at 11:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db01`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendancerecordinfo`
--

CREATE TABLE `attendancerecordinfo` (
  `id` int(11) NOT NULL,
  `PersonID` varchar(30) NOT NULL,
  `PersonName` varchar(36) DEFAULT NULL,
  `PerSonCardNo` varchar(20) DEFAULT NULL,
  `AttendanceDateTime` bigint(20) NOT NULL,
  `AttendanceState` int(11) NOT NULL,
  `AttendanceMethod` int(11) NOT NULL,
  `DeviceIPAddress` varchar(20) DEFAULT NULL,
  `DeviceName` varchar(50) DEFAULT NULL,
  `SnapshotsPath` varchar(200) DEFAULT '',
  `Handler` varchar(50) DEFAULT '',
  `AttendanceUtcTime` bigint(20) DEFAULT 0,
  `Remarks` varchar(256) DEFAULT NULL,
  `processed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendancerecordinfo`
--

INSERT INTO `attendancerecordinfo` (`id`, `PersonID`, `PersonName`, `PerSonCardNo`, `AttendanceDateTime`, `AttendanceState`, `AttendanceMethod`, `DeviceIPAddress`, `DeviceName`, `SnapshotsPath`, `Handler`, `AttendanceUtcTime`, `Remarks`, `processed`) VALUES
(531, 'l2info008', 'Nabil Guedira', 'ETU208', 1749192000000, 0, 1, '192.168.1.191', 'Scanner 5', '/snapshots/img_7763.jpg', 'System', 1749195600000, 'Generated record ', 0),
(532, 'l2info004', 'Sofiane Merabet', 'ETU204', 1748674260000, 1, 1, '192.168.1.242', 'Scanner 4', '/snapshots/img_9839.jpg', 'System', 1748677860000, 'Generated record ', 0);

-- --------------------------------------------------------

--
-- Table structure for table `classe`
--

CREATE TABLE `classe` (
  `id` int(11) NOT NULL,
  `idclasse` varchar(50) NOT NULL,
  `idfiliere` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classe`
--

INSERT INTO `classe` (`id`, `idclasse`, `idfiliere`) VALUES
(1, 'l1info', 'info'),
(2, 'l2info', 'info'),
(3, 'l3info', 'info'),
(4, 'l1elec', 'elec'),
(5, 'l2elec', 'elec'),
(6, 'l3elec', 'elec'),
(7, 'l1chim', 'chim'),
(8, 'l2chim', 'chim'),
(9, 'l3chim', 'chim');

-- --------------------------------------------------------

--
-- Table structure for table `edt`
--

CREATE TABLE `edt` (
  `id` int(11) NOT NULL,
  `idmodule` varchar(50) NOT NULL,
  `idgroupe` varchar(50) NOT NULL,
  `jour_semaine` enum('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche') NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `edt`
--

INSERT INTO `edt` (`id`, `idmodule`, `idgroupe`, `jour_semaine`, `heure_debut`, `heure_fin`) VALUES
(84, 'm03l2info', 'g1sec1l2info', 'Dimanche', '08:15:00', '09:45:00'),
(85, 'm03l2info', 'g1sec1l2info', 'Dimanche', '10:00:00', '11:30:00'),
(86, 'm08l2info', 'g1sec1l2info', 'Dimanche', '13:00:00', '14:30:00'),
(87, 'm08l2info', 'g1sec1l2info', 'Dimanche', '14:45:00', '16:15:00'),
(88, 'm03l2info', 'g2sec1l2info', 'Dimanche', '08:15:00', '09:45:00'),
(89, 'm03l2info', 'g2sec1l2info', 'Dimanche', '10:00:00', '11:30:00'),
(90, 'm08l2info', 'g2sec1l2info', 'Dimanche', '13:00:00', '14:30:00'),
(91, 'm08l2info', 'g2sec1l2info', 'Dimanche', '14:45:00', '16:15:00'),
(92, 'm04l2info', 'g1sec1l2info', 'Lundi', '08:15:00', '09:45:00'),
(93, 'm04l2info', 'g1sec1l2info', 'Lundi', '10:00:00', '11:30:00'),
(94, 'm09l2info', 'g1sec1l2info', 'Lundi', '13:00:00', '14:30:00'),
(95, 'm04l2info', 'g2sec1l2info', 'Lundi', '08:15:00', '09:45:00'),
(96, 'm04l2info', 'g2sec1l2info', 'Lundi', '10:00:00', '11:30:00'),
(97, 'm09l2info', 'g2sec1l2info', 'Lundi', '13:00:00', '14:30:00'),
(98, 'm05l2info', 'g1sec1l2info', 'Mardi', '08:15:00', '09:45:00'),
(99, 'm05l2info', 'g1sec1l2info', 'Mardi', '13:00:00', '14:30:00'),
(100, 'm05l2info', 'g2sec1l2info', 'Mardi', '08:15:00', '09:45:00'),
(101, 'm05l2info', 'g2sec1l2info', 'Mardi', '13:00:00', '14:30:00'),
(102, 'm06l2info', 'g1sec1l2info', 'Mercredi', '08:15:00', '09:45:00'),
(103, 'm06l2info', 'g1sec1l2info', 'Mercredi', '10:00:00', '11:30:00'),
(104, 'm06l2info', 'g2sec1l2info', 'Mercredi', '08:15:00', '09:45:00'),
(105, 'm06l2info', 'g2sec1l2info', 'Mercredi', '10:00:00', '11:30:00'),
(106, 'm07l2info', 'g1sec1l2info', 'Jeudi', '08:15:00', '09:45:00'),
(107, 'm07l2info', 'g1sec1l2info', 'Jeudi', '10:00:00', '11:30:00'),
(108, 'm08l2info', 'g1sec1l2info', 'Jeudi', '13:00:00', '14:30:00'),
(109, 'm05l2info', 'g1sec1l2info', 'Jeudi', '14:45:00', '16:15:00'),
(110, 'm07l2info', 'g2sec1l2info', 'Jeudi', '08:15:00', '09:45:00'),
(111, 'm07l2info', 'g2sec1l2info', 'Jeudi', '10:00:00', '11:30:00'),
(112, 'm08l2info', 'g2sec1l2info', 'Jeudi', '13:00:00', '14:30:00'),
(113, 'm05l2info', 'g2sec1l2info', 'Jeudi', '14:45:00', '16:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `etudiant`
--

CREATE TABLE `etudiant` (
  `id` int(11) NOT NULL,
  `idetu` varchar(50) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `numcarteetu` varchar(50) NOT NULL,
  `idfiliere` varchar(10) NOT NULL,
  `idclasse` varchar(50) NOT NULL,
  `idsection` varchar(50) NOT NULL,
  `idgroupe` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `etudiant`
--

INSERT INTO `etudiant` (`id`, `idetu`, `nom`, `prenom`, `numcarteetu`, `idfiliere`, `idclasse`, `idsection`, `idgroupe`) VALUES
(23, 'l2info001', 'Bennani', 'Yasmine', 'ETU201', 'info', 'l2info', 'sec1l2info', 'g1sec1l2info'),
(24, 'l2info002', 'Saidi', 'Walid', 'ETU202', 'info', 'l2info', 'sec1l2info', 'g1sec1l2info'),
(25, 'l2info003', 'Zeroual', 'Nour', 'ETU203', 'info', 'l2info', 'sec1l2info', 'g1sec1l2info'),
(26, 'l2info004', 'Merabet', 'Sofiane', 'ETU204', 'info', 'l2info', 'sec1l2info', 'g1sec1l2info'),
(27, 'l2info005', 'Kaci', 'Sara', 'ETU205', 'info', 'l2info', 'sec1l2info', 'g2sec1l2info'),
(28, 'l2info006', 'Belkacem', 'Rami', 'ETU206', 'info', 'l2info', 'sec1l2info', 'g2sec1l2info'),
(29, 'l2info007', 'Bachir', 'Lina', 'ETU207', 'info', 'l2info', 'sec1l2info', 'g2sec1l2info'),
(30, 'l2info008', 'Guedira', 'Nabil', 'ETU208', 'info', 'l2info', 'sec1l2info', 'g2sec1l2info');

-- --------------------------------------------------------

--
-- Table structure for table `filiere`
--

CREATE TABLE `filiere` (
  `id` int(11) NOT NULL,
  `idfiliere` varchar(10) NOT NULL,
  `nom` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `filiere`
--

INSERT INTO `filiere` (`id`, `idfiliere`, `nom`) VALUES
(1, 'info', 'informatique'),
(2, 'elec', 'electronique'),
(3, 'chim', 'chimie');

-- --------------------------------------------------------

--
-- Table structure for table `groupe`
--

CREATE TABLE `groupe` (
  `id` int(11) NOT NULL,
  `idgroupe` varchar(50) NOT NULL,
  `idsection` varchar(50) NOT NULL,
  `idclasse` varchar(50) NOT NULL,
  `idfiliere` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groupe`
--

INSERT INTO `groupe` (`id`, `idgroupe`, `idsection`, `idclasse`, `idfiliere`) VALUES
(1, 'g1sec1l1info', 'sec1l1info', 'l1info', 'info'),
(2, 'g1sec1l2info', 'sec1l2info', 'l2info', 'info'),
(3, 'g1sec1l3info', 'sec1l3info', 'l3info', 'info'),
(4, 'g1sec1l1elec', 'sec1l1elec', 'l1elec', 'elec'),
(5, 'g1sec1l2elec', 'sec1l2elec', 'l2elec', 'elec'),
(6, 'g1sec1l3elec', 'sec1l3elec', 'l3elec', 'elec'),
(7, 'g1sec1l1chim', 'sec1l1chim', 'l1chim', 'chim'),
(8, 'g1sec1l2chim', 'sec1l2chim', 'l2chim', 'chim'),
(9, 'g1sec1l3chim', 'sec1l3chim', 'l3chim', 'chim'),
(10, 'g2sec1l2info', 'sec1l2info', 'l2info', 'info');

-- --------------------------------------------------------

--
-- Table structure for table `module`
--

CREATE TABLE `module` (
  `id` int(11) NOT NULL,
  `idmodule` varchar(50) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `idfiliere` varchar(10) NOT NULL,
  `idclasse` varchar(50) NOT NULL,
  `idprof` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `module`
--

INSERT INTO `module` (`id`, `idmodule`, `nom`, `idfiliere`, `idclasse`, `idprof`) VALUES
(1, 'm01l1info', 'Algorithmique 1', 'info', 'l1info', 'P001'),
(2, 'm02l1info', 'Introduction à la programmation', 'info', 'l1info', 'P002'),
(3, 'm01l2info', 'Structures de données', 'info', 'l2info', 'P003'),
(4, 'm02l2info', 'Programmation orientée objet', 'info', 'l2info', 'P001'),
(5, 'm01l3info', 'Base de données', 'info', 'l3info', 'P002'),
(6, 'm02l3info', 'Réseaux', 'info', 'l3info', 'P003'),
(7, 'm01l1elec', 'Circuits électriques', 'elec', 'l1elec', 'P004'),
(8, 'm02l1elec', 'Électronique de base', 'elec', 'l1elec', 'P005'),
(9, 'm01l2elec', 'Électronique analogique', 'elec', 'l2elec', 'P006'),
(10, 'm02l2elec', 'Électromagnétisme', 'elec', 'l2elec', 'P004'),
(11, 'm01l3elec', 'Microcontrôleurs', 'elec', 'l3elec', 'P005'),
(12, 'm02l3elec', 'Automatique', 'elec', 'l3elec', 'P006'),
(13, 'm01l1chim', 'Chimie générale', 'chim', 'l1chim', 'P007'),
(14, 'm02l1chim', 'Chimie organique 1', 'chim', 'l1chim', 'P008'),
(15, 'm01l2chim', 'Chimie analytique', 'chim', 'l2chim', 'P009'),
(16, 'm02l2chim', 'Chimie organique 2', 'chim', 'l2chim', 'P007'),
(17, 'm01l3chim', 'Biochimie', 'chim', 'l3chim', 'P008'),
(18, 'm02l3chim', 'Chimie des matériaux', 'chim', 'l3chim', 'P009'),
(19, 'm03l2info', 'Méthodes Numériques', 'info', 'l2info', 'P001'),
(20, 'm04l2info', 'Anglais', 'info', 'l2info', 'P002'),
(21, 'm05l2info', 'Algorithmique et Structures de Données 3', 'info', 'l2info', 'P003'),
(22, 'm06l2info', 'Logique Mathématique', 'info', 'l2info', 'P004'),
(23, 'm07l2info', 'Théorie des Graphes', 'info', 'l2info', 'P005'),
(24, 'm08l2info', 'Architecture des Ordinateurs', 'info', 'l2info', 'P006'),
(25, 'm09l2info', 'Systèmes d\'Information', 'info', 'l2info', 'P007');

-- --------------------------------------------------------

--
-- Table structure for table `presences`
--

CREATE TABLE `presences` (
  `id` int(11) NOT NULL,
  `idetu` varchar(50) NOT NULL,
  `idmodule` varchar(50) NOT NULL,
  `date_presence` timestamp NOT NULL DEFAULT current_timestamp(),
  `statut` enum('0','1','2') NOT NULL COMMENT '0:présent, 1:retard, 2:absent'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prof`
--

CREATE TABLE `prof` (
  `id` int(11) NOT NULL,
  `idprof` varchar(50) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `numcarteprof` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prof`
--

INSERT INTO `prof` (`id`, `idprof`, `nom`, `prenom`, `numcarteprof`) VALUES
(1, 'P001', 'Dupont', 'Jean', 'PROF001'),
(2, 'P002', 'Martin', 'Sophie', 'PROF002'),
(3, 'P003', 'Dubois', 'Philippe', 'PROF003'),
(4, 'P004', 'Leroy', 'Marie', 'PROF004'),
(5, 'P005', 'Moreau', 'Pierre', 'PROF005'),
(6, 'P006', 'Petit', 'Claire', 'PROF006'),
(7, 'P007', 'Roux', 'Patrick', 'PROF007'),
(8, 'P008', 'Durand', 'Nathalie', 'PROF008'),
(9, 'P009', 'Lefebvre', 'Thomas', 'PROF009');

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `id` int(11) NOT NULL,
  `idsection` varchar(50) NOT NULL,
  `idclasse` varchar(50) NOT NULL,
  `idfiliere` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`id`, `idsection`, `idclasse`, `idfiliere`) VALUES
(1, 'sec1l1info', 'l1info', 'info'),
(2, 'sec1l2info', 'l2info', 'info'),
(3, 'sec1l3info', 'l3info', 'info'),
(4, 'sec1l1elec', 'l1elec', 'elec'),
(5, 'sec1l2elec', 'l2elec', 'elec'),
(6, 'sec1l3elec', 'l3elec', 'elec'),
(7, 'sec1l1chim', 'l1chim', 'chim'),
(8, 'sec1l2chim', 'l2chim', 'chim'),
(9, 'sec1l3chim', 'l3chim', 'chim');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendancerecordinfo`
--
ALTER TABLE `attendancerecordinfo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `PersonID` (`PersonID`,`AttendanceDateTime`);

--
-- Indexes for table `classe`
--
ALTER TABLE `classe`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idclasse` (`idclasse`),
  ADD KEY `idfiliere` (`idfiliere`);

--
-- Indexes for table `edt`
--
ALTER TABLE `edt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idmodule` (`idmodule`),
  ADD KEY `idgroupe` (`idgroupe`);

--
-- Indexes for table `etudiant`
--
ALTER TABLE `etudiant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idetu` (`idetu`),
  ADD KEY `idfiliere` (`idfiliere`),
  ADD KEY `idclasse` (`idclasse`),
  ADD KEY `idsection` (`idsection`),
  ADD KEY `idgroupe` (`idgroupe`);

--
-- Indexes for table `filiere`
--
ALTER TABLE `filiere`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idfiliere` (`idfiliere`);

--
-- Indexes for table `groupe`
--
ALTER TABLE `groupe`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idgroupe` (`idgroupe`),
  ADD KEY `idsection` (`idsection`),
  ADD KEY `idclasse` (`idclasse`),
  ADD KEY `idfiliere` (`idfiliere`);

--
-- Indexes for table `module`
--
ALTER TABLE `module`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idmodule` (`idmodule`),
  ADD KEY `idfiliere` (`idfiliere`),
  ADD KEY `idclasse` (`idclasse`),
  ADD KEY `idprof` (`idprof`);

--
-- Indexes for table `presences`
--
ALTER TABLE `presences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idetu` (`idetu`),
  ADD KEY `idmodule` (`idmodule`);

--
-- Indexes for table `prof`
--
ALTER TABLE `prof`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idprof` (`idprof`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idsection` (`idsection`),
  ADD KEY `idclasse` (`idclasse`),
  ADD KEY `idfiliere` (`idfiliere`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendancerecordinfo`
--
ALTER TABLE `attendancerecordinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=533;

--
-- AUTO_INCREMENT for table `classe`
--
ALTER TABLE `classe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `edt`
--
ALTER TABLE `edt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `etudiant`
--
ALTER TABLE `etudiant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `filiere`
--
ALTER TABLE `filiere`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `groupe`
--
ALTER TABLE `groupe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `module`
--
ALTER TABLE `module`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `presences`
--
ALTER TABLE `presences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=392;

--
-- AUTO_INCREMENT for table `prof`
--
ALTER TABLE `prof`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `classe`
--
ALTER TABLE `classe`
  ADD CONSTRAINT `classe_ibfk_1` FOREIGN KEY (`idfiliere`) REFERENCES `filiere` (`idfiliere`);

--
-- Constraints for table `edt`
--
ALTER TABLE `edt`
  ADD CONSTRAINT `edt_ibfk_1` FOREIGN KEY (`idmodule`) REFERENCES `module` (`idmodule`),
  ADD CONSTRAINT `edt_ibfk_2` FOREIGN KEY (`idgroupe`) REFERENCES `groupe` (`idgroupe`);

--
-- Constraints for table `etudiant`
--
ALTER TABLE `etudiant`
  ADD CONSTRAINT `etudiant_ibfk_1` FOREIGN KEY (`idfiliere`) REFERENCES `filiere` (`idfiliere`),
  ADD CONSTRAINT `etudiant_ibfk_2` FOREIGN KEY (`idclasse`) REFERENCES `classe` (`idclasse`),
  ADD CONSTRAINT `etudiant_ibfk_3` FOREIGN KEY (`idsection`) REFERENCES `section` (`idsection`),
  ADD CONSTRAINT `etudiant_ibfk_4` FOREIGN KEY (`idgroupe`) REFERENCES `groupe` (`idgroupe`);

--
-- Constraints for table `groupe`
--
ALTER TABLE `groupe`
  ADD CONSTRAINT `groupe_ibfk_1` FOREIGN KEY (`idsection`) REFERENCES `section` (`idsection`),
  ADD CONSTRAINT `groupe_ibfk_2` FOREIGN KEY (`idclasse`) REFERENCES `classe` (`idclasse`),
  ADD CONSTRAINT `groupe_ibfk_3` FOREIGN KEY (`idfiliere`) REFERENCES `filiere` (`idfiliere`);

--
-- Constraints for table `module`
--
ALTER TABLE `module`
  ADD CONSTRAINT `module_ibfk_1` FOREIGN KEY (`idfiliere`) REFERENCES `filiere` (`idfiliere`),
  ADD CONSTRAINT `module_ibfk_2` FOREIGN KEY (`idclasse`) REFERENCES `classe` (`idclasse`),
  ADD CONSTRAINT `module_ibfk_3` FOREIGN KEY (`idprof`) REFERENCES `prof` (`idprof`);

--
-- Constraints for table `presences`
--
ALTER TABLE `presences`
  ADD CONSTRAINT `presences_ibfk_1` FOREIGN KEY (`idetu`) REFERENCES `etudiant` (`idetu`),
  ADD CONSTRAINT `presences_ibfk_2` FOREIGN KEY (`idmodule`) REFERENCES `module` (`idmodule`);

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `section_ibfk_1` FOREIGN KEY (`idclasse`) REFERENCES `classe` (`idclasse`),
  ADD CONSTRAINT `section_ibfk_2` FOREIGN KEY (`idfiliere`) REFERENCES `filiere` (`idfiliere`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
