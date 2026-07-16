-- =============================================
-- Dental Clinic Management System - FINAL VERSION
-- PostgreSQL - Fully English Schema
-- =============================================

-- =============================================
-- 1. Main Tables
-- =============================================


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(50) NOT NULL,
    role VARCHAR(30) CHECK (role IN ('admin', 'doctor', 'receptionist', 'accountant')),
    phone VARCHAR(14) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    patient_code VARCHAR(20) UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    national_id VARCHAR(20),
    blood_group VARCHAR(5),
    allergies TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE treatments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE,
    name VARCHAR(100) NOT NULL,
    name_persian VARCHAR(100),
    price NUMERIC(12,2) NOT NULL,
    duration_minutes INT,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE treatment_plans (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES users(id),
    title VARCHAR(100),
    total_amount NUMERIC(12,2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE treatment_plan_items (
    id SERIAL PRIMARY KEY,
    plan_id INT REFERENCES treatment_plans(id) ON DELETE CASCADE,
    treatment_id INT REFERENCES treatments(id),
    quantity INT DEFAULT 1,
    price NUMERIC(12,2) NOT NULL,
    discount NUMERIC(12,2) DEFAULT 0,
    notes TEXT
);

CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES users(id),
    visit_date DATE NOT NULL,
    visit_time TIME,
    reason TEXT,
    diagnosis TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(30) UNIQUE NOT NULL,
    patient_id INT REFERENCES patients(id),
    visit_id INT REFERENCES visits(id),
    total_amount NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    tax_amount NUMERIC(12,2) DEFAULT 0,
    final_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'paid')),
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'other')),
    transaction_id VARCHAR(50),
    paid_by INT REFERENCES users(id),
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    expense_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    amount NUMERIC(12,2) NOT NULL,
    paid_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visit_treatments (
    id SERIAL PRIMARY KEY,
    visit_id INT REFERENCES visits(id) ON DELETE CASCADE,
    treatment_id INT REFERENCES treatments(id),
    amount NUMERIC(12,2) NOT NULL
);

-- =============================================
-- 2. Appointment System
-- =============================================

CREATE TABLE appointment_slots (
    id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES users(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    slot_start TIME NOT NULL,
    slot_end TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    is_online_booked BOOLEAN DEFAULT false,
    UNIQUE(doctor_id, slot_date, slot_start)
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES users(id),
    slot_id INT REFERENCES appointment_slots(id),
    visit_id INT REFERENCES visits(id),
    appointment_type VARCHAR(20) DEFAULT 'in_person' CHECK (appointment_type IN ('in_person', 'online')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    booked_by INT REFERENCES users(id),
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reminder_sent BOOLEAN DEFAULT false
);

CREATE TABLE doctor_availability (
    id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT DEFAULT 20
);

-- =============================================
-- 3. Inventory System
-- =============================================

CREATE TABLE inventory_items (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_persian VARCHAR(100),
    category VARCHAR(50),
    unit VARCHAR(20) DEFAULT 'piece',
    current_stock NUMERIC(10,2) DEFAULT 0,
    min_stock_level NUMERIC(10,2) DEFAULT 10,
    purchase_price NUMERIC(12,2),
    selling_price NUMERIC(12,2),
    expiry_date DATE,
    location VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    notes TEXT
);

CREATE TABLE inventory_receipts (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES inventory_items(id),
    supplier_id INT REFERENCES suppliers(id),
    quantity NUMERIC(10,2) NOT NULL,
    unit_price NUMERIC(12,2),
    total_price NUMERIC(12,2),
    receipt_date DATE DEFAULT CURRENT_DATE,
    received_by INT REFERENCES users(id),
    invoice_number VARCHAR(50),
    expiry_date DATE,
    notes TEXT
);

CREATE TABLE inventory_usage (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES inventory_items(id),
    visit_id INT REFERENCES visits(id),
    quantity NUMERIC(10,2) NOT NULL,
    used_by INT REFERENCES users(id),
    usage_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(id),
    status VARCHAR(20) DEFAULT 'pending',
    total_amount NUMERIC(12,2),
    order_date DATE DEFAULT CURRENT_DATE,
    expected_delivery DATE,
    created_by INT REFERENCES users(id)
);

-- =============================================
-- 4. Audit Log
-- =============================================

CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(60) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(10) CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    changed_by INT REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    session_info JSONB
);

-- =============================================
-- 5. Audit Trigger Function
-- =============================================

CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_log(table_name, record_id, action, new_data, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), 
                current_setting('app.current_user_id', true)::INT);
        RETURN NEW;

    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log(table_name, record_id, action, old_data, new_data, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), 
                current_setting('app.current_user_id', true)::INT);
        RETURN NEW;

    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_log(table_name, record_id, action, old_data, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), 
                current_setting('app.current_user_id', true)::INT);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Enable audit trigger on important tables
CREATE TRIGGER patients_audit AFTER INSERT OR UPDATE OR DELETE ON patients 
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER visits_audit AFTER INSERT OR UPDATE OR DELETE ON visits 
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER appointments_audit AFTER INSERT OR UPDATE OR DELETE ON appointments 
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER invoices_audit AFTER INSERT OR UPDATE OR DELETE ON invoices 
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER inventory_items_audit AFTER INSERT OR UPDATE OR DELETE ON inventory_items 
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- =============================================
-- 6. Useful Views
-- =============================================

CREATE VIEW today_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM appointments WHERE slot_date = CURRENT_DATE) AS today_appointments,
    (SELECT COUNT(*) FROM visits WHERE visit_date = CURRENT_DATE) AS today_visits,
    (SELECT COALESCE(SUM(final_amount), 0) FROM invoices WHERE DATE(created_at) = CURRENT_DATE AND status = 'paid') AS today_revenue,
    (SELECT COUNT(*) FROM patients WHERE DATE(created_at) = CURRENT_DATE) AS new_patients_today;

CREATE VIEW inventory_status AS
SELECT 
    id, code, name, current_stock, min_stock_level,
    CASE WHEN current_stock <= min_stock_level THEN 'Low Stock ⚠️' 
         ELSE 'OK' END AS stock_status
FROM inventory_items 
WHERE is_active = true;

CREATE VIEW monthly_revenue AS
SELECT 
    DATE_TRUNC('month', created_at) AS month,
    SUM(final_amount) AS total_revenue,
    COUNT(*) AS total_invoices
FROM invoices
WHERE status = 'paid'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- =============================================
-- 7. Performance Indexes
-- =============================================

CREATE INDEX idx_appointments_date ON appointments(slot_date);
CREATE INDEX idx_visits_date ON visits(visit_date);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);