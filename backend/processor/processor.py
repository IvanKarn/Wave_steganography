from abc import ABC, abstractmethod  

class Processor(ABC):  
  @abstractmethod  
  def encode(self, path, data, **kwargs) -> str:  
    pass  
  @abstractmethod  
  def decode(self, path, data, **kwargs) -> bytes:  
    pass  

