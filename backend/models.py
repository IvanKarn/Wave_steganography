from pydantic import BaseModel

class User(BaseModel):
  input_file: str
  output_file: str
  method: int