create database if not exists project_gold;

use project_gold;

create table if not exists users(
    id int primary key auto_increment not null,
    fullname varchar(100) not null,
    email varchar(100) not null unique,
    password varchar(255) not null,
    contact_no bigint unique not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table if not exists user_meta(
    meta_id int primary key auto_increment not null,
    user_id int not null,
    meta_key varchar(255) not null,
    meta_value varchar(255) not null,
    foreign key(user_id) references users(id) on delete cascade
);

create table if not exists role(
    id int primary key auto_increment not null,
    role_name varchar(255) not null,
    role_slug varchar(255) not null
);

create table if not exists gallery(
    id int primary key auto_increment not null,
    post_title varchar(255) not null,
    post_slug varchar(255) not null,
    image_url varchar(255) not null,
    stock int default 5 not null,
    description text not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table if not exists gallery_meta(
    meta_id int primary key auto_increment not null,
    gallery_id int not null,
    meta_key varchar(255) not null,
    meta_value varchar(255) not null,
    foreign key(gallery_id) references gallery(id) on delete cascade
);

create table if not exists shop(
    id int primary key auto_increment not null,
    shop_name varchar(255) not null,
    shop_reg_no varchar(100) unique not null,
    shop_contact bigint not null,
    shop_address varchar(100) not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table if not exists shop_meta(
    meta_id int primary key auto_increment not null,
    shop_id int not null,
    meta_key varchar(255) not null,
    meta_value varchar(255) not null,
    foreign key(shop_id) references shop(id) on delete cascade
);

create table if not exists shop_worker(
    id int primary key auto_increment not null,
    shop_id int not null,
    worker_id int not null,
    foreign key(shop_id) references shop(id) on delete cascade,
    foreign key(worker_id) references users(id) on delete cascade,
    createdAt timestamp default current_timestamp
);

create table if not exists feedback(
    id int primary key auto_increment not null,
    fullname varchar(100) not null,
    email varchar(100) not null,
    subject varchar(255) not null,
    message text not null,
    status varchar(32) default "pending",
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

