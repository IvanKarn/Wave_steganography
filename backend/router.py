from fastapi import APIRouter, Response, status, File, Cookie
from session import SessionController
from fastapi.responses import FileResponse

api_router = APIRouter(prefix="/api")

@api_router.post("/upload_file")
async def upload_file(response: Response, file_bytes: bytes = File()):
  response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
  session = SessionController()
  try:
    token = session.upload_file(file_bytes)
    response.set_cookie(key="session", value=token)
    response.status_code = status.HTTP_200_ACCEPTED
  except:
    pass
  return

@api_router.get("/get_methods")
async def get_methods(response: Response):
  response.status_code = status.HTTP_200_OK
  return

@api_router.post("/encrypt")
async def encrypt(response: Response):
  response.status_code = status.HTTP_200_OK
  return

@api_router.post("/decrypt")
async def decrypt(response: Response):
  response.status_code = status.HTTP_200_OK
  return

@api_router.post("/get_spectrogramm")
async def get_spectrogramm(response: Response):
  response.status_code = status.HTTP_200_OK
  return

@api_router.post("/get_graph")
async def get_graph(response: Response):
  response.status_code = status.HTTP_200_OK
  return

@api_router.post("/download_file")
async def download_file(response: Response, session = Cookie()):
  response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
  session_c = SessionController()
  try:
    user = session_c.get_current_user(session)
    if user.output_file is None:
      raise Exception()
    response.status_code = status.HTTP_200_ACCEPTED
  except:
    pass
  return FileResponse(path='user.output_file', filename='audio.wav', media_type='audio/x-wav')