def not_empty(v):
        if not v.strip():
            raise ValueError(f'empty value received')
        return v

def check_slot(v):
      if v not in range(1,4):
            raise ValueError(f'slot must be int of either: 1,2,3')
      return v