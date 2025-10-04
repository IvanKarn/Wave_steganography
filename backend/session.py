import jwt
import settings
from fastapi import HTTPException, status
from models import User
from storage import FileStorage
from processor.processor import Processor
from processor.lsb import lsb


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
  
  def get_methods(self):
    return {0:"lsb"}
  
  def get_method_class(self,id) -> Processor:
    d = {0: lsb}
    return d[id]
  
