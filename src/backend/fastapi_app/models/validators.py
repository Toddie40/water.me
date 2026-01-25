def not_empty(v):
        if not v.strip():
            raise ValueError(f'empty value received')
        return v
