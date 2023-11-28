-- -----------------------------------------------------
-- Table `sakila`.`CATEGORIAS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CATEGORIAS` (
  `id` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sakila`.`PRODUCTOS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PRODUCTOS` (
  `id` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  `descripcion` VARCHAR(45) NULL,
  `foto` VARCHAR(45) NULL,
  `stock` INT(10) NULL,
  `precio` DOUBLE NULL,
  `CATEGORIAS_id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sakila`.`CLIENTES`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CLIENTES` (
  `id` INT NOT NULL,
  `razonsocial` VARCHAR(45) NULL,
  `documento` VARCHAR(45) NULL,
  `direccion` VARCHAR(45) NULL,
  `celular` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sakila`.`VENDEDORES`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VENDEDORES` (
  `id` INT NOT NULL,
  `nombres` VARCHAR(45) NULL,
  `apellidos` VARCHAR(45) NULL,
  `dni` VARCHAR(45) NULL,
  `celular` VARCHAR(45) NULL,
  `direccion` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `fecnac` DATE NULL,
  `VENDEDOREScol` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sakila`.`COMPROBANTES`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `COMPROBANTES` (
  `id` INT NOT NULL,
  `numero` VARCHAR(45) NULL,
  `fecha` DATE NULL,
  `subtotal` DOUBLE NULL,
  `igv` DOUBLE NULL,
  `total` DOUBLE NULL,
  `CLIENTES_id` INT NOT NULL,
  `VENDEDORES_id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sakila`.`DETALLE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DETALLE` (
  `id` INT NOT NULL,
  `cantidad` INT(10) NULL,
  `precio` DOUBLE NULL,
  `importe` DOUBLE NULL,
  `COMPROBANTES_id` INT NOT NULL,
  `PRODUCTOS_id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;