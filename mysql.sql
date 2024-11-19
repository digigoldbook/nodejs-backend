create database if not exists project_gold;

use project_gold;

create table if not exists users(
    id int primary key auto_increment not null,
    fullname varchar(100) not null,
    email varchar(100) not null unique,
    password varchar(255) not null,
    contact_no bigint unique not null,
    session_key varchar(255) null,
    last_login timestamp default current_timestamp,
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

CREATE TABLE user_devices (
    id SERIAL PRIMARY KEY,          
    user_id INT NOT NULL,           
    device_name VARCHAR(255),      
    ip_address VARCHAR(45) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    wrk_unique_id varchar(100) not null,
    wrk_name varchar(255) not null,
    wrk_contact bigint not null,
    wrk_address varchar(255) not null,
    wrk_department varchar(50) not null,
    wrk_opening_status varchar(50) not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table if not exists shop_worker_meta(
    meta_id int primary key auto_increment not null,
    worker_id int not null,
    meta_key varchar(255) not null,
    meta_value varchar(255) not null,
    foreign key(worker_id) references shop_worker(id) on delete cascade
);

create table if not exists shop_worker_record{
    id int primary key auto_increment not null,
    given_date DATE NOT NULL,
    end_date DATE NOT NULL,
    unique_code varchar(100) not null,
    given_net_weight decimal(5, 2) not null,
    return_product_name varchar(255) not null,
    product_weight decimal(5, 2) not null,
    wastage_weight decimal(5, 2) not null,
    given_cash decimal(6, 2) not null,
    result decimal(6, 2) not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
}

create table if not exists shop_worker_record_meta(
    meta_id int primary key auto_increment not null,
    record_id int not null,
    meta_key varchar(255) not null,
    meta_value varchar(255) not null,
    foreign key(record_id) references shop_worker_record(id) on delete cascade
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

CREATE TABLE IF NOT EXISTS gold_deposit_record (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_name varchar(255) not null,
    product_title JSON NOT NULL,
    serial_no varchar(255) not null,
    unique_code varchar(255) not null,
    customer_name varchar(50) not null,
    customer_contact bigint not null,
    bank_bone_number varchar(255) null,
    item_count int not null,
    product_amount decimal(10,3) not null,
    product_rate decimal(5,2) default 36,
    product_status varchar(16) default "running",
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    shop_id int not null,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    foreign key(shop_id) references shop(id)
);


CREATE TABLE IF NOT EXISTS gold_deposit_metadata (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    userId INT NOT NULL,
    balance_date DATE NOT NULL,
    opening_balance DECIMAL(10, 2) NOT NULL,
    closing_balance DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    UNIQUE(userId, balance_date)
);

create table cash_deposit(
	id int primary key auto_increment not null,
	customer_name varchar(32) not null,
	customer_contact bigint not null,
	amount decimal(10,2) not null,
	rate decimal(10,2) not null,
	start_date DATE NOT NULL,
    end_date DATE NOT NULL,
	shop_id int not null,
	createdAt timestamp default current_timestamp,
	updatedAt timestamp default current_timestamp on update current_timestamp,
	foreign key(shop_id) references shop(id) on delete cascade
);
