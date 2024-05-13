import numpy as np
import cv2
from PIL import Image
from sklearn.decomposition import PCA
import io

def process_image(image_file):
    try:
        # Convert the uploaded image to an OpenCV format
        image = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)
        
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        image = image.astype(np.uint8)
        
        blue, green, red = cv2.split(image)
        
        df_blue = blue / 255
        df_green = green / 255
        df_red = red / 255
        
        pca_b = PCA(n_components=50)
        pca_b.fit(df_blue)
        trans_pca_b = pca_b.transform(df_blue)
        pca_g = PCA(n_components=50)
        pca_g.fit(df_green)
        trans_pca_g = pca_g.transform(df_green)
        pca_r = PCA(n_components=50)
        pca_r.fit(df_red)
        trans_pca_r = pca_r.transform(df_red)
        
        b_arr = pca_b.inverse_transform(trans_pca_b)
        g_arr = pca_g.inverse_transform(trans_pca_g)
        r_arr = pca_r.inverse_transform(trans_pca_r)
        
        img_reduced = cv2.merge((b_arr, g_arr, r_arr))
        
        # Convert back to RGB format (if needed)
        if img_reduced.shape[-1] == 3:  # Check if it's a 3-channel image
            img_reduced = cv2.cvtColor(img_reduced, cv2.COLOR_BGR2RGB)
        
        # Convert back to PIL format
        img_reduced_pil = Image.fromarray(img_reduced)
        
        img_io = io.BytesIO()
        img_reduced_pil.save(img_io, format='JPEG')
        img_io.seek(0)
        
        return img_io.getvalue(), None  # Return the processed image data and no error
    except Exception as e:
        return None, str(e)  # Return None for the image data and the error message as a string
