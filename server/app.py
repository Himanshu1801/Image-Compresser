import base64
import logging
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from ImgCompression import process_image 
import io

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return "Welcome to the image processing application. Upload an image to get started."

@app.route('/process', methods=['POST'])
def process():
    if 'file' not in request.files:
        return jsonify({'error': "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': "No selected file"}), 400
    
    processed_image, error = process_image(file)
    if error:
        return jsonify({'error': error}), 500
    
    processed_image_io = io.BytesIO(processed_image)
    processed_image_io.seek(0)
    processed_image_base64 = base64.b64encode(processed_image).decode('utf-8')
    
    return jsonify({'image': processed_image_base64})

@app.route('/download', methods=['POST'])
def download():
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': "No selected file"}), 400
    
    processed_image, error = process_image(file)
    if error:
        return jsonify({'error': error}), 500
    
    processed_image_io = io.BytesIO(processed_image)
    processed_image_io.seek(0)
    
    return send_file(processed_image_io, mimetype='image/jpeg', as_attachment=True, download_name='processed_image.jpg')

@app.errorhandler(404)
def page_not_found(error):
    logger.error(f"404 Error: {error}")
    return jsonify({'error': "404 Error: Page not found"}), 404

@app.errorhandler(500)
def internal_server_error(error):
    logger.error(f"500 Error: {error}")
    return jsonify({'error': "500 Error: Internal server error"}), 500


if __name__ == '__main__':
    app.run()