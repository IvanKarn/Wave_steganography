from fastapi import APIRouter, Response, status

api_router = APIRouter(prefix="/api")

@api_router.post("/upload_file")
async def upload_file(response: Response):
  response.status_code = status.HTTP_202_ACCEPTED
  return

@api_router.post("/get_methods")
async def upload_file(response: Response):
  response.status_code = status.HTTP_200_OK
  return

@api_router.post("/encrypt")
async def upload_file(response: Response):
  response.status_code = status.HTTP_200_OK
  return

@api_router.post("/decrypt")
async def upload_file(response: Response):
  response.status_code = status.HTTP_200_OK
  return

@api_router.post("/get_spectrogramm")
async def upload_file(response: Response):
  response.status_code = status.HTTP_200_OK
  return

@api_router.post("/get_graph")
async def upload_file(response: Response):
  response.status_code = status.HTTP_200_OK
  return

@api_router.post("/download_file")
async def upload_file(response: Response):
  response.status_code = status.HTTP_200_OK
  return