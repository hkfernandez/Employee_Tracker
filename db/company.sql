CREATE DATABASE company_info;
USE company_info;

CREATE TABLE employees(
  id INTEGER(6) AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INTEGER(6),
  manager_id INTEGER(6),
  PRIMARY KEY (id)
);

CREATE TABLE roles(
  id INTEGER(6) AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  salary INTEGER(100) NOT NULL,
  dept_id INTEGER(6) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE dept(
  id INTEGER(6) AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO dept (name) values ('Department 1');
INSERT INTO dept (name) values ('Department 2');
INSERT INTO dept (name) values ('Department 3');

INSERT INTO roles (title, salary, dept_id) values ('Manager', 80000, 1);
INSERT INTO roles (title, salary, dept_id) values ('Engineer', 60000, 2);
INSERT INTO roles (title, salary, dept_id) values ('Administrator', 50000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
values ('Bob', 'Smith', 1, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
values ('Sally', 'Smith', 2, 2);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
values ('Mike', 'Smith', 3, 3);
