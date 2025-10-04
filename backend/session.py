import jwt
import settings

class Session():

  def create_token(data: dict) -> str:
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

  def get_current_user(self, token: str):
    # #заранее подготовим исключение
    # credentials_exception = HTTPException(
    #     status_code=status.HTTP_401_UNAUTHORIZED,
    #     detail="Could not validate credentials",
    #     headers={"WWW-Authenticate": "Bearer"},
    # )
    # try:
    #     # декодировка токена
    #     payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

    #     #данные из токена
    #     email: str = payload.get("email")
    #     password: str = payload.get("password")
    #     exp: str = payload.get("exp")

    #     #если в токене нет поля email
    #     if email is None:
    #         raise credentials_exception

    #     #если время жизни токена истекло
    #     if datetime.fromtimestamp(float(exp)) - datetime.now() < timedelta(0):
    #         raise credentials_exception

    # except InvalidTokenError:
    #     raise credentials_exception

    # #проверка данных
    # user: UserDTO = self.validate_user(email, password)

    # if user is None:
    #     raise credentials_exception
    # return user
    pass