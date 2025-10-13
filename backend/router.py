from fastapi import APIRouter, Response, status, File, Cookie
from session import SessionController
from processor_controller import ProcessorController
from fastapi.responses import FileResponse

from models import ProcessingData
from storage import FileStorage
api_router = APIRouter(prefix="/api")


@api_router.post("/upload_file")
async def upload_file(response: Response, file_bytes: bytes = File()):
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
    return ProcessorController().id_name


@api_router.post("/encrypt")
async def encrypt(response: Response, proc: ProcessingData, session=Cookie()):
    session_c = SessionController()
    user = session_c.get_current_user(session)
    token = session_c.encode(user, proc.id, proc.data, proc.params)
    response.set_cookie(key="session", value=token)
    response.status_code = status.HTTP_200_OK
    return


@api_router.post("/decrypt")
async def decrypt(response: Response, proc: ProcessingData, session=Cookie()):
    session_c = SessionController()
    user = session_c.get_current_user(session)
    data = session_c.decode(user, proc.id, proc.params)
    response.status_code = status.HTTP_200_OK
    return {"data": str(data)}


@api_router.post("/get_spectrogramm")
async def get_spectrogramm(response: Response):
    response.status_code = status.HTTP_200_OK
    return


@api_router.post("/get_graph")
async def get_graph(response: Response):
    response.status_code = status.HTTP_200_OK
    return


@api_router.post("/download_file")
async def download_file(response: Response, session=Cookie()):
    session_c = SessionController()
    try:
        user = session_c.get_current_user(session)
        if user.output_file is None:
            raise Exception()
        response.status_code = status.HTTP_200_ACCEPTED
    except:
        pass
    return FileResponse(path=FileStorage().get_file_path(user.output_file), filename='audio.wav', media_type='audio/x-wav')
