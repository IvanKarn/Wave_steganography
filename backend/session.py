import jwt
import settings
from fastapi import HTTPException, status
from models import User
from storage import FileStorage
from processor_controller import ProcessorController


class SessionController():

  def __init__(self):
    self.storage = FileStorage()

  def create_token(self, data: dict) -> str:
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

  def get_current_user(self, token: str):
    no_file_exception = HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Something went wrong",
    )
    try:
      payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
      
      input_file: str = payload.get("input_file")
      output_file: str = payload.get("output_file")
      method: str = payload.get("method")
      
      if input_file is None:
          raise no_file_exception
        
    except jwt.InvalidTokenError:
      raise no_file_exception

    
    user: User = User(input_file=input_file, output_file=output_file, method=method)
    if not self.storage.get_file_path(input_file):
        raise no_file_exception
    return user

  def upload_file(self, file):
    name = self.storage.save_file(file)
    user: User = User(input_file=name, output_file=None, method=None)
    return self.create_token(user)
  
  def encode(self, user: User, id: int, data, params: dict):
    no_processor_exception = HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Something went wrong",
    )
    pc = ProcessorController()
    try:
      p = pc.generate_processor(id)
    except:
      raise no_processor_exception
    path = self.storage.get_file_path(user.input_file)
    user.output_file = p.encode(path,data, **params)

  def decode(self, user: User, id: int, data, params: dict):
    no_processor_exception = HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Something went wrong",
    )
    pc = ProcessorController()
    try:
      p = pc.generate_processor(id)
    except:
      raise no_processor_exception
    path = self.storage.get_file_path(user.input_file)
    data = p.decode(path, data, **params)
    return data
  
