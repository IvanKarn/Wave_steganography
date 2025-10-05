from processor.processor import Processor

from processor.lsb import lsb

class ProcessorController():
  def __init__(self):
    self.processors: dict[int, (str, Processor)] = {
      0: ("lsb", lsb)
    }
    self.id_name: dict[int, str] = {i : self.processors[i][0] for i in self.processors}
    self.id_processor: dict[int, Processor] = {i : self.processors[i][1] for i in self.processors}

  def generate_processor(self, id):
    return self.id_processor[id]()