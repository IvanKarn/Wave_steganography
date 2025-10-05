from processor.processor import Processor
from scipy.io import wavfile
from storage import FileStorage
import numpy as np

class lsb(Processor):
  def __init__(self):
    super().__init__()
    self.storage = FileStorage()

  def encode(self, path, data, depth=1):
    sample_rate, samples = wavfile.read(path)
    data_bits = ''.join(format(byte, '08b') for byte in data)
    bit_depth = np.iinfo(samples.dtype).bits
    if len(data_bits) > len(samples) * depth:
      raise ValueError("Not enough depth")
    sample_idx = 0
    depth_idx = 0
    for bit in data_bits:
      if bit == '0':
        samples[sample_idx] &= ~(1<<depth_idx)
      else:
        samples[sample_idx] |= (1<<depth_idx)
      depth_idx+=1
      if depth == depth_idx:
        depth_idx = 0
        sample_idx += 1
    res = self.storage.save_audio(sample_rate, samples)
    return res
  
  def decode(self, path, depth=1):
    sample_rate, samples = wavfile.read(path)
    data_bits = ''
    bit_depth = np.iinfo(samples.dtype).bits
    if samples.ndim == 2:
      for sample in samples:
        data_bits += reversed(bin(sample[0])[-depth:])
    else:
      for sample in samples:
        data_bits += reversed(bin(sample)[-depth:])
    num = int(data_bits, 2)
    num_bytes = (len(data_bits) + 7) // 8 
    byte_array = num.to_bytes(num_bytes, byteorder='big')
    return byte_array
    