import random
import os
import json
import requests
import io
import base64
from PIL import Image
# from words import nouns
from words import nouns, verbs, adjectives

url = "http://127.0.0.1:7860"

num_iterations = 500
for j in range(num_iterations):
  payload = {
    "prompt": " ".join(random.sample(nouns, 5)),
    "negative_prompt": "nsfw, sex, porn, naked, hentai",
    "sampler_name": "UniPC",
    "batch_size": 4,
    "steps": 14
  }

  output_dir = "www/output"
  # Write generation words out to info.txt
  filename = f"{output_dir}/{j}/info.txt"
  os.makedirs(os.path.dirname(filename), exist_ok=True)
  with open(filename, "w") as f:
    f.write(payload["prompt"])

  response = requests.post(url=f"{url}/sdapi/v1/txt2img", json=payload)
  r = response.json()
  for i, img in enumerate(r["images"]):
      image = Image.open(io.BytesIO(base64.b64decode(img.split(",",1)[0])))
      image = image.resize(size=(256,256))
      image.save(f"{output_dir}/{j}/{i}.jpg", quality=80)
  print(f"Done: {j+1}/{num_iterations}")
print("All done!")
