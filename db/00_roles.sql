DO $$
BEGIN 
 IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'reportes_user') THEN
    CREATE ROLE reportes_user WITH LOGIN PASSWORD '24371512@';
 END IF;
END;
$$;

GRANT CONNECT ON DATABASE reportes_db TO reportes_user;
GRANT USAGE ON SCHEMA public TO reportes_user;

