from typing import Type
from processor.processor import Processor

from processor.lsb import Lsb


class ProcessorController():
    def __init__(self):
        self.processors: dict[int, tuple[str, Type[Processor]]] = {
            0: ("lsb", Lsb)
        }
        self.id_name: dict[int, str] = {
            i: self.processors[i][0] for i in self.processors}
        self.id_processor: dict[int, Type[Processor]] = {
            i: self.processors[i][1] for i in self.processors}

    def generate_processor(self, id) -> Processor:
        return self.id_processor[id]()
