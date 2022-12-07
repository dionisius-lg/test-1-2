-- test soal 1

CREATE TABLE `users` (
  `kduser` varchar(50) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `hakakses` varchar(20) DEFAULT NULL,
  `kdklinik` varchar(10) DEFAULT NULL,
  `kdcabang` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`kduser`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;