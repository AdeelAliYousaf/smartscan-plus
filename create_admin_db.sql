-- Create a fallback database named `admin` to avoid clients attempting to connect to a non-existent DB
-- This script will run on container initialization (first time only). If the DB already exists this will error on re-run.

CREATE DATABASE admin;
