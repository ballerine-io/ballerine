CREATE INDEX idx_auth_value
ON "Customer"
((authenticationConfiguration ->> 'authValue'));
