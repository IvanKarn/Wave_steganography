from fastapi import APIRouter, Response, status

api_router = APIRouter(prefix="/api")

@api_router.post("/upload_file")
async def upload_file(response: Response):
  response.status_code = status.HTTP_202_ACCEPTED
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
async def download_file(response: Response):
  response.status_code = status.HTTP_200_OK
  return