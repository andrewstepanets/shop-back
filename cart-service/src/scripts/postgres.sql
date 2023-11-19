create extension if not exists "uuid-ossp";

CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');
CREATE TYPE order_status AS ENUM ('NEW', 'PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

create table if not exists carts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id),
    created_at date NOT NULL,
    updated_at date NOT NULL,
    status cart_status NOT NULL
);

create table if not exists cart_items (
   cart_id uuid NOT NULL REFERENCES carts(id),
   product_id uuid NOT NULL,
   count integer NOT NULL,
   foreign key ("cart_id") references "carts" ("id")
   on update cascade
   on delete cascade
);

create table if not exists orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id),
    cart_id uuid NOT NULL REFERENCES carts(id),
    payment json NOT NULL,
    delivery json NOT NULL,
    comments text,
    status cart_status NOT NULL,
    total numeric NOT NULL
);

create table if not exists users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255),
     password VARCHAR(255)
);

ALTER TABLE carts
ADD FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE orders
ADD FOREIGN KEY (user_id) REFERENCES users(id);

INSERT INTO carts (id, user_id, created_at, updated_at, status)
VALUES
    ('d63c069f-9b85-40e3-9e33-6c0d14cafb72', 'c350d83e-1436-4499-9f3e-3f79c575a654', '2022-03-01', '2022-03-01', 'OPEN'),
    ('a6c497a6-43d1-4968-a963-4d7c4d4f4411', 'c350d83e-1436-4499-9f3e-3f79c575a654', '2022-03-02', '2022-03-02', 'OPEN'),
    ('7c50d85c-4b34-4ec4-afda-758fb1f7e4b2', '2c7d520e-2b95-4b14-bb97-b5b5df09b8af', '2022-03-03', '2022-03-03', 'OPEN');


INSERT INTO cart_items (cart_id, product_id, count)
VALUES
    ('d63c069f-9b85-40e3-9e33-6c0d14cafb72', '3f60a031-d208-4ef1-9cf5-f8de7d52e22e', 2),
    ('d63c069f-9b85-40e3-9e33-6c0d14cafb72', 'f050c6b1-8da9-4b46-bcf7-aa6e29d8b7a7', 1),
    ('a6c497a6-43d1-4968-a963-4d7c4d4f4411', '3f60a031-d208-4ef1-9cf5-f8de7d52e22e', 3),
    ('a6c497a6-43d1-4968-a963-4d7c4d4f4411', 'f050c6b1-8da9-4b46-bcf7-aa6e29d8b7a7', 2),
    ('7c50d85c-4b34-4ec4-afda-758fb1f7e4b2', '3f60a031-d208-4ef1-9cf5-f8de7d52e22e', 1);

INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total)
VALUES
    ('d63c069f-9b85-40e3-9e33-6c0d14cafb72', 'c350d83e-1436-4499-9f3e-3f79c575a654', 'd63c069f-9b85-40e3-9e33-6c0d14cafb72', '{"method": "credit_card", "card_number": "**** **** **** 1234", "expiration_date": "2023-12"}', '{"address": "123 Main St", "city": "Anytown", "state": "CA", "zip": "12345"}', 'Special instructions for the delivery driver.', 'ORDERED', 99.99),
    ('a6c497a6-43d1-4968-a963-4d7c4d4f4411', '2c7d520e-2b95-4b14-bb97-b5b5df09b8af', '7c50d85c-4b34-4ec4-afda-758fb1f7e4b2', '{"method": "paypal", "paypal_email": "johndoe@example.com"}', '{"address": "456 Oak St", "city": "Sometown", "state": "NY", "zip": "54321"}', NULL, 'OPEN', 49.99);

INSERT INTO users (name, email, password) VALUES
    ('John Doe', 'john.doe@example.com', 'password123'),
    ('Jane Smith', 'jane.smith@example.com', 'password456'),
    ('Bob Johnson', NULL, 'password789');

select * from carts;
select * from cart_items;
select * from orders;
select * from users;
