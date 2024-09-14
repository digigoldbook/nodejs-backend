create database project_gold;

use project_gold;

create table users(
	id int primary key auto_increment not null,
	fullname varchar(255) not null,
	email varchar(255) not null,
	password varchar(255) not null,
	contact_no bigint not null,
	last_login timestamp not null,
	registered_date timestamp not null,
	session_key varchar(255)
);

create table user_meta(
	meta_id int primary key auto_increment not null,
	user_id int not null,
	meta_key varchar(255) not null,
	meta_value varchar(255) not null,
	foreign key(user_id) references users(id) on delete cascade
);

create table feedback(
	id int primary key auto_increment not null,
	fullname varchar(255) not null,
	email varchar(255) not null,
	subject varchar(255) not null,
	message text not null,
	status varchar(50) default "pending",
	createdAt timestamp default current_timestamp,
	updatedAt timestamp default current_timestamp on update current_timestamp
);